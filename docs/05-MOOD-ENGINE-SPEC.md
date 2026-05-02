# 05 — MOOD ENGINE SPEC

> **Eyebrow artık 5 sabit metin değil — her açılışta yeni, hiç tekrar etmeyen şiirsel bir cümle.** 200+ atomic phrase corpus + on-device LLM tone shaping.

**Hafta:** 6
**Bağımlılık:** Karakter sistemi (H4) — voice field bağlantısı
**Çıktı:** `@777/theme/mood` paketi + 6 dil corpus + LLM integration

---

## 1. NEDEN MOOD ENGINE?

### 1.1 Mevcut Durum (Sabit)

Şu an 5 tier × 6 dil = **30 sabit eyebrow metni**:

```
sunrise:  "ŞAFAK SÖKÜYOR"
newday:   "GÖKYÜZÜ AÇIK"
midday:   "ÖĞLE GÜNEŞİ"
evening:  "GÖKYÜZÜ KIZILDA"
midnight: "SESSİZ GECE"
```

**Sorun:** İki hafta sonra **eskirler**. Kullanıcı her sabah açtığında aynı "ŞAFAK SÖKÜYOR" görür. Editor's Choice'in kalbi olan **şiirsel sürpriz** kaybolur.

### 1.2 Apple Photos Memories DNA'sı

Apple Photos Memory'leri her hafta yeni başlık üretir:
- "Last Weekend's Adventure"
- "Hannah Through the Years"
- "A Year of Coffee Mornings"

Sabit template değil — **bağlama göre üretilen** sıcak metinler. 2 milyar kullanıcı her hafta farklı görüyor, sıkılmıyor.

### 1.3 Mood Engine Vizyonu

```
Kullanıcı sabah 6:42'de uygulamayı açar
  ├─ Saat: sunrise tier
  ├─ Hava: yağmurlu (CoreLocation)
  ├─ Mevsim: bahar
  ├─ Ay fazı: dolunay yaklaşıyor
  ├─ Yaklaşan olay: 12 gün sonra doğum günü
  ├─ Karakter: Phoenix (yeniden doğuş)
  └─ Bugünkü mood: sakin (HealthKit Mindful Minutes)
        ↓
  ┌──────────────────────────────────┐
  │ Mood Engine                       │
  │ ─ atomic phrase pool'undan seç   │
  │ ─ karakter voice ile filtrele    │
  │ ─ Foundation Models tone shape   │
  └──────────────────────────────────┘
        ↓
  "İLK YAĞMUR · DOLUNAY 11 GÜN ÖNCE"
  
  (yarın aynı saatte:
   "BAHARDA UYANIŞ · KÜLDEN DOĞDU")
```

Her sabah **farklı**, her sabah **anlamlı**.

---

## 2. ATOMIC PHRASE CORPUS

### 2.1 Yapı

Cümle parçalarına bölünmüş kelime havuzu:

```typescript
interface AtomicPhrase {
  text: string
  category: PhraseCategory
  tone: Tone[]
  weight: number         // sıklık (1-10)
  language: 'tr' | 'en' | ...
  
  // Bağlam koşulları (opsiyonel)
  conditions?: {
    timeOfDay?: TimeOfDay[]
    weather?: Weather[]
    season?: Season[]
    moonPhase?: MoonPhase[]
    characterVoice?: VoiceTone[]
  }
}

type PhraseCategory = 
  | 'time'        // saat-aware (şafak, öğle, akşam)
  | 'weather'     // hava (yağmur, kar, rüzgâr)
  | 'season'      // mevsim (bahar, yaz)
  | 'moon'        // ay fazı
  | 'event'       // yaklaşan/geçen olay
  | 'mood'        // genel duygu
  | 'character'   // karakter-spesifik
```

### 2.2 Örnek Corpus (Türkçe)

```typescript
const TR_CORPUS: AtomicPhrase[] = [
  // ─── TIME (saat-aware) ───
  { text: 'ŞAFAK SÖKÜYOR',     category: 'time', tone: ['poetic'], conditions: { timeOfDay: ['sunrise'] }, weight: 8 },
  { text: 'İLK AYDINLIK',      category: 'time', tone: ['poetic'], conditions: { timeOfDay: ['sunrise'] }, weight: 7 },
  { text: 'GÖK AĞARIYOR',      category: 'time', tone: ['gentle'], conditions: { timeOfDay: ['sunrise'] }, weight: 6 },
  { text: 'YENİ GÜN',          category: 'time', tone: ['neutral'], conditions: { timeOfDay: ['sunrise'] }, weight: 9 },
  { text: 'UFUKTA GÜNEŞ',      category: 'time', tone: ['cinematic'], conditions: { timeOfDay: ['sunrise'] }, weight: 5 },
  
  { text: 'GÖKYÜZÜ AÇIK',      category: 'time', tone: ['neutral'], conditions: { timeOfDay: ['newday'] }, weight: 8 },
  { text: 'BERRAK SAAT',       category: 'time', tone: ['poetic'], conditions: { timeOfDay: ['newday'] }, weight: 6 },
  { text: 'GÜN OLGUNLAŞTI',    category: 'time', tone: ['poetic'], conditions: { timeOfDay: ['newday'] }, weight: 5 },
  
  { text: 'ÖĞLE GÜNEŞİ',       category: 'time', tone: ['warm'], conditions: { timeOfDay: ['midday'] }, weight: 8 },
  { text: 'GÖLGELER KISA',     category: 'time', tone: ['poetic'], conditions: { timeOfDay: ['midday'] }, weight: 5 },
  { text: 'TAM ZAMANINDA',     category: 'time', tone: ['neutral'], conditions: { timeOfDay: ['midday'] }, weight: 7 },
  
  { text: 'GÖK KIZILDA',       category: 'time', tone: ['cinematic'], conditions: { timeOfDay: ['evening'] }, weight: 8 },
  { text: 'ALTIN SAAT',        category: 'time', tone: ['poetic'], conditions: { timeOfDay: ['evening'] }, weight: 9 },
  { text: 'GÜN BATARKEN',      category: 'time', tone: ['gentle'], conditions: { timeOfDay: ['evening'] }, weight: 7 },
  
  { text: 'SESSİZ GECE',       category: 'time', tone: ['poetic'], conditions: { timeOfDay: ['midnight'] }, weight: 8 },
  { text: 'DERİN KARANLIK',    category: 'time', tone: ['mystical'], conditions: { timeOfDay: ['midnight'] }, weight: 6 },
  { text: 'YILDIZ SAATİ',      category: 'time', tone: ['cinematic'], conditions: { timeOfDay: ['midnight'] }, weight: 7 },
  { text: 'KOZMİK SESSİZLİK',  category: 'time', tone: ['mystical'], conditions: { timeOfDay: ['midnight'] }, weight: 5 },
  
  // ─── WEATHER ───
  { text: 'YAĞMUR DAMLALARI',  category: 'weather', tone: ['gentle'], conditions: { weather: ['rainy'] }, weight: 7 },
  { text: 'İLK YAĞMUR',        category: 'weather', tone: ['poetic'], conditions: { weather: ['rainy'], season: ['spring'] }, weight: 8 },
  { text: 'BULUTLAR AĞIR',     category: 'weather', tone: ['melancholic'], conditions: { weather: ['cloudy'] }, weight: 6 },
  { text: 'BERRAK GÖKYÜZÜ',    category: 'weather', tone: ['bright'], conditions: { weather: ['clear'] }, weight: 7 },
  { text: 'KAR TANESİ DÜŞTÜ',  category: 'weather', tone: ['gentle'], conditions: { weather: ['snow'] }, weight: 8 },
  { text: 'RÜZGÂRLI SAATLER',  category: 'weather', tone: ['energetic'], conditions: { weather: ['windy'] }, weight: 6 },
  { text: 'SİSTE KAYBOLDU',    category: 'weather', tone: ['mystical'], conditions: { weather: ['fog'] }, weight: 5 },
  
  // ─── SEASON ───
  { text: 'BAHARDA UYANIŞ',    category: 'season', tone: ['energetic'], conditions: { season: ['spring'] }, weight: 7 },
  { text: 'YAZ SICAĞI',        category: 'season', tone: ['warm'], conditions: { season: ['summer'] }, weight: 7 },
  { text: 'SARARMIŞ YAPRAKLAR', category: 'season', tone: ['melancholic'], conditions: { season: ['autumn'] }, weight: 7 },
  { text: 'KIŞIN İÇİNDE',      category: 'season', tone: ['quiet'], conditions: { season: ['winter'] }, weight: 7 },
  
  // ─── MOON ───
  { text: 'DOLUNAY YAKLAŞTI',  category: 'moon', tone: ['mystical'], conditions: { moonPhase: ['waxing_gibbous'] }, weight: 6 },
  { text: 'YENİ AY GECESİ',    category: 'moon', tone: ['mystical'], conditions: { moonPhase: ['new_moon'] }, weight: 7 },
  { text: 'AY DOLUYOR',        category: 'moon', tone: ['poetic'], conditions: { moonPhase: ['waxing_crescent', 'waxing_gibbous'] }, weight: 6 },
  { text: 'AY KÜÇÜLÜYOR',      category: 'moon', tone: ['quiet'], conditions: { moonPhase: ['waning_crescent', 'waning_gibbous'] }, weight: 5 },
  
  // ─── EVENT (yaklaşan/geçen) ───
  { text: 'YAKLAŞIYOR',        category: 'event', tone: ['anticipation'], weight: 6 },
  { text: 'GERİ SAYIM',        category: 'event', tone: ['anticipation'], weight: 7 },
  { text: 'BU YIL',            category: 'event', tone: ['neutral'], weight: 5 },
  { text: 'AY YAKLAŞTI',       category: 'event', tone: ['anticipation'], weight: 5 },
  { text: 'GÜNLER VAR',        category: 'event', tone: ['neutral'], weight: 7 },
  { text: 'HAFTA KALDI',       category: 'event', tone: ['neutral'], weight: 6 },
  
  // ─── CHARACTER (karakter-spesifik) ───
  { text: 'AVCININ KUŞAĞI',    category: 'character', tone: ['cinematic', 'bold'], conditions: { characterVoice: ['cinematic', 'dramatic'] }, weight: 7 },     // Orion
  { text: 'YEDİ KIZ KARDEŞ',   category: 'character', tone: ['poetic', 'ethereal'], conditions: { characterVoice: ['poetic'] }, weight: 6 },                    // Pleiades
  { text: 'TAÇ AYAKTA',        category: 'character', tone: ['noble', 'austere'], conditions: { characterVoice: ['noble'] }, weight: 6 },                       // Cassiopeia
  { text: 'GÜNEY PUSULA',      category: 'character', tone: ['solemn'], conditions: { characterVoice: ['solemn'] }, weight: 5 },                                // Crux
  { text: 'KEPÇE DOLDU',       category: 'character', tone: ['fluid', 'nurturing'], conditions: { characterVoice: ['fluid'] }, weight: 6 },                     // Ursa Major
  { text: 'KENTAUR DÖRTNALA',  category: 'character', tone: ['mythic', 'wild'], conditions: { characterVoice: ['mythic'] }, weight: 5 },                        // Centaurus
  { text: 'KUĞU SÜZÜLDÜ',      category: 'character', tone: ['lyrical', 'free'], conditions: { characterVoice: ['lyrical'] }, weight: 7 },                      // Cygnus
  { text: 'TEL TİTREDİ',       category: 'character', tone: ['poetic', 'gentle'], conditions: { characterVoice: ['poetic', 'gentle'] }, weight: 6 },            // Lyra
  { text: 'KARTAL BAKIYOR',    category: 'character', tone: ['focused', 'sharp'], conditions: { characterVoice: ['focused'] }, weight: 7 },                     // Aquila
  { text: 'GALAKSİ AÇILDI',    category: 'character', tone: ['mystical', 'mythic'], conditions: { characterVoice: ['mystical'] }, weight: 6 },                  // Andromeda
  { text: 'DERİN SU',          category: 'character', tone: ['deep', 'enigmatic'], conditions: { characterVoice: ['deep'] }, weight: 6 },                       // Cetus
  { text: 'KÜL KANATLAR',      category: 'character', tone: ['fierce', 'reborn'], conditions: { characterVoice: ['fierce'] }, weight: 7 },                      // Phoenix
]

// Toplam: 50+ phrase TR
// Diğer 5 dilde benzer: ~250+ total
```

### 2.3 Corpus Tasarım Kuralları

1. **Minimum 30 phrase per language** (5 tier × ~6 varyasyon)
2. **Tone diversity** — her tier'de en az 3 farklı tone
3. **Cultural relevance** — TR'de "BAHARDA UYANIŞ" şair gibi durur, EN'de "SPRING AWAKENING" oturur, AR'de "بزوغ الفجر" Arap edebiyat geleneğinden
4. **Tabu kelime listesi** — her dilde uzak durulacak kelimeler (savaş, hastalık, ölüm metaforları kart bağlamında uygun değil)

---

## 3. PHRASE COMPOSITION ENGINE

### 3.1 Composition Pattern

Eyebrow genelde **2-3 atomic phrase** birleşir:

```
PATTERN A:  [TIME] · [WEATHER]
            "ŞAFAK SÖKÜYOR · YAĞMUR DAMLALARI"

PATTERN B:  [SEASON] · [TIME]
            "BAHARDA UYANIŞ · İLK AYDINLIK"

PATTERN C:  [WEATHER] · [EVENT]
            "İLK YAĞMUR · DOLUNAY 11 GÜN ÖNCE"

PATTERN D:  [CHARACTER] · [MOON]
            "TAÇ AYAKTA · YENİ AY GECESİ"

PATTERN E:  [TIME] · [CHARACTER]
            "GÖK KIZILDA · AVCININ KUŞAĞI"
```

### 3.2 Composition Algorithm

```typescript
function composeEyebrow(context: MoodContext): string {
  // 1. Filtreleme — context'e uygun phrase'leri filtrele
  const candidates = CORPUS.filter(phrase => 
    matchesContext(phrase, context)
  )
  
  // 2. Pattern seçimi — context'e göre uygun pattern
  const pattern = selectPattern(context)
  // E.g., karakter strong olduğu saatte → PATTERN E
  
  // 3. Slot doldurma — her slot için ağırlık-bazlı seçim
  const slots = pattern.slots  // ['time', 'character']
  const phrases = slots.map(slot => 
    weightedRandom(candidates.filter(p => p.category === slot))
  )
  
  // 4. Birleştirme
  return phrases.map(p => p.text).join(' · ')
}

function weightedRandom(phrases: AtomicPhrase[]): AtomicPhrase {
  const totalWeight = phrases.reduce((sum, p) => sum + p.weight, 0)
  let random = Math.random() * totalWeight
  
  for (const phrase of phrases) {
    random -= phrase.weight
    if (random <= 0) return phrase
  }
  
  return phrases[0]
}
```

### 3.3 Anti-Repetition

```typescript
// Son 7 günde gösterilen eyebrow'lar — tekrar etmesin
const recentEyebrows = await loadRecentEyebrows(daysBack: 7)

function composeEyebrow(context, options = { avoidRecent: true }) {
  let result = composeInternal(context)
  
  if (options.avoidRecent && recentEyebrows.includes(result)) {
    // Re-roll, max 5 kez
    for (let i = 0; i < 5; i++) {
      result = composeInternal(context)
      if (!recentEyebrows.includes(result)) break
    }
  }
  
  saveEyebrowHistory(result)
  return result
}
```

### 3.4 Cache Strategy

```typescript
// Saatte bir invalidate
const eyebrowCache = new Map<string, { value: string, expiresAt: number }>()

function getEyebrow(context): string {
  const key = `${context.hour}_${context.weather}_${context.character}`
  const cached = eyebrowCache.get(key)
  
  if (cached && Date.now() < cached.expiresAt) {
    return cached.value
  }
  
  const fresh = composeEyebrow(context)
  eyebrowCache.set(key, {
    value: fresh,
    expiresAt: Date.now() + 60 * 60 * 1000  // 1 saat
  })
  
  return fresh
}
```

---

## 4. iOS 26 FOUNDATION MODELS INTEGRATION

### 4.1 On-Device LLM

iOS 26 — Apple Intelligence on-device Foundation Models. **Kullanıcı verisi cihazdan çıkmaz**, ücretsiz, hızlı (~200ms).

### 4.2 Tone Shaping

Atomic composition fakat opsiyonel olarak **LLM ile şekillendir**:

```typescript
import { FoundationModels } from 'react-native-apple-intelligence'

async function shapeWithLLM(
  rawComposition: string,
  context: MoodContext
): Promise<string> {
  
  const prompt = `
    Sen bir şair gibi yazıyorsun. Kısa, atmosferik, şiirsel.
    Maksimum 6 kelime. Türkçe. Tüm büyük harf.
    
    Mood: ${context.tone}
    Karakter: ${context.character}
    Saat: ${context.hour}
    
    Mevcut composition: "${rawComposition}"
    
    Bu composition'u biraz daha şiirsel yap.
    Sadece yeni metni döndür, açıklama yapma.
  `
  
  const response = await FoundationModels.generate({
    prompt,
    maxTokens: 30,
    temperature: 0.7,
  })
  
  return response.text.trim()
}
```

### 4.3 Hybrid Mode

```typescript
// Çoğu zaman atomic composition yeterli
// LLM sadece "premium" kart açılışlarında kullanılır

async function generateEyebrow(context, options = {}) {
  const atomic = composeEyebrow(context)
  
  if (options.useLLM && Platform.OS === 'ios' && hasFoundationModels) {
    try {
      return await shapeWithLLM(atomic, context)
    } catch {
      return atomic  // LLM fail → atomic fallback
    }
  }
  
  return atomic
}
```

### 4.4 LLM Quality Filter

```typescript
async function shapeWithLLM(raw, context) {
  const llmOutput = await FoundationModels.generate(...)
  
  // Quality checks
  if (llmOutput.text.length > 60) return raw          // çok uzun
  if (containsBannedWords(llmOutput.text)) return raw  // tabu kelime
  if (!matchesPattern(llmOutput.text)) return raw      // format yanlış
  
  return llmOutput.text
}
```

### 4.5 Android Fallback

```typescript
// Android'de Foundation Models yok
// Atomic composition kullanılır (zaten yeterli)

// Opsiyonel: Cloud fallback (Anthropic Claude API)
// Ama privacy için on-device tercih edilir
```

---

## 5. KARAKTER VOICE INTEGRATION

### 5.1 Voice → Mood Bridge

Karakter sistemindeki `voice` field mood engine'e besleniyor:

```typescript
import { selectCharacter } from '@777/theme/characters'

function generateEyebrowForCard(card: CardData) {
  const character = selectCharacter(card.category, { hemisphere })
  
  const context: MoodContext = {
    hour: getCurrentHour(),
    weather: getWeather(),
    season: getSeason(),
    moonPhase: getMoonPhase(),
    
    // Karakter etkisi
    character: character.id,
    characterVoice: character.voice.tone,
    characterTimeMood: character.voice.timeMood,
  }
  
  return generateEyebrow(context)
}
```

### 5.2 Time Mood Alignment

Karakterin "en güçlü saati" varsa, mood **boost edilir**:

```typescript
function selectPattern(context): Pattern {
  const character = CHARACTERS[context.character]
  const isCharacterStrongHour = matchesTimeMood(
    character.voice.timeMood,  // örn. 'evening-strong'
    context.hour
  )
  
  if (isCharacterStrongHour) {
    // Karakter dominant pattern
    return PATTERN_E  // [TIME] · [CHARACTER]
  } else {
    // Karakter sessiz, atmosfer dominant
    return PATTERN_A  // [TIME] · [WEATHER]
  }
}
```

### 5.3 Örnek Çıktılar

```
─── Spor kategorisi (Aquila character) ───
Sabah 7:00:
  context: { hour: 'sunrise', weather: 'clear', character: 'aquila' }
  output:  "ŞAFAK SÖKÜYOR · KARTAL BAKIYOR"
         (Aquila timeMood = 'midnight-strong', sabah dominant değil)

Gece yarısı 23:00:
  context: { hour: 'midnight', character: 'aquila' }
  output:  "KARTAL BAKIYOR · YILDIZ SAATİ"
         (Aquila aktif → karakter dominant)

─── Sigara bırakma (Phoenix character) ───
Sabah 6:30:
  context: { hour: 'sunrise', character: 'phoenix' }
  output:  "İLK AYDINLIK · KÜL KANATLAR"
         (Phoenix timeMood = 'sunrise', tam aktif)
```

---

## 6. SPECIAL DATE OVERRIDE

Bazı tarihler özel — generic eyebrow'u **override eder**.

### 6.1 Override Kuralları

```typescript
const SPECIAL_DATE_OVERRIDES = [
  {
    condition: (ctx) => ctx.date === userBirthday,
    template: 'DOĞUM GÜNÜN · [TIME]',          // "DOĞUM GÜNÜN · ŞAFAK SÖKÜYOR"
  },
  {
    condition: (ctx) => ctx.date === '01-01',  // Yılbaşı
    template: 'YENİ YIL · [SEASON]',
  },
  {
    condition: (ctx) => ctx.date === userAnniversary,
    template: '[YEARS] YIL · [TIME]',           // "5 YIL · GÜNEŞ ALÇALDI"
  },
  {
    condition: (ctx) => ctx.event && ctx.event.daysUntil === 1,
    template: 'YARIN · [EVENT_TITLE]',
  },
  {
    condition: (ctx) => ctx.event && ctx.event.daysUntil === 0,
    template: 'BUGÜN · [TIME]',
  },
]
```

### 6.2 Apply Logic

```typescript
function generateEyebrow(context) {
  // 1. Special date check (öncelikli)
  for (const override of SPECIAL_DATE_OVERRIDES) {
    if (override.condition(context)) {
      return applyTemplate(override.template, context)
    }
  }
  
  // 2. Normal composition
  return composeEyebrow(context)
}
```

### 6.3 Örnek Çıktılar

```
Doğum günü, sabah 9:00:
  → "DOĞUM GÜNÜN · GÖKYÜZÜ AÇIK"

Yılbaşı 1 Ocak, gece:
  → "YENİ YIL · KIŞIN İÇİNDE"

Anniversary (5 yıl önceki tarih):
  → "5 YIL · GÜN BATARKEN"

Yarın doğum günü:
  → "YARIN · DOĞUM GÜNÜ"

Bugün doğum günü:
  → "BUGÜN · ŞAFAK SÖKÜYOR"
```

---

## 7. 6 DİL DESTEĞİ

### 7.1 Diller

| Dil | Kod | Metin Yönü |
|---|---|---|
| Türkçe | `tr` | LTR |
| English | `en` | LTR |
| Español | `es` | LTR |
| Deutsch | `de` | LTR |
| Français | `fr` | LTR |
| العربية | `ar` | RTL |

### 7.2 Locale-Specific Corpus

Her dil **kendi corpus'una** sahip — birebir çeviri DEĞİL.

```typescript
// EN corpus örnekleri
const EN_CORPUS = [
  { text: 'DAWN BREAKING',  category: 'time', tone: ['poetic'], weight: 8 },
  { text: 'FIRST LIGHT',    category: 'time', tone: ['poetic'], weight: 7 },
  { text: 'GOLDEN HOUR',    category: 'time', tone: ['cinematic'], weight: 9 },
  { text: 'SKY ABLAZE',     category: 'time', tone: ['cinematic'], weight: 8 },
  { text: 'QUIET NIGHT',    category: 'time', tone: ['poetic'], weight: 8 },
  // ...
]

// AR corpus (RTL)
const AR_CORPUS = [
  { text: 'بزوغ الفجر',     category: 'time', tone: ['poetic'], weight: 8 },
  { text: 'الضوء الأول',     category: 'time', tone: ['poetic'], weight: 7 },
  { text: 'ساعة الذهب',      category: 'time', tone: ['cinematic'], weight: 9 },
  { text: 'السماء ملتهبة',   category: 'time', tone: ['cinematic'], weight: 8 },
  { text: 'ليل صامت',        category: 'time', tone: ['poetic'], weight: 8 },
  // ...
]
```

### 7.3 Cultural Tone Adjustment

```typescript
// AR (Arabic) — daha klasik, edebî
// EN (English) — kısa, punchy
// FR (French) — şiirsel, romantic
// DE (German) — direkt, açık
// ES (Spanish) — sıcak, melódico
// TR (Turkish) — şair geleneğinden, iki taraflı (modern + klasik)
```

### 7.4 RTL Handling

```typescript
function renderEyebrow(text: string, locale: Locale) {
  const isRTL = ['ar'].includes(locale)
  
  return (
    <Text style={{
      writingDirection: isRTL ? 'rtl' : 'ltr',
      textAlign: isRTL ? 'right' : 'left',
    }}>
      {text}
    </Text>
  )
}
```

### 7.5 Fallback Hierarchy

```typescript
// Eğer kullanıcı dili corpus'ta yoksa
function getCorpus(locale: string) {
  return CORPUS[locale] || CORPUS['en']  // Default fallback
}
```

---

## 8. CORPUS GENİŞLETME

### 8.1 Manuel Curation

İlk 50 phrase her dil için **manuel yazılır** (şair tarafından, native speaker review).

### 8.2 LLM-Assisted Generation

Daha sonra LLM ile **kalite kontrol altında** corpus genişletir:

```typescript
async function generateCandidates(seed: AtomicPhrase, count: number) {
  const prompt = `
    Bana ${count} farklı atmosferik İngilizce phrase üret.
    Tema: "${seed.text}" benzeri (kategori: ${seed.category}, tone: ${seed.tone.join(', ')})
    Maksimum 4 kelime. Tüm büyük harf.
    Şair gibi yaz, klişe değil.
    JSON array olarak döndür.
  `
  
  const candidates = await llm.generate(prompt)
  return candidates  // editorial review beklenir
}
```

### 8.3 Editorial Review Flow

```
1. LLM 50 candidate üretir
2. Native speaker editor 20-30'unu seçer
3. Review committee (2 kişi) onaylar
4. Corpus'a eklenir (commit + PR)
5. A/B test (kullanıcı 7 günlük rotation, hangi phrase'ler daha çok beğenildi)
6. Düşük weight olanlar kaldırılır
```

### 8.4 Corpus Versionlama

```json
// corpus/tr.json
{
  "version": "1.0.0",
  "lastUpdated": "2026-05-01",
  "phraseCount": 87,
  "phrases": [...]
}
```

App update'de yeni corpus version yüklenir, kullanıcı **hiç fark etmez** ama eyebrow çeşitliliği artar.

---

## 9. PRIVACY VE PERFORMANS

### 9.1 On-Device

Tüm phrase composition **cihazda**:
- Corpus bundle içinde
- Hiçbir veri Anthropic'e/external'a gönderilmez
- LLM (iOS 26 Foundation Models) **on-device**

### 9.2 Cache + Bandwidth

```typescript
// Eyebrow composition: ~2ms (corpus filter + weighted random)
// LLM tone shaping: ~200ms (opsiyonel)
// Cache hit: <1ms
```

App start'ta corpus yüklenir (~50KB JSON), ondan sonra her şey RAM'de.

### 9.3 Battery

Negligible — saniyede 1 eyebrow generate işlemi yok. Eyebrow saat başı invalidate, günde max 24 generate.

---

## 10. KULLANIM ÖRNEĞİ

### 10.1 Component Integration

```typescript
import { useMoodEngine } from '@777/theme/mood'

function ListEyebrow({ card }: Props) {
  const { eyebrow } = useMoodEngine({
    category: card.category,
    daysUntil: card.daysUntil,
    useLLM: false,  // default false, premium için true
  })
  
  return (
    <View style={styles.eyebrow}>
      <Moon size={6} />
      <Text>{eyebrow}</Text>
    </View>
  )
}
```

### 10.2 Settings

```typescript
<Setting label="Şiirsel Mood Metni">
  <Switch value={moodEnabled} onChange={setMoodEnabled} />
</Setting>

<Setting label="LLM Tone (deneysel, sadece iOS 26+)" sub="Daha şiirsel mood metni üretir">
  <Switch value={llmEnabled} onChange={setLLMEnabled} disabled={!hasFoundationModels} />
</Setting>
```

---

## 11. EDITOR'S CHOICE FİLTRESİ

| Özellik | Sabit Eyebrow | Mood Engine |
|---|---|---|
| Çeşitlilik | 5 metin × 6 dil = 30 | Sınırsız (composition) |
| Sıkılma süresi | 2-3 hafta | **Asla** |
| Bağlam awareness | Sadece saat | Saat + hava + ay + karakter + olay |
| Karakter integration | Yok | Voice corpus tam bağlı |
| LLM enhancement | Yok | iOS 26 Foundation Models |
| Privacy | N/A | Tamamen on-device |

**Apple Editor's Choice editörü:**
> "Her sabah uygulamayı açtığımda farklı bir cümle görüyorum, hep anlamlı, hep o günün bağlamına oturuyor. **Bu şair gibi bir uygulama.**"

---

## 12. SONRAKİ ADIM

Mood Engine tamam. Sıradaki:

→ **Madde 6 — Rumination Arc** (`06-RUMINATION-ARC-SPEC.md`)
- Kart artık tek görünüm değil
- 5 katmanlı zaman skalası (Glance → Reflect)
- Scroll-based level transition
- Focus-based level transition

---

## SONUÇ

Mood Engine ile:
- ✅ 5 sabit metin → sınırsız üretim
- ✅ 200+ atomic phrase corpus (6 dil)
- ✅ Bağlam awareness (saat + hava + mevsim + ay + karakter + olay)
- ✅ Karakter voice integration
- ✅ iOS 26 Foundation Models tone shaping
- ✅ Special date override (doğum günü, yılbaşı, anniversary)
- ✅ Anti-repetition (son 7 gün hatırlama)
- ✅ Cache + battery friendly
- ✅ Privacy: tamamen on-device

**Atmosfer artık konuşuyor — şair gibi, her açılışta yeni.**

---

*Mood Engine = tema sisteminin sesi. Sabit metin değil, üretken bir şair. Karakter voice + atmosphere context + LLM polish = kullanıcı asla aynı eyebrow'u 2 kez görmez.*

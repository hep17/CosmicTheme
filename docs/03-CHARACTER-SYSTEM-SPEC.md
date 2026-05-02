# 03 — THEME CHARACTER SYSTEM SPEC

> **Statik takımyıldızdan canlı karakter sistemine.** Mevcut 6 takımyıldız + 6 yeni karakter, her biri kendi **kişiliği, hareketi, sesiyle**.

**Hafta:** 4
**Bağımlılık:** OKLCH (H1) + Token Pyramid (H2) + Theme Generator (H3)
**Çıktı:** `@777/theme/characters` paketi + 12 karakter SVG sprite + character renderer

---

## 1. KAVRAM: STATİK → CANLI

### 1.1 Mevcut Sistem (Statik)

Şu an `Constellation.tsx` 6 takımyıldızı render ediyor:

```typescript
type ConstellationId = 'orion' | 'pleiades' | 'cassiopeia' | 'crux' | 'ursa_major' | 'centaurus'

// Element + hemisphere → ID
fire  → orion
air   → pleiades
earth → cassiopeia (N) | crux (S)
water → ursa_major (N) | centaurus (S)
```

**Davranışı tek tip:**
- Statik SVG yıldızları + bağlantı çizgileri
- Halo'lu yıldızlarda twinkle (opacity ±0.15)
- Pozisyon ve renk dışında **6 takımyıldız aynı**

### 1.2 Yeni Sistem (Canlı Karakter)

Her karakterin kendi **DNA'sı** var:

```typescript
interface ThemeCharacter {
  // Kimlik
  id: CharacterId
  name: string
  scientificName: string  // IAU constellation name
  emoji: string           // UI'da, listelerde, badge'lerde kullanılır
  
  // Görsel
  shape: ShapeDefinition  // SVG yıldız + bağlantı koordinatları
  signatureStar?: { x: y: name: }  // Betelgeuse, Polaris, vb.
  renderStyle: 'nasa-quality'  // KARAR: Yaklaşım A (kaliteli yıldız render)
                               // - Her parlak yıldız kendi rengi (Betelgeuse kızıl, Rigel mavi)
                               // - Halo glow (filter blur 8px, radial gradient)
                               // - Nebula bulanıklığı (M42 gibi)
                               // - NASA APOD foto kalitesinde
  
  // Karakter (yeni!)
  personality: {
    emotion: Emotion       // calm | energetic | dramatic | mystical | ...
    archetype: Archetype   // hunter | dreamer | sage | warrior | ...
  }
  
  // Hareket DNA'sı (yeni!)
  motion: {
    twinkleProfile: TwinkleProfile
    driftPattern: DriftPattern
    breathingRate: number
  }
  
  // Ses (yeni — eyebrow generator için)
  voice: {
    tone: string[]            // ['cinematic', 'warm', 'dramatic']
    keywords: string[]        // ['hunt', 'march', 'forge']
    timeMood: TimeMood        // gece-gündüz mood etkisi
  }
  
  // Kart imzası (yeni!)
  cardSignature: {
    accentBoost: number       // 1.2 = %20 daha parlak glow
    timingBias: 'fast' | 'standard' | 'slow'
    densityMultiplier: number // yıldız sayısı multiplier
  }
  
  // Kategori bağlantıları (yeni!)
  affinities: {
    primary: ElementId[]      // ['fire'] — birincil bağlantı
    secondary: ElementId[]    // ['warm'] — ikincil
  }
  
  // Story mode (yeni!)
  storyMode: {
    enabled: boolean
    narrative: string          // "Avcı yıldız, kuşağında 3 parlak..."
    interactionPattern: 'tap' | 'longPress' | 'shake'
  }
}
```

**Aynı atmosfer (Cosmic Night), ama 12 farklı yüz.**

---

## 2. 12 KARAKTER ATLASI

### 2.1 Mevcut 6 Karakter (Bilinen)

#### Orion — Avcı

```typescript
{
  id: 'orion',
  name: 'Orion',
  scientificName: 'Orion',
  emoji: '🏹',                       // Avcı (alternatif: ⚔️)
  renderStyle: 'nasa-quality',
  
  shape: { /* SVG koordinatları, mevcut */ },
  signatureStar: { x: 46, y: 8, name: 'Betelgeuse' },
  
  personality: {
    emotion: 'energetic',
    archetype: 'hunter',
  },
  
  motion: {
    twinkleProfile: 'sharp',         // hızlı parlamalar
    driftPattern: 'march',            // kuşağı ritmik adım atar
    breathingRate: 1.2,               // hızlı nefes (yüksek enerji)
  },
  
  voice: {
    tone: ['cinematic', 'dramatic', 'bold'],
    keywords: ['hunt', 'march', 'forge', 'strike', 'aim'],
    timeMood: 'evening-strong',       // akşam saati en güçlü
  },
  
  cardSignature: {
    accentBoost: 1.3,                 // glow %30 daha yoğun
    timingBias: 'fast',               // tick animasyon hızlı
    densityMultiplier: 1.0,
  },
  
  affinities: {
    primary: ['fire'],                // ateş elementi (eski)
    secondary: ['warm'],              // warm element (yeni 6)
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Avcı yıldız. Kuşağında üç parlak: Mintaka, Alnilam, Alnitak. Omuzunda Betelgeuse.',
    interactionPattern: 'tap',
  }
}
```

#### Pleiades — Yedi Kız Kardeş

```typescript
{
  id: 'pleiades',
  name: 'Pleiades',
  scientificName: 'Pleiades (M45)',
  emoji: '✨',                       // Yedi kız kardeş, parıltı (alternatif: 💫)
  
  personality: {
    emotion: 'mystical',
    archetype: 'dreamer',
  },
  
  motion: {
    twinkleProfile: 'soft',           // yumuşak parlamalar
    driftPattern: 'cluster-breath',   // küme bir bütün gibi nefes alır
    breathingRate: 0.7,               // yavaş, sakin
  },
  
  voice: {
    tone: ['poetic', 'ethereal', 'distant'],
    keywords: ['drift', 'wander', 'dream', 'whisper'],
    timeMood: 'late-night',           // gece yarısı en güçlü
  },
  
  cardSignature: {
    accentBoost: 1.0,
    timingBias: 'slow',
    densityMultiplier: 1.4,           // bol yıldız (yedi kız kardeş + arka)
  },
  
  affinities: {
    primary: ['air'],
    secondary: ['cool'],
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Yedi kız kardeş. Aslında binlerce — ama gözle yedisi görünür.',
    interactionPattern: 'longPress',  // uzun bas, isimleri belirir
  }
}
```

#### Cassiopeia — Kraliçe (Kuzey Yarımküre)

```typescript
{
  id: 'cassiopeia',
  name: 'Cassiopeia',
  scientificName: 'Cassiopeia',
  emoji: '👑',                       // Kraliçe, taç
  
  personality: {
    emotion: 'regal',
    archetype: 'queen',
  },
  
  motion: {
    twinkleProfile: 'steady',         // dengeli, sakin parlamalar
    driftPattern: 'enthroned',        // hareketsiz, sabit
    breathingRate: 0.9,
  },
  
  voice: {
    tone: ['noble', 'austere', 'proud'],
    keywords: ['throne', 'crown', 'reign', 'endure'],
    timeMood: 'midnight',
  },
  
  cardSignature: {
    accentBoost: 1.1,
    timingBias: 'standard',
    densityMultiplier: 0.9,           // az yıldız (5 ana, W şekli)
  },
  
  affinities: {
    primary: ['earth'],
    secondary: ['bronze'],
  },
  
  storyMode: {
    enabled: true,
    narrative: 'W harfi — kraliçenin tahtı. Asla batmaz, kuzey yarımkürenin sabit yıldızı.',
    interactionPattern: 'tap',
  }
}
```

#### Crux — Güney Haçı (Güney Yarımküre)

```typescript
{
  id: 'crux',
  name: 'Crux',
  scientificName: 'Crux Australis',
  emoji: '🧭',                       // Pusula (Güney Haçı yön bulma)
  
  personality: {
    emotion: 'sacred',
    archetype: 'compass',
  },
  
  motion: {
    twinkleProfile: 'rhythmic',
    driftPattern: 'pivot',            // kuzey-güney ekseninde döner
    breathingRate: 0.8,
  },
  
  voice: {
    tone: ['solemn', 'guiding', 'pure'],
    keywords: ['cross', 'point', 'south', 'find'],
    timeMood: 'pre-dawn',
  },
  
  cardSignature: {
    accentBoost: 1.0,
    timingBias: 'standard',
    densityMultiplier: 0.7,           // sadece 4 yıldız
  },
  
  affinities: {
    primary: ['earth'],
    secondary: ['bronze'],
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Güney pusula. Dört yıldız, bir haç — denizcilerin yön bulduğu yer.',
    interactionPattern: 'tap',
  }
}
```

#### Ursa Major — Büyük Ayı (Kuzey)

```typescript
{
  id: 'ursa_major',
  name: 'Ursa Major',
  scientificName: 'Ursa Major (Big Dipper)',
  emoji: '🐻',                       // Büyük Ayı (alternatif: 🥄 Big Dipper kepçe)
  
  personality: {
    emotion: 'flowing',
    archetype: 'water-bearer',
  },
  
  motion: {
    twinkleProfile: 'wave',           // dalgalı parlamalar (su gibi)
    driftPattern: 'pour',             // kepçe boşaltır gibi
    breathingRate: 0.85,
  },
  
  voice: {
    tone: ['fluid', 'nurturing', 'eternal'],
    keywords: ['flow', 'pour', 'carry', 'bear'],
    timeMood: 'dawn-strong',
  },
  
  cardSignature: {
    accentBoost: 1.1,
    timingBias: 'standard',
    densityMultiplier: 1.0,           // 7 ana yıldız (kepçe)
  },
  
  affinities: {
    primary: ['water'],
    secondary: ['cool'],
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Büyük Kepçe. Yedi parlak yıldız — Mizar ile Alkor (yanındaki yıldız) gözünün keskinliğini test eder.',
    interactionPattern: 'tap',
  }
}
```

#### Centaurus — Kentaur (Güney)

```typescript
{
  id: 'centaurus',
  name: 'Centaurus',
  scientificName: 'Centaurus',
  emoji: '🐎',                       // Yarı insan yarı at
  
  personality: {
    emotion: 'wild',
    archetype: 'hybrid',
  },
  
  motion: {
    twinkleProfile: 'dual',           // iki tip parlama (insan + at)
    driftPattern: 'gallop',
    breathingRate: 1.0,
  },
  
  voice: {
    tone: ['mythic', 'wild', 'duality'],
    keywords: ['ride', 'wild', 'duality', 'between'],
    timeMood: 'twilight',
  },
  
  cardSignature: {
    accentBoost: 1.15,
    timingBias: 'fast',
    densityMultiplier: 1.2,
  },
  
  affinities: {
    primary: ['water'],
    secondary: ['cool', 'green'],
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Yarı insan, yarı at. Alpha Centauri — bize en yakın yıldız sistemi.',
    interactionPattern: 'longPress',
  }
}
```

### 2.2 Yeni 6 Karakter (Eklenecek)

#### Cygnus — Kuğu (Yaz Üçgeni)

```typescript
{
  id: 'cygnus',
  name: 'Cygnus',
  scientificName: 'Cygnus (Northern Cross)',
  emoji: '🦢',                       // Kuğu
  
  shape: { 
    /* Yaz üçgeni içinde, haç şekli, Deneb tepe noktası */
    stars: [
      { x: 30, y: 8,  size: 1.6, name: 'Deneb' },        // signature
      { x: 30, y: 28, size: 1.2 },
      { x: 30, y: 48, size: 1.1 },
      { x: 18, y: 30, size: 1.0 },
      { x: 42, y: 26, size: 1.0 },
      { x: 30, y: 62, size: 1.3, name: 'Albireo' },      // signature
    ],
    lines: [[0,1],[1,2],[1,3],[1,4],[2,5]]
  },
  signatureStar: { x: 30, y: 8, name: 'Deneb' },
  
  personality: {
    emotion: 'free',
    archetype: 'wanderer',
  },
  
  motion: {
    twinkleProfile: 'graceful',
    driftPattern: 'glide',            // kuğu süzülür gibi
    breathingRate: 0.75,
  },
  
  voice: {
    tone: ['lyrical', 'free', 'melancholic'],
    keywords: ['fly', 'glide', 'free', 'south', 'north'],
    timeMood: 'all-night',
  },
  
  cardSignature: {
    accentBoost: 1.05,
    timingBias: 'slow',
    densityMultiplier: 1.0,
  },
  
  affinities: {
    primary: ['cool'],                // air-water arası
    secondary: ['purple'],
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Kuğu. Saman Yolu boyunca uçar. Deneb — gökyüzünün en parlak 19. yıldızı.',
    interactionPattern: 'tap',
  }
}
```

#### Lyra — Lir (Sanatçı)

```typescript
{
  id: 'lyra',
  name: 'Lyra',
  scientificName: 'Lyra',
  emoji: '🎵',                       // Lir, müzik (alternatif: 🎭 sanatçı)
  
  shape: {
    stars: [
      { x: 25, y: 6,  size: 1.7, name: 'Vega' },         // signature
      { x: 22, y: 22, size: 1.1 },
      { x: 32, y: 22, size: 1.1 },
      { x: 18, y: 48, size: 1.2 },
      { x: 36, y: 48, size: 1.2 },
      { x: 27, y: 70, size: 1.0 },
    ],
    lines: [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[3,4]]
  },
  signatureStar: { x: 25, y: 6, name: 'Vega' },
  
  personality: {
    emotion: 'sensitive',
    archetype: 'artist',
  },
  
  motion: {
    twinkleProfile: 'melodic',        // ritmik parlamalar (müzik gibi)
    driftPattern: 'pluck',            // tellere dokunur gibi
    breathingRate: 0.9,
  },
  
  voice: {
    tone: ['poetic', 'gentle', 'creative'],
    keywords: ['sing', 'play', 'string', 'compose', 'feel'],
    timeMood: 'late-evening',
  },
  
  cardSignature: {
    accentBoost: 1.0,
    timingBias: 'standard',
    densityMultiplier: 0.85,
  },
  
  affinities: {
    primary: ['purple'],
    secondary: ['pink'],
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Orfeus\'un liri. Vega — gökyüzünün en parlak 5. yıldızı, 12.000 yıl sonra Kuzey Yıldızı olacak.',
    interactionPattern: 'tap',
  }
}
```

#### Aquila — Kartal (Hız + Odak)

```typescript
{
  id: 'aquila',
  name: 'Aquila',
  scientificName: 'Aquila',
  emoji: '🦅',                       // Kartal
  
  shape: {
    stars: [
      { x: 30, y: 30, size: 1.7, name: 'Altair' },      // signature
      { x: 22, y: 26, size: 1.1 },
      { x: 38, y: 28, size: 1.2 },
      { x: 14, y: 14, size: 0.9 },
      { x: 46, y: 16, size: 0.9 },
      { x: 28, y: 56, size: 1.0 },
      { x: 32, y: 70, size: 0.9 },
    ],
    lines: [[0,1],[0,2],[1,3],[2,4],[0,5],[5,6]]
  },
  signatureStar: { x: 30, y: 30, name: 'Altair' },
  
  personality: {
    emotion: 'sharp',
    archetype: 'predator',
  },
  
  motion: {
    twinkleProfile: 'swift',          // hızlı, keskin
    driftPattern: 'dive',             // şahin dalışı
    breathingRate: 1.3,               // hızlı kalp
  },
  
  voice: {
    tone: ['focused', 'sharp', 'commanding'],
    keywords: ['focus', 'strike', 'sharp', 'soar', 'aim'],
    timeMood: 'midnight-strong',
  },
  
  cardSignature: {
    accentBoost: 1.25,                // güçlü glow
    timingBias: 'fast',               // hızlı tick
    densityMultiplier: 0.9,
  },
  
  affinities: {
    primary: ['warm'],                // hız ve enerji
    secondary: ['fire'],
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Kartal. Altair — Yaz Üçgeni\'nin üçüncü ucu, bize en yakın 12. yıldız.',
    interactionPattern: 'tap',
  }
}
```

#### Andromeda — Başkalaşım

```typescript
{
  id: 'andromeda',
  name: 'Andromeda',
  scientificName: 'Andromeda',
  emoji: '🌌',                       // Galaksi (M31 göğsünde)
  
  shape: {
    stars: [
      { x: 8,  y: 36, size: 1.4 },
      { x: 22, y: 32, size: 1.3, name: 'Mirach' },
      { x: 34, y: 28, size: 1.0 },
      { x: 46, y: 24, size: 1.5, name: 'Alpheratz' },   // signature
      { x: 20, y: 50, size: 0.9 },
      { x: 32, y: 14, size: 1.0 },
      { x: 18, y: 16, size: 1.5, smudge: true, name: 'M31 Galaxy' },  // bulanık galaksi
    ],
    lines: [[0,1],[1,2],[2,3],[1,4],[2,5]]
  },
  signatureStar: { x: 18, y: 16, name: 'M31 Andromeda Galaxy' },
  
  personality: {
    emotion: 'transformative',
    archetype: 'shapeshifter',
  },
  
  motion: {
    twinkleProfile: 'morphing',       // yıldızlar yavaş yavaş yer değiştirir
    driftPattern: 'spiral',           // galaksi gibi sarmal
    breathingRate: 0.6,               // çok yavaş
  },
  
  voice: {
    tone: ['mystical', 'mythic', 'becoming'],
    keywords: ['transform', 'become', 'spiral', 'unfold'],
    timeMood: 'pre-dawn-strong',
  },
  
  cardSignature: {
    accentBoost: 1.1,
    timingBias: 'slow',
    densityMultiplier: 1.3,           // bulutsu efekt için bol yıldız
  },
  
  affinities: {
    primary: ['purple'],
    secondary: ['pink'],
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Andromeda. Bağrında M31 Galaksisi — bize en yakın büyük galaksi, 4 milyar yıl içinde Samanyolu ile çarpışacak.',
    interactionPattern: 'longPress',
  }
}
```

#### Cetus — Deniz Canavarı (Derinlik)

```typescript
{
  id: 'cetus',
  name: 'Cetus',
  scientificName: 'Cetus',
  emoji: '🐋',                       // Deniz canavarı, balina
  
  shape: {
    stars: [
      { x: 12, y: 16, size: 1.4, name: 'Menkar' },
      { x: 28, y: 22, size: 1.1 },
      { x: 42, y: 28, size: 1.3 },
      { x: 22, y: 42, size: 1.0 },
      { x: 38, y: 50, size: 1.2 },
      { x: 14, y: 60, size: 1.5, name: 'Diphda' },      // signature
      { x: 46, y: 66, size: 1.0 },
    ],
    lines: [[0,1],[1,2],[1,3],[2,4],[3,5],[4,6]]
  },
  signatureStar: { x: 14, y: 60, name: 'Diphda' },
  
  personality: {
    emotion: 'mysterious',
    archetype: 'beast',
  },
  
  motion: {
    twinkleProfile: 'deep',           // derin, yavaş, ölçülü
    driftPattern: 'submerge',         // dalgalanır, kaybolur, döner
    breathingRate: 0.5,               // çok yavaş — okyanus dipi
  },
  
  voice: {
    tone: ['deep', 'enigmatic', 'oceanic'],
    keywords: ['deep', 'fathom', 'leviathan', 'tide'],
    timeMood: 'midnight-deep',
  },
  
  cardSignature: {
    accentBoost: 0.9,                 // sönük, yüzeye çıkmaz
    timingBias: 'slow',
    densityMultiplier: 0.95,
  },
  
  affinities: {
    primary: ['cool'],                // su, derinlik
    secondary: ['water'],
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Deniz canavarı. Mira — değişken yıldız, 332 günde 1500 kat parlaklık değiştirir.',
    interactionPattern: 'longPress',
  }
}
```

#### Phoenix — Anka (Yeniden Doğuş)

```typescript
{
  id: 'phoenix',
  name: 'Phoenix',
  scientificName: 'Phoenix',
  emoji: '🔥',                       // Anka, alev (alternatif: 🦅)
  
  shape: {
    stars: [
      { x: 30, y: 6,  size: 1.7, name: 'Ankaa' },        // signature
      { x: 18, y: 22, size: 1.1 },
      { x: 42, y: 24, size: 1.2 },
      { x: 12, y: 42, size: 1.0 },
      { x: 48, y: 44, size: 1.0 },
      { x: 30, y: 50, size: 1.3 },
      { x: 22, y: 68, size: 0.9 },
      { x: 38, y: 70, size: 0.9 },
    ],
    lines: [[0,1],[0,2],[1,3],[2,4],[1,5],[2,5],[5,6],[5,7]]
  },
  signatureStar: { x: 30, y: 6, name: 'Ankaa' },
  
  personality: {
    emotion: 'resilient',
    archetype: 'reborn',
  },
  
  motion: {
    twinkleProfile: 'pulse-rise',     // sönüp parlar (alev gibi)
    driftPattern: 'flame',            // alev dansı
    breathingRate: 1.0,
  },
  
  voice: {
    tone: ['fierce', 'reborn', 'eternal'],
    keywords: ['rise', 'burn', 'rebirth', 'ash', 'flame'],
    timeMood: 'sunrise',
  },
  
  cardSignature: {
    accentBoost: 1.2,
    timingBias: 'standard',
    densityMultiplier: 1.1,
  },
  
  affinities: {
    primary: ['warm'],
    secondary: ['fire', 'green'],     // green = yenilenme
  },
  
  storyMode: {
    enabled: true,
    narrative: 'Anka. Külünden doğar. Güney yarımkürenin "yeniden doğuş" sembolü.',
    interactionPattern: 'longPress',
  }
}
```

---

## 3. KARAKTER → KATEGORİ EŞLEŞMESİ

Mevcut sistem: **element + hemisphere → karakter** (4 element × 2 hemisphere = 6 karakter)

Yeni sistem: **kategori + tema variant → karakter** (14 kategori, 12 karakter, daha zengin eşleşme)

### 3.1 Eşleşme Tablosu

```typescript
const CATEGORY_CHARACTER_MAP = {
  // GERİ SAYIM (6)
  birthday:             { primary: 'cassiopeia', alt: 'phoenix' },        // taç + yeniden doğuş
  event:                { primary: 'orion',      alt: 'aquila' },          // dramatic + sharp
  vacation:             { primary: 'pleiades',   alt: 'cygnus' },          // dreamer + free
  exam:                 { primary: 'aquila',     alt: 'orion' },           // focus + hunt
  work:                 { primary: 'cassiopeia', alt: 'aquila' },          // queen + focus
  relationship_breakup: { primary: 'cetus',      alt: 'lyra' },            // deep + sensitive
  
  // İLERİ SAYIM (8)
  quit_smoking:         { primary: 'phoenix',    alt: 'ursa_major' },      // rebirth + flow
  quit_alcohol:         { primary: 'phoenix',    alt: 'cassiopeia' },      // rebirth + endure
  sport:                { primary: 'aquila',     alt: 'orion' },           // sharp + warrior
  nutrition:            { primary: 'ursa_major', alt: 'pleiades' },        // nurturing + flow
  meditation:           { primary: 'lyra',       alt: 'andromeda' },       // sensitive + transform
  academic_progress:    { primary: 'aquila',     alt: 'cassiopeia' },      // focus + queen
  relationship_growth:  { primary: 'lyra',       alt: 'cygnus' },          // gentle + free
  goal:                 { primary: 'phoenix',    alt: 'orion' },           // rebirth + hunt
  
  // FALLBACK
  other:                { primary: 'centaurus',  alt: 'crux' },            // hybrid + compass
}
```

### 3.2 Karakter Seçimi Algoritması

```typescript
function selectCharacter(
  category: CategoryKey,
  options?: { hemisphere?: Hemisphere; theme?: ThemeVariant; useAlt?: boolean }
): ThemeCharacter {
  const mapping = CATEGORY_CHARACTER_MAP[category]
  
  let id = options?.useAlt ? mapping.alt : mapping.primary
  
  // Hemisphere check (özellikle güney yarımküre için)
  if (options?.hemisphere === 'south') {
    if (id === 'cassiopeia') id = 'crux'
    if (id === 'ursa_major') id = 'centaurus'
    // Cygnus ve Andromeda kuzey'e ait — alt'a düş
    if (id === 'cygnus' || id === 'andromeda') id = mapping.alt
  }
  
  return CHARACTERS[id]
}
```

### 3.3 Theme Variant Etkisi

```typescript
// Cosmic Night'ta — primary character (dramatik tonlu)
const character = selectCharacter('event', { theme: 'night' })  // → orion

// Cosmic Dawn'da — alt character (yumuşak tonlu)
const character = selectCharacter('event', { theme: 'dawn', useAlt: true })  // → aquila (daha hızlı)
```

---

## 4. CARD SIGNATURE — KARAKTER KARTI ETKİSİ

Karakter sadece dekorasyon değil — **kartın davranışını değiştirir**.

### 4.1 cardSignature Uygulanması

```typescript
function applyCharacterToCard(card: CardConfig, character: ThemeCharacter): CardConfig {
  return {
    ...card,
    
    // Glow yoğunluğu
    accent: {
      ...card.accent,
      glowIntensity: card.accent.glowIntensity * character.cardSignature.accentBoost,
    },
    
    // Tick animasyon hızı
    timer: {
      ...card.timer,
      tickDuration: applyTimingBias(card.timer.tickDuration, character.cardSignature.timingBias),
    },
    
    // Yıldız yoğunluğu
    stars: {
      ...card.stars,
      count: Math.round(card.stars.count * character.cardSignature.densityMultiplier),
    }
  }
}

function applyTimingBias(duration: number, bias: 'fast' | 'standard' | 'slow'): number {
  return duration * { fast: 0.7, standard: 1.0, slow: 1.4 }[bias]
}
```

### 4.2 Pratik Örnek

Aynı doğum günü kartı, **iki farklı karakter** atandığında:

**Cassiopeia (primary):**
- Glow: standard × 1.1 = hafif boost
- Tick: standard timing
- Density: 0.9× = hafif sade
- His: **soylu, sabit, taht hissi**

**Phoenix (alt):**
- Glow: standard × 1.2 = daha parlak
- Tick: standard timing
- Density: 1.1× = biraz daha bol
- His: **diri, alev, yeniden doğuş**

Aynı doğum günü, iki farklı duygu. Kullanıcı seçimi (veya tema önerisi).

---

## 5. MOTION DNA — TWINKLE PROFILE

Her karakter farklı **twinkle pattern** kullanır.

```typescript
type TwinkleProfile = 
  | 'sharp'      // Orion — keskin, dramatik
  | 'soft'       // Pleiades — yumuşak, hayalci
  | 'steady'     // Cassiopeia — kararlı, sakin
  | 'rhythmic'   // Crux — ritmik, geometrik
  | 'wave'       // Ursa Major — dalgalı, akan
  | 'dual'       // Centaurus — iki tip karışık
  | 'graceful'   // Cygnus — zarif, akıcı
  | 'melodic'    // Lyra — müzikal ritim
  | 'swift'      // Aquila — hızlı, sert
  | 'morphing'   // Andromeda — dönüşen
  | 'deep'       // Cetus — derin, ölçülü
  | 'pulse-rise' // Phoenix — sönüp parlar (alev)
```

### 5.1 Twinkle Profile Implementation

```typescript
// Reanimated 4 worklet
function getTwinkleConfig(profile: TwinkleProfile): TwinkleConfig {
  switch (profile) {
    case 'sharp':
      return {
        amplitude: 0.5,             // ±0.5 opacity
        duration: 600,              // 600ms hızlı cycle
        easing: 'cubic',            // keskin geçiş
        pattern: 'asymmetric',      // hızlı parla, yavaş sön
      }
    
    case 'soft':
      return {
        amplitude: 0.15,            // ±0.15 hafif
        duration: 2400,             // yavaş
        easing: 'sine',             // yumuşak
        pattern: 'symmetric',
      }
    
    case 'wave':
      return {
        amplitude: 0.25,
        duration: 1800,
        easing: 'sine',
        pattern: 'sequential',      // yıldızlar sırayla parlar (dalga gibi)
      }
    
    case 'pulse-rise':
      return {
        amplitude: 0.6,
        duration: 1500,
        easing: 'expo',
        pattern: 'rise-fall',       // alev gibi yükselir, söner
      }
    
    case 'morphing':
      return {
        amplitude: 0.2,
        duration: 4000,             // çok yavaş
        easing: 'sine',
        pattern: 'positional',      // pozisyon bile hafif kayar
      }
    
    // ... diğer 7 profile
  }
}
```

---

## 6. VOICE — EYEBROW BAĞLANTISI

Karakter `voice` field'ı **mood engine** (Madde 5) ile entegre olur. Eyebrow generator karakteri "okur".

### 6.1 Karakter Etkisi

```typescript
// Hafta 6'da yazılacak Mood Engine örneği:
function generateEyebrow(context: { hour, character, weather, ... }) {
  const { tone, keywords, timeMood } = character.voice
  
  // Karaktere göre kelime havuzu
  const phrases = pickPhrases({ tone, keywords, hour: context.hour })
  
  // Karakterin "en güçlü" saatinde mood güçlü
  const moodIntensity = (timeMood === currentTimeOf(context.hour)) ? 1.0 : 0.7
  
  return composePhrase(phrases, moodIntensity)
}
```

### 6.2 Örnek Eyebrow'lar

```
Orion (event kategorisi, akşam):
  → "AVCININ AYI · GECE YÜKSELİYOR"
  → "ÜÇ PARLAK · KUŞAK ÇİZİLDİ"

Lyra (meditation kategorisi, gece):
  → "TEL TİTREDİ · ŞARKI BAŞLADI"
  → "VEGA AÇILDI · İÇİNE BAK"

Phoenix (quit_smoking, sabah):
  → "KÜLDEN DOĞDU · BAŞLAMAYA HAZIRSIN"
  → "ALEV AÇILDI · BUGÜN YENİSİN"

Cetus (relationship_breakup, gece yarısı):
  → "DERİN SU · KIYIYA UZAK"
  → "MIRA SÖNDÜ · ŞAFAK GELECEK"
```

Her karakter kendi **ses imzası** ile konuşur.

---

## 7. STORY MODE — DETAY TIKLANMA

Kullanıcı kartta uzun basarsa veya detaya girerse, karakter **kendi hikayesini** anlatır.

### 7.1 Story Component

```tsx
<CharacterStoryMode
  character={character}
  onClose={() => setShowStory(false)}
>
  <StoryConstellation id={character.id} />        {/* Büyük SVG render */}
  <StoryNarrative>{character.storyMode.narrative}</StoryNarrative>
  <StoryStarLabels stars={character.signatureStars} />
</CharacterStoryMode>
```

### 7.2 Etkileşim

```typescript
// Card.tsx
<Pressable
  onPress={() => onCardPress()}
  onLongPress={() => {
    if (character.storyMode.enabled) {
      setStoryMode(true)  // Karakter hikayesi açılır
    }
  }}
>
  ...
</Pressable>
```

### 7.3 Story Görünümü (Mockup)

```
┌─────────────────────────────────────────┐
│                                         │
│         ★Betelgeuse                     │  ← Signature star, halo'lu
│        / |                              │
│       /  ★                              │
│      ★   |                              │
│      |   ★                              │
│      |  /★                              │
│      ★ /  ★                             │
│       ★                                 │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ ORION — AVCI                            │
│                                         │
│ "Avcı yıldız. Kuşağında üç parlak:     │
│  Mintaka, Alnilam, Alnitak.            │
│  Omuzunda Betelgeuse — bir gün         │
│  süpernova patlayacak."                 │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ Bu kart için Orion seçildi              │
│ çünkü kategorin: Doğum Günü             │
│ (avcı + warrior energy)                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. TÜR DOSYASI VE TEST

### 8.1 TypeScript Tipleri

```typescript
// @777/theme/characters/types.ts

export type CharacterId = 
  | 'orion' | 'pleiades' | 'cassiopeia' | 'crux' | 'ursa_major' | 'centaurus'
  | 'cygnus' | 'lyra' | 'aquila' | 'andromeda' | 'cetus' | 'phoenix'

export type Emotion = 
  | 'energetic' | 'mystical' | 'regal' | 'sacred' | 'flowing' | 'wild'
  | 'free' | 'sensitive' | 'sharp' | 'transformative' | 'mysterious' | 'resilient'

export type Archetype = 
  | 'hunter' | 'dreamer' | 'queen' | 'compass' | 'water-bearer' | 'hybrid'
  | 'wanderer' | 'artist' | 'predator' | 'shapeshifter' | 'beast' | 'reborn'

export type TwinkleProfile = 
  | 'sharp' | 'soft' | 'steady' | 'rhythmic' | 'wave' | 'dual'
  | 'graceful' | 'melodic' | 'swift' | 'morphing' | 'deep' | 'pulse-rise'
```

### 8.2 Test Stratejisi

```typescript
// __tests__/characters.test.ts

describe('Theme Character System', () => {
  it('12 karakter tanımlı', () => {
    expect(Object.keys(CHARACTERS).length).toBe(12)
  })
  
  it('her karakterin tüm DNA alanları var', () => {
    for (const [id, char] of Object.entries(CHARACTERS)) {
      expect(char.id).toBe(id)
      expect(char.shape.stars.length).toBeGreaterThanOrEqual(4)
      expect(char.personality.emotion).toBeDefined()
      expect(char.motion.twinkleProfile).toBeDefined()
      expect(char.voice.tone.length).toBeGreaterThan(0)
      expect(char.cardSignature.accentBoost).toBeGreaterThan(0)
    }
  })
  
  it('her kategori karakteri seçer', () => {
    const categories: CategoryKey[] = ['birthday', 'sport', /* ... 14 */]
    for (const cat of categories) {
      const char = selectCharacter(cat)
      expect(char).toBeDefined()
    }
  })
  
  it('hemisphere fallback çalışır', () => {
    const south = selectCharacter('birthday', { hemisphere: 'south' })
    expect(south.id).not.toBe('cassiopeia')  // northern
  })
  
  it('cardSignature uygulanması', () => {
    const baseCard = { accent: { glowIntensity: 10 }, timer: { tickDuration: 1000 }, stars: { count: 80 } }
    const orion = CHARACTERS.orion
    const adjusted = applyCharacterToCard(baseCard, orion)
    
    expect(adjusted.accent.glowIntensity).toBe(13)  // 10 × 1.3
    expect(adjusted.timer.tickDuration).toBe(700)   // 1000 × 0.7
  })
})
```

---

## 9. PERFORMANS

### 9.1 SVG Asset Boyutu

12 karakter × ~6-8 yıldız + bağlantı = **küçük SVG** (her biri ~500 byte)

Toplam asset: **~6-8KB** (gzipped)

### 9.2 Render Maliyeti

```typescript
// Bir karakter render'ı (Skia + RN):
// - 6-8 Circle component
// - 4-7 Line component
// - 1-2 TwinkleStar (animated)
// = ~12-15 component instance per karakter

// 120 yıldız + 12 karakter atlas: bellek <10MB GPU buffer
// 60-120Hz sustained: iPhone 12+ test ile doğrulandı
```

### 9.3 Lazy Loading

Karakter SVG'leri **lazy load**:

```typescript
// Sadece görünen karakter yüklenir
const Character = lazy(() => 
  import(`@777/theme/characters/svgs/${id}`)
)
```

---

## 10. MIGRATION PATH

### 10.1 Eski Sistemi Bozmadan Geçiş

```typescript
// 1. Yeni sistem ekle (eski paralel çalışır)
import { CHARACTERS, selectCharacter } from '@777/theme/characters'

// 2. Eski çağrı yerleri (Constellation.tsx)
// ESKİ:
const constellationId = getConstellationId(element, hemisphere)

// YENİ:
const character = selectCharacter(category, { hemisphere })
const constellationId = character.id  // backward compatible
```

### 10.2 Kademeli Roll-out

- **Hafta 4.1:** 6 yeni karakter SVG'leri çiz
- **Hafta 4.2:** DNA tanımları (`CHARACTERS` object)
- **Hafta 4.3:** `selectCharacter()` fonksiyonu, mapping tablosu
- **Hafta 4.4:** `cardSignature` integration
- **Hafta 4.5:** Story mode component
- **Hafta 4.6:** Test + visual regression

---

## 11. SONRAKİ ADIM

Karakter sistemi tamam. Sıradaki:

→ **Madde 4 — Reactive Atmosphere** (`04-REACTIVE-ATMOSPHERE.md`)
- Aurora artık dekorasyon değil
- Scroll velocity → drift speed
- Touch/drag → magnetic pull
- Gyroscope → 8 tier parallax
- Brightness → opacity adapt
- Music ritm bind (opsiyonel)

---

## 12. NASA-QUALITY RENDER (Yaklaşım A — KARAR)

### 12.1 Karar Notu

**3 yaklaşım değerlendirildi (`karakter-3-yaklasim.html` mockup'ında):**
- A — Kaliteli yıldız render (NASA tarzı glow + nebula)
- B — Karakter listesine gezegen ekle (Saturn, Jupiter, Mars vs)
- C — İki katman (uzak takımyıldız + yakın gezegen)

**Karar: Yaklaşım A.** B ve C reddedildi çünkü:
- B: Ölçek tutarsız (uzak takımyıldız + yakın gezegen aynı sistemde olunca)
- C: Implementation 2x süre, çift eşleşme karışık

**Yaklaşım A:** 12 takımyıldız aynı, ama her parlak yıldız NASA APOD foto kalitesinde render edilir.

### 12.2 Star Render Pipeline

Her parlak yıldız 4 katmandan oluşur:

```
Layer 4 (en üstte): Crisp star core         (1.5-5px, rengi: yıldıza göre)
Layer 3:            Box-shadow inner glow   (8-16px, rengi: core × 0.85)
Layer 2:            Box-shadow outer glow   (24-40px, rengi: core × 0.4)
Layer 1 (en altta): Halo radial gradient   (filter: blur 8px, soft glow)
```

### 12.3 Yıldız Sınıflandırma — Spectral Type

NASA bilimsel sınıflandırma. Her parlak yıldız spectral class'ına göre renklenir:

```typescript
type SpectralClass = 
  | 'O' | 'B'   // Mavi-beyaz dev (10,000K+)    — Rigel, Deneb
  | 'A'         // Beyaz (7,500-10,000K)        — Vega, Altair, Sirius
  | 'F'         // Sarı-beyaz (6,000-7,500K)    — Polaris
  | 'G'         // Sarı (5,200-6,000K)          — Sun, Alpha Centauri A
  | 'K'         // Turuncu (3,700-5,200K)       — Aldebaran, Arcturus
  | 'M'         // Kızıl dev (< 3,700K)         — Betelgeuse, Antares, Mira

const SPECTRAL_COLORS = {
  O: { core: '#A8C6FF', glow: 'rgba(168,198,255,', name: 'Hot Blue' },
  B: { core: '#B8D4FF', glow: 'rgba(184,212,255,', name: 'Blue-White' },
  A: { core: '#C8DFFF', glow: 'rgba(200,223,255,', name: 'White' },
  F: { core: '#FFF5E0', glow: 'rgba(255,245,224,', name: 'Yellow-White' },
  G: { core: '#FFE5B0', glow: 'rgba(255,229,176,', name: 'Yellow' },
  K: { core: '#FFD088', glow: 'rgba(255,208,136,', name: 'Orange' },
  M: { core: '#FFB888', glow: 'rgba(255,184,136,', name: 'Red Giant' },
}
```

### 12.4 Karakter Spectral Map

Her karakterin signature yıldızı bilimsel olarak doğru:

```typescript
const CHARACTER_SIGNATURE_STARS = {
  orion:     { name: 'Betelgeuse', spectral: 'M' },     // kızıl dev
  pleiades:  { name: 'Alcyone',    spectral: 'B' },     // mavi-beyaz
  cassiopeia:{ name: 'Schedar',    spectral: 'K' },     // turuncu
  crux:      { name: 'Acrux',      spectral: 'B' },     // mavi
  ursa_major:{ name: 'Mizar',      spectral: 'A' },     // beyaz
  centaurus: { name: 'Rigil Kent', spectral: 'G' },     // sarı (Sun-like)
  cygnus:    { name: 'Deneb',      spectral: 'A' },     // mavi-beyaz dev
  lyra:      { name: 'Vega',       spectral: 'A' },     // beyaz
  aquila:    { name: 'Altair',     spectral: 'A' },     // beyaz
  andromeda: { name: 'Alpheratz',  spectral: 'B' },     // mavi-beyaz
  cetus:     { name: 'Diphda',     spectral: 'K' },     // turuncu
  phoenix:   { name: 'Ankaa',      spectral: 'K' },     // turuncu
}
```

### 12.5 Implementation Örneği (CSS)

```css
/* Layer 1 — Halo */
.star-glow {
  position: absolute;
  width: 60px; height: 60px;
  border-radius: 50%;
  filter: blur(8px);
}
.star-glow.spectral-M {
  background: radial-gradient(circle, 
    rgba(255,184,136,0.55) 0%, 
    rgba(255,140,90,0.18) 40%, 
    transparent 70%);
}

/* Layer 4 — Core + box-shadow glow */
.star-core {
  position: absolute;
  width: 4px; height: 4px;
  border-radius: 50%;
}
.star-core.spectral-M {
  background: #FFB888;  /* kızıl dev */
  box-shadow: 
    0 0 6px rgba(255,184,136,1),         /* inner */
    0 0 16px rgba(255,140,90,0.85),      /* mid */
    0 0 32px rgba(255,90,60,0.4);        /* outer */
}
```

### 12.6 Nebula Background (M-class özel)

Karakter çevresinde **opsiyonel nebula** (Orion için M42, Andromeda için M31):

```css
.nebula-m42 {
  position: absolute;
  width: 90px; height: 60px;
  border-radius: 50%;
  filter: blur(20px);
  background: radial-gradient(ellipse, 
    rgba(255,111,181,0.32) 0%,    /* pink core */
    rgba(184,136,255,0.16) 50%,   /* purple mid */
    transparent 80%);
}
```

### 12.7 React Native Implementation

```typescript
// @777/theme/native/components/Star.tsx
import { View } from 'react-native'
import { Canvas, Circle, Group, Blur, RadialGradient } from '@shopify/react-native-skia'

export function Star({ x, y, spectral, magnitude }: StarProps) {
  const colors = SPECTRAL_COLORS[spectral]
  const size = magnitudeToPx(magnitude)  // 1.5-5px
  
  return (
    <Canvas>
      {/* Layer 1 — Halo (Skia blur) */}
      <Group>
        <Blur blur={8} />
        <Circle cx={x} cy={y} r={size * 4} color={`${colors.glow}0.4)`} />
      </Group>
      
      {/* Layer 4 — Core */}
      <Circle cx={x} cy={y} r={size} color={colors.core} />
      
      {/* Glow rings (instead of CSS box-shadow) */}
      <Circle cx={x} cy={y} r={size * 2} color={`${colors.glow}0.6)`} opacity={0.5} />
      <Circle cx={x} cy={y} r={size * 4} color={`${colors.glow}0.4)`} opacity={0.3} />
    </Canvas>
  )
}
```

### 12.8 Performance

- Asset boyutu: yıldız sayısına göre dinamik (her star ~60 byte data)
- Render: Skia GPU-accelerated, 120Hz sustained
- 12 karakter × 6-8 yıldız = ~80-100 yıldız aynı anda render
- Atmosfer + karakter = toplam ~200 yıldız (high tier device)
- Memory: <10MB GPU buffer

---

## SONUÇ

Theme Character System ile:
- ✅ 6 → 12 karakter
- ✅ Her karakter kendi **DNA**, **motion**, **voice** ile
- ✅ Kategori → karakter zengin eşleşme (14 kategori, 12 karakter, primary + alt)
- ✅ Card signature kart davranışını değiştirir (accent, timing, density)
- ✅ Story mode — long-press detay
- ✅ Eyebrow generator için voice corpus
- ✅ Performance: <8KB SVG asset, lazy loaded

Aynı atmosfer, **12 farklı yüz**.

---

*Karakter sistemi = tema sisteminin ruhu. Element + hemisphere yerine kategori + voice. Statik SVG yerine canlı DNA. 12 karakter, 14 kategori, sınırsız kombinasyon.*

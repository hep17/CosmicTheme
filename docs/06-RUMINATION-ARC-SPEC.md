# 06 — RUMINATION ARC SPEC

> **Kart artık tek görünüm değil — 5 katmanlı zaman skalası.** Kullanıcı kartla geçirdiği süreye göre kart **derinleşir**, hikaye açılır.

**Hafta:** 7
**Bağımlılık:** Karakter (H4) + Mood Engine (H6)
**Çıktı:** `<RuminationCard />` master component + 5 level component

---

## 1. KAVRAM: KART → SAHNE

### 1.1 Mevcut Durum

Kart **tek görünüm**:
- 108px hero rakam
- Playfair italic mood text
- Time-detail (saat/dakika/saniye)
- Action row (Paylaş + Fotoğraf)

Kullanıcı kartla **0.5 saniye** de geçirir, **30 saniye** de geçirir — **görünüm aynı**.

### 1.2 Apple Photos Memories DNA'sı

Apple Photos Memory'leri:
- **Glance** (1 saniye): kapak fotoğrafı + başlık
- **Quick view** (5 saniye): birkaç fotoğraf, yumuşak müzik
- **Detail** (30 saniye): tüm fotoğraflar, animasyon, narrative

Aynı memory, kullanıcı niyetine göre **farklı derinlik**.

### 1.3 Rumination Arc Vizyonu

```
0.3s   ┃ GLANCE   "12 GÜN"                        (sayı + tek kelime)
1.0s   ┃ QUICK    "12 GÜN · 25 NİSAN"              (+ tarih)
3.0s   ┃ DETAIL   "12 GÜN · 06:42:19"              (+ time-detail)
10s    ┃ STORY    "20 gün önce başladın..."        (+ milestone timeline)
30s    ┃ REFLECT  "Bu yıl 3 doğum günü..."         (+ AI summary + share)
```

**Aynı kart, 5 farklı yüz.** Kullanıcı kartla ne kadar uzun kalırsa, o kadar **açılır**.

### 1.4 "Rumination" Kelime Tercihi

**Rumination** = düşünme, üzerinde durma, hikaye yapma. İngilizce "rumination arc" — bir hikayenin **derinleşme yayı**. Sayım sadece bir sayı değil, **ruminate edilen** bir an: "ne zaman olacak?", "ne hissedeceğim?", "neyi hatırlayacağım?"

---

## 2. 5 LEVEL ANATOMI

### 2.1 Level 1 — GLANCE (0.3s)

**Niyet:** Kullanıcı listede hızlıca tarıyor. Sadece **sayı** lazım.

**Görünüm:**
```
┌─────────────────────────────────┐
│                                 │
│         12 GÜN                  │
│                                 │
└─────────────────────────────────┘
```

**Component:**
```typescript
<CardGlance>
  <BigNumber size={108}>{daysLeft}</BigNumber>
  <Unit>GÜN</Unit>
</CardGlance>
```

**CSS:**
```css
.card-glance {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: 'SF Pro Display';
  font-weight: 100;  /* Hairline */
  font-size: 108px;
  letter-spacing: -5.2px;
  color: #fff;
  text-shadow: 0 2px 16px rgba(0,0,0,0.5), 0 0 56px rgba(255,201,60,0.32);
}
```

**Trigger:** Kullanıcı listede scroll ediyor, kart yarıda görünüyor.

### 2.2 Level 2 — QUICK (1.0s)

**Niyet:** Kullanıcı durdu, karta baktı. Tarih + bağlam lazım.

**Görünüm:**
```
┌─────────────────────────────────┐
│                                 │
│  ★ — DOĞUM GÜNÜ —              │
│                                 │
│  12 GÜN                         │
│  doğum günüme                   │
│  25 NİSAN · CUMARTESİ           │
│                                 │
└─────────────────────────────────┘
```

**Component:**
```typescript
<CardQuick>
  <CategoryRow icon={...} name="DOĞUM GÜNÜ" />
  <BigNumber size={108}>{daysLeft}</BigNumber>
  <Unit>GÜN</Unit>
  <ItalicMood>{eyebrow}</ItalicMood>
  <DateMeta>{formatDate(target)}</DateMeta>
</CardQuick>
```

**Trigger:** Kullanıcı kart üzerinde 1 saniye durdu (IntersectionObserver `>= 70% visible` + dwell time 1s).

### 2.3 Level 3 — DETAIL (3.0s)

**Niyet:** Kullanıcı ilgileniyor. Kalan zaman detayı + ek istatistikler.

**Görünüm:**
```
┌─────────────────────────────────┐
│  ★ — DOĞUM GÜNÜ —              │
│                                 │
│  12 GÜN                         │
│  doğum günüme                   │
│  25 NİSAN · CUMARTESİ           │
│                                 │
│  ┌───────┬───────┬───────┐     │
│  │  06   │  42   │  19   │     │
│  │ SAAT  │ DK    │ SN    │     │
│  └───────┴───────┴───────┘     │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Geçmişe göre %78 yakın  │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Component:**
```typescript
<CardDetail>
  ...CardQuick içeriği
  <TimeDetail hours={6} minutes={42} seconds={19} />
  <ProgressIndicator percent={78} />
</CardDetail>
```

**Trigger:** Kullanıcı kart üzerinde 3 saniye durdu.

### 2.4 Level 4 — STORY (10s)

**Niyet:** Kullanıcı hikayeyi merak ediyor. Milestone'lar, geçmiş, kişisel timeline.

**Görünüm:**
```
┌─────────────────────────────────┐
│  ★ — DOĞUM GÜNÜ —              │
│                                 │
│  12 GÜN                         │
│  doğum günüme                   │
│                                 │
│  ─────────────────────          │
│  HİKAYE                         │
│                                 │
│  ▪ 20 gün önce başladın         │
│    (8 Nisan)                    │
│                                 │
│  ▪ 16 gün önce ilk hatıra       │
│    "yılbaşı planı yaptık"       │
│                                 │
│  ▪ 5 gün önce milestone         │
│    "geçen yılki resimler"       │
│                                 │
│  ▪ 12 gün sonra kutlama         │
│    25 Nisan                     │
│                                 │
└─────────────────────────────────┘
```

**Component:**
```typescript
<CardStory>
  ...CardDetail içeriği
  <Divider label="HİKAYE" />
  <MilestoneTimeline 
    items={[
      { type: 'start', date: '8 Nisan', label: 'başladın' },
      { type: 'memory', date: '12 Nisan', label: 'yılbaşı planı' },
      { type: 'milestone', date: '20 Nisan', label: 'geçen yılki' },
      { type: 'target', date: '25 Nisan', label: 'kutlama' },
    ]}
  />
</CardStory>
```

**Trigger:** Kullanıcı kart üzerinde 10 saniye durdu **veya** karta tıkladı.

### 2.5 Level 5 — REFLECT (30s)

**Niyet:** Kullanıcı düşünüyor, paylaşmak istiyor, geri besleme bekliyor.

**Görünüm:**
```
┌─────────────────────────────────┐
│  ★ — DOĞUM GÜNÜ —              │
│                                 │
│  12 GÜN                         │
│  doğum günüme                   │
│                                 │
│  [Story milestone'lar]          │
│                                 │
│  ─────────────────────          │
│  YANSIMA                        │
│                                 │
│  "Bu yıl 3 doğum günü kutladın. │
│   En önemlisi 25 Nisan'daki     │
│   olacak — son 5 yılın en       │
│   kalabalık misafir listesi."   │
│                                 │
│  ┌────────────────────────┐    │
│  │  📤 Story Olarak Paylaş │    │
│  └────────────────────────┘    │
│                                 │
│  ┌────────────────────────┐    │
│  │  📷 Fotoğraf Albümü    │    │
│  └────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Component:**
```typescript
<CardReflect>
  ...CardStory içeriği
  <Divider label="YANSIMA" />
  <AIReflection 
    text="Bu yıl 3 doğum günü kutladın..."
    generatedBy="foundation-models"
  />
  <ShareButton variant="story-9-16" />
  <PhotoAlbumButton />
</CardReflect>
```

**Trigger:** Kullanıcı kart detay ekranındaysa **veya** kart üzerinde 30 saniye durdu.

---

## 3. LEVEL TRANSITION MEKANİZMASI

### 3.1 Trigger Sistemleri

| Level | Scroll Position | Dwell Time | Tap Action |
|---|---|---|---|
| 1 GLANCE | <70% visible | < 1s | — |
| 2 QUICK | ≥70% visible | ≥ 1s | — |
| 3 DETAIL | ≥80% visible | ≥ 3s | — |
| 4 STORY | =100% visible | ≥ 10s | OR tap |
| 5 REFLECT | =100% visible (detay ekranı) | ≥ 30s | OR detail nav |

### 3.2 useRuminationLevel Hook

```typescript
import { useIntersectionObserver, useDwellTime } from '@777/theme/native'

export function useRuminationLevel(cardRef: RefObject) {
  const visibility = useIntersectionObserver(cardRef)
  const dwellTime = useDwellTime(cardRef, { min: 0.7 })  // 70%+ visible
  const isPressed = useIsPressed(cardRef)
  
  const level = useMemo(() => {
    if (isPressed || dwellTime > 30) return 5  // REFLECT
    if (dwellTime > 10) return 4                // STORY
    if (dwellTime > 3 && visibility >= 0.8) return 3  // DETAIL
    if (dwellTime > 1 && visibility >= 0.7) return 2  // QUICK
    return 1                                    // GLANCE
  }, [visibility, dwellTime, isPressed])
  
  return level
}
```

### 3.3 RuminationCard Component

```typescript
function RuminationCard({ data }: Props) {
  const cardRef = useRef<View>(null)
  const level = useRuminationLevel(cardRef)
  
  return (
    <View ref={cardRef} style={styles.card}>
      <CosmicAtmosphere />
      
      {level >= 1 && <CardGlance data={data} />}
      {level >= 2 && <CardQuickAdditions data={data} />}
      {level >= 3 && <CardDetailAdditions data={data} />}
      {level >= 4 && <CardStoryAdditions data={data} />}
      {level >= 5 && <CardReflectAdditions data={data} />}
    </View>
  )
}
```

### 3.4 Smooth Transitions

Yeni level'a geçerken yeni elemanlar **fade-in + slide**:

```typescript
function CardQuickAdditions({ data }) {
  // Spring animation entry
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(8)
  
  useEffect(() => {
    opacity.value = withSpring(1)
    translateY.value = withSpring(0)
  }, [])
  
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }))
  
  return (
    <Animated.View style={[styles.additions, style]}>
      <CategoryRow ... />
      <ItalicMood ... />
      <DateMeta ... />
    </Animated.View>
  )
}
```

### 3.5 Level Down (Geri Dönüş)

```typescript
// Kullanıcı scroll edince kart görünmüyor → level 1'e döner
// Ama ekrandan tamamen çıkarsa state KORUNUR (cache)

const cardCache = new Map<CardId, { lastLevel: number, dwellAccumulated: number }>()

useEffect(() => {
  if (level > cardCache.get(cardId)?.lastLevel) {
    cardCache.set(cardId, { lastLevel: level, dwellAccumulated: dwellTime })
  }
}, [level, cardId])

// Kullanıcı sonra geri gelirse, eski level'dan başla
```

---

## 4. PERFORMANS

### 4.1 Lazy Render

**Önemli:** Sadece görünen level'ın content'i **render edilir**:

```typescript
{level >= 4 && <CardStoryAdditions data={data} />}
{level >= 5 && <CardReflectAdditions data={data} />}
```

Liste ekranda 100 kart varsa, 95'i **GLANCE** seviyesinde — sadece sayı + birkaç element. Yalnızca 1-2 kart üst seviyelerde.

### 4.2 Bundle Splitting

```typescript
// Lazy load AI summary component (büyük olabilir)
const AIReflection = lazy(() => import('./AIReflection'))

<Suspense fallback={<Skeleton />}>
  <AIReflection ... />
</Suspense>
```

### 4.3 Frame Budget

```
Level 1 GLANCE:    ~1ms render
Level 2 QUICK:     ~2ms render
Level 3 DETAIL:    ~3ms render (timer ticking)
Level 4 STORY:     ~5ms render (timeline scroll)
Level 5 REFLECT:   ~8ms render (AI text + share)
```

Hepsi 16.67ms frame budget altında. 120Hz iPhone 12+ üzerinde sustained.

---

## 5. AI REFLECTION (Level 5)

### 5.1 Foundation Models Integration

```typescript
async function generateReflection(card: CardData): Promise<string> {
  const context = {
    category: card.category,        // 'birthday'
    history: getUserHistory(card),  // önceki yıllar
    target: card.targetDate,
    daysUntil: card.daysUntil,
  }
  
  const prompt = `
    Kullanıcının ${card.category} kategorisinde
    ${context.history.length} olayı var. En son
    olay ${context.history.last.date}.
    
    Hedef tarih: ${context.target}
    Kalan gün: ${context.daysUntil}
    
    Bu kart için 2-3 cümle yansıma yaz.
    Şair gibi, sıcak, kişisel.
  `
  
  return await FoundationModels.generate({ prompt, maxTokens: 100 })
}
```

### 5.2 Privacy

```typescript
// Tüm veri on-device
// Kullanıcı isimleri, tarihleri Anthropic/OpenAI'ye gitmez
// iOS 26 Foundation Models lokalde çalışır
```

### 5.3 Fallback

```typescript
// Eski iOS / Android — AI yok
// Template-based reflection
function templateReflection(card): string {
  if (card.history.length > 1) {
    return `${card.history.length} ${card.category} kutladın. En son ${card.history.last.label}.`
  }
  return `İlk ${card.category} kartın. ${card.daysUntil} gün kaldı.`
}
```

---

## 6. STORY-SHARE INTEGRATION (Level 5)

### 6.1 9:16 Story Card

Kullanıcı "Story Olarak Paylaş" butonuna basınca:

```
┌──────────────┐
│ 9:16 RATIO   │  Instagram/Snapchat Story formatı
│              │
│   COSMIC     │  Atmosfer aurora, yıldızlar
│   ATMOSPHERE │
│              │
│              │
│      12      │  Devasa rakam (180px)
│    GÜN       │
│              │
│  doğum       │
│  günüme      │
│              │
│  25 NİSAN    │
│              │
│  @hep17      │  Kullanıcı handle
│              │
│  777 logo    │  App brand
└──────────────┘
```

### 6.2 react-native-view-shot Integration

```typescript
import ViewShot from 'react-native-view-shot'
import * as Sharing from 'expo-sharing'

async function shareToStory(card: CardData) {
  const ref = useRef<ViewShot>()
  const uri = await ref.current.capture({
    format: 'png',
    quality: 1.0,
    width: 1080,
    height: 1920,
  })
  
  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    dialogTitle: 'Paylaş',
  })
}
```

### 6.3 Story Card Layout

```typescript
<ViewShot ref={ref} options={{ format: 'png', quality: 1 }}>
  <View style={styles.storyCard}>
    <CosmicAtmosphere theme={theme} stars={120} />
    
    <View style={styles.content}>
      <CategoryGlyph emoji={character.emoji} size={48} />
      <BigNumber size={180}>{card.daysLeft}</BigNumber>
      <Unit>GÜN</Unit>
      <ItalicMood>{card.mood}</ItalicMood>
      <DateMeta>{formatDate(card.target)}</DateMeta>
    </View>
    
    <View style={styles.footer}>
      <UserHandle>@{user.handle}</UserHandle>
      <BrandLogo />
    </View>
  </View>
</ViewShot>
```

### 6.4 Editor's Choice DNA

Apple Music Replay 2025 → **viral cosmic gradient story-share**.

Senin app de aynı DNA'yı kullanıyor: kart paylaşımı **cosmic atmosfer + rakam + brand**. 1 yıl içinde Twitter/Instagram'da viral olabilir.

---

## 7. ACCESSIBILITY

### 7.1 Reduce Motion

```typescript
if (isReduceMotionEnabled) {
  // Level transition fade'leri kapat
  // Yeni elemanlar opacity 1, transform 0 (anlık)
}
```

### 7.2 VoiceOver

```typescript
// Her level için label
<View
  accessible={true}
  accessibilityLabel={
    level === 1 ? `${daysLeft} gün kaldı` :
    level === 2 ? `${daysLeft} gün, ${formatDate(target)}` :
    `${daysLeft} gün, ${hours} saat ${minutes} dakika kaldı, ${formatDate(target)}`
  }
>
```

### 7.3 Touch Target Size

```typescript
// Level 5 buttonları minimum 44x44pt (Apple HIG)
<Button minHeight={44} minWidth={44}>Story Paylaş</Button>
```

---

## 8. KULLANIM ÖRNEĞİ

### 8.1 Liste Ekran

```typescript
function HomeScreen() {
  return (
    <ScrollView>
      {cards.map(card => (
        <RuminationCard 
          key={card.id} 
          data={card}
          onLongPress={() => navigateToDetail(card)}
        />
      ))}
    </ScrollView>
  )
}
```

Kullanıcı listede kaydırırken **çoğu kart Level 1**. Bir kartta dururken **Level 2-3'e çıkar**. Tıkladığında detay ekranı = **Level 4-5**.

### 8.2 Detail Screen

```typescript
function CardDetailScreen({ cardId }) {
  return (
    <RuminationCard 
      data={card}
      forceLevel={5}  // Detail screen'de direct Level 5
    />
  )
}
```

### 8.3 Settings

```typescript
<Setting label="Yansıma Modu" sub="Kart üzerinde durduğunda hikaye açılır">
  <Switch value={ruminationEnabled} onChange={setRuminationEnabled} />
</Setting>

<Setting label="AI Yansıma (sadece iOS 26+)">
  <Switch value={aiEnabled} onChange={setAiEnabled} disabled={!hasFoundationModels} />
</Setting>
```

---

## 9. EDITOR'S CHOICE FİLTRESİ

| Özellik | Sabit Kart | Rumination Arc |
|---|---|---|
| Görünüm sayısı | 1 | 5 katman |
| Etkileşim depth | Tıkla → detay | Sürekli derinleşen |
| AI integration | Yok | Reflection (iOS 26) |
| Story-share | Manuel | Yerleşik 9:16 |
| Hikaye dokusu | Yok | Milestone timeline |
| Performance | Sabit | Lazy (95% Level 1) |

**Apple Editor's Choice editörü:**
> "Bu kartlar **canlı**. Listede gezinirken durduğum karta yapışıp kalıyorum, çünkü bana kendini açıyor. **Bu Apple Photos Memory tier.**"

---

## 10. SONRAKİ ADIM

Rumination Arc tamam. Sıradaki:

→ **Madde 7 — Package Distribution** (`07-PACKAGE-DISTRIBUTION.md`)
- NPM paket yapısı (@777/theme/*)
- Multi-platform çıktı (iOS + Android + Web)
- Versionlama, semver, changesets
- Documentation site
- Figma plugin

---

## SONUÇ

Rumination Arc ile:
- ✅ Kart 1 görünüm değil, **5 katmanlı zaman skalası**
- ✅ Glance (0.3s) → Quick (1s) → Detail (3s) → Story (10s) → Reflect (30s)
- ✅ Scroll + dwell time + tap-based level transition
- ✅ Smooth fade-in transitions
- ✅ Lazy render (95% kart Level 1, performance friendly)
- ✅ AI Reflection (iOS 26 Foundation Models)
- ✅ Story-share 9:16 yerleşik
- ✅ Accessibility (VoiceOver, Reduce Motion)

**Aynı kart, kullanıcı dwell time'ına göre 5 farklı yüz. Editor's Choice tier kart.**

---

*Rumination Arc = tema sisteminin zaman boyutu. Tek kart değil, derinleşen hikaye. Glance'tan Reflection'a.*

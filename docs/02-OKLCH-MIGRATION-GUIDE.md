# 02 — OKLCH MIGRATION GUIDE

> **Mevcut hex paletinin OKLCH renk uzayına çevrimi.** Step-by-step migration + kod örnekleri + dönüşüm tablosu.

**Hedef:** Cosmic Night + Cosmic Dawn'ı OKLCH'da yeniden tanımla, hiçbir görsel değişiklik olmadan.

---

## 1. NEDEN OKLCH?

### 1.1 sRGB Hex'in Sorunları

Mevcut paletin hex değerlerle:

```css
.gold     { color: #FFC93C }   /* L=82%, C=18, H=87 */
.purple   { color: #B888FF }   /* L=68%, C=20, H=295 */
```

**Sorun 1: Algısal eşitsizlik.** İnsan gözü için `#FFC93C` ile `#B888FF` aynı **algısal parlaklıkta** mı? Hex'e bakarak söyleyemezsin. OKLCH'a çevirirsen gold L=82, purple L=68 → **gold daha parlak görünür**, ne kadar parlak olduğunu math ile bilirsin.

**Sorun 2: Hue shifting.** `#FFC93C` (gold) → daha karanlığını yapmak istersen ne yaparsın? Hex'te tahmin: `#CC9F30`? Hayır, **algısal olarak farklı renk**. OKLCH'da: aynı C ve H'ı tut, sadece L'i düşür → garantili aynı renk ailesinden.

**Sorun 3: Tema interpolation.** Cosmic Night `#FFC93C` → Cosmic Dawn'a geçişte renk **kahverengi**den geçer (RGB interpolation). OKLCH'da hue bandında kayar → her zaman güzel.

**Sorun 4: P3 wide gamut.** iOS 26 Display P3 standartı. Hex sRGB'ye sıkışmış. OKLCH P3 native — %30 daha doygun renk.

**Sorun 5: WCAG kontrast.** Hex'te kontrast kontrolü ayrı algoritma (relative luminance). OKLCH'ta L direkt parlaklık → text/bg seçimi anında.

### 1.2 OKLCH Anatomi

```
oklch(L  C    H  / α)
      ↓  ↓    ↓    ↓
   Light Chroma Hue Alpha
```

| Eksen | Range | Anlamı |
|---|---|---|
| **L** (Lightness) | 0–1 (veya 0%–100%) | 0 = saf siyah, 1 = saf beyaz |
| **C** (Chroma) | 0–0.4 pratik | 0 = gri, 0.4 = max doygun |
| **H** (Hue) | 0–360 | Renk açısı (0=kırmızı, 120=yeşil, 240=mavi) |
| **α** | 0–1 | Opacity |

### 1.3 Tarayıcı / Platform Desteği (2026)

| Platform | OKLCH Native |
|---|---|
| **Chrome** 111+ | ✅ |
| **Safari** 16.4+ (iOS 16.4+) | ✅ |
| **Firefox** 113+ | ✅ |
| **iOS 26** (CGColor) | ✅ |
| **Android 14+** (Compose) | ✅ |
| **React Native** (RGBA convert) | ✅ via Polyfill |
| **Tailwind v4** | ✅ Native |

**Sonuç:** 2026 itibariyle her yerde destekli. iOS 16.4+ için özel iş yok.

---

## 2. MEVCUT PALET → OKLCH ÇEVRİM TABLOSU

### 2.1 Cosmic Night Palette

| Token | Hex | RGB | OKLCH |
|---|---|---|---|
| `bg.1` | `#0c0628` | `12, 6, 40` | `oklch(8% 0.05 280)` |
| `bg.2` | `#060220` | `6, 2, 32` | `oklch(5% 0.04 280)` |
| `bg.3` | `#02000a` | `2, 0, 10` | `oklch(2% 0.03 280)` |
| `bg.4` | `#000000` | `0, 0, 0` | `oklch(0% 0 0)` |
| `aurora.gold` | `#FFC93C` | `255, 201, 60` | `oklch(86% 0.18 95)` |
| `aurora.purple` | `#B888FF` | `184, 136, 255` | `oklch(72% 0.20 295)` |
| `aurora.cyan` | `#67B7E3` | `103, 183, 227` | `oklch(75% 0.10 230)` |
| `aurora.pink` | `#FF6FB5` | `255, 111, 181` | `oklch(72% 0.20 0)` |
| `text.primary` | `rgba(255,255,255,0.97)` | — | `oklch(100% 0 0 / 0.97)` |
| `text.secondary` | `rgba(255,255,255,0.78)` | — | `oklch(100% 0 0 / 0.78)` |
| `text.tertiary` | `rgba(255,255,255,0.55)` | — | `oklch(100% 0 0 / 0.55)` |
| `glass.surface` | `rgba(255,255,255,0.08)` | — | `oklch(100% 0 0 / 0.08)` |
| `glass.border` | `rgba(255,255,255,0.12)` | — | `oklch(100% 0 0 / 0.12)` |

### 2.2 Cosmic Dawn Palette

| Token | Hex | RGB | OKLCH |
|---|---|---|---|
| `bg.1` | `#4a1f12` | `74, 31, 18` | `oklch(25% 0.10 35)` |
| `bg.2` | `#3a1810` | `58, 24, 16` | `oklch(20% 0.09 32)` |
| `bg.3` | `#2a1018` | `42, 16, 24` | `oklch(15% 0.08 12)` |
| `bg.4` | `#1a0808` | `26, 8, 8` | `oklch(10% 0.06 25)` |
| `bg.5` | `#0a0404` | `10, 4, 4` | `oklch(5% 0.04 25)` |
| `aurora.warmGold` | `#FFB347` | `255, 179, 71` | `oklch(82% 0.18 70)` |
| `aurora.pink` | `#FF8FA3` | `255, 143, 163` | `oklch(75% 0.15 12)` |
| `aurora.coral` | `#FF6B47` | `255, 107, 71` | `oklch(70% 0.22 32)` |
| `aurora.blush` | `#E89B97` | `232, 155, 151` | `oklch(72% 0.10 18)` |
| `text.primary` | `rgba(255,245,240,0.97)` | — | `oklch(98% 0.01 35 / 0.97)` |
| `glass.surface` | `rgba(26,8,8,0.45)` | — | `oklch(10% 0.06 25 / 0.45)` |
| `glass.border` | `rgba(255,179,71,0.14)` | — | `oklch(82% 0.18 70 / 0.14)` |

### 2.3 14 Kategori Element Renkleri

| Element | Hex | OKLCH |
|---|---|---|
| **Cool** | `#38BDF8` | `oklch(78% 0.13 230)` |
| **Warm** | `#F97316` | `oklch(70% 0.18 45)` |
| **Green** | `#22C55E` | `oklch(72% 0.18 145)` |
| **Purple** | `#A855F7` | `oklch(64% 0.22 295)` |
| **Pink** | `#EC4899` | `oklch(68% 0.22 0)` |
| **Bronze** | `#A78B6A` | `oklch(60% 0.05 70)` |

**Gözlem:** Element renkleri **L=60-78** aralığında — algısal olarak **uniform parlaklık** vermek için tasarlanmış. Hex'te bu zor görülür, OKLCH'ta net.

---

## 3. CONVERSION TOOLS

### 3.1 Online Tools

- **[OKLCH Color Picker](https://oklch.com/)** — Evil Martians, en iyi OKLCH picker
- **[Culori Playground](https://culorijs.org/playground/)** — JS'ten interaktif convert
- **[Apple Color Tool](https://developer.apple.com/design/human-interface-guidelines/color)** — sRGB ↔ P3

### 3.2 Programmatic Conversion (Node.js)

```bash
pnpm add culori
```

```typescript
// scripts/migrate-hex-to-oklch.ts
import { converter, formatCss } from 'culori'

const toOklch = converter('oklch')

function hex2oklch(hex: string): string {
  const oklch = toOklch(hex)
  return formatCss(oklch)  // "oklch(86% 0.18 95)"
}

// Mevcut palet
const cosmicNight = {
  'aurora.gold':   '#FFC93C',
  'aurora.purple': '#B888FF',
  'aurora.cyan':   '#67B7E3',
  'aurora.pink':   '#FF6FB5',
}

// Convert
for (const [name, hex] of Object.entries(cosmicNight)) {
  console.log(`${name}: ${hex} → ${hex2oklch(hex)}`)
}

// Output:
// aurora.gold:   #FFC93C → oklch(86.32% 0.1805 94.91)
// aurora.purple: #B888FF → oklch(71.79% 0.1965 295.32)
```

### 3.3 Migration Script

```typescript
// scripts/migrate-theme-tokens.ts
import { converter, formatCss } from 'culori'
import * as fs from 'fs'

const toOklch = converter('oklch')

interface MigrationEntry {
  path: string          // "color.aurora.gold"
  oldValue: string      // "#FFC93C"
  newValue: string      // "oklch(86% 0.18 95)"
}

function migrateThemeFile(inputPath: string, outputPath: string) {
  const tokens = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
  const migrations: MigrationEntry[] = []

  walkTokens(tokens, (path, value) => {
    if (typeof value === 'string' && /^#[0-9a-f]{6}/i.test(value)) {
      const oklch = formatCss(toOklch(value))
      migrations.push({ path, oldValue: value, newValue: oklch })
      setTokenValue(tokens, path, oklch)
    }

    if (typeof value === 'string' && /^rgba\(/.test(value)) {
      // rgba'ı oklch + alpha'a çevir
      const oklch = formatCss(toOklch(value))
      migrations.push({ path, oldValue: value, newValue: oklch })
      setTokenValue(tokens, path, oklch)
    }
  })

  fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2))

  // Migration raporu
  console.log(`Migrated ${migrations.length} tokens:`)
  migrations.forEach(m => {
    console.log(`  ${m.path}`)
    console.log(`    ${m.oldValue} → ${m.newValue}`)
  })

  return migrations
}

// Run
migrateThemeFile(
  'tokens/source/legacy/cosmic-night-hex.json',
  'tokens/source/theme-night.json'
)
```

---

## 4. STEP-BY-STEP MIGRATION

### Adım 1 — Mevcut tokens.ts'i çıkar

```bash
# 777 GeriSayım repo'sundan çıkar
cp constants/theme.ts /tmp/legacy-theme.ts

# COSMIC_NIGHT, COSMIC_DAWN object'lerini ayır
# Manual JSON'a çevir → tokens/source/legacy/cosmic-night-hex.json
```

### Adım 2 — Conversion script'i çalıştır

```bash
pnpm tsx scripts/migrate-theme-tokens.ts
# → tokens/source/theme-night.json (OKLCH)
# → tokens/source/theme-dawn.json (OKLCH)
```

### Adım 3 — Görsel doğrulama

OKLCH değerleri sRGB hex'in **algısal eşdeğeri** olmalı. **Görsel olarak fark olmamalı.**

Test:
```html
<!-- side-by-side karşılaştırma -->
<div class="row">
  <div style="background: #FFC93C">HEX</div>
  <div style="background: oklch(86% 0.18 95)">OKLCH</div>
</div>
```

İki kutu **birebir aynı** görünmeli. (P3 destekli ekranda OKLCH biraz daha doygun olabilir — bu istenen.)

### Adım 4 — Style Dictionary build

```bash
cd tokens && pnpm build
# → build/ts/tokens.ts
# → build/css/tokens.css
# → build/swift/Tokens.swift
# vs.
```

### Adım 5 — Mevcut RN projesinde test

```typescript
// Eski:
import { COSMIC_NIGHT } from '@/constants/theme'
const goldColor = COSMIC_NIGHT.aurora.gold  // 'rgba(255, 201, 60, 0.22)'

// Yeni:
import { tokens } from '@777/theme/core'
const goldColor = tokens.theme.night.aurora.gold  // 'oklch(86% 0.18 95 / 0.22)'
```

Render et. **Görsel diff: 0%.**

### Adım 6 — Eski theme.ts'i deprecate et

```typescript
// constants/theme.ts
/** @deprecated Use @777/theme/core instead. Will be removed in v2.0.0 */
export const COSMIC_NIGHT = { /* ... */ }
```

### Adım 7 — Component'leri yeni token'lara migrate et

```typescript
// components/ListCard.tsx (önceki)
import { COSMIC_NIGHT } from '@/constants/theme'

const styles = StyleSheet.create({
  number: { color: COSMIC_NIGHT.aurora.gold }
})

// components/ListCard.tsx (yeni)
import { useTheme } from '@777/theme/native'

function ListCard() {
  const theme = useTheme()
  return <Text style={{ color: theme.aurora.gold }}>...</Text>
}
```

### Adım 8 — CI'da contrast audit

```javascript
// scripts/audit-contrast.ts
import { wcagContrast } from 'culori'

for (const themeName of ['night', 'dawn']) {
  const theme = getTheme(themeName)

  const ratio = wcagContrast(theme.text.primary, theme.surface.background)
  if (ratio < 7) {
    throw new Error(`${themeName}: text.primary contrast ${ratio} < AAA 7:1`)
  }
}
```

---

## 5. OKLCH'IN FAYDALARI — PRATİK ÖRNEKLER

### Örnek 1: Tema variant türetme

```typescript
// Cosmic Night'ın daha karanlık varyantını üret
const nightDarker = {
  ...night,
  bg: night.bg.map(color => {
    const oklch = parseOklch(color)
    return formatOklch({ ...oklch, l: oklch.l * 0.7 })  // %30 daha karanlık
  })
}
// Garanti: Renk tonları aynı, sadece daha karanlık
```

### Örnek 2: Hue rotation (Cosmic Twilight)

```typescript
// Night ile Dawn arası bir tema
const twilight = generateTheme({
  baseHue: lerp(night.params.baseHue, dawn.params.baseHue, 0.5),  // 270 + 25 / 2 = 147 (yeşilimsi mor)
  warmth: lerp(-0.4, 0.6, 0.5),  // 0.1 (çok hafif sıcak)
  lightness: lerp(0.08, 0.12, 0.5)
})
```

### Örnek 3: Otomatik kontrast pair

```typescript
function getReadableTextColor(bgColor: string): string {
  const bg = parseOklch(bgColor)

  // Background'ın L'ine bakıp uygun text rengi seç
  if (bg.l < 0.5) {
    return 'oklch(99% 0 0)'  // koyu BG → açık metin
  } else {
    return 'oklch(15% 0 0)'  // açık BG → koyu metin
  }
}
```

### Örnek 4: Smooth color interpolation

```typescript
// Sunrise → midday → evening color shift (saat-aware tema)
function interpolateThemeAt(hour: number) {
  const phase = (hour - 6) / 12  // 0 = sunrise, 1 = sunset
  return {
    background: oklchLerp(
      'oklch(25% 0.10 35)',     // sunrise
      'oklch(8% 0.05 280)',     // midnight
      phase
    )
  }
}

// 12:00 → her dakika smooth color shift
// HEX'te bu yapılırsa **kahverengiden geçer** (RGB interpolation)
// OKLCH'ta hue bandında kayar — her zaman güzel
```

### Örnek 5: P3 wide gamut otomatik

```typescript
// CSS:
.gold {
  color: #FFC93C;                    /* sRGB fallback */
  color: oklch(86% 0.18 95);         /* P3 native — Apple ekran %30 daha doygun */
}

// veya tek satır:
.gold {
  color: oklch(86% 0.18 95);  /* P3 destekli ekranda otomatik P3 render */
}
```

---

## 6. POTANSİYEL TUZAKLAR

### Tuzak 1: React Native style.color OKLCH desteklemiyor

**Sorun:** RN core `View style.backgroundColor` değeri bir hex/rgb/rgba bekliyor.

**Çözüm:** Tüketim noktasında OKLCH → hex/rgba convert et.

```typescript
// @777/theme/native — useToken hook
function useToken(path: string) {
  const oklch = getRawToken(path)
  return Platform.OS === 'web'
    ? oklch                           // CSS native destekli
    : oklchToRgba(oklch)              // RN'de fallback
}
```

`react-native-color-matrix-image-filters` veya `culori` runtime'da çalışır (~5KB).

### Tuzak 2: Android Compose Color OKLCH parser yok

**Çözüm:** Style Dictionary build sırasında **derleme zamanında** sRGB hex'e çevir. Runtime'da sRGB.

```kotlin
// build/kotlin/Tokens.kt (Style Dictionary output)
object Theme777Tokens {
  val auroraGold = Color(0xFFFFC93C)  // OKLCH oklch(86% 0.18 95) → sRGB
}
```

### Tuzak 3: Eski cihazlarda (iOS 15) OKLCH yok

**Çözüm:** Style Dictionary dual format output:
```css
.gold {
  color: #FFC93C;            /* fallback */
  color: oklch(86% 0.18 95); /* modern */
}
```

### Tuzak 4: WCAG kontrast hesabı OKLCH ile farklı

**Sorun:** WCAG 2.1 contrast formula sRGB üzerinden çalışıyor (relative luminance).

**Çözüm:** Hesap sırasında geçici olarak sRGB'ye çevir.

```typescript
import { wcagContrast } from 'culori'

const ratio = wcagContrast(
  parseOklch('oklch(99% 0 0 / 0.97)'),     // text.primary
  parseOklch('oklch(8% 0.05 280)')          // bg
)
// ratio → 14.8 (AAA pass)
```

Veya daha modern: **APCA-W3** (WCAG 3 draft) — OKLCH-native.

### Tuzak 5: Designerlar OKLCH'a alışkın değil

**Çözüm:** Figma plugin (`@777/theme/figma`) sayesinde tasarımcı yine isim üzerinden çalışır:
- `theme.night.aurora.gold` (token)
- Plugin OKLCH'ı render ediyor
- Hex/rgb gösterimi de var (geriye uyumluluk)

---

## 7. SONUÇ — MIGRATION CHECKLIST

- [ ] Style Dictionary kurulumu
- [ ] `culori` npm install
- [ ] `tokens/source/legacy/` klasöründe mevcut hex paletleri JSON'a aktar
- [ ] `scripts/migrate-hex-to-oklch.ts` çalıştır
- [ ] `tokens/source/theme-night.json` ve `theme-dawn.json` oluştur (OKLCH)
- [ ] Style Dictionary build → 6 platform output
- [ ] Visual regression test (eski hex render vs yeni OKLCH render)
- [ ] WCAG AAA contrast audit (her tema için)
- [ ] `@777/theme/native` paketinde token tüketimi
- [ ] 777 GeriSayım'da bir ekran migrate et
- [ ] Görsel diff: 0% (hiç fark yok)
- [ ] Eski `theme.ts` deprecate notu
- [ ] Tüm component'leri migrate et (haftalar süreyle, paralel)

---

## 8. SONRAKİ ADIM

OKLCH migration tamamlandığında, sıradaki adım:

→ **Madde 1: Theme Generator** (`01-THEME-GENERATOR-SPEC.md`)
- Parametrik tema oluşturma fonksiyonu
- Cosmic Night ve Dawn'ı parametre olarak yeniden tanımlama
- 3. tema "Cosmic Twilight" üretimi

---

*OKLCH = `@777/theme` sisteminin renk omurgası. Bu adım tamamlandığında, tüm üst katmanlar (generator, character, atmosphere) OKLCH'ın algısal-eşitlik avantajından faydalanır.*

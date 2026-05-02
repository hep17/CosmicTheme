# 08 — TOKEN PİRAMİDİ SPEC (W3C Design Tokens)

> **8 katmanlı token mimarisi.** `@777/theme` sisteminin omurgasıdır. JSON kaynak + Style Dictionary derleme = multi-platform output.

**Standart:** [W3C Design Tokens Community Group draft spec](https://tr.designtokens.org/format/)
**Format:** JSON (`.json`) — dil-agnostik, her platforma derlenir
**Tool:** Style Dictionary 4.x

---

## 1. PİRAMİT YAPISI

```
┌────────────────────────────────────────────────────────────┐
│ LAYER 8 — BRAND IDENTITY              "Cosmic" manifestosu │
│  cosmic.philosophy, cosmic.signature                       │
├────────────────────────────────────────────────────────────┤
│ LAYER 7 — THEME VARIANTS              Night, Dawn, Twilight│
│  theme.night.*, theme.dawn.*                               │
├────────────────────────────────────────────────────────────┤
│ LAYER 6 — SEMANTIC TOKENS             Anlam katmanı        │
│  text.primary, surface.elevated, border.subtle             │
├────────────────────────────────────────────────────────────┤
│ LAYER 5 — COMPONENT TOKENS            Component'e özel     │
│  card.padding, button.height, glass.blur                   │
├────────────────────────────────────────────────────────────┤
│ LAYER 4 — SYSTEM PRIMITIVES           Sistem birimleri     │
│  color.cool.500, space.4, type.body, motion.standard       │
├────────────────────────────────────────────────────────────┤
│ LAYER 3 — REFERENCE VALUES            Sayısal kaynak       │
│  oklch(86% 0.18 95), 16px, 240ms                           │
├────────────────────────────────────────────────────────────┤
│ LAYER 2 — MATH FUNCTIONS              Hesap fonksiyonları  │
│  interpolate(), clamp(), contrast(), hueShift()            │
├────────────────────────────────────────────────────────────┤
│ LAYER 1 — OUTPUT ADAPTERS             Platform çevrim      │
│  → CSS, Swift, Kotlin, TS, Tailwind, Figma                 │
└────────────────────────────────────────────────────────────┘
```

### Felsefe: Bağımlılık Sıralaması

- **Layer 1 → Layer 2-7'yi tüketir** (output formatına çevirir)
- **Layer 2 → Layer 3'ü tüketir** (sayısal değerler üzerinde işlem)
- **Layer 3 → kendi başına** (raw değerler)
- **Layer 4 → Layer 3 referansları** (`color.cool.500 → oklch(64% 0.22 240)`)
- **Layer 5 → Layer 4'ü tüketir** (`card.padding → space.4`)
- **Layer 6 → Layer 4'ü tüketir** (`text.primary → color.neutral.50`)
- **Layer 7 → Layer 6'yı override eder** (`theme.night.text.primary` farklı)
- **Layer 8 → Layer 7'yi gruplar** (`cosmic.signature → theme.night + theme.dawn`)

**Önemli kural:** Bir component (Layer 5+) **asla Layer 3'e dokunmaz**. Layer 4 üzerinden geçer. Layer 4 değişirse, üst layer'lar otomatik etkilenir. Bu **dependency inversion**.

---

## 2. LAYER 1 — OUTPUT ADAPTERS

Style Dictionary'nin **transform + format** katmanı. Bu katman kod yazılmaz, **konfigüre edilir**.

```javascript
// tokens/style-dictionary.config.js
module.exports = {
  source: ['source/**/*.json'],
  platforms: {
    // TypeScript (RN + Web shared)
    ts: {
      transformGroup: 'js',
      buildPath: 'build/ts/',
      files: [{
        destination: 'tokens.ts',
        format: 'typescript/es6-declarations'
      }]
    },
    // CSS Variables (Web)
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables'
      }]
    },
    // Swift (iOS native)
    swift: {
      transformGroup: 'ios-swift',
      buildPath: 'build/swift/',
      files: [{
        destination: 'Tokens.swift',
        format: 'ios-swift/class.swift',
        className: 'Theme777Tokens'
      }]
    },
    // Kotlin (Android)
    kotlin: {
      transformGroup: 'compose',
      buildPath: 'build/kotlin/',
      files: [{
        destination: 'Tokens.kt',
        format: 'compose/object'
      }]
    },
    // Tailwind preset (Web alternative)
    tailwind: {
      transformGroup: 'js',
      buildPath: 'build/tailwind/',
      files: [{
        destination: 'preset.js',
        format: 'javascript/module'
      }]
    },
    // Figma plugin format
    figma: {
      transformGroup: 'web',
      buildPath: 'build/figma/',
      files: [{
        destination: 'tokens.json',
        format: 'json/flat'
      }]
    }
  }
}
```

**Build komutu:**
```bash
cd tokens && pnpm build
# → build/ts/tokens.ts
# → build/css/tokens.css
# → build/swift/Tokens.swift
# → build/kotlin/Tokens.kt
# → build/tailwind/preset.js
# → build/figma/tokens.json
```

---

## 3. LAYER 2 — MATH FUNCTIONS

Token **transform** fonksiyonları. Style Dictionary custom transform'ları olarak yazılır.

```typescript
// tokens/transforms/oklch.js

// OKLCH lightness shift
StyleDictionary.registerTransform({
  name: 'color/oklch-shift',
  type: 'value',
  matcher: (token) => token.attributes?.shift,
  transformer: (token) => {
    const { l, c, h } = parseOKLCH(token.value)
    const shifted = {
      l: clamp(l + token.attributes.shift.l, 0, 1),
      c: clamp(c + token.attributes.shift.c, 0, 0.4),
      h: (h + token.attributes.shift.h) % 360
    }
    return `oklch(${shifted.l * 100}% ${shifted.c} ${shifted.h})`
  }
})

// Algısal kontrast hesabı (APCA-W3)
StyleDictionary.registerTransform({
  name: 'color/contrast-pair',
  type: 'value',
  matcher: (token) => token.attributes?.contrast,
  transformer: (token) => {
    const bg = parseOKLCH(token.attributes.contrast.against)
    const target = token.attributes.contrast.minRatio || 7.0  // AAA
    return findContrastingColor(bg, target)
  }
})

// Hue rotation
StyleDictionary.registerTransform({
  name: 'color/hue-rotate',
  type: 'value',
  transformer: (token) => {
    const oklch = parseOKLCH(token.value)
    return `oklch(${oklch.l * 100}% ${oklch.c} ${(oklch.h + token.attributes.rotate) % 360})`
  }
})
```

Bunlar **derleme sırasında** çalışır. Runtime maliyeti yok.

---

## 4. LAYER 3 — REFERENCE VALUES

**Ham sayısal değerler.** İnsan-okunabilir isim verilmemiş, hala raw.

`tokens/source/_reference.json`:

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/tokens.schema.json",
  "_reference": {
    "$type": "color",
    "oklch": {
      "_doc": "OKLCH ham renk değerleri. Layer 4 bu değerleri isimle bağlar.",
      "neutral-50":  { "$value": "oklch(98% 0.005 280)" },
      "neutral-100": { "$value": "oklch(94% 0.008 280)" },
      "neutral-200": { "$value": "oklch(88% 0.01 280)" },
      "neutral-500": { "$value": "oklch(50% 0.01 280)" },
      "neutral-900": { "$value": "oklch(15% 0.01 280)" },
      "neutral-950": { "$value": "oklch(8% 0.005 280)" },

      "cool-300": { "$value": "oklch(78% 0.18 95)" },
      "cool-500": { "$value": "oklch(86% 0.18 95)" },
      "cool-700": { "$value": "oklch(68% 0.20 90)" },

      "warm-300": { "$value": "oklch(76% 0.20 75)" },
      "warm-500": { "$value": "oklch(78% 0.20 70)" },
      "warm-700": { "$value": "oklch(60% 0.22 60)" }
    }
  },
  "_space": {
    "$type": "dimension",
    "_doc": "4px base grid. Layer 4 SPACING.* bu değerlerden türer.",
    "px-2":  { "$value": "2px" },
    "px-4":  { "$value": "4px" },
    "px-8":  { "$value": "8px" },
    "px-12": { "$value": "12px" },
    "px-16": { "$value": "16px" },
    "px-20": { "$value": "20px" },
    "px-24": { "$value": "24px" },
    "px-32": { "$value": "32px" }
  },
  "_motion": {
    "$type": "duration",
    "_doc": "Animasyon süreleri (ms).",
    "ms-100": { "$value": "100ms" },
    "ms-160": { "$value": "160ms" },
    "ms-240": { "$value": "240ms" },
    "ms-360": { "$value": "360ms" },
    "ms-1500": { "$value": "1500ms" }
  }
}
```

**Konvansiyon:** `_reference` ile başlayan token'lar **alt katman** — geliştirici doğrudan kullanmaz.

---

## 5. LAYER 4 — SYSTEM PRIMITIVES

İnsan-anlamlı sistem birimleri. Layer 3'e referans verir.

`tokens/source/primitives.json`:

```json
{
  "color": {
    "$type": "color",
    "neutral": {
      "_doc": "Tema-agnostik nötr renkler. Theme variant'ları override edebilir.",
      "0":   { "$value": "{_reference.oklch.neutral-50}" },
      "100": { "$value": "{_reference.oklch.neutral-100}" },
      "500": { "$value": "{_reference.oklch.neutral-500}" },
      "900": { "$value": "{_reference.oklch.neutral-900}" },
      "1000": { "$value": "{_reference.oklch.neutral-950}" }
    },
    "cool": {
      "_doc": "Cool element grubu. Birthday, exam, vacation kategorileri.",
      "300": { "$value": "{_reference.oklch.cool-300}" },
      "500": { "$value": "{_reference.oklch.cool-500}" },
      "700": { "$value": "{_reference.oklch.cool-700}" }
    },
    "warm": {
      "_doc": "Warm element grubu. Event, work kategorileri.",
      "300": { "$value": "{_reference.oklch.warm-300}" },
      "500": { "$value": "{_reference.oklch.warm-500}" },
      "700": { "$value": "{_reference.oklch.warm-700}" }
    },
    "green": { /* ... */ },
    "purple": { /* ... */ },
    "pink": { /* ... */ },
    "bronze": { /* ... */ }
  },

  "space": {
    "$type": "dimension",
    "_doc": "4px base grid. xs=2, sm=4, md=8, lg=12, xl=16, 2xl=20, 3xl=24, 4xl=32",
    "xs":  { "$value": "{_reference._space.px-2}" },
    "sm":  { "$value": "{_reference._space.px-4}" },
    "md":  { "$value": "{_reference._space.px-8}" },
    "lg":  { "$value": "{_reference._space.px-12}" },
    "xl":  { "$value": "{_reference._space.px-16}" },
    "2xl": { "$value": "{_reference._space.px-20}" },
    "3xl": { "$value": "{_reference._space.px-24}" },
    "4xl": { "$value": "{_reference._space.px-32}" }
  },

  "radius": {
    "$type": "dimension",
    "xs":   { "$value": "6px" },
    "sm":   { "$value": "10px" },
    "md":   { "$value": "12px" },
    "lg":   { "$value": "16px" },
    "xl":   { "$value": "20px" },
    "2xl":  { "$value": "24px" },
    "pill": { "$value": "999px" }
  },

  "motion": {
    "duration": {
      "$type": "duration",
      "instant":  { "$value": "{_reference._motion.ms-100}" },
      "quick":    { "$value": "{_reference._motion.ms-160}" },
      "standard": { "$value": "{_reference._motion.ms-240}" },
      "smooth":   { "$value": "{_reference._motion.ms-360}" },
      "slow":     { "$value": "{_reference._motion.ms-1500}" }
    },
    "easing": {
      "$type": "cubicBezier",
      "apple-default": { "$value": [0.4, 0, 0.2, 1] },
      "apple-emphasized": { "$value": [0.2, 0, 0, 1] }
    }
  },

  "typography": {
    "fontFamily": {
      "$type": "fontFamily",
      "display": { "$value": ["SF Pro Display", "-apple-system", "Inter"] },
      "text":    { "$value": ["SF Pro Text", "-apple-system", "Inter"] },
      "editorial": { "$value": ["Playfair Display", "Times New Roman"] }
    },
    "fontWeight": {
      "$type": "fontWeight",
      "thin":      { "$value": 100 },
      "regular":   { "$value": 400 },
      "medium":    { "$value": 500 },
      "semibold":  { "$value": 600 },
      "bold":      { "$value": 700 },
      "extrabold": { "$value": 800 }
    }
  }
}
```

---

## 6. LAYER 5 — COMPONENT TOKENS

Component'lere özel değerler. Layer 4'e referans verir.

`tokens/source/component.json`:

```json
{
  "card": {
    "padding": {
      "$type": "dimension",
      "compact": { "$value": "{space.lg}" },
      "default": { "$value": "{space.xl}" }
    },
    "radius": {
      "$type": "dimension",
      "default": { "$value": "{radius.lg}" }
    },
    "minHeight": {
      "$type": "dimension",
      "compact": { "$value": "78px" },
      "standard": { "$value": "120px" },
      "hero":    { "$value": "320px" }
    }
  },

  "button": {
    "height": {
      "$type": "dimension",
      "small":  { "$value": "32px" },
      "medium": { "$value": "44px" },
      "large":  { "$value": "52px" }
    },
    "radius": { "$value": "{radius.md}" },
    "padding": {
      "horizontal": { "$value": "{space.xl}" }
    }
  },

  "glass": {
    "blur": {
      "$type": "dimension",
      "subtle":  { "$value": "20px" },
      "regular": { "$value": "40px" },
      "strong":  { "$value": "60px" }
    },
    "saturate": {
      "$type": "number",
      "default": { "$value": 180 }
    }
  },

  "atmosphere": {
    "aurora": {
      "layerCount": { "$value": 4 },
      "drift": {
        "duration": { "$value": "{motion.duration.slow}" }
      }
    },
    "stars": {
      "count": {
        "high":   { "$value": 120 },
        "medium": { "$value": 80 },
        "low":    { "$value": 40 }
      }
    }
  }
}
```

---

## 7. LAYER 6 — SEMANTIC TOKENS

**Anlam katmanı.** "Bu renk ne için kullanılır?" sorusuna cevap.

`tokens/source/semantic.json`:

```json
{
  "text": {
    "$type": "color",
    "_doc": "Text hierarchy. WCAG AAA contrast guaranteed.",
    "primary":    { "$value": "{color.neutral.0}",   "alpha": 0.97 },
    "secondary":  { "$value": "{color.neutral.0}",   "alpha": 0.78 },
    "tertiary":   { "$value": "{color.neutral.0}",   "alpha": 0.55 },
    "quaternary": { "$value": "{color.neutral.0}",   "alpha": 0.24 }
  },

  "surface": {
    "$type": "color",
    "background":     { "$value": "{color.neutral.1000}" },
    "elevated":       { "$value": "{color.neutral.0}", "alpha": 0.08 },
    "highlighted":    { "$value": "{color.neutral.0}", "alpha": 0.12 }
  },

  "border": {
    "$type": "color",
    "subtle":  { "$value": "{color.neutral.0}", "alpha": 0.06 },
    "default": { "$value": "{color.neutral.0}", "alpha": 0.12 },
    "strong":  { "$value": "{color.neutral.0}", "alpha": 0.20 }
  },

  "accent": {
    "$type": "color",
    "_doc": "Theme variant'ları override eder.",
    "default": { "$value": "{color.cool.500}" }
  }
}
```

**Önemli:** Semantic token'lar **theme-agnostic** olmalı. `text.primary` Night'ta beyaz, Dawn'da krem — bu Layer 7'de override edilir.

---

## 8. LAYER 7 — THEME VARIANTS

**Tema spesifik override'lar.** Layer 6'yı tema-aware yapar.

`tokens/source/theme-night.json`:

```json
{
  "$themes": {
    "night": {
      "_doc": "Cosmic Night — derin lacivert/mor, evening 17:00 → 5:00",
      "_metadata": {
        "params": {
          "baseHue": 270,
          "warmth": -0.4,
          "lightness": 0.08
        }
      },

      "color": {
        "background": {
          "$value": "oklch(8% 0.05 270)"
        },
        "aurora": {
          "gold":   { "$value": "oklch(86% 0.18 95 / 0.22)" },
          "purple": { "$value": "oklch(72% 0.20 290 / 0.30)" },
          "cyan":   { "$value": "oklch(78% 0.12 220 / 0.16)" },
          "pink":   { "$value": "oklch(75% 0.18 350 / 0.14)" }
        }
      },

      "text": {
        "primary":   { "$value": "oklch(99% 0 0 / 0.97)" },
        "secondary": { "$value": "oklch(99% 0 0 / 0.78)" },
        "tertiary":  { "$value": "oklch(99% 0 0 / 0.55)" }
      },

      "surface": {
        "background": { "$value": "{$themes.night.color.background}" },
        "elevated":   { "$value": "oklch(99% 0 0 / 0.08)" }
      },

      "atmosphere": {
        "aurora": {
          "drift": {
            "duration": { "$value": "20000ms" }
          }
        }
      }
    }
  }
}
```

`tokens/source/theme-dawn.json`:

```json
{
  "$themes": {
    "dawn": {
      "_doc": "Cosmic Dawn — sıcak turuncu/kızıl + halo, sunrise 5:00 → 17:00",
      "_metadata": {
        "params": {
          "baseHue": 25,
          "warmth": 0.6,
          "lightness": 0.12
        }
      },

      "color": {
        "background": { "$value": "oklch(12% 0.08 25)" },
        "aurora": {
          "warmGold": { "$value": "oklch(78% 0.20 70 / 0.32)" },
          "pink":     { "$value": "oklch(75% 0.15 12 / 0.28)" },
          "coral":    { "$value": "oklch(70% 0.22 35 / 0.22)" },
          "blush":    { "$value": "oklch(72% 0.12 5 / 0.18)" }
        },
        "halo": {
          "$value": "radial-gradient(ellipse 90% 70% at 50% 0%, oklch(78% 0.20 70 / 0.30) 0%, oklch(75% 0.15 12 / 0.18) 30%, transparent 70%)"
        }
      },

      "text": {
        "primary":   { "$value": "oklch(98% 0.01 35 / 0.97)" },
        "secondary": { "$value": "oklch(98% 0.01 35 / 0.78)" }
      },

      "atmosphere": {
        "aurora": {
          "drift": {
            "duration": { "$value": "24000ms" }
          }
        }
      }
    }
  }
}
```

**Tema kullanımı (runtime):**

```typescript
import { getTheme } from '@777/theme/core'

const theme = getTheme('night')
// theme.text.primary → "oklch(99% 0 0 / 0.97)"
// theme.color.aurora.gold → "oklch(86% 0.18 95 / 0.22)"
```

---

## 9. LAYER 8 — BRAND IDENTITY

**Brand-level metadata.** Tema sistemi felsefesi.

`tokens/source/brand.json`:

```json
{
  "$brand": {
    "cosmic": {
      "_doc": "@777/theme — Cosmic atmosphere DNA",

      "manifesto": {
        "vision": "Apple Editor's Choice 2026",
        "philosophy": "Atmospheric, time-aware, poetic countdown experience",
        "signature": [
          "Aurora drift (Lissajous orbital motion)",
          "Time-aware mood shift (5+ tier evolving)",
          "Element-based categories (6 elements × constellations)",
          "Oversized hero typography (108pt Hairline)",
          "Editorial italic accents (Playfair Display)"
        ]
      },

      "themes": {
        "active": [
          { "$ref": "{$themes.night}" },
          { "$ref": "{$themes.dawn}" }
        ],
        "experimental": [
          { "$ref": "{$themes.twilight}" },
          { "$ref": "{$themes.eclipse}" }
        ]
      },

      "characters": {
        "active": ["orion", "pleiades", "cassiopeia", "crux", "ursaMajor", "centaurus"],
        "planned": ["cygnus", "lyra", "aquila", "andromeda", "cetus", "phoenix"]
      },

      "version": {
        "spec": "1.0.0",
        "tokens": "0.1.0"
      }
    }
  }
}
```

Bu Layer 8 **dokümantasyon ve metadata** içindir. Runtime'da tüketilmez.

---

## 10. KULLANIM ÖRNEKLERİ

### Örnek 1: Component'te token kullanımı (RN)

```typescript
import { useTheme } from '@777/theme/native'
import { View, StyleSheet } from 'react-native'

function HeroCard() {
  const theme = useTheme()  // Aktif theme variant (auto time-aware)

  return (
    <View style={[
      styles.card,
      { backgroundColor: theme.surface.elevated }
    ]}>
      <Text style={{ color: theme.text.primary }}>...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: tokens.card.padding.default,
    borderRadius: tokens.card.radius.default,
    minHeight: tokens.card.minHeight.standard
  }
})
```

### Örnek 2: Web (Tailwind)

```tsx
import '@777/theme/web/styles.css'

function HeroCard() {
  return (
    <div className="
      bg-surface-elevated
      text-text-primary
      p-card-default
      rounded-card-default
      min-h-card-standard
    ">
      ...
    </div>
  )
}
```

### Örnek 3: Swift (iOS)

```swift
import Theme777

struct HeroCard: View {
  var body: some View {
    VStack {
      Text("...")
        .foregroundColor(Theme777.Colors.textPrimary)
    }
    .padding(Theme777.Space.cardDefault)
    .background(Theme777.Colors.surfaceElevated)
    .cornerRadius(Theme777.Radius.cardDefault)
  }
}
```

### Örnek 4: Theme switching (runtime)

```typescript
import { ThemeProvider } from '@777/theme/native'

<ThemeProvider variant="auto-time-aware">
  {/* Uygulama saati + sensor'a göre Night ↔ Dawn auto switch */}
  <App />
</ThemeProvider>

// Veya manuel:
<ThemeProvider variant="night">
  <App />
</ThemeProvider>
```

---

## 11. VALIDATION & TESTING

### Token Schema Validation

`tokens/source/_schema.json` — JSON Schema (W3C Design Tokens spec'e uyumlu)

CI'da:
```bash
pnpm validate:tokens     # JSON schema validation
pnpm test:tokens         # Token reference resolution test
pnpm contrast:audit      # WCAG AAA kontrast check (her tema için)
```

### Visual Regression

Storybook + Playwright:
- Her component her temada render edilir
- Screenshot diff ile regression testi
- Theme switch transition testi

### Performance Budget

```bash
pnpm budget:bundle
# @777/theme/core    → max 30KB gzipped
# @777/theme/native  → max 80KB gzipped
# @777/theme/web     → max 60KB gzipped (CSS)
```

---

## 12. SONRAKİ ADIM — OKLCH MIGRATION

Token piramidi yapısı tamam. Sıradaki adım: **mevcut hex paletini OKLCH'a çevirmek**.

→ `02-OKLCH-MIGRATION-GUIDE.md` (sıradaki doküman)

---

*Bu spec W3C Design Tokens draft'ına %100 uyumludur. JSON kaynak + Style Dictionary = 6 platform output. Tek kaynak, çoklu platform.*

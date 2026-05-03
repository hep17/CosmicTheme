# 🌌 Cosmic Theme

> **Atmospheric · Time-aware · Poetic** — A React Native template with NASA-grade star rendering, 12 constellation characters, Liquid Glass cards, and a Turkish Mood Engine.

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

---

## 🚀 Quick Start

```bash
# 1. GitHub'da "Use this template" → yeni repo oluştur
# 2. Clone & install:
git clone https://github.com/YOUR_USERNAME/YOUR_APP.git
cd YOUR_APP
npm install

# 3. Çalıştır:
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # Web preview
```

Bitti — Cosmic atmosfer, 12 karakter, Liquid Glass kartlar hazır. ✨

---

## 🌠 What's Inside

### 12 Constellation Characters

Her karakter NASA spectral class'ına göre renk ve parlaklık alır:

| Character | Spectral | Color | Signature Star |
|-----------|----------|-------|---------------|
| 👑 Cassiopeia | K · Orange | `#FFD088` | Schedar |
| 🔥 Phoenix | K · Orange | `#FFD088` | Ankaa |
| 🎵 Lyra | A · White | `#C8DFFF` | Vega |
| 🏹 Orion | M · Red Giant | `#FFB888` | Betelgeuse |
| 🌊 Pleiades | B · Blue-white | `#B8D4FF` | Alcyone |
| ✝️ Crux | B · Blue-white | `#B8D4FF` | Acrux |
| 🐻 Ursa Major | A · White | `#C8DFFF` | Dubhe |
| ⚡ Centaurus | G · Yellow | `#FFE5B0` | Rigil Kentaurus |
| 🦢 Cygnus | A · White | `#C8DFFF` | Deneb |
| 🦅 Aquila | A · White | `#C8DFFF` | Altair |
| 🌀 Andromeda | B · Blue-white | `#B8D4FF` | Alpheratz |
| 🐋 Cetus | K · Orange | `#FFD088` | Menkar |

### 🃏 Liquid Glass Cards (`GlassCard`)

```tsx
import { GlassCard } from './theme';

<GlassCard padding="lg" radius="xl" intensity="standard">
  <Text>Your content here</Text>
</GlassCard>
```

4-layer Skia rendering: BackdropBlur → surface tint → inner border → edge highlight.
Reduce Transparency erişilebilirlik desteği dahil.

### ⭐ Star Field (`Stars`)

```tsx
import { Stars } from './theme';

<Stars density="lush" speed="slow" variant="night" />
```

Seeded-random deterministic pozisyonlar. Her yıldız 4-layer NASA glow + twinkle animasyonu.

### 🌌 Cosmic Atmosphere (`CosmicAtmosphere`)

```tsx
import { CosmicAtmosphere } from './theme/components/CosmicAtmosphere';

<CosmicAtmosphere variant="night" density="standard">
  {/* your app */}
</CosmicAtmosphere>
```

Aurora drift, parallax yıldız katmanları, GPU-accelerated Skia canvas.

### 💬 Mood Engine (`generateEyebrow`)

```tsx
import { generateEyebrow } from './theme';
import { CHARACTERS } from './theme/characters';

const result = generateEyebrow({
  category: 'birthday',
  daysLeft: 12,
  character: CHARACTERS['cassiopeia'],
});
// → { text: "12 gün sonra o an gelecek, 👑 hazır", tone: "reflective", source: "corpus" }
```

14 kategori, 5 zaman dilimi, 56+ Türkçe cümle. Her karakter kendi sesini konuşur.

---

## 📁 Project Structure

```
cosmic-theme/
├── App.tsx                         # Demo showcase (12 characters + 3 hero cards)
├── theme/
│   ├── index.ts                    # Public API — import everything from here
│   ├── colors.ts                   # OKLCH color palettes (Night + Dawn)
│   ├── tokens.ts                   # Design tokens (spacing, radius, typography)
│   ├── characters/                 # 12 constellation characters
│   │   ├── index.ts                # CHARACTERS record
│   │   ├── types.ts                # TypeScript types
│   │   └── *.ts                    # Individual character files
│   ├── components/
│   │   ├── CosmicAtmosphere.tsx    # Aurora + parallax wrapper
│   │   ├── CosmicCharacter.tsx     # 4-layer NASA star render
│   │   ├── GlassCard.tsx           # Liquid Glass card
│   │   └── Stars.tsx               # Foreground star field
│   ├── mood/
│   │   ├── generator.ts            # generateEyebrow() pure function
│   │   ├── corpus.ts               # 56+ Turkish phrases
│   │   └── types.ts                # MoodContext, EyebrowResult types
│   └── utils/
│       ├── oklch.ts                # OKLCH ↔ hex conversion (culori)
│       └── contrast.ts             # WCAG contrast ratio helpers
└── docs/                           # 10 detailed spec documents (~8,240 lines)
```

---

## 🎨 Theme System

### Color Tokens

```tsx
import { COSMIC_NIGHT, TOKENS } from './theme';

// Aurora colors
COSMIC_NIGHT.aurora.gold     // #FFC93C
COSMIC_NIGHT.aurora.purple   // #B888FF
COSMIC_NIGHT.aurora.cyan     // #67B7E3

// Glass surface
COSMIC_NIGHT.glass.surface   // rgba(255,255,255,0.06)
COSMIC_NIGHT.glass.border    // rgba(255,255,255,0.10)

// Design tokens
TOKENS.spacing[4]            // 16
TOKENS.radius.xl             // 20
TOKENS.duration.normal       // 250
```

### Available Theme Variants

| Variant | Hue | Status |
|---------|-----|--------|
| Cosmic Night | 280° (deep purple) | ✅ Active |
| Cosmic Dawn | 30° (warm amber) | ✅ Active |
| Twilight | 250° | 🔜 v0.2.0 |
| Eclipse | 220° | 🔜 v0.2.0 |
| Aurora | 160° | 🔜 v0.2.0 |

---

## 🗺️ Roadmap

### v0.1.0 ✅ (Current — Template Ready)
- [x] OKLCH color system + 5 theme variants
- [x] 12 characters with NASA spectral class
- [x] CosmicAtmosphere (aurora drift + parallax)
- [x] CosmicCharacter (4-layer NASA glow)
- [x] GlassCard (Liquid Glass, 4 Skia layers)
- [x] Stars (seeded random, twinkle animation)
- [x] Mood Engine (TR corpus, 56+ phrases, 14 categories)

### v0.2.0 (Next)
- [ ] Reactive sensors (gyroscope, scroll velocity)
- [ ] State machines (countdown-aware animations)
- [ ] Circadian 30+ tier (time-of-day palette shift)
- [ ] All 5 theme variants live

### v0.3.0
- [ ] Apple Foundation Models integration
- [ ] Multi-language Mood Engine (6 languages)
- [ ] Rumination Arc 5-layer cards

### v0.4.0
- [ ] Live Activities (Lock Screen)
- [ ] Apple Watch complications
- [ ] StandBy mode widget
- [ ] Voice commands (Siri integration)

---

## 🛠️ Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| Expo SDK | 54+ | Framework |
| React Native | 0.81+ | Runtime |
| react-native-reanimated | 3.19+ | UI thread animations |
| @shopify/react-native-skia | 1.7+ | GPU graphics |
| culori | latest | OKLCH color science |
| expo-sensors | latest | Gyroscope, ambient light (v0.2.0) |

---

## 📚 Documentation

`docs/` klasöründe 10 detaylı spec (~8.240 satır):

| File | Topic |
|------|-------|
| `00-MASTER-PLAN.md` | Overall vision & roadmap |
| `01-THEME-GENERATOR-SPEC.md` | Parametric theme generation |
| `02-OKLCH-MIGRATION-GUIDE.md` | Color space conversion |
| `03-CHARACTER-SYSTEM-SPEC.md` | 12 characters DNA (most important) |
| `04-REACTIVE-ATMOSPHERE.md` | Sensor-aware aurora |
| `05-MOOD-ENGINE-SPEC.md` | Eyebrow generator + Foundation Models |
| `06-RUMINATION-ARC-SPEC.md` | 5-layer card system |
| `07-PACKAGE-DISTRIBUTION.md` | NPM monorepo setup |
| `08-TOKEN-PYRAMID-SPEC.md` | W3C Design Tokens architecture |
| `09-EXTRAS-SPEC.md` | 8 Editor's Choice features |

---

## 📜 License

MIT — Use freely in your apps.

---

## 🙏 Credits

**Made with ❤️ by [@hep17](https://github.com/hep17)**

Inspired by Apple Design Awards 2026 winners, NASA spectral class data,
IAU constellation atlas, and the cosmic poetry of Carl Sagan.

---

<sub>🌌 Atmospheric · ⏰ Time-aware · 📜 Poetic</sub>

# 07 — PACKAGE DISTRIBUTION SPEC

> **`@777/theme` artık birden fazla projede kullanılabilen NPM paketi.** iOS, Android, Web, Figma — tek kaynak, çoklu platform.

**Hafta:** 8
**Bağımlılık:** Tüm önceki maddeler (1-6)
**Çıktı:** NPM yayınlanmış paketler + dokümantasyon site + Figma library

---

## 1. PAKET YAPISI

### 1.1 NPM Scope: @777

```
@777/theme/core         → Token tanımları + generator + character + mood (5KB)
@777/theme/native       → React Native components (80KB)
@777/theme/web          → Web components (60KB)
@777/theme/swift        → SwiftUI ViewModifiers (Cocoapods/SPM)
@777/theme/kotlin       → Jetpack Compose (Maven)
@777/theme/figma        → Figma Variables sync plugin
@777/theme/generator    → Theme generator standalone
@777/theme/mood         → Mood engine standalone
@777/theme/atmosphere   → Reactive sensor binding
@777/theme/characters   → 12 character SVG sprites + DNA
```

### 1.2 Monorepo Yapısı

```
777-theme/                          # Root monorepo
├── pnpm-workspace.yaml
├── package.json
├── turbo.json                      # Turborepo task orchestration
├── tsconfig.json                   # Shared TypeScript config
│
├── tokens/                         # JSON source (W3C Design Tokens)
│   ├── source/
│   │   ├── primitives.json
│   │   ├── semantic.json
│   │   ├── component.json
│   │   ├── character.json
│   │   ├── theme-night.json
│   │   ├── theme-dawn.json
│   │   └── theme-twilight.json
│   ├── build/                      # Style Dictionary outputs
│   │   ├── ts/, css/, swift/, kotlin/, tailwind/, figma/
│   ├── style-dictionary.config.js
│   └── package.json
│
├── packages/                       # Distribution packages
│   ├── core/
│   ├── native/
│   ├── web/
│   ├── swift/
│   ├── kotlin/
│   ├── generator/
│   ├── mood/
│   ├── atmosphere/
│   ├── characters/
│   └── figma/
│
├── apps/                           # Test/showcase
│   ├── playground/                 # Theme preview (Vite)
│   ├── docs/                       # Documentation site (Nextra)
│   └── storybook/                  # Component preview
│
├── examples/                       # Reference integrations
│   ├── 777-gerisayim/              # Original implementation
│   └── nightfall/                  # Sleep tracker example
│
├── .changeset/                     # Versionlama
└── .github/workflows/
    ├── ci.yml
    └── release.yml
```

### 1.3 pnpm Workspace Config

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'examples/*'
  - 'tokens'
```

---

## 2. PAKET DETAYI: @777/theme/core

### 2.1 Yapı

```
packages/core/
├── src/
│   ├── tokens.ts                   # Token type definitions + auto-generated
│   ├── generator.ts                # generateCosmicTheme()
│   ├── characters.ts               # CHARACTERS object + selectCharacter()
│   ├── mood.ts                     # generateEyebrow() + composeFromCorpus()
│   ├── corpus/
│   │   ├── tr.json
│   │   ├── en.json
│   │   ├── es.json
│   │   ├── de.json
│   │   ├── fr.json
│   │   └── ar.json
│   ├── utils/
│   │   ├── oklch.ts
│   │   ├── contrast.ts
│   │   └── interpolation.ts
│   └── index.ts                    # Public API exports
├── tsup.config.ts                  # Build config
├── package.json
└── README.md
```

### 2.2 package.json

```json
{
  "name": "@777/theme/core",
  "version": "1.0.0",
  "description": "Cosmic theme system — tokens, generator, mood, characters",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./generator": "./dist/generator.mjs",
    "./characters": "./dist/characters.mjs",
    "./mood": "./dist/mood.mjs"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest"
  },
  "dependencies": {
    "culori": "^4.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "vitest": "^2.0.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

### 2.3 Public API

```typescript
// packages/core/src/index.ts

// Tokens
export { tokens } from './tokens'
export type { CosmicTheme, ThemeVariant } from './tokens'

// Generator
export { generateCosmicTheme } from './generator'
export type { CosmicThemeParams } from './generator'

// Characters
export { CHARACTERS, selectCharacter } from './characters'
export type { ThemeCharacter, CharacterId } from './characters'

// Mood
export { generateEyebrow, composeFromCorpus } from './mood'
export type { MoodContext } from './mood'

// Helpers
export { contrastRatio, interpolateOklch } from './utils'
```

---

## 3. PAKET DETAYI: @777/theme/native

### 3.1 Yapı

```
packages/native/
├── src/
│   ├── components/
│   │   ├── Surface.tsx
│   │   ├── Text.tsx
│   │   ├── GlassCard.tsx
│   │   ├── Button.tsx
│   │   ├── Stars.tsx
│   │   ├── CosmicAtmosphere.tsx
│   │   ├── CosmicCharacter.tsx
│   │   └── RuminationCard.tsx
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useToken.ts
│   │   ├── useAuroraSensors.ts
│   │   ├── useMood.ts
│   │   └── useRuminationLevel.ts
│   ├── providers/
│   │   └── ThemeProvider.tsx
│   └── index.ts
├── package.json
└── README.md
```

### 3.2 package.json

```json
{
  "name": "@777/theme/native",
  "version": "1.0.0",
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.74.0",
    "react-native-reanimated": ">=4.0.0",
    "react-native-skia": ">=2.0.0",
    "expo-sensors": "*"
  },
  "dependencies": {
    "@777/theme/core": "workspace:*"
  }
}
```

### 3.3 Public API Örneği

```typescript
import { 
  ThemeProvider,
  useTheme,
  useToken,
  CosmicAtmosphere,
  CosmicCharacter,
  RuminationCard,
  GlassCard,
  Stars,
} from '@777/theme/native'

function App() {
  return (
    <ThemeProvider variant="auto-time-aware">
      <CosmicAtmosphere mode="reactive">
        <Stars density="auto" />
        <RuminationCard data={cardData} />
      </CosmicAtmosphere>
    </ThemeProvider>
  )
}
```

---

## 4. PAKET DETAYI: @777/theme/web

### 4.1 Tailwind Preset

```javascript
// packages/web/preset.js
const tokens = require('@777/theme/core/dist/tokens')

module.exports = {
  theme: {
    extend: {
      colors: {
        'cosmic-bg': tokens.theme.night.bg[1],
        'cosmic-aurora-gold': tokens.theme.night.aurora.gold,
        'cosmic-text-primary': tokens.theme.night.text.primary,
        // ... auto-generated from tokens
      },
      fontFamily: {
        display: tokens.typography.fontFamily.display,
        editorial: tokens.typography.fontFamily.editorial,
      },
      // ...
    }
  }
}
```

### 4.2 Kullanım (Next.js)

```javascript
// tailwind.config.js
module.exports = {
  presets: [require('@777/theme/web/preset')],
  content: ['./src/**/*.{ts,tsx}'],
}
```

```tsx
// pages/index.tsx
import { CosmicAtmosphere, RuminationCard } from '@777/theme/web'

export default function Home() {
  return (
    <CosmicAtmosphere theme="night" mode="reactive">
      <RuminationCard ... />
    </CosmicAtmosphere>
  )
}
```

### 4.3 React Components (RN ile aynı API)

```typescript
// packages/web/src/components/CosmicAtmosphere.tsx
// React Native API'sıyla aynı, ama web için

export function CosmicAtmosphere({ children, theme, mode }: Props) {
  return (
    <div className="cosmic-atmosphere">
      <div className="bg-gradient" style={{ background: theme.bg.gradient }} />
      <div className="aurora">
        {/* CSS @property animation, scroll-timeline */}
      </div>
      <div className="stars">{/* SVG starfield */}</div>
      {children}
    </div>
  )
}
```

---

## 5. PAKET DETAYI: @777/theme/swift

### 5.1 Swift Package Manager

```swift
// Package.swift
let package = Package(
    name: "Theme777",
    platforms: [.iOS(.v17)],
    products: [
        .library(name: "Theme777", targets: ["Theme777"]),
    ],
    targets: [
        .target(name: "Theme777", path: "Sources"),
    ]
)
```

### 5.2 Yapı

```
packages/swift/
├── Sources/
│   └── Theme777/
│       ├── Tokens.swift            # Auto-generated
│       ├── ViewModifiers/
│       │   ├── CosmicBackground.swift
│       │   ├── CosmicGlass.swift
│       │   └── CosmicCard.swift
│       ├── Components/
│       │   ├── CosmicAtmosphere.swift
│       │   └── RuminationCard.swift
│       └── Theme777.swift          # Public API
├── Package.swift
└── README.md
```

### 5.3 Kullanım

```swift
import SwiftUI
import Theme777

struct ContentView: View {
    var body: some View {
        VStack {
            Text("12 GÜN")
                .font(Theme777.typography.display)
                .foregroundColor(Theme777.colors.textPrimary)
        }
        .modifier(CosmicBackground(theme: .night))
        .modifier(CosmicGlass())
    }
}
```

---

## 6. PAKET DETAYI: @777/theme/kotlin

### 6.1 Maven Central / GitHub Packages

```kotlin
// build.gradle.kts
dependencies {
    implementation("dev.777.theme:theme-kotlin:1.0.0")
}
```

### 6.2 Yapı

```
packages/kotlin/
├── src/main/kotlin/
│   └── dev/777/theme/
│       ├── Tokens.kt               # Auto-generated
│       ├── modifiers/
│       │   ├── CosmicBackground.kt
│       │   └── CosmicGlass.kt
│       └── components/
│           ├── CosmicAtmosphere.kt
│           └── RuminationCard.kt
├── build.gradle.kts
└── README.md
```

### 6.3 Kullanım

```kotlin
@Composable
fun ContentScreen() {
    Box(modifier = Modifier.cosmicBackground(theme = Night)) {
        Text(
            text = "12 GÜN",
            style = Theme777.typography.display,
            color = Theme777.colors.textPrimary,
        )
    }
}
```

---

## 7. STYLE DICTIONARY BUILD PIPELINE

### 7.1 Konfigürasyon

```javascript
// tokens/style-dictionary.config.js
module.exports = {
  source: ['source/**/*.json'],
  platforms: {
    ts: { /* TypeScript output */ },
    css: { /* CSS variables */ },
    swift: { /* Swift constants */ },
    kotlin: { /* Compose Color objects */ },
    tailwind: { /* Tailwind preset */ },
    figma: { /* Figma JSON */ },
  }
}
```

### 7.2 Build Script

```json
// tokens/package.json
{
  "scripts": {
    "build": "style-dictionary build",
    "watch": "style-dictionary build --watch"
  }
}
```

### 7.3 CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
      
      - name: Install
        run: pnpm install
      
      - name: Build tokens
        run: pnpm --filter tokens build
      
      - name: Build packages
        run: pnpm turbo build
      
      - name: Test
        run: pnpm turbo test
      
      - name: Visual regression
        run: pnpm turbo storybook:test
```

---

## 8. VERSIONLAMA: CHANGESETS

### 8.1 Setup

```bash
pnpm add -DW @changesets/cli
pnpm changeset init
```

### 8.2 Workflow

```bash
# Geliştirici değişiklik yapar
git checkout -b feat/new-character
# ... kod değişiklikleri ...

# Changeset ekler
pnpm changeset
# Hangi paketler etkileniyor? (a/o/i)
# patch / minor / major?
# Açıklama?

# Commit + push + PR
git commit -m "feat: add Phoenix character"
git push
```

### 8.3 Release Process

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 8.4 Semver Stratejisi

| Değişiklik | Versiyon |
|---|---|
| Yeni karakter eklendi | minor (1.1.0) |
| Mevcut token rengi değişti | patch (1.0.1) |
| Token isim değişti (breaking) | major (2.0.0) |
| Bug fix | patch (1.0.1) |
| Yeni dil corpus | minor (1.1.0) |

---

## 9. DOCUMENTATION SITE

### 9.1 Stack: Nextra (Next.js based)

```
apps/docs/
├── pages/
│   ├── index.mdx                   # Landing
│   ├── getting-started/
│   │   ├── installation.mdx
│   │   ├── first-component.mdx
│   │   └── theme-switching.mdx
│   ├── api/
│   │   ├── tokens.mdx
│   │   ├── generator.mdx
│   │   ├── characters.mdx
│   │   └── mood.mdx
│   ├── recipes/
│   │   ├── custom-theme.mdx
│   │   ├── reactive-aurora.mdx
│   │   └── story-share.mdx
│   └── examples/
│       ├── 777-gerisayim.mdx
│       └── nightfall.mdx
├── theme.config.tsx
└── package.json
```

### 9.2 İçerik

```mdx
# Getting Started

## Installation

\`\`\`bash
pnpm add @777/theme/native
\`\`\`

## First Cosmic Card

\`\`\`tsx
import { ThemeProvider, RuminationCard } from '@777/theme/native'

function App() {
  return (
    <ThemeProvider variant="night">
      <RuminationCard data={{
        category: 'birthday',
        target: '2026-04-25',
        title: 'doğum günüme'
      }} />
    </ThemeProvider>
  )
}
\`\`\`

[Live Demo →](https://playground.777.dev)
```

### 9.3 Hosting

- Vercel (free tier)
- Custom domain: `theme.777.app` veya `cosmic.777.dev`

---

## 10. FIGMA PLUGIN

### 10.1 Token Sync

```typescript
// packages/figma/src/sync.ts
async function syncTokens() {
  const tokens = await loadFromGitHub('tokens/build/figma/tokens.json')
  
  for (const [name, value] of Object.entries(tokens)) {
    figma.variables.createVariable({
      name,
      value: parseValue(value),
      collection: 'Cosmic Theme',
    })
  }
  
  figma.notify(`${Object.keys(tokens).length} token sync edildi`)
}
```

### 10.2 Theme Switcher (Figma'da)

```typescript
// Plugin UI
<select onChange={switchTheme}>
  <option value="night">Cosmic Night</option>
  <option value="dawn">Cosmic Dawn</option>
  <option value="twilight">Cosmic Twilight</option>
</select>
```

Designer Figma'da tema değiştirir, tüm component'ler güncellenir.

### 10.3 Publish

```bash
# Figma Plugin Console
figma publish
# → @777-theme Figma plugin
```

Marketplace: `https://figma.com/community/plugin/777-theme`

---

## 11. STORYBOOK

### 11.1 Setup

```
apps/storybook/
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
├── stories/
│   ├── components/
│   │   ├── Surface.stories.tsx
│   │   ├── GlassCard.stories.tsx
│   │   ├── RuminationCard.stories.tsx
│   │   └── CosmicAtmosphere.stories.tsx
│   └── tokens/
│       ├── Colors.stories.tsx
│       └── Typography.stories.tsx
└── package.json
```

### 11.2 Story Örneği

```typescript
// stories/components/RuminationCard.stories.tsx
export default {
  title: 'Components/RuminationCard',
  component: RuminationCard,
  decorators: [
    (Story) => (
      <ThemeProvider variant="night">
        <CosmicAtmosphere>
          <Story />
        </CosmicAtmosphere>
      </ThemeProvider>
    )
  ]
}

export const Glance = {
  args: { forceLevel: 1, data: mockCardData }
}

export const Quick = {
  args: { forceLevel: 2, data: mockCardData }
}

export const Story = {
  args: { forceLevel: 4, data: mockCardData }
}

export const Reflect = {
  args: { forceLevel: 5, data: mockCardData }
}
```

### 11.3 Visual Regression

```bash
pnpm chromatic
# → Chromatic.com'da diff
```

Her PR'de otomatik visual diff. Tasarım kayması yakalanır.

---

## 12. EXAMPLES

### 12.1 777 GeriSayım (Reference)

```
examples/777-gerisayim/
├── App.tsx
├── components/
│   └── ListScreen.tsx
└── package.json
```

`@777/theme/native` kullanan reference implementation. Kullanıcılar inceler, "böyle yapılır" diye anlar.

### 12.2 NIGHTFALL (Sleep Tracker)

```
examples/nightfall/
├── App.tsx
└── package.json
```

Aynı tema sistemini farklı bir uygulamada kullanan örnek. Tema sisteminin **taşınabilirlik** kanıtı.

---

## 13. LAUNCH CHECKLIST

### 13.1 Pre-Launch

- [ ] Tüm paketler build geçiyor
- [ ] Test coverage >80%
- [ ] Visual regression sıfır
- [ ] Documentation site hazır
- [ ] 2 example uygulama (777 + NIGHTFALL)
- [ ] Figma plugin publish
- [ ] WCAG AAA audit geçti
- [ ] Performance benchmark (iPhone 12+, 120Hz)
- [ ] Storybook public
- [ ] Changelog hazır

### 13.2 Launch Day

- [ ] NPM publish (`pnpm release`)
- [ ] GitHub release tag (`v1.0.0`)
- [ ] Twitter announcement
- [ ] Producthunt submission
- [ ] Anthropic blog post
- [ ] Apple Editor's Choice submission

### 13.3 Post-Launch

- [ ] Discord/Slack community
- [ ] Issue tracker setup
- [ ] Roadmap publik
- [ ] Sponsor alımı (?)

---

## 14. FİYATLANDIRMA STRATEJİSİ

### 14.1 Open Source Core

```
@777/theme/* paketleri → MIT License
```

Ücretsiz, herkes kullanabilir. **Topluluk büyür.**

### 14.2 Premium Features (Ayrı paketler)

```
@777/theme-pro/customizer    → Theme generator UI ($29/lifetime)
@777/theme-pro/llm-mood      → GPT/Claude mood enhancement (subscription)
@777/theme-pro/figma         → Figma library access ($19/seat)
```

Ana sistem free, **gelişmiş tooling** ücretli.

### 14.3 Enterprise

```
@777/theme/enterprise       → Custom branding, white-label
                              ($499/year, dedicated support)
```

Şirketler için custom build.

---

## 15. SONRAKİ ADIM

Distribution tamam. **8 madde dokümantasyonu BİTTİ.**

Şimdi geçilecek faz: **IMPLEMENTATION**.

→ Adım adım kod yazımı:
1. Repo setup (monorepo + pnpm + Turborepo)
2. Token JSON'ları yaz
3. Style Dictionary build kurulum
4. `@777/theme/core` ilk versiyon
5. `@777/theme/native` component'leri
6. 777 GeriSayım'da migrate
7. NIGHTFALL örneği
8. NPM publish

---

## SONUÇ

Distribution ile:
- ✅ Monorepo yapısı (pnpm + Turborepo)
- ✅ 10 paket: core, native, web, swift, kotlin, generator, mood, atmosphere, characters, figma
- ✅ Style Dictionary multi-platform build
- ✅ Changesets versionlama
- ✅ Documentation site (Nextra)
- ✅ Storybook + visual regression
- ✅ Figma plugin
- ✅ 2 example app (777 + NIGHTFALL)
- ✅ MIT license + premium tier

**`@777/theme` artık birden fazla projede kullanılabilen profesyonel tema sistemi.**

---

*Distribution = tema sisteminin yayılması. Tek kaynak (JSON), 6 platform (TS/CSS/Swift/Kotlin/Tailwind/Figma), 10 NPM paketi, sınırsız uygulama.*

# @777/theme — TEMA SİSTEMİ MASTER PLAN

> **8 madde × 8 hafta yol haritası.** Mevcut Cosmic temayı **profesyonel tema sistemine** dönüştürmek için kapsamlı plan.

**Tarih:** Mayıs 2026
**Hedef:** `@777/theme` — birden fazla uygulamada kullanılabilir tema sistemi
**Platformlar:** iOS + Android + Web
**Format:** JSON source + Style Dictionary (multi-platform output)
**Standart:** Apple Editor's Choice 2026 tier · iOS 26 Liquid Glass · 2025-2026 cutting-edge

---

## TL;DR

```
HAFTA 1-2:  TEMEL          → OKLCH renk uzayı + Token Piramidi (8 layer)
HAFTA 3-4:  GENERATOR      → Parametrik tema oluşturma + NPM paketi
HAFTA 5-6:  AURORA + MOOD  → Content-aware atmosfer + Dynamic mood engine
HAFTA 7-8:  KARAKTER + ARC → Theme character system + Rumination arc kart
HAFTA 9+:   PRODUCTION     → Test, dokümantasyon, Figma plugin, launch
```

Her hafta sonunda **kontrol noktası** + **çalışan kod** olacak. Hiç boş hafta yok.

---

## İÇİNDEKİLER

1. [Vizyon ve Hedefler](#1-vizyon-ve-hedefler)
2. [Mimari Yaklaşım](#2-mimari-yaklaşım)
3. [Hafta Hafta Plan](#3-hafta-hafta-plan)
4. [8 Madde Detayı](#4-8-madde-detayı)
5. [Repo Yapısı](#5-repo-yapısı)
6. [Tooling Stack](#6-tooling-stack)
7. [Başarı Kriterleri](#7-başarı-kriterleri)

---

## 1. VİZYON VE HEDEFLER

### 1.1 Çekirdek Vizyon

> "**Cosmic** sadece bir tema değil, **uygulama bağımsız tasarım dili.** 777 GeriSayım, NIGHTFALL, gelecekteki her uygulama aynı atmosferik DNA ile çalışır."

### 1.2 Sistem Hedefleri

| Hedef | Mevcut | Sistem Sonrası |
|---|---|---|
| Tema sayısı | 2 (Night + Dawn) | Sınırsız (parametrik generator) |
| Platform desteği | React Native | iOS + Android + Web + tvOS-ready |
| Renk uzayı | sRGB hex | OKLCH (algısal eşit, P3 native) |
| Token kaynağı | TypeScript hardcoded | JSON + multi-platform derleme |
| Distribütör | Manuel kopyala | NPM paketi (`@777/theme`) |
| Atmosfer | Statik drift | Content-aware (sensor + scroll + theme) |
| Eyebrow | 5 sabit metin | Generator (200+ atomic phrase + LLM) |
| Karakter sistemi | 6 takımyıldız | 12+ character (emotion + motion + voice) |
| Kart anatomi | Tek görünüm | 5 katmanlı rumination arc |

### 1.3 Performans Hedefleri

| Metrik | Hedef |
|---|---|
| iPhone 12+ (A14+) frame rate | 120Hz sustained |
| Cold start theme load | < 50ms |
| Theme switch (Night ↔ Dawn) | < 1500ms cross-fade |
| Bundle size (`@777/theme/native`) | < 80KB gzipped |
| Battery impact (atmospheric idle) | < 3%/saat |
| WCAG kontrast | AAA (7:1 normal, 4.5:1 large text) |

---

## 2. MİMARİ YAKLAŞIM

### 2.1 Üç Katmanlı Mimari

```
┌─────────────────────────────────────────────────────┐
│ APPLICATION LAYER                                    │
│ ─────────────────                                    │
│ 777 GeriSayım  ·  NIGHTFALL  ·  [Yeni Uygulama]     │
└─────────────────────────────────────────────────────┘
                         ↑
                         │  consumes
                         │
┌─────────────────────────────────────────────────────┐
│ DISTRIBUTION LAYER (@777/theme)                      │
│ ────────────────                                     │
│ @777/theme/native    (React Native components)       │
│ @777/theme/web       (Next.js / web components)      │
│ @777/theme/swift     (SwiftUI ViewModifiers)         │
│ @777/theme/kotlin    (Jetpack Compose)               │
│ @777/theme/figma     (Design tokens)                 │
└─────────────────────────────────────────────────────┘
                         ↑
                         │  generated from
                         │
┌─────────────────────────────────────────────────────┐
│ FOUNDATION LAYER                                     │
│ ───────────────                                      │
│ JSON Token Source (W3C Design Tokens spec)           │
│ Theme Generator (parametric)                         │
│ Character System                                     │
│ Mood Engine                                          │
└─────────────────────────────────────────────────────┘
```

### 2.2 Tema Sistemi DNA

Her tema 7 boyutta tanımlanır:

```typescript
interface ThemeDNA {
  // 1. RENK
  colorSpace: 'oklch'
  basePalette: { hue, chroma, lightness }
  
  // 2. ATMOSFER
  atmosphere: {
    layerCount: 4 | 5 | 6
    drift: MotionPattern
    particles: ParticleSystem
    halo?: HaloConfig
  }
  
  // 3. KARAKTER
  characters: ThemeCharacter[]
  
  // 4. TİPOGRAFİ
  typography: {
    display: FontStack
    editorial: FontStack
    body: FontStack
  }
  
  // 5. HAREKET
  motion: {
    duration: DurationTokens
    easing: EasingTokens
    spring: SpringTokens
  }
  
  // 6. SES (opsiyonel)
  sound?: {
    ambience: AudioTrack
    interaction: HapticPattern[]
  }
  
  // 7. SAAT-AWARE BEHAVIOR
  timeAware: {
    tiers: TimeTier[]  // 5+ tier (eski) → 30+ tier (yeni)
    crossFade: TransitionConfig
  }
}
```

### 2.3 Token Akışı

```
┌──────────────────────┐
│ tokens/source/       │  ← W3C Design Tokens JSON
│   primitives.json    │     (color, space, type, motion)
│   semantic.json      │     (theme.background, text.primary)
│   component.json     │     (card.padding, button.height)
│   character.json     │     (orion.tempo, pleiades.opacity)
└──────────────────────┘
          ↓
   [Style Dictionary]
          ↓
┌──────────────────────────────────────────┐
│ build/                                    │
│ ├── ts/tokens.ts        → @777/theme/core│
│ ├── css/tokens.css      → @777/theme/web │
│ ├── swift/Tokens.swift  → @777/theme/swift
│ ├── kotlin/Tokens.kt    → @777/theme/kotlin
│ ├── tailwind/preset.js  → Tailwind preset│
│ └── figma/tokens.json   → Figma plugin   │
└──────────────────────────────────────────┘
```

---

## 3. HAFTA HAFTA PLAN

### HAFTA 1 — TEMEL: OKLCH + Token Piramidi

**Hedef:** Mevcut Cosmic Night/Dawn'ı OKLCH'a çevir, 8 katmanlı token yapısını kur.

**Görevler:**
- [ ] Style Dictionary kurulumu, monorepo yapısı (`pnpm workspaces`)
- [ ] `tokens/source/primitives.json` — 7 katman renk paleti (50/100/200...900) OKLCH'da
- [ ] Mevcut hex değerleri OKLCH'a çevir (`oklch(L C H)` formatı)
- [ ] `tokens/source/semantic.json` — `text.primary`, `surface.elevated` gibi anlam katmanı
- [ ] CI: `npm run build:tokens` → 6 platform output

**Çıktı:**
- `@777/theme/core` v0.1.0 — token tanımları, OKLCH, 6 platform output
- Eski hex paleti → yeni OKLCH paleti **eşleştirme tablosu** (geriye uyumluluk)

**Test:** Mevcut Cosmic Night ekranı yeni token'larla render edildiğinde **görsel olarak identik** olmalı.

---

### HAFTA 2 — TEMEL DEVAMI: Component Tokens + NPM Setup

**Görevler:**
- [ ] `tokens/source/component.json` — card, button, badge, glass, input
- [ ] NPM scope kurulumu (`@777/theme` workspace)
- [ ] `@777/theme/native` paketi — React Native primitives (`<Surface>`, `<Text>`, `<GlassCard>`)
- [ ] Token tüketim API: `useToken('color.cosmic.night.aurora.gold')`
- [ ] TypeScript types autogeneration (token isimleri intellisense)

**Çıktı:**
- `@777/theme/native` v0.1.0 — kullanılabilir ilk RN paketi
- 5 atomic component (Surface, Text, GlassCard, Button, Stars)

**Test:** 777 GeriSayım'a `@777/theme/native`'i kur, mevcut bir ekranı yeni paketle yeniden oluştur. Görsel ve davranışsal **birebir aynı** olmalı.

---

### HAFTA 3 — GENERATOR: Parametrik Tema Oluşturma

**Hedef:** "Cosmic Night" ve "Cosmic Dawn" sabit değer değil — formülle üretilen.

**Görevler:**
- [ ] `generateCosmicTheme(params)` fonksiyonu yaz (TypeScript)
- [ ] Parametreler: `baseHue`, `chroma`, `lightness`, `warmth`, `auroraIntensity`
- [ ] Mevcut Night/Dawn'ı **parametre olarak yeniden tanımla**
- [ ] 3. tema test: "Cosmic Twilight" (Night ile Dawn arası, baseHue: 320, warmth: -0.1)
- [ ] Theme preview tool (web sayfa, parametre slider'larıyla canlı tema)

**Çıktı:**
- `@777/theme/generator` package
- Theme preview HTML demo (slider'larla canlı parametre)
- Dokümantasyon: `docs/theme-generator.md`

**Test:** 5 farklı parametre setiyle 5 tema üret. Hepsi WCAG AAA geçer mi?

---

### HAFTA 4 — KARAKTER: Theme Character System

**Hedef:** Element + hemisphere → takımyıldız mantığını **karakter sistemine** çevir.

**Görevler:**
- [ ] `tokens/source/character.json` — 12 karakter (mevcut 6 takımyıldız + 6 yeni)
- [ ] Her karakter: `emotion`, `motion`, `voice`, `cardSignature`, `storyMode`
- [ ] **Yeni karakterler:**
  - Cygnus (Kuğu) — özgürlük, uçuş, melankoli
  - Lyra (Lir) — sanatçı, müzik, hassas
  - Aquila (Kartal) — odak, hız, cesaret
  - Andromeda — başkalaşım, dönüşüm
  - Cetus — derinlik, gizem, deniz
  - Phoenix — yeniden doğuş, dayanıklılık
- [ ] Character → Card binding logic
- [ ] `<CosmicCharacter id="orion" intensity={0.8} />` component

**Çıktı:**
- 12 karakter SVG sprite
- Character renderer (React Native + Web)
- Karakter atlas dokümantasyonu

**Test:** Aynı kategoriye 3 farklı karakter atayınca, kart **gerçekten farklı hissediyor mu?**

---

### HAFTA 5 — ATMOSFER: Content-Aware Aurora

**Hedef:** Aurora artık dekorasyon değil, **çevreyi hissediyor**.

**Görevler:**
- [ ] Sensor binding system: `useAuroraSensors()` hook
  - Scroll velocity → drift speed
  - Touch/drag → magnetic pull
  - Gyroscope → 8 tier parallax (4'ten 8'e çıkardık)
  - `UIScreen.brightness` → opacity adapt
  - `MPNowPlayingInfo` → music ritm bind (opsiyonel)
- [ ] `<CosmicAtmosphere mode="reactive" />` component
- [ ] Battery-aware: Low Power Mode'da sensor binding pause
- [ ] Accessibility: Reduce Motion'da tüm sensor binding off

**Çıktı:**
- `@777/theme/native/atmosphere` modülü
- Reactive aurora demo (RN + Web)
- Performance benchmark: iPhone 12, 14, 15 Pro üzerinde 120Hz sustained mı?

**Test:** Atmosfer **gerçekten yaşıyor gibi mi?** Statik render ile yan yana koy, fark net olmalı.

---

### HAFTA 6 — MOOD: Dynamic Eyebrow Generator

**Hedef:** Eyebrow artık 5 sabit metin değil — **her açılışta yeni**.

**Görevler:**
- [ ] Atomic phrase corpus oluştur — 200+ kelime/cümle parçası, 6 dilde
  - Saatlik: "şafak", "öğle", "kızıl gök", "sessiz gece"
  - Hava: "yağmurlu", "kar tanesi", "rüzgârlı", "berrak"
  - Ay: "dolunay", "yeni ay", "büyüyen", "küçülen"
  - Mevsim: "bahar", "yaz", "sonbahar", "kış"
  - Olay: "yaklaşan", "geçen", "bugün", "yarın"
- [ ] `generateEyebrow(context)` engine
  - Context: hour, weather, season, moonPhase, upcomingEvent, userMood
  - Output: "İLK AYDINLIK · BAHARDA UYANIŞ"
- [ ] iOS 26 Foundation Models entegrasyonu (on-device LLM, opsiyonel tone shaping)
- [ ] 6 dil için generator (TR/EN/ES/DE/FR/AR)
- [ ] Cache + invalidation (saatte 1 invalidate)

**Çıktı:**
- `@777/theme/mood` package
- Eyebrow generator playground (web)
- 1000 örnek eyebrow corpus (üretilmiş, kalite kontrolü için)

**Test:** 100 farklı context'le generator çağır. **Tekrar var mı?** Olmaması gerek.

---

### HAFTA 7 — KART: Rumination Arc

**Hedef:** Kart artık tek görünüm değil — **5 katmanlı zaman skalası**.

**Görevler:**
- [ ] 5 görünüm seviyesi component'leri:
  - `<CardGlance />` — 0.3s görünüm, sayı + tek kelime
  - `<CardQuick />` — 1s görünüm, + tarih + meta
  - `<CardDetail />` — 3s görünüm, + saat-dakika-saniye
  - `<CardStory />` — 10s görünüm, + milestone timeline
  - `<CardReflect />` — 30s görünüm, + AI summary + paylaşım
- [ ] Scroll-based level transition (IntersectionObserver / RN scroll)
- [ ] Focus-based level transition (kullanıcı kart üzerinde ne kadar kalıyor)
- [ ] Smooth interpolation (level 1 → level 2'de UI elementleri yumuşak fade)

**Çıktı:**
- `<RuminationCard />` master component
- 5 level demo (RN + Web)
- Animation choreography dokümantasyonu

**Test:** Bir kartı 30s izle. **5 farklı içeriğe doğal olarak akıyor mu?**

---

### HAFTA 8 — DAĞITIM: NPM + Figma Plugin

**Hedef:** Tema sistemi gerçekten **birden fazla projede** kullanılabilir hale.

**Görevler:**
- [ ] NPM publish: `@777/theme/*` paketleri (Github Packages veya npmjs)
- [ ] Versionlama strategy (semver, changesets)
- [ ] Figma Variables plugin — token JSON → Figma sync
- [ ] Documentation site (Docusaurus / Nextra)
  - API reference
  - Tutorial (`Getting started`)
  - Examples (`777 GeriSayım`, `NIGHTFALL`)
  - Migration guide (eski theme.ts'den `@777/theme`'ye)
- [ ] Storybook (component preview)

**Çıktı:**
- NPM'de yayında: `@777/theme/core`, `/native`, `/web`, `/generator`, `/mood`
- `theme.777.app` (veya `cosmic.777.app`) doc site
- Figma library

**Test:** Yepyeni boş bir projede `@777/theme`'i kur, 30 dakikada Cosmic Night ekran üret. Mümkün mü?

---

### HAFTA 9+ — PRODUCTION: Test, Polish, Launch

**Görevler:**
- [ ] iPhone 11/12/13/14/15/16 üzerinde performance test
- [ ] Pixel 7/8/9 üzerinde Android test
- [ ] Web (Chrome, Safari, Firefox) test
- [ ] WCAG AAA audit (`axe-core` + manual)
- [ ] Reduce Motion / Reduce Transparency / Larger Text test
- [ ] 6 dil i18n test (RTL Arabic dahil)
- [ ] Apple Editor's Choice tier check (Editorial DNA filtresi)

**Çıktı:**
- Production-ready `@777/theme` v1.0.0
- Test rapor + benchmark sonuçları
- Lansman blog post: "Building a multi-platform theme system"

---

## 4. 8 MADDE DETAYI

Her madde için **ayrı doküman** çıkacak (haftalık plan paralelinde):

| # | Madde | Hafta | Doküman |
|---|---|---|---|
| 2 | OKLCH renk uzayı | 1 | `02-OKLCH-MIGRATION-GUIDE.md` |
| 8 | Design token piramidi | 1-2 | `08-TOKEN-PYRAMID-SPEC.md` |
| 1 | Theme generator | 3 | `01-THEME-GENERATOR-SPEC.md` |
| 7 | NPM paket yapısı | 2, 8 | `07-PACKAGE-DISTRIBUTION.md` |
| 3 | Theme character system | 4 | `03-CHARACTER-SYSTEM-SPEC.md` |
| 4 | Content-aware aurora | 5 | `04-REACTIVE-ATMOSPHERE.md` |
| 5 | Dynamic mood engine | 6 | `05-MOOD-ENGINE-SPEC.md` |
| 6 | Rumination arc kart | 7 | `06-RUMINATION-ARC-SPEC.md` |

---

## 5. REPO YAPISI

```
777-theme/                              # Monorepo (pnpm workspaces)
│
├── tokens/                             # Foundation
│   ├── source/
│   │   ├── primitives.json             # OKLCH renkler, space, type, motion
│   │   ├── semantic.json               # text.primary, surface.elevated
│   │   ├── component.json              # card.padding, button.height
│   │   ├── character.json              # 12 character DNA
│   │   ├── theme-night.json            # Cosmic Night (parametrik)
│   │   ├── theme-dawn.json             # Cosmic Dawn (parametrik)
│   │   └── theme-twilight.json         # Cosmic Twilight (yeni)
│   ├── build/                          # Style Dictionary outputs
│   │   ├── ts/
│   │   ├── css/
│   │   ├── swift/
│   │   ├── kotlin/
│   │   └── tailwind/
│   ├── style-dictionary.config.js
│   └── package.json
│
├── packages/                           # Distribution
│   ├── core/                           # @777/theme/core
│   │   ├── src/
│   │   │   ├── tokens.ts               # token type definitions
│   │   │   ├── generator.ts            # generateCosmicTheme()
│   │   │   ├── character.ts            # character system
│   │   │   ├── mood.ts                 # eyebrow generator
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── native/                         # @777/theme/native
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Surface.tsx
│   │   │   │   ├── Text.tsx
│   │   │   │   ├── GlassCard.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Stars.tsx
│   │   │   │   ├── CosmicAtmosphere.tsx
│   │   │   │   ├── CosmicCharacter.tsx
│   │   │   │   └── RuminationCard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useTheme.ts
│   │   │   │   ├── useToken.ts
│   │   │   │   ├── useAuroraSensors.ts
│   │   │   │   └── useMood.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── web/                            # @777/theme/web
│   │   ├── src/
│   │   │   ├── components/             # Same API as native
│   │   │   └── styles/                 # CSS / CSS modules
│   │   └── package.json
│   │
│   ├── swift/                          # @777/theme/swift
│   │   ├── Sources/
│   │   │   └── Theme777/
│   │   │       ├── Tokens.swift
│   │   │       ├── ViewModifiers/
│   │   │       └── Components/
│   │   └── Package.swift
│   │
│   ├── kotlin/                         # @777/theme/kotlin
│   │   └── src/main/kotlin/
│   │       └── theme777/
│   │
│   ├── generator/                      # @777/theme/generator
│   ├── mood/                           # @777/theme/mood
│   └── figma/                          # @777/theme/figma
│
├── apps/                               # Test applications
│   ├── playground/                     # Theme preview tool
│   ├── docs/                           # Documentation site (Nextra)
│   └── storybook/                      # Component storybook
│
├── examples/                           # Example integrations
│   ├── 777-gerisayim/                  # Reference implementation
│   └── nightfall/                      # Sleep tracker example
│
├── docs/                               # Markdown documentation
│   ├── 00-MASTER-PLAN.md               # Bu doküman
│   ├── 01-THEME-GENERATOR-SPEC.md
│   ├── 02-OKLCH-MIGRATION-GUIDE.md
│   ├── 03-CHARACTER-SYSTEM-SPEC.md
│   ├── 04-REACTIVE-ATMOSPHERE.md
│   ├── 05-MOOD-ENGINE-SPEC.md
│   ├── 06-RUMINATION-ARC-SPEC.md
│   ├── 07-PACKAGE-DISTRIBUTION.md
│   └── 08-TOKEN-PYRAMID-SPEC.md
│
├── .changeset/                         # Versionlama
├── .github/workflows/
│   ├── ci.yml                          # Test + build
│   └── release.yml                     # NPM publish
├── pnpm-workspace.yaml
└── README.md
```

---

## 6. TOOLING STACK

### Foundation
- **Style Dictionary 4.x** — Token derleme (JSON → 6 platform)
- **W3C Design Tokens spec** — JSON format standardı
- **Culori** veya **Colorjs.io** — OKLCH renk math

### Build & Develop
- **pnpm workspaces** — Monorepo
- **Turborepo** — Task orchestration (build/test paralelleştirme)
- **Changesets** — Semver versionlama
- **TypeScript 5.x** — Tip güvenli
- **Vitest** — Unit test
- **Playwright** — Visual regression

### Distribution
- **GitHub Packages** veya **NPM private registry**
- **Docusaurus** veya **Nextra** — Doc site
- **Storybook 8** — Component preview
- **Figma Variables** — Design token sync

### Mobile
- **React Native 0.83+** (mevcut RN versiyonun)
- **Reanimated 4** — UI thread worklet
- **Skia** — GPU-accelerated atmosphere
- **Expo Sensors** — Gyroscope, DeviceMotion

### Web
- **Next.js 15** — React framework
- **Tailwind v4** — Native OKLCH desteği
- **Framer Motion** — Web animasyon

---

## 7. BAŞARI KRİTERLERİ

### Teknik
- [ ] Token build pipeline 6 platform için 0 hata
- [ ] `@777/theme/native` ile 777 GeriSayım birebir aynı render
- [ ] `@777/theme/web` ile web demo
- [ ] WCAG AAA passed
- [ ] iPhone 12+ üzerinde 120Hz sustained
- [ ] Bundle size hedefleri tutturuldu
- [ ] Test coverage > 80%

### Tasarım
- [ ] 5+ tema üretildi (Night, Dawn, Twilight + 2 yeni)
- [ ] 12 karakter sprite hazır
- [ ] 200+ atomic phrase corpus
- [ ] Editor's Choice DNA filter geçer ("vay" der mi?)

### Dağıtım
- [ ] NPM'de yayında (`@777/theme/*`)
- [ ] Doc site canlı
- [ ] Figma library shareable
- [ ] 2 örnek uygulama (`777 GeriSayım`, `NIGHTFALL`) + theme system

### Vizyon
- [ ] Apple Editor's Choice 2026 başvuru hazır
- [ ] Birden fazla uygulamada kullanılıyor
- [ ] Senin (hep17) takımı hızla yeni uygulama spinleyebiliyor

---

## SONRAKİ ADIM

Bu master plan onaylanırsa, **iki paralel doküman** geliyor:

1. **`02-OKLCH-MIGRATION-GUIDE.md`** — Mevcut hex paletinin OKLCH çevrimi, kod örnekleri, migration scripti
2. **`08-TOKEN-PYRAMID-SPEC.md`** — 8 katmanlı token yapısı, JSON şeması, dosya organizasyonu

Bu ikisi temel — onlar üzerine generator (madde 1), karakter (madde 3), atmosfer (madde 4), mood (madde 5), kart (madde 6), distribütör (madde 7) kuruluyor.

---

*Bu plan 8 hafta içinde profesyonel bir tema sistemi inşa eder. Her hafta sonunda kontrol noktası + çalışan kod var. Yanlış sırayla başlanırsa iki kez yapılır — bu plan doğru sırayı takip ediyor.*

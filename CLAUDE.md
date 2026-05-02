# CLAUDE.md

> Bu dosya Claude Code'un her oturumda otomatik okuduğu proje bağlamıdır.

## Proje Nedir?

Bu repo bir **Expo/React Native template**'idir. Adı: `cosmic-theme`.

Sahibi Ahmet (hep17) bu template'i GitHub'da saklayacak. Yeni bir mobil uygulama yapacağı zaman GitHub'da "Use this template" tıklayıp **Cosmic temasıyla hazır** bir uygulama başlatacak.

## Hedef

```
GitHub: hep17/cosmic-theme      ← Bu repo (template)
                ↓
                ↓ "Use this template" tıklanır
                ↓
GitHub: hep17/yeni-uygulama     ← Yeni proje, Cosmic tema içinde HAZIR
```

## Tech Stack — KESİN KARARLAR

- **Framework:** Expo SDK 50+ (managed workflow, bare değil)
- **Language:** TypeScript (strict mode)
- **RN version:** 0.74+
- **Animation:** Reanimated 4 + react-native-skia
- **Color space:** OKLCH (culori library)
- **State:** Sadece useState/useReducer (Redux/Zustand yok)
- **Navigation:** React Navigation v7

## Proje Yapısı

```
cosmic-theme/
├── App.tsx                     ← Demo başlangıç (Cosmic atmosphere göster)
├── package.json                ← Expo + tüm dependencies
├── tsconfig.json               ← TypeScript strict
├── app.json                    ← Expo config
│
├── theme/                      ← TÜM TEMA SİSTEMİ BURADA
│   ├── index.ts                ← Public exports
│   ├── colors.ts               ← Cosmic Night/Dawn renkleri (OKLCH)
│   ├── tokens.ts               ← Design tokens
│   ├── characters/             ← 12 karakter
│   │   ├── index.ts            ← CHARACTERS object
│   │   ├── types.ts            ← TypeScript types
│   │   ├── orion.ts
│   │   ├── pleiades.ts
│   │   ├── ... (12 dosya)
│   │   └── selectCharacter.ts  ← Kategori → karakter
│   ├── components/             ← Hazır component'ler
│   │   ├── CosmicAtmosphere.tsx    ← Aurora + parallax yıldızlar
│   │   ├── CosmicCharacter.tsx     ← Karakter render
│   │   ├── GlassCard.tsx           ← Frosted glass kart
│   │   └── Stars.tsx               ← Yıldız tarlası
│   └── utils/
│       ├── oklch.ts            ← Renk dönüşümleri
│       └── interpolation.ts    ← Lerp, hue path
│
├── docs/                       ← 10 spec dokümanı (referans)
│   ├── 00-MASTER-PLAN.md
│   ├── 01-THEME-GENERATOR-SPEC.md
│   └── ... (10 dosya)
│
├── README.md                   ← "Bu template nasıl kullanılır"
├── CLAUDE.md                   ← Bu dosya
└── PROMPTS.md                  ← Geliştirme talimatları
```

## Kod Stili

1. **TypeScript strict mode**, `any` yasak
2. Component dosyaları PascalCase: `CosmicAtmosphere.tsx`
3. Utility dosyaları camelCase: `oklch.ts`
4. **Named exports only** (default export yok)
5. JSDoc İngilizce, kod yorumları Türkçe OK
6. Inline magic numbers yok — `theme/tokens.ts`'ten al
7. `react-native` ve `react` peerDependencies'te DEĞİL — direkt dependencies

## Cosmic Theme — Tasarım Kararları (DEĞİŞTİRMEME)

### 12 Karakter (sabit liste)
```
Orion (M-class), Pleiades (B), Cassiopeia (K), Crux (B),
Ursa Major (A), Centaurus (G), Cygnus (A), Lyra (A),
Aquila (A), Andromeda (B), Cetus (K), Phoenix (K)
```

Her karakterin spectral class'ı NASA bilimine göre sabit. `docs/03-CHARACTER-SYSTEM-SPEC.md` §2'de tam DNA.

### 5 Tema Variantı
- Cosmic Night (hue 280) — aktif
- Cosmic Dawn (hue 30) — aktif
- Twilight, Eclipse, Aurora — deneysel (sonra)

### NASA-Quality Yıldız Render
Her parlak yıldız 4 katman:
1. Halo (blur 8px, radial gradient)
2. Outer glow (box-shadow 32px)
3. Inner glow (box-shadow 16px)
4. Crisp core (1.5-5px)

Spectral class color (NASA):
- M (kızıl dev): #FFB888
- K (turuncu): #FFD088
- A (beyaz): #C8DFFF
- B (mavi-beyaz): #B8D4FF
- G (sarı): #FFE5B0

`docs/03-CHARACTER-SYSTEM-SPEC.md` §12'de detaylı.

## Yapma Listesi

❌ NPM publish setup yapma — bu bir **template repo**, paket değil
❌ Monorepo yapma — bu **tek repo**, tek uygulama
❌ pnpm workspace kurma — Expo standart npm/yarn yeterli
❌ Karmaşık build pipeline — Expo'nun varsayılanı kullanılır
❌ Test framework ekleme (Jest, Vitest) — sadece manuel test
❌ Storybook ekleme — gereksiz karmaşıklık
❌ State management library (Redux, Zustand) ekleme
❌ TailwindCSS ekleme — RN için StyleSheet kullanılır
❌ 777 GeriSayım'dan kod kopyalama — temiz, sıfırdan yaz

## Yapılacak (öncelik sırası)

1. ✅ Expo bare project init (TypeScript)
2. ✅ Dependencies ekle (Reanimated, Skia, culori)
3. 🚧 `theme/colors.ts` — OKLCH renkleri
4. 🚧 `theme/tokens.ts` — Design tokens
5. 🚧 `theme/characters/` — 12 karakter DNA
6. 🚧 `theme/components/CosmicAtmosphere.tsx`
7. 🚧 `theme/components/CosmicCharacter.tsx`
8. 🚧 `App.tsx` — Demo (12 karakter göstersin)
9. 🚧 README — kullanım rehberi
10. ✅ Test: `npm start`, simulator'de aurora + karakterler görünüyor

## Dokümanlar

`docs/` klasöründe 10 spec dokümanı var (8.240 satır). Her geliştirme adımında **önce ilgili spec'i oku**:

| Doküman | Konu |
|---|---|
| 00-MASTER-PLAN | Genel plan |
| 01-THEME-GENERATOR | Parametrik tema |
| 02-OKLCH | Renk dönüşümleri |
| 03-CHARACTER-SYSTEM | 12 karakter (en uzun, en önemli) |
| 04-REACTIVE-ATMOSPHERE | Animasyon, sensorler |
| 05-MOOD-ENGINE | Eyebrow generator (sonra) |
| 06-RUMINATION-ARC | Kart sistemi (sonra) |
| 07-PACKAGE-DISTRIBUTION | (bizim için geçerli değil, template kullanıyoruz) |
| 08-TOKEN-PYRAMID | Token mimarisi |
| 09-EXTRAS | Editor's Choice ekstraları (sonra) |

## Önemli Hatırlatma

Ahmet **tek başına AI yardımıyla** geliştiriyor. Aşırı mühendislik yok, her adım küçük ve test edilebilir, simulator'de görünüyor olmalı.

Türkçe konuşulur, İngilizce kod yazılır.

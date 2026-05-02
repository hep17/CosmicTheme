# 🤖 Claude Code Talimatları

> Bu dosyadaki prompt'ları **sırayla** Claude Code'a yapıştıracaksın.
> Her faz bittikten sonra bana (sohbette) gel, kontrol edelim.

---

## FAZ 0: Expo Projesi Başlat (5 dakika)

**Yapıştır:**

```
Selam Claude Code!

Bu repo cosmic-theme adında bir Expo template repo'su olacak. 
Sen Expo + TypeScript ile React Native projesini hazırlayacaksın.

ÖNCE OKU:
- CLAUDE.md (proje bağlamı, kurallar)
- docs/00-MASTER-PLAN.md (genel vizyon, ilk 100 satır yeter)

ŞIMDI YAP:
1. Expo TypeScript projesi başlat:
   npx create-expo-app@latest . --template blank-typescript --yes
   (mevcut CLAUDE.md, docs/, PROMPTS.md, SETUP.md SİLİNMESIN)

2. Dependencies ekle:
   npm install react-native-reanimated@^3.10.0
   npm install @shopify/react-native-skia
   npm install culori
   npm install expo-sensors
   npm install --save-dev @types/culori

3. babel.config.js'e Reanimated plugin ekle (en sona):
   plugins: ['react-native-reanimated/plugin']

4. Test et:
   npx expo install --check
   (hata varsa düzelt)

5. Bana göster:
   - package.json içeriği
   - npx expo start ile çalışıp çalışmadığı

Bittiğinde "✅ Faz 0 tamam: Expo + dependencies kuruldu" de.
```

Bu adım **5 dakika**. Hata varsa Claude Code çözer.

---

## FAZ 1: Renk Sistemi (10 dakika)

**Yapıştır:**

```
Şimdi renk sistemini kuralım.

ÖNCE OKU:
- docs/02-OKLCH-MIGRATION-GUIDE.md (491 satır, hepsini)

GÖREV: theme/ klasörü oluştur, içine renk sistemini yaz:

theme/
├── colors.ts           → Cosmic Night/Dawn renkleri (OKLCH + hex)
├── tokens.ts           → Design tokens (spacing, radius, font)
├── utils/
│   ├── oklch.ts        → hex2oklch, oklch2hex, interpolateOklch
│   └── contrast.ts     → contrastRatio (WCAG AAA)
└── index.ts            → public exports

KURALLAR:
- TypeScript strict, hiç any yok
- culori library kullan (zaten yüklü)
- Her fonksiyon JSDoc + kullanım örneği
- COSMIC_NIGHT ve COSMIC_DAWN preset olarak export et

PRESET ÖRNEK:
export const COSMIC_NIGHT = {
  bg: { primary: '#02000a', secondary: '#060220', tertiary: '#0c0628' },
  aurora: { gold: '#FFC93C', purple: '#B888FF', pink: '#FF6FB5' },
  text: { primary: '#FFFFFF', secondary: 'rgba(255,255,255,0.65)', tertiary: 'rgba(255,255,255,0.45)' },
  // ... vs.
};

TEST:
- App.tsx'i geçici olarak değiştir, COSMIC_NIGHT.bg.primary'yi göster
- npx expo start ile çalıştır, simulator'de siyah background görünsün

Bittiğinde "✅ Faz 1 tamam: renk sistemi hazır" de.
```

---

## FAZ 2: 12 Karakter (15 dakika)

**Yapıştır:**

```
Şimdi 12 karakteri ekleyelim.

ÖNCE OKU:
- docs/03-CHARACTER-SYSTEM-SPEC.md (1366 satır - HEPSİ)

GÖREV: theme/characters/ klasörü:

theme/characters/
├── types.ts                    → ThemeCharacter, SpectralClass, CardSignature
├── characters.ts               → CHARACTERS object (12 karakterin DNA'sı)
├── selectCharacter.ts          → selectCharacter(category, opts)
├── categoryMap.ts              → 14 kategori → karakter eşleşmesi
└── index.ts                    → exports

12 KARAKTER (sabit liste):
- Orion (Betelgeuse, M-class kızıl dev)
- Pleiades (Alcyone, B-class)
- Cassiopeia (Schedar, K-class) - Kuzey
- Crux (Acrux, B-class) - Güney
- Ursa Major (Mizar, A-class) - Kuzey
- Centaurus (Rigil Kent, G-class) - Güney
- Cygnus (Deneb, A-class)
- Lyra (Vega, A-class)
- Aquila (Altair, A-class)
- Andromeda (Alpheratz, B-class)
- Cetus (Diphda, K-class)
- Phoenix (Ankaa, K-class)

Her karakter için (spec §2'deki tam DNA):
- id, name, scientificName, emoji
- shape (SVG koordinatları)
- signatureStar
- personality (emotion, archetype)
- motion (twinkleProfile, driftPattern, breathingRate)
- voice (tone, keywords, timeMood)
- cardSignature (accentBoost, timingBias, densityMultiplier)
- affinities (primary, secondary)
- storyMode (narrative, interactionPattern)

SPECTRAL CLASS RENK TABLOSU (NASA, sabit):
M: { core: '#FFB888', glow: 'rgba(255,184,136,' }   // kızıl dev
K: { core: '#FFD088', glow: 'rgba(255,208,136,' }   // turuncu
A: { core: '#C8DFFF', glow: 'rgba(200,223,255,' }   // beyaz
B: { core: '#B8D4FF', glow: 'rgba(184,212,255,' }   // mavi-beyaz
G: { core: '#FFE5B0', glow: 'rgba(255,229,176,' }   // sarı

KATEGORİ → KARAKTER (spec §3.1):
birthday → cassiopeia | phoenix
event → orion | aquila
quit_smoking → phoenix | ursa_major
... (14 kategori, spec'te liste)

TEST:
- App.tsx'te selectCharacter('birthday', { hemisphere: 'north' }) çağır
- Console.log ile karakter ismini yaz
- Simulator'de sonuç görünsün: "Cassiopeia 👑"

Bittiğinde "✅ Faz 2 tamam: 12 karakter hazır" de.
```

---

## FAZ 3: CosmicAtmosphere Component (en önemli, 30 dakika)

**Yapıştır:**

```
Şimdi tema sisteminin en önemli component'ini yazalım: aurora arka plan.

ÖNCE OKU:
- docs/04-REACTIVE-ATMOSPHERE.md (676 satır)

GÖREV: theme/components/CosmicAtmosphere.tsx

API hedefi:
<CosmicAtmosphere variant="night" density="standard">
  {children}
</CosmicAtmosphere>

İÇERİĞİ:
1. Black background (gradient)
2. Aurora drift (4 katman, Lissajous orbital motion)
3. 3 katman parallax yıldız (drift-slow, drift-mid, drift-fast)
4. Reanimated 4 + react-native-skia GPU-accelerated

KURALLAR:
- Reduce Motion respect et (useReducedMotion hook)
- 60Hz sustained iPhone 12+ üzerinde
- Sadece variant="night" ilk versiyonda yeterli
- Aurora drift period: 28 saniye

TEST:
App.tsx'i şöyle yap:
```
import { CosmicAtmosphere } from './theme';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <CosmicAtmosphere variant="night">
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'white', fontSize: 32}}>Cosmic Night</Text>
      </View>
    </CosmicAtmosphere>
  );
}
```

Simulator'de görünmeli:
- Siyah background
- Aurora altın + mor lekeleri yumuşak drift ediyor
- Yıldızlar arka planda yavaşça kayıyor

Screenshot al, bana göster.

Bittiğinde "✅ Faz 3 tamam: aurora yaşıyor" de.
```

---

## FAZ 4: CosmicCharacter Component (30 dakika)

**Yapıştır:**

```
Şimdi karakter render'ını ekleyelim.

ÖNCE OKU:
- docs/03-CHARACTER-SYSTEM-SPEC.md §12 (NASA Quality Render, satır 1100-1366)

GÖREV: theme/components/CosmicCharacter.tsx

API:
<CosmicCharacter id="orion" size="medium" />

İÇERİĞİ (4 katman):
1. Halo (Skia BackdropBlur 8px, radial gradient — spectral class color)
2. Outer glow (radial gradient, 32px)
3. Inner glow (16px)
4. Crisp core (1.5-5px, parlayan nokta)

Spectral class color (NASA):
- M (kızıl dev): #FFB888 + glow rgba(255,184,136)
- K (turuncu): #FFD088
- A (beyaz): #C8DFFF
- B (mavi-beyaz): #B8D4FF
- G (sarı): #FFE5B0

Karakter SVG koordinatları theme/characters/'tan al.

TEST:
App.tsx:
```
<CosmicAtmosphere variant="night">
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <CosmicCharacter id="orion" size="medium" />
    <Text style={{color: 'white', marginTop: 20}}>Orion - Avcı</Text>
  </View>
</CosmicAtmosphere>
```

Simulator'de görünmeli:
- Aurora background
- Orion takımyıldızı (Betelgeuse kızıl parlayan, Rigel mavi parlayan, kuşak)
- "Orion - Avcı" metni

Screenshot al, bana göster.

Bittiğinde "✅ Faz 4 tamam: karakterler render oluyor" de.
```

---

## FAZ 5: 12 Karakter Galerisi (Demo, 20 dakika)

**Yapıştır:**

```
Şimdi App.tsx'i bir DEMO'ya çevirelim. Yeni uygulamada bu template
açıldığında "vay" demek için.

GÖREV: App.tsx'i yeniden yaz:

İÇERİĞİ:
- CosmicAtmosphere variant="night" arka plan
- Üst başlık: "Cosmic Theme" (Playfair Display italic, 36px)
- Alt yazı: "12 Karakter, NASA Quality Render"
- ScrollView ile 12 karakter kartı (3 sütun grid)
- Her kartta:
  - CosmicCharacter mini render
  - Karakter ismi (örn: "Orion")
  - Signature star (örn: "Betelgeuse · M")
  - Emoji (🏹, 🦅, vs.)
- En altta: "Cosmic Theme v0.1.0 by hep17"

KURALLAR:
- Dark background (theme.colors.bg.primary)
- Glass card görünümü (rgba bg + border)
- Tap edince Alert göstersin: "Bu karakter Phoenix - Anka"

TEST:
- npx expo start ile aç
- iOS simulator'de scroll edebiliyor olmalı
- 12 karakter parlayarak görünmeli
- Aurora arka planda dönmeli

Bittiğinde "✅ Faz 5 tamam: demo galeri hazır" de.

ARTIK template HAZIR. Bana sonuç screenshot'ı göster.
```

---

## FAZ 6: README + Template Olarak İşaretleme (5 dakika)

**Yapıştır:**

```
Son adım: README.md yaz, GitHub'a push et.

GÖREV 1: README.md (varsa üstüne yaz, yoksa oluştur)

İçerik:
# 🌌 Cosmic Theme — React Native Template

> Atmospheric, time-aware, poetic theme system for React Native apps

## Quick Start

```bash
# Use this template:
1. Click "Use this template" on GitHub
2. Create your new app
3. Clone & install:
   git clone https://github.com/YOUR-USERNAME/your-app.git
   cd your-app
   npm install
   npx expo start
```

## What's Included

- 🌗 5 theme variants (Night active, Dawn coming soon)
- 🎭 12 NASA-grade constellation characters
- ✨ Aurora drift animation
- 🌟 3-layer parallax stars
- 💫 Liquid Glass card components
- 📜 8.240 lines of design specs in `docs/`

## Components

```tsx
import { CosmicAtmosphere, CosmicCharacter } from './theme';

<CosmicAtmosphere variant="night">
  <CosmicCharacter id="orion" size="medium" />
</CosmicAtmosphere>
```

## Documentation

See `docs/` folder for complete specs:
- `01-THEME-GENERATOR-SPEC.md` — Parametric theming
- `03-CHARACTER-SYSTEM-SPEC.md` — 12 characters DNA
- `04-REACTIVE-ATMOSPHERE.md` — Sensor-aware aurora
- ... 10 documents total

## Roadmap

- [x] v0.1.0 — Atmosphere + Characters
- [ ] v0.2.0 — Reactive sensors (gyroscope, scroll)
- [ ] v0.3.0 — Mood Engine (eyebrow generator)
- [ ] v0.4.0 — Live Activities + Watch
- [ ] v1.0.0 — Apple Editor's Choice ready

## License

MIT (sen değiştirebilirsin)

## Made with ❤️ by hep17

---

GÖREV 2: Git push:
   git add .
   git commit -m "Cosmic Theme v0.1.0 - initial template"
   git push

Bittiğinde "✅ Faz 6 tamam: README hazır, GitHub'a push edildi" de.

ARTIK SEN (Ahmet) GitHub'a gidip:
- Settings → Template repository ☑️ işaretleyeceksin
- Yeni uygulama yapacağın zaman "Use this template" → bitti
```

---

## SONRA NE?

Tüm fazlar bittiğinde bana gel, **demo screenshot'ları** ile beraber. Şu seçenekler var:

### Seçenek A: Şimdilik Bu Kadar
v0.1.0 hazır. Yeni uygulama yaparken kullanırsın. **Çoğu kişi için yeterli.**

### Seçenek B: v0.2.0'a Geç
- Reactive Atmosphere (gyroscope, scroll)
- Daha fazla karakter detayı
- 5 tema variant tam (Twilight, Eclipse, Aurora)

### Seçenek C: v0.3.0+
- Mood Engine (eyebrow generator, 6 dil)
- Live Activities (Lock Screen)
- Apple Watch complications

Bunlar zamanla. Acelesi yok.

---

## Sorun Çıkarsa

Her faz sonunda bana sohbette gel:
- ✅ Çalıştıysa: "Faz X tamam, screenshot göndereyim mi?"
- ❌ Hata varsa: Hatanın **tam metnini** kopyala, getir

Çözeriz kanka. Birlikte yapıyoruz. 💪

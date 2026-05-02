# 🚀 Cosmic Theme Template — Kurulum Rehberi

> Bu rehber **sana özel** kanka. Birebir adım adım, hiç teknik kelime yok.

---

## Şu Anda Ne Olacak?

```
1. GitHub'da boş bir repo açacaksın        (5 dakika)
2. Bilgisayarına klonlayacaksın             (1 dakika)
3. Bu zip'i içine atacaksın                  (1 dakika)
4. Claude Code'u o klasörde başlatacaksın    (1 dakika)
5. Hazır talimatları yapıştıracaksın         (Claude Code çalışır, 2-3 saat)
6. GitHub'a push edeceksin                   (1 dakika)
7. Template'i "template" olarak işaretleyeceksin (1 dakika)
8. ✅ HAZIR! Yeni uygulamada "Use this template" tıklarsın.
```

---

## ADIM 1: GitHub'da Repo Aç

1. https://github.com/new aç
2. **Repository name:** `cosmic-theme`
3. **Description:** `Cosmic theme template for my React Native apps`
4. **Public** veya **Private** — sen seç (sadece sen kullanacaksan **Private**)
5. ⚠️ **HİÇBİR ŞEY ISARETLEME** (README, .gitignore, license — boş bırak)
6. **"Create repository"** tıkla

GitHub seni boş bir repo sayfasına götürür. Sayfayı **kapatma**, az sonra tekrar açacaksın.

---

## ADIM 2: Bilgisayarına Klonla

Terminal aç (Mac'te Terminal app, Windows'ta Git Bash).

```bash
# Projelerini koyduğun klasöre git (sen ayarla):
cd ~/projeler

# Repo'yu klonla (KENDI KULLANICI ADIN ile değiştir):
git clone https://github.com/SENİN-KULLANICI-ADIN/cosmic-theme.git

# Klasöre gir:
cd cosmic-theme
```

Şu an boş bir `cosmic-theme/` klasöründesin.

---

## ADIM 3: Zip'i Aç ve İçeri At

1. İndirdiğin `cosmic-template.zip`'i aç
2. İçindeki **tüm dosyaları** (CLAUDE.md, PROMPTS.md, docs/, README.md) **`cosmic-theme/`** klasörüne **kopyala-yapıştır**.

Klasör şöyle görünmeli:

```
cosmic-theme/
├── CLAUDE.md          ← Claude Code'un okuyacağı dosya
├── PROMPTS.md         ← Senin Claude Code'a vereceğin talimatlar
├── README.md          ← Template kullanım rehberi
├── docs/              ← 10 spec dokümanı
└── .git/              ← (gizli, sen görmezsin)
```

---

## ADIM 4: Claude Code Başlat

Aynı terminalde, `cosmic-theme/` klasöründe:

```bash
claude
```

(eğer `claude code` ise: `claude code`)

Claude Code açılır. Sana "Welcome" der.

---

## ADIM 5: İlk Talimatı Yapıştır

`PROMPTS.md` dosyasını aç (VS Code, Cursor veya başka editörle).

**Faz 0** bölümündeki ilk prompt'u kopyala, Claude Code'a yapıştır. Şöyle:

```
Selam Claude Code!

Bu repo cosmic-theme adında bir Expo template'i olacak.
İlk önce CLAUDE.md ve docs/ klasöründeki spec dokümanlarını oku.

Sonra Expo TypeScript projesini başlat:
- npx create-expo-app . --template blank-typescript --yes
- (mevcut dosyaları silmesin)

Dependencies ekle:
- react-native-reanimated (^3.10.0)
- @shopify/react-native-skia
- culori
- expo-sensors

Sonra "✅ Faz 0 tamam, Expo + dependencies kuruldu" de.
```

Claude Code çalışır, dosyaları yazar, paketleri kurar. **3-5 dakika sürer.**

---

## ADIM 6: Sırayla Diğer Fazları Yap

`PROMPTS.md`'de Faz 1, 2, 3, 4, 5 var. **Her fazı sırayla yapıştır.**

Her faz bittikten sonra:
- ✅ Çalıştıysa: bana sohbette gel, "Faz X tamam" de
- ❌ Hata varsa: hatanın metnini bana getir, çözeriz

---

## ADIM 7: GitHub'a Push Et

Her faz veya birkaç faz sonra:

```bash
git add .
git commit -m "Faz X: tamamlandı"
git push
```

GitHub'da repo'n güncellenir.

---

## ADIM 8: Template Olarak İşaretle (Sona, Tüm Fazlar Bittikten Sonra)

GitHub'da repo'na git → **Settings** → en üstte:

- ☑️ **Template repository** kutucuğunu işaretle.

Bitti! Artık repo'nun sağ üstünde **"Use this template"** düğmesi var.

---

## ✅ Yeni Uygulama Yapacağın Zaman

```
1. GitHub'da hep17/cosmic-theme'e git
2. "Use this template" → "Create a new repository"
3. Yeni repo adı yaz: hep17/yeni-uygulamam
4. Bilgisayarına klonla:
   git clone https://github.com/hep17/yeni-uygulamam.git
   cd yeni-uygulamam
   npm install
   npx expo start
5. Simulator'de Cosmic atmosfer + 12 karakter HAZIR.
6. App.tsx'i kendi içeriğin için düzenlersin.
```

**30 saniye, yeni uygulama hazır. Cosmic tema içeride.**

---

## Sorun Çıkarsa

### `git: command not found`
→ Git yüklü değil. https://git-scm.com/downloads adresinden yükle.

### `claude: command not found`
→ Claude Code yüklü değil. Claude Code dokümanına bak: https://docs.claude.com

### `npm install` çok uzun sürüyor
→ Normal, ilk seferde 2-3 dakika sürer. Bekle.

### Simulator açılmıyor (Mac, Xcode)
→ `npx expo start --ios` yerine telefonunda **Expo Go** uygulamasını yükle, QR kodu okutarak test edebilirsin.

### Bir hata aldım, ne yapayım?
→ Hatanın **tam metnini** bana sohbette getir. Çözeriz.

---

## Önemli Hatırlatma

**Her şey küçük adımlarda olur.** Her faz bittiğinde bana gel, kontrol edelim, sonraki faza geçelim.

Acele etme. **Bir Editor's Choice tier kütüphane yapıyorsun**, 1 günde olmaz. 2-4 hafta tipik.

İyi şanslar kanka! 💪

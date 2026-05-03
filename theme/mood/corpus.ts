/**
 * Mood Engine — Türkçe phrase corpus.
 *
 * 14 kategori × 5 bucket × 3-4 phrase = ~56 toplam phrase.
 * Her phrase {placeholder} içerebilir; interpolate() bunu çözer.
 *
 * Placeholder'lar:
 *   {character}     → character.name
 *   {days}          → Math.abs(daysLeft)
 *   {daysAbs}       → Math.abs(daysLeft) (geçmiş için)
 *   {timeMood}      → sabah / gündüz / akşam / gece
 *   {emoji}         → character.emoji
 *   {signatureStar} → character.signatureStar.name
 *
 * Spec: docs/05-MOOD-ENGINE-SPEC.md §2
 *
 * @module theme/mood/corpus
 */

import type { PhraseCorpus } from './types';

export const CORPUS_TR: PhraseCorpus = {

  // ── Doğum günü ──────────────────────────────────────────────────────────────
  birthday: {
    distant: [
      { text: '{character} sahnede, {days} gün var doğum gününe',    tone: 'energetic'  },
      { text: 'Doğum gününe {days} gün — {character} şenlik kuruyor', tone: 'energetic'  },
      { text: '{days} gün sonra {timeMood} bir gün başlayacak',        tone: 'calm'       },
    ],
    approaching: [
      { text: '{days} gün kaldı, {character} ışık tutuyor',           tone: 'energetic'  },
      { text: 'Yaklaşıyor — {character} {days} günde seninle',        tone: 'calm'       },
      { text: '{days} gün sonra o an gelecek, {emoji} hazır',         tone: 'reflective' },
    ],
    imminent: [
      { text: 'Bir hafta kaldı, {character} sahneye çıkıyor',         tone: 'energetic'  },
      { text: '{days} gün, {character} yakın ve parlak',              tone: 'mystical'   },
      { text: 'Neredeyse geldi — {signatureStar} parıldıyor',         tone: 'mystical'   },
    ],
    today: [
      { text: 'Bugün! {character} seninle kutluyor {emoji}',          tone: 'energetic'  },
      { text: 'Doğum günün kutlu olsun — {character} altında doğdun', tone: 'reflective' },
      { text: '{timeMood} başlıyor, {character} seninle bugün',       tone: 'calm'       },
    ],
    past: [
      { text: '{daysAbs} gün önceydi — {character} hâlâ hatırlıyor', tone: 'reflective' },
      { text: 'Geçti ama {character} o anı taşıyor',                  tone: 'reflective' },
    ],
  },

  // ── Etkinlik ─────────────────────────────────────────────────────────────────
  event: {
    distant: [
      { text: 'Etkinliğe {days} gün — {character} heyecanlanıyor',   tone: 'energetic'  },
      { text: '{days} günde büyük an, {character} sahnede',           tone: 'energetic'  },
    ],
    approaching: [
      { text: '{days} gün kaldı, {character} {timeMood} bekliyor',   tone: 'calm'       },
      { text: 'Yaklaşıyor — {days} gün, {emoji} hazır',              tone: 'energetic'  },
    ],
    imminent: [
      { text: '{days} gün, {character} sahne ışıklarında',            tone: 'energetic'  },
      { text: 'Neredeyse geldi — {character} son hazırlıkta',        tone: 'reflective' },
    ],
    today: [
      { text: 'Bugün o gün! {character} sahne alıyor {emoji}',       tone: 'energetic'  },
      { text: 'An geldi — {character} {timeMood} seninle',           tone: 'calm'       },
    ],
    past: [
      { text: '{daysAbs} gün oldu — {character} anı saklıyor',       tone: 'reflective' },
    ],
  },

  // ── Tatil ─────────────────────────────────────────────────────────────────────
  vacation: {
    distant: [
      { text: 'Tatile {days} gün — {character} yol haritasında',     tone: 'energetic'  },
      { text: '{days} günde özgürlük, {character} rüzgârda',         tone: 'calm'       },
    ],
    approaching: [
      { text: '{days} gün sonra yola çıkıyorsun, {emoji} hazır mı',  tone: 'energetic'  },
      { text: 'Tatil yaklaşıyor — {character} {days} günde',         tone: 'calm'       },
    ],
    imminent: [
      { text: 'Neredeyse tatil! {days} gün, {character} bekliyor',   tone: 'energetic'  },
      { text: '{days} gün kaldı — bavul hazır mı, {emoji}',          tone: 'energetic'  },
    ],
    today: [
      { text: 'Tatil başlıyor! {character} yolculukta seninle',      tone: 'energetic'  },
      { text: 'Yola çık — {character} {timeMood} rehber',            tone: 'calm'       },
    ],
    past: [
      { text: '{daysAbs} gün oldu, {character} o anı taşıyor',       tone: 'reflective' },
    ],
  },

  // ── Sınav ─────────────────────────────────────────────────────────────────────
  exam: {
    distant: [
      { text: 'Sınava {days} gün — {character} sabır ve odak',       tone: 'calm'       },
      { text: '{days} günde bilgi, {character} rehber yıldız',        tone: 'reflective' },
    ],
    approaching: [
      { text: '{days} gün kaldı, {character} odaklanmış bakıyor',    tone: 'calm'       },
      { text: 'Son koşu — {days} gün, {signatureStar} ışık tutuyor', tone: 'reflective' },
    ],
    imminent: [
      { text: '{days} gün kaldı — {character} son nefes, odak',      tone: 'calm'       },
      { text: 'Neredeyse geldi, {character} seninle son yüzyüz',     tone: 'mystical'   },
    ],
    today: [
      { text: 'Bugün o gün — {character} güç veriyor {emoji}',       tone: 'energetic'  },
      { text: 'Sınav günü, {character} {timeMood} seninle',          tone: 'calm'       },
    ],
    past: [
      { text: '{daysAbs} gün oldu — {character} o cesareti saklıyor', tone: 'reflective' },
    ],
  },

  // ── İş ───────────────────────────────────────────────────────────────────────
  work: {
    distant: [
      { text: 'Hedefe {days} gün — {character} sahnede',             tone: 'energetic'  },
      { text: '{days} günde o an gelecek, {character} odaklı',       tone: 'calm'       },
    ],
    approaching: [
      { text: '{days} gün kaldı, {character} {timeMood} çalışıyor',  tone: 'energetic'  },
      { text: 'Hedef yaklaşıyor — {days} gün, {emoji}',              tone: 'calm'       },
    ],
    imminent: [
      { text: 'Son {days} gün — {character} son hazırlıkta',         tone: 'energetic'  },
      { text: 'Neredeyse bitti, {character} seninle son viraj',      tone: 'reflective' },
    ],
    today: [
      { text: 'Bugün hedef günü! {character} sahne alıyor',          tone: 'energetic'  },
      { text: 'O an geldi — {character} {timeMood} hazır',           tone: 'calm'       },
    ],
    past: [
      { text: '{daysAbs} gün oldu — {character} başarıyı saklıyor',  tone: 'reflective' },
    ],
  },

  // ── Ayrılık ───────────────────────────────────────────────────────────────────
  relationship_breakup: {
    distant: [
      { text: '{days} gün geçti, {character} sessizce yanında',       tone: 'reflective' },
      { text: 'Zaman geçiyor — {days} gün, {character} ışık tutuyor', tone: 'calm'       },
    ],
    approaching: [
      { text: '{days}. günde {character} güç veriyor',               tone: 'reflective' },
      { text: 'Geçiyor, {days} gün oldu — {character} seninle',      tone: 'calm'       },
    ],
    imminent: [
      { text: 'Neredeyse bir hafta — {character} dönüşümde',         tone: 'mystical'   },
      { text: '{days} gün, {character} yeni başlangıç fısıldıyor',   tone: 'reflective' },
    ],
    today: [
      { text: 'Bugün yeni bir sayfa, {character} seninle',           tone: 'calm'       },
      { text: 'Yeni gün — {character} {timeMood} yanında',           tone: 'reflective' },
    ],
    past: [
      { text: '{daysAbs} gün geçti — {character} güç veriyor hâlâ', tone: 'reflective' },
    ],
  },

  // ── Sigarayı bırakma ──────────────────────────────────────────────────────────
  quit_smoking: {
    distant: [
      { text: '{character} yanında, {days}. günde temiz nefes',      tone: 'calm'       },
      { text: 'Phoenix gibi yükseliyorsun, {days} gün oldu',         tone: 'energetic'  },
      { text: '{days} günde özgür akciğer — {character} gururlanıyor', tone: 'reflective' },
    ],
    approaching: [
      { text: '{days}. gün — {character} güçle bakıyor',             tone: 'energetic'  },
      { text: '{days} gün temiz hava, {character} seninle',          tone: 'calm'       },
    ],
    imminent: [
      { text: 'Bir gün daha — {character} cesaretle bakıyor',        tone: 'energetic'  },
      { text: 'Son {days} gün, {signatureStar} ışık tutuyor',        tone: 'mystical'   },
    ],
    today: [
      { text: 'Bugün başlangıç, {character} {timeMood} seninle',     tone: 'energetic'  },
      { text: 'İlk gün — {character} dönüşümde yanında {emoji}',     tone: 'reflective' },
    ],
    past: [
      { text: '{daysAbs} gün özgür — {character} o gücü hatırlıyor', tone: 'reflective' },
    ],
  },

  // ── Alkolü bırakma ────────────────────────────────────────────────────────────
  quit_alcohol: {
    distant: [
      { text: '{days}. günde berrak düşünce, {character} seninle',   tone: 'calm'       },
      { text: '{character} yanında, {days} gün temiz',               tone: 'reflective' },
    ],
    approaching: [
      { text: '{days} gün geçti, {character} güçle bakıyor',         tone: 'energetic'  },
      { text: 'Devam — {days} gün, {character} {timeMood} seninle',  tone: 'calm'       },
    ],
    imminent: [
      { text: 'Kritik son {days} gün, {character} seninle',          tone: 'calm'       },
      { text: 'Bitiyor — {signatureStar} seninle son adım',          tone: 'mystical'   },
    ],
    today: [
      { text: 'Bugün sıfır — {character} dönüşüm başlıyor',         tone: 'energetic'  },
      { text: 'Yeni sayfa açılıyor, {emoji} {character} seninle',    tone: 'reflective' },
    ],
    past: [
      { text: '{daysAbs} gün temiz — {character} o gücü saklıyor',   tone: 'reflective' },
    ],
  },

  // ── Spor ─────────────────────────────────────────────────────────────────────
  sport: {
    distant: [
      { text: 'Yarışa {days} gün, {character} odaklanmış bakıyor',   tone: 'energetic'  },
      { text: '{days} günde o an, {character} antrenman havasında',  tone: 'energetic'  },
    ],
    approaching: [
      { text: '{days} gün kaldı — {character} son süratte',          tone: 'energetic'  },
      { text: 'Hedef yakın, {days} gün, {emoji}',                    tone: 'energetic'  },
    ],
    imminent: [
      { text: 'Son {days} gün — {character} hazır ve güçlü',         tone: 'energetic'  },
      { text: 'Neredeyse geldi — {signatureStar} ışık tutuyor',      tone: 'mystical'   },
    ],
    today: [
      { text: 'Yarış günü! {character} seninle {emoji}',             tone: 'energetic'  },
      { text: 'Bugün o gün — {character} {timeMood} sahne alıyor',   tone: 'energetic'  },
    ],
    past: [
      { text: '{daysAbs} gün oldu — {character} o gücü taşıyor',     tone: 'reflective' },
    ],
  },

  // ── Beslenme ─────────────────────────────────────────────────────────────────
  nutrition: {
    distant: [
      { text: '{days}. günde dengeli beslenme, {character} yanında', tone: 'calm'       },
      { text: '{character} rehber, {days} gün sağlıkla',             tone: 'calm'       },
    ],
    approaching: [
      { text: '{days} gün devam — {character} güçle bakıyor',        tone: 'energetic'  },
      { text: 'Süregidiyor, {days} gün, {emoji}',                    tone: 'calm'       },
    ],
    imminent: [
      { text: 'Son {days} gün, {character} seninle bitiş çizgisinde', tone: 'energetic' },
      { text: 'Neredeyse bitti — {signatureStar} son adımda',        tone: 'reflective' },
    ],
    today: [
      { text: 'Bugün sıfır noktası — {character} {timeMood} başlıyor', tone: 'energetic' },
      { text: 'Yeni alışkanlık, {emoji} {character} seninle',        tone: 'calm'       },
    ],
    past: [
      { text: '{daysAbs} gün sağlıkla — {character} o anı saklıyor', tone: 'reflective' },
    ],
  },

  // ── Meditasyon ────────────────────────────────────────────────────────────────
  meditation: {
    distant: [
      { text: '{days}. günde derin nefes — {character} sessizce parlıyor', tone: 'calm'     },
      { text: 'Lyra\'nın ezgisi gibi, {days} gün sürdü',             tone: 'mystical'   },
      { text: '{character} dinginlikle bekliyor — {days} gün',       tone: 'reflective' },
    ],
    approaching: [
      { text: '{days} gün, {character} sessizlikle seninle',         tone: 'calm'       },
      { text: 'An içinde kal — {days} gün, {signatureStar} dingin',  tone: 'mystical'   },
    ],
    imminent: [
      { text: 'Yarın o an — {character} hazır ve dingin',            tone: 'calm'       },
      { text: '{days} gün kaldı, {character} son nefes',             tone: 'reflective' },
    ],
    today: [
      { text: 'Bugün an\'da kal, {character} seninle',               tone: 'calm'       },
      { text: '{timeMood} nefes al — {character} {emoji} yanında',   tone: 'mystical'   },
    ],
    past: [
      { text: '{daysAbs} gün dinginlik — {character} o sessizliği taşıyor', tone: 'reflective' },
    ],
  },

  // ── Akademik gelişim ─────────────────────────────────────────────────────────
  academic_progress: {
    distant: [
      { text: 'Hedefe {days} gün — {character} kitap başında',       tone: 'calm'       },
      { text: '{days} günde bilgi, {character} rehber yıldız',       tone: 'reflective' },
    ],
    approaching: [
      { text: '{days} gün kaldı, {character} odaklanmış',            tone: 'calm'       },
      { text: 'Son koşu — {days} gün, {signatureStar} ışık',        tone: 'energetic'  },
    ],
    imminent: [
      { text: 'Neredeyse geldi — {character} son hazırlıkta',        tone: 'calm'       },
      { text: '{days} gün, {character} son viraj',                   tone: 'energetic'  },
    ],
    today: [
      { text: 'Bugün o gün! {character} {timeMood} seninle',         tone: 'energetic'  },
      { text: 'An geldi — {character} {emoji} sahne alıyor',         tone: 'energetic'  },
    ],
    past: [
      { text: '{daysAbs} gün oldu — {character} başarıyı saklıyor',  tone: 'reflective' },
    ],
  },

  // ── İlişki gelişimi ───────────────────────────────────────────────────────────
  relationship_growth: {
    distant: [
      { text: 'O ana {days} gün — {character} bağı güçlendiriyor',   tone: 'calm'       },
      { text: '{days} günde derin bağ, {character} rehber',          tone: 'reflective' },
    ],
    approaching: [
      { text: '{days} gün kaldı, {character} sıcacık bekliyor',      tone: 'calm'       },
      { text: 'Yaklaşıyor — {days} gün, {emoji} {character}',        tone: 'energetic'  },
    ],
    imminent: [
      { text: 'Neredeyse geldi — {character} son fısıltıda',         tone: 'mystical'   },
      { text: '{days} gün, {signatureStar} bağı aydınlatıyor',       tone: 'reflective' },
    ],
    today: [
      { text: 'Bugün o özel an — {character} {timeMood} seninle',    tone: 'calm'       },
      { text: 'An geldi, {emoji} {character} kutluyor',              tone: 'energetic'  },
    ],
    past: [
      { text: '{daysAbs} gün oldu — {character} o anı saklıyor',     tone: 'reflective' },
    ],
  },

  // ── Hedef ────────────────────────────────────────────────────────────────────
  goal: {
    distant: [
      { text: 'Hedefe {days} gün — {character} odaklı bakıyor',      tone: 'energetic'  },
      { text: '{days} günde o an gelecek, {character} rehber',       tone: 'calm'       },
    ],
    approaching: [
      { text: '{days} gün kaldı, {character} son sürat',             tone: 'energetic'  },
      { text: 'Hedef yaklaşıyor — {days} gün, {emoji}',             tone: 'calm'       },
    ],
    imminent: [
      { text: 'Son {days} gün — {character} finale hazır',           tone: 'energetic'  },
      { text: 'Neredeyse bitti — {signatureStar} son adımda',        tone: 'mystical'   },
    ],
    today: [
      { text: 'Bugün hedef günü! {character} sahne alıyor {emoji}',  tone: 'energetic'  },
      { text: 'An geldi — {character} {timeMood} seninle',           tone: 'calm'       },
    ],
    past: [
      { text: '{daysAbs} gün oldu — {character} o başarıyı taşıyor', tone: 'reflective' },
    ],
  },

  // ── Genel / fallback ──────────────────────────────────────────────────────────
  other: {
    distant: [
      { text: 'O ana {days} gün — {character} yanında',              tone: 'calm'       },
      { text: '{days} günde o an, {character} rehber yıldız',        tone: 'reflective' },
    ],
    approaching: [
      { text: '{days} gün kaldı, {character} {timeMood} bekliyor',   tone: 'calm'       },
      { text: 'Yaklaşıyor — {days} gün, {emoji}',                    tone: 'energetic'  },
    ],
    imminent: [
      { text: 'Neredeyse geldi — {character} son adımda',            tone: 'energetic'  },
      { text: '{days} gün, {signatureStar} ışık tutuyor',            tone: 'mystical'   },
    ],
    today: [
      { text: 'Bugün o gün! {character} seninle {emoji}',            tone: 'energetic'  },
      { text: 'An geldi — {character} {timeMood} hazır',             tone: 'calm'       },
    ],
    past: [
      { text: '{daysAbs} gün oldu — {character} anı saklıyor',       tone: 'reflective' },
    ],
  },

};

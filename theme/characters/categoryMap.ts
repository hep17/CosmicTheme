/**
 * 14 kategori → karakter eşleşme tablosu.
 * Spec: docs/03-CHARACTER-SYSTEM-SPEC.md §3.1
 *
 * Her kategori için primary (varsayılan) ve alt (yedek/alternatif) karakter.
 * Hemisphere fallback logic için selectCharacter.ts'e bak.
 *
 * @module characters/categoryMap
 */

import type { CategoryMap } from './types';

/**
 * Kategori → karakter eşleşme haritası.
 *
 * Tasarım notları (spec §3.1'den):
 * - GERİ SAYIM kategorileri (6): doğum günü, etkinlik, tatil, sınav, iş, ayrılık
 * - İLERİ SAYIM kategorileri (8): bırakma, spor, beslenme, meditasyon, gelişim, hedef
 * - FALLBACK: tanımsız kategoriler → centaurus | crux
 *
 * @example
 * ```ts
 * import { CATEGORY_CHARACTER_MAP } from './categoryMap';
 *
 * const entry = CATEGORY_CHARACTER_MAP['birthday'];
 * // → { primary: 'cassiopeia', alt: 'phoenix' }
 * ```
 */
export const CATEGORY_CHARACTER_MAP: CategoryMap = {

  // ─── GERİ SAYIM KATEGORİLERİ ──────────────────────────────────────────────

  /** Doğum günü — taç + yeniden doğuş */
  birthday: {
    primary: 'cassiopeia',   // kraliçe, taç, sabit
    alt: 'phoenix',          // yeniden doğuş, kutlama
  },

  /** Etkinlik/organizasyon — dramatik + odaklı */
  event: {
    primary: 'orion',        // avcı, etkileyici, dramatik
    alt: 'aquila',           // kartal, keskin, hızlı
  },

  /** Tatil/seyahat — hayalci + özgür */
  vacation: {
    primary: 'pleiades',     // yedi kız kardeş, macera, rüya
    alt: 'cygnus',           // kuğu, özgür, süzülme
  },

  /** Sınav/test — odak + güç */
  exam: {
    primary: 'aquila',       // kartal, keskin odak
    alt: 'orion',            // avcı, determinasyon
  },

  /** İş/kariyer — asalet + odak */
  work: {
    primary: 'cassiopeia',   // kraliçe, otorite, güç
    alt: 'aquila',           // kartal, keskin, profesyonel
  },

  /** İlişki ayrılığı — derinlik + hassasiyet */
  relationship_breakup: {
    primary: 'cetus',        // derin su, gizemli, ağır
    alt: 'lyra',             // hassas, sanatçı, duygusal
  },

  // ─── İLERİ SAYIM KATEGORİLERİ ─────────────────────────────────────────────

  /** Sigarayı bırakma — yeniden doğuş + akış */
  quit_smoking: {
    primary: 'phoenix',      // anka, külden doğuş
    alt: 'ursa_major',       // akış, besleyici
  },

  /** Alkolü bırakma — yeniden doğuş + dayanıklılık */
  quit_alcohol: {
    primary: 'phoenix',      // anka, külden doğuş
    alt: 'cassiopeia',       // taht, dayanma, kararlılık
  },

  /** Spor/fitness — keskin + savaşçı */
  sport: {
    primary: 'aquila',       // kartal, hız, güç
    alt: 'orion',            // avcı, savaşçı, enerji
  },

  /** Beslenme/diyet — besleyici + akış */
  nutrition: {
    primary: 'ursa_major',   // büyük kepçe, besleyici
    alt: 'pleiades',         // akış, doğallık
  },

  /** Meditasyon/mindfulness — hassas + dönüşüm */
  meditation: {
    primary: 'lyra',         // lir, sanatçı, iç ses
    alt: 'andromeda',        // dönüşüm, sarmal, derin
  },

  /** Akademik ilerleme — odak + kraliçe */
  academic_progress: {
    primary: 'aquila',       // keskin odak
    alt: 'cassiopeia',       // asalet, disiplin
  },

  /** İlişki gelişimi — yumuşak + özgür */
  relationship_growth: {
    primary: 'lyra',         // hassas, gentle, yaratıcı
    alt: 'cygnus',           // özgür, zarif
  },

  /** Genel hedef — yeniden doğuş + avcı */
  goal: {
    primary: 'phoenix',      // anka, hedef koy, yüksel
    alt: 'orion',            // avcı, nişan al
  },

  // ─── FALLBACK ──────────────────────────────────────────────────────────────

  /** Tanımsız/bilinmeyen kategori — hibrit + pusula */
  other: {
    primary: 'centaurus',    // hibrit, esnek
    alt: 'crux',             // yön, güvenilir
  },

} as const;

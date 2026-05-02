/**
 * Cosmic tema renk paletleri.
 *
 * Her hex değerin yanında OKLCH karşılığı yorum olarak belirtilmiştir.
 * React Native style prop'larında doğrudan hex kullanılır.
 * Animasyon / interpolasyon için oklch.ts fonksiyonlarını kullan.
 *
 * Renk kaynağı: docs/02-OKLCH-MIGRATION-GUIDE.md §2
 *
 * @module colors
 */

// ─── COSMIC NIGHT ───────────────────────────────────────────────────────────
// Tema parametreleri: baseHue=280 (mor), dark background

/**
 * Cosmic Night renk paleti.
 * Koyu mor-siyah arkaplan, aurora vurgu renkleri, cam efekti yüzeyler.
 *
 * @example
 * ```ts
 * import { COSMIC_NIGHT } from './theme';
 *
 * <View style={{ backgroundColor: COSMIC_NIGHT.bg.primary }} />
 * <Text style={{ color: COSMIC_NIGHT.aurora.gold }}>Yıldız</Text>
 * ```
 */
export const COSMIC_NIGHT = {
  /** Arkaplan katmanları — en karanlıktan en açığa */
  bg: {
    primary:   '#02000a',    // oklch(2% 0.03 280)  — en derin arkaplan
    secondary: '#060220',    // oklch(5% 0.04 280)  — kart arkaplanı
    tertiary:  '#0c0628',    // oklch(8% 0.05 280)  — yüzey/panel
    pure:      '#000000',    // oklch(0% 0 0)        — tam siyah (overlay)
  },

  /** Aurora ışık renkleri — animasyon vurguları */
  aurora: {
    gold:   '#FFC93C',       // oklch(86% 0.18 95)  — ana vurgu, altın
    purple: '#B888FF',       // oklch(72% 0.20 295) — mor ışık
    cyan:   '#67B7E3',       // oklch(75% 0.10 230) — cyan parıltı
    pink:   '#FF6FB5',       // oklch(72% 0.20 0)   — pembe ışık
  },

  /** Metin renkleri */
  text: {
    primary:   'rgba(255,255,255,0.97)',   // oklch(100% 0 0 / 0.97)
    secondary: 'rgba(255,255,255,0.78)',   // oklch(100% 0 0 / 0.78)
    tertiary:  'rgba(255,255,255,0.55)',   // oklch(100% 0 0 / 0.55)
    disabled:  'rgba(255,255,255,0.30)',   // oklch(100% 0 0 / 0.30)
  },

  /** Frosted glass (cam) efekti renkleri */
  glass: {
    surface: 'rgba(255,255,255,0.08)',     // oklch(100% 0 0 / 0.08)
    border:  'rgba(255,255,255,0.12)',     // oklch(100% 0 0 / 0.12)
    hover:   'rgba(255,255,255,0.15)',     // oklch(100% 0 0 / 0.15)
  },

  /** Spektral element renkleri (14 kategori için) */
  element: {
    cool:   '#38BDF8',       // oklch(78% 0.13 230)
    warm:   '#F97316',       // oklch(70% 0.18 45)
    green:  '#22C55E',       // oklch(72% 0.18 145)
    purple: '#A855F7',       // oklch(64% 0.22 295)
    pink:   '#EC4899',       // oklch(68% 0.22 0)
    bronze: '#A78B6A',       // oklch(60% 0.05 70)
  },

  /** Tema meta parametreleri (animasyon ve generator için) */
  meta: {
    baseHue:    280,
    warmth:    -0.4,
    lightness:  0.08,
  },
} as const;

// ─── COSMIC DAWN ────────────────────────────────────────────────────────────
// Tema parametreleri: baseHue=30 (turuncu-kızıl), sıcak background

/**
 * Cosmic Dawn renk paleti.
 * Sıcak kızıl-kahve arkaplan, şafak aurora renkleri.
 *
 * @example
 * ```ts
 * import { COSMIC_DAWN } from './theme';
 *
 * <View style={{ backgroundColor: COSMIC_DAWN.bg.primary }} />
 * <Text style={{ color: COSMIC_DAWN.aurora.warmGold }}>Şafak</Text>
 * ```
 */
export const COSMIC_DAWN = {
  /** Arkaplan katmanları — şafak sıcaklığında */
  bg: {
    primary:   '#0a0404',    // oklch(5% 0.04 25)   — en derin
    secondary: '#1a0808',    // oklch(10% 0.06 25)  — kart arkaplanı
    tertiary:  '#2a1018',    // oklch(15% 0.08 12)  — yüzey/panel
    warm:      '#3a1810',    // oklch(20% 0.09 32)  — sıcak yüzey
    surface:   '#4a1f12',    // oklch(25% 0.10 35)  — en açık arkaplan
  },

  /** Aurora ışık renkleri — şafak tonları */
  aurora: {
    warmGold: '#FFB347',     // oklch(82% 0.18 70)  — sıcak altın
    pink:     '#FF8FA3',     // oklch(75% 0.15 12)  — şafak pembesi
    coral:    '#FF6B47',     // oklch(70% 0.22 32)  — mercan
    blush:    '#E89B97',     // oklch(72% 0.10 18)  — pudra
  },

  /** Metin renkleri — hafif sıcak beyaz */
  text: {
    primary:   'rgba(255,245,240,0.97)',   // oklch(98% 0.01 35 / 0.97)
    secondary: 'rgba(255,235,225,0.78)',   // oklch(96% 0.02 35 / 0.78)
    tertiary:  'rgba(255,225,215,0.55)',   // oklch(94% 0.02 35 / 0.55)
    disabled:  'rgba(255,215,200,0.30)',   // oklch(92% 0.02 35 / 0.30)
  },

  /** Frosted glass — sıcak tonu */
  glass: {
    surface: 'rgba(26,8,8,0.45)',          // oklch(10% 0.06 25 / 0.45)
    border:  'rgba(255,179,71,0.14)',      // oklch(82% 0.18 70 / 0.14)
    hover:   'rgba(255,179,71,0.20)',      // oklch(82% 0.18 70 / 0.20)
  },

  /** Tema meta parametreleri */
  meta: {
    baseHue:   30,
    warmth:     0.6,
    lightness:  0.12,
  },
} as const;

// ─── TİP ÇIKARIMI ────────────────────────────────────────────────────────────

/** COSMIC_NIGHT'ın TypeScript tipi */
export type CosmicNightPalette = typeof COSMIC_NIGHT;

/** COSMIC_DAWN'ın TypeScript tipi */
export type CosmicDawnPalette = typeof COSMIC_DAWN;

/** İki temadan birini seçmek için union tipi */
export type CosmicTheme = 'night' | 'dawn';

/** Aktif tema paletini döndürür */
export function getPalette(theme: CosmicTheme): CosmicNightPalette | CosmicDawnPalette {
  return theme === 'night' ? COSMIC_NIGHT : COSMIC_DAWN;
}

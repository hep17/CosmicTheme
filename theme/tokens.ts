/**
 * Design token'ları — spacing, radius, typography, shadow, animation.
 * Magic number kullanma! Her değer buradan alınır.
 *
 * Kullanım:
 * ```ts
 * import { TOKENS } from './theme';
 * style={{ padding: TOKENS.spacing[4], borderRadius: TOKENS.radius.lg }}
 * ```
 *
 * @module tokens
 */

/**
 * Tek kaynak design token sistemi.
 * Tüm numerik/string sabitler buradan gelir.
 */
export const TOKENS = {

  // ─── SPACING ──────────────────────────────────────────────────────────────
  // 4px base grid — 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

  /** Boşluk sistemi (px) — 4px base grid */
  spacing: {
    0:   0,
    1:   4,    // micro gap
    2:   8,    // icon padding
    3:  12,    // compact
    4:  16,    // standart padding
    5:  20,    // rahat padding
    6:  24,    // section gap
    8:  32,    // kart padding
    10: 40,    // büyük gap
    12: 48,    // section padding
    16: 64,    // ekran padding
    20: 80,    // hero gap
    24: 96,    // büyük section
  },

  // ─── BORDER RADIUS ────────────────────────────────────────────────────────

  /** Yuvarlaklık değerleri */
  radius: {
    none:   0,
    xs:     4,
    sm:     8,
    md:    12,
    lg:    16,    // kart köşesi
    xl:    20,
    '2xl': 24,    // büyük kart
    '3xl': 32,    // hero kart
    full:  9999,  // tam yuvarlak (pill, avatar)
  },

  // ─── TYPOGRAPHY ───────────────────────────────────────────────────────────

  /** Font büyüklükleri (sp) */
  fontSize: {
    xs:   10,
    sm:   12,
    base: 14,
    md:   16,
    lg:   18,
    xl:   20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
  },

  /** Satır yüksekliği çarpanları */
  lineHeight: {
    tight:   1.2,
    snug:    1.35,
    normal:  1.5,
    relaxed: 1.65,
    loose:   2.0,
  },

  /** Font ağırlıkları */
  fontWeight: {
    thin:       '100',
    extralight: '200',
    light:      '300',
    normal:     '400',
    medium:     '500',
    semibold:   '600',
    bold:       '700',
    extrabold:  '800',
    black:      '900',
  } as const,

  /** Letter spacing (em) */
  letterSpacing: {
    tighter: -0.05,
    tight:   -0.025,
    normal:   0,
    wide:     0.025,
    wider:    0.05,
    widest:   0.1,
  },

  // ─── Z-INDEX ──────────────────────────────────────────────────────────────

  /** Z-index katmanları */
  zIndex: {
    base:      0,
    raised:   10,
    dropdown: 100,
    sticky:   200,
    modal:    300,
    toast:    400,
    tooltip:  500,
  },

  // ─── ANIMATION ────────────────────────────────────────────────────────────

  /** Animasyon süresi (ms) */
  duration: {
    instant:    0,
    fastest:   50,
    faster:   100,
    fast:     150,
    normal:   250,
    slow:     400,
    slower:   600,
    slowest: 1000,
    theme:   1500,   // tema geçiş animasyonu
  },

  /** Easing fonksiyon isimleri (React Native / Reanimated) */
  easing: {
    linear:    'linear',
    easeIn:    'easeIn',
    easeOut:   'easeOut',
    easeInOut: 'easeInOut',
    spring:    'spring',
  } as const,

  // ─── OPACITY ──────────────────────────────────────────────────────────────

  /** Opaklık değerleri */
  opacity: {
    0:    0,
    5:    0.05,
    8:    0.08,
    10:   0.10,
    12:   0.12,
    15:   0.15,
    20:   0.20,
    25:   0.25,
    30:   0.30,
    45:   0.45,
    50:   0.50,
    55:   0.55,
    65:   0.65,
    75:   0.75,
    78:   0.78,
    90:   0.90,
    97:   0.97,
    100:  1.0,
  },

  // ─── SHADOW ───────────────────────────────────────────────────────────────

  /**
   * Gölge tanımları — React Native elevation/shadow sistemi.
   * iOS: shadow*, Android: elevation
   */
  shadow: {
    none: {
      shadowColor:   'transparent',
      shadowOffset:  { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius:  0,
      elevation:     0,
    },
    sm: {
      shadowColor:   '#000000',
      shadowOffset:  { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius:  4,
      elevation:     2,
    },
    md: {
      shadowColor:   '#000000',
      shadowOffset:  { width: 0, height: 4 },
      shadowOpacity: 0.20,
      shadowRadius:  8,
      elevation:     4,
    },
    lg: {
      shadowColor:   '#000000',
      shadowOffset:  { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius:  16,
      elevation:     8,
    },
    aurora: {
      shadowColor:   '#FFC93C',    // COSMIC_NIGHT aurora.gold
      shadowOffset:  { width: 0, height: 0 },
      shadowOpacity: 0.40,
      shadowRadius:  32,
      elevation:     12,
    },
  },

  // ─── BREAKPOINTS ──────────────────────────────────────────────────────────

  /** Ekran boyutu breakpoint'leri (px) */
  breakpoint: {
    sm:  375,    // küçük telefon (iPhone SE)
    md:  390,    // standart telefon (iPhone 14)
    lg:  430,    // büyük telefon (iPhone 14 Plus)
    xl:  768,    // tablet
    '2xl': 1024, // büyük tablet / laptop
  },

} as const;

/** TOKENS'ın TypeScript tipi (autocompletion için) */
export type DesignTokens = typeof TOKENS;

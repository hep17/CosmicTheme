/**
 * Cosmic Theme — Public API
 *
 * Bu dosya theme/ klasörünün tek giriş noktasıdır.
 * Tüm import'lar buradan yapılır:
 *
 * ```ts
 * import { COSMIC_NIGHT, COSMIC_DAWN, TOKENS } from './theme';
 * import { hex2oklch, interpolateOklch }        from './theme';
 * import { contrastRatio, meetsWCAG_AAA }        from './theme';
 * ```
 */

// ─── COLORS ──────────────────────────────────────────────────────────────────
export {
  COSMIC_NIGHT,
  COSMIC_DAWN,
  getPalette,
} from './colors';

export type {
  CosmicNightPalette,
  CosmicDawnPalette,
  CosmicTheme,
} from './colors';

// ─── TOKENS ──────────────────────────────────────────────────────────────────
export { TOKENS } from './tokens';
export type { DesignTokens } from './tokens';

// ─── UTILS: OKLCH ────────────────────────────────────────────────────────────
export {
  hex2oklch,
  oklch2hex,
  interpolateOklch,
  interpolateHue,
} from './utils/oklch';

export type { OklchColor } from './utils/oklch';

// ─── UTILS: CONTRAST ─────────────────────────────────────────────────────────
export {
  contrastRatio,
  meetsWCAG_AAA,
  meetsWCAG_AA,
} from './utils/contrast';

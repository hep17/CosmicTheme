/**
 * Cosmic Theme -- Public API
 *
 * Bu dosya theme/ klasorunun tek giris noktasidir.
 * Tum import'lar buradan yapilir:
 *
 * import { COSMIC_NIGHT, COSMIC_DAWN, TOKENS } from './theme';
 * import { GlassCard } from './theme';
 */

// COLORS
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

// TOKENS
export { TOKENS } from './tokens';
export type { DesignTokens } from './tokens';

// UTILS: OKLCH
export {
  hex2oklch,
  oklch2hex,
  interpolateOklch,
  interpolateHue,
} from './utils/oklch';

export type { OklchColor } from './utils/oklch';

// UTILS: CONTRAST
export {
  contrastRatio,
  meetsWCAG_AAA,
  meetsWCAG_AA,
} from './utils/contrast';

// COMPONENTS
export { GlassCard } from './components/GlassCard';
export type {
  GlassCardProps,
  GlassCardPadding,
  GlassCardRadius,
  GlassCardIntensity,
  GlassCardVariant,
} from './components/GlassCard';

// STARS COMPONENT
export { Stars } from './components/Stars';
export type {
  StarsProps,
  StarsDensity,
  StarsVariant,
  StarsSpeed,
} from './components/Stars';

// MOOD ENGINE
export { generateEyebrow } from './mood/generator';
export type {
  MoodContext,
  EyebrowResult,
  EyebrowTone,
  DayBucket,
  TimeOfDay,
} from './mood/types';

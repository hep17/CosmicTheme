/**
 * theme/characters — Public API
 *
 * ```ts
 * import { CHARACTERS, selectCharacter } from './theme/characters';
 * import { SPECTRAL_COLORS, CHARACTER_SPECTRAL } from './theme/characters';
 * import type { ThemeCharacter, CharacterId, CategoryKey } from './theme/characters';
 * ```
 */

// ─── KARAKTERLER ─────────────────────────────────────────────────────────────
export { CHARACTERS } from './characters';

// ─── KATEGORİ HARİTASI ───────────────────────────────────────────────────────
export { CATEGORY_CHARACTER_MAP } from './categoryMap';

// ─── SEÇIM ALGORİTMASI ───────────────────────────────────────────────────────
export {
  selectCharacter,
  getAvailableCharacters,
  isVisibleFrom,
} from './selectCharacter';

// ─── SPEKTRAL ────────────────────────────────────────────────────────────────
export {
  SPECTRAL_COLORS,
  CHARACTER_SPECTRAL,
  getSpectralGlow,
  getCharacterCoreColor,
} from './spectral';

// ─── TİPLER ──────────────────────────────────────────────────────────────────
export type {
  CharacterId,
  CategoryKey,
  Hemisphere,
  ThemeVariant,
  SpectralClass,
  Emotion,
  Archetype,
  TwinkleProfile,
  DriftPattern,
  TimeMood,
  InteractionPattern,
  StarPoint,
  ShapeDefinition,
  SignatureStar,
  Personality,
  MotionProfile,
  VoiceProfile,
  CardSignature,
  Affinities,
  StoryMode,
  ThemeCharacter,
  CharactersRecord,
  CategoryMapping,
  CategoryMap,
  SelectCharacterOptions,
} from './types';

/**
 * Mood Engine — Public API
 *
 * import { generateEyebrow }              from './theme/mood';
 * import type { MoodContext, EyebrowResult } from './theme/mood';
 *
 * @module theme/mood
 */

export { generateEyebrow } from './generator';

export type {
  MoodContext,
  EyebrowResult,
  EyebrowTone,
  DayBucket,
  TimeOfDay,
} from './types';

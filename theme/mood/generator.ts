/**
 * Mood Engine — Eyebrow generator.
 *
 * generateEyebrow(context) ana API:
 *   1. Gün kovası belirle (distant / approaching / imminent / today / past)
 *   2. Corpus'tan kategori + bucket'ı al; 'other' ile fallback
 *   3. Random phrase seç
 *   4. Placeholder'ları interpolate et
 *   5. Variant uzunluğuna kes/doğrula
 *   6. Tone belirle (karakter personality + phrase tone)
 *   7. EyebrowResult döndür
 *
 * Pure function — side-effect yok, test edilebilir.
 *
 * Spec: docs/05-MOOD-ENGINE-SPEC.md §3 ve §5
 *
 * @module theme/mood/generator
 */

import type {
  MoodContext,
  EyebrowResult,
  EyebrowTone,
  DayBucket,
  TimeOfDay,
  CategoryPhrases,
  PhraseEntry,
} from './types';
import { CORPUS_TR } from './corpus';

// ─── YARDIMCI: GÜN KOVASI ────────────────────────────────────────────────────

/**
 * daysLeft değerinden kova hesaplar.
 */
function getDayBucket(daysLeft: number): DayBucket {
  if (daysLeft < 0)   return 'past';
  if (daysLeft === 0) return 'today';
  if (daysLeft <= 7)  return 'imminent';
  if (daysLeft <= 30) return 'approaching';
  return 'distant';
}

// ─── YARDIMCI: SAAT → ZAMaN DİLİMİ ──────────────────────────────────────────

/**
 * 0-23 saat değerinden TimeOfDay belirler.
 */
function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 0  && hour <= 5)  return 'night';
  if (hour >= 6  && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 15) return 'noon';
  return 'evening';
}

/**
 * TimeOfDay'i Türkçe zaman dilimine çevirir ({timeMood} placeholder için).
 */
function timeMoodLabel(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'night':   return 'gece';
    case 'morning': return 'sabah';
    case 'noon':    return 'gündüz';
    case 'evening': return 'akşam';
  }
}

// ─── YARDIMCI: PHRASE SEÇİMİ ─────────────────────────────────────────────────

/**
 * Bucket'a göre phrase listesini döndürür.
 * Eğer bucket boşsa sırayla fallback: approaching → distant → today.
 */
function getBucketPhrases(
  categoryPhrases: CategoryPhrases,
  bucket: DayBucket,
): PhraseEntry[] {
  const list = categoryPhrases[bucket];
  if (list.length > 0) return list;

  // Fallback zinciri
  const fallbacks: DayBucket[] = ['approaching', 'distant', 'today', 'imminent', 'past'];
  for (const fb of fallbacks) {
    if (fb !== bucket && categoryPhrases[fb].length > 0) {
      return categoryPhrases[fb];
    }
  }
  return categoryPhrases.distant; // son çare
}

/**
 * Listeden rastgele bir phrase seçer.
 */
function pickRandom(phrases: PhraseEntry[]): PhraseEntry {
  const idx = Math.floor(Math.random() * phrases.length);
  return phrases[idx];
}

// ─── YARDIMCI: PLACEHOLDER İNTERPOLASYON ────────────────────────────────────

/**
 * {placeholder} değerlerini gerçek değerlerle değiştirir.
 */
function interpolate(
  template: string,
  context: MoodContext,
  timeOfDay: TimeOfDay,
): string {
  const daysAbs = Math.abs(context.daysLeft);

  return template
    .replace(/\{character\}/g,     context.character.name)
    .replace(/\{days\}/g,          String(daysAbs))
    .replace(/\{daysAbs\}/g,       String(daysAbs))
    .replace(/\{timeMood\}/g,      timeMoodLabel(timeOfDay))
    .replace(/\{emoji\}/g,         context.character.emoji)
    .replace(/\{signatureStar\}/g, context.character.signatureStar.name);
}

// ─── YARDIMCI: VARIANT UZUNLUK KONTROLÜ ──────────────────────────────────────

/** Variant uzunluk sınırları (karakter) */
const VARIANT_MAX: Record<NonNullable<MoodContext['variant']>, number> = {
  short:  30,
  medium: 60,
  long:   120,
};

/**
 * Metni variant uzunluğuna göre kırpar.
 * Kırparken son kelimeyi tam bırakır.
 */
function applyVariant(text: string, variant: NonNullable<MoodContext['variant']>): string {
  const max = VARIANT_MAX[variant];
  if (text.length <= max) return text;

  // Son boşluktan kes
  const trimmed = text.slice(0, max);
  const lastSpace = trimmed.lastIndexOf(' ');
  return lastSpace > 0 ? trimmed.slice(0, lastSpace) + '…' : trimmed + '…';
}

// ─── YARDIMCI: TON BELİRLEME ─────────────────────────────────────────────────

/**
 * Karakter personality.emotion'ından EyebrowTone belirler.
 * phrase.tone öncelikli; yoksa karakterden türetilir.
 */
function resolveCharacterTone(emotion: string): EyebrowTone {
  switch (emotion) {
    case 'energetic':
    case 'resilient':
    case 'transformative':
      return 'energetic';
    case 'mystical':
    case 'mysterious':
    case 'sacred':
      return 'mystical';
    case 'regal':
    case 'flowing':
    case 'sensitive':
    case 'free':
      return 'calm';
    default:
      return 'reflective';
  }
}

// ─── ANA FONKSİYON ───────────────────────────────────────────────────────────

/**
 * Bağlama göre şiirsel eyebrow metni üretir.
 *
 * @example
 * ```ts
 * const result = generateEyebrow({
 *   category:  'birthday',
 *   daysLeft:  7,
 *   character: CHARACTERS.cassiopeia,
 *   hour:      14,
 * });
 * // result.text  → "7 gün kaldı, Cassiopeia ışık tutuyor"
 * // result.tone  → 'energetic'
 * // result.source → 'corpus'
 * ```
 */
export function generateEyebrow(context: MoodContext): EyebrowResult {
  // 1. Varsayılan değerler
  const hour    = context.hour    ?? new Date().getHours();
  const variant = context.variant ?? 'medium';

  // 2. Zaman dilimi ve gün kovası
  const timeOfDay = getTimeOfDay(hour);
  const bucket    = getDayBucket(context.daysLeft);

  // 3. Corpus — kategori veya 'other' fallback
  const categoryPhrases: CategoryPhrases =
    CORPUS_TR[context.category] ?? CORPUS_TR.other;

  // 4. Bucket phrase listesi
  const phrases = getBucketPhrases(categoryPhrases, bucket);

  // 5. Rastgele phrase seç
  const phrase = pickRandom(phrases);

  // 6. Interpolasyon
  const interpolated = interpolate(phrase.text, context, timeOfDay);

  // 7. Variant uzunluk uygula
  const text = applyVariant(interpolated, variant);

  // 8. Ton — phrase tone öncelikli, yoksa karakterden
  const tone: EyebrowTone =
    phrase.tone ?? resolveCharacterTone(context.character.personality.emotion);

  return {
    text,
    tone,
    source: 'corpus',
  };
}

/**
 * Mood Engine — TypeScript tip tanımları.
 *
 * Spec: docs/05-MOOD-ENGINE-SPEC.md
 *
 * @module theme/mood/types
 */

import type { CategoryKey, ThemeCharacter } from '../characters/types';

// ─── DIŞA AKTARILAN TİPLER ────────────────────────────────────────────────────

/** Eyebrow üretimi için bağlam */
export interface MoodContext {
  /** 14 uygulama kategorisi */
  category: CategoryKey;
  /** Kalan gün: pozitif → yaklaşıyor, negatif → geçti, 0 → bugün */
  daysLeft: number;
  /** selectCharacter ile seçilmiş tema karakteri */
  character: ThemeCharacter;
  /** Günün saati 0–23 (varsayılan: şu anki saat) */
  hour?: number;
  /** Metin uzunluğu (varsayılan: 'medium') */
  variant?: 'short' | 'medium' | 'long';
}

/** Eyebrow üretim sonucu */
export interface EyebrowResult {
  /** Üretilen metin */
  text: string;
  /** Duygusal ton */
  tone: EyebrowTone;
  /** Üretim kaynağı — şimdilik hep 'corpus' */
  source: 'corpus' | 'llm';
}

/** Eyebrow ton değerleri */
export type EyebrowTone =
  | 'energetic'
  | 'calm'
  | 'mystical'
  | 'reflective';

/** Gün kovası — phrase seçimi için */
export type DayBucket =
  | 'distant'      // daysLeft > 30
  | 'approaching'  // 7 < daysLeft <= 30
  | 'imminent'     // 1 <= daysLeft <= 7
  | 'today'        // daysLeft === 0
  | 'past';        // daysLeft < 0

/** Günün zaman dilimi */
export type TimeOfDay =
  | 'night'    // 00–05
  | 'morning'  // 06–11
  | 'noon'     // 12–15
  | 'evening'; // 16–23

// ─── İÇ TİPLER ───────────────────────────────────────────────────────────────

/** Tek bir phrase girişi */
export interface PhraseEntry {
  /** Türkçe metin — {placeholder} içerebilir */
  text: string;
  /** Bu phrase'in duygusal tonu */
  tone: EyebrowTone;
}

/** Bir kategori için bucket → phrase[] haritası */
export interface CategoryPhrases {
  distant:     PhraseEntry[];
  approaching: PhraseEntry[];
  imminent:    PhraseEntry[];
  today:       PhraseEntry[];
  past:        PhraseEntry[];
}

/** Tam corpus haritası */
export type PhraseCorpus = Record<CategoryKey, CategoryPhrases>;

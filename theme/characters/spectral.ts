/**
 * NASA spektral sınıf renk tablosu.
 * Her yıldız sınıfının bilimsel yüzey sıcaklığına karşılık gelen rengi.
 * Spec: docs/03-CHARACTER-SYSTEM-SPEC.md §12.3
 *
 * @module characters/spectral
 */

import type { SpectralClass, CharacterId } from './types';

// ─── SPECTRAL RENK TABLOSU ───────────────────────────────────────────────────

/**
 * NASA spektral sınıf → renk eşleşmesi.
 * Hex değerler gerçek yıldız rengi standartına uygun.
 *
 * Sıcaklık sırası: O > B > A > F > G > K > M
 *
 * @example
 * ```ts
 * const orionColor = SPECTRAL_COLORS['M'];
 * // → { core: '#FFB888', glow: 'rgba(255,184,136,', name: 'Red Giant' }
 *
 * // React Native / Skia'da kullanım:
 * const glowColor = `${SPECTRAL_COLORS['M'].glow}0.4)`;
 * // → 'rgba(255,184,136,0.4)'
 * ```
 */
export const SPECTRAL_COLORS: Record<SpectralClass, {
  /** Yıldız çekirdeği rengi (hex) */
  core: string;
  /** Glow rgba prefix — alpha'yı kendin ekle: `${glow}0.4)` */
  glow: string;
  /** Sınıf açıklaması */
  name: string;
  /** Yaklaşık yüzey sıcaklığı (Kelvin) */
  tempK: string;
}> = {
  /** Sıcak mavi — >30,000K */
  O: {
    core:  '#A8C6FF',           // oklch(80% 0.08 250)
    glow:  'rgba(168,198,255,',
    name:  'Hot Blue',
    tempK: '>30,000K',
  },
  /** Mavi-beyaz — 10,000–30,000K */
  B: {
    core:  '#B8D4FF',           // oklch(85% 0.06 250)
    glow:  'rgba(184,212,255,',
    name:  'Blue-White',
    tempK: '10,000–30,000K',
  },
  /** Beyaz — 7,500–10,000K */
  A: {
    core:  '#C8DFFF',           // oklch(88% 0.05 250)
    glow:  'rgba(200,223,255,',
    name:  'White',
    tempK: '7,500–10,000K',
  },
  /** Sarı-beyaz — 6,000–7,500K */
  F: {
    core:  '#FFF5E0',           // oklch(97% 0.04 90)
    glow:  'rgba(255,245,224,',
    name:  'Yellow-White',
    tempK: '6,000–7,500K',
  },
  /** Sarı (Güneş benzeri) — 5,200–6,000K */
  G: {
    core:  '#FFE5B0',           // oklch(94% 0.08 90)
    glow:  'rgba(255,229,176,',
    name:  'Yellow',
    tempK: '5,200–6,000K',
  },
  /** Turuncu — 3,700–5,200K */
  K: {
    core:  '#FFD088',           // oklch(88% 0.12 80)
    glow:  'rgba(255,208,136,',
    name:  'Orange',
    tempK: '3,700–5,200K',
  },
  /** Kızıl dev — <3,700K */
  M: {
    core:  '#FFB888',           // oklch(82% 0.12 65)
    glow:  'rgba(255,184,136,',
    name:  'Red Giant',
    tempK: '<3,700K',
  },
} as const;

// ─── KARAKTER İMZA YILDIZLARI ────────────────────────────────────────────────

/**
 * Her karakterin imza yıldızının bilimsel verileri.
 * Spec: docs/03-CHARACTER-SYSTEM-SPEC.md §12.4
 *
 * Tüm spectral class'lar NASA sınıflandırmasına uygun.
 */
export const CHARACTER_SPECTRAL: Record<CharacterId, {
  starName: string;
  spectralClass: SpectralClass;
  note: string;
}> = {
  orion:      { starName: 'Betelgeuse', spectralClass: 'M', note: 'Kızıl dev — yakında süpernova' },
  pleiades:   { starName: 'Alcyone',    spectralClass: 'B', note: 'Pleiades kümesinin en parlağı' },
  cassiopeia: { starName: 'Schedar',    spectralClass: 'K', note: 'Cassiopeia\'nın turuncu devi' },
  crux:       { starName: 'Acrux',      spectralClass: 'B', note: 'Güney Haçı\'nın en parlağı' },
  ursa_major: { starName: 'Mizar',      spectralClass: 'A', note: 'Çift yıldız — Alkor ile test' },
  centaurus:  { starName: 'Rigil Kent', spectralClass: 'G', note: 'Bize en yakın yıldız sistemi' },
  cygnus:     { starName: 'Deneb',      spectralClass: 'A', note: 'Yaz Üçgeni — süper dev' },
  lyra:       { starName: 'Vega',       spectralClass: 'A', note: '12,000 yıl sonra Kuzey Yıldızı' },
  aquila:     { starName: 'Altair',     spectralClass: 'A', note: 'Bize 12. en yakın yıldız' },
  andromeda:  { starName: 'Alpheratz',  spectralClass: 'B', note: 'M31 galaksisi barındırır' },
  cetus:      { starName: 'Diphda',     spectralClass: 'K', note: 'Mira — 332 günlük değişken yıldız' },
  phoenix:    { starName: 'Ankaa',      spectralClass: 'K', note: 'Güney yarımküre yeniden doğuş' },
} as const;

// ─── YARDIMCI FONKSİYONLAR ───────────────────────────────────────────────────

/**
 * Spektral sınıfın glow rengini alpha ile döndürür.
 *
 * @param spectralClass - NASA spektral sınıfı
 * @param alpha - 0.0–1.0 opaklık
 * @returns CSS rgba string
 *
 * @example
 * ```ts
 * getSpectralGlow('M', 0.4);  // → 'rgba(255,184,136,0.4)'
 * getSpectralGlow('A', 0.6);  // → 'rgba(200,223,255,0.6)'
 * ```
 */
export function getSpectralGlow(spectralClass: SpectralClass, alpha: number): string {
  return `${SPECTRAL_COLORS[spectralClass].glow}${alpha})`;
}

/**
 * Karakterin imza yıldızının çekirdek rengini döndürür.
 *
 * @param characterId - Karakter ID'si
 * @returns Hex renk kodu
 *
 * @example
 * ```ts
 * getCharacterCoreColor('orion');   // → '#FFB888'  (kızıl dev)
 * getCharacterCoreColor('lyra');    // → '#C8DFFF'  (beyaz A-class)
 * ```
 */
export function getCharacterCoreColor(characterId: CharacterId): string {
  const spectral = CHARACTER_SPECTRAL[characterId].spectralClass;
  return SPECTRAL_COLORS[spectral].core;
}

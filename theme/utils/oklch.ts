/**
 * OKLCH renk uzayı yardımcı fonksiyonları.
 * culori library üzerinden OKLCH ↔ hex dönüşümleri ve interpolasyon.
 *
 * @module oklch
 */

import { converter, formatHex, interpolate, wcagContrast } from 'culori';

// culori oklch converter — modül kapsamında bir kez oluştur (performans)
const toOklch = converter('oklch');

/** OKLCH renk bileşenleri */
export interface OklchColor {
  /** Lightness: 0–1 (0 = siyah, 1 = beyaz) */
  l: number;
  /** Chroma: 0–0.4 pratik aralık (0 = gri, 0.4 = maksimum doygun) */
  c: number;
  /** Hue: 0–360 derece */
  h: number;
  /** Alpha: 0–1, varsayılan 1 */
  alpha?: number;
}

/**
 * Hex rengi OKLCH bileşenlerine çevirir.
 *
 * @param hex - CSS hex renk kodu (örn: '#FFC93C' veya '#ff0000')
 * @returns OKLCH bileşenleri { l, c, h, alpha }
 *
 * @example
 * ```ts
 * const gold = hex2oklch('#FFC93C');
 * // → { l: 0.863, c: 0.181, h: 94.9, alpha: 1 }
 * ```
 */
export function hex2oklch(hex: string): OklchColor {
  const result = toOklch(hex);
  if (!result) {
    throw new Error(`hex2oklch: geçersiz renk değeri: "${hex}"`);
  }
  return {
    l: result.l ?? 0,
    c: result.c ?? 0,
    h: result.h ?? 0,
    alpha: result.alpha ?? 1,
  };
}

/**
 * OKLCH bileşenlerini hex stringe çevirir.
 * React Native style prop'larında doğrudan kullanılabilir.
 *
 * @param l - Lightness 0–1
 * @param c - Chroma 0–0.4
 * @param h - Hue 0–360
 * @param alpha - Opaklık 0–1 (varsayılan 1)
 * @returns CSS hex string (örn: '#ffc93c')
 *
 * @example
 * ```ts
 * const hex = oklch2hex(0.863, 0.181, 94.9);
 * // → '#ffc83b'  (floating point yuvarlama farkı olabilir)
 * ```
 */
export function oklch2hex(l: number, c: number, h: number, alpha = 1): string {
  // culori'nin interpolate fonksiyonu ile geçici renk objesi oluştur
  const color = { mode: 'oklch' as const, l, c, h, alpha };
  const hex = formatHex(color);
  if (!hex) {
    throw new Error(`oklch2hex: dönüştürme başarısız (l=${l}, c=${c}, h=${h})`);
  }
  return hex;
}

/**
 * İki hex renk arasında OKLCH uzayında interpolasyon yapar.
 * RGB ile kıyaslandığında ara renklerde "gri/kahverengi geçme" olmaz.
 *
 * @param from - Başlangıç rengi (hex)
 * @param to   - Bitiş rengi (hex)
 * @param t    - İlerleme 0–1 (0 = from, 1 = to)
 * @returns Aradaki renk (hex)
 *
 * @example
 * ```ts
 * // Cosmic Night gold → Cosmic Dawn warmGold animasyonu
 * const mid = interpolateOklch('#FFC93C', '#FFB347', 0.5);
 * // → '#ffbf41' (OKLCH uzayında ortası)
 * ```
 */
export function interpolateOklch(from: string, to: string, t: number): string {
  const fn = interpolate([from, to], 'oklch');
  const result = fn(t);
  return formatHex(result) ?? from;
}

/**
 * İki hue açısı arasında en kısa yoldan interpolasyon yapar.
 * Örnek: 350° → 10° doğrudan 20° dönmeli, 340° dönmemeli.
 *
 * @param a - Başlangıç hue açısı (0–360)
 * @param b - Bitiş hue açısı (0–360)
 * @param t - İlerleme 0–1
 * @returns Aradaki hue açısı (0–360)
 *
 * @example
 * ```ts
 * interpolateHue(350, 10, 0.5);  // → 0  (kırmızı bölgesi ortası)
 * interpolateHue(280, 30, 0.5);  // → 335 (Night→Dawn ortası, mor-pembe)
 * ```
 */
export function interpolateHue(a: number, b: number, t: number): number {
  // Açı farkı: [-180, 180] aralığına normalize et
  let diff = ((b - a) % 360 + 360) % 360;
  if (diff > 180) diff -= 360;
  // En kısa yoldan ilerle
  const result = (a + diff * t + 360) % 360;
  return result;
}

// wcagContrast'ı yeniden export et — kullanıcılar tek import yapabilsin
export { wcagContrast };

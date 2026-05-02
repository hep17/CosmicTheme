/**
 * WCAG kontrast kontrol yardımcıları.
 * culori'nin wcagContrast fonksiyonu üzerinden WCAG 2.1 hesabı yapar.
 *
 * Spec notu: WCAG kontrast formülü sRGB relative luminance üzerinden
 * çalışır. culori OKLCH/hex/rgba girişlerini otomatik dönüştürür.
 *
 * @module contrast
 */

import { wcagContrast } from 'culori';

/**
 * İki renk arasındaki WCAG 2.1 kontrast oranını hesaplar.
 * Yüksek değer = daha yüksek kontrast.
 *
 * @param fg - Ön plan rengi (hex, rgb, oklch string)
 * @param bg - Arka plan rengi (hex, rgb, oklch string)
 * @returns Kontrast oranı (1.0 – 21.0)
 *
 * @example
 * ```ts
 * // Cosmic Night: beyaz metin / koyu arkaplan
 * contrastRatio('#FFFFFF', '#02000a');  // → ~18.5 (AAA ✅)
 * contrastRatio('#FFC93C', '#02000a'); // → ~14.1 (AAA ✅)
 * contrastRatio('#888888', '#AAAAAA'); // → ~1.8  (fail ❌)
 * ```
 */
export function contrastRatio(fg: string, bg: string): number {
  return wcagContrast(fg, bg);
}

/**
 * Renk çiftinin WCAG AAA standardını karşılayıp karşılamadığını kontrol eder.
 * AAA eşiği: normal metin ≥ 7:1, büyük metin ≥ 4.5:1 (bu fonksiyon 7:1 kullanır).
 *
 * @param fg - Ön plan rengi (hex, rgb, oklch string)
 * @param bg - Arka plan rengi (hex, rgb, oklch string)
 * @returns `true` ise kontrast oranı ≥ 7.0 (WCAG AAA geçer)
 *
 * @example
 * ```ts
 * meetsWCAG_AAA('#FFFFFF', '#02000a');  // → true  (18.5:1)
 * meetsWCAG_AAA('#888888', '#AAAAAA'); // → false (1.8:1)
 * ```
 */
export function meetsWCAG_AAA(fg: string, bg: string): boolean {
  return contrastRatio(fg, bg) >= 7.0;
}

/**
 * Renk çiftinin WCAG AA standardını karşılayıp karşılamadığını kontrol eder.
 * AA eşiği: normal metin ≥ 4.5:1.
 *
 * @param fg - Ön plan rengi
 * @param bg - Arka plan rengi
 * @returns `true` ise kontrast oranı ≥ 4.5 (WCAG AA geçer)
 *
 * @example
 * ```ts
 * meetsWCAG_AA('#FFC93C', '#02000a'); // → true  (14.1:1)
 * ```
 */
export function meetsWCAG_AA(fg: string, bg: string): boolean {
  return contrastRatio(fg, bg) >= 4.5;
}

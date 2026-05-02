/**
 * Karakter seçim algoritması.
 * Spec: docs/03-CHARACTER-SYSTEM-SPEC.md §3.2
 *
 * Kategori + opsiyonlar → ThemeCharacter döndürür.
 * Hemisphere fallback + alt karakter desteği.
 *
 * @module characters/selectCharacter
 */

import { CHARACTERS } from './characters';
import { CATEGORY_CHARACTER_MAP } from './categoryMap';
import type {
  ThemeCharacter,
  CategoryKey,
  CharacterId,
  SelectCharacterOptions,
} from './types';

// ─── HEMISPHERE KISITLARI ─────────────────────────────────────────────────────

/**
 * Yalnızca kuzey yarımkürede görünen karakterler.
 * Bu karakterler güney yarımküre kullanıcısına gösterilmez (alt'a düşer).
 */
const NORTH_ONLY_CHARACTERS = new Set<CharacterId>([
  'cassiopeia',  // W yıldızı, kuzey kutbunda döner
  'ursa_major',  // Büyük Kepçe, kuzey
  'cygnus',      // Yaz Üçgeni, kuzey
  'andromeda',   // kuzey gökyüzü
  'lyra',        // Vega, kuzey
]);

/**
 * Yalnızca güney yarımkürede görünen karakterler.
 * Bu karakterler kuzey yarımküre kullanıcısına gösterilmez (alt'a düşer).
 */
const SOUTH_ONLY_CHARACTERS = new Set<CharacterId>([
  'crux',        // Güney Haçı
  'centaurus',   // Alpha Centauri
  'phoenix',     // güney gökyüzü
]);

// ─── SEÇİM ALGORİTMASI ───────────────────────────────────────────────────────

/**
 * Kategori ve seçeneklere göre uygun karakteri döndürür.
 *
 * Algoritma sırası:
 * 1. Kategori haritasından primary veya alt ID al
 * 2. Hemisphere kontrolü: kullanıcı güney'deyse kuzey karakterini değiştir
 * 3. Hâlâ uygunsuzsa güvenli fallback uygula
 * 4. CHARACTERS kayıtından karakter döndür
 *
 * @param category - Uygulama kategorisi
 * @param options  - Opsiyonel: hemisphere, theme, useAlt
 * @returns Seçilen ThemeCharacter
 *
 * @example
 * ```ts
 * // Kuzey — birthday → Cassiopeia (kraliçe)
 * const c1 = selectCharacter('birthday', { hemisphere: 'north' });
 * // → CHARACTERS.cassiopeia
 *
 * // Güney — birthday → Cassiopeia kuzey'e ait → Phoenix'e düşer
 * const c2 = selectCharacter('birthday', { hemisphere: 'south' });
 * // → CHARACTERS.phoenix
 *
 * // Alt karakter istendi
 * const c3 = selectCharacter('event', { useAlt: true });
 * // → CHARACTERS.aquila (orion'un alt'ı)
 *
 * // Kategori mapping'den bağımsız doğrudan fallback
 * const c4 = selectCharacter('other');
 * // → CHARACTERS.centaurus
 * ```
 */
export function selectCharacter(
  category: CategoryKey,
  options?: SelectCharacterOptions,
): ThemeCharacter {
  const mapping = CATEGORY_CHARACTER_MAP[category];

  // 1. Alt karakter istendi mi?
  let selectedId: CharacterId = options?.useAlt
    ? mapping.alt
    : mapping.primary;

  // 2. Hemisphere kontrolü
  if (options?.hemisphere === 'south') {
    selectedId = applyHemisphereFallback(selectedId, mapping.alt, 'south');
  } else if (options?.hemisphere === 'north') {
    selectedId = applyHemisphereFallback(selectedId, mapping.alt, 'north');
  }

  // 3. Son kontrol — karakter var mı?
  const character = CHARACTERS[selectedId];
  if (!character) {
    // Savunma: asla olmamalı ama güvenli fallback
    return CHARACTERS.centaurus;
  }

  return character;
}

/**
 * Hemisphere'e göre karakter ID'sini düzeltir.
 * Seçilen karakter uygun yarımkürede değilse alt karaktere geçer.
 *
 * @param id    - Mevcut seçili karakter ID
 * @param altId - Fallback olarak kullanılacak alt ID
 * @param hemisphere - Kullanıcının yarımküresi
 * @returns Düzeltilmiş karakter ID
 */
function applyHemisphereFallback(
  id: CharacterId,
  altId: CharacterId,
  hemisphere: 'north' | 'south',
): CharacterId {
  if (hemisphere === 'south' && NORTH_ONLY_CHARACTERS.has(id)) {
    // Kuzey karakteri güney kullanıcısına verilemez — alt'a düş
    // Alt da kuzey'e aitse sabit bir güney karakter ver
    if (NORTH_ONLY_CHARACTERS.has(altId)) {
      return 'crux'; // güvenli güney fallback
    }
    return altId;
  }

  if (hemisphere === 'north' && SOUTH_ONLY_CHARACTERS.has(id)) {
    // Güney karakteri kuzey kullanıcısına verilemez — alt'a düş
    if (SOUTH_ONLY_CHARACTERS.has(altId)) {
      return 'cassiopeia'; // güvenli kuzey fallback
    }
    return altId;
  }

  return id;
}

// ─── YARDIMCI FONKSİYONLAR ───────────────────────────────────────────────────

/**
 * Belirli bir kategori için hangi karakterlerin uygun olduğunu listeler.
 * Debugging ve UI için kullanışlı.
 *
 * @example
 * ```ts
 * getAvailableCharacters('birthday', 'south');
 * // → [CHARACTERS.phoenix]  (cassiopeia kuzey'e ait, sadece alt gösterilir)
 * ```
 */
export function getAvailableCharacters(
  category: CategoryKey,
  hemisphere?: 'north' | 'south',
): ThemeCharacter[] {
  const mapping = CATEGORY_CHARACTER_MAP[category];
  const candidates: CharacterId[] = [mapping.primary, mapping.alt];

  return candidates
    .filter((id) => {
      if (hemisphere === 'south' && NORTH_ONLY_CHARACTERS.has(id)) return false;
      if (hemisphere === 'north' && SOUTH_ONLY_CHARACTERS.has(id)) return false;
      return true;
    })
    .map((id) => CHARACTERS[id]);
}

/**
 * Bir karakterin belirli bir yarımkürede görünüp görünmediğini kontrol eder.
 *
 * @example
 * ```ts
 * isVisibleFrom('cassiopeia', 'south'); // → false
 * isVisibleFrom('crux',       'north'); // → false
 * isVisibleFrom('orion',      'south'); // → true (both)
 * ```
 */
export function isVisibleFrom(
  characterId: CharacterId,
  hemisphere: 'north' | 'south',
): boolean {
  if (hemisphere === 'south' && NORTH_ONLY_CHARACTERS.has(characterId)) return false;
  if (hemisphere === 'north' && SOUTH_ONLY_CHARACTERS.has(characterId)) return false;
  return true;
}

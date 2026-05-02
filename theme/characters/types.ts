/**
 * Theme Character System — TypeScript tip tanımları.
 * Spec: docs/03-CHARACTER-SYSTEM-SPEC.md §1 ve §8
 *
 * @module characters/types
 */

// ─── TEMEL ID'LER ────────────────────────────────────────────────────────────

/** 12 sabit karakter ID'si */
export type CharacterId =
  | 'orion'
  | 'pleiades'
  | 'cassiopeia'
  | 'crux'
  | 'ursa_major'
  | 'centaurus'
  | 'cygnus'
  | 'lyra'
  | 'aquila'
  | 'andromeda'
  | 'cetus'
  | 'phoenix';

/** 14 uygulama kategorisi + fallback */
export type CategoryKey =
  | 'birthday'
  | 'event'
  | 'vacation'
  | 'exam'
  | 'work'
  | 'relationship_breakup'
  | 'quit_smoking'
  | 'quit_alcohol'
  | 'sport'
  | 'nutrition'
  | 'meditation'
  | 'academic_progress'
  | 'relationship_growth'
  | 'goal'
  | 'other';

/** Coğrafi yarımküre */
export type Hemisphere = 'north' | 'south' | 'both';

/** Tema varyantı */
export type ThemeVariant = 'night' | 'dawn';

// ─── NASA SPEKTRAl SINIF ─────────────────────────────────────────────────────

/** NASA spektral sınıflandırma */
export type SpectralClass = 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';

// ─── KİŞİLİK ─────────────────────────────────────────────────────────────────

/** Karakterin duygusal tonu */
export type Emotion =
  | 'energetic'
  | 'mystical'
  | 'regal'
  | 'sacred'
  | 'flowing'
  | 'wild'
  | 'free'
  | 'sensitive'
  | 'sharp'
  | 'transformative'
  | 'mysterious'
  | 'resilient';

/** Karakterin arketip kimliği */
export type Archetype =
  | 'hunter'
  | 'dreamer'
  | 'queen'
  | 'compass'
  | 'water-bearer'
  | 'hybrid'
  | 'wanderer'
  | 'artist'
  | 'predator'
  | 'shapeshifter'
  | 'beast'
  | 'reborn';

// ─── HAREKET DNA'SI ──────────────────────────────────────────────────────────

/** Yıldız pırıltı profili — her karaktere özgü */
export type TwinkleProfile =
  | 'sharp'       // Orion — keskin, dramatik
  | 'soft'        // Pleiades — yumuşak, hayalci
  | 'steady'      // Cassiopeia — kararlı, sakin
  | 'rhythmic'    // Crux — ritmik, geometrik
  | 'wave'        // Ursa Major — dalgalı, akan
  | 'dual'        // Centaurus — iki tip karışık
  | 'graceful'    // Cygnus — zarif, akıcı
  | 'melodic'     // Lyra — müzikal ritim
  | 'swift'       // Aquila — hızlı, sert
  | 'morphing'    // Andromeda — dönüşen
  | 'deep'        // Cetus — derin, ölçülü
  | 'pulse-rise'; // Phoenix — sönüp parlar (alev)

/** Sürüklenme hareketi deseni */
export type DriftPattern =
  | 'march'           // Orion kuşağı
  | 'cluster-breath'  // Pleiades
  | 'enthroned'       // Cassiopeia — hareketsiz
  | 'pivot'           // Crux
  | 'pour'            // Ursa Major kepçe
  | 'gallop'          // Centaurus
  | 'glide'           // Cygnus
  | 'pluck'           // Lyra teller
  | 'dive'            // Aquila şahin dalışı
  | 'spiral'          // Andromeda galaksi
  | 'submerge'        // Cetus dalgalanma
  | 'flame';          // Phoenix alev

/** Zaman bazlı mood etkisi */
export type TimeMood =
  | 'evening-strong'
  | 'late-night'
  | 'midnight'
  | 'pre-dawn'
  | 'dawn-strong'
  | 'twilight'
  | 'all-night'
  | 'late-evening'
  | 'midnight-strong'
  | 'pre-dawn-strong'
  | 'midnight-deep'
  | 'sunrise';

/** Etkileşim deseni */
export type InteractionPattern = 'tap' | 'longPress' | 'shake';

// ─── ŞEKİL TANIMLAMALARI ─────────────────────────────────────────────────────

/** Tek bir yıldızın koordinat ve boyut bilgisi */
export interface StarPoint {
  /** X koordinatı (0–100 görüntüleme birimi) */
  x: number;
  /** Y koordinatı (0–100 görüntüleme birimi) */
  y: number;
  /** Görsel boyut çarpanı (1.0 = standart) */
  size: number;
  /** Opsiyonel yıldız adı (Betelgeuse, Vega vs.) */
  name?: string;
  /** Andromeda M31 galaksisi gibi bulanık render */
  smudge?: boolean;
}

/** Takımyıldızın görsel şekli (SVG koordinat sistemi) */
export interface ShapeDefinition {
  /** Yıldız noktaları */
  stars: StarPoint[];
  /**
   * Yıldızlar arası bağlantı çizgileri.
   * Her öğe [from_index, to_index] çiftini temsil eder.
   */
  lines: [number, number][];
}

/** İmza yıldızı — en parlak/önemli yıldız */
export interface SignatureStar {
  x: number;
  y: number;
  name: string;
}

// ─── KARAKTER BÖLÜMLERI ──────────────────────────────────────────────────────

/** Kişilik alanı */
export interface Personality {
  emotion: Emotion;
  archetype: Archetype;
}

/** Hareket DNA'sı */
export interface MotionProfile {
  twinkleProfile: TwinkleProfile;
  driftPattern: DriftPattern;
  /** Nefes alma hızı çarpanı (1.0 = normal) */
  breathingRate: number;
}

/** Ses/ton imzası — eyebrow generator için */
export interface VoiceProfile {
  /** Tonlama etiketleri */
  tone: string[];
  /** Anahtar kelimeler */
  keywords: string[];
  /** En güçlü zaman dilimine karşılık gelen mood */
  timeMood: TimeMood;
}

/** Kart davranış imzası */
export interface CardSignature {
  /**
   * Glow yoğunluğu çarpanı.
   * 1.3 = %30 daha parlak, 0.9 = %10 daha sönük
   */
  accentBoost: number;
  /** Tick animasyon hızı yönlendirmesi */
  timingBias: 'fast' | 'standard' | 'slow';
  /**
   * Yıldız yoğunluğu çarpanı.
   * 1.4 = %40 daha bol yıldız (Pleiades gibi)
   */
  densityMultiplier: number;
}

/** Kategori uyumu */
export interface Affinities {
  /** Birincil element/kategori bağlantısı */
  primary: string[];
  /** İkincil bağlantılar */
  secondary: string[];
}

/** Story mode — uzun basma detay görünümü */
export interface StoryMode {
  enabled: boolean;
  /** Karakterin kendi hikayesi (Türkçe) */
  narrative: string;
  interactionPattern: InteractionPattern;
}

// ─── ANA KARAKTER TÜRÜ ───────────────────────────────────────────────────────

/**
 * Tek bir tema karakterinin tam DNA'sı.
 * Tüm field'lar zorunludur — eksik karakter olmaz.
 */
export interface ThemeCharacter {
  /** Benzersiz karakter kimliği */
  id: CharacterId;
  /** Görüntülenecek ad */
  name: string;
  /** IAU bilimsel takımyıldız adı */
  scientificName: string;
  /** UI emoji temsili */
  emoji: string;
  /** Render kalitesi — her zaman NASA kalitesi */
  renderStyle: 'nasa-quality';
  /** SVG şekil koordinatları */
  shape: ShapeDefinition;
  /** En önemli imza yıldızı */
  signatureStar: SignatureStar;
  /** Hangi yarımkürelerde görünür */
  hemisphere: 'north' | 'south' | 'both';
  /** NASA spektral sınıfı (imza yıldızına göre) */
  spectralClass: SpectralClass;
  /** Kişilik */
  personality: Personality;
  /** Hareket DNA'sı */
  motion: MotionProfile;
  /** Ses imzası */
  voice: VoiceProfile;
  /** Kart davranış imzası */
  cardSignature: CardSignature;
  /** Kategori uyumları */
  affinities: Affinities;
  /** Story mode */
  storyMode: StoryMode;
}

// ─── YARDIMCI ────────────────────────────────────────────────────────────────

/** Tüm 12 karakteri içeren kayıt tipi */
export type CharactersRecord = Record<CharacterId, ThemeCharacter>;

/** Kategori eşleşme girdisi */
export interface CategoryMapping {
  primary: CharacterId;
  alt: CharacterId;
}

/** Kategori haritası tipi */
export type CategoryMap = Record<CategoryKey, CategoryMapping>;

/** selectCharacter fonksiyon seçenekleri */
export interface SelectCharacterOptions {
  hemisphere?: Hemisphere;
  theme?: ThemeVariant;
  useAlt?: boolean;
}

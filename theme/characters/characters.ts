/**
 * 12 Tema Karakterinin tam DNA tanımları.
 * Spec: docs/03-CHARACTER-SYSTEM-SPEC.md §2
 *
 * Her karakter sabit ve değişmez — `as const` ile kilitli.
 * SVG koordinatları 0–100 görüntüleme birimi sistemindedir.
 *
 * @module characters/characters
 */

import type { CharactersRecord, ThemeCharacter } from './types';

// ─── 1. ORION — AVCI ─────────────────────────────────────────────────────────

const orion: ThemeCharacter = {
  id: 'orion',
  name: 'Orion',
  scientificName: 'Orion',
  emoji: '🏹',
  renderStyle: 'nasa-quality',
  hemisphere: 'both',
  spectralClass: 'M',

  shape: {
    stars: [
      { x: 46, y:  8, size: 2.0, name: 'Betelgeuse' },   // sol omuz, kızıl dev
      { x: 68, y: 14, size: 1.6, name: 'Bellatrix' },    // sağ omuz
      { x: 34, y: 44, size: 1.4 },                       // kuşak sol
      { x: 50, y: 46, size: 1.4, name: 'Alnilam' },      // kuşak orta
      { x: 66, y: 48, size: 1.4 },                       // kuşak sağ
      { x: 42, y: 76, size: 1.8, name: 'Rigel' },        // sol diz (mavi-beyaz)
      { x: 72, y: 72, size: 1.2, name: 'Saiph' },        // sağ diz
    ],
    lines: [[0,2],[1,2],[2,3],[3,4],[2,5],[1,6],[4,6]],
  },
  signatureStar: { x: 46, y: 8, name: 'Betelgeuse' },

  personality: {
    emotion: 'energetic',
    archetype: 'hunter',
  },

  motion: {
    twinkleProfile: 'sharp',
    driftPattern: 'march',
    breathingRate: 1.2,
  },

  voice: {
    tone: ['cinematic', 'dramatic', 'bold'],
    keywords: ['hunt', 'march', 'forge', 'strike', 'aim'],
    timeMood: 'evening-strong',
  },

  cardSignature: {
    accentBoost: 1.3,
    timingBias: 'fast',
    densityMultiplier: 1.0,
  },

  affinities: {
    primary: ['fire'],
    secondary: ['warm'],
  },

  storyMode: {
    enabled: true,
    narrative: 'Avcı yıldız. Kuşağında üç parlak: Mintaka, Alnilam, Alnitak. Omuzunda Betelgeuse — bir gün süpernova patlayacak.',
    interactionPattern: 'tap',
  },
};

// ─── 2. PLEIADES — YEDİ KIZ KARDEŞ ──────────────────────────────────────────

const pleiades: ThemeCharacter = {
  id: 'pleiades',
  name: 'Pleiades',
  scientificName: 'Pleiades (M45)',
  emoji: '✨',
  renderStyle: 'nasa-quality',
  hemisphere: 'both',
  spectralClass: 'B',

  shape: {
    stars: [
      { x: 30, y: 20, size: 1.7, name: 'Alcyone' },
      { x: 48, y: 16, size: 1.3, name: 'Atlas' },
      { x: 56, y: 28, size: 1.2, name: 'Electra' },
      { x: 20, y: 36, size: 1.1, name: 'Maia' },
      { x: 38, y: 40, size: 1.0 },
      { x: 54, y: 44, size: 1.0 },
      { x: 24, y: 52, size: 0.9 },
    ],
    lines: [[0,1],[0,2],[0,3],[0,4],[1,2],[4,5],[4,6]],
  },
  signatureStar: { x: 30, y: 20, name: 'Alcyone' },

  personality: {
    emotion: 'mystical',
    archetype: 'dreamer',
  },

  motion: {
    twinkleProfile: 'soft',
    driftPattern: 'cluster-breath',
    breathingRate: 0.7,
  },

  voice: {
    tone: ['poetic', 'ethereal', 'distant'],
    keywords: ['drift', 'wander', 'dream', 'whisper'],
    timeMood: 'late-night',
  },

  cardSignature: {
    accentBoost: 1.0,
    timingBias: 'slow',
    densityMultiplier: 1.4,
  },

  affinities: {
    primary: ['air'],
    secondary: ['cool'],
  },

  storyMode: {
    enabled: true,
    narrative: 'Yedi kız kardeş. Aslında binlerce — ama gözle yedisi görünür. M45 açık kümesi, 444 ışık yılı uzakta.',
    interactionPattern: 'longPress',
  },
};

// ─── 3. CASSIOPEIA — KRALİÇE (KUZEY) ────────────────────────────────────────

const cassiopeia: ThemeCharacter = {
  id: 'cassiopeia',
  name: 'Cassiopeia',
  scientificName: 'Cassiopeia',
  emoji: '👑',
  renderStyle: 'nasa-quality',
  hemisphere: 'north',
  spectralClass: 'K',

  shape: {
    stars: [
      { x: 12, y: 40, size: 1.3 },                        // sol kanat
      { x: 28, y: 18, size: 1.5, name: 'Schedar' },       // sol tepe
      { x: 50, y: 36, size: 1.2, name: 'Gamma Cas' },     // orta dip
      { x: 72, y: 16, size: 1.4, name: 'Ruchbah' },       // sağ tepe
      { x: 88, y: 38, size: 1.2 },                        // sağ kanat
    ],
    lines: [[0,1],[1,2],[2,3],[3,4]],
  },
  signatureStar: { x: 28, y: 18, name: 'Schedar' },

  personality: {
    emotion: 'regal',
    archetype: 'queen',
  },

  motion: {
    twinkleProfile: 'steady',
    driftPattern: 'enthroned',
    breathingRate: 0.9,
  },

  voice: {
    tone: ['noble', 'austere', 'proud'],
    keywords: ['throne', 'crown', 'reign', 'endure'],
    timeMood: 'midnight',
  },

  cardSignature: {
    accentBoost: 1.1,
    timingBias: 'standard',
    densityMultiplier: 0.9,
  },

  affinities: {
    primary: ['earth'],
    secondary: ['bronze'],
  },

  storyMode: {
    enabled: true,
    narrative: 'W harfi — kraliçenin tahtı. Asla batmaz, kuzey yarımkürenin sabit yıldızı. Kutup Yıldızı\'nın karşısında döner.',
    interactionPattern: 'tap',
  },
};

// ─── 4. CRUX — GÜNEY HACI (GÜNEY) ───────────────────────────────────────────

const crux: ThemeCharacter = {
  id: 'crux',
  name: 'Crux',
  scientificName: 'Crux Australis',
  emoji: '🧭',
  renderStyle: 'nasa-quality',
  hemisphere: 'south',
  spectralClass: 'B',

  shape: {
    stars: [
      { x: 50, y: 10, size: 1.6, name: 'Gacrux' },       // üst
      { x: 50, y: 70, size: 1.8, name: 'Acrux' },        // alt (en parlak)
      { x: 14, y: 40, size: 1.4, name: 'Mimosa' },       // sol
      { x: 86, y: 36, size: 1.2, name: 'Delta Crux' },   // sağ
    ],
    lines: [[0,1],[2,3]],
  },
  signatureStar: { x: 50, y: 70, name: 'Acrux' },

  personality: {
    emotion: 'sacred',
    archetype: 'compass',
  },

  motion: {
    twinkleProfile: 'rhythmic',
    driftPattern: 'pivot',
    breathingRate: 0.8,
  },

  voice: {
    tone: ['solemn', 'guiding', 'pure'],
    keywords: ['cross', 'point', 'south', 'find'],
    timeMood: 'pre-dawn',
  },

  cardSignature: {
    accentBoost: 1.0,
    timingBias: 'standard',
    densityMultiplier: 0.7,
  },

  affinities: {
    primary: ['earth'],
    secondary: ['bronze'],
  },

  storyMode: {
    enabled: true,
    narrative: 'Güney pusula. Dört yıldız, bir haç — denizcilerin yön bulduğu yer. Avustralya ve Yeni Zelanda bayraklarında.',
    interactionPattern: 'tap',
  },
};

// ─── 5. URSA MAJOR — BÜYÜK AYI (KUZEY) ──────────────────────────────────────

const ursa_major: ThemeCharacter = {
  id: 'ursa_major',
  name: 'Ursa Major',
  scientificName: 'Ursa Major (Big Dipper)',
  emoji: '🐻',
  renderStyle: 'nasa-quality',
  hemisphere: 'north',
  spectralClass: 'A',

  shape: {
    stars: [
      { x: 20, y: 52, size: 1.3 },                        // kepçe sol alt
      { x: 36, y: 46, size: 1.3 },                        // kepçe sol üst
      { x: 52, y: 44, size: 1.3 },                        // kepçe sağ üst
      { x: 54, y: 58, size: 1.3 },                        // kepçe sağ alt
      { x: 62, y: 36, size: 1.5, name: 'Mizar' },        // sap başı
      { x: 74, y: 24, size: 1.2 },                        // sap orta
      { x: 88, y: 14, size: 1.1 },                        // sap ucu
    ],
    lines: [[0,1],[1,2],[2,3],[3,0],[2,4],[4,5],[5,6]],
  },
  signatureStar: { x: 62, y: 36, name: 'Mizar' },

  personality: {
    emotion: 'flowing',
    archetype: 'water-bearer',
  },

  motion: {
    twinkleProfile: 'wave',
    driftPattern: 'pour',
    breathingRate: 0.85,
  },

  voice: {
    tone: ['fluid', 'nurturing', 'eternal'],
    keywords: ['flow', 'pour', 'carry', 'bear'],
    timeMood: 'dawn-strong',
  },

  cardSignature: {
    accentBoost: 1.1,
    timingBias: 'standard',
    densityMultiplier: 1.0,
  },

  affinities: {
    primary: ['water'],
    secondary: ['cool'],
  },

  storyMode: {
    enabled: true,
    narrative: 'Büyük Kepçe. Yedi parlak yıldız — Mizar ile Alkor (yanındaki yıldız) gözünün keskinliğini test eder.',
    interactionPattern: 'tap',
  },
};

// ─── 6. CENTAURUS — KENTAUR (GÜNEY) ─────────────────────────────────────────

const centaurus: ThemeCharacter = {
  id: 'centaurus',
  name: 'Centaurus',
  scientificName: 'Centaurus',
  emoji: '🐎',
  renderStyle: 'nasa-quality',
  hemisphere: 'south',
  spectralClass: 'G',

  shape: {
    stars: [
      { x: 22, y: 20, size: 1.2 },                        // ön sol
      { x: 42, y: 16, size: 1.3 },                        // ön sağ
      { x: 60, y: 28, size: 1.8, name: 'Rigil Kent' },   // Alpha Centauri (en yakın)
      { x: 76, y: 36, size: 1.6, name: 'Hadar' },        // Beta Centauri
      { x: 30, y: 48, size: 1.1 },                        // gövde
      { x: 14, y: 64, size: 1.0 },                        // arka sol bacak
      { x: 46, y: 68, size: 1.0 },                        // arka sağ bacak
    ],
    lines: [[0,1],[1,2],[2,3],[1,4],[4,5],[4,6],[2,4]],
  },
  signatureStar: { x: 60, y: 28, name: 'Rigil Kent' },

  personality: {
    emotion: 'wild',
    archetype: 'hybrid',
  },

  motion: {
    twinkleProfile: 'dual',
    driftPattern: 'gallop',
    breathingRate: 1.0,
  },

  voice: {
    tone: ['mythic', 'wild', 'duality'],
    keywords: ['ride', 'wild', 'duality', 'between'],
    timeMood: 'twilight',
  },

  cardSignature: {
    accentBoost: 1.15,
    timingBias: 'fast',
    densityMultiplier: 1.2,
  },

  affinities: {
    primary: ['water'],
    secondary: ['cool', 'green'],
  },

  storyMode: {
    enabled: true,
    narrative: 'Yarı insan, yarı at. Alpha Centauri — bize en yakın yıldız sistemi, 4.37 ışık yılı.',
    interactionPattern: 'longPress',
  },
};

// ─── 7. CYGNUS — KUĞU (KUZEY) ───────────────────────────────────────────────

const cygnus: ThemeCharacter = {
  id: 'cygnus',
  name: 'Cygnus',
  scientificName: 'Cygnus (Northern Cross)',
  emoji: '🦢',
  renderStyle: 'nasa-quality',
  hemisphere: 'north',
  spectralClass: 'A',

  shape: {
    stars: [
      { x: 30, y:  8, size: 1.6, name: 'Deneb' },        // tepe (kuyruk)
      { x: 30, y: 28, size: 1.2 },
      { x: 30, y: 48, size: 1.1 },
      { x: 18, y: 30, size: 1.0 },
      { x: 42, y: 26, size: 1.0 },
      { x: 30, y: 62, size: 1.3, name: 'Albireo' },      // gaga (çift renk)
    ],
    lines: [[0,1],[1,2],[1,3],[1,4],[2,5]],
  },
  signatureStar: { x: 30, y: 8, name: 'Deneb' },

  personality: {
    emotion: 'free',
    archetype: 'wanderer',
  },

  motion: {
    twinkleProfile: 'graceful',
    driftPattern: 'glide',
    breathingRate: 0.75,
  },

  voice: {
    tone: ['lyrical', 'free', 'melancholic'],
    keywords: ['fly', 'glide', 'free', 'south', 'north'],
    timeMood: 'all-night',
  },

  cardSignature: {
    accentBoost: 1.05,
    timingBias: 'slow',
    densityMultiplier: 1.0,
  },

  affinities: {
    primary: ['cool'],
    secondary: ['purple'],
  },

  storyMode: {
    enabled: true,
    narrative: 'Kuğu. Saman Yolu boyunca uçar. Deneb — gökyüzünün en parlak 19. yıldızı, 2600 ışık yılı uzakta.',
    interactionPattern: 'tap',
  },
};

// ─── 8. LYRA — LİR (SANATÇI) ────────────────────────────────────────────────

const lyra: ThemeCharacter = {
  id: 'lyra',
  name: 'Lyra',
  scientificName: 'Lyra',
  emoji: '🎵',
  renderStyle: 'nasa-quality',
  hemisphere: 'north',
  spectralClass: 'A',

  shape: {
    stars: [
      { x: 25, y:  6, size: 1.7, name: 'Vega' },         // en parlak (5. parlak yıldız)
      { x: 22, y: 22, size: 1.1 },
      { x: 32, y: 22, size: 1.1 },
      { x: 18, y: 48, size: 1.2 },
      { x: 36, y: 48, size: 1.2 },
      { x: 27, y: 70, size: 1.0 },
    ],
    lines: [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[3,4]],
  },
  signatureStar: { x: 25, y: 6, name: 'Vega' },

  personality: {
    emotion: 'sensitive',
    archetype: 'artist',
  },

  motion: {
    twinkleProfile: 'melodic',
    driftPattern: 'pluck',
    breathingRate: 0.9,
  },

  voice: {
    tone: ['poetic', 'gentle', 'creative'],
    keywords: ['sing', 'play', 'string', 'compose', 'feel'],
    timeMood: 'late-evening',
  },

  cardSignature: {
    accentBoost: 1.0,
    timingBias: 'standard',
    densityMultiplier: 0.85,
  },

  affinities: {
    primary: ['purple'],
    secondary: ['pink'],
  },

  storyMode: {
    enabled: true,
    narrative: "Orfeus'un liri. Vega — gökyüzünün en parlak 5. yıldızı, 12.000 yıl sonra Kuzey Yıldızı olacak.",
    interactionPattern: 'tap',
  },
};

// ─── 9. AQUILA — KARTAL ──────────────────────────────────────────────────────

const aquila: ThemeCharacter = {
  id: 'aquila',
  name: 'Aquila',
  scientificName: 'Aquila',
  emoji: '🦅',
  renderStyle: 'nasa-quality',
  hemisphere: 'both',
  spectralClass: 'A',

  shape: {
    stars: [
      { x: 30, y: 30, size: 1.7, name: 'Altair' },       // merkez (hızlı dönen)
      { x: 22, y: 26, size: 1.1 },
      { x: 38, y: 28, size: 1.2 },
      { x: 14, y: 14, size: 0.9 },
      { x: 46, y: 16, size: 0.9 },
      { x: 28, y: 56, size: 1.0 },
      { x: 32, y: 70, size: 0.9 },
    ],
    lines: [[0,1],[0,2],[1,3],[2,4],[0,5],[5,6]],
  },
  signatureStar: { x: 30, y: 30, name: 'Altair' },

  personality: {
    emotion: 'sharp',
    archetype: 'predator',
  },

  motion: {
    twinkleProfile: 'swift',
    driftPattern: 'dive',
    breathingRate: 1.3,
  },

  voice: {
    tone: ['focused', 'sharp', 'commanding'],
    keywords: ['focus', 'strike', 'sharp', 'soar', 'aim'],
    timeMood: 'midnight-strong',
  },

  cardSignature: {
    accentBoost: 1.25,
    timingBias: 'fast',
    densityMultiplier: 0.9,
  },

  affinities: {
    primary: ['warm'],
    secondary: ['fire'],
  },

  storyMode: {
    enabled: true,
    narrative: "Kartal. Altair — Yaz Üçgeni'nin üçüncü ucu, bize en yakın 12. yıldız. Saniyede 286 km döner.",
    interactionPattern: 'tap',
  },
};

// ─── 10. ANDROMEDA — BAŞKALAŞIM (KUZEY) ─────────────────────────────────────

const andromeda: ThemeCharacter = {
  id: 'andromeda',
  name: 'Andromeda',
  scientificName: 'Andromeda',
  emoji: '🌌',
  renderStyle: 'nasa-quality',
  hemisphere: 'north',
  spectralClass: 'B',

  shape: {
    stars: [
      { x:  8, y: 36, size: 1.4 },
      { x: 22, y: 32, size: 1.3, name: 'Mirach' },
      { x: 34, y: 28, size: 1.0 },
      { x: 46, y: 24, size: 1.5, name: 'Alpheratz' },    // Pegasus ile ortak
      { x: 20, y: 50, size: 0.9 },
      { x: 32, y: 14, size: 1.0 },
      { x: 18, y: 16, size: 1.5, smudge: true, name: 'M31 Galaxy' },
    ],
    lines: [[0,1],[1,2],[2,3],[1,4],[2,5]],
  },
  signatureStar: { x: 18, y: 16, name: 'M31 Andromeda Galaxy' },

  personality: {
    emotion: 'transformative',
    archetype: 'shapeshifter',
  },

  motion: {
    twinkleProfile: 'morphing',
    driftPattern: 'spiral',
    breathingRate: 0.6,
  },

  voice: {
    tone: ['mystical', 'mythic', 'becoming'],
    keywords: ['transform', 'become', 'spiral', 'unfold'],
    timeMood: 'pre-dawn-strong',
  },

  cardSignature: {
    accentBoost: 1.1,
    timingBias: 'slow',
    densityMultiplier: 1.3,
  },

  affinities: {
    primary: ['purple'],
    secondary: ['pink'],
  },

  storyMode: {
    enabled: true,
    narrative: 'Andromeda. Bağrında M31 Galaksisi — bize en yakın büyük galaksi, 4 milyar yıl içinde Samanyolu ile çarpışacak.',
    interactionPattern: 'longPress',
  },
};

// ─── 11. CETUS — DENİZ CANAVARI ──────────────────────────────────────────────

const cetus: ThemeCharacter = {
  id: 'cetus',
  name: 'Cetus',
  scientificName: 'Cetus',
  emoji: '🐋',
  renderStyle: 'nasa-quality',
  hemisphere: 'both',
  spectralClass: 'K',

  shape: {
    stars: [
      { x: 12, y: 16, size: 1.4, name: 'Menkar' },
      { x: 28, y: 22, size: 1.1 },
      { x: 42, y: 28, size: 1.3 },
      { x: 22, y: 42, size: 1.0 },
      { x: 38, y: 50, size: 1.2 },
      { x: 14, y: 60, size: 1.5, name: 'Diphda' },       // imza yıldızı
      { x: 46, y: 66, size: 1.0 },
    ],
    lines: [[0,1],[1,2],[1,3],[2,4],[3,5],[4,6]],
  },
  signatureStar: { x: 14, y: 60, name: 'Diphda' },

  personality: {
    emotion: 'mysterious',
    archetype: 'beast',
  },

  motion: {
    twinkleProfile: 'deep',
    driftPattern: 'submerge',
    breathingRate: 0.5,
  },

  voice: {
    tone: ['deep', 'enigmatic', 'oceanic'],
    keywords: ['deep', 'fathom', 'leviathan', 'tide'],
    timeMood: 'midnight-deep',
  },

  cardSignature: {
    accentBoost: 0.9,
    timingBias: 'slow',
    densityMultiplier: 0.95,
  },

  affinities: {
    primary: ['cool'],
    secondary: ['water'],
  },

  storyMode: {
    enabled: true,
    narrative: 'Deniz canavarı. Mira — değişken yıldız, 332 günde 1500 kat parlaklık değiştirir. Derinliğin sembolü.',
    interactionPattern: 'longPress',
  },
};

// ─── 12. PHOENIX — ANKA (GÜNEY) ──────────────────────────────────────────────

const phoenix: ThemeCharacter = {
  id: 'phoenix',
  name: 'Phoenix',
  scientificName: 'Phoenix',
  emoji: '🔥',
  renderStyle: 'nasa-quality',
  hemisphere: 'south',
  spectralClass: 'K',

  shape: {
    stars: [
      { x: 30, y:  6, size: 1.7, name: 'Ankaa' },        // baş (en parlak)
      { x: 18, y: 22, size: 1.1 },
      { x: 42, y: 24, size: 1.2 },
      { x: 12, y: 42, size: 1.0 },
      { x: 48, y: 44, size: 1.0 },
      { x: 30, y: 50, size: 1.3 },
      { x: 22, y: 68, size: 0.9 },
      { x: 38, y: 70, size: 0.9 },
    ],
    lines: [[0,1],[0,2],[1,3],[2,4],[1,5],[2,5],[5,6],[5,7]],
  },
  signatureStar: { x: 30, y: 6, name: 'Ankaa' },

  personality: {
    emotion: 'resilient',
    archetype: 'reborn',
  },

  motion: {
    twinkleProfile: 'pulse-rise',
    driftPattern: 'flame',
    breathingRate: 1.0,
  },

  voice: {
    tone: ['fierce', 'reborn', 'eternal'],
    keywords: ['rise', 'burn', 'rebirth', 'ash', 'flame'],
    timeMood: 'sunrise',
  },

  cardSignature: {
    accentBoost: 1.2,
    timingBias: 'standard',
    densityMultiplier: 1.1,
  },

  affinities: {
    primary: ['warm'],
    secondary: ['fire', 'green'],
  },

  storyMode: {
    enabled: true,
    narrative: 'Anka. Külünden doğar. Güney yarımkürenin "yeniden doğuş" sembolü. Ankaa — turuncu K-sınıfı.',
    interactionPattern: 'longPress',
  },
};

// ─── CHARACTERS OBJECT ───────────────────────────────────────────────────────

/**
 * Tüm 12 tema karakterini içeren ana kayıt.
 *
 * @example
 * ```ts
 * import { CHARACTERS } from './theme/characters';
 *
 * const orion = CHARACTERS.orion;
 * console.log(orion.name);               // 'Orion'
 * console.log(orion.personality.emotion); // 'energetic'
 *
 * // Tüm karakterleri listele
 * Object.values(CHARACTERS).forEach(c => console.log(c.emoji, c.name));
 * ```
 */
export const CHARACTERS: CharactersRecord = {
  orion,
  pleiades,
  cassiopeia,
  crux,
  ursa_major,
  centaurus,
  cygnus,
  lyra,
  aquila,
  andromeda,
  cetus,
  phoenix,
} as const;

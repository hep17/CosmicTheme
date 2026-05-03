/**
 * Cosmic Theme — Showcase / Inventory
 *
 * Tema sisteminin tam envanterini gösteren ekran.
 * Bolumler: Renkler, Tokens, GlassCard, Stars, Atmosfer, Karakterler, Mood Engine
 *
 * @module App
 */

import React, { memo } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { COSMIC_NIGHT, COSMIC_DAWN, TOKENS } from './theme';
import { CosmicAtmosphere } from './theme/components/CosmicAtmosphere';
import { CosmicCharacter } from './theme/components/CosmicCharacter';
import { GlassCard } from './theme/components/GlassCard';
import { Stars } from './theme/components/Stars';
import { CHARACTERS } from './theme/characters';
import type { CharacterId } from './theme/characters/types';
import { generateEyebrow } from './theme/mood';

// ─── YARDIMCI: BOLUM BASLIK + ACIKLAMA ───────────────────────────────────────

interface SectionHeaderProps {
  emoji: string;
  title: string;
  description: string;
}

const SectionHeader = memo(function SectionHeader({
  emoji,
  title,
  description,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{emoji} {title}</Text>
      <Text style={styles.sectionSubtitle}>{description}</Text>
    </View>
  );
});

// ─── BOLUM 1: RENK PALETLERİ ─────────────────────────────────────────────────

interface SwatchProps {
  color: string;
  label: string;
}

const Swatch = memo(function Swatch({ color, label }: SwatchProps): React.JSX.Element {
  return (
    <View style={styles.swatchItem}>
      <View style={[styles.swatchBox, { backgroundColor: color }]} />
      <Text style={styles.swatchLabel}>{label}</Text>
      <Text style={styles.swatchHex}>{color}</Text>
    </View>
  );
});

const ColorSection = memo(function ColorSection(): React.JSX.Element {
  const nightSwatches: Array<{ color: string; label: string }> = [
    { color: COSMIC_NIGHT.aurora.gold,   label: 'gold' },
    { color: COSMIC_NIGHT.aurora.purple, label: 'purple' },
    { color: COSMIC_NIGHT.aurora.cyan,   label: 'cyan' },
    { color: COSMIC_NIGHT.aurora.pink,   label: 'pink' },
    { color: COSMIC_NIGHT.text.primary,  label: 'text.pri' },
    { color: COSMIC_NIGHT.text.secondary,label: 'text.sec' },
    { color: COSMIC_NIGHT.text.tertiary, label: 'text.ter' },
    { color: COSMIC_NIGHT.glass.surface, label: 'glass.srf' },
    { color: COSMIC_NIGHT.glass.border,  label: 'glass.brd' },
  ];

  const dawnSwatches: Array<{ color: string; label: string }> = [
    { color: COSMIC_DAWN.aurora.warmGold, label: 'warmGold' },
    { color: COSMIC_DAWN.aurora.pink,     label: 'pink' },
    { color: COSMIC_DAWN.aurora.coral,    label: 'coral' },
    { color: COSMIC_DAWN.aurora.blush,    label: 'blush' },
    { color: COSMIC_DAWN.text.primary,    label: 'text.pri' },
    { color: COSMIC_DAWN.text.secondary,  label: 'text.sec' },
    { color: COSMIC_DAWN.text.tertiary,   label: 'text.ter' },
    { color: COSMIC_DAWN.glass.surface,   label: 'glass.srf' },
    { color: COSMIC_DAWN.glass.border,    label: 'glass.brd' },
  ];

  return (
    <View>
      <SectionHeader
        emoji="🎨"
        title="RENK PALETLERİ"
        description="OKLCH-based color system, 2 variants"
      />
      <View style={styles.colorColumns}>
        {/* Night */}
        <GlassCard padding="sm" radius="lg" intensity="subtle" style={styles.colorColumn}>
          <Text style={styles.colorColumnTitle}>COSMIC NIGHT</Text>
          <View style={styles.swatchGrid}>
            {nightSwatches.map((s) => (
              <Swatch key={s.label} color={s.color} label={s.label} />
            ))}
          </View>
        </GlassCard>
        {/* Dawn */}
        <GlassCard padding="sm" radius="lg" intensity="subtle" style={styles.colorColumn}>
          <Text style={styles.colorColumnTitle}>COSMIC DAWN</Text>
          <View style={styles.swatchGrid}>
            {dawnSwatches.map((s) => (
              <Swatch key={s.label} color={s.color} label={s.label} />
            ))}
          </View>
        </GlassCard>
      </View>
    </View>
  );
});

// ─── BOLUM 2: DESIGN TOKENS ───────────────────────────────────────────────────

const TokensSection = memo(function TokensSection(): React.JSX.Element {
  const spacingEntries: Array<{ label: string; value: number }> = [
    { label: 'xs/1', value: TOKENS.spacing[1] },
    { label: 'sm/2', value: TOKENS.spacing[2] },
    { label: 'md/4', value: TOKENS.spacing[4] },
    { label: 'lg/6', value: TOKENS.spacing[6] },
    { label: 'xl/8', value: TOKENS.spacing[8] },
    { label: '2xl/10', value: TOKENS.spacing[10] },
  ];

  const radiusEntries: Array<{ label: string; value: number }> = [
    { label: 'sm',   value: TOKENS.radius.sm },
    { label: 'md',   value: TOKENS.radius.md },
    { label: 'lg',   value: TOKENS.radius.lg },
    { label: 'xl',   value: TOKENS.radius.xl },
    { label: '2xl',  value: TOKENS.radius['2xl'] },
    { label: '3xl',  value: TOKENS.radius['3xl'] },
  ];

  const fontEntries: Array<{ label: string; value: number }> = [
    { label: 'xs',   value: TOKENS.fontSize.xs },
    { label: 'sm',   value: TOKENS.fontSize.sm },
    { label: 'base', value: TOKENS.fontSize.base },
    { label: 'md',   value: TOKENS.fontSize.md },
    { label: 'lg',   value: TOKENS.fontSize.lg },
    { label: 'xl',   value: TOKENS.fontSize.xl },
    { label: '2xl',  value: TOKENS.fontSize['2xl'] },
    { label: '3xl',  value: TOKENS.fontSize['3xl'] },
  ];

  return (
    <View>
      <SectionHeader
        emoji="📐"
        title="DESIGN TOKENS"
        description="Spacing, radius, typography scales"
      />
      <GlassCard padding="md" radius="xl" intensity="subtle">
        {/* Spacing */}
        <Text style={styles.tokenGroupLabel}>SPACING</Text>
        <View style={styles.tokenRow}>
          {spacingEntries.map(({ label, value }) => (
            <View key={label} style={styles.tokenSpacingItem}>
              <View style={[styles.tokenSpacingBox, { width: value, height: value }]} />
              <Text style={styles.tokenValueLabel}>{label}</Text>
              <Text style={styles.tokenValueNum}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tokenDivider} />

        {/* Radius */}
        <Text style={styles.tokenGroupLabel}>RADIUS</Text>
        <View style={styles.tokenRow}>
          {radiusEntries.map(({ label, value }) => (
            <View key={label} style={styles.tokenSpacingItem}>
              <View style={[styles.tokenRadiusBox, { borderRadius: value }]} />
              <Text style={styles.tokenValueLabel}>{label}</Text>
              <Text style={styles.tokenValueNum}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tokenDivider} />

        {/* Font sizes */}
        <Text style={styles.tokenGroupLabel}>FONT SIZES</Text>
        <View style={styles.fontList}>
          {fontEntries.map(({ label, value }) => (
            <View key={label} style={styles.fontRow}>
              <Text style={[styles.fontSample, { fontSize: value }]}>Aa</Text>
              <Text style={styles.tokenValueLabel}>{label} — {value}sp</Text>
            </View>
          ))}
        </View>
      </GlassCard>
    </View>
  );
});

// ─── BOLUM 3: GLASSCARD VARYASYONLARI ─────────────────────────────────────────

const GlassCardSection = memo(function GlassCardSection(): React.JSX.Element {
  return (
    <View>
      <SectionHeader
        emoji="🪟"
        title="GLASS CARD"
        description="Frosted glass component with 3 intensity levels"
      />
      <GlassCard padding="sm" radius="sm" intensity="subtle" style={styles.intensityCard}>
        <Text style={styles.intensityLabel}>SUBTLE INTENSITY</Text>
        <Text style={styles.intensityDesc}>blur=16px · tint=5% · border=8%</Text>
      </GlassCard>
      <View style={styles.gap12} />
      <GlassCard padding="md" radius="lg" intensity="standard" style={styles.intensityCard}>
        <Text style={styles.intensityLabel}>STANDARD INTENSITY</Text>
        <Text style={styles.intensityDesc}>blur=28px · tint=10% · border=12%</Text>
      </GlassCard>
      <View style={styles.gap12} />
      <GlassCard padding="lg" radius="xl" intensity="strong" style={styles.intensityCard}>
        <Text style={styles.intensityLabel}>STRONG INTENSITY</Text>
        <Text style={styles.intensityDesc}>blur=40px · tint=15% · border=18%</Text>
      </GlassCard>
    </View>
  );
});

// ─── BOLUM 4: STARS VARYASYONLARI ─────────────────────────────────────────────

const StarsSection = memo(function StarsSection(): React.JSX.Element {
  const variants: Array<{
    density: 'minimal' | 'standard' | 'lush';
    speed: 'slow' | 'normal' | 'fast';
    label: string;
    count: string;
  }> = [
    { density: 'minimal',  speed: 'slow',   label: 'MINIMAL · SLOW',   count: '8 stars' },
    { density: 'standard', speed: 'normal', label: 'STANDARD · NORMAL', count: '24 stars' },
    { density: 'lush',     speed: 'fast',   label: 'LUSH · FAST',       count: '60 stars' },
  ];

  return (
    <View>
      <SectionHeader
        emoji="⭐"
        title="STARS"
        description="Animated star field, 3 density levels"
      />
      {variants.map(({ density, speed, label, count }) => (
        <View key={density} style={styles.starsCardWrapper}>
          <GlassCard padding="md" radius="xl" intensity="subtle" style={styles.starsCard}>
            <Stars density={density} speed={speed} />
            <View style={styles.starsLabel}>
              <Text style={styles.starsLabelText}>{label}</Text>
              <Text style={styles.starsCountText}>{count}</Text>
            </View>
          </GlassCard>
          <View style={styles.gap12} />
        </View>
      ))}
    </View>
  );
});

// ─── BOLUM 5: ATMOSFER ONİZLEME ───────────────────────────────────────────────

const AtmosphereSection = memo(function AtmosphereSection(): React.JSX.Element {
  return (
    <View>
      <SectionHeader
        emoji="🌌"
        title="ATMOSPHERE VARIANTS"
        description="Night vs Dawn — full background variants"
      />
      <View style={styles.atmosRow}>
        {/* Night temsili */}
        <View style={[styles.atmosCard, styles.atmosNightBg]}>
          <Stars density="standard" speed="normal" variant="night" />
          <View style={styles.atmosContent}>
            <Text style={styles.atmosLabel}>NIGHT</Text>
            <Text style={styles.atmosDesc}>hue 280°</Text>
            <View style={styles.atmosSwatchRow}>
              {[COSMIC_NIGHT.aurora.gold, COSMIC_NIGHT.aurora.purple, COSMIC_NIGHT.aurora.cyan].map((c) => (
                <View key={c} style={[styles.atmosSwatch, { backgroundColor: c }]} />
              ))}
            </View>
          </View>
        </View>
        {/* Dawn temsili */}
        <View style={[styles.atmosCard, styles.atmosDawnBg]}>
          <Stars density="standard" speed="normal" variant="dawn" />
          <View style={styles.atmosContent}>
            <Text style={styles.atmosLabel}>DAWN</Text>
            <Text style={styles.atmosDesc}>hue 30°</Text>
            <View style={styles.atmosSwatchRow}>
              {[COSMIC_DAWN.aurora.warmGold, COSMIC_DAWN.aurora.coral, COSMIC_DAWN.aurora.pink].map((c) => (
                <View key={c} style={[styles.atmosSwatch, { backgroundColor: c }]} />
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

// ─── BOLUM 6: KARAKTER GALERİSİ ───────────────────────────────────────────────

const SPECTRAL_LABELS: Record<string, string> = {
  M: 'M · KIZIL DEV',
  K: 'K · TURUNCU',
  G: 'G · SARI',
  A: 'A · BEYAZ',
  B: 'B · MAVI',
  O: 'O · ULTRA',
} as const;

const SPECTRAL_COLORS: Record<string, string> = {
  M: '#FFB888',
  K: '#FFD088',
  G: '#FFE5B0',
  A: '#C8DFFF',
  B: '#B8D4FF',
  O: '#CCE0FF',
} as const;

interface CharGridItemProps {
  characterId: CharacterId;
}

const CharGridItem = memo(function CharGridItem({
  characterId,
}: CharGridItemProps): React.JSX.Element {
  const character = CHARACTERS[characterId];
  const spectralLabel = SPECTRAL_LABELS[character.spectralClass] ?? character.spectralClass;
  const spectralColor = SPECTRAL_COLORS[character.spectralClass] ?? COSMIC_NIGHT.text.primary;

  function handlePress(): void {
    Alert.alert(
      character.emoji + ' ' + character.name,
      character.scientificName + '\n' + character.storyMode.narrative,
      [{ text: 'Tamam' }],
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.charOuter} activeOpacity={0.8}>
      <GlassCard padding="sm" radius="lg" intensity="subtle" style={styles.charCard}>
        <View style={styles.charContent}>
          <Text style={styles.charEmoji}>{character.emoji}</Text>
          <CosmicCharacter id={characterId} size="small" />
          <Text style={styles.charName}>{character.name}</Text>
          <Text style={[styles.charSpectral, { color: spectralColor }]}>
            {spectralLabel}
          </Text>
          <Text style={styles.charStar}>{character.signatureStar.name}</Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
});

const CharactersSection = memo(function CharactersSection(): React.JSX.Element {
  const characterIds = Object.keys(CHARACTERS) as CharacterId[];
  return (
    <View>
      <SectionHeader
        emoji="👥"
        title="CHARACTERS"
        description="12 cosmic characters · NASA spectral classes"
      />
      <View style={styles.charGrid}>
        {characterIds.map((id) => (
          <CharGridItem key={id} characterId={id} />
        ))}
      </View>
    </View>
  );
});

// ─── BOLUM 7: MOOD ENGINE ─────────────────────────────────────────────────────

interface MoodCardProps {
  categoryId: string;
  characterId: CharacterId;
  daysLeft: number;
}

const MoodCard = memo(function MoodCard({
  categoryId,
  characterId,
  daysLeft,
}: MoodCardProps): React.JSX.Element {
  const character = CHARACTERS[characterId];
  const result = generateEyebrow({
    category: categoryId as Parameters<typeof generateEyebrow>[0]['category'],
    daysLeft,
    character,
  });

  return (
    <GlassCard padding="md" radius="lg" intensity="subtle" style={styles.moodCard}>
      <Text style={styles.moodEmoji}>{character.emoji}</Text>
      <Text style={styles.moodEyebrow}>"{result.text}"</Text>
      <View style={styles.moodMeta}>
        <View style={styles.moodToneBadge}>
          <Text style={styles.moodToneText}>{result.tone.toUpperCase()}</Text>
        </View>
        <Text style={styles.moodContext}>
          {character.name} · {daysLeft}g · {categoryId}
        </Text>
      </View>
    </GlassCard>
  );
});

const MoodSection = memo(function MoodSection(): React.JSX.Element {
  const scenarios: Array<{ categoryId: string; characterId: CharacterId; daysLeft: number }> = [
    { categoryId: 'birthday',    characterId: 'cassiopeia', daysLeft: 12  },
    { categoryId: 'quit_smoking',characterId: 'phoenix',    daysLeft: 30  },
    { categoryId: 'meditation',  characterId: 'lyra',       daysLeft: 7   },
    { categoryId: 'birthday',    characterId: 'cassiopeia', daysLeft: 1   },
    { categoryId: 'meditation',  characterId: 'cygnus',     daysLeft: 100 },
  ];

  return (
    <View>
      <SectionHeader
        emoji="💬"
        title="MOOD ENGINE"
        description="Eyebrow text generator, 5 tones"
      />
      {scenarios.map((s, i) => (
        <View key={i}>
          <MoodCard
            categoryId={s.categoryId}
            characterId={s.characterId}
            daysLeft={s.daysLeft}
          />
          {i < scenarios.length - 1 && <View style={styles.gap12} />}
        </View>
      ))}
    </View>
  );
});

// ─── ANA APP ─────────────────────────────────────────────────────────────────

export default function App(): React.JSX.Element {
  return (
    <CosmicAtmosphere variant="night" density="standard">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.heroRow}>
            <Text style={styles.heroTitle}>Cosmic Theme</Text>
            <Text style={styles.heroSub}>v0.1.0 · Inventory</Text>
          </View>

          <View style={styles.gap32} />
          <ColorSection />

          <View style={styles.gap32} />
          <TokensSection />

          <View style={styles.gap32} />
          <GlassCardSection />

          <View style={styles.gap32} />
          <StarsSection />

          <View style={styles.gap32} />
          <AtmosphereSection />

          <View style={styles.gap32} />
          <CharactersSection />

          <View style={styles.gap32} />
          <MoodSection />

          <View style={styles.gap40} />
        </ScrollView>
      </SafeAreaView>
    </CosmicAtmosphere>
  );
}

// ─── STILLER ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
  } as ViewStyle,

  scrollContent: {
    padding: TOKENS.spacing[5],
    paddingTop: TOKENS.spacing[8],
  } as ViewStyle,

  // gaps
  gap12: { height: 12 } as ViewStyle,
  gap32: { height: 32 } as ViewStyle,
  gap40: { height: 40 } as ViewStyle,

  // Hero
  heroRow: {
    alignItems: 'center',
  } as ViewStyle,
  heroTitle: {
    color: COSMIC_NIGHT.aurora.gold,
    fontSize: 40,
    fontWeight: '300',
    fontStyle: 'italic',
    letterSpacing: -1,
  } as TextStyle,
  heroSub: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 4,
  } as TextStyle,

  // Section header
  sectionHeader: {
    marginBottom: TOKENS.spacing[4],
  } as ViewStyle,
  sectionTitle: {
    color: COSMIC_NIGHT.aurora.gold,
    fontSize: 26,
    fontWeight: '300',
    fontStyle: 'italic',
    marginBottom: 2,
  } as TextStyle,
  sectionSubtitle: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: '500',
  } as TextStyle,

  // Bolum 1: Colors
  colorColumns: {
    flexDirection: 'row',
    gap: 8,
  } as ViewStyle,
  colorColumn: {
    flex: 1,
  } as ViewStyle,
  colorColumnTitle: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 8,
    letterSpacing: 1.4,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  } as TextStyle,
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  } as ViewStyle,
  swatchItem: {
    alignItems: 'center',
    width: 44,
  } as ViewStyle,
  swatchBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COSMIC_NIGHT.glass.border,
  } as ViewStyle,
  swatchLabel: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 7,
    marginTop: 3,
    textAlign: 'center',
  } as TextStyle,
  swatchHex: {
    color: COSMIC_NIGHT.text.disabled,
    fontSize: 6,
    textAlign: 'center',
    fontFamily: 'Courier',
  } as TextStyle,

  // Bolum 2: Tokens
  tokenGroupLabel: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 8,
    letterSpacing: 1.6,
    fontWeight: '600',
    marginBottom: 8,
  } as TextStyle,
  tokenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'flex-end',
  } as ViewStyle,
  tokenSpacingItem: {
    alignItems: 'center',
  } as ViewStyle,
  tokenSpacingBox: {
    backgroundColor: COSMIC_NIGHT.aurora.purple + '55',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COSMIC_NIGHT.aurora.purple + '88',
  } as ViewStyle,
  tokenRadiusBox: {
    width: 36,
    height: 36,
    backgroundColor: COSMIC_NIGHT.aurora.cyan + '33',
    borderWidth: 1,
    borderColor: COSMIC_NIGHT.aurora.cyan + '88',
  } as ViewStyle,
  tokenValueLabel: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 7,
    marginTop: 3,
  } as TextStyle,
  tokenValueNum: {
    color: COSMIC_NIGHT.aurora.gold,
    fontSize: 7,
    fontFamily: 'Courier',
  } as TextStyle,
  tokenDivider: {
    height: 1,
    backgroundColor: COSMIC_NIGHT.glass.border,
    marginVertical: 14,
  } as ViewStyle,
  fontList: {
    gap: 6,
  } as ViewStyle,
  fontRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  } as ViewStyle,
  fontSample: {
    color: COSMIC_NIGHT.text.primary,
    fontWeight: '300',
    width: 32,
  } as TextStyle,

  // Bolum 3: GlassCard
  intensityCard: {
    minHeight: 70,
    justifyContent: 'center',
  } as ViewStyle,
  intensityLabel: {
    color: COSMIC_NIGHT.text.primary,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1,
  } as TextStyle,
  intensityDesc: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 9,
    marginTop: 4,
    letterSpacing: 0.5,
  } as TextStyle,

  // Bolum 4: Stars
  starsCardWrapper: {} as ViewStyle,
  starsCard: {
    height: 110,
    overflow: 'hidden',
  } as ViewStyle,
  starsLabel: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  } as ViewStyle,
  starsLabelText: {
    color: COSMIC_NIGHT.text.primary,
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: '500',
  } as TextStyle,
  starsCountText: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 8,
    marginTop: 2,
    letterSpacing: 0.8,
  } as TextStyle,

  // Bolum 5: Atmosphere
  atmosRow: {
    flexDirection: 'row',
    gap: 10,
  } as ViewStyle,
  atmosCard: {
    flex: 1,
    height: 140,
    borderRadius: TOKENS.radius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COSMIC_NIGHT.glass.border,
  } as ViewStyle,
  atmosNightBg: {
    backgroundColor: COSMIC_NIGHT.bg.secondary,
  } as ViewStyle,
  atmosDawnBg: {
    backgroundColor: COSMIC_DAWN.bg.secondary,
  } as ViewStyle,
  atmosContent: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  } as ViewStyle,
  atmosLabel: {
    color: COSMIC_NIGHT.text.primary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
  } as TextStyle,
  atmosDesc: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 8,
    letterSpacing: 1,
    marginTop: 2,
  } as TextStyle,
  atmosSwatchRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
  } as ViewStyle,
  atmosSwatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  } as ViewStyle,

  // Bolum 6: Characters
  charGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  } as ViewStyle,
  charOuter: {
    width: '31%',
  } as ViewStyle,
  charCard: {
    flex: 1,
  } as ViewStyle,
  charContent: {
    alignItems: 'center',
  } as ViewStyle,
  charEmoji: {
    fontSize: 22,
    marginBottom: 4,
  } as TextStyle,
  charName: {
    color: COSMIC_NIGHT.text.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  } as TextStyle,
  charSpectral: {
    fontSize: 7,
    letterSpacing: 0.6,
    marginTop: 2,
    fontWeight: '500',
  } as TextStyle,
  charStar: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 7,
    fontFamily: 'Courier',
    marginTop: 2,
    opacity: 0.55,
  } as TextStyle,

  // Bolum 7: Mood Engine
  moodCard: {
    minHeight: 70,
  } as ViewStyle,
  moodEmoji: {
    fontSize: 18,
    marginBottom: 4,
  } as TextStyle,
  moodEyebrow: {
    color: COSMIC_NIGHT.aurora.gold,
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 8,
  } as TextStyle,
  moodMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  } as ViewStyle,
  moodToneBadge: {
    borderWidth: 1,
    borderColor: COSMIC_NIGHT.aurora.purple + '55',
    borderRadius: TOKENS.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: COSMIC_NIGHT.glass.surface,
  } as ViewStyle,
  moodToneText: {
    color: COSMIC_NIGHT.aurora.purple,
    fontSize: 7,
    letterSpacing: 1.2,
  } as TextStyle,
  moodContext: {
    color: COSMIC_NIGHT.text.tertiary,
    fontSize: 8,
    letterSpacing: 0.5,
  } as TextStyle,

});

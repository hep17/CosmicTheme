/**
 * Cosmic Theme v0.1.0 -- Final Showcase
 *
 * Template kullanan biri "Use this template" tiklayip actiktan
 * sonra gormesi gereken showcase. 3 bolum:
 *   1. HeroHeader  -- baslik, subtitle, stats
 *   2. CategoryShowcase -- 3 hero kart (Birthday/QuitSmoking/Meditation)
 *   3. CharacterGrid    -- 12 karakterin 3 sutunlu galerisi
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
import { COSMIC_NIGHT, TOKENS } from './theme';
import { CosmicAtmosphere } from './theme/components/CosmicAtmosphere';
import { CosmicCharacter } from './theme/components/CosmicCharacter';
import { GlassCard } from './theme/components/GlassCard';
import { Stars } from './theme/components/Stars';
import { CHARACTERS } from './theme/characters';
import type { CharacterId } from './theme/characters/types';
import { generateEyebrow } from './theme/mood';

// ─── YARDIMCI: SPECTRAL LABEL ────────────────────────────────────────────────

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

// ─── HERO HEADER ─────────────────────────────────────────────────────────────

const HeroHeader = memo(function HeroHeader(): React.JSX.Element {
  return (
    <GlassCard padding="lg" radius="xl" intensity="subtle" style={styles.heroHeaderCard}>
      {/* Yildiz dekor */}
      <Stars density="minimal" speed="slow" />

      <View style={styles.heroHeaderContent}>
        {/* Ribbon */}
        <View style={styles.ribbon}>
          <Text style={styles.ribbonText}>★  TEMPLATE  ★</Text>
        </View>

        {/* Ana baslik */}
        <Text style={styles.heroTitle}>Cosmic Theme</Text>

        {/* Subtitle */}
        <Text style={styles.heroSubtitle}>
          atmospheric · time-aware · poetic
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {(['12 KARAKTER', '5 VARIANT', 'OKLCH'] as const).map((label) => (
            <View key={label} style={styles.statPill}>
              <Text style={styles.statPillText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </GlassCard>
  );
});

// ─── CATEGORY SHOWCASE CARD ───────────────────────────────────────────────────

interface CategoryShowcaseCardProps {
  characterId: CharacterId;
  category:    string;
  categoryLabel: string;
  daysLeft:    number;
}

const CategoryShowcaseCard = memo(function CategoryShowcaseCard({
  characterId,
  category,
  categoryLabel,
  daysLeft,
}: CategoryShowcaseCardProps): React.JSX.Element {
  const character = CHARACTERS[characterId];
  const eyebrow   = generateEyebrow({
    category:  category as Parameters<typeof generateEyebrow>[0]['category'],
    daysLeft,
    character,
  });

  return (
    <GlassCard padding="lg" radius="xl" style={styles.showcaseCard}>
      {/* Arka plan yildizlari */}
      <Stars density="lush" />

      {/* Icerik */}
      <View style={styles.showcaseContent}>
        {/* Karakter */}
        <CosmicCharacter id={characterId} size="medium" />

        {/* Eyebrow */}
        <Text style={styles.showcaseEyebrow}>"{eyebrow.text}"</Text>

        {/* Kategori */}
        <Text style={styles.showcaseCategory}>{categoryLabel}</Text>

        {/* Hero number */}
        <View style={styles.heroNumberRow}>
          <Text style={styles.heroNumber}>{daysLeft}</Text>
          <Text style={styles.heroUnit}>GUN KALDI</Text>
        </View>

        {/* Tone badge */}
        <View style={styles.toneBadge}>
          <Text style={styles.toneBadgeText}>{eyebrow.tone.toUpperCase()}</Text>
        </View>
      </View>
    </GlassCard>
  );
});

// ─── CHARACTER GRID ITEM ──────────────────────────────────────────────────────

interface CharacterGridItemProps {
  characterId: CharacterId;
}

const CharacterGridItem = memo(function CharacterGridItem({
  characterId,
}: CharacterGridItemProps): React.JSX.Element {
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
    <TouchableOpacity onPress={handlePress} style={styles.gridItemOuter} activeOpacity={0.8}>
      <GlassCard padding="sm" radius="lg" intensity="subtle" style={styles.gridItemCard}>
        <View style={styles.gridItemContent}>
          <CosmicCharacter id={characterId} size="small" />
          <Text style={styles.gridItemName}>{character.name}</Text>
          <Text style={[styles.gridItemSpectral, { color: spectralColor }]}>
            {spectralLabel}
          </Text>
          <Text style={styles.gridItemStar}>{character.signatureStar.name}</Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
});

// ─── ANA APP ─────────────────────────────────────────────────────────────────

export default function App(): React.JSX.Element {
  const characterIds = Object.keys(CHARACTERS) as CharacterId[];

  return (
    <CosmicAtmosphere variant="night" density="standard">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ── 1. Hero Header ── */}
          <HeroHeader />

          <View style={styles.gap24} />

          {/* ── 2. Category Showcase ── */}
          <Text style={styles.sectionTitle}>Karakter Sahnesi</Text>
          <Text style={styles.sectionSubtitle}>MOOD ENGINE · CORPUS-BASED</Text>
          <View style={styles.gap16} />

          <CategoryShowcaseCard
            characterId="cassiopeia"
            category="birthday"
            categoryLabel="DOGUM GUNU"
            daysLeft={12}
          />
          <View style={styles.gap16} />

          <CategoryShowcaseCard
            characterId="phoenix"
            category="quit_smoking"
            categoryLabel="SIGARA BIRAKMA"
            daysLeft={30}
          />
          <View style={styles.gap16} />

          <CategoryShowcaseCard
            characterId="lyra"
            category="meditation"
            categoryLabel="MEDITASYON"
            daysLeft={7}
          />

          <View style={styles.gap24} />

          {/* ── 3. All 12 Characters ── */}
          <Text style={styles.sectionTitle}>Cosmic Constellations</Text>
          <Text style={styles.sectionSubtitle}>NASA SPECTRAL CLASS</Text>
          <View style={styles.gap16} />

          <View style={styles.characterGrid}>
            {characterIds.map((id) => (
              <CharacterGridItem key={id} characterId={id} />
            ))}
          </View>

          <View style={styles.gap32} />

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with Cosmic Theme by hep17</Text>
            <Text style={styles.footerLink}>github.com/hep17/CosmicTheme</Text>
          </View>

          <View style={styles.gap40} />

        </ScrollView>
      </SafeAreaView>
    </CosmicAtmosphere>
  );
}

// ─── STILLER ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  // SafeArea + Scroll
  safeArea: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    padding: 20,
    paddingTop: 32,
  } as ViewStyle,

  // Gap
  gap16: { height: 16 } as ViewStyle,
  gap24: { height: 24 } as ViewStyle,
  gap32: { height: 32 } as ViewStyle,
  gap40: { height: 40 } as ViewStyle,

  // ── Hero Header ──
  heroHeaderCard: {
    minHeight: 200,
  } as ViewStyle,
  heroHeaderContent: {
    alignItems: 'center',
    paddingVertical: 8,
  } as ViewStyle,
  ribbon: {
    borderWidth:    1,
    borderColor:    COSMIC_NIGHT.glass.border,
    borderRadius:   TOKENS.radius.full,
    paddingHorizontal: 14,
    paddingVertical:    4,
    marginBottom:   16,
  } as ViewStyle,
  ribbonText: {
    color:         COSMIC_NIGHT.aurora.gold,
    fontSize:      9,
    letterSpacing: 2.4,
    fontWeight:    '500',
  } as TextStyle,
  heroTitle: {
    color:        COSMIC_NIGHT.aurora.gold,
    fontSize:     52,
    fontWeight:   '300',
    fontStyle:    'italic',
    textAlign:    'center',
    letterSpacing: -1,
    marginBottom:  8,
  } as TextStyle,
  heroSubtitle: {
    color:         COSMIC_NIGHT.text.secondary,
    fontSize:      13,
    fontStyle:     'italic',
    textAlign:     'center',
    letterSpacing:  0.6,
    marginBottom:  20,
  } as TextStyle,
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  } as ViewStyle,
  statPill: {
    borderWidth:   1,
    borderColor:   COSMIC_NIGHT.glass.border,
    borderRadius:  TOKENS.radius.full,
    paddingHorizontal: 10,
    paddingVertical:    3,
    backgroundColor: COSMIC_NIGHT.glass.surface,
  } as ViewStyle,
  statPillText: {
    color:         COSMIC_NIGHT.text.tertiary,
    fontSize:      9,
    letterSpacing: 1.4,
    fontWeight:    '500',
  } as TextStyle,

  // ── Section headings ──
  sectionTitle: {
    color:       COSMIC_NIGHT.text.primary,
    fontSize:    26,
    fontWeight:  '300',
    fontStyle:   'italic',
    marginBottom: 2,
  } as TextStyle,
  sectionSubtitle: {
    color:         COSMIC_NIGHT.text.tertiary,
    fontSize:      9,
    letterSpacing: 1.8,
    fontWeight:    '500',
  } as TextStyle,

  // ── Category Showcase ──
  showcaseCard: {
    minHeight: 320,
  } as ViewStyle,
  showcaseContent: {
    alignItems:  'center',
    paddingVertical: 8,
  } as ViewStyle,
  showcaseEyebrow: {
    color:        COSMIC_NIGHT.aurora.gold,
    fontSize:     14,
    fontStyle:    'italic',
    textAlign:    'center',
    marginTop:    16,
    marginBottom:  4,
    paddingHorizontal: 8,
  } as TextStyle,
  showcaseCategory: {
    color:         COSMIC_NIGHT.text.tertiary,
    fontSize:      9,
    letterSpacing: 1.8,
    fontWeight:    '500',
    marginTop:     6,
  } as TextStyle,
  heroNumberRow: {
    flexDirection:  'row',
    alignItems:     'baseline',
    gap:             6,
    marginTop:      16,
  } as ViewStyle,
  heroNumber: {
    color:       COSMIC_NIGHT.aurora.gold,
    fontSize:    48,
    fontWeight:  '300',
    letterSpacing: -1,
  } as TextStyle,
  heroUnit: {
    color:         COSMIC_NIGHT.text.secondary,
    fontSize:      11,
    letterSpacing:  1.4,
    fontWeight:    '500',
    alignSelf:     'flex-end',
    marginBottom:   6,
  } as TextStyle,
  toneBadge: {
    marginTop:     10,
    borderWidth:    1,
    borderColor:   COSMIC_NIGHT.aurora.purple + '44',
    borderRadius:  TOKENS.radius.full,
    paddingHorizontal: 10,
    paddingVertical:    3,
    backgroundColor: COSMIC_NIGHT.glass.surface,
  } as ViewStyle,
  toneBadgeText: {
    color:         COSMIC_NIGHT.aurora.purple,
    fontSize:       9,
    letterSpacing:  1.4,
  } as TextStyle,

  // ── Character Grid ──
  characterGrid: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            10,
  } as ViewStyle,
  gridItemOuter: {
    width: '31%',
  } as ViewStyle,
  gridItemCard: {
    flex: 1,
  } as ViewStyle,
  gridItemContent: {
    alignItems: 'center',
  } as ViewStyle,
  gridItemName: {
    color:       COSMIC_NIGHT.text.primary,
    fontSize:    12,
    fontWeight:  '600',
    marginTop:    6,
    textAlign:   'center',
  } as TextStyle,
  gridItemSpectral: {
    fontSize:      8,
    letterSpacing: 0.8,
    marginTop:     3,
    fontWeight:   '500',
  } as TextStyle,
  gridItemStar: {
    color:        COSMIC_NIGHT.text.tertiary,
    fontSize:      8,
    fontFamily:   'Courier',
    marginTop:     2,
    opacity:       0.55,
  } as TextStyle,

  // ── Footer ──
  footer: {
    alignItems: 'center',
    opacity:    0.40,
  } as ViewStyle,
  footerText: {
    color:    COSMIC_NIGHT.text.secondary,
    fontSize: 11,
  } as TextStyle,
  footerLink: {
    color:     COSMIC_NIGHT.aurora.cyan,
    fontSize:  11,
    marginTop:  2,
  } as TextStyle,

});

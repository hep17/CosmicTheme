/**
 * Cosmic Theme — Demo
 *
 * CosmicAtmosphere: aurora drift + parallax yıldızlar
 * Variant toggle: night ↔ dawn
 */

import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { COSMIC_NIGHT, COSMIC_DAWN } from './theme';
import { CosmicAtmosphere, AtmosphereVariant } from './theme/components/CosmicAtmosphere';

export default function App(): React.JSX.Element {
  const [variant, setVariant] = useState<AtmosphereVariant>('night');

  const palette = variant === 'night' ? COSMIC_NIGHT : COSMIC_DAWN;
  const accentColor = variant === 'night' ? COSMIC_NIGHT.aurora.gold : COSMIC_DAWN.aurora.warmGold;
  const subColor = variant === 'night' ? COSMIC_NIGHT.aurora.cyan : COSMIC_DAWN.aurora.coral;

  return (
    <CosmicAtmosphere variant={variant} density="standard">
      <SafeAreaView style={styles.safe}>

        {/* Başlık */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: accentColor }]}>
            Cosmic Theme
          </Text>
          <Text style={[styles.subtitle, { color: palette.text.secondary }]}>
            {variant === 'night'
              ? 'AURORA · YILDIZLAR · PARALLAX'
              : 'ŞAFAK · ALTIN · YUMUŞAK IŞIK'}
          </Text>
        </View>

        {/* Renk Paletleri */}
        <View style={styles.paletteRow}>
          {Object.entries(palette.aurora).map(([key, color]) => (
            <View key={key} style={[styles.swatch, { backgroundColor: color as string }]}>
              <Text style={styles.swatchLabel}>{key}</Text>
            </View>
          ))}
        </View>

        {/* Variant Toggle */}
        <TouchableOpacity
          style={[styles.toggleBtn, { borderColor: accentColor }]}
          onPress={() => setVariant(v => v === 'night' ? 'dawn' : 'night')}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, { color: accentColor }]}>
            {variant === 'night' ? '🌅 Dawn\'a Geç' : '🌙 Night\'a Geç'}
          </Text>
        </TouchableOpacity>

        {/* Teknik Bilgi */}
        <View style={[styles.infoCard, { backgroundColor: palette.glass.surface, borderColor: palette.glass.border }]}>
          <Text style={[styles.infoTitle, { color: subColor }]}>
            Aktif: {variant === 'night' ? 'Cosmic Night' : 'Cosmic Dawn'}
          </Text>
          <Text style={[styles.infoLine, { color: palette.text.tertiary }]}>
            • 4 aurora spot (Lissajous drift)
          </Text>
          <Text style={[styles.infoLine, { color: palette.text.tertiary }]}>
            • 350 parallax yıldız (3 katman)
          </Text>
          <Text style={[styles.infoLine, { color: palette.text.tertiary }]}>
            • Skia Canvas mode="continuous"
          </Text>
        </View>

      </SafeAreaView>
    </CosmicAtmosphere>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 2.2,
    marginTop: 8,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 36,
  },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  swatchLabel: {
    fontSize: 8,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '600',
  },
  toggleBtn: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginBottom: 32,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  infoLine: {
    fontSize: 12,
    lineHeight: 20,
  },
});

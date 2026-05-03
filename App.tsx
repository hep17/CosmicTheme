/**
 * Cosmic Theme — Faz 4 Demo
 *
 * 12 karakter grid: NASA quality glow, spectral class, twinkle animasyonu.
 * Aurora drift arka plan (Faz 3'ten).
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { COSMIC_NIGHT } from './theme';
import { CosmicAtmosphere } from './theme/components/CosmicAtmosphere';
import { CosmicCharacter } from './theme/components/CosmicCharacter';
import { CHARACTERS } from './theme/characters';

export default function App(): React.JSX.Element {
  return (
    <CosmicAtmosphere variant="night">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 80,
          paddingBottom: 40,
          alignItems: 'center',
        }}
      >
        {/* Başlık */}
        <Text style={{
          color: COSMIC_NIGHT.aurora.gold,
          fontSize: 32,
          fontWeight: '300',
          textAlign: 'center',
          letterSpacing: -0.5,
          marginBottom: 8,
        }}>
          12 Karakter
        </Text>
        <Text style={{
          color: COSMIC_NIGHT.text.secondary,
          fontSize: 12,
          textAlign: 'center',
          letterSpacing: 1.4,
          marginBottom: 40,
        }}>
          NASA QUALITY · SPECTRAL CLASS
        </Text>

        {/* Karakter Grid */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 12,
          paddingHorizontal: 12,
        }}>
          {Object.values(CHARACTERS).map(char => (
            <View key={char.id} style={{ alignItems: 'center', margin: 8 }}>
              <CosmicCharacter id={char.id} size="small" />
              <Text style={{
                color: COSMIC_NIGHT.text.primary,
                fontSize: 12,
                marginTop: 6,
                fontWeight: '600',
                letterSpacing: 0.3,
              }}>
                {char.emoji} {char.name}
              </Text>
              <Text style={{
                color: COSMIC_NIGHT.text.tertiary,
                fontSize: 9,
                marginTop: 2,
                letterSpacing: 0.5,
              }}>
                {char.signatureStar.name}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </CosmicAtmosphere>
  );
}

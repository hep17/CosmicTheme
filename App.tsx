/**
 * Cosmic Theme — Faz 5a Demo
 *
 * GlassCard Liquid Glass test:
 *   • Hero kart: Orion karakter + glass arka plan
 *   • Strong glass: belirgin blur, daha opak
 *   • Subtle glass: zar zor fark edilen yumuşak cam
 *   • Tap kartı: press feedback (scale 0.98 spring)
 *
 * Aurora drift arka plan (Faz 3), CosmicCharacter (Faz 4) korunuyor.
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { COSMIC_NIGHT } from './theme';
import { CosmicAtmosphere } from './theme/components/CosmicAtmosphere';
import { CosmicCharacter } from './theme/components/CosmicCharacter';
import { GlassCard } from './theme/components/GlassCard';

export default function App(): React.JSX.Element {
  return (
    <CosmicAtmosphere variant="night">
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 80 }}>

        {/* Başlık */}
        <Text style={{
          color:      COSMIC_NIGHT.aurora.gold,
          fontSize:   32,
          textAlign:  'center',
          marginBottom: 24,
          fontWeight: '300',
        }}>
          GlassCard Test
        </Text>

        {/* ── HERO CARD — Karakter ile ── */}
        <GlassCard padding="lg" radius="xl">
          <View style={{ alignItems: 'center' }}>
            <CosmicCharacter id="orion" size="medium" />
            <Text style={{
              color:      COSMIC_NIGHT.text.primary,
              fontSize:   22,
              marginTop:  12,
              fontWeight: '600',
            }}>
              Orion
            </Text>
            <Text style={{
              color:         COSMIC_NIGHT.text.secondary,
              fontSize:      12,
              marginTop:     4,
              letterSpacing: 1.4,
            }}>
              BETELGEUSE · KIZIL DEV
            </Text>
          </View>
        </GlassCard>

        <View style={{ height: 16 }} />

        {/* ── MEDIUM CARD — Strong intensity ── */}
        <GlassCard padding="md" radius="lg" intensity="strong">
          <Text style={{
            color:      COSMIC_NIGHT.text.primary,
            fontSize:   16,
            fontWeight: '500',
          }}>
            Strong Glass
          </Text>
          <Text style={{
            color:     COSMIC_NIGHT.text.secondary,
            fontSize:  12,
            marginTop: 4,
          }}>
            Standard padding, large radius
          </Text>
        </GlassCard>

        <View style={{ height: 16 }} />

        {/* ── SMALL CARD — Subtle intensity ── */}
        <GlassCard padding="sm" radius="md" intensity="subtle">
          <Text style={{ color: COSMIC_NIGHT.text.tertiary, fontSize: 11 }}>
            Subtle glass — küçük detay kartı
          </Text>
        </GlassCard>

        <View style={{ height: 16 }} />

        {/* ── TAP TEST — Press feedback ── */}
        <GlassCard
          padding="md"
          radius="lg"
          onPress={() => console.log('Card tapped!')}
        >
          <Text style={{
            color:     COSMIC_NIGHT.aurora.gold,
            fontSize:  14,
            textAlign: 'center',
          }}>
            Tap me — press feedback test
          </Text>
        </GlassCard>

        <View style={{ height: 40 }} />

      </ScrollView>
    </CosmicAtmosphere>
  );
}

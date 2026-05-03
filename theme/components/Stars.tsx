/**
 * Stars — Yıldız tarla component'i.
 *
 * Paralaksın ötesinde, özel gökyüzü yıldız tarlaları oluşturur.
 * Density ve variant'a göre özelleştirilebilir.
 *
 * Her yıldız 4 katman NASA glow (StarGlow pattern) + twinkle animasyonu.
 * Seeded random ile tekrarlanabilir, deterministic pozisyonlar.
 *
 * @example
 * ```tsx
 * <Stars density="standard" variant="night" />
 * <Stars density="lush" speed="slow" twinkle={true} />
 * ```
 *
 * @module theme/components/Stars
 */

import React, { memo, useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  Blur,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';

import { COSMIC_NIGHT, COSMIC_DAWN } from '../colors';

// ─── TİPLER ──────────────────────────────────────────────────────────────────

export type StarsDensity = 'minimal' | 'standard' | 'lush';
export type StarsVariant = 'night' | 'dawn';
export type StarsSpeed = 'slow' | 'normal' | 'fast';

export interface StarsProps extends ViewProps {
  /** Yıldız yoğunluğu — default: 'standard' */
  density?: StarsDensity;
  /** Tema renkleri — default: 'night' */
  variant?: StarsVariant;
  /** Twinkle hızı — default: 'normal' */
  speed?: StarsSpeed;
  /** Twinkle animasyonu aktif/pasif — default: true */
  twinkle?: boolean;
}

// ─── SABİTLER ────────────────────────────────────────────────────────────────

/** Density → yıldız sayısı */
const DENSITY_MAP: Record<StarsDensity, number> = {
  minimal:  8,
  standard: 24,
  lush:     60,
} as const;

/** Speed → cycle süresi (ms) */
const SPEED_MAP: Record<StarsSpeed, [number, number]> = {
  slow:   [5000, 8000],
  normal: [3000, 6000],
  fast:   [2000, 4000],
} as const;

/** Night variant yıldız renkleri (core + glow prefix) */
const NIGHT_STAR_COLORS = [
  { core: '#FFFFFF', glowPrefix: 'rgba(200,223,255,' },           // beyaz
  { core: '#FFC93C', glowPrefix: 'rgba(255,201,60,' },            // gold
  { core: '#B888FF', glowPrefix: 'rgba(184,136,255,' },           // purple
  { core: '#67B7E3', glowPrefix: 'rgba(103,183,227,' },           // cyan
] as const;

/** Dawn variant yıldız renkleri (core + glow prefix) */
const DAWN_STAR_COLORS = [
  { core: '#FFFFFF', glowPrefix: 'rgba(200,223,255,' },           // beyaz
  { core: '#FFB347', glowPrefix: 'rgba(255,179,71,' },            // warmGold
  { core: '#FF8FA3', glowPrefix: 'rgba(255,143,163,' },           // pink
  { core: '#FF6B47', glowPrefix: 'rgba(255,107,71,' },            // coral
] as const;

// ─── YILDIZ VERİ TİPİ ────────────────────────────────────────────────────────

interface StarDatum {
  x:             number;     // 0–1 (normalized ekran genişliğine)
  y:             number;     // 0–1 (normalized ekran yüksekliğine)
  coreRadius:    number;     // 1.0–2.0 px
  glowPrefix:    string;     // 'rgba(R,G,B,'
  coreColor:     string;     // '#RRGGBB'
  cycleDuration: number;     // twinkle ms
  delay:         number;     // stagger ms
}

// ─── SEEDED RANDOM ───────────────────────────────────────────────────────────

/**
 * Seeded pseudo-random generator.
 * Aynı seed her seferinde aynı dizi üretir → deterministic yıldız pozisyonları.
 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/**
 * Density string'inin char code toplamı → seed.
 * Örn. "standard" (837) her zaman aynı yıldız konumlarını verir.
 */
function seedFromDensity(density: StarsDensity): number {
  let sum = 0;
  for (let i = 0; i < density.length; i++) {
    sum += density.charCodeAt(i);
  }
  return sum;
}

// ─── YILDIZ VERISI ÜRETIMI ───────────────────────────────────────────────────

/**
 * Yıldız tarası için veriler üretir.
 * Seeded random ile tekrarlanabilir, variant'a göre renklendirilmiş.
 */
function generateStars(
  count: number,
  speed: StarsSpeed,
  variant: StarsVariant,
  seedBase: number,
): StarDatum[] {
  const colors = variant === 'night' ? NIGHT_STAR_COLORS : DAWN_STAR_COLORS;
  const [minCycleDuration, maxCycleDuration] = SPEED_MAP[speed];
  const rand = seededRandom(seedBase);

  const stars: StarDatum[] = [];
  for (let i = 0; i < count; i++) {
    const colorIdx = Math.floor(rand() * colors.length);
    const { core, glowPrefix } = colors[colorIdx];
    const coreRadius = 1.0 + rand() * 1.0;
    const cycleDuration = minCycleDuration + rand() * (maxCycleDuration - minCycleDuration);
    const delay = (i * 73 + Math.floor(rand() * 500)) % 1200;

    stars.push({
      x: rand(),
      y: rand(),
      coreRadius,
      glowPrefix,
      coreColor: core,
      cycleDuration: Math.round(cycleDuration),
      delay,
    });
  }
  return stars;
}

// ─── 4-KATMAN GLOW (SKIA) ────────────────────────────────────────────────────

interface StarGlowProps {
  cx: number;
  cy: number;
  r: number;
  glowPrefix: string;
  coreColor: string;
}

/**
 * Tek yıldız — 4 katman NASA glow.
 * (CosmicCharacter StarGlow pattern ile aynı spec)
 */
const StarGlow = memo(function StarGlow({
  cx, cy, r, glowPrefix, coreColor,
}: StarGlowProps) {
  const haloR      = r * 5.5;
  const outerGlowR = r * 4.0;
  const innerGlowR = r * 2.4;

  return (
    <Group>
      {/* Layer 1 — Halo (blur ile) */}
      <Group>
        <Blur blur={5} />
        <Circle cx={cx} cy={cy} r={haloR} opacity={0.32}>
          <RadialGradient
            c={vec(cx, cy)}
            r={haloR}
            colors={[
              `${glowPrefix}0.55)`,
              `${glowPrefix}0.18)`,
              `${glowPrefix}0.0)`,
            ]}
          />
        </Circle>
      </Group>

      {/* Layer 2 — Outer glow */}
      <Circle cx={cx} cy={cy} r={outerGlowR} opacity={0.24}>
        <RadialGradient
          c={vec(cx, cy)}
          r={outerGlowR}
          colors={[
            `${glowPrefix}0.50)`,
            `${glowPrefix}0.16)`,
            `${glowPrefix}0.0)`,
          ]}
        />
      </Circle>

      {/* Layer 3 — Inner glow */}
      <Circle cx={cx} cy={cy} r={innerGlowR} opacity={0.50}>
        <RadialGradient
          c={vec(cx, cy)}
          r={innerGlowR}
          colors={[
            `${glowPrefix}0.85)`,
            `${glowPrefix}0.38)`,
            `${glowPrefix}0.0)`,
          ]}
        />
      </Circle>

      {/* Layer 4 — Crisp core */}
      <Circle cx={cx} cy={cy} r={r} color={coreColor} opacity={1.0} />
    </Group>
  );
});

// ─── ANİMASYONLU TWINKLE STAR ────────────────────────────────────────────────

interface TwinkleStarProps {
  datum: StarDatum;
  parentW: number;
  parentH: number;
}

/**
 * Tek yıldız twinkle animasyonu.
 * Animated.View opacity döngüsü + Skia Canvas.
 */
const TwinkleStar = memo(function TwinkleStar({
  datum,
  parentW,
  parentH,
}: TwinkleStarProps) {
  const opacity = useSharedValue(0.55);

  React.useEffect(() => {
    opacity.value = withDelay(
      datum.delay,
      withRepeat(
        withTiming(0.88, {
          duration: datum.cycleDuration * 0.48,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true, // yoyo
      ),
    );
  }, [opacity, datum.cycleDuration, datum.delay]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const pad = Math.ceil(datum.coreRadius * 8.5);
  const bw = pad * 2;
  const bh = pad * 2;
  const cxPx = datum.x * parentW;
  const cyPx = datum.y * parentH;
  const localCx = pad;
  const localCy = pad;

  return (
    <Animated.View
      style={[
        styles.absoluteFill,
        animStyle,
        {
          left: cxPx - pad,
          top: cyPx - pad,
          width: bw,
          height: bh,
        },
      ]}
      pointerEvents="none"
    >
      <Canvas style={{ width: bw, height: bh }}>
        <StarGlow
          cx={localCx}
          cy={localCy}
          r={datum.coreRadius}
          glowPrefix={datum.glowPrefix}
          coreColor={datum.coreColor}
        />
      </Canvas>
    </Animated.View>
  );
});

// ─── STATİK (TWINKLE KAPALIYKEN) STAR ──────────────────────────────────────

interface StaticStarProps {
  datum: StarDatum;
  parentW: number;
  parentH: number;
}

/**
 * Statik yıldız (twinkle=false).
 * Animated.View olmadan direkt Skia canvas içinde.
 */
const StaticStar = memo(function StaticStar({
  datum,
  parentW,
  parentH,
}: StaticStarProps) {
  const cxPx = datum.x * parentW;
  const cyPx = datum.y * parentH;

  return (
    <View
      style={[
        styles.absoluteFill,
        {
          left: cxPx - datum.coreRadius * 8.5 - datum.coreRadius,
          top: cyPx - datum.coreRadius * 8.5 - datum.coreRadius,
          width: datum.coreRadius * 17 + datum.coreRadius * 2,
          height: datum.coreRadius * 17 + datum.coreRadius * 2,
          opacity: 0.7,
        },
      ]}
      pointerEvents="none"
    >
      <Canvas
        style={{
          width: datum.coreRadius * 17 + datum.coreRadius * 2,
          height: datum.coreRadius * 17 + datum.coreRadius * 2,
        }}
      >
        <StarGlow
          cx={datum.coreRadius * 8.5 + datum.coreRadius}
          cy={datum.coreRadius * 8.5 + datum.coreRadius}
          r={datum.coreRadius}
          glowPrefix={datum.glowPrefix}
          coreColor={datum.coreColor}
        />
      </Canvas>
    </View>
  );
});

// ─── ANA COMPONENT ───────────────────────────────────────────────────────────

/**
 * Stars — Yıldız tarla component'i.
 *
 * Belirtilen density/variant/speed ile özelleştirilebilir yıldız sahne.
 * Seeded random → tekrarlanabilir pozisyonlar.
 * Twinkle animasyonu (Reduced Motion respects).
 *
 * @example
 * ```tsx
 * <Stars density="standard" variant="night" />
 * <Stars density="lush" speed="slow" twinkle={false} />
 * ```
 */
export const Stars = memo(function Stars({
  density = 'standard',
  variant = 'night',
  speed = 'normal',
  twinkle = true,
  style,
  ...rest
}: StarsProps) {
  const isReducedMotion = useReducedMotion();
  const actualTwinkle = twinkle && !isReducedMotion;

  // Layout bilgisi — ilk render'da 0×0
  const [parentSize, setParentSize] = useState<{ w: number; h: number } | null>(null);

  const handleLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = e.nativeEvent.layout;
      if (width > 0 && height > 0) {
        setParentSize({ w: width, h: height });
      }
    },
    [],
  );

  // Yıldız verisi — seeded random ile deterministic
  const stars = useMemo(() => {
    const count = DENSITY_MAP[density];
    const seed = seedFromDensity(density);
    return generateStars(count, speed, variant, seed);
  }, [density, speed, variant]);

  // Parent boş ise render etme
  if (!parentSize) {
    return (
      <View
        style={[styles.container, style]}
        onLayout={handleLayout}
        pointerEvents="none"
        {...rest}
      />
    );
  }

  const { w, h } = parentSize;

  return (
    <View
      style={[styles.container, style]}
      onLayout={handleLayout}
      pointerEvents="none"
      {...rest}
    >
      {/* Statik yıldız canvas layer — glow zeminleri */}
      {!actualTwinkle && (
        <View style={styles.absoluteFill}>
          {stars.map((datum, i) => (
            <StaticStar
              key={`static-${i}`}
              datum={datum}
              parentW={w}
              parentH={h}
            />
          ))}
        </View>
      )}

      {/* Twinkle layer — her yıldız kendi Animated.View'i */}
      {actualTwinkle && (
        <View style={styles.absoluteFill}>
          {stars.map((datum, i) => (
            <TwinkleStar
              key={`twinkle-${i}`}
              datum={datum}
              parentW={w}
              parentH={h}
            />
          ))}
        </View>
      )}
    </View>
  );
});

// ─── STILLER ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  absoluteFill: {
    position: 'absolute',
top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

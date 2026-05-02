/**
 * CosmicAtmosphere — Yaşayan gece gökyüzü arkaplanı.
 *
 * 4 render katmanı (alttan üste):
 *   1. Background fill  — koyu radial gradient
 *   2. Aurora drift     — 4 Lissajous nokta, Skia Blur
 *   3. Parallax yıldız  — 3 katman (far/mid/near), farklı drift hızı
 *   4. Children         — kullanıcı içeriği (UI)
 *
 * Kullanım:
 * ```tsx
 * <CosmicAtmosphere variant="night" density="standard">
 *   <YourScreen />
 * </CosmicAtmosphere>
 * ```
 *
 * Spec: docs/04-REACTIVE-ATMOSPHERE.md
 */

import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import {
  Canvas,
  Circle,
  Fill,
  Blur,
  Group,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
  useDerivedValue,
} from 'react-native-reanimated';
import { COSMIC_NIGHT, COSMIC_DAWN } from '../colors';

// ─── TİPLER ──────────────────────────────────────────────────────────────────

export type AtmosphereVariant = 'night' | 'dawn';
export type AtmosphereDensity = 'minimal' | 'standard' | 'lush';

export interface CosmicAtmosphereProps {
  variant?: AtmosphereVariant;
  density?: AtmosphereDensity;
  children?: React.ReactNode;
}

// ─── YILDIZ VERISI ───────────────────────────────────────────────────────────

interface StarData {
  x: number;  // 0-1 (ekran genişliği oranı)
  y: number;  // 0-1 (ekran yüksekliği oranı)
  r: number;  // yarıçap px
  opacity: number;
}

/** Density ayarına göre yıldız sayıları */
const DENSITY_CONFIG: Record<AtmosphereDensity, { far: number; mid: number; near: number }> = {
  minimal:  { far: 30,  mid: 15,  near: 8  },
  standard: { far: 200, mid: 100, near: 50 },
  lush:     { far: 300, mid: 150, near: 80 },
};

/** Seeded pseudo-random — aynı tohum her seferinde aynı yıldız konumlarını üretir */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/** Belirli bir katman için yıldız verisi üretir */
function generateStars(count: number, seed: number, minR: number, maxR: number): StarData[] {
  const rand = seededRandom(seed);
  const stars: StarData[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand(),
      y: rand(),
      r: minR + rand() * (maxR - minR),
      opacity: 0.3 + rand() * 0.7,
    });
  }
  return stars;
}

// ─── AURORA SPOT TANIMLAMALARI ───────────────────────────────────────────────

interface AuroraSpot {
  /** Ekran genişliğine göre merkez X oranı (0-1) */
  baseX: number;
  /** Ekran yüksekliğine göre merkez Y oranı (0-1) */
  baseY: number;
  /** Lissajous X frekansı */
  freqX: number;
  /** Lissajous Y frekansı */
  freqY: number;
  /** Lissajous faz offset (0-1) */
  phase: number;
  /** Hareket amplitüdü (ekran genişliğinin oranı) */
  amplitude: number;
  /** Aurora rengi (hex) */
  color: string;
  /** Blur yarıçapı (px) */
  blurRadius: number;
  /** Spot yarıçapı (ekran genişliğinin oranı) */
  radiusRatio: number;
  /** Renk opaklığı (0-1) */
  colorOpacity: number;
}

// ─── ANA COMPONENT ───────────────────────────────────────────────────────────

export function CosmicAtmosphere({
  variant = 'night',
  density = 'standard',
  children,
}: CosmicAtmosphereProps): React.JSX.Element {
  const { width, height } = useWindowDimensions();
  const isReducedMotion = useReducedMotion();

  // Yıldız verilerini useMemo ile sabitle — her render'da yeniden üretme
  const densityCfg = DENSITY_CONFIG[density];
  const starsF = useMemo(() => generateStars(densityCfg.far,  1001, 0.4, 0.7), [densityCfg.far]);
  const starsM = useMemo(() => generateStars(densityCfg.mid,  2002, 0.5, 0.9), [densityCfg.mid]);
  const starsN = useMemo(() => generateStars(densityCfg.near, 3003, 0.7, 1.2), [densityCfg.near]);

  // Variant'a göre aurora renkleri — union type'ı atlayarak kesin seçim
  const auroraColors = useMemo(() => {
    if (variant === 'night') {
      return {
        a: COSMIC_NIGHT.aurora.gold,
        b: COSMIC_NIGHT.aurora.purple,
        c: COSMIC_NIGHT.aurora.cyan,
        d: COSMIC_NIGHT.aurora.pink,
      };
    }
    return {
      a: COSMIC_DAWN.aurora.warmGold,
      b: COSMIC_DAWN.aurora.pink,
      c: COSMIC_DAWN.aurora.coral,
      d: COSMIC_DAWN.aurora.blush,
    };
  }, [variant]);

  // Aurora spot tanımları
  const auroraSpots: AuroraSpot[] = useMemo(() => [
    {
      baseX: 0.18, baseY: 0.18,
      freqX: 1.0,  freqY: 1.3,
      phase: 0.0,  amplitude: 0.12,
      color: auroraColors.a,
      blurRadius: 55, radiusRatio: 0.42, colorOpacity: 0.45,
    },
    {
      baseX: 0.82, baseY: 0.32,
      freqX: 0.7,  freqY: 1.1,
      phase: 0.25, amplitude: 0.10,
      color: auroraColors.b,
      blurRadius: 50, radiusRatio: 0.38, colorOpacity: 0.40,
    },
    {
      baseX: 0.70, baseY: 0.88,
      freqX: 1.2,  freqY: 0.8,
      phase: 0.50, amplitude: 0.14,
      color: auroraColors.c,
      blurRadius: 60, radiusRatio: 0.45, colorOpacity: 0.35,
    },
    {
      baseX: 0.08, baseY: 0.75,
      freqX: 0.9,  freqY: 1.4,
      phase: 0.75, amplitude: 0.11,
      color: auroraColors.d,
      blurRadius: 48, radiusRatio: 0.36, colorOpacity: 0.38,
    },
  ], [auroraColors]);

  // ── Aurora Lissajous fazı (0→1, tekrar ediyor) ──
  const auroraPhase = useSharedValue(0);
  // Parallax yıldız fazları — ayrı hız, farklı katmanlar
  const phaseFar  = useSharedValue(0);
  const phaseMid  = useSharedValue(0);
  const phaseNear = useSharedValue(0);

  // Animasyonları başlat
  React.useEffect(() => {
    if (isReducedMotion) return;

    auroraPhase.value = withRepeat(
      withTiming(1, { duration: 28000, easing: Easing.linear }),
      -1, false
    );
    phaseFar.value = withRepeat(
      withTiming(1, { duration: 60000, easing: Easing.linear }),
      -1, false
    );
    phaseMid.value = withRepeat(
      withTiming(1, { duration: 40000, easing: Easing.linear }),
      -1, false
    );
    phaseNear.value = withRepeat(
      withTiming(1, { duration: 25000, easing: Easing.linear }),
      -1, false
    );
  }, [isReducedMotion, auroraPhase, phaseFar, phaseMid, phaseNear]);

  // ── Aurora spot X/Y pozisyonları (Lissajous) ──
  // Her spot kendi frekans+faz kombinasyonuyla bağımsız hareket eder.
  // auroraSpots useMemo ile sabit, iç değerleri worklet'te güvenle okunabilir.
  const s0 = auroraSpots[0];
  const s1 = auroraSpots[1];
  const s2 = auroraSpots[2];
  const s3 = auroraSpots[3];

  const spot0X = useDerivedValue(() =>
    (s0.baseX + s0.amplitude * Math.sin(2 * Math.PI * auroraPhase.value * s0.freqX + s0.phase * 2 * Math.PI)) * width
  );
  const spot0Y = useDerivedValue(() =>
    (s0.baseY + s0.amplitude * Math.cos(2 * Math.PI * auroraPhase.value * s0.freqY + s0.phase * 2 * Math.PI)) * height
  );
  const spot1X = useDerivedValue(() =>
    (s1.baseX + s1.amplitude * Math.sin(2 * Math.PI * auroraPhase.value * s1.freqX + s1.phase * 2 * Math.PI)) * width
  );
  const spot1Y = useDerivedValue(() =>
    (s1.baseY + s1.amplitude * Math.cos(2 * Math.PI * auroraPhase.value * s1.freqY + s1.phase * 2 * Math.PI)) * height
  );
  const spot2X = useDerivedValue(() =>
    (s2.baseX + s2.amplitude * Math.sin(2 * Math.PI * auroraPhase.value * s2.freqX + s2.phase * 2 * Math.PI)) * width
  );
  const spot2Y = useDerivedValue(() =>
    (s2.baseY + s2.amplitude * Math.cos(2 * Math.PI * auroraPhase.value * s2.freqY + s2.phase * 2 * Math.PI)) * height
  );
  const spot3X = useDerivedValue(() =>
    (s3.baseX + s3.amplitude * Math.sin(2 * Math.PI * auroraPhase.value * s3.freqX + s3.phase * 2 * Math.PI)) * width
  );
  const spot3Y = useDerivedValue(() =>
    (s3.baseY + s3.amplitude * Math.cos(2 * Math.PI * auroraPhase.value * s3.freqY + s3.phase * 2 * Math.PI)) * height
  );

  // ── Parallax yıldız X offset'leri (Skia'da Group transform) ──
  const starFarOffsetX  = useDerivedValue(() =>
    isReducedMotion ? 0 : phaseFar.value * width * 0.04
  );
  const starMidOffsetX  = useDerivedValue(() =>
    isReducedMotion ? 0 : phaseMid.value * width * 0.06
  );
  const starNearOffsetX = useDerivedValue(() =>
    isReducedMotion ? 0 : phaseNear.value * width * 0.08
  );

  // Skia transform matrisleri — Group matrix prop için
  const matFar  = useDerivedValue(() => [{ translateX: starFarOffsetX.value  }]);
  const matMid  = useDerivedValue(() => [{ translateX: starMidOffsetX.value  }]);
  const matNear = useDerivedValue(() => [{ translateX: starNearOffsetX.value }]);

  // ── Background renkleri ──
  const bgColors = useMemo(() => variant === 'night'
    ? [COSMIC_NIGHT.bg.primary, COSMIC_NIGHT.bg.secondary, COSMIC_NIGHT.bg.tertiary]
    : [COSMIC_DAWN.bg.primary,  COSMIC_DAWN.bg.secondary,  COSMIC_DAWN.bg.tertiary],
  [variant]);

  return (
    <View style={styles.container}>
      {/* ── KATMAN 1+2+3: Skia Canvas (bg + aurora + yıldız) ── */}
      <Canvas style={StyleSheet.absoluteFill} mode="continuous">

        {/* Katman 1 — Background fill */}
        <Fill color={bgColors[0]} />

        {/* Katman 1b — Radial gradient overlay */}
        <Group>
          <Circle cx={width * 0.5} cy={height * 0.5} r={height * 0.75}>
            <RadialGradient
              c={vec(width * 0.5, height * 0.5)}
              r={height * 0.75}
              colors={[bgColors[1], bgColors[0]]}
            />
          </Circle>
        </Group>

        {/* Katman 3a — Yıldızlar (far) */}
        <Group opacity={0.45} transform={matFar}>
          {starsF.map((s, i) => (
            <Circle
              key={`sf${i}`}
              cx={s.x * width}
              cy={s.y * height}
              r={s.r}
              color="#FFFFFF"
              opacity={s.opacity}
            />
          ))}
        </Group>

        {/* Katman 3b — Yıldızlar (mid) */}
        <Group opacity={0.55} transform={matMid}>
          {starsM.map((s, i) => (
            <Circle
              key={`sm${i}`}
              cx={s.x * width}
              cy={s.y * height}
              r={s.r}
              color="#FFFFFF"
              opacity={s.opacity}
            />
          ))}
        </Group>

        {/* Katman 3c — Yıldızlar (near) */}
        <Group opacity={0.75} transform={matNear}>
          {starsN.map((s, i) => (
            <Circle
              key={`sn${i}`}
              cx={s.x * width}
              cy={s.y * height}
              r={s.r}
              color="#C8DFFF"
              opacity={s.opacity}
            />
          ))}
        </Group>

        {/* Katman 2 — Aurora spot 0 (gold) */}
        <Group>
          <Blur blur={auroraSpots[0].blurRadius} />
          <Circle
            cx={spot0X}
            cy={spot0Y}
            r={auroraSpots[0].radiusRatio * Math.min(width, height)}
            color={auroraSpots[0].color}
            opacity={auroraSpots[0].colorOpacity}
          />
        </Group>

        {/* Katman 2 — Aurora spot 1 (purple) */}
        <Group>
          <Blur blur={auroraSpots[1].blurRadius} />
          <Circle
            cx={spot1X}
            cy={spot1Y}
            r={auroraSpots[1].radiusRatio * Math.min(width, height)}
            color={auroraSpots[1].color}
            opacity={auroraSpots[1].colorOpacity}
          />
        </Group>

        {/* Katman 2 — Aurora spot 2 (cyan) */}
        <Group>
          <Blur blur={auroraSpots[2].blurRadius} />
          <Circle
            cx={spot2X}
            cy={spot2Y}
            r={auroraSpots[2].radiusRatio * Math.min(width, height)}
            color={auroraSpots[2].color}
            opacity={auroraSpots[2].colorOpacity}
          />
        </Group>

        {/* Katman 2 — Aurora spot 3 (pink) */}
        <Group>
          <Blur blur={auroraSpots[3].blurRadius} />
          <Circle
            cx={spot3X}
            cy={spot3Y}
            r={auroraSpots[3].radiusRatio * Math.min(width, height)}
            color={auroraSpots[3].color}
            opacity={auroraSpots[3].colorOpacity}
          />
        </Group>

      </Canvas>

      {/* ── KATMAN 4: Children (UI içeriği) ── */}
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
});

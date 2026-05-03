/**
 * CosmicCharacter — NASA-quality yıldız render component.
 *
 * Her parlak yıldız 4 katman glow ile çizilir (spec §12.5):
 *   Layer 1 — Halo       (en alt, Group+Blur 8px + RadialGradient)
 *   Layer 2 — Outer glow (RadialGradient, ~32px)
 *   Layer 3 — Inner glow (RadialGradient, ~16px)
 *   Layer 4 — Crisp core (en üst, solid circle 1.5–5px)
 *
 * Twinkle: Reanimated `useSharedValue` → `Animated.View` opacity döngüsü.
 * Her yıldız kendi küçük Canvas'ını taşır (bounding box optimizasyon).
 *
 * @example
 * ```tsx
 * <CosmicCharacter id="orion" size="medium" />
 * <CosmicCharacter id="phoenix" size="large" showLabel showSpectralPill />
 * ```
 *
 * @module theme/components/CosmicCharacter
 */

import React, { memo, useMemo, useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  Line,
  Blur,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { CHARACTERS } from '../characters';
import { SPECTRAL_COLORS, CHARACTER_SPECTRAL } from '../characters/spectral';
import { COSMIC_NIGHT } from '../colors';
import type { CharacterId, StarPoint, SpectralClass } from '../characters/types';

// ─── SABITLER ────────────────────────────────────────────────────────────────

/** Boyut → piksel eşleşmesi (w × h) */
const SIZE_MAP = {
  small:  { w:  80, h: 100 },
  medium: { w: 160, h: 200 },
  large:  { w: 280, h: 350 },
} as const;

/** Karakter koordinat sistemi: 0–100 birim */
const VIEWBOX_W = 100;
const VIEWBOX_H = 125;

/** medium boyutunda 1× baz core radius (px) */
const BASE_CORE_PX = 2.2;

/** Bağlantı çizgisi opaklığı */
const LINE_OPACITY = 0.20;

// ─── TİPLER ──────────────────────────────────────────────────────────────────

type SizeKey = keyof typeof SIZE_MAP;

export interface CosmicCharacterProps {
  /** 12 karakterden biri */
  id: CharacterId;
  /** Render boyutu — default 'medium' */
  size?: SizeKey;
  /** Karakter adı göster — default false */
  showLabel?: boolean;
  /** Spectral class rozet göster — default false */
  showSpectralPill?: boolean;
  /** Tap callback */
  onPress?: () => void;
}

// ─── YARDIMCI: koordinat dönüşümü ───────────────────────────────────────────

function toCanvasX(unitX: number, canvasW: number): number {
  return (unitX / VIEWBOX_W) * canvasW;
}

function toCanvasY(unitY: number, canvasH: number): number {
  return (unitY / VIEWBOX_H) * canvasH;
}

/**
 * Yıldız büyüklük çarpanı × baz piksel × boyut ölçeği → çekirdek radius.
 */
function coreRadius(starSize: number, scaleFactor: number): number {
  return BASE_CORE_PX * starSize * scaleFactor;
}

// ─── 4 KATMAN GLOW (SKIA) ────────────────────────────────────────────────────

interface StarGlowProps {
  cx: number;
  cy: number;
  /** Çekirdek radius (px) */
  r: number;
  spectral: SpectralClass;
  isSignature: boolean;
}

/**
 * Tek yıldız — 4 katman NASA glow.
 * Skia Group+Blur pattern: `<Group><Blur blur={n}/><Circle/></Group>`
 */
const StarGlow = memo(function StarGlow({
  cx, cy, r, spectral, isSignature,
}: StarGlowProps) {
  const colors = SPECTRAL_COLORS[spectral];

  const haloR      = r * (isSignature ? 7.5 : 5.5);
  const outerGlowR = r * (isSignature ? 5.0 : 4.0);
  const innerGlowR = r * (isSignature ? 3.0 : 2.4);

  return (
    <Group>
      {/* Layer 1 — Halo (blur ile) */}
      <Group>
        <Blur blur={isSignature ? 8 : 5} />
        <Circle cx={cx} cy={cy} r={haloR} opacity={isSignature ? 0.50 : 0.32}>
          <RadialGradient
            c={vec(cx, cy)}
            r={haloR}
            colors={[
              `${colors.glow}0.55)`,
              `${colors.glow}0.18)`,
              `${colors.glow}0.0)`,
            ]}
          />
        </Circle>
      </Group>

      {/* Layer 2 — Outer glow */}
      <Circle cx={cx} cy={cy} r={outerGlowR} opacity={isSignature ? 0.38 : 0.24}>
        <RadialGradient
          c={vec(cx, cy)}
          r={outerGlowR}
          colors={[
            `${colors.glow}0.50)`,
            `${colors.glow}0.16)`,
            `${colors.glow}0.0)`,
          ]}
        />
      </Circle>

      {/* Layer 3 — Inner glow */}
      <Circle cx={cx} cy={cy} r={innerGlowR} opacity={isSignature ? 0.70 : 0.50}>
        <RadialGradient
          c={vec(cx, cy)}
          r={innerGlowR}
          colors={[
            `${colors.glow}0.85)`,
            `${colors.glow}0.38)`,
            `${colors.glow}0.0)`,
          ]}
        />
      </Circle>

      {/* Layer 4 — Crisp core */}
      <Circle cx={cx} cy={cy} r={r} color={colors.core} opacity={1.0} />
    </Group>
  );
});

// ─── ANİMASYONLU TWINKLE STAR ────────────────────────────────────────────────

interface TwinkleStarProps {
  /** Karakter koordinat birimi (0–100) */
  unitX: number;
  unitY: number;
  r: number;
  spectral: SpectralClass;
  isSignature: boolean;
  cycleDuration: number;
  delay: number;
  canvasSize: { w: number; h: number };
}

/**
 * Twinkle animasyonu için Animated.View + küçük Canvas.
 * Her yıldız kendi bounding box Canvas'ında render edilir →
 * GPU'da sadece değişen alan yeniden çizilir.
 */
const TwinkleStar = memo(function TwinkleStar({
  unitX,
  unitY,
  r,
  spectral,
  isSignature,
  cycleDuration,
  delay,
  canvasSize,
}: TwinkleStarProps) {
  const opacity = useSharedValue(isSignature ? 0.70 : 0.55);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(isSignature ? 1.0 : 0.88, {
            duration: cycleDuration * 0.48,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(isSignature ? 0.50 : 0.38, {
            duration: cycleDuration * 0.52,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      ),
    );
  }, [opacity, cycleDuration, delay, isSignature]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Bounding box: glow en fazla haloR = r * 7.5 genişliğe yayılır
  const pad = Math.ceil(r * 8.5);
  const bw  = pad * 2;
  const bh  = pad * 2;

  // Piksel pozisyon (canvas koordinatı — Animated.View'in left/top'u)
  const cx_px = toCanvasX(unitX, canvasSize.w);
  const cy_px = toCanvasY(unitY, canvasSize.h);

  // Canvas içinde yerel merkez
  const localCx = pad;
  const localCy = pad;

  return (
    <Animated.View
      style={[
        styles.absoluteFill,
        animStyle,
        {
          left:   cx_px - pad,
          top:    cy_px - pad,
          width:  bw,
          height: bh,
        },
      ]}
      pointerEvents="none"
    >
      <Canvas style={{ width: bw, height: bh }}>
        <StarGlow
          cx={localCx}
          cy={localCy}
          r={r}
          spectral={spectral}
          isSignature={isSignature}
        />
      </Canvas>
    </Animated.View>
  );
});

// ─── STATİK CANVAS: ÇİZGİLER + KÜÇÜK YILDIZLAR ──────────────────────────────

interface StaticLayerProps {
  stars: StarPoint[];
  lines: [number, number][];
  scaleFactor: number;
  spectral: SpectralClass;
  /** Signature star index (bu Canvas'ta çizilmez — TwinkleStar üstlenir) */
  signatureIdx: number;
  canvasSize: { w: number; h: number };
}

/**
 * Bağlantı çizgileri + animasyonsuz (küçük) yıldızlar tek Canvas'ta.
 * Statik içerik için ayrı Canvas → gereksiz re-render yok.
 */
const StaticLayer = memo(function StaticLayer({
  stars,
  lines,
  scaleFactor,
  spectral,
  signatureIdx,
  canvasSize,
}: StaticLayerProps) {
  const { w, h } = canvasSize;

  return (
    <Canvas style={[styles.absoluteFill, { width: w, height: h }]}>
      {/* Bağlantı çizgileri */}
      {lines.map(([from, to], i) => {
        const a = stars[from];
        const b = stars[to];
        if (!a || !b) return null;
        return (
          <Line
            key={`line-${i}`}
            p1={vec(toCanvasX(a.x, w), toCanvasY(a.y, h))}
            p2={vec(toCanvasX(b.x, w), toCanvasY(b.y, h))}
            color={`rgba(255,255,255,${LINE_OPACITY})`}
            strokeWidth={0.7}
          />
        );
      })}

      {/* Küçük yıldızlar (signature hariç) — static, glow dahil */}
      {stars.map((star, i) => {
        if (i === signatureIdx) return null;
        const cx = toCanvasX(star.x, w);
        const cy = toCanvasY(star.y, h);
        const r  = coreRadius(star.size, scaleFactor);
        return (
          <StarGlow
            key={`star-${i}`}
            cx={cx}
            cy={cy}
            r={r}
            spectral={spectral}
            isSignature={false}
          />
        );
      })}
    </Canvas>
  );
});

// ─── ANA COMPONENT ───────────────────────────────────────────────────────────

/**
 * CosmicCharacter — 12 karakter için NASA-quality render.
 *
 * @example
 * ```tsx
 * <CosmicCharacter id="orion" size="medium" />
 * <CosmicCharacter id="lyra" size="large" showLabel showSpectralPill onPress={fn} />
 * ```
 */
export const CosmicCharacter = memo(function CosmicCharacter({
  id,
  size = 'medium',
  showLabel = false,
  showSpectralPill = false,
  onPress,
}: CosmicCharacterProps) {
  const character     = CHARACTERS[id];
  const spectral      = character.spectralClass;
  const spectralColors = SPECTRAL_COLORS[spectral];
  const canvasSize    = SIZE_MAP[size];

  // 160 = medium genişlik → 1× baz ölçek
  const scaleFactor = useMemo(
    () => canvasSize.w / 160,
    [canvasSize.w],
  );

  // Signature star index: shape.stars içinde signatureStar eşleşmesi
  const signatureIdx = useMemo(() => {
    const sig = character.signatureStar;
    const idx = character.shape.stars.findIndex(
      s => s.x === sig.x && s.y === sig.y,
    );
    return idx >= 0 ? idx : 0;
  }, [character]);

  // Her yıldız için twinkle parametreleri (memoized — her frame yeniden yaratılmaz)
  const twinkleParams = useMemo(() =>
    character.shape.stars.map((star, i) => {
      const isSignature = i === signatureIdx;
      const baseCycle   = isSignature ? 3400 : 4600;
      const jitter      = (i * 431 + 17) % 1400;   // deterministik pseudo-random
      return {
        cycleDuration: baseCycle + jitter,
        delay:         (i * 257 + 83) % 900,
        r:             coreRadius(star.size, scaleFactor),
        isSignature,
      };
    }),
    [character.shape.stars, signatureIdx, scaleFactor],
  );

  // Spectral pill metni
  const pillLabel = `${spectral} · ${spectralColors.name}`;

  const inner = (
    <View style={[styles.wrapper, { width: canvasSize.w }]}>
      {/* Katman 1: Statik çizgiler + küçük yıldızlar */}
      <View style={{ width: canvasSize.w, height: canvasSize.h }}>
        <StaticLayer
          stars={character.shape.stars}
          lines={character.shape.lines}
          scaleFactor={scaleFactor}
          spectral={spectral}
          signatureIdx={signatureIdx}
          canvasSize={canvasSize}
        />

        {/* Katman 2: Twinkle yıldızları (her biri kendi Animated.View'inde) */}
        {character.shape.stars.map((star, i) => {
          const { cycleDuration, delay, r, isSignature } = twinkleParams[i];
          return (
            <TwinkleStar
              key={`twinkle-${id}-${i}`}
              unitX={star.x}
              unitY={star.y}
              r={r}
              spectral={spectral}
              isSignature={isSignature}
              cycleDuration={cycleDuration}
              delay={delay}
              canvasSize={canvasSize}
            />
          );
        })}
      </View>

      {/* Label + Spectral Pill */}
      {(showLabel || showSpectralPill) && (
        <View style={styles.labelBlock}>
          {showLabel && (
            <Text style={[styles.labelName, { color: COSMIC_NIGHT.text.primary }]}>
              {character.emoji} {character.name}
            </Text>
          )}
          {showSpectralPill && (
            <View style={[
              styles.pill,
              { borderColor: `${spectralColors.glow}0.50)` },
            ]}>
              <Text style={[styles.pillText, { color: spectralColors.core }]}>
                {pillLabel}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1.0 })}
      >
        {inner}
      </Pressable>
    );
  }

  return inner;
});

// ─── STILLER ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  wrapper: {
    alignItems: 'center',
  },

  labelBlock: {
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },

  labelName: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  pill: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  pillText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});

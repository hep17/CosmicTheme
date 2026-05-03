/**
 * GlassCard — Liquid Glass kart component'i.
 *
 * 4 render katmanı (z-index alttan üste):
 *   1. BackdropBlur    — Skia BackdropFilter, GPU-accelerated blur
 *   2. Surface tint    — rgba beyaz, çok yumuşak cam tonu
 *   3. Inner border    — 1px ince beyaz çizgi
 *   4. Edge highlight  — top-left'ten gelen ince ışık (3D hissi)
 *
 * Press feedback: scale(0.98) Reanimated spring (stiffness 200, damping 15).
 * Reduce Transparency: BackdropBlur kapatılır, solid bg.secondary kullanılır.
 *
 * Kullanım:
 * ```tsx
 * <GlassCard padding="md" radius="lg" intensity="standard" variant="night">
 *   <Text>İçerik</Text>
 * </GlassCard>
 *
 * <GlassCard padding="lg" radius="xl" onPress={() => console.log('tap!')}>
 *   <Text>Tıklanabilir kart</Text>
 * </GlassCard>
 * ```
 *
 * Spec: docs/06-RUMINATION-ARC-SPEC.md (kart glass katmanları)
 *       docs/09-EXTRAS-SPEC.md §3 (Dynamic Material Refraction)
 */

import React, { memo, useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import {
  BackdropBlur,
  BackdropFilter,
  Canvas,
  Fill,
  Group,
  LinearGradient,
  Path,
  RoundedRect,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { COSMIC_DAWN, COSMIC_NIGHT } from '../colors';
import { TOKENS } from '../tokens';

// ─── TİPLER ──────────────────────────────────────────────────────────────────

export type GlassCardPadding   = 'sm' | 'md' | 'lg';
export type GlassCardRadius    = 'sm' | 'md' | 'lg' | 'xl';
export type GlassCardIntensity = 'subtle' | 'standard' | 'strong';
export type GlassCardVariant   = 'night' | 'dawn';

export interface GlassCardProps {
  /** İç dolgu: sm=12, md=20, lg=32 */
  padding?: GlassCardPadding;
  /** Köşe yuvarlama: sm=8, md=16, lg=24, xl=32 */
  radius?: GlassCardRadius;
  /** Blur yoğunluğu: subtle=16px, standard=28px, strong=40px */
  intensity?: GlassCardIntensity;
  /** Renk varyantı — gece veya şafak teması */
  variant?: GlassCardVariant;
  /** Tanımlanırsa kart dokunuşa yanıt verir (scale press feedback) */
  onPress?: () => void;
  /** Dış stil birleşimi */
  style?: ViewStyle;
  children?: React.ReactNode;
}

// ─── SABİTLER ─────────────────────────────────────────────────────────────────

/** Padding px haritası */
const PADDING_MAP: Record<GlassCardPadding, number> = {
  sm: 12,
  md: 20,
  lg: 32,
} as const;

/** Radius px haritası — görevin istediği değerler */
const RADIUS_MAP: Record<GlassCardRadius, number> = {
  sm:  8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/** Intensity başına blur/tint/border parametreleri */
interface IntensityConfig {
  /** BackdropBlur sigma (px) */
  blur: number;
  /** Surface rgba white alpha */
  tint: number;
  /** Border rgba white alpha */
  border: number;
}

const INTENSITY_MAP: Record<GlassCardIntensity, IntensityConfig> = {
  subtle:   { blur: 16, tint: 0.05, border: 0.08 },
  standard: { blur: 28, tint: 0.10, border: 0.12 },
  strong:   { blur: 40, tint: 0.15, border: 0.18 },
} as const;

/** Press spring — stiffness 200, damping 15 (görev spesifikasyonu) */
const PRESS_SPRING = { stiffness: 200, damping: 15 } as const;

/** Basılı haldeki scale oranı */
const PRESSED_SCALE = 0.98 as const;

// ─── ANA COMPONENT ───────────────────────────────────────────────────────────

/**
 * Liquid Glass kart.
 * React.memo ile sarılı — parent re-render'larında yeniden render olmaz.
 */
export const GlassCard = memo(function GlassCard({
  padding   = 'md',
  radius    = 'md',
  intensity = 'standard',
  variant   = 'night',
  onPress,
  style,
  children,
}: GlassCardProps): React.JSX.Element {

  // ── Reduce Transparency erişilebilirlik ayarı ──
  const [reduceTransparency, setReduceTransparency] = useState<boolean>(false);

  useEffect(() => {
    // İlk değer — Promise tabanlı
    void AccessibilityInfo.isReduceTransparencyEnabled().then(setReduceTransparency);

    // Değişiklik dinleyicisi
    const subscription = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      setReduceTransparency,
    );
    return () => subscription.remove();
  }, []);

  // ── Press animasyonu (Reanimated) ──
  const scale = useSharedValue<number>(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn(): void {
    scale.value = withSpring(PRESSED_SCALE, PRESS_SPRING);
  }

  function handlePressOut(): void {
    scale.value = withSpring(1, PRESS_SPRING);
  }

  // ── Token değerleri ──
  const theme = variant === 'night' ? COSMIC_NIGHT : COSMIC_DAWN;
  const pad   = PADDING_MAP[padding];
  const r     = RADIUS_MAP[radius];
  const cfg   = INTENSITY_MAP[intensity];

  // ── Press handler'ları — sadece onPress varsa bağla ──
  const pressHandlers = onPress != null
    ? { onPressIn: handlePressIn, onPressOut: handlePressOut, onPress }
    : {};

  // ── Reduce Transparency fallback ──────────────────────────────────────────
  // BackdropBlur kaldırılır, solid arkaplan kullanılır.
  if (reduceTransparency) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <Pressable
          {...pressHandlers}
          style={[
            styles.container,
            {
              padding:         pad,
              borderRadius:    r,
              backgroundColor: theme.bg.secondary,
              borderWidth:     1,
              borderColor:     theme.glass.border,
            },
          ]}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  // ── Liquid Glass ──────────────────────────────────────────────────────────
  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        {...pressHandlers}
        style={[styles.container, { borderRadius: r }]}
      >
        {/*
         * GlassCanvasLayer — Skia çizen katman.
         * position: absolute, tam kart kaplaması.
         * pointerEvents="none" — dokunuş olaylarına müdahale etmez.
         */}
        <GlassCanvasLayer
          radius={r}
          blurSigma={cfg.blur}
          tintAlpha={cfg.tint}
          borderAlpha={cfg.border}
        />

        {/* İçerik — padding burada */}
        <View style={[styles.content, { padding: pad }]}>
          {children}
        </View>
      </Pressable>
    </Animated.View>
  );
});

// ─── CANVAS KATMANI ──────────────────────────────────────────────────────────

interface GlassCanvasLayerProps {
  radius:      number;
  blurSigma:   number;
  tintAlpha:   number;   // 0-1
  borderAlpha: number;   // 0-1
}

/**
 * Tüm glass görsel efektini çizen Skia canvas.
 *
 * onLayout ile boyutunu öğrenir, sonra çizer.
 * İlk render'da boyut sıfır — görünmez View döner ve hemen layout tetikler.
 */
const GlassCanvasLayer = memo(function GlassCanvasLayer({
  radius,
  blurSigma,
  tintAlpha,
  borderAlpha,
}: GlassCanvasLayerProps): React.JSX.Element {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // onLayout her iki durumda da bağlı — boyut değişince canvas güncellenir
  function handleLayout(e: { nativeEvent: { layout: { width: number; height: number } } }): void {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => {
      if (prev.width === width && prev.height === height) return prev;
      return { width, height };
    });
  }

  // Boyut henüz bilinmiyor — görünmez View (layout'u tetikler)
  if (size.width === 0 || size.height === 0) {
    return (
      <View
        style={StyleSheet.absoluteFill}
        onLayout={handleLayout}
        pointerEvents="none"
      />
    );
  }

  const { width: w, height: h } = size;
  const r = radius;

  // Renk değerleri
  const tintColor       = `rgba(255,255,255,${tintAlpha})`;
  const borderColor     = `rgba(255,255,255,${borderAlpha})`;

  // Edge highlight gradient renkleri — top-left parlak, sağ-alt şeffaf
  const highlightColors: [string, string] = [
    'rgba(255,255,255,0.30)',
    'rgba(255,255,255,0.00)',
  ];

  // BackdropFilter clip path — rounded rect
  const clipRRect = Skia.RRectXY(
    Skia.XYWHRect(0, 0, w, h),
    r,
    r,
  );

  // Border path — inset 0.5px her taraftan (tam köşede çakışma olmadan)
  const borderInset  = 0.5;
  const borderRadius = Math.max(0, r - borderInset);
  const borderRRect  = Skia.RRectXY(
    Skia.XYWHRect(borderInset, borderInset, w - borderInset * 2, h - borderInset * 2),
    borderRadius,
    borderRadius,
  );
  const borderPath = Skia.Path.Make();
  borderPath.addRRect(borderRRect);

  // Edge highlight path — border ile aynı path, farklı renk
  const highlightPath = Skia.Path.Make();
  highlightPath.addRRect(borderRRect);

  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={handleLayout}
      pointerEvents="none"
    >
      <Canvas style={{ width: w, height: h }}>

        {/* ── Katman 1: BackdropBlur — arka planı bulanıklaştırır ── */}
        <BackdropFilter
          clip={clipRRect}
          filter={<BackdropBlur blur={blurSigma} />}
        />

        {/* ── Katman 2: Surface tint — çok yumuşak beyaz dolgu ── */}
        <RoundedRect
          x={0}
          y={0}
          width={w}
          height={h}
          r={r}
          color={tintColor}
        />

        {/* ── Katman 3: Inner border — 1px ince beyaz çizgi ── */}
        <Group>
          <Path
            path={borderPath}
            color={borderColor}
            style="stroke"
            strokeWidth={1}
          />
        </Group>

        {/* ── Katman 4: Edge highlight — sol-üst'ten ışık (3D hissi) ── */}
        <Group>
          <Path
            path={highlightPath}
            style="stroke"
            strokeWidth={1.5}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(w * 0.6, h * 0.6)}
              colors={highlightColors}
            />
          </Path>
        </Group>

      </Canvas>
    </View>
  );
});

// ─── STILLER ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    // overflow hidden — glass blur'un kart dışına taşmasını önler
    overflow: 'hidden',
  } as ViewStyle,
  content: {
    // padding GlassCard'dan dinamik gelir
  } as ViewStyle,
});

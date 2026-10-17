import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';
import { useReducedMotion } from '../use-reduced-motion.ts';

interface DeviceBenchProps {
  /** El dispositivo. */
  image: ImageSourcePropType;
  /** Una pieza que lo alimenta (la pila de la lámpara), a su izquierda. */
  source?: ImageSourcePropType;
  width: number;
  /** Lo que se ve cuando el dispositivo funciona: luz y calor (`glow`), sonido (`rings`) o giro (`spin`). */
  effect: 'glow' | 'rings' | 'spin';
  /** El dispositivo está funcionando. */
  on: boolean;
  /** Se omiten los movimientos (Modo Enfoque): el giro queda como una inclinación fija. */
  calm?: boolean;
  /** Lo que se nota, en palabras. */
  caption: string;
  label: string;
}

/**
 * Un dispositivo de energía (C4-U03): una lámpara que da luz y calor, una campana que suena o un molinete que gira. Qué entra y qué sale lo da el
 * MODELO (`labs/transferencias.ts`); aquí solo se dibuja, y lo que se nota se dice también con palabras (no depende del movimiento).
 */
export function DeviceBench({ image, source, width, effect, on, calm, caption, label }: DeviceBenchProps) {
  const reduced = useReducedMotion();
  const spin = useRef(new Animated.Value(0)).current;
  const animate = !reduced && !calm;
  useEffect(() => {
    if (effect !== 'spin' || !on || !animate) {
      spin.setValue(0);
      return;
    }
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [effect, on, animate, spin]);

  const stageW = width - 24;
  const stageH = Math.round(Math.min(stageW, 360) * 0.62);
  const size = Math.round(stageH * 0.82);
  const cx = source ? stageW * 0.62 : stageW / 2;
  const left = cx - size / 2;
  const top = (stageH - size) / 2;
  const rotate = effect === 'spin' && on ? (animate ? spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) : '25deg') : '0deg';
  return (
    <View style={[styles.card, { width }]} accessible accessibilityRole="image" accessibilityLabel={`${label}. ${caption}`}>
      <View style={[styles.stage, { height: stageH }]}>
        {effect === 'glow' && on ? <View pointerEvents="none" style={{ position: 'absolute', left: cx - size * 0.55, top: stageH / 2 - size * 0.55, width: size * 1.1, height: size * 1.1, borderRadius: size * 0.55, backgroundColor: 'rgba(255, 214, 90, 0.55)' }} /> : null}
        {effect === 'rings' && on ? [0, 1, 2].map((i) => {
          const r = size * (0.55 + i * 0.16);
          return <View key={i} pointerEvents="none" style={[styles.ring, { left: cx - r, top: stageH / 2 - r, width: r * 2, height: r * 2, borderRadius: r, opacity: 0.85 - i * 0.22 }]} />;
        }) : null}
        {source ? (
          <>
            <Image source={source} style={{ position: 'absolute', left: stageW * 0.08, top: stageH / 2 - size * 0.3, width: size * 0.6, height: size * 0.6 }} resizeMode="contain" accessible={false} />
            <View pointerEvents="none" style={{ position: 'absolute', left: stageW * 0.08 + size * 0.5, top: stageH / 2, width: Math.max(10, cx - size * 0.35 - (stageW * 0.08 + size * 0.5)), height: 4, backgroundColor: on ? '#e8a317' : colors.slate300, borderRadius: 2 }} />
          </>
        ) : null}
        <Animated.View style={{ position: 'absolute', left, top, width: size, height: size, transform: [{ rotate }] }}>
          <Image source={image} style={{ width: size, height: size }} resizeMode="contain" accessible={false} />
        </Animated.View>
        {effect === 'glow' && on ? (
          <View pointerEvents="none" style={[styles.heat, { left: cx - 22, top: top - 6 }]}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.heatLine} />
            ))}
          </View>
        ) : null}
      </View>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 8, alignSelf: 'center', boxShadow: shadows.card },
  stage: { position: 'relative', alignSelf: 'stretch', backgroundColor: '#eef0f6', borderRadius: radius.tile, overflow: 'hidden' },
  ring: { position: 'absolute', borderWidth: 3, borderColor: '#e8a317', backgroundColor: 'transparent' },
  heat: { position: 'absolute', flexDirection: 'row', gap: 12, width: 44, justifyContent: 'center' },
  heatLine: { width: 4, height: 18, borderRadius: 2, backgroundColor: '#e8662b', opacity: 0.8 },
  caption: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.navy, textAlign: 'center' },
});

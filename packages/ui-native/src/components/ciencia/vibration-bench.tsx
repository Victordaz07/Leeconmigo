import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';
import { useReducedMotion } from '../use-reduced-motion.ts';

interface VibrationBenchProps {
  /** El objeto (regla, tambor o caja de ligas). */
  image: ImageSourcePropType;
  width: number;
  /** El objeto vibra: se dibuja con «copias» a los lados (se ve borroso), sin depender del movimiento. */
  moves: boolean;
  /** El objeto suena: se dibujan las ondas del sonido a su lado. */
  sound: boolean;
  /** Una voz habla cerca: ondas que llegan desde la izquierda. */
  voice?: boolean;
  /** Granitos de arroz sobre el objeto (el tambor); con `jumps` están saltando. */
  rice?: boolean;
  jumps?: boolean;
  /** Se omiten los movimientos (Modo Enfoque): quedan las copias y las ondas quietas. */
  calm?: boolean;
  /** Lo que se ve y se oye, en palabras («Suena · Se mueve»). */
  caption: string;
  label: string;
}

const RICE = [
  { x: 0.34, y: 0.16 },
  { x: 0.46, y: 0.12 },
  { x: 0.56, y: 0.17 },
  { x: 0.42, y: 0.22 },
  { x: 0.5, y: 0.24 },
];

/**
 * La mesa de vibraciones (C1-U01): un objeto que se ve borroso (con copias a los lados) cuando vibra y con ondas de sonido a su lado cuando
 * suena. Qué pasa con cada objeto lo da el MODELO (`labs/vibracion.ts`); aquí solo se dibuja y nunca depende del movimiento para entenderse.
 */
export function VibrationBench({ image, width, moves, sound, voice, rice, jumps, calm, caption, label }: VibrationBenchProps) {
  const reduced = useReducedMotion();
  const shake = useRef(new Animated.Value(0)).current;
  const hop = useRef(new Animated.Value(0)).current;
  const animate = !reduced && !calm;
  useEffect(() => {
    if (!moves || !animate) {
      shake.setValue(0);
      return;
    }
    const loop = Animated.loop(Animated.sequence([Animated.timing(shake, { toValue: 1, duration: 70, useNativeDriver: true }), Animated.timing(shake, { toValue: -1, duration: 70, useNativeDriver: true })]));
    loop.start();
    return () => loop.stop();
  }, [moves, animate, shake]);
  useEffect(() => {
    if (!jumps || !animate) {
      hop.setValue(0);
      return;
    }
    const loop = Animated.loop(Animated.sequence([Animated.timing(hop, { toValue: 1, duration: 160, useNativeDriver: true }), Animated.timing(hop, { toValue: 0, duration: 160, useNativeDriver: true })]));
    loop.start();
    return () => loop.stop();
  }, [jumps, animate, hop]);

  const stageH = Math.round(Math.min(width - 24, 340) * 0.7);
  const size = Math.round(stageH * 0.78);
  const left = (width - 24 - size) / 2;
  const top = (stageH - size) / 2 + 8;
  const stageW = width - 24;
  /** Anillos de sonido centrados en `cx`: cada uno un poco más grande y más tenue. */
  const rings = (cx: number, r0: number, step: number, color: string, key: string) =>
    [0, 1, 2].map((i) => {
      const r = r0 + i * step;
      return <View key={`${key}${i}`} pointerEvents="none" style={[styles.arc, { width: r * 2, height: r * 2, borderRadius: r, borderColor: color, opacity: 0.85 - i * 0.22, left: cx - r, top: stageH / 2 - r }]} />;
    });
  return (
    <View style={[styles.card, { width }]} accessible accessibilityRole="image" accessibilityLabel={`${label}. ${caption}`}>
      <View style={[styles.stage, { height: stageH }]}>
        {sound ? rings(stageW / 2, size * 0.52, size * 0.16, '#e8a317', 's') : null}
        {voice ? rings(0, size * 0.3, size * 0.22, '#3a78c2', 'v') : null}
        {moves ? (
          <>
            <Image source={image} style={{ position: 'absolute', left: left - 6, top, width: size, height: size, opacity: 0.3 }} resizeMode="contain" accessible={false} />
            <Image source={image} style={{ position: 'absolute', left: left + 6, top, width: size, height: size, opacity: 0.3 }} resizeMode="contain" accessible={false} />
          </>
        ) : null}
        <Animated.View style={{ position: 'absolute', left, top, width: size, height: size, transform: [{ translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-3, 3] }) }] }}>
          <Image source={image} style={{ width: size, height: size }} resizeMode="contain" accessible={false} />
        </Animated.View>
        {rice
          ? RICE.map((g, i) => (
              <Animated.View key={i} pointerEvents="none" style={[styles.grain, { left: left + g.x * size, top: top + g.y * size - (jumps ? 8 + (i % 3) * 5 : 0), transform: [{ translateY: hop.interpolate({ inputRange: [0, 1], outputRange: [0, jumps && animate ? -7 - (i % 2) * 4 : 0] }) }] }]} />
            ))
          : null}
      </View>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 8, alignSelf: 'center', boxShadow: shadows.card },
  stage: { position: 'relative', alignSelf: 'stretch', backgroundColor: '#f3efe3', borderRadius: radius.tile, overflow: 'hidden' },
  arc: { position: 'absolute', borderWidth: 3, backgroundColor: 'transparent' },
  grain: { position: 'absolute', width: 12, height: 8, borderRadius: 4, backgroundColor: '#e3c27a', borderWidth: 1, borderColor: '#a07a2c' },
  caption: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.navy, textAlign: 'center' },
});

import { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';
import { useReducedMotion } from '../use-reduced-motion.ts';

export interface MaterialArt {
  muneco: ImageSourcePropType;
  regadera: ImageSourcePropType;
  bandeja: ImageSourcePropType;
  /** Un cuadrado por material (iguales en tamaño: la prueba es justa). */
  materiales: Record<string, ImageSourcePropType>;
}

export interface MaterialTile {
  id: string;
  label: string;
  /** Ya se probó en este paso. */
  tried?: boolean;
}

interface MaterialTesterProps {
  art: MaterialArt;
  width: number;
  /** `techo`: la pieza hace de techo sobre el muñeco. `secar`: la pieza cae sobre un derrame. */
  test: 'techo' | 'secar';
  tiles: MaterialTile[];
  selected: string | null;
  onSelect?: (id: string) => void;
  pouring: boolean;
  /** Lo que se vio al regar: 0 nada, 0.5 poco, 1 mucho; `null` = todavía no se rocía. */
  level: number | null;
  /** «Agua que pasó bajo el techo» / «Agua que se empapó en la pieza». */
  gaugeLabel: string;
  /** El resultado con palabras (lector de pantalla y pie del dibujo). */
  resultText?: string;
  /** Lo que dice el dibujo con palabras. */
  label: string;
  calm?: boolean;
}

/**
 * El probador de materiales de C2-U02: cuatro piezas IGUALES para elegir, una estación donde la pieza se prueba (de techo sobre
 * el muñeco o sobre un derrame) y un medidor de agua. El resultado lo calcula el modelo; aquí solo se dibuja. No hay números:
 * el medidor es «nada · poco · mucho».
 */
export function MaterialTester({ art, width, test, tiles, selected, onSelect, pouring, level, gaugeLabel, resultText, label, calm }: MaterialTesterProps) {
  const reduced = useReducedMotion();
  const drop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!pouring || reduced || calm) {
      drop.setValue(0);
      return;
    }
    const loop = Animated.loop(Animated.timing(drop, { toValue: 1, duration: 600, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [pouring, reduced, calm, drop]);

  const stage = Math.min(width - 24, 360);
  const piece = stage * 0.3;
  const doll = stage * 0.26;
  const tile = Math.floor((width - 24 - 3 * 8) / 4);
  const source = selected ? art.materiales[selected] : undefined;
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.tiles}>
        {tiles.map((t) => {
          const on = t.id === selected;
          return (
            <Pressable key={t.id} disabled={!onSelect} onPress={() => onSelect?.(t.id)} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={t.label} style={[styles.tile, { width: tile }, on && styles.tileOn]}>
              <Image source={art.materiales[t.id]} style={{ width: tile - 16, height: tile - 16 }} resizeMode="contain" accessible={false} />
              <Text style={[styles.tileText, tile < 90 && { fontSize: 11 }]} numberOfLines={2}>
                {t.tried ? '✓ ' : ''}
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.stage, { height: stage * 0.72 }]} accessible accessibilityRole="image" accessibilityLabel={label}>
        {test === 'techo' ? (
          <>
            <Image source={art.muneco} style={[styles.doll, { width: doll, height: doll, left: stage * 0.3 }]} resizeMode="contain" accessible={false} />
            {source ? <Image source={source} style={[styles.roof, { width: piece * 1.1, height: piece * 1.1, left: stage * 0.3 + doll / 2 - (piece * 1.1) / 2, transform: [{ rotate: '-12deg' }] }]} resizeMode="contain" accessible={false} /> : null}
          </>
        ) : (
          <>
            <Image source={art.bandeja} style={[styles.tray, { width: stage * 0.56, height: stage * 0.56, left: stage * 0.1 }]} resizeMode="contain" accessible={false} />
            {source ? <Image source={source} style={[styles.flat, { width: piece * 0.8, height: piece * 0.8, left: stage * 0.1 + (stage * 0.56 - piece * 0.8) / 2 }]} resizeMode="contain" accessible={false} /> : null}
          </>
        )}
        {!calm ? <Image source={art.regadera} style={[styles.can, { width: stage * 0.28, height: stage * 0.28 }]} resizeMode="contain" accessible={false} /> : null}
        {pouring && !calm && !reduced ? (
          <Animated.View style={[styles.drops, { opacity: drop.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }), transform: [{ translateY: drop.interpolate({ inputRange: [0, 1], outputRange: [0, 14] }) }] }]}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.drop} />
            ))}
          </Animated.View>
        ) : null}
        <View style={styles.gauge}>
          <View style={styles.gaugeTube}>{level !== null ? <View style={[styles.gaugeFill, { height: `${Math.max(6, Math.round(level * 100))}%` }]} /> : null}</View>
        </View>
      </View>
      <Text style={styles.gaugeLabel}>{gaugeLabel}</Text>
      {resultText ? <Text style={styles.result}>{resultText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 10, alignSelf: 'center', boxShadow: shadows.card },
  tiles: { flexDirection: 'row', gap: 8 },
  tile: { alignItems: 'center', gap: 4, padding: 6, borderRadius: radius.tile, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.paperLine },
  tileOn: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  tileText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.ink, textAlign: 'center' },
  stage: { position: 'relative', alignSelf: 'stretch', backgroundColor: colors.chip, borderRadius: radius.tile, overflow: 'hidden' },
  doll: { position: 'absolute', bottom: 6 },
  roof: { position: 'absolute', top: 18 },
  tray: { position: 'absolute', bottom: 0 },
  flat: { position: 'absolute', bottom: '14%' },
  can: { position: 'absolute', top: 4, right: 36 },
  drops: { position: 'absolute', top: '30%', right: '22%', flexDirection: 'row', gap: 8 },
  drop: { width: 8, height: 12, borderRadius: 6, backgroundColor: colors.brandLight },
  gauge: { position: 'absolute', right: 8, top: 8, bottom: 8, width: 22, alignItems: 'center' },
  gaugeTube: { flex: 1, width: 22, borderWidth: 3, borderColor: colors.slate400, borderRadius: 11, backgroundColor: 'rgba(220,235,255,0.6)', overflow: 'hidden', justifyContent: 'flex-end' },
  gaugeFill: { backgroundColor: colors.brandLight },
  gaugeLabel: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted, textAlign: 'center' },
  result: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy, textAlign: 'center' },
});

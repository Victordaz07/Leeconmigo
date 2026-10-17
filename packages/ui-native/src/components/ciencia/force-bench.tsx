import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface ForceArt {
  carrito: ImageSourcePropType;
  pendulo: ImageSourcePropType;
}

const CM_PER_INNER = 0.006;

interface CartBenchProps {
  art: ForceArt;
  width: number;
  /** Empujones hacia la izquierda y hacia la derecha (0–3). */
  left: number;
  right: number;
  /** El carrito ya se soltó y se movió `travelCm` hacia `dir`. */
  released: boolean;
  dir: 'derecha' | 'izquierda' | 'quieto';
  travelCm: number;
  resultText?: string;
  label: string;
}

/**
 * El carrito en una mesa lisa (C3-U05): a un lado, los empujones hacia la derecha (flechas azules); al otro, los empujones hacia la
 * izquierda (flechas coral). Las flechas y los conteos los dibuja la app; cuántos se mueve el carrito lo da el MODELO.
 */
export function CartBench({ art, width, left, right, released, dir, travelCm, resultText, label }: CartBenchProps) {
  const inner = width - 24;
  const stageH = Math.round(inner * 0.48);
  const cart = Math.round(inner * 0.34);
  const floor = stageH - 22;
  const shift = released ? (dir === 'derecha' ? 1 : dir === 'izquierda' ? -1 : 0) * travelCm * CM_PER_INNER * inner : 0;
  const arrows = (n: number, glyph: string, color: string) => (
    <View style={styles.arrows}>
      {Array.from({ length: n }, (_, i) => (
        <Text key={i} style={[styles.arrow, { color }]}>
          {glyph}
        </Text>
      ))}
    </View>
  );
  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.stage, { height: stageH }]} accessible accessibilityRole="image" accessibilityLabel={label}>
        <View style={[styles.floor, { top: floor }]} />
        <View style={{ position: 'absolute', left: 8, top: floor - cart * 0.62, width: inner * 0.2, alignItems: 'center' }}>{arrows(right, '➜', colors.brand)}</View>
        <View style={{ position: 'absolute', right: 8, top: floor - cart * 0.62, width: inner * 0.2, alignItems: 'center' }}>{arrows(left, '⬅', colors.orangeDeep)}</View>
        <Image source={art.carrito} style={{ position: 'absolute', left: (inner - cart) / 2 + shift, top: floor - cart * 0.86, width: cart, height: cart }} resizeMode="contain" accessible={false} />
      </View>
      {resultText ? <Text style={styles.result}>{resultText}</Text> : null}
    </View>
  );
}

interface PendulumBenchProps {
  art: ForceArt;
  width: number;
  /** Lado en que está la bola ahora; `null` = quieta en el centro. */
  side: 'izquierda' | 'derecha' | null;
  /** Número del latido (se muestra encima). */
  tick?: number | null;
  tickText?: string;
  resultText?: string;
  label: string;
}

/** El péndulo (C3-U05): una bola colgada del soporte que va de un lado a otro; el latido y el lado los dice la app. */
export function PendulumBench({ art, width, side, tickText, resultText, label }: PendulumBenchProps) {
  const inner = width - 24;
  const stageH = Math.round(inner * 0.62);
  const size = Math.round(inner * 0.62);
  const angle = side === null ? 0 : side === 'izquierda' ? 24 : -24;
  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.stage, { height: stageH }]} accessible accessibilityRole="image" accessibilityLabel={label}>
        <View style={[styles.bar, { left: inner * 0.5 - 60 }]} />
        <Image source={art.pendulo} style={{ position: 'absolute', left: (inner - size) / 2, top: 8, width: size, height: size, transform: [{ rotate: `${angle}deg` }], transformOrigin: '50% 4%' }} resizeMode="contain" accessible={false} />
        {tickText ? <Text style={styles.tick}>{tickText}</Text> : null}
      </View>
      {resultText ? <Text style={styles.result}>{resultText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 10, alignSelf: 'center', boxShadow: shadows.card },
  stage: { position: 'relative', alignSelf: 'stretch', backgroundColor: colors.chip, borderRadius: radius.tile, overflow: 'hidden' },
  floor: { position: 'absolute', left: 0, right: 0, height: 5, backgroundColor: colors.slate300 },
  arrows: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 2 },
  arrow: { fontSize: 26, fontFamily: fontFamily.ui.black },
  bar: { position: 'absolute', top: 4, width: 120, height: 8, borderRadius: 4, backgroundColor: colors.slate400 },
  tick: { position: 'absolute', left: 12, top: 10, fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.muted },
  result: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy, textAlign: 'center' },
});

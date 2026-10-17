import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface RampArt {
  rampa: ImageSourcePropType;
  bloque: ImageSourcePropType;
  bola: ImageSourcePropType;
}

interface RampBenchProps {
  art: RampArt;
  width: number;
  /** Marca desde la que se suelta la bola (1 = la más baja), o `null` si todavía no se eligió. */
  mark: number | null;
  marks: number[];
  /** Se pueden tocar las marcas (el niño decide desde dónde soltar). */
  onMark?: (mark: number) => void;
  markLabel: (mark: number) => string;
  /** La bola ya se soltó: llegó abajo y el bloque se deslizó `slideCm`. */
  released: boolean;
  slideCm: number | null;
  /** Hasta dónde llega la regla (cm). */
  rulerMax: number;
  /** El resultado con palabras (p. ej. «Sonido fuerte»). */
  resultText?: string;
  label: string;
}

// Dónde está la pendiente de la rampa en la imagen (fracciones de su cuadrado): de abajo (marca 1) a arriba (marca más alta).
// Si cambia el arte, se ajusta aquí.
const RAMP = { bottom: { x: 0.8, y: 0.6 }, top: { x: 0.27, y: 0.34 }, end: 0.9 };
const CM_PER_INNER = 0.0085;

/**
 * La rampa y el bloque (C4-U02): una bola que se suelta desde una marca y choca con un bloque; una regla debajo, dibujada por la app,
 * mide cuánto se desliza el bloque. Las marcas, la regla y su escala son texto/figuras de la app (nunca parte de la imagen);
 * la distancia la da el MODELO.
 */
export function RampBench({ art, width, mark, marks, onMark, markLabel, released, slideCm, rulerMax, resultText, label }: RampBenchProps) {
  const inner = width - 24;
  const stageH = Math.round(inner * 0.62);
  const rs = inner * 0.58;
  const ballSize = Math.round(inner * 0.07);
  const blockSize = Math.round(inner * 0.17);
  const floor = stageH - 30; // la mesa
  const rampTop = floor - rs * 0.86;
  const at = (p: { x: number; y: number }) => ({ x: p.x * rs, y: rampTop + (p.y - 0.12) * rs });
  const top = at(RAMP.top);
  const bottom = at(RAMP.bottom);
  const pos = (m: number) => {
    const t = marks.length > 1 ? (m - 1) / (marks.length - 1) : 0;
    const f = 0.12 + t * 0.78;
    return { x: bottom.x + (top.x - bottom.x) * f, y: bottom.y + (top.y - bottom.y) * f };
  };
  const blockStart = rs * RAMP.end + inner * 0.02;
  const shift = released && slideCm !== null ? slideCm * CM_PER_INNER * inner : 0;
  const ball = released ? { x: blockStart + shift - ballSize * 0.9, y: floor - ballSize } : mark !== null ? { x: pos(mark).x - ballSize / 2, y: pos(mark).y - ballSize } : null;
  const ticks = Array.from({ length: Math.floor(rulerMax / 5) + 1 }, (_, i) => i * 5);
  const rulerLeft = blockStart + blockSize * 0.1;
  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.stage, { height: stageH }]} accessible accessibilityRole="image" accessibilityLabel={label}>
        <Image source={art.rampa} style={{ position: 'absolute', left: 0, top: rampTop - rs * 0.12, width: rs, height: rs }} resizeMode="contain" accessible={false} />
        <View style={[styles.floor, { top: floor }]} />
        <Image source={art.bloque} style={{ position: 'absolute', left: blockStart + shift, top: floor - blockSize * 0.86, width: blockSize, height: blockSize }} resizeMode="contain" accessible={false} />
        {ball ? <Image source={art.bola} style={{ position: 'absolute', left: ball.x, top: ball.y, width: ballSize, height: ballSize }} resizeMode="contain" accessible={false} /> : null}
        {marks.map((m) => (
          <Pressable key={m} disabled={!onMark} onPress={() => onMark?.(m)} accessibilityRole="button" accessibilityState={{ selected: m === mark }} accessibilityLabel={markLabel(m)} style={[styles.mark, { left: pos(m).x - 17, top: pos(m).y + 2 }, m === mark && styles.markOn]}>
            <Text style={[styles.markText, m === mark && styles.markTextOn]}>{m}</Text>
          </Pressable>
        ))}
        {ticks.map((cm) => (
          <View key={cm} style={{ position: 'absolute', left: rulerLeft + cm * CM_PER_INNER * inner, top: floor + 4, alignItems: 'center', width: 24, marginLeft: -12 }}>
            <View style={styles.tick} />
            <Text style={styles.tickText}>{cm}</Text>
          </View>
        ))}
      </View>
      {resultText ? <Text style={styles.result}>{resultText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 10, alignSelf: 'center', boxShadow: shadows.card },
  stage: { position: 'relative', alignSelf: 'stretch', backgroundColor: colors.chip, borderRadius: radius.tile, overflow: 'hidden' },
  floor: { position: 'absolute', left: 0, right: 0, height: 5, backgroundColor: colors.slate300 },
  mark: { position: 'absolute', width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: colors.slate400, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  markOn: { borderColor: colors.brand, backgroundColor: colors.brand },
  markText: { fontFamily: fontFamily.ui.black, fontSize: 15, color: colors.ink },
  markTextOn: { color: '#ffffff' },
  tick: { width: 2, height: 8, backgroundColor: colors.slate400 },
  tickText: { fontFamily: fontFamily.ui.bold, fontSize: 11, color: colors.muted },
  result: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy, textAlign: 'center' },
});

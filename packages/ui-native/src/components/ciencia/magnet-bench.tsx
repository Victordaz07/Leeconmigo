import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface MagnetArt {
  iman: ImageSourcePropType;
  objetos: Record<string, ImageSourcePropType>;
}

export interface MagnetTile {
  id: string;
  label: string;
  tried?: boolean;
}

interface MagnetBenchProps {
  art: MagnetArt;
  width: number;
  object: string;
  /** Marca del imán (1 = más cerca del objeto), o `null` si todavía no se puso. */
  mark: number | null;
  marks: number[];
  /** Se pueden tocar las marcas (el niño decide dónde poner el imán). */
  onMark?: (mark: number) => void;
  markLabel: (mark: number) => string;
  /** Objetos entre los que elegir (si hay varios). */
  tiles?: MagnetTile[];
  onObject?: (id: string) => void;
  /** Lo que se vio: `true` el objeto se movió, `false` no, `null` todavía no se acerca el imán. */
  moved: boolean | null;
  /** El resultado con palabras. */
  resultText?: string;
  label: string;
}

/**
 * La mesa del imán (C3-U06): un objeto a la derecha, cinco marcas hacia la izquierda (la 1, la más cercana) y un imán GRANDE en
 * herradura sobre la marca elegida. Si el objeto se movió, se corre hacia el imán SIN tocarlo. El resultado lo da el MODELO; las marcas
 * y los resultados son texto de la app (nunca parte de la imagen).
 */
export function MagnetBench({ art, width, object, mark, marks, onMark, markLabel, tiles, onObject, moved, resultText, label }: MagnetBenchProps) {
  const inner = width - 24;
  const stageH = Math.round(inner * 0.5);
  const obj = Math.round(inner * 0.2);
  const mag = Math.round(inner * 0.22);
  const objLeft = inner * 0.76;
  const step = (inner * 0.5) / Math.max(1, marks.length - 1);
  const markX = (m: number) => inner * 0.62 - (m - 1) * step; // centro de la marca
  const shift = moved ? -inner * 0.08 : 0;
  return (
    <View style={[styles.card, { width }]}>
      {tiles?.length ? (
        <View style={styles.tiles}>
          {tiles.map((t) => (
            <Pressable key={t.id} disabled={!onObject} onPress={() => onObject?.(t.id)} accessibilityRole="button" accessibilityState={{ selected: t.id === object }} accessibilityLabel={t.label} style={[styles.tile, t.id === object && styles.tileOn]}>
              <Image source={art.objetos[t.id]} style={{ width: 44, height: 44 }} resizeMode="contain" accessible={false} />
              <Text style={styles.tileText} numberOfLines={2}>
                {t.tried ? '✓ ' : ''}
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={[styles.stage, { height: stageH }]} accessible accessibilityRole="image" accessibilityLabel={label}>
        <View style={[styles.track, { bottom: stageH * 0.2 }]} />
        {mark !== null ? <Image source={art.iman} style={{ position: 'absolute', width: mag, height: mag, left: markX(mark) - mag / 2, bottom: stageH * 0.2 + 4 }} resizeMode="contain" accessible={false} /> : null}
        <Image source={art.objetos[object]} style={{ position: 'absolute', width: obj, height: obj, left: objLeft + shift, bottom: stageH * 0.2 + 4 }} resizeMode="contain" accessible={false} />
        {marks.map((m) => (
          <Pressable key={m} disabled={!onMark} onPress={() => onMark?.(m)} accessibilityRole="button" accessibilityState={{ selected: m === mark }} accessibilityLabel={markLabel(m)} style={[styles.mark, { left: markX(m) - 20, bottom: stageH * 0.2 - 46 }, m === mark && styles.markOn]}>
            <Text style={[styles.markText, m === mark && styles.markTextOn]}>{m}</Text>
          </Pressable>
        ))}
      </View>
      {resultText ? <Text style={styles.result}>{resultText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 10, alignSelf: 'center', boxShadow: shadows.card },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6, borderRadius: radius.tile, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.paperLine },
  tileOn: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  tileText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.ink, maxWidth: 90 },
  stage: { position: 'relative', alignSelf: 'stretch', backgroundColor: colors.chip, borderRadius: radius.tile, overflow: 'hidden' },
  track: { position: 'absolute', left: 12, right: 12, height: 6, borderRadius: 3, backgroundColor: colors.slate300 },
  mark: { position: 'absolute', width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.slate400, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  markOn: { borderColor: colors.brand, backgroundColor: colors.brand },
  markText: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.ink },
  markTextOn: { color: '#ffffff' },
  result: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy, textAlign: 'center' },
});

import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface MatterArt {
  balanza: ImageSourcePropType;
  frasco: ImageSourcePropType;
  /** Platitos de muestra por id (sal, azucar, arena, harina). */
  muestras: Record<string, ImageSourcePropType>;
}

interface BalanceBenchProps {
  art: MatterArt;
  width: number;
  /** Acciones de la pesada hechas: 0 nada · 1 frasco en el plato · 2 sustancia sola en el plato · 3 echada y cerrado · 4 ya disuelta/derretida. */
  done: number;
  /** Id de la sustancia (para su platito); `hielo` no tiene platito: se dibuja un cubo. */
  substance: string;
  /** Lo que marca la balanza (g); `null` = pantalla en blanco (todavía no se pesa). */
  reading: number | null;
  /** Texto de la balanza dicho en palabras (lector de pantalla). */
  label: string;
}

// Dónde está la pantalla (en blanco en la imagen) y el centro del plato, en fracciones de la imagen cuadrada de la balanza.
const SCREEN = { cx: 0.667, cy: 0.645, w: 0.25, h: 0.085, rotate: '-15deg' };
const PLATE = { x: 0.43, y: 0.38 };
const BALANCE_BOTTOM = 328 / 384;
const JAR_CENTER = 0.495;

/**
 * La balanza con el frasco cerrado (C5-U02): el frasco con agua, la sustancia en su platito y la lectura en gramos. La pantalla de la
 * balanza está EN BLANCO en la imagen: los números los dibuja la app (texto, nunca parte de la imagen) y salen del MODELO. Cuando la
 * sustancia ya está disuelta o derretida, no se ve nada dentro del frasco, y la balanza sigue marcando lo mismo.
 */
export function BalanceBench({ art, width, done, substance, reading, label }: BalanceBenchProps) {
  const inner = width - 24;
  const stageH = Math.round(inner * 0.8);
  const bs = inner * 0.5;
  const balLeft = inner * 0.25;
  const balTop = stageH - 8 - bs * BALANCE_BOTTOM;
  const plate = { x: balLeft + PLATE.x * bs, y: balTop + PLATE.y * bs };
  const js = bs * 0.75;
  const ds = bs * 0.46;
  const jarOnPlate = done === 1 || done >= 3;
  const dishOnPlate = done === 2;
  const dishVisible = done < 3;
  const jarLeft = jarOnPlate ? plate.x - js * JAR_CENTER : inner * 0.86 - js * JAR_CENTER;
  const jarTop = jarOnPlate ? plate.y - js + bs * 0.03 : stageH - 8 - js * 0.96;
  const dishLeft = dishOnPlate ? plate.x - ds / 2 : inner * 0.01;
  const dishTop = dishOnPlate ? plate.y - ds * 0.72 : stageH - 8 - ds * 0.9;
  const dishSource = art.muestras[substance];
  const sw = SCREEN.w * bs;
  const sh = SCREEN.h * bs;
  const jarBottom = jarTop + js * 0.9;
  const bits = Array.from({ length: 7 }, (_, i) => i);
  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.stage, { height: stageH }]} accessible accessibilityRole="image" accessibilityLabel={label}>
        <View style={[styles.table, { top: stageH - 6 }]} />
        <Image source={art.balanza} style={{ position: 'absolute', left: balLeft, top: balTop, width: bs, height: bs }} resizeMode="contain" accessible={false} />
        <View style={{ position: 'absolute', left: balLeft + SCREEN.cx * bs - sw / 2, top: balTop + SCREEN.cy * bs - sh / 2, width: sw, height: sh, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: SCREEN.rotate }] }}>
          {reading === null ? null : <Text style={[styles.lcd, { fontSize: Math.max(12, sh * 0.78) }]} numberOfLines={1}>{`${reading} g`}</Text>}
        </View>
        {dishVisible ? (
          dishSource ? (
            <Image source={dishSource} style={{ position: 'absolute', left: dishLeft, top: dishTop, width: ds, height: ds }} resizeMode="contain" accessible={false} />
          ) : (
            <View style={{ position: 'absolute', left: dishLeft + ds * 0.3, top: dishTop + ds * 0.35, width: ds * 0.4, height: ds * 0.4, borderRadius: 8, backgroundColor: '#dff1fb', borderWidth: 2, borderColor: '#9fd0ea', transform: [{ rotate: '8deg' }] }} />
          )
        ) : null}
        <Image source={art.frasco} style={{ position: 'absolute', left: jarLeft, top: jarTop, width: js, height: js }} resizeMode="contain" accessible={false} />
        {done === 3 ? (
          substance === 'hielo' ? (
            <View style={{ position: 'absolute', left: jarLeft + js * 0.4, top: jarBottom - js * 0.2, width: js * 0.2, height: js * 0.2, borderRadius: 6, backgroundColor: '#eaf7ff', borderWidth: 2, borderColor: '#9fd0ea', transform: [{ rotate: '-10deg' }] }} />
          ) : (
            bits.map((i) => (
              <View key={i} style={{ position: 'absolute', left: jarLeft + js * (0.3 + 0.07 * i), top: jarBottom - js * 0.05 - (i % 2) * js * 0.03, width: js * 0.05, height: js * 0.05, borderRadius: 2, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#c9d6dd' }} />
            ))
          )
        ) : null}
      </View>
    </View>
  );
}

export interface SampleChip {
  id: string;
  label: string;
}

interface SampleStripProps {
  art: Pick<MatterArt, 'muestras'>;
  samples: SampleChip[];
  /** Muestra marcada (la que se está probando). */
  active?: string;
  /** La que no tiene imagen (la muestra X): se dibuja un platito con «?». */
  mysteryId?: string;
  /** Materiales sin foto (agua, bicarbonato, vinagre): un platito de color dibujado por la app. */
  drawn?: Record<string, string>;
}

/** Los platitos de muestra con su nombre (la misteriosa, sin foto, con un «?»). */
export function SampleStrip({ art, samples, active, mysteryId, drawn }: SampleStripProps) {
  return (
    <View style={styles.strip}>
      {samples.map((s) => (
        <View key={s.id} style={[styles.chip, s.id === active && styles.chipOn]} accessible accessibilityLabel={s.label}>
          {s.id === mysteryId ? (
            <View style={styles.mystery}>
              <Text style={styles.question}>?</Text>
            </View>
          ) : !art.muestras[s.id] && drawn?.[s.id] ? (
            <View style={[styles.mystery, { borderStyle: 'solid', borderColor: colors.slate400, backgroundColor: drawn[s.id] }]} />
          ) : (
            <Image source={art.muestras[s.id]} style={{ width: 56, height: 56 }} resizeMode="contain" accessible={false} />
          )}
          <Text style={styles.chipText}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 10, alignSelf: 'center', boxShadow: shadows.card },
  stage: { position: 'relative', alignSelf: 'stretch', backgroundColor: colors.chip, borderRadius: radius.tile, overflow: 'hidden' },
  table: { position: 'absolute', left: 0, right: 0, height: 6, backgroundColor: colors.slate300 },
  lcd: { fontFamily: fontFamily.ui.black, color: '#2b3a2f', textAlign: 'center' },
  strip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: { alignItems: 'center', gap: 2, padding: 6, borderRadius: radius.tile, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.paperLine, minWidth: 80 },
  chipOn: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  chipText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.ink },
  mystery: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.slate400, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  question: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.slate400 },
});

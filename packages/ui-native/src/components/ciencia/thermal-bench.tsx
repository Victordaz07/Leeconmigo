import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface ThermalArt {
  vasoFrio: ImageSourcePropType;
  funda: ImageSourcePropType;
  termometro: ImageSourcePropType;
  /** Un cuadrado por capa disponible (espuma, fieltro, aluminio). */
  capas: Record<string, ImageSourcePropType>;
}

export interface LayerOption {
  id: string;
  label: string;
}

interface ThermalBenchProps {
  art: ThermalArt;
  width: number;
  /** Capas disponibles para armar la funda. */
  options: LayerOption[];
  /** Capas puestas, de adentro hacia afuera. */
  layers: string[];
  maxLayers: number;
  /** Se puede cambiar la funda (el constructor); si no, solo se ve. */
  editable: boolean;
  onAdd?: (id: string) => void;
  onRemove?: (index: number) => void;
  /** Lo que marca el termómetro ahora (texto con la unidad), o `null` si no se ha medido. */
  reading: string | null;
  /** «Termómetro» / «Minuto 5». */
  readingLabel: string;
  addLabel: (name: string) => string;
  removeLabel: (name: string) => string;
  emptyLabel: string;
  /** Lo que dice el banco con palabras (lector de pantalla). */
  label: string;
}

/**
 * El banco de la funda aislante (C6-U04): el vaso con su funda (hasta 3 capas), las capas disponibles y el termómetro. La lectura
 * la pone el MODELO; aquí solo se dibuja. El termómetro de la imagen va con la pantalla en blanco: la temperatura es un texto de
 * la app (con unidad), nunca parte de la imagen.
 */
export function ThermalBench({ art, width, options, layers, maxLayers, editable, onAdd, onRemove, reading, readingLabel, addLabel, removeLabel, emptyLabel, label }: ThermalBenchProps) {
  const cup = Math.min(150, width * 0.34);
  const slot = Math.min(64, (width - 24 - 2 * 8) / 3);
  return (
    <View style={[styles.card, { width }]} accessible accessibilityRole="image" accessibilityLabel={label}>
      <View style={styles.row}>
        <View style={[styles.cupBox, { width: cup + 24 }]}>
          <Image source={art.vasoFrio} style={{ width: cup, height: cup }} resizeMode="contain" accessible={false} />
          {layers.length > 0 ? <Image source={art.funda} style={[styles.sleeve, { width: cup * 0.9, height: cup * 0.9 }]} resizeMode="contain" accessible={false} /> : null}
        </View>
        <View style={styles.reading}>
          <Image source={art.termometro} style={{ width: 72, height: 72 }} resizeMode="contain" accessible={false} />
          <Text style={styles.readingLabel}>{readingLabel}</Text>
          <Text style={styles.readingValue}>{reading ?? '— °C'}</Text>
        </View>
      </View>

      <View style={styles.slots}>
        {Array.from({ length: maxLayers }, (_, i) => {
          const id = layers[i];
          const name = options.find((o) => o.id === id)?.label ?? '';
          return (
            <Pressable key={i} disabled={!editable || !id} onPress={() => onRemove?.(i)} accessibilityRole={id && editable ? 'button' : 'text'} accessibilityLabel={id ? (editable ? removeLabel(name) : name) : emptyLabel} style={[styles.slot, { width: slot }, id ? styles.slotOn : null]}>
              {id ? <Image source={art.capas[id]} style={{ width: slot - 12, height: slot - 12 }} resizeMode="contain" accessible={false} /> : <Text style={styles.slotPlus}>{i + 1}</Text>}
            </Pressable>
          );
        })}
      </View>

      {editable ? (
        <View style={styles.options}>
          {options.map((o) => (
            <Pressable key={o.id} disabled={layers.length >= maxLayers} onPress={() => onAdd?.(o.id)} accessibilityRole="button" accessibilityLabel={addLabel(o.label)} style={[styles.option, layers.length >= maxLayers && styles.optionOff]}>
              <Image source={art.capas[o.id]} style={{ width: 40, height: 40 }} resizeMode="contain" accessible={false} />
              <Text style={styles.optionText}>{o.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 10, alignSelf: 'center', boxShadow: shadows.card },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 8 },
  cupBox: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.chip, borderRadius: radius.tile, padding: 12 },
  sleeve: { position: 'absolute', bottom: 18 },
  reading: { alignItems: 'center', gap: 2 },
  readingLabel: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  readingValue: { fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.navy },
  slots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  slot: { aspectRatio: 1, borderRadius: radius.tile, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.slate400, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  slotOn: { borderStyle: 'solid', borderColor: colors.brand, backgroundColor: colors.brand50 },
  slotPlus: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.slate400 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 52, paddingHorizontal: 10, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.paperLine },
  optionOff: { opacity: 0.45 },
  optionText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink },
});

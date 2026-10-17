import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface SortArt {
  lupa: ImageSourcePropType;
  objetos: Record<string, ImageSourcePropType>;
}

export interface SortTile {
  id: string;
  label: string;
  /** Ya está en un grupo. */
  placed?: boolean;
}

export interface SortBin {
  id: string;
  label: string;
  /** Objetos que ya están en este grupo. */
  items: SortTile[];
}

interface SortBenchProps {
  art: SortArt;
  /** Objetos que todavía se pueden tocar (los que no están en un grupo se muestran arriba). */
  tiles: SortTile[];
  selected: string | null;
  onSelect?: (id: string) => void;
  /** Lo que dice la lupa del objeto elegido. */
  lensText?: string;
  bins?: SortBin[];
  onBin?: (id: string) => void;
  binsTitle?: string;
  width: number;
  label: string;
}

/**
 * La mesa del detective (C2-U01): los objetos arriba, una lupa que dice cómo es el objeto elegido y dos grupos (por ejemplo, duro y blando)
 * donde se colocan. Los textos de la lupa y los grupos son de la app; las propiedades las da el MODELO.
 */
export function SortBench({ art, tiles, selected, onSelect, lensText, bins, onBin, binsTitle, width, label }: SortBenchProps) {
  const tile = (t: SortTile, big = false) => (
    <Pressable key={t.id} disabled={!onSelect || t.placed} onPress={() => onSelect?.(t.id)} accessibilityRole="button" accessibilityState={{ selected: t.id === selected, disabled: t.placed }} accessibilityLabel={t.label} style={[styles.tile, t.id === selected && styles.tileOn, t.placed && styles.tilePlaced]}>
      <Image source={art.objetos[t.id]} style={{ width: big ? 56 : 44, height: big ? 56 : 44 }} resizeMode="contain" accessible={false} />
      <Text style={styles.tileText}>{t.label}</Text>
    </Pressable>
  );
  return (
    <View style={[styles.card, { width }]} accessible={false}>
      <View style={styles.row} accessibilityLabel={label}>
        {tiles.filter((t) => !t.placed).map((t) => tile(t, true))}
      </View>
      {lensText ? (
        <View style={styles.lens}>
          <Image source={art.lupa} style={{ width: 38, height: 38 }} resizeMode="contain" accessible={false} />
          <Text style={styles.lensText}>{lensText}</Text>
        </View>
      ) : null}
      {bins ? (
        <View style={styles.bins}>
          {binsTitle ? <Text style={styles.binsTitle}>{binsTitle}</Text> : null}
          <View style={styles.binsRow}>
            {bins.map((b) => (
              <Pressable key={b.id} disabled={!onBin} onPress={() => onBin?.(b.id)} accessibilityRole="button" accessibilityLabel={b.label} style={[styles.bin, selected !== null && onBin && styles.binReady]}>
                <Text style={styles.binLabel}>{b.label}</Text>
                <View style={styles.binItems} pointerEvents="none">
                  {b.items.map((t) => (
                    <View key={t.id} style={[styles.tile, styles.tilePlaced]}>
                      <Image source={art.objetos[t.id]} style={{ width: 44, height: 44 }} resizeMode="contain" accessible={false} />
                      <Text style={styles.tileText}>{t.label}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 12, alignSelf: 'center', boxShadow: shadows.card },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  tile: { alignItems: 'center', gap: 2, padding: 6, borderRadius: radius.tile, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.paperLine, minWidth: 76 },
  tileOn: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  tilePlaced: { opacity: 0.95, minWidth: 0, padding: 4 },
  tileText: { fontFamily: fontFamily.ui.extrabold, fontSize: 12, color: colors.ink },
  lens: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.violet50, borderRadius: radius.tile, padding: 10 },
  lensText: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.violetDeep, flexShrink: 1 },
  bins: { gap: 6 },
  binsTitle: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.navy },
  binsRow: { flexDirection: 'row', gap: 10 },
  bin: { flex: 1, minHeight: 96, borderRadius: radius.tile, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.slate400, padding: 8, gap: 6, backgroundColor: '#ffffff' },
  binReady: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  binLabel: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.ink, textAlign: 'center' },
  binItems: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
});

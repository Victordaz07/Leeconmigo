import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface EventTile {
  id: string;
  label: string;
  /** Un dibujo pequeño, si el suceso tiene (no todos). */
  image?: ImageSourcePropType;
  /** Ya está en un grupo. */
  placed?: boolean;
}

export interface EventBin {
  id: string;
  label: string;
  items: EventTile[];
}

interface EventBoardProps {
  tiles: EventTile[];
  selected: string | null;
  onSelect?: (id: string) => void;
  /** Las pistas del suceso elegido: cada una de una fuente distinta. */
  cluesTitle?: string;
  clues?: string[];
  bins: EventBin[];
  onBin?: (id: string) => void;
  binsTitle: string;
  width: number;
  label: string;
}

/**
 * Los sucesos de la Tierra (C2-U08): se elige uno, se leen sus pistas (de dos fuentes) y se coloca en «Rápido» o «Lento».
 * Las pistas y a qué grupo va cada suceso los da el MODELO (`labs/cambios.ts`); aquí solo se dibuja.
 */
export function EventBoard({ tiles, selected, onSelect, cluesTitle, clues, bins, onBin, binsTitle, width, label }: EventBoardProps) {
  const content = (t: EventTile) => (
    <>
      {t.image ? <Image source={t.image} style={styles.img} resizeMode="contain" accessible={false} /> : null}
      <Text style={styles.tileText}>{t.label}</Text>
    </>
  );
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.row} accessibilityLabel={label}>
        {tiles
          .filter((t) => !t.placed)
          .map((t) => (
            <Pressable key={t.id} disabled={!onSelect} onPress={() => onSelect?.(t.id)} accessibilityRole="button" accessibilityState={{ selected: t.id === selected }} accessibilityLabel={t.label} style={[styles.tile, t.id === selected && styles.tileOn]}>
              {content(t)}
            </Pressable>
          ))}
      </View>
      {clues?.length ? (
        <View style={styles.clues}>
          {cluesTitle ? <Text style={styles.cluesTitle}>{cluesTitle}</Text> : null}
          {clues.map((c, i) => (
            <View key={i} style={styles.clue}>
              <Text style={styles.clueNum}>{i + 1}</Text>
              <Text style={styles.clueText}>{c}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <View style={styles.bins}>
        <Text style={styles.binsTitle}>{binsTitle}</Text>
        <View style={styles.binsRow}>
          {bins.map((b) => (
            <Pressable key={b.id} disabled={!onBin} onPress={() => onBin?.(b.id)} accessibilityRole="button" accessibilityLabel={b.label} style={[styles.bin, selected !== null && onBin && styles.binReady]}>
              <Text style={styles.binLabel}>{b.label}</Text>
              <View style={styles.binItems} pointerEvents="none">
                {b.items.map((t) => (
                  <View key={t.id} style={[styles.tile, styles.tilePlaced]}>
                    {content(t)}
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 12, alignSelf: 'center', boxShadow: shadows.card },
  row: { flexDirection: 'column', gap: 8 },
  tile: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: radius.tile, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.paperLine },
  tileOn: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  tilePlaced: { padding: 6, alignSelf: 'stretch' },
  img: { width: 36, height: 36 },
  tileText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.ink, flexShrink: 1 },
  clues: { gap: 6, backgroundColor: colors.violet50, borderRadius: radius.tile, padding: 10 },
  cluesTitle: { fontFamily: fontFamily.ui.black, fontSize: 14, color: colors.violetDeep },
  clue: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  clueNum: { fontFamily: fontFamily.ui.black, fontSize: 15, color: colors.violetDeep, width: 18 },
  clueText: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.violetDeep, flexShrink: 1 },
  bins: { gap: 6 },
  binsTitle: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.navy },
  binsRow: { flexDirection: 'row', gap: 10 },
  bin: { flex: 1, minHeight: 96, borderRadius: radius.tile, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.slate400, padding: 8, gap: 6, backgroundColor: '#ffffff' },
  binReady: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  binLabel: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.ink, textAlign: 'center' },
  binItems: { gap: 4 },
});

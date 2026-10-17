import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface ResultCell {
  /** Lo anotado, en palabras. `null` = todavía sin anotar. */
  text: string | null;
}
export interface ResultRow {
  id: string;
  label: string;
  cells: ResultCell[];
}

interface ResultTableProps {
  title: string;
  headers: string[];
  rows: ResultRow[];
  emptyLabel: string;
  onCellPress?: (rowId: string, col: number) => void;
  active?: { rowId: string; col: number };
}

/** Tabla de lo que el niño ve (palabras, no números): «lo distingo», «pasó un poco»… Cada casilla se anota con una acción suya. */
export function ResultTable({ title, headers, rows, emptyLabel, onCellPress, active }: ResultTableProps) {
  return (
    <View style={styles.card} accessibilityRole="summary">
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <View style={styles.labelCol} />
        {headers.map((h) => (
          <Text key={h} style={[styles.cell, styles.head]}>
            {h}
          </Text>
        ))}
      </View>
      {rows.map((r) => (
        <View key={r.id} style={styles.row}>
          <Text style={[styles.labelCol, styles.rowLabel]}>{r.label}</Text>
          {r.cells.map((c, i) => {
            const open = c.text === null && onCellPress;
            const on = active?.rowId === r.id && active.col === i;
            return (
              <Pressable
                key={i}
                disabled={!open}
                onPress={() => onCellPress?.(r.id, i)}
                accessibilityRole={open ? 'button' : 'text'}
                accessibilityLabel={`${r.label}, ${headers[i]}: ${c.text ?? emptyLabel}`}
                style={[styles.cell, styles.value, c.text === null && styles.empty, on && styles.active]}
              >
                <Text style={[styles.valueText, c.text === null && styles.emptyText]}>{c.text ?? '—'}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 14, gap: 6, boxShadow: shadows.card },
  title: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.navy, marginBottom: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  labelCol: { flex: 1.3, minWidth: 80 },
  rowLabel: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink },
  cell: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  head: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.muted, textAlign: 'center', minHeight: 0 },
  value: { backgroundColor: colors.paperLine, borderRadius: 12, borderWidth: 2, borderColor: colors.line, paddingHorizontal: 4 },
  empty: { backgroundColor: '#ffffff', borderStyle: 'dashed', borderColor: colors.slate400 },
  active: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  valueText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, textAlign: 'center', color: colors.ink },
  emptyText: { color: colors.slate400 },
});

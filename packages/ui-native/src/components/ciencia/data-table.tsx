import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface TableRow {
  id: string;
  label: string;
  /** Un valor por prueba; `null` = todavía sin anotar. */
  cells: (number | null)[];
}

interface DataTableProps {
  title: string;
  headers: string[];
  rows: TableRow[];
  unit: string;
  emptyLabel: string;
  /** Si hay, las casillas vacías se pueden tocar (para pesar y anotar). */
  onCellPress?: (rowId: string, col: number) => void;
  active?: { rowId: string; col: number };
}

/** La tabla de datos del niño (gramos por prueba). Cada casilla se anota con una acción suya, nunca aparece sola. */
export function DataTable({ title, headers, rows, unit, emptyLabel, onCellPress, active }: DataTableProps) {
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
          {r.cells.map((v, i) => {
            const isActive = active?.rowId === r.id && active.col === i;
            const open = v === null && onCellPress;
            return (
              <Pressable
                key={i}
                disabled={!open}
                onPress={() => onCellPress?.(r.id, i)}
                accessibilityRole={open ? 'button' : 'text'}
                accessibilityLabel={`${r.label}, ${headers[i]}: ${v === null ? emptyLabel : `${v} ${unit}`}`}
                style={[styles.cell, styles.value, v === null && styles.empty, isActive && styles.active]}
              >
                <Text style={[styles.valueText, v === null && styles.emptyText]}>{v === null ? '—' : v}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

interface ScaleProps {
  title: string;
  /** Lo que marca la báscula, o `null` si no hay nada encima. */
  grams: number | null;
  unit: string;
}

/** Báscula digital: la pantalla en blanco hasta que se pesa un vaso (el número lo calcula el modelo, no está pintado). */
export function Scale({ title, grams, unit }: ScaleProps) {
  return (
    <View style={styles.scale} accessibilityRole="timer" accessibilityLabel={grams === null ? title : `${title}: ${grams} ${unit}`}>
      <Text style={styles.scaleTitle}>{title}</Text>
      <View style={styles.screen}>
        <Text style={styles.screenText}>{grams === null ? '' : `${grams} ${unit}`}</Text>
      </View>
      <View style={styles.pan} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 14, gap: 6, boxShadow: shadows.card },
  title: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.navy, marginBottom: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  labelCol: { flex: 1.6, minWidth: 90 },
  rowLabel: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink },
  cell: { flex: 1, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  head: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.muted, textAlign: 'center', minHeight: 0 },
  value: { backgroundColor: colors.paperLine, borderRadius: 12, borderWidth: 2, borderColor: colors.line },
  empty: { backgroundColor: '#ffffff', borderStyle: 'dashed', borderColor: colors.slate400 },
  active: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  valueText: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.ink },
  emptyText: { color: colors.slate400 },
  unit: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted, textAlign: 'right' },
  scale: { alignItems: 'center', gap: 6, backgroundColor: '#ffffff', borderRadius: radius.card, padding: 14, boxShadow: shadows.card, minWidth: 150 },
  scaleTitle: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.navy },
  screen: { backgroundColor: '#1d2a22', borderRadius: 12, minWidth: 110, minHeight: 52, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  screenText: { fontFamily: fontFamily.ui.black, fontSize: 26, color: '#9ff0c0' },
  pan: { width: 110, height: 12, borderRadius: 8, backgroundColor: colors.slate300 },
});

import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import { tapPosition } from './tap-position.ts';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface Bar {
  id: string;
  /** «A1», «B2»… */
  label: string;
  /** Color de la serie (bandeja A o B). */
  color: string;
  /** Gramos que dibujó el niño; `null` = todavía sin barra. */
  value: number | null;
}

interface BarChartProps {
  title: string;
  axisLabel: string;
  bars: Bar[];
  /** Tope del eje (gramos). */
  max: number;
  width: number;
  height?: number;
  /** Toca la columna a la altura que quiere (el niño construye su gráfica). */
  onSet?: (id: string, grams: number) => void;
  /** Ayuda para lector de pantalla: lo que dice la gráfica, con palabras. */
  description: string;
  /** Barras que no coinciden con la tabla (se marcan en ámbar, nunca rojo). */
  flagged?: string[];
  /** Cada cuánto va una rayita del eje (por defecto 8, los gramos de la erosión). */
  step?: number;
}

const STEP = 8;

interface ColumnProps {
  bar: Bar;
  max: number;
  plotH: number;
  flagged: boolean;
  onSet?: (id: string, grams: number) => void;
}

/** Una columna: se toca a la altura del dato (y cada columna lleva su dato con +1/−1 para quien usa lector de pantalla). */
function Column({ bar: b, max, plotH, flagged, onSet }: ColumnProps) {
  const ref = useRef<View>(null);
  const pick = (e: GestureResponderEvent) => tapPosition(ref, e, (_x, y) => onSet?.(b.id, Math.round(Math.min(1, Math.max(0, 1 - y / plotH)) * max)));
  return (
    <View style={styles.col}>
      <Pressable
        ref={ref}
        disabled={!onSet}
        onPress={pick}
        accessibilityRole="adjustable"
        accessibilityLabel={`${b.label}: ${b.value ?? '—'}`}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => onSet?.(b.id, Math.max(0, Math.min(max, (b.value ?? 0) + (e.nativeEvent.actionName === 'increment' ? 1 : -1))))}
        style={[styles.hit, { height: plotH }]}
      >
        <View pointerEvents="none" style={styles.barWrap}>
          {b.value !== null ? (
            <>
              <Text style={styles.valueText}>{b.value}</Text>
              <View style={[styles.bar, { height: `${(b.value / max) * 100}%`, backgroundColor: b.color }, flagged && styles.flagged]} />
            </>
          ) : null}
        </View>
      </Pressable>
      <Text style={styles.label}>{b.label}</Text>
    </View>
  );
}

/** Gráfica de barras que CONSTRUYE el niño con sus datos; el eje y los valores son texto, no dibujo. */
export function BarChart({ title, axisLabel, bars, max, width, height = 220, onSet, description, flagged = [], step = STEP }: BarChartProps) {
  const ticks: number[] = [];
  for (let v = 0; v <= max; v += step) ticks.push(v);
  const plotH = height - 36;
  return (
    <View style={[styles.card, { width }]} accessible accessibilityLabel={`${title}. ${description}`}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.axis}>{axisLabel}</Text>
      <View style={[styles.plot, { height }]}>
        <View style={[styles.ticks, { height: plotH }]} pointerEvents="none">
          {[...ticks].reverse().map((t) => (
            <View key={t} style={styles.tickRow}>
              <Text style={styles.tickText}>{t}</Text>
              <View style={styles.tickLine} />
            </View>
          ))}
        </View>
        <View style={[styles.cols, { height }]}>
          {bars.map((b) => (
            <Column key={b.id} bar={b} max={max} plotH={plotH} flagged={flagged.includes(b.id)} onSet={onSet} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 14, gap: 2, alignSelf: 'center', boxShadow: shadows.card },
  title: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.navy },
  axis: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted },
  plot: { marginTop: 6, position: 'relative' },
  ticks: { position: 'absolute', top: 0, left: 0, right: 0, justifyContent: 'space-between' },
  tickRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tickText: { width: 24, textAlign: 'right', fontFamily: fontFamily.ui.bold, fontSize: 12, color: colors.muted },
  tickLine: { flex: 1, height: 1, backgroundColor: colors.line },
  cols: { position: 'absolute', top: 0, left: 30, right: 0, flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
  col: { flex: 1, alignItems: 'stretch', gap: 4 },
  hit: { justifyContent: 'flex-end' },
  barWrap: { flex: 1, justifyContent: 'flex-end', alignItems: 'stretch' },
  bar: { borderTopLeftRadius: 8, borderTopRightRadius: 8, marginHorizontal: 4, minHeight: 3 },
  flagged: { borderWidth: 3, borderColor: colors.warn },
  valueText: { textAlign: 'center', fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.ink },
  label: { textAlign: 'center', fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.inkSoft },
});

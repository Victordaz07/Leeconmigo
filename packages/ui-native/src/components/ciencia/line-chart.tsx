import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';
import { tapPosition } from './tap-position.ts';

export interface LineSeries {
  id: string;
  /** Lo que dice la leyenda («Sin funda», «2 capas de espuma»). */
  label: string;
  color: string;
  /** Un valor por columna (tiempo); `null` = todavía sin punto. */
  points: (number | null)[];
}

interface LineChartProps {
  title: string;
  xLabel: string;
  yLabel: string;
  /** Lo que se escribe bajo cada columna («0», «5», «10»). */
  columns: string[];
  yMin: number;
  yMax: number;
  series: LineSeries[];
  width: number;
  height?: number;
  /** Serie que el niño traza tocando cada columna a la altura de su dato. */
  editableId?: string;
  onSet?: (seriesId: string, column: number, value: number) => void;
  /** Columnas de la serie editable que no coinciden con la tabla (ámbar, nunca rojo). */
  flagged?: number[];
  /** Lo que dice la gráfica con palabras. */
  description: string;
}

const PAD = { left: 38, right: 14, top: 14, bottom: 28 };

/** Gráfica de líneas de temperatura frente a tiempo: varias series y, si se pide, una que el niño traza tocando. Los números son texto. */
export function LineChart({ title, xLabel, yLabel, columns, yMin, yMax, series, width, height = 240, editableId, onSet, flagged = [], description }: LineChartProps) {
  const plotW = width - 28 - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;
  const xAt = (i: number) => PAD.left + (columns.length === 1 ? plotW / 2 : (plotW * i) / (columns.length - 1));
  const yAt = (v: number) => PAD.top + plotH * (1 - (v - yMin) / (yMax - yMin));
  const ticks: number[] = [];
  for (let v = yMin; v <= yMax; v += 2) ticks.push(v);
  return (
    <View style={[styles.card, { width }]} accessible accessibilityLabel={`${title}. ${description}`}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.axis}>{yLabel}</Text>
      <View style={{ width: width - 28, height }}>
        <Svg width={width - 28} height={height} pointerEvents="none">
          {ticks.map((t) => (
            <Polyline key={t} points={`${PAD.left},${yAt(t)} ${PAD.left + plotW},${yAt(t)}`} stroke={colors.line} strokeWidth={1} fill="none" />
          ))}
          {series.map((s) => {
            const pts = s.points.map((v, i) => (v === null ? null : { x: xAt(i), y: yAt(v) }));
            const line = pts.filter((p): p is { x: number; y: number } => p !== null);
            return (
              <View key={s.id}>
                {line.length > 1 ? <Polyline points={line.map((p) => `${p.x},${p.y}`).join(' ')} stroke={s.color} strokeWidth={3} fill="none" /> : null}
                {line.map((p, i) => (
                  <Circle key={i} cx={p.x} cy={p.y} r={5} fill={s.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </View>
            );
          })}
        </Svg>
        {ticks.map((t) => (
          <Text key={t} style={[styles.tick, { top: yAt(t) - 8 }]} pointerEvents="none">
            {t}
          </Text>
        ))}
        {columns.map((c, i) => (
          <Text key={c} style={[styles.xTick, { left: xAt(i) - 16, top: height - PAD.bottom + 6 }]} pointerEvents="none">
            {c}
          </Text>
        ))}
        {editableId && onSet
          ? columns.map((_, i) => <Column key={i} index={i} left={xAt(i) - plotW / (2 * Math.max(1, columns.length - 1))} width={plotW / Math.max(1, columns.length - 1)} top={PAD.top} height={plotH} yMin={yMin} yMax={yMax} flagged={flagged.includes(i)} onSet={(v) => onSet(editableId, i, v)} label={`${columns[i]}`} value={series.find((s) => s.id === editableId)?.points[i] ?? null} />)
          : null}
      </View>
      <Text style={styles.axis}>{xLabel}</Text>
      <View style={styles.legend}>
        {series.map((s) => (
          <View key={s.id} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: s.color }]} />
            <Text style={styles.legendText}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

interface ColumnProps {
  index: number;
  left: number;
  width: number;
  top: number;
  height: number;
  yMin: number;
  yMax: number;
  flagged: boolean;
  value: number | null;
  label: string;
  onSet: (value: number) => void;
}

/** Una columna tocable: el niño toca a la altura de su dato (y cada columna lleva ± para quien usa lector de pantalla). */
function Column({ left, width, top, height, yMin, yMax, flagged, value, label, onSet }: ColumnProps) {
  const ref = useRef<View>(null);
  const press = (e: GestureResponderEvent) => tapPosition(ref, e, (_x, y) => onSet(Math.round(yMin + (1 - Math.min(1, Math.max(0, y / height))) * (yMax - yMin))));
  return (
    <Pressable
      ref={ref}
      onPress={press}
      accessibilityRole="adjustable"
      accessibilityLabel={`${label}: ${value ?? '—'}`}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => onSet(Math.max(yMin, Math.min(yMax, (value ?? yMin) + (e.nativeEvent.actionName === 'increment' ? 1 : -1))))}
      style={[styles.column, { left, width, top, height }, flagged && styles.columnFlag]}
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 14, gap: 2, alignSelf: 'center', boxShadow: shadows.card },
  title: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.navy },
  axis: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted },
  tick: { position: 'absolute', left: 0, width: PAD.left - 8, textAlign: 'right', fontFamily: fontFamily.ui.bold, fontSize: 12, color: colors.muted },
  xTick: { position: 'absolute', width: 32, textAlign: 'center', fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.inkSoft },
  column: { position: 'absolute' },
  columnFlag: { backgroundColor: 'rgba(240,160,32,0.18)', borderRadius: 8 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: 7 },
  legendText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.ink },
});

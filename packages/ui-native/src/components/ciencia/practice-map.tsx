import { useRef, type ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import { tapPosition } from './tap-position.ts';
import Svg, { Circle, Polygon, Rect } from 'react-native-svg';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface MapCell {
  col: number;
  row: number;
}
export interface MapView2D {
  cols: number;
  rows: number;
  range: MapCell[];
  volcanoes: MapCell[];
  quakes: MapCell[];
  /** Columnas de mar a la izquierda (0 = no hay). */
  seaCols: number;
  /** Casillas de la franja alrededor de la cordillera (si la herramienta está encendida). */
  band?: MapCell[];
}
export interface MapLayers {
  relief: boolean;
  volcanoes: boolean;
  quakes: boolean;
}
interface PracticeMapProps {
  map: MapView2D;
  layers: MapLayers;
  width: number;
  /** Casillas de sismo que el niño marcó al contar. */
  marks?: MapCell[];
  onCell?: (cell: MapCell) => void;
  /** Lectores de pantalla: el mapa dicho con palabras. */
  description: string;
  /** Marca fija visible («Mapa de práctica: no es un lugar real»). */
  disclaimer: string;
}

const key = (c: MapCell) => `${c.col},${c.row}`;

/**
 * Mapa de práctica en cuadrícula (Ciencia S5). Un mapa DIDÁCTICO: dice siempre que no es un lugar real. Los datos vienen de
 * `PRACTICE_MAPS`; aquí solo se dibujan capas y se marcan los sismos que el niño cuenta.
 */
export function PracticeMap({ map, layers, width, marks = [], onCell, description, disclaimer }: PracticeMapProps) {
  const cell = width / map.cols;
  const height = cell * map.rows;
  const range = new Set(map.range.map(key));
  const band = new Set((map.band ?? []).map(key));
  const marked = new Set(marks.map(key));
  const ref = useRef<View>(null);
  const press = (e: GestureResponderEvent) =>
    tapPosition(ref, e, (x, y) => {
      const col = Math.min(map.cols - 1, Math.max(0, Math.floor(x / cell)));
      const row = Math.min(map.rows - 1, Math.max(0, Math.floor(y / cell)));
      onCell?.({ col, row });
    });
  const cells: ReactElement[] = [];
  for (let r = 0; r < map.rows; r++) {
    for (let c = 0; c < map.cols; c++) {
      const k = `${c},${r}`;
      const sea = c < map.seaCols;
      const high = layers.relief && range.has(k);
      cells.push(<Rect key={k} x={c * cell} y={r * cell} width={cell} height={cell} fill={high ? '#b98b5e' : sea ? '#bfdcf3' : '#e6f2d9'} stroke="#ffffff" strokeWidth={1} />);
      if (band.has(k)) cells.push(<Rect key={`b${k}`} x={c * cell + 1} y={r * cell + 1} width={cell - 2} height={cell - 2} fill="rgba(255,228,92,0.55)" stroke="#e8c630" strokeWidth={2} />);
    }
  }
  return (
    <View style={[styles.card, { width: width + 24 }]}>
      <Text style={styles.disclaimer}>{disclaimer}</Text>
      <Pressable ref={ref} disabled={!onCell} onPress={press} accessibilityRole="image" accessibilityLabel={description} style={{ width, height }}>
        <Svg width={width} height={height} pointerEvents="none">
          {cells}
          {layers.volcanoes
            ? map.volcanoes.map((v) => <Polygon key={`v${key(v)}`} points={`${v.col * cell + cell / 2},${v.row * cell + cell * 0.12} ${v.col * cell + cell * 0.1},${v.row * cell + cell * 0.88} ${v.col * cell + cell * 0.9},${v.row * cell + cell * 0.88}`} fill={colors.orange} stroke={colors.orangeDeep} strokeWidth={1.5} />)
            : null}
          {layers.quakes
            ? map.quakes.map((q) => (
                <Circle key={`q${key(q)}`} cx={q.col * cell + cell / 2} cy={q.row * cell + cell / 2} r={cell * 0.26} fill={marked.has(key(q)) ? colors.brand : colors.violet} stroke="#ffffff" strokeWidth={marked.has(key(q)) ? 3 : 1.5} />
              ))
            : null}
        </Svg>
      </Pressable>
    </View>
  );
}

interface LayerToggleProps {
  label: string;
  on: boolean;
  glyph: 'relief' | 'volcano' | 'quake' | 'band';
  onPress: () => void;
}

const GLYPH_COLOR = { relief: '#b98b5e', volcano: colors.orange, quake: colors.violet, band: '#e8c630' } as const;

/** Interruptor de capa del mapa: la muestra (cuadrito de color) y su nombre en texto. */
export function LayerToggle({ label, on, glyph, onPress }: LayerToggleProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={label} style={[styles.toggle, on && styles.toggleOn]}>
      <View style={[styles.swatch, { backgroundColor: GLYPH_COLOR[glyph], opacity: on ? 1 : 0.35 }]} />
      <Text style={styles.toggleText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 8, alignSelf: 'center', alignItems: 'center', boxShadow: shadows.card },
  disclaimer: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.orangeDeep, backgroundColor: colors.warnTint, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4, overflow: 'hidden' },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: '#ffffff', borderWidth: 2, borderColor: colors.line },
  toggleOn: { backgroundColor: colors.brand50, borderColor: colors.brand },
  swatch: { width: 18, height: 18, borderRadius: 5 },
  toggleText: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.ink },
});

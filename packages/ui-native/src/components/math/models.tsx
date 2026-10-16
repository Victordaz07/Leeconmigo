/**
 * Modelos matemáticos que DIBUJA la app con números exactos (docs/research §3 "Autoría gráfica"): el arte nunca decide un
 * conteo. Grupos iguales (bolsas con fichas), arreglos (filas × columnas) y diagrama de barra. Todo número es texto real.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius } from '../../tokens.ts';

const DOT = colors.subjMate;

/** Puntos acomodados en una cuadrícula casi cuadrada (para el interior de una bolsa). */
function DotCluster({ count, dot, color = DOT }: { count: number; dot: number; color?: string }) {
  const cols = Math.ceil(Math.sqrt(count));
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: cols * (dot + 4), gap: 4, justifyContent: 'center' }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: color }} />
      ))}
    </View>
  );
}

interface EqualGroupsProps {
  groups: number;
  /** Fichas en cada grupo (o, si se da `counts`, cuántas tiene cada uno ahora). */
  perGroup: number;
  counts?: number[];
  /** Ancho disponible: decide el tamaño de las bolsas. */
  width: number;
  label?: string;
  /** Grupos ya contados (resaltados). */
  counted?: number;
  onPressGroup?: (index: number) => void;
}

export function EqualGroups({ groups, perGroup, counts, width, label, counted = 0, onPressGroup }: EqualGroupsProps) {
  const perRow = Math.min(groups, width < 420 ? 3 : 5);
  const gap = 12;
  const bag = Math.max(64, Math.min(150, Math.floor((width - gap * (perRow - 1)) / perRow)));
  const maxInBag = Math.max(perGroup, ...(counts ?? [0]));
  const dot = Math.max(8, Math.min(18, Math.floor((bag - 24) / (Math.ceil(Math.sqrt(Math.max(1, maxInBag))) + 1))));
  return (
    <View style={styles.wrap} accessibilityLabel={label}>
      <View style={[styles.row, { gap, width: perRow * bag + gap * (perRow - 1) }]}>
        {Array.from({ length: groups }, (_, i) => {
          const n = counts ? counts[i] : perGroup;
          const content = (
            <View style={[styles.bag, { width: bag, height: bag }, i < counted && styles.bagCounted]}>
              <DotCluster count={n} dot={dot} />
            </View>
          );
          return onPressGroup ? (
            <Pressable key={i} onPress={() => onPressGroup(i)} accessibilityRole="button" accessibilityLabel={`${i + 1}`} style={({ pressed }) => pressed && styles.pressed}>
              {content}
            </Pressable>
          ) : (
            <View key={i}>{content}</View>
          );
        })}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

interface ArrayGridProps {
  rows: number;
  columns: number;
  width: number;
  /** Celdas pintadas (`r*columns+c`); sin esto, todas se ven llenas. */
  painted?: Set<number>;
  onToggle?: (index: number) => void;
  label?: string;
}

export function ArrayGrid({ rows, columns, width, painted, onToggle, label }: ArrayGridProps) {
  const cell = Math.max(28, Math.min(56, Math.floor((width - 8) / columns)));
  return (
    <View style={styles.wrap} accessibilityLabel={label}>
      <View style={{ width: cell * columns, gap: 0 }}>
        {Array.from({ length: rows }, (_, r) => (
          <View key={r} style={styles.gridRow}>
            {Array.from({ length: columns }, (_, c) => {
              const i = r * columns + c;
              const on = painted ? painted.has(i) : true;
              const dot = <View style={[styles.cellDot, { width: cell * 0.6, height: cell * 0.6, borderRadius: cell * 0.3 }, on ? styles.cellOn : styles.cellOff]} />;
              return onToggle ? (
                <Pressable key={c} onPress={() => onToggle(i)} accessibilityRole="button" accessibilityLabel={`${r + 1}, ${c + 1}`} style={[styles.cell, { width: cell, height: cell }]}>
                  {dot}
                </Pressable>
              ) : (
                <View key={c} style={[styles.cell, { width: cell, height: cell }]}>
                  {dot}
                </View>
              );
            })}
          </View>
        ))}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

interface TapeDiagramProps {
  groups: number;
  perGroup: number;
  width: number;
  filled: number;
  onPressPart?: (index: number) => void;
  /** Texto del total (con "?" mientras no se sepa). */
  totalLabel: string;
}

/** Diagrama de barra (*tape diagram*): una barra partida en grupos iguales con su cantidad, y la llave del total. */
export function TapeDiagram({ groups, perGroup, width, filled, onPressPart, totalLabel }: TapeDiagramProps) {
  const part = Math.max(36, Math.floor((width - 8) / groups));
  return (
    <View style={styles.wrap}>
      <View style={[styles.tape, { width: part * groups }]}>
        {Array.from({ length: groups }, (_, i) => {
          const on = i < filled;
          return (
            <Pressable key={i} onPress={onPressPart ? () => onPressPart(i) : undefined} disabled={!onPressPart} accessibilityRole="button" accessibilityLabel={`${perGroup}`} style={[styles.part, { width: part }, on && styles.partOn]}>
              <Text style={[styles.partText, on && styles.partTextOn]}>{perGroup}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.brace, { width: part * groups }]} />
      <Text style={styles.total}>{totalLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  bag: { borderRadius: radius.tile, backgroundColor: '#ffffff', borderWidth: 3, borderColor: colors.brand200, alignItems: 'center', justifyContent: 'center', padding: 8 },
  bagCounted: { borderColor: colors.subjMate, backgroundColor: colors.brand50 },
  pressed: { transform: [{ scale: 0.97 }] },
  label: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.navy, textAlign: 'center' },
  gridRow: { flexDirection: 'row' },
  cell: { alignItems: 'center', justifyContent: 'center' },
  cellDot: {},
  cellOn: { backgroundColor: DOT },
  cellOff: { backgroundColor: colors.track },
  tape: { flexDirection: 'row', borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: colors.subjMate },
  part: { height: 56, alignItems: 'center', justifyContent: 'center', borderRightWidth: 2, borderRightColor: colors.subjMate, backgroundColor: '#ffffff' },
  partOn: { backgroundColor: colors.brand100 },
  partText: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.muted },
  partTextOn: { color: colors.navy },
  brace: { height: 12, borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 2, borderColor: colors.inkMute, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  total: { fontFamily: fontFamily.ui.black, fontSize: 22, color: colors.navy },
});

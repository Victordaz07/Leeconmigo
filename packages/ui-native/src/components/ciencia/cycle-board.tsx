import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../../tokens.ts';

export interface CycleArt {
  sol: ImageSourcePropType;
  piezas: Record<string, ImageSourcePropType>;
}

export interface CycleArrow {
  id: string;
  from: string;
  to: string;
  /** `sol` (dorada) o `gravedad` (azul). */
  driver: 'sol' | 'gravedad';
}

export interface CyclePiece {
  id: string;
  label: string;
}

interface CycleBoardProps {
  art: CycleArt;
  width: number;
  pieces: CyclePiece[];
  arrows: CycleArrow[];
  /** Pieza elegida como origen de la flecha que se está armando. */
  selected: string | null;
  onPiece?: (id: string) => void;
  /** Rótulo del Sol (decorativo: es el motor de las flechas doradas). */
  sunLabel: string;
  label: string;
}

/** Dónde va cada pieza en el tablero (fracciones del ancho y del alto). */
export const CYCLE_POSITIONS: Record<string, { x: number; y: number }> = {
  nube: { x: 0.5, y: 0.14 },
  montana: { x: 0.84, y: 0.36 },
  suelo: { x: 0.5, y: 0.5 },
  mar: { x: 0.14, y: 0.74 },
  rio: { x: 0.5, y: 0.8 },
  arbol: { x: 0.86, y: 0.78 },
};
const SUN = { x: 0.1, y: 0.13 };
const GOLD = '#e8a317';
const BLUE = '#3a78c2';

/**
 * El tablero del modelo del ciclo del agua (C6-U05): piezas con su dibujo y flechas entre ellas. Las flechas, su color (dorada = la mueve el
 * Sol, azul = la gravedad) y los rótulos los dibuja la app; qué flechas existen y qué las impulsa lo da el MODELO.
 */
export function CycleBoard({ art, width, pieces, arrows, selected, onPiece, sunLabel, label }: CycleBoardProps) {
  const inner = width - 24;
  const stageH = Math.round(inner * 0.78);
  const tile = Math.round(inner * 0.17);
  const at = (id: string) => {
    const p = CYCLE_POSITIONS[id];
    return { x: p.x * inner, y: p.y * stageH };
  };
  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.stage, { height: stageH }]} accessible accessibilityRole="image" accessibilityLabel={label}>
        <View style={{ position: 'absolute', left: SUN.x * inner - tile * 0.45, top: SUN.y * stageH - tile * 0.45, alignItems: 'center' }} accessible accessibilityLabel={sunLabel}>
          <Image source={art.sol} style={{ width: tile * 0.9, height: tile * 0.9 }} resizeMode="contain" accessible={false} />
        </View>
        {arrows.map((a) => {
          const from = at(a.from);
          const to = at(a.to);
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const trim = tile * 0.55;
          const lineLen = Math.max(8, len - trim * 2);
          const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          const color = a.driver === 'sol' ? GOLD : BLUE;
          return (
            <View key={a.id} pointerEvents="none" style={{ position: 'absolute', left: mx - lineLen / 2, top: my - 2, width: lineLen, height: 4, transform: [{ rotate: `${ang}deg` }], alignItems: 'flex-end', justifyContent: 'center' }}>
              <View style={{ position: 'absolute', left: 0, right: 8, height: 4, borderRadius: 2, backgroundColor: color }} />
              <Text style={{ position: 'absolute', right: -3, top: -9, fontSize: 18, color, fontFamily: fontFamily.ui.black }}>▶</Text>
            </View>
          );
        })}
        {pieces.map((p) => {
          const c = at(p.id);
          const on = p.id === selected;
          return (
            <Pressable
              key={p.id}
              disabled={!onPiece}
              onPress={() => onPiece?.(p.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={p.label}
              style={[styles.piece, { left: c.x - tile / 2, top: c.y - tile / 2, width: tile, height: tile + 14 }, on && styles.pieceOn]}
            >
              <Image source={art.piezas[p.id]} style={{ width: tile - 6, height: tile - 6 }} resizeMode="contain" accessible={false} />
              <Text style={styles.pieceText}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 12, gap: 10, alignSelf: 'center', boxShadow: shadows.card },
  stage: { position: 'relative', alignSelf: 'stretch', backgroundColor: '#e8f2fa', borderRadius: radius.tile, overflow: 'hidden' },
  piece: { position: 'absolute', alignItems: 'center', borderRadius: 14, borderWidth: 2, borderColor: 'transparent', backgroundColor: 'rgba(255,255,255,0.55)' },
  pieceOn: { borderColor: colors.brand, backgroundColor: colors.brand50 },
  pieceText: { fontFamily: fontFamily.ui.extrabold, fontSize: 12, color: colors.ink },
});

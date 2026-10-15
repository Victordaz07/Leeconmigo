import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PIN_LENGTH, type PinKey } from '@lee-conmigo/ui-core';
import { colors, fontFamily, gradients, radius, shadows } from '../tokens.ts';
import { GradientView } from './gradient-view.tsx';

interface PinPadProps {
  /** Dígitos escritos (solo se muestran como puntos, nunca el número). */
  filled: number;
  onKey: (key: PinKey) => void;
  onSubmit: () => void;
  disabled?: boolean;
  /** Teclas más chicas (teléfono). */
  compact?: boolean;
}

const ROWS: PinKey[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

/** Teclado del PIN de padres (Kitewise P1): 4 puntos + teclas físicas grandes, ⌫ y ✓ verde. */
export function PinPad({ filled, onKey, onSubmit, disabled, compact }: PinPadProps) {
  const ready = filled === PIN_LENGTH && !disabled;
  const key = compact ? { width: 76, height: 52 } : null;
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.dots} accessibilityLabel={`${filled} de ${PIN_LENGTH} dígitos`}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <View key={i} style={[styles.dot, i < filled && styles.dotOn]} />
        ))}
      </View>
      <View style={[styles.grid, compact && styles.gridCompact, disabled && styles.disabled]}>
        {ROWS.map((row, r) => (
          <View key={r} style={[styles.row, compact && styles.gridCompact]}>
            {row.map((k) => (
              <Key key={k} label={k} onPress={() => onKey(k)} disabled={disabled} size={key} />
            ))}
          </View>
        ))}
        <View style={[styles.row, compact && styles.gridCompact]}>
          <Key label="⌫" a11y="Borrar" tone="soft" onPress={() => onKey('back')} disabled={disabled} size={key} />
          <Key label="0" onPress={() => onKey('0')} disabled={disabled} size={key} />
          <Pressable onPress={onSubmit} disabled={!ready} accessibilityRole="button" accessibilityLabel="Listo" accessibilityState={{ disabled: !ready }} style={!ready && styles.notReady}>
            {({ pressed }) => (
              <View style={[styles.okLedge, { paddingBottom: pressed ? 1 : 5, paddingTop: pressed ? 4 : 0 }]}>
                <GradientView gradient={gradients.green} style={[styles.key, key]}>
                  <Text style={[styles.keyText, styles.okText]}>✓</Text>
                </GradientView>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Key({ label, a11y, tone, onPress, disabled, size }: { label: string; a11y?: string; tone?: 'soft'; onPress: () => void; disabled?: boolean; size?: { width: number; height: number } | null }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={a11y ?? label}>
      {({ pressed }) => (
        <View style={[styles.keyLedge, { paddingBottom: pressed ? 1 : 5, paddingTop: pressed ? 4 : 0 }]}>
          <View style={[styles.key, size, tone === 'soft' ? styles.keySoft : styles.keyWhite]}>
            <Text style={styles.keyText}>{label}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const KEY_W = 92;
const KEY_H = 66;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 28 },
  dots: { flexDirection: 'row', gap: 18 },
  dot: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.track },
  dotOn: { backgroundColor: colors.brand },
  grid: { gap: 14 },
  wrapCompact: { gap: 16 },
  gridCompact: { gap: 10 },
  row: { flexDirection: 'row', gap: 14 },
  keyLedge: { borderRadius: radius.tile, backgroundColor: colors.line, boxShadow: shadows.soft },
  okLedge: { borderRadius: radius.tile, backgroundColor: colors.okDark },
  key: { width: KEY_W, height: KEY_H, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center' },
  keyWhite: { backgroundColor: '#ffffff' },
  keySoft: { backgroundColor: colors.chip },
  keyText: { fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.ink },
  okText: { color: '#ffffff' },
  notReady: { opacity: 0.45 },
  disabled: { opacity: 0.5 },
});

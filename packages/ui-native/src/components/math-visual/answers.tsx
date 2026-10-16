/**
 * Casillas de respuesta (una o varias: "parcelas / en cada una / en total", "en cada plato / sobran") con un solo teclado
 * de números. Se toca una casilla para elegir dónde se escribe.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius } from '../../tokens.ts';
import { manip } from './objects.tsx';

export interface AnswerBox {
  key: string;
  label: string;
  value: string;
}

export function AnswerBoxes({ boxes, active, onFocus, disabled }: { boxes: AnswerBox[]; active: string | null; onFocus: (key: string) => void; disabled?: boolean }) {
  return (
    <View style={styles.boxes}>
      {boxes.map((b) => {
        const on = b.key === active && !disabled;
        return (
          <Pressable key={b.key} disabled={disabled} onPress={() => onFocus(b.key)} accessibilityRole="button" accessibilityLabel={`${b.label}: ${b.value || '—'}`} accessibilityState={{ selected: on }} style={styles.boxWrap}>
            <Text style={styles.boxLabel}>{b.label}</Text>
            <View style={[styles.box, on && styles.boxOn]}>
              <Text style={[styles.boxText, !b.value && styles.boxEmpty]}>{b.value || '?'}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0'] as const;

export function DigitPad({ onKey, onBack, compact, disabled, backLabel }: { onKey: (d: string) => void; onBack: () => void; compact?: boolean; disabled?: boolean; backLabel: string }) {
  const key = compact ? { width: 60, height: 48 } : { width: 70, height: 54 };
  return (
    <View style={[styles.keys, { width: key.width * 3 + 20 }]}>
      {KEYS.map((k) => (
        <Pressable key={k} disabled={disabled} onPress={() => (k === 'back' ? onBack() : onKey(k))} accessibilityRole="button" accessibilityLabel={k === 'back' ? backLabel : k} style={({ pressed }) => [styles.key, key, k === 'back' && styles.keySoft, disabled && styles.off, pressed && styles.pressed]}>
          <Text style={styles.keyText}>{k === 'back' ? '⌫' : k}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  boxes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  boxWrap: { alignItems: 'center', gap: 4 },
  boxLabel: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.muted },
  box: { minWidth: 92, height: 60, borderRadius: radius.tile, borderWidth: 3, borderColor: colors.brand100, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  boxOn: { borderColor: manip.blue, backgroundColor: manip.blueSoft },
  boxText: { fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.navy },
  boxEmpty: { color: colors.outline },
  keys: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  key: { borderRadius: 16, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.line },
  keySoft: { backgroundColor: colors.chip },
  keyText: { fontFamily: fontFamily.ui.black, fontSize: 24, color: colors.ink },
  off: { opacity: 0.4 },
  pressed: { transform: [{ scale: 0.95 }] },
});

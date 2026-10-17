import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fontFamily, minTouch, radius, shadows } from '../../tokens.ts';

export interface OptionItem {
  id: string;
  text: string;
  /** `rejected`: «revisa esto» (ámbar, nunca rojo). */
  state?: 'rejected';
}

interface OptionListProps {
  options: OptionItem[];
  selected: string[];
  /** Varias a la vez (casillas) o una sola (círculos). */
  multi?: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
  /** Opciones muy cortas (números): van en fila. */
  compact?: boolean;
  small?: boolean;
}

/** Opciones para elegir (Ciencia): una o varias, con la rechazada en ámbar y una sola columna legible. */
export function OptionList({ options, selected, multi, onToggle, disabled, compact, small }: OptionListProps) {
  return (
    <View style={[styles.list, compact && styles.row]} accessibilityRole={multi ? undefined : 'radiogroup'}>
      {options.map((o, i) => {
        const on = selected.includes(o.id);
        const rejected = o.state === 'rejected' && on;
        return (
          <Pressable
            key={o.id}
            disabled={disabled}
            onPress={() => onToggle(o.id)}
            accessibilityRole={multi ? 'checkbox' : 'radio'}
            accessibilityState={{ checked: on, disabled }}
            accessibilityLabel={o.text}
            accessibilityHint={`${i + 1}/${options.length}`}
            style={[styles.item, compact && styles.itemCompact, on && styles.itemOn, rejected && styles.itemRejected, disabled && styles.disabled]}
          >
            <View style={[styles.mark, multi ? styles.markBox : styles.markDot, on && (rejected ? styles.markRejected : styles.markOn)]}>
              {on ? (
                <Svg width={16} height={16} viewBox="0 0 24 24">
                  <Path d="M5 12.5l4.5 4.5L19 7.5" stroke="#ffffff" strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              ) : null}
            </View>
            <Text style={[styles.text, small && styles.textSmall, compact && styles.textCompact]}>{o.text}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  item: { minHeight: minTouch + 6, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#ffffff', borderRadius: radius.tile, borderWidth: 2, borderColor: colors.line, paddingHorizontal: 16, paddingVertical: 10, boxShadow: shadows.soft },
  itemCompact: { minWidth: 88, justifyContent: 'center', paddingHorizontal: 14 },
  itemOn: { backgroundColor: colors.brand50, borderColor: colors.brand },
  itemRejected: { backgroundColor: colors.warnTint, borderColor: colors.warn },
  disabled: { opacity: 0.6 },
  mark: { width: 26, height: 26, borderWidth: 2, borderColor: colors.slate300, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  markBox: { borderRadius: 8 },
  markDot: { borderRadius: 13 },
  markOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  markRejected: { backgroundColor: colors.warn, borderColor: colors.warn },
  text: { flex: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 19, color: colors.ink, lineHeight: 26 },
  textSmall: { fontSize: 17, lineHeight: 23 },
  textCompact: { flex: 0, fontSize: 22, fontFamily: fontFamily.ui.black },
});

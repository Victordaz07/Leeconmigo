import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius } from '@lee-conmigo/ui-native';

/** Estilos y piezas que usan todas las familias. */
export const fstyles = StyleSheet.create({
  stack: { gap: 12 },
  buttonsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  toggles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  weighRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  flex: { flex: 1 },
  alignStart: { alignSelf: 'flex-start' },
  helper: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.inkSoft, flexShrink: 1 },
  badge: { alignSelf: 'center', backgroundColor: colors.warnTint, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 5 },
  badgeText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.orangeDeep },
  reveal: { backgroundColor: colors.violet50, borderRadius: radius.tile, padding: 12 },
  revealText: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.violetDeep },
});

/** Distintivo de procedencia: todo dato de práctica se dice (docs/design/ciencia/ESPECIFICACION.md). */
export function Badge({ text }: { text: string }) {
  return (
    <View style={fstyles.badge}>
      <Text style={fstyles.badgeText}>{text}</Text>
    </View>
  );
}

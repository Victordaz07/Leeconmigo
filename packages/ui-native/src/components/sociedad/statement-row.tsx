import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, minTouch, radius, shadows } from '../../tokens.ts';

/** Una afirmación del paso "comparar": el niño la clasifica tocando "Sigue igual" o "Es nuevo" (nunca roja). */
export function StatementRow({
  text,
  status,
  onClassify,
  labels,
}: {
  text: string;
  status?: 'igual' | 'nuevo';
  onClassify: (status: 'igual' | 'nuevo') => void;
  labels: { igual: string; nuevo: string };
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.buttons}>
        <Pressable onPress={() => onClassify('igual')} accessibilityRole="button" accessibilityLabel={labels.igual} accessibilityState={{ selected: status === 'igual' }} style={[styles.chip, status === 'igual' && styles.chipOn]}>
          <Text style={[styles.chipText, status === 'igual' && styles.chipTextOn]}>{labels.igual}</Text>
        </Pressable>
        <Pressable onPress={() => onClassify('nuevo')} accessibilityRole="button" accessibilityLabel={labels.nuevo} accessibilityState={{ selected: status === 'nuevo' }} style={[styles.chip, status === 'nuevo' && styles.chipOnNuevo]}>
          <Text style={[styles.chipText, status === 'nuevo' && styles.chipTextOn]}>{labels.nuevo}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { borderRadius: radius.tile, backgroundColor: '#ffffff', padding: 14, gap: 10, boxShadow: shadows.soft },
  text: { fontFamily: fontFamily.ui.bold, fontSize: 16, color: colors.ink },
  buttons: { flexDirection: 'row', gap: 10 },
  chip: { flex: 1, minHeight: minTouch, borderRadius: radius.pill, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  chipOn: { backgroundColor: colors.violet },
  chipOnNuevo: { backgroundColor: colors.subjSociedad },
  chipText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink },
  chipTextOn: { color: '#ffffff' },
});

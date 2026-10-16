import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius, shadows } from '../tokens.ts';

/** Píldora blanca de dato (racha, estrellas) en la cabecera de Inicio. */
export function StatChip({ icon, label, accessibilityLabel }: { icon: ReactNode; label: string; accessibilityLabel: string }) {
  return (
    <View style={styles.chip} accessible accessibilityLabel={accessibilityLabel}>
      {icon}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffffff', borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 10, boxShadow: shadows.chip },
  text: { fontFamily: fontFamily.ui.black, fontSize: 17, color: colors.ink },
});

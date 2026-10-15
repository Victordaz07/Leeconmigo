import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { shadows } from '../tokens.ts';

/** Botón redondo blanco (volver, cerrar) de 48 px; el área táctil se agranda a 56 (docs/06: controles grandes). */
export function RoundButton({ onPress, label, children }: { onPress: () => void; label: string; children: ReactNode }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={4} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', boxShadow: shadows.round },
  pressed: { transform: [{ translateY: 2 }] },
});

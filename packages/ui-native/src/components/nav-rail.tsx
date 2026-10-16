import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NavStyle } from '@lee-conmigo/ui-core';
import { colors, fontFamily, gradients, radius, shadows } from '../tokens.ts';
import { GradientView } from './gradient-view.tsx';
import { KiteIcon } from './icons.tsx';

export interface NavRailItem {
  key: string;
  label: string;
  icon: (active: boolean) => ReactNode;
}

interface NavRailProps {
  items: NavRailItem[];
  /** Al final (abajo): p. ej. Padres. */
  bottomItems?: NavRailItem[];
  active: string;
  onSelect: (key: string) => void;
  /** `rail` (tablet acostada), `railCompact` (teléfono acostado), `bottom` (vertical, Kitewise G4). Ver `layoutFor`. */
  variant?: NavStyle;
  /** Barra de abajo: espacio del sistema (gestos/botones) que hay que dejar libre. */
  bottomInset?: number;
}

/** Ancho que ocupa el riel a la izquierda (0 si la navegación va abajo): para calcular el espacio de cada pantalla. */
export const navRailWidth = (variant: NavStyle): number => (variant === 'rail' ? 112 : variant === 'railCompact' ? 80 : 0);

/** Riel izquierdo del niño (SPEC §2): logo arriba, Inicio y Logros, Padres abajo. */
export function NavRail({ items, bottomItems = [], active, onSelect, variant = 'rail', bottomInset = 0 }: NavRailProps) {
  const render = (it: NavRailItem) => {
    const on = it.key === active;
    return (
      <Pressable key={it.key} onPress={() => onSelect(it.key)} accessibilityRole="button" accessibilityLabel={it.label} accessibilityState={{ selected: on }} style={[styles.item, variant === 'railCompact' && styles.itemCompact, variant === 'bottom' && styles.itemBottom, on && styles.itemOn]}>
        {it.icon(on)}
        <Text style={[styles.label, on && styles.labelOn]}>{it.label}</Text>
      </Pressable>
    );
  };
  if (variant === 'bottom') {
    return <View style={[styles.bar, { paddingBottom: 8 + bottomInset }]}>{[...items, ...bottomItems].map(render)}</View>;
  }
  if (variant === 'railCompact') {
    return (
      <ScrollView style={styles.railCompact} contentContainerStyle={styles.railCompactContent}>
        {[...items, ...bottomItems].map(render)}
      </ScrollView>
    );
  }
  return (
    <View style={styles.rail}>
      <GradientView gradient={gradients.brand} style={styles.logo}>
        <KiteIcon size={34} />
      </GradientView>
      <View style={styles.group}>{items.map(render)}</View>
      <View style={styles.spacer} />
      <View style={styles.group}>{bottomItems.map(render)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { width: 112, paddingVertical: 24, alignItems: 'center', backgroundColor: '#ffffff', boxShadow: shadows.soft, gap: 28 },
  logo: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', boxShadow: '0px 6px 14px rgba(30, 111, 232, 0.35)' },
  group: { gap: 10, alignItems: 'center' },
  spacer: { flex: 1 },
  railCompact: { width: 80, flexGrow: 0, backgroundColor: '#ffffff', boxShadow: shadows.soft },
  railCompactContent: { paddingVertical: 12, alignItems: 'center', gap: 6 },
  bar: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8, paddingHorizontal: 8, backgroundColor: '#ffffff', boxShadow: '0px -2px 10px rgba(30, 35, 64, 0.08)' },
  itemCompact: { width: 64, minHeight: 58 },
  itemBottom: { flex: 1, maxWidth: 140, minHeight: 56 },
  item: { width: 84, minHeight: 72, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center', gap: 4 },
  itemOn: { backgroundColor: colors.brand50, boxShadow: `inset 0px -3px 0px ${colors.brandLedgeSoft}` },
  label: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted },
  labelOn: { color: colors.brand, fontFamily: fontFamily.ui.extrabold },
});

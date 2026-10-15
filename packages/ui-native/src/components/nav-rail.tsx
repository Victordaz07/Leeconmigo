import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
}

/** Riel izquierdo del niño (SPEC §2): logo arriba, Inicio y Logros, Padres abajo. */
export function NavRail({ items, bottomItems = [], active, onSelect }: NavRailProps) {
  const render = (it: NavRailItem) => {
    const on = it.key === active;
    return (
      <Pressable key={it.key} onPress={() => onSelect(it.key)} accessibilityRole="button" accessibilityLabel={it.label} accessibilityState={{ selected: on }} style={[styles.item, on && styles.itemOn]}>
        {it.icon(on)}
        <Text style={[styles.label, on && styles.labelOn]}>{it.label}</Text>
      </Pressable>
    );
  };
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
  item: { width: 84, minHeight: 72, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center', gap: 4 },
  itemOn: { backgroundColor: colors.brand50, boxShadow: `inset 0px -3px 0px ${colors.brandLedgeSoft}` },
  label: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted },
  labelOn: { color: colors.brand, fontFamily: fontFamily.ui.extrabold },
});

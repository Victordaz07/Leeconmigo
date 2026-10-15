import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ENERGY_OPTIONS, type Energy } from '@lee-conmigo/ui-core';
import { Button, colors, fontFamily, radius, shadows } from '@lee-conmigo/ui-native';

const TINT: Record<Energy, string> = { alta: colors.focus, normal: colors.brand100, baja: colors.violet50 };

/**
 * "¿Cómo llegas hoy?" (Kitewise B2): el niño elige su energía y eso decide cuánto dura la misión (20/15/8 min). Elegir
 * "Cansado" nunca castiga: "Cualquier día sirve. Tu racha no cambia." (D5).
 */
export function EnergyScreen({ name, onStart }: { name: string; onStart: (energy: Energy) => void }) {
  const [energy, setEnergy] = useState<Energy>('normal');
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + 36, paddingBottom: insets.bottom + 28 }]}>
      <Text style={styles.title}>¿Cómo llegas hoy, {name}?</Text>
      <View style={styles.row}>
        {ENERGY_OPTIONS.map((o) => {
          const on = o.id === energy;
          return (
            <Pressable key={o.id} onPress={() => setEnergy(o.id)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={`${o.title}, ${o.detail}`} style={[styles.card, on && styles.cardOn]}>
              <View style={[styles.circle, { backgroundColor: TINT[o.id] }]}>
                <Text style={styles.glyph}>{o.glyph}</Text>
              </View>
              <Text style={styles.cardTitle}>{o.title}</Text>
              <Text style={styles.detail}>{o.detail}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.footer}>
        <Text style={styles.star}>⭐</Text>
        <Text style={styles.note}>Cualquier día sirve. Tu racha no cambia.</Text>
        <Button label="Empezar" onPress={() => onStart(energy)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.creamDeep, paddingHorizontal: 48, gap: 32, justifyContent: 'center' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 42, color: colors.navy, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 22, width: '100%', maxWidth: 1100, alignSelf: 'center' },
  card: { flex: 1, minHeight: 300, paddingVertical: 32, backgroundColor: '#ffffff', borderRadius: radius.panel + 4, alignItems: 'center', justifyContent: 'center', gap: 12, borderWidth: 5, borderColor: 'transparent', boxShadow: shadows.card },
  cardOn: { borderColor: colors.brand },
  circle: { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center' },
  glyph: { fontSize: 54, color: colors.ink },
  cardTitle: { fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.ink },
  detail: { fontFamily: fontFamily.ui.bold, fontSize: 17, color: colors.muted, textAlign: 'center', paddingHorizontal: 12 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 },
  star: { fontSize: 40 },
  note: { fontFamily: fontFamily.ui.extrabold, fontSize: 19, color: colors.inkSoft },
});

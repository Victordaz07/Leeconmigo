import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ENERGY_OPTIONS, type Energy } from '@lee-conmigo/ui-core';
import { Button, colors, fontFamily, radius, shadows, useLayout } from '@lee-conmigo/ui-native';

const TINT: Record<Energy, string> = { alta: colors.focus, normal: colors.brand100, baja: colors.violet50 };

/**
 * "¿Cómo llegas hoy?" (Kitewise B2): el niño elige su energía y eso decide cuánto dura la misión (20/15/8 min). Elegir
 * "Cansado" nunca castiga: "Cualquier día sirve. Tu racha no cambia." (D5).
 */
export function EnergyScreen({ name, onStart }: { name: string; onStart: (energy: Energy) => void }) {
  const [energy, setEnergy] = useState<Energy>('normal');
  const insets = useSafeAreaInsets();
  const { narrow, short, gutter } = useLayout();
  // Teléfono en vertical: tarjetas en fila (círculo a la izquierda). Poca altura: tarjetas más bajas.
  const stacked = narrow && !short;
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.screen, { paddingHorizontal: gutter, paddingTop: insets.top + (short ? 16 : 36), paddingBottom: insets.bottom + (short ? 16 : 28), gap: short ? 16 : 32 }]}>
      <Text style={[styles.title, (narrow || short) && styles.titleSmall]}>¿Cómo llegas hoy, {name}?</Text>
      <View style={[styles.row, stacked && styles.rowStacked]}>
        {ENERGY_OPTIONS.map((o) => {
          const on = o.id === energy;
          return (
            <Pressable key={o.id} onPress={() => setEnergy(o.id)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={`${o.title}, ${o.detail}`} style={[styles.card, short && styles.cardShort, stacked && styles.cardStacked, on && styles.cardOn]}>
              <View style={[styles.circle, (short || stacked) && styles.circleSmall, { backgroundColor: TINT[o.id] }]}>
                <Text style={[styles.glyph, (short || stacked) && styles.glyphSmall]}>{o.glyph}</Text>
              </View>
              <View style={stacked ? styles.cardTextStacked : styles.cardText}>
                <Text style={[styles.cardTitle, (short || stacked) && styles.cardTitleSmall]}>{o.title}</Text>
                <Text style={[styles.detail, stacked && styles.detailStacked]}>{o.detail}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.footer, narrow && styles.footerNarrow]}>
        <View style={styles.noteRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={[styles.note, narrow && styles.noteSmall]}>Cualquier día sirve. Tu racha no cambia.</Text>
        </View>
        <Button label="Empezar" onPress={() => onStart(energy)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.creamDeep },
  screen: { flexGrow: 1, justifyContent: 'center' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 42, color: colors.navy, textAlign: 'center' },
  titleSmall: { fontSize: 28 },
  row: { flexDirection: 'row', gap: 16, width: '100%', maxWidth: 1100, alignSelf: 'center' },
  rowStacked: { flexDirection: 'column', gap: 12 },
  cardText: { alignItems: 'center', gap: 6 },
  cardTextStacked: { flex: 1, gap: 2 },
  cardShort: { minHeight: 0, paddingVertical: 16, gap: 8 },
  cardStacked: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', minHeight: 0, flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 14, paddingHorizontal: 16, gap: 16 },
  circleSmall: { width: 64, height: 64, borderRadius: 32 },
  glyphSmall: { fontSize: 28 },
  cardTitleSmall: { fontSize: 22 },
  detailStacked: { textAlign: 'left', paddingHorizontal: 0 },
  footerNarrow: { flexDirection: 'column', gap: 12 },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  noteSmall: { fontSize: 16 },
  card: { flex: 1, minHeight: 300, paddingVertical: 32, backgroundColor: '#ffffff', borderRadius: radius.panel + 4, alignItems: 'center', justifyContent: 'center', gap: 12, borderWidth: 5, borderColor: 'transparent', boxShadow: shadows.card },
  cardOn: { borderColor: colors.brand },
  circle: { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center' },
  glyph: { fontSize: 54, color: colors.ink },
  cardTitle: { fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.ink },
  detail: { fontFamily: fontFamily.ui.bold, fontSize: 17, color: colors.muted, textAlign: 'center', paddingHorizontal: 12 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 },
  star: { fontSize: 40 },
  note: { flexShrink: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 19, color: colors.inkSoft },
});

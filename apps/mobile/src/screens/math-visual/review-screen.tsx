import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { generateVisual, VISUAL_TEMPLATES } from '@lee-conmigo/math-content';
import type { MathLang } from '@lee-conmigo/ui-core';
import { Button, colors, fontFamily, radius, useLayout } from '@lee-conmigo/ui-native';
import { VisualExercise } from './visual-exercise';

/**
 * SOLO DESARROLLO (docs/design/math-visual §7 "pantalla interna de revisión"): una instancia de cada plantilla, con
 * "otra variante" y cambio ES/EN sin perder el trabajo. Aquí sí se ven ids y semillas; nunca en la app del niño.
 */
export function VisualReviewScreen({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [templateId, setTemplateId] = useState(VISUAL_TEMPLATES[0].id);
  const [seed, setSeed] = useState(1);
  const [lang, setLang] = useState<MathLang>('es');
  const template = VISUAL_TEMPLATES.find((t) => t.id === templateId)!;
  const instance = useMemo(() => generateVisual(template, seed), [template, seed]);
  const width = Math.min(layout.width - layout.gutter * 2, 1100);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter, gap: 14 }}>
      <View style={styles.row}>
        <Button label="‹ DEV" variant="secondary" onPress={onBack} />
        <Text style={styles.title}>Revisión · matemáticas visuales</Text>
      </View>
      <View style={styles.chips}>
        {VISUAL_TEMPLATES.map((t) => (
          <Pressable key={t.id} onPress={() => { setTemplateId(t.id); setSeed(1); }} accessibilityRole="button" style={[styles.chip, t.id === templateId && styles.chipOn]}>
            <Text style={[styles.chipText, t.id === templateId && styles.chipTextOn]}>
              {t.id} · {t.grades[0]}–{t.grades[1]}.º
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        <Button label="Otra variante" variant="secondary" onPress={() => setSeed(seed + 1)} />
        <Button label={lang === 'es' ? 'Ver en inglés' : 'Ver en español'} variant="secondary" onPress={() => setLang(lang === 'es' ? 'en' : 'es')} />
        <Text style={styles.meta}>
          {instance.instanceId} · {instance.skillId}
        </Text>
      </View>
      <View style={{ width, alignSelf: 'center' }}>
        <VisualExercise key={instance.instanceId} instance={instance} lang={lang} width={width} onNext={() => setSeed(seed + 1)} nextLabel="Siguiente variante ›" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 22, color: colors.navy },
  meta: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.chip },
  chipOn: { backgroundColor: colors.navy },
  chipText: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.inkSoft },
  chipTextOn: { color: '#ffffff' },
});

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { unitProgress, unitsForGrade, type ScienceProgress, type ScienceUnitEntry } from '@lee-conmigo/science-content';
import { CIENCIA_COPY, type CienciaLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, gradients, GradientView, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';

interface CatalogScreenProps {
  lang: CienciaLang;
  progress: ScienceProgress;
  /** Unidades que ya se pueden jugar (contenido + arte listos), con cuántas sesiones tienen. */
  playable: Record<string, number>;
  initialGrade: number;
  onBack: () => void;
  onOpen: (unitId: string) => void;
}

const AREA_COLOR: Record<ScienceUnitEntry['area'], string> = { vida: colors.ok, materia: colors.brand, tierra: colors.orange, ingenieria: colors.violetMid };
const GRADES = [1, 2, 3, 4, 5, 6] as const;

/**
 * Las unidades de Ciencia por grado (Kitewise: «todo abre, lo sugerido se destaca»). Solo se ven las que ya se pueden jugar
 * (contenido y arte listos): las demás del mapa de 48 no aparecen hasta que estén hechas (no se inventa contenido,
 * docs/CLAUDE.md). Los estándares NO se muestran aquí (solo a padres, y como borrador).
 */
export function CatalogScreen({ lang, progress, playable, initialGrade, onBack, onOpen }: CatalogScreenProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const c = CIENCIA_COPY;
  const [grade, setGrade] = useState(initialGrade);
  const units = unitsForGrade(grade).filter((u) => playable[u.id] !== undefined);
  const ready = Object.keys(playable).length;
  const wide = !layout.narrow;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 28, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={c.button.back[lang]}>
          <ChevronLeftIcon />
        </RoundButton>
        <GradientView gradient={gradients.subjCiencia} style={styles.pill}>
          <Text style={styles.pillText}>🔬 {c.subject[lang]}</Text>
        </GradientView>
        <View style={styles.flex} />
        <Text style={styles.meta}>{c.catalog.unitsReady(ready)[lang]}</Text>
      </View>
      <Text style={[styles.title, layout.phone && styles.titleSmall]}>{c.catalog.title[lang]}</Text>
      <Text style={styles.meta}>{c.catalog.intro[lang]}</Text>

      <Text style={styles.h2}>{c.catalog.chooseGrade[lang]}</Text>
      <View style={styles.chips} accessibilityRole="tablist">
        {GRADES.map((g) => (
          <Pressable key={g} onPress={() => setGrade(g)} accessibilityRole="tab" accessibilityState={{ selected: g === grade }} accessibilityLabel={c.catalog.gradeChip(g)[lang]} style={[styles.chip, g === grade && styles.chipOn]}>
            <Text style={[styles.chipText, g === grade && styles.chipTextOn]}>{c.catalog.gradeChip(g)[lang]}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.theme}>{c.catalog.gradeTheme[grade - 1][lang]}</Text>

      <View style={[styles.grid, wide && styles.gridWide]}>
        {units.map((u) => {
          const sessions = playable[u.id];
          const done = unitProgress(progress, u.id).sessionsDone.length;
          return (
            <View key={u.id} style={[styles.card, wide && styles.cardWide]}>
              <View style={styles.cardTop}>
                <View style={[styles.area, { backgroundColor: AREA_COLOR[u.area] }]}>
                  <Text style={styles.areaText}>{c.catalog.area[u.area][lang]}</Text>
                </View>
                {u.pilot ? <Text style={styles.star} accessibilityLabel="★">★</Text> : null}
              </View>
              <Text style={styles.unitTitle}>{u.title[lang]}</Text>
              <Text style={styles.question}>{u.question[lang]}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.meta}>{done ? c.catalog.sessionsDone(done, sessions)[lang] : ''}</Text>
                <Button label={(done ? c.catalog.open : c.catalog.play)[lang]} variant={done ? 'secondary' : 'primary'} onPress={() => onOpen(u.id)} />
              </View>
            </View>
          );
        })}
      </View>
      {units.length === 0 ? <Text style={styles.meta}>{c.catalog.emptyGrade[lang]}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { gap: 12, maxWidth: 1040, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1 },
  pill: { borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  pillText: { fontFamily: fontFamily.ui.black, fontSize: 16, color: '#ffffff' },
  meta: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.muted },
  title: { fontFamily: fontFamily.ui.black, fontSize: 40, color: colors.navy },
  titleSmall: { fontSize: 30 },
  h2: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.navy, marginTop: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 48, minWidth: 64, paddingHorizontal: 18, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: colors.line },
  chipOn: { backgroundColor: colors.subjCiencia, borderColor: colors.subjCiencia },
  chipText: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.ink },
  chipTextOn: { color: '#ffffff' },
  theme: { fontFamily: fontFamily.ui.extrabold, fontSize: 19, color: colors.subjCiencia },
  grid: { gap: 12 },
  gridWide: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 16, gap: 6, boxShadow: shadows.card, borderWidth: 2, borderColor: colors.line },
  cardWide: { width: '49%' },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  area: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4 },
  areaText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: '#ffffff' },
  star: { fontSize: 16, color: colors.gold },
  unitTitle: { fontFamily: fontFamily.ui.black, fontSize: 21, color: colors.ink },
  question: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8, minHeight: 56 },
});

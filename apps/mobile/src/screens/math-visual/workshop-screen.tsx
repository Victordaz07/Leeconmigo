import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buildVisualSession, exerciseAttempt, updateReviews } from '@lee-conmigo/math-content';
import { MATH_COPY, VISUAL_COPY, type MathLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, gradients, GradientView, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import type { MathProgress } from '../../app-state';
import { today } from '../../today';
import { VisualExercise } from './visual-exercise';

const EXERCISES = 6;

/**
 * Taller de Matemáticas: una tanda de ejercicios manipulables del grado (bandejas, grupos iguales, reparto). Cada
 * ejercicio terminado se guarda como intento para dominio y repaso, igual que los retos de las lecciones.
 */
export function WorkshopScreen({ lang, grade, progress, onExit }: { lang: MathLang; grade: number; progress: MathProgress; onExit: () => void }) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const session = useMemo(() => buildVisualSession(grade, Date.now() % 1_000_000, EXERCISES), [grade]);
  const [index, setIndex] = useState(0);
  const day = useMemo(today, []);
  const width = Math.min(layout.width - layout.gutter * 2, 1100);
  const finished = index >= session.length;
  // Cada ejercicio nuevo empieza arriba, con la consigna a la vista (si no, se quedaba donde terminó el anterior).
  const scroll = useRef<ScrollView>(null);
  useEffect(() => scroll.current?.scrollTo({ y: 0, animated: false }), [index]);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12, paddingHorizontal: layout.gutter }]}>
        <View style={styles.headerRow}>
          <RoundButton onPress={onExit} label="Volver">
            <ChevronLeftIcon />
          </RoundButton>
          <GradientView gradient={gradients.subjMate} style={styles.pill}>
            <Text style={styles.pillText}>½ {MATH_COPY.subject[lang]}</Text>
          </GradientView>
          <Text style={styles.title}>{VISUAL_COPY.workshop[lang]}</Text>
          <View style={styles.flex} />
          {!finished && <Text style={styles.meta}>{VISUAL_COPY.exerciseOf[lang](index + 1, session.length)}</Text>}
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${Math.round((Math.min(index, session.length) / session.length) * 100)}%` }]} />
        </View>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingBottom: insets.bottom + 24 }]}>
        <View style={{ width, alignSelf: 'center' }}>
          {finished ? (
            <View style={styles.doneCard}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.doneTitle}>{VISUAL_COPY.done[lang]}</Text>
              <Text style={styles.doneDetail}>{VISUAL_COPY.doneDetail[lang](session.length)}</Text>
              <Button label={MATH_COPY.closure.done[lang]} large onPress={onExit} />
            </View>
          ) : (
            <VisualExercise
              key={session[index].instanceId}
              instance={session[index]}
              lang={lang}
              width={width}
              onNext={(final) => {
                const a = exerciseAttempt(final, day);
                if (a) {
                  progress.attempts.push(a);
                  progress.reviews = updateReviews(progress.reviews, a);
                }
                setIndex(index + 1);
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { gap: 10, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: { borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 9 },
  pillText: { fontFamily: fontFamily.ui.black, fontSize: 15, color: '#ffffff' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  meta: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.muted },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.brand100, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4, backgroundColor: colors.subjMate },
  content: { paddingTop: 8 },
  doneCard: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 28, gap: 14, alignItems: 'center', boxShadow: shadows.card },
  star: { fontSize: 52 },
  doneTitle: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.navy, textAlign: 'center' },
  doneDetail: { fontFamily: fontFamily.ui.semibold, fontSize: 17, color: colors.inkSoft },
});

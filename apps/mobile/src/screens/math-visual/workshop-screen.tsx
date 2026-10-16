import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buildVisualSession, exerciseAttempt, familiesFor, updateReviews, type VisualFamily, type VisualInstance } from '@lee-conmigo/math-content';
import { columnsFor, itemWidth, MATH_COPY, TOPIC_COPY, VISUAL_COPY, type MathLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, gradients, GradientView, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import type { MathProgress } from '../../app-state';
import { TOPIC_ICONS } from '../../math-art';
import { today } from '../../today';
import { Mila } from './mila';
import { VisualExercise } from './visual-exercise';

const EXERCISES = 6;

const GRADES = [1, 2, 3, 4, 5, 6] as const;

/**
 * Taller de Matemáticas: elige grado (el sugerido es el nivel del niño; sin bloqueos, docs/13) y un tema, o una mezcla.
 * Cada tema es una de las 12 representaciones (docs/design/math-visual). Cada ejercicio terminado se guarda como intento
 * para dominio y repaso, igual que los retos de las lecciones.
 */
export function WorkshopScreen({ lang, grade: suggested, progress, onExit }: { lang: MathLang; grade: number; progress: MathProgress; onExit: () => void }) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [grade, setGrade] = useState(suggested);
  const [session, setSession] = useState<VisualInstance[] | null>(null);
  const [index, setIndex] = useState(0);
  const day = useMemo(today, []);
  const width = Math.min(layout.width - layout.gutter * 2, 1100);
  const finished = !!session && index >= session.length;
  const start = (family?: VisualFamily) => {
    setSession(buildVisualSession(grade, Date.now() % 1_000_000, EXERCISES, family));
    setIndex(0);
  };
  const topics = familiesFor(grade);
  const cols = columnsFor(width, layout.phone ? 150 : 190, 12, 4);
  const cardW = itemWidth(width, cols, 12);
  const es = lang === 'es';
  // Cada ejercicio nuevo empieza arriba, con la consigna a la vista (si no, se quedaba donde terminó el anterior).
  const scroll = useRef<ScrollView>(null);
  useEffect(() => scroll.current?.scrollTo({ y: 0, animated: false }), [index, session]);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12, paddingHorizontal: layout.gutter }]}>
        <View style={styles.headerRow}>
          <RoundButton onPress={session ? () => setSession(null) : onExit} label="Volver">
            <ChevronLeftIcon />
          </RoundButton>
          <GradientView gradient={gradients.subjMate} style={styles.pill}>
            <Text style={styles.pillText}>½ {MATH_COPY.subject[lang]}</Text>
          </GradientView>
          <Text style={styles.title}>{VISUAL_COPY.workshop[lang]}</Text>
          <View style={styles.flex} />
          {session && !finished && <Text style={styles.meta}>{VISUAL_COPY.exerciseOf[lang](index + 1, session.length)}</Text>}
        </View>
        {session && (
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${Math.round((Math.min(index, session.length) / session.length) * 100)}%` }]} />
          </View>
        )}
      </View>
      <ScrollView ref={scroll} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingBottom: insets.bottom + 24 }]}>
        <View style={{ width, alignSelf: 'center' }}>
          {!session ? (
            <View style={{ gap: 18 }}>
              <View style={styles.menuHead}>
                <Mila pose="saluda" height={layout.phone ? 100 : 130} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.menuTitle}>{VISUAL_COPY.workshopTitle[lang]}</Text>
                  <Text style={styles.menuText}>{es ? '¿Qué quieres practicar hoy?' : 'What do you want to practice today?'}</Text>
                </View>
              </View>
              <View style={styles.grades}>
                <Text style={styles.gradeLabel}>{es ? 'Grado' : 'Grade'}</Text>
                {GRADES.map((g) => (
                  <Pressable key={g} onPress={() => setGrade(g)} accessibilityRole="radio" accessibilityState={{ selected: g === grade }} style={[styles.grade, g === grade && styles.gradeOn]}>
                    <Text style={[styles.gradeText, g === grade && styles.gradeTextOn]}>
                      {g}.º{g === suggested ? ' ⭐' : ''}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable onPress={() => start()} accessibilityRole="button" style={({ pressed }) => [styles.mix, pressed && styles.pressed]}>
                <Text style={styles.mixTitle}>🎲 {es ? 'Mezcla del día' : 'Today’s mix'}</Text>
                <Text style={styles.mixText}>{es ? `${EXERCISES} ejercicios de varios temas de ${grade}.º` : `${EXERCISES} exercises from different grade ${grade} topics`}</Text>
              </Pressable>
              <View style={[styles.topics, { gap: 12 }]}>
                {topics.map((f) => (
                  <Pressable key={f} onPress={() => start(f)} accessibilityRole="button" accessibilityLabel={TOPIC_COPY[f][lang]} style={({ pressed }) => [styles.topic, { width: cardW }, pressed && styles.pressed]}>
                    <Image source={TOPIC_ICONS[f]} style={styles.topicIcon} resizeMode="contain" accessible={false} />
                    <Text style={styles.topicText} numberOfLines={2}>
                      {TOPIC_COPY[f][lang]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : finished ? (
            <View style={styles.doneCard}>
              <Mila pose="celebra" height={layout.phone ? 150 : 200} />
              <Text style={styles.doneTitle}>{VISUAL_COPY.done[lang]}</Text>
              <Text style={styles.doneDetail}>{VISUAL_COPY.doneDetail[lang](session.length)}</Text>
              <Button label={es ? 'Elegir otro tema' : 'Pick another topic'} variant="secondary" onPress={() => setSession(null)} />
              <Button label={MATH_COPY.closure.done[lang]} large onPress={onExit} />
            </View>
          ) : (
            <VisualExercise
              key={session![index].instanceId}
              instance={session![index]}
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
  pressed: { transform: [{ scale: 0.97 }] },
  menuHead: { flexDirection: 'row', alignItems: 'flex-end', gap: 14 },
  menuTitle: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.navy },
  menuText: { fontFamily: fontFamily.ui.semibold, fontSize: 17, color: colors.inkSoft },
  grades: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  gradeLabel: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.muted, marginRight: 4 },
  grade: { minWidth: 52, height: 44, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: '#ffffff', borderWidth: 2, borderColor: colors.brand100, alignItems: 'center', justifyContent: 'center' },
  gradeOn: { backgroundColor: colors.subjMate, borderColor: colors.subjMate },
  gradeText: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.navy },
  gradeTextOn: { color: '#ffffff' },
  mix: { backgroundColor: colors.subjMate, borderRadius: radius.card, padding: 18, gap: 4, boxShadow: shadows.card },
  mixTitle: { fontFamily: fontFamily.ui.black, fontSize: 21, color: '#ffffff' },
  mixText: { fontFamily: fontFamily.ui.semibold, fontSize: 15, color: '#ffffff' },
  topics: { flexDirection: 'row', flexWrap: 'wrap' },
  topic: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 14, gap: 8, alignItems: 'center', boxShadow: shadows.card, minHeight: 130, justifyContent: 'center' },
  topicIcon: { width: 64, height: 64 },
  topicText: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.navy, textAlign: 'center' },
  doneCard: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 28, gap: 14, alignItems: 'center', boxShadow: shadows.card },
  doneTitle: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.navy, textAlign: 'center' },
  doneDetail: { fontFamily: fontFamily.ui.semibold, fontSize: 17, color: colors.inkSoft },
});

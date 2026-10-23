import { useTranslation } from '@lee-conmigo/ui-native';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MathUnit } from '@lee-conmigo/contracts';
import { skillStatus } from '@lee-conmigo/math-content';
import { MATH_COPY, VISUAL_COPY, type MathLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, gradients, GradientView, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import type { MathProgress } from '../app-state';
import { KITE, MATH_COVERS } from '../math-art';

interface MathNotebookScreenProps {
  lang: MathLang;
  unit: MathUnit;
  progress: MathProgress;
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenWorkshop: () => void;
}

/**
 * Cuaderno de Matemáticas abierto (Kitewise B4/B5): la unidad como un camino de lecciones (hechas ✓, la sugerida con la
 * estrella "¡Estás aquí!") y cómo va cada habilidad (explorando / practicando / dominado, nunca porcentajes). Sin bloqueos:
 * todo abre; lo sugerido se destaca (docs/13). Los estándares NO se muestran al niño (solo a padres, en borrador).
 */
export function MathNotebookScreen({ lang, unit, progress, onBack, onOpenLesson, onOpenWorkshop }: MathNotebookScreenProps) {
  const { t: ui } = useTranslation();

  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = MATH_COPY;
  const lessons = unit.lessons;
  const next = lessons.find((l) => !progress.lessonsDone.has(l.id)) ?? lessons[0];
  const allDone = lessons.every((l) => progress.lessonsDone.has(l.id));
  const vertical = layout.narrow || layout.portrait;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={ui("Volver")}>
          <ChevronLeftIcon />
        </RoundButton>
        <GradientView gradient={gradients.subjMate} style={styles.pill}>
          <Text style={styles.pillText}>½ {t.subject[lang]}</Text>
        </GradientView>
        <View style={styles.flex} />
        <Text style={styles.meta}>{ui("Nivel") + " "}{unit.practiceLevel}</Text>
      </View>
      <View style={[styles.banner, { height: layout.phone ? 150 : 220 }]}>
        <Image source={MATH_COVERS.g3u1} style={styles.bannerImage} resizeMode="cover" accessible={false} />
      </View>
      <Text style={styles.kicker}>{t.notebook.unit[lang].toUpperCase()} 1</Text>
      <Text style={[styles.title, layout.phone && styles.titleSmall]}>{unit.title[lang]}</Text>

      <View style={[styles.path, vertical && styles.pathVertical]}>
        {lessons.map((l, i) => {
          const done = progress.lessonsDone.has(l.id);
          const here = l.id === next.id && !allDone;
          return (
            <View key={l.id} style={[styles.stop, vertical && styles.stopVertical, { zIndex: lessons.length - i }]}>
              {i > 0 && <View style={[vertical ? styles.connectorV : styles.connectorH, progress.lessonsDone.has(lessons[i - 1].id) && styles.connectorDone]} />}
              <View style={[styles.nodeWrap, vertical && styles.nodeWrapVertical]}>
                {here && !vertical && <Here label={t.notebook.youAreHere[lang]} />}
                <Button label={done ? '✓' : String(i + 1)} variant={here ? 'primary' : 'secondary'} onPress={() => onOpenLesson(l.id)} />
                <Text style={[styles.stopTitle, vertical && styles.stopTitleVertical]} numberOfLines={2}>
                  {l.title[lang]}
                </Text>
                {here && vertical && <Here label={t.notebook.youAreHere[lang]} vertical />}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.cta}>
        <Button label={(allDone ? t.notebook.again : t.notebook.start)[lang](next.title[lang])} large onPress={() => onOpenLesson(next.id)} />
      </View>

      <View style={[styles.workshop, layout.phone && styles.workshopStack]}>
        <View style={styles.flex}>
          <Text style={styles.workshopTitle}>🧺 {VISUAL_COPY.workshopTitle[lang]}</Text>
          <Text style={styles.workshopText}>{VISUAL_COPY.workshopSubtitle[lang]}</Text>
        </View>
        <Button label={`${VISUAL_COPY.workshop[lang]} ›`} variant="secondary" onPress={onOpenWorkshop} />
      </View>

      <View style={styles.card}>
        {unit.skills.map((s) => {
          const st = skillStatus(progress.attempts.filter((a) => a.skillId === s.id)).mastery;
          return (
            <View key={s.id} style={styles.skill}>
              <Text style={styles.skillTitle}>{s.title[lang]}</Text>
              <Text style={[styles.mastery, styles[`m_${st}`]]}>{t.notebook.mastery[lang][st]}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

/** "¡Estás aquí!" con el papalote de Kitewise. */
function Here({ label, vertical }: { label: string; vertical?: boolean }) {
  return (
    <View style={[styles.hereRow, vertical ? styles.hereVertical : styles.here]}>
      <Image source={KITE} style={styles.kite} resizeMode="contain" accessible={false} />
      <Text style={styles.hereText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: { borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 9 },
  pillText: { fontFamily: fontFamily.ui.black, fontSize: 15, color: '#ffffff' },
  meta: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.muted },
  kicker: { fontFamily: fontFamily.ui.black, fontSize: 14, letterSpacing: 1, color: colors.subjMate },
  title: { fontFamily: fontFamily.ui.black, fontSize: 38, color: colors.navy },
  titleSmall: { fontSize: 28 },
  path: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12 },
  pathVertical: { flexDirection: 'column', alignItems: 'stretch', paddingVertical: 0 },
  stop: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  stopVertical: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', flexDirection: 'column', alignItems: 'stretch' },
  nodeWrap: { flex: 1, alignItems: 'center', gap: 8, paddingTop: 26, zIndex: 1 },
  nodeWrapVertical: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 0 },
  connectorH: { position: 'absolute', zIndex: 0, left: '-50%', right: '50%', top: 50, height: 8, borderRadius: 4, backgroundColor: colors.brand100 },
  connectorV: { width: 8, height: 22, marginLeft: 26, borderRadius: 4, backgroundColor: colors.brand100 },
  connectorDone: { backgroundColor: colors.ok },
  here: { position: 'absolute', top: -6 },
  hereRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hereText: { fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.navy },
  kite: { width: 26, height: 26 },
  banner: { borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.brand50 },
  bannerImage: { width: '100%', height: '100%' },
  hereVertical: { position: 'relative' },
  stopTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink, textAlign: 'center', maxWidth: 170 },
  stopTitleVertical: { textAlign: 'left', flex: 1, maxWidth: undefined },
  cta: { alignItems: 'center' },
  workshop: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.brand50, borderRadius: radius.card, padding: 18 },
  workshopStack: { flexDirection: 'column', alignItems: 'stretch' },
  workshopTitle: { fontFamily: fontFamily.ui.black, fontSize: 19, color: colors.navy },
  workshopText: { fontFamily: fontFamily.ui.semibold, fontSize: 15, color: colors.inkSoft, marginTop: 2 },
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 18, gap: 10, boxShadow: shadows.card },
  skill: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  skillTitle: { flex: 1, fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.inkSoft },
  mastery: { fontFamily: fontFamily.ui.black, fontSize: 13, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5, overflow: 'hidden' },
  m_none: { color: colors.muted, backgroundColor: colors.chip },
  m_explorando: { color: colors.masteryExplorando, backgroundColor: colors.masteryExplorandoBg },
  m_practicando: { color: colors.masteryPracticando, backgroundColor: colors.masteryPracticandoBg },
  m_dominado: { color: colors.masteryDominado, backgroundColor: colors.masteryDominadoBg },
});

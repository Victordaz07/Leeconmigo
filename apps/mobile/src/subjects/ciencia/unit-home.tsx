import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { nextSession, STAGE_LABEL, statusByIdea, type EvidenceAttempt, type ScienceUnit, type UnitProgress } from '@lee-conmigo/science-content';
import { CIENCIA_COPY, type CienciaLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, gradients, GradientView, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { CIENCIA_COVERS } from './art';

interface UnitHomeProps {
  unit: ScienceUnit;
  lang: CienciaLang;
  progress: UnitProgress;
  attempts: EvidenceAttempt[];
  /** Minutos de la misión de hoy. */
  minutes: number;
  onBack: () => void;
  onOpenSession: (sessionId: string) => void;
}

/**
 * El cuaderno de Ciencia abierto en su unidad (Kitewise B4): la gran pregunta, las 6 sesiones (todas abren; la que sigue se
 * destaca), cómo va cada idea (explorando · practicando · lo explico, nunca porcentajes), las explicaciones guardadas y las
 * palabras de ciencia. Los estándares NO se muestran al niño (solo a padres, y como borrador: docs/13).
 */
export function UnitHome({ unit, lang, progress, attempts, minutes, onBack, onOpenSession }: UnitHomeProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const c = CIENCIA_COPY;
  const next = nextSession(unit, progress);
  const status = statusByIdea(attempts);
  const resume = progress.resume;
  const cta = resume ? c.screen.resume[lang] : next ? (progress.sessionsDone.length ? c.screen.pickUp : c.screen.begin)[lang] : c.screen.review[lang];
  const ctaSession = resume?.sessionId ?? next?.id ?? unit.sessions[0].id;
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
        <Text style={styles.meta}>{c.screen.minutesEach[lang]}</Text>
      </View>
      <View style={[styles.banner, { height: layout.phone ? 150 : 220 }]}>
        <Image source={CIENCIA_COVERS.c4u06} style={styles.bannerImage} resizeMode="cover" accessible={false} />
      </View>
      <Text style={styles.kicker}>{c.screen.unit[lang].toUpperCase()}</Text>
      <Text style={[styles.title, layout.phone && styles.titleSmall]}>{unit.title[lang]}</Text>
      <View style={styles.question}>
        <Text style={styles.questionKicker}>{c.screen.questionLabel[lang]}</Text>
        <Text style={styles.questionText}>{unit.question[lang]}</Text>
      </View>

      <Text style={styles.h2}>{c.screen.sessionsHeading[lang]}</Text>
      <Text style={styles.meta}>{c.screen.ofTotal(progress.sessionsDone.length, unit.sessions.length)[lang]}</Text>
      <View style={[styles.sessions, wide && styles.sessionsWide]}>
        {unit.sessions.map((s, i) => {
          const done = progress.sessionsDone.includes(s.id);
          const here = s.id === ctaSession && !done;
          return (
            <View key={s.id} style={[styles.session, wide && styles.sessionWide, here && styles.sessionHere]}>
              <View style={[styles.num, done && styles.numDone]}>
                <Text style={[styles.numText, done && styles.numTextDone]}>{done ? '✓' : i + 1}</Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.sessionTitle}>{s.title[lang]}</Text>
                <Text style={styles.sessionText}>{s.objective[lang]}</Text>
                <Text style={styles.sessionState}>{done ? c.notebook.done[lang] : here ? c.notebook.current[lang] : c.notebook.todo[lang]}</Text>
              </View>
              <Button label={done ? c.screen.review[lang] : here && resume ? c.screen.resume[lang] : c.screen.begin[lang]} variant={here ? 'primary' : 'secondary'} onPress={() => onOpenSession(s.id)} />
            </View>
          );
        })}
      </View>
      <View style={styles.cta}>
        <Button label={cta} large onPress={() => onOpenSession(ctaSession)} />
        {!next && !resume ? <Text style={styles.meta}>{c.notebook.allDone[lang]}</Text> : null}
        <Text style={styles.meta}>{`${c.notebook.nextUp[lang]}: ${(unit.sessions.find((s) => s.id === ctaSession) ?? unit.sessions[0]).title[lang]} · ${minutes ? `${minutes} min` : c.notebook.minutes[lang]}`}</Text>
      </View>

      <Text style={styles.h2}>{c.screen.stageHeading[lang]}</Text>
      <View style={styles.list}>
        {unit.ideas.map((idea) => {
          const st = status[idea.id]?.stage ?? 'none';
          return (
            <View key={idea.id} style={styles.idea}>
              <Text style={styles.ideaText}>{idea.text[lang]}</Text>
              <View style={[styles.stage, st === 'practicando' && styles.stagePracticando, st === 'loExplico' && styles.stageDone]}>
                <Text style={styles.stageText}>{st === 'none' ? c.notebook.todo[lang] : STAGE_LABEL[st][lang]}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <Text style={styles.h2}>{c.screen.notebookHeading[lang]}</Text>
      {progress.notebook.length === 0 ? (
        <Text style={styles.meta}>{c.notebook.entriesEmpty[lang]}</Text>
      ) : (
        <View style={styles.list}>
          {progress.notebook.map((e) => {
            const t = unit.tasks.find((x) => x.id === e.taskId);
            if (!t) return null;
            return (
              <View key={e.taskId} style={styles.entry}>
                {t.parts.map((p) => {
                  const texts = (e.picks[p.id] ?? []).map((id) => p.options.find((o) => o.id === id)?.text[lang]).filter(Boolean);
                  return texts.length ? (
                    <Text key={p.id} style={styles.entryText}>
                      <Text style={styles.entryKicker}>{`${p.prompt[lang]} `}</Text>
                      {texts.join(' · ')}
                    </Text>
                  ) : null;
                })}
              </View>
            );
          })}
        </View>
      )}

      <Text style={styles.h2}>{c.screen.wordsHeading[lang]}</Text>
      <View style={styles.list}>
        {unit.glossary.map((g) => (
          <View key={g.es} style={styles.entry}>
            <Text style={styles.entryKicker}>{lang === 'es' ? g.es : g.en}</Text>
            <Text style={styles.entryText}>{g.note[lang]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.safety}>
        <Text style={styles.h3}>{c.screen.safetyTitle[lang]}</Text>
        <Text style={styles.entryText}>{c.screen.safetyBody[lang]}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { gap: 14, maxWidth: 1040, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1 },
  pill: { borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  pillText: { fontFamily: fontFamily.ui.black, fontSize: 16, color: '#ffffff' },
  meta: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.muted },
  banner: { borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.chip },
  bannerImage: { width: '100%', height: '100%' },
  kicker: { fontFamily: fontFamily.ui.black, fontSize: 14, color: colors.subjCiencia, letterSpacing: 1 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 40, color: colors.navy },
  titleSmall: { fontSize: 30 },
  question: { backgroundColor: colors.focusTint, borderRadius: radius.tile, padding: 16, gap: 4 },
  questionKicker: { fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.orangeDeep, textTransform: 'uppercase' },
  questionText: { fontFamily: fontFamily.ui.extrabold, fontSize: 21, lineHeight: 29, color: colors.ink },
  h2: { fontFamily: fontFamily.ui.black, fontSize: 24, color: colors.navy, marginTop: 10 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  sessions: { gap: 10 },
  sessionsWide: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  session: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, boxShadow: shadows.soft, borderWidth: 2, borderColor: colors.line },
  sessionWide: { width: '49%' },
  sessionHere: { borderColor: colors.subjCiencia, backgroundColor: colors.okTint },
  num: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  numDone: { backgroundColor: colors.ok },
  numText: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  numTextDone: { color: '#ffffff' },
  sessionTitle: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.ink },
  sessionText: { fontFamily: fontFamily.ui.bold, fontSize: 14, lineHeight: 19, color: colors.inkSoft },
  sessionState: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.muted, marginTop: 2 },
  cta: { gap: 8, alignItems: 'flex-start' },
  list: { gap: 10 },
  idea: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, boxShadow: shadows.soft },
  ideaText: { flex: 1, fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  stage: { backgroundColor: colors.masteryExplorandoBg, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  stagePracticando: { backgroundColor: colors.masteryPracticandoBg },
  stageDone: { backgroundColor: colors.masteryDominadoBg },
  stageText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.ink },
  entry: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, gap: 3, boxShadow: shadows.soft },
  entryKicker: { fontFamily: fontFamily.ui.black, fontSize: 15, color: colors.navy },
  entryText: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  safety: { backgroundColor: colors.violet100, borderRadius: radius.tile, padding: 16, gap: 4, marginTop: 8 },
});

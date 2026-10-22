import { useReducer, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FocusSupports } from '@lee-conmigo/contracts';
import {
  canAdvance, evaluateSession, explainFeedback, initialSession, missingKey, missionStars, reasonKey, sessionReducer, triedNeeded,
  type LifeMission, type LifeStep,
} from '@lee-conmigo/life-content';
import { VIDA_COPY, type FocusSelfReport, type VidaLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, ClosingCard, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { STAR_IMAGES } from '../../kitewise-art';
import { useMovementBreak } from '../../movement';
import { notebookSaverFor } from '../../notebook-save';
import { MovementBreakScreen } from '../../screens/movement-break-screen';
import type { VidaArt } from './art';
import { ChooseBody, SortBody, SpotBody } from './bodies';
import { Card, Choices, Frame, Hint, SectionTitle } from './parts';

export interface MissionProgress {
  stepsDone: string[];
  stars: 0 | 1 | 2 | 3;
}

interface PlayerProps {
  lang: VidaLang;
  mission: LifeMission;
  accent: string;
  art: VidaArt;
  profileId: string;
  profileName: string;
  focus: FocusSupports;
  onExit: () => void;
  onFinish: (progress: MissionProgress, selfReport?: FocusSelfReport) => void;
}

const t = VIDA_COPY;

/**
 * Una misión de «Para la vida» encuentro por encuentro. Nunca «incorrecto» (docs/06): lo que no encaja da una pista y se puede cambiar; solo FALTA algo bloquea seguir.
 * Estrellas por esfuerzo (D11). Modo Enfoque: pausa de movimiento como en las demás materias.
 */
export function VidaPlayer({ lang, mission, accent, art, profileId, profileName, focus, onExit, onFinish }: PlayerProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [session, dispatch] = useReducer(sessionReducer, initialSession);
  const [showExample, setShowExample] = useState(false);
  const movement = useMovementBreak(focus.movementBreaks, profileId);

  const step = mission.steps[session.stepIndex]!;
  const total = mission.steps.length;
  const canGo = canAdvance(step, session);
  const last = session.stepIndex === total - 1;

  if (movement.due) return <MovementBreakScreen n={movement.count} lang={lang} onDone={() => movement.taken()} />;

  if (last && canGo && session.stepsDone.includes(step.id)) {
    const ev = evaluateSession(mission, session);
    const stars = missionStars(ev);
    const tried = Object.values(session.choose).reduce((n, c) => n + c.tried.length, 0);
    return (
      <ClosingCard
        starImages={STAR_IMAGES}
        notebook={notebookSaverFor(profileId, 'otra', lang)}
        name={profileName}
        stars={stars}
        reason={t.closing.reason[reasonKey(ev)][lang]}
        stats={[
          { label: t.closing.meetings[lang], value: `${session.stepsDone.length}/${total}` },
          { label: t.closing.paths[lang], value: String(tried) },
        ]}
        onAgain={() => onFinish({ stepsDone: session.stepsDone, stars }, undefined)}
        onDone={(selfReport) => onFinish({ stepsDone: session.stepsDone, stars }, selfReport)}
      />
    );
  }

  const mk = missingKey(step, session);
  const missingText = mk === 'choose' && step.kind === 'choose' ? t.missing.choose[lang](triedNeeded(step)) : mk === 'explain' ? t.missing.explain[lang] : mk === 'sort' ? t.missing.sort[lang] : t.missing.spot[lang];
  const explainFb = explainFeedback(step.explain.preferredChoiceIds, session.explain[step.id]);
  const pad = { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter };

  return (
    <ScrollView key={step.id} style={styles.screen} contentContainerStyle={[styles.content, pad]}>
      <View style={styles.header}>
        <RoundButton onPress={onExit} label={t.button.back[lang]}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={styles.stepOf}>{t.stepOf[lang](session.stepIndex + 1, total)}</Text>
      </View>

      <Text style={styles.title} accessibilityRole="header">{step.title[lang]}</Text>
      {session.stepIndex === 0 && <Text style={styles.safety}>{mission.safety[lang]}</Text>}

      {/* Modo Enfoque: con `reducedMotion` no hay dibujos alrededor del ejercicio (el contenido no cambia). */}
      {!focus.reducedMotion && <Frame source={art.scenes[Math.min(session.stepIndex, 2)]!} radiusPx={radius.card} />}

      <Card tone="soft" accent={accent}>
        <SectionTitle accent={accent}>{t.learn[lang]}</SectionTitle>
        <Text style={styles.learn}>{step.learn[lang]}</Text>
        <Button label={showExample ? `▾ ${t.example[lang]}` : `▸ ${t.example[lang]}`} variant="secondary" onPress={() => setShowExample((v) => !v)} />
        {showExample && <Text style={styles.example}>{step.example[lang]}</Text>}
      </Card>

      <View style={styles.guideRow}>
        {!focus.reducedMotion && <Image source={art.guide} style={styles.guide} resizeMode="contain" accessible={false} />}
        <View style={[styles.bubble, styles.bubbleFlex]}>
          <Text style={styles.prompt}>{step.prompt[lang]}</Text>
        </View>
      </View>

      <StepBody step={step} lang={lang} session={session} dispatch={dispatch} accent={accent} />

      <Card>
        <SectionTitle accent={accent}>{t.explainTitle[lang]}</SectionTitle>
        <Text style={styles.prompt}>{step.explain.prompt[lang]}</Text>
        <Choices accent={accent} items={step.explain.choices.map((c) => ({ id: c.id, text: c.text[lang] }))} selectedId={session.explain[step.id]} onSelect={(choiceId) => dispatch({ type: 'explain', stepId: step.id, choiceId })} />
        {explainFb && <Hint kind={explainFb}>{t.feedback[explainFb][lang]}</Hint>}
      </Card>

      {last && (
        <Card tone="warm">
          <SectionTitle accent={accent}>{t.offScreenTitle[lang]}</SectionTitle>
          <Text style={styles.learn}>{mission.offScreen[lang]}</Text>
        </Card>
      )}

      {session.helpAsked && <Hint kind="info">{t.helpNote[lang]}</Hint>}

      <View style={styles.footer}>
        {session.stepIndex > 0 && <Button label={`‹ ${t.button.prev[lang]}`} variant="secondary" onPress={() => dispatch({ type: 'back' })} />}
        <Button label={t.button.askHelp[lang]} variant="secondary" onPress={() => dispatch({ type: 'help' })} />
        <Button label={`${t.button.next[lang]} ›`} onPress={() => dispatch({ type: 'next', mission })} disabled={!canGo} large />
      </View>
      {!canGo && <Text style={styles.missing}>{missingText}</Text>}
    </ScrollView>
  );
}

function StepBody({ step, lang, session, dispatch, accent }: { step: LifeStep; lang: VidaLang; session: Parameters<typeof canAdvance>[1]; dispatch: Parameters<typeof ChooseBody>[0]['dispatch']; accent: string }) {
  switch (step.kind) {
    case 'choose':
      return <ChooseBody step={step} lang={lang} session={session} dispatch={dispatch} accent={accent} />;
    case 'sort':
      return <SortBody step={step} lang={lang} session={session} dispatch={dispatch} accent={accent} />;
    case 'spot':
      return <SpotBody step={step} lang={lang} session={session} dispatch={dispatch} accent={accent} />;
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { gap: 16, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepOf: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.muted },
  title: { fontFamily: fontFamily.ui.black, fontSize: 28, color: colors.navy },
  safety: { fontFamily: fontFamily.ui.bold, fontSize: 14, lineHeight: 20, color: colors.muted },
  learn: { fontFamily: fontFamily.read.regular, fontSize: 17, lineHeight: 25, color: colors.ink },
  example: { fontFamily: fontFamily.read.regular, fontSize: 16, lineHeight: 24, color: colors.inkSoft, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 12 },
  guideRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  guide: { width: 84, height: 84 },
  bubbleFlex: { flex: 1 },
  bubble: { backgroundColor: '#ffffff', borderRadius: radius.tile, paddingHorizontal: 16, paddingVertical: 12, boxShadow: shadows.chip },
  prompt: { fontFamily: fontFamily.ui.extrabold, fontSize: 17, lineHeight: 23, color: colors.ink },
  footer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 4 },
  missing: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
});

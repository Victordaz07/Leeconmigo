import { useReducer, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FocusSupports } from '@lee-conmigo/contracts';
import {
  canAdvance, evaluateSession, feedbackFor, initialSession, reasonKey, sessionReducer, unitStars,
  type FinanceStep, type FinanceUnit,
} from '@lee-conmigo/finance-content';
import { FINANZAS_COPY, type FinanzasLang, type FocusSelfReport } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, ClosingCard, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { STAR_IMAGES } from '../../kitewise-art';
import { useMovementBreak } from '../../movement';
import { notebookSaverFor } from '../../notebook-save';
import { MovementBreakScreen } from '../../screens/movement-break-screen';
import { AlternativesBody, LedgerBody, OfferBody, PrioritiesBody, ProjectBody, ReserveBody } from './bodies';
import { Card, Choices, Hint, SectionTitle } from './parts';

export interface UnitProgress {
  stepsDone: string[];
  stars: 0 | 1 | 2 | 3;
}

interface PlayerProps {
  lang: FinanzasLang;
  unit: FinanceUnit;
  profileId: string;
  profileName: string;
  focus: FocusSupports;
  onExit: () => void;
  onFinish: (progress: UnitProgress, selfReport?: FocusSelfReport) => void;
}

const t = FINANZAS_COPY;

/**
 * Una unidad de Finanzas encuentro por encuentro. Nunca «incorrecto» (docs/06): lo que no encaja da una pista y se puede cambiar; solo FALTA algo
 * bloquea seguir. Estrellas por esfuerzo (D11). Modo Enfoque: pausa de movimiento como en las demás materias.
 */
export function FinanzasPlayer({ lang, unit, profileId, profileName, focus, onExit, onFinish }: PlayerProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [session, dispatch] = useReducer(sessionReducer, initialSession);
  const [showExample, setShowExample] = useState(false);
  const movement = useMovementBreak(focus.movementBreaks, profileId);

  const step = unit.steps[session.stepIndex]!;
  const total = unit.steps.length;
  const canGo = canAdvance(step, session);
  const last = session.stepIndex === total - 1;

  if (movement.due) return <MovementBreakScreen n={movement.count} lang={lang} onDone={() => movement.taken()} />;

  if (last && canGo && session.stepsDone.includes(step.id)) {
    const ev = evaluateSession(unit, session);
    const stars = unitStars(ev);
    return (
      <ClosingCard
        starImages={STAR_IMAGES}
        notebook={notebookSaverFor(profileId, 'finanzas', lang)}
        name={profileName}
        stars={stars}
        reason={t.closing.reason[reasonKey(ev)][lang]}
        stats={[
          { label: t.closing.meetings[lang], value: `${session.stepsDone.length}/${total}` },
          { label: t.closing.plan[lang], value: ev.adjusted ? t.closing.yes[lang] : t.closing.notYet[lang] },
        ]}
        onAgain={() => onFinish({ stepsDone: session.stepsDone, stars }, undefined)}
        onDone={(selfReport) => onFinish({ stepsDone: session.stepsDone, stars }, selfReport)}
      />
    );
  }

  const missingKey = session.explain[step.id] === undefined && stepReady(step, session) ? 'explain' : step.kind;
  const explainFb = feedbackFor(step.explain.preferredChoiceIds, session.explain[step.id]);
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
      <Text style={styles.pretend}>{t.pretend[lang]}</Text>

      <Card tone="teal">
        <SectionTitle>{t.learn[lang]}</SectionTitle>
        <Text style={styles.learn}>{step.learn[lang]}</Text>
        <Button label={showExample ? `▾ ${t.example[lang]}` : `▸ ${t.example[lang]}`} variant="secondary" onPress={() => setShowExample((v) => !v)} />
        {showExample && <Text style={styles.example}>{step.example[lang]}</Text>}
      </Card>

      <View style={styles.bubble}>
        <Text style={styles.prompt}>{step.prompt[lang]}</Text>
      </View>

      <StepBody step={step} lang={lang} session={session} dispatch={dispatch} />

      <Card>
        <SectionTitle>{t.explainTitle[lang]}</SectionTitle>
        <Text style={styles.prompt}>{step.explain.prompt[lang]}</Text>
        <Choices items={step.explain.choices.map((c) => ({ id: c.id, text: c.text[lang] }))} selectedId={session.explain[step.id]} onSelect={(choiceId) => dispatch({ type: 'explain', stepId: step.id, choiceId })} />
        {explainFb && <Hint kind={explainFb}>{t.feedback[explainFb][lang]}</Hint>}
      </Card>

      {session.helpAsked && <Hint kind="info">{t.helpNote[lang]}</Hint>}

      <View style={styles.footer}>
        {session.stepIndex > 0 && <Button label={`‹ ${t.button.prev[lang]}`} variant="secondary" onPress={() => dispatch({ type: 'back' })} />}
        <Button label={t.button.askHelp[lang]} variant="secondary" onPress={() => dispatch({ type: 'help' })} />
        <Button label={`${t.button.next[lang]} ›`} onPress={() => dispatch({ type: 'next', unit })} disabled={!canGo} large />
      </View>
      {!canGo && <Text style={styles.missing}>{t.missing[missingKey][lang]}</Text>}
    </ScrollView>
  );
}

/** ¿Ya hizo lo propio del paso (todo menos explicar)? Para decir qué falta de verdad. */
function stepReady(step: FinanceStep, s: Parameters<typeof canAdvance>[1]): boolean {
  return canAdvance(step, { ...s, explain: { ...s.explain, [step.id]: step.explain.choices[0]!.id } });
}

function StepBody({ step, lang, session, dispatch }: { step: FinanceStep; lang: FinanzasLang; session: Parameters<typeof canAdvance>[1]; dispatch: Parameters<typeof AlternativesBody>[0]['dispatch'] }) {
  switch (step.kind) {
    case 'priorities':
      return <PrioritiesBody step={step} lang={lang} session={session} dispatch={dispatch} />;
    case 'alternatives':
      return <AlternativesBody step={step} lang={lang} session={session} dispatch={dispatch} />;
    case 'ledger':
      return <LedgerBody step={step} lang={lang} session={session} dispatch={dispatch} />;
    case 'reserve':
      return <ReserveBody step={step} lang={lang} session={session} dispatch={dispatch} />;
    case 'offer':
      return <OfferBody step={step} lang={lang} session={session} dispatch={dispatch} />;
    case 'project':
      return <ProjectBody step={step} lang={lang} session={session} dispatch={dispatch} />;
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { gap: 16, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepOf: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.muted },
  title: { fontFamily: fontFamily.ui.black, fontSize: 28, color: colors.navy },
  pretend: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted },
  learn: { fontFamily: fontFamily.read.regular, fontSize: 17, lineHeight: 25, color: colors.ink },
  example: { fontFamily: fontFamily.read.regular, fontSize: 16, lineHeight: 24, color: colors.inkSoft, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 12 },
  bubble: { backgroundColor: '#ffffff', borderRadius: radius.tile, paddingHorizontal: 16, paddingVertical: 12, boxShadow: shadows.chip },
  prompt: { fontFamily: fontFamily.ui.extrabold, fontSize: 17, lineHeight: 23, color: colors.ink },
  footer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 4 },
  missing: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
});

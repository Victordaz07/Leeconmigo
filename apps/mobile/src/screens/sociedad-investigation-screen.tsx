import { useReducer, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FocusSupports, SocialSource, SocialStep, SocialUnit } from '@lee-conmigo/contracts';
import {
  canAdvance,
  evaluateSession,
  feedbackFor,
  initialSession,
  investigationReasonKey,
  investigationStars,
  sessionReducer,
  type SessionState,
} from '@lee-conmigo/social-content';
import { SOCIAL_COPY, type FocusSelfReport, type SocialLang } from '@lee-conmigo/ui-core';
import {
  Button,
  ChevronLeftIcon,
  ChoiceList,
  ClosingCard,
  colors,
  fontFamily,
  MapCompare,
  radius,
  RoundButton,
  shadows,
  SourceCard,
  StatementRow,
  Teo,
  teoPoseFor,
  useLayout,
  type SourceCardData,
} from '@lee-conmigo/ui-native';
import { resolveSocialArt, TEO } from '../sociedad-art';
import { closingStatsFor } from '../sociedad-closing';
import { useMovementBreak } from '../movement';
import { MovementBreakScreen } from './movement-break-screen';
import type { UnitProgress } from './sociedad-notebook-screen';

interface SociedadInvestigationScreenProps {
  lang: SocialLang;
  unit: SocialUnit;
  profileId: string;
  profileName: string;
  focus: FocusSupports;
  onExit: () => void;
  onFinish: (progress: UnitProgress, selfReport?: FocusSelfReport) => void;
}

function sourceCardData(source: SocialSource, lang: SocialLang): SourceCardData {
  return {
    id: source.id,
    kindLabel: SOCIAL_COPY.sourceKind[source.kind][lang],
    title: source.title[lang],
    caption: source.caption[lang],
    source: resolveSocialArt(source.art),
  };
}

/**
 * La investigación de una unidad de Sociedad, paso a paso (docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md "Las 6
 * sesiones"). Nunca "incorrecto" (docs/06): las opciones no preferidas invitan a mirar de nuevo, nunca bloquean
 * seguir. Modo Enfoque (K7): Teo se oculta con `reducedMotion`, y la pausa de movimiento llega como en Lectura y
 * Matemáticas.
 */
export function SociedadInvestigationScreen({ lang, unit, profileId, profileName, focus, onExit, onFinish }: SociedadInvestigationScreenProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = SOCIAL_COPY;
  const [session, dispatch] = useReducer(sessionReducer, initialSession);
  const [activeLayer, setActiveLayer] = useState('antes');
  const movement = useMovementBreak(focus.movementBreaks, profileId);

  const step = unit.steps[session.stepIndex];
  const total = unit.steps.length;
  const canGo = canAdvance(step, session);
  const last = session.stepIndex === total - 1;

  if (movement.due) {
    // MovementBreakScreen usa su propio fondo (hoy, uno de Matemáticas); pedido a lo compartido para un fondo
    // propio de Sociedad queda anotado en docs/handoff/sociedad.md.
    return <MovementBreakScreen n={movement.count} lang={lang} onDone={() => movement.taken()} />;
  }

  if (last && canGo && session.stepsDone.includes(step.id)) {
    const ev = evaluateSession(unit, session);
    const stars = investigationStars(ev);
    const reasonKey = investigationReasonKey(ev);
    return (
      <ClosingCard
        name={profileName}
        lang={lang}
        stars={stars}
        reason={t.closingReason[reasonKey][lang]}
        stats={closingStatsFor(unit, session, lang)}
        onAgain={() => onFinish({ stepsDone: session.stepsDone, stars }, undefined)}
        onDone={(selfReport) => onFinish({ stepsDone: session.stepsDone, stars }, selfReport)}
      />
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onExit} label={t.back[lang]}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={styles.stepOf}>{t.stepOf[lang](session.stepIndex + 1, total)}</Text>
      </View>

      <View style={styles.guideRow}>
        {!focus.reducedMotion && <Teo pose={teoPoseFor(stepMoment(step.kind))} height={88} art={TEO} />}
        <View style={styles.bubble}>
          <Text style={styles.prompt}>{step.prompt[lang]}</Text>
        </View>
      </View>

      <StepBody step={step} unit={unit} lang={lang} session={session} dispatch={dispatch} activeLayer={activeLayer} setActiveLayer={setActiveLayer} />

      <View style={styles.footer}>
        <Button label={t.next[lang]} onPress={() => dispatch({ type: 'next', unit })} disabled={!canGo} large />
      </View>
    </ScrollView>
  );
}

function stepMoment(kind: SocialStep['kind']): 'intro' | 'thinking' | 'pointing' | 'done' {
  if (kind === 'pregunta') return 'intro';
  if (kind === 'comparar' || kind === 'explicar') return 'pointing';
  if (kind === 'revisar' || kind === 'elegir') return 'thinking';
  return 'intro';
}

interface StepBodyProps {
  step: SocialStep;
  unit: SocialUnit;
  lang: SocialLang;
  session: SessionState;
  dispatch: React.Dispatch<Parameters<typeof sessionReducer>[1]>;
  activeLayer: string;
  setActiveLayer: (id: string) => void;
}

function StepBody({ step, unit, lang, session, dispatch, activeLayer, setActiveLayer }: StepBodyProps) {
  const t = SOCIAL_COPY;
  const sourceById = (id: string) => unit.sources.find((s) => s.id === id)!;

  switch (step.kind) {
    case 'pregunta': {
      if (!step.layers) {
        const art = resolveSocialArt(step.art);
        return art ? (
          <View style={styles.body}>
            <View style={styles.singleFrame}>
              <Image source={art} style={styles.singleImage} resizeMode="cover" accessible={false} />
            </View>
          </View>
        ) : null;
      }
      const layers = step.layers.map((l) => ({ id: l.id, label: l.label[lang], source: resolveSocialArt(l.art)! }));
      return (
        <View style={styles.body}>
          <MapCompare layers={layers} active={activeLayer} onChange={setActiveLayer} />
        </View>
      );
    }
    case 'comparar': {
      const layers = step.layers.map((l) => ({ id: l.id, label: l.label[lang], source: resolveSocialArt(l.art)! }));
      const labels = step.statusLabels ? { igual: step.statusLabels.a[lang], nuevo: step.statusLabels.b[lang] } : { igual: t.classify.igual[lang], nuevo: t.classify.nuevo[lang] };
      return (
        <View style={styles.body}>
          <MapCompare layers={layers} active={activeLayer} onChange={setActiveLayer} />
          <View style={styles.statements}>
            {step.statements.map((st) => (
              <StatementRow key={st.id} text={st.text[lang]} status={session.statementAnswers[st.id]} onClassify={(status) => dispatch({ type: 'classify', statementId: st.id, status })} labels={labels} />
            ))}
          </View>
        </View>
      );
    }
    case 'fuente':
    case 'testimonio':
    case 'elegir': {
      const source = step.kind === 'elegir' ? undefined : sourceById(step.sourceId);
      const chosen = session.choiceAnswers[step.id];
      const fb = feedbackFor(step, session);
      return (
        <View style={styles.body}>
          {source && <SourceCard data={sourceCardData(source, lang)} />}
          {step.kind === 'testimonio' && <Text style={styles.quote}>{step.quote[lang]}</Text>}
          <ChoiceList choices={step.choices.map((c) => ({ id: c.id, text: c.text[lang] }))} selectedId={chosen} onSelect={(id) => dispatch({ type: 'choose', stepId: step.id, choiceId: id })} />
          {fb && <Text style={[styles.feedback, fb === 'affirm' ? styles.feedbackAffirm : styles.feedbackGentle]}>{t.feedback[fb][lang]}</Text>}
        </View>
      );
    }
    case 'explicar':
      return (
        <View style={styles.body}>
          <Text style={styles.instructions}>{t.explain.instructions[lang](step.minSources)}</Text>
          <View style={styles.sourcesRow}>
            {step.sourceIds.map((id) => {
              const source = sourceById(id);
              return <SourceCard key={id} data={sourceCardData(source, lang)} selected={session.sourcesSelected.includes(id)} onToggle={() => dispatch({ type: 'toggleSource', sourceId: id })} />;
            })}
          </View>
          <Text style={styles.selectedCount}>{t.explain.selected[lang](session.sourcesSelected.length)}</Text>
        </View>
      );
    case 'revisar':
      return (
        <View style={styles.body}>
          <Text style={styles.instructions}>{t.review.instructions[lang]}</Text>
          <ChoiceList choices={step.choices.map((c) => ({ id: c.id, text: c.text[lang] }))} selectedId={session.gapChoice} onSelect={(id) => dispatch({ type: 'pickGap', choiceId: id })} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { gap: 18, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepOf: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.muted },
  guideRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  bubble: { flex: 1, backgroundColor: '#ffffff', borderRadius: radius.tile, paddingHorizontal: 16, paddingVertical: 12, boxShadow: shadows.chip },
  prompt: { fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.ink },
  body: { gap: 14 },
  singleFrame: { borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.paper, boxShadow: shadows.card, aspectRatio: 1536 / 1024 },
  singleImage: { width: '100%', height: '100%' },
  statements: { gap: 10 },
  quote: { fontFamily: fontFamily.read.regular, fontSize: 18, lineHeight: 26, color: colors.inkSoft, fontStyle: 'italic' },
  instructions: { fontFamily: fontFamily.ui.bold, fontSize: 16, color: colors.ink },
  sourcesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  selectedCount: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.subjSociedad },
  feedback: { fontFamily: fontFamily.ui.bold, fontSize: 15 },
  feedbackAffirm: { color: colors.okDark },
  feedbackGentle: { color: colors.orangeDeep },
  footer: { alignItems: 'flex-start', marginTop: 4 },
});

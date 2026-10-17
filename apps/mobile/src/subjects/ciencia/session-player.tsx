import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FocusSupports } from '@lee-conmigo/contracts';
import {
  comparisonAdequate,
  evaluateTask,
  type ScienceUnit,
  type StepChoice,
  type TaskDone,
  type TaskResult,
  type UnitSession,
  type UnitStep,
  type UnitTask,
} from '@lee-conmigo/science-content';
import { CIENCIA_COPY, scienceStars, scienceStarsReason, type CienciaLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, ClosingCard, colors, FILL_IMAGE, fontFamily, gradients, GradientView, MayaSays, OptionList, radius, RoundButton, shadows, SpeakerIcon, useLayout } from '@lee-conmigo/ui-native';
import type { ChildProfile } from '../../app-state';
import { MovementBreakScreen } from '../../screens/movement-break-screen';
import { useMovementBreak } from '../../movement';
import { speak, stopSpeaking } from '../../tts';
import { today } from '../../today';
import { CIENCIA_BACKGROUNDS, MAYA, type MayaPose } from './art';
import { familyOf, type Local, type StepCtx } from './families';
import { TaskPanel, type Picks } from './task-panel';

interface SessionPlayerProps {
  profile: ChildProfile;
  lang: CienciaLang;
  focus: FocusSupports;
  unit: ScienceUnit;
  session: UnitSession;
  /** Paso donde retomar («guardar y seguir después»). */
  startStep: number;
  /** Lo que ya eligió en preguntas sueltas (su idea de al principio). */
  savedChoices: Record<string, string[]>;
  onTaskDone: (task: UnitTask, done: TaskDone) => void;
  onChoice: (choiceId: string, ids: string[]) => void;
  /** Cada vez que avanza de paso (para poder retomar si cierra la app). */
  onStep: (index: number) => void;
  /** Sale sin terminar: el avance queda guardado en el paso donde iba. */
  onLeave: (index: number) => void;
  /** Llegó al final: guarda las estrellas por esfuerzo. */
  onFinish: (stars: number) => void;
  /** Cierra la tarjeta de cierre y vuelve al cuaderno de la unidad. */
  onDone: () => void;
}

/** Estado de partida de un paso: lo común y, encima, lo que pida su familia. */
function freshLocal(step: UnitStep | undefined): Local {
  const base: Local = { trial: 0, watering: false, layers: { relief: false, volcanoes: false, quakes: false }, marks: [], checked: false, skipped: false, bag: {} };
  const family = step ? familyOf(step) : undefined;
  return step && family?.initial ? { ...base, ...family.initial(step) } : base;
}

const POSE: Record<UnitStep['phase'], MayaPose> = { observa: 'investiga', explora: 'apunta', explica: 'piensa', usa: 'apunta' };

/**
 * Una sesión de la unidad (≈ 15 min): observa → explora → explica → usa. Cada paso es una escena + algo que HACER. Lo que se
 * dibuja y se hace lo pone la FAMILIA del paso (`./families`); aquí vive lo común: Maya, tareas, preguntas, pistas, cierre,
 * Modo Enfoque y pausa de movimiento. Nunca bloquea (siempre hay «Lo veo luego») y nunca dice «incorrecto» (docs/06).
 */
export function SessionPlayer({ profile, lang, focus, unit, session, startStep, savedChoices, onTaskDone, onChoice, onStep, onLeave, onFinish, onDone }: SessionPlayerProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const c = CIENCIA_COPY;
  const steps = session.steps;
  const calm = focus.reducedMotion;
  const [index, setIndex] = useState(Math.min(Math.max(0, startStep), steps.length - 1));
  const step = steps[index];
  const family = familyOf(step);
  const [local, setLocal] = useState<Local>(() => freshLocal(step));
  const patch = (p: Partial<Local>) => setLocal((l) => ({ ...l, ...p }));

  // Estado de toda la sesión (lo que cruza de un paso al siguiente).
  const [picks, setPicks] = useState<Record<string, Picks>>({});
  const [hints, setHints] = useState<Record<string, 0 | 1 | 2 | 3>>({});
  const [results, setResults] = useState<Record<string, TaskResult | undefined>>({});
  const [done, setDone] = useState<Record<string, 'ok' | 'skipped'>>({});
  const [choices, setChoices] = useState<Record<string, string[]>>(savedChoices);
  const [shared, setSharedState] = useState<Record<string, unknown>>({});
  const setShared = (key: string, value: unknown) => setSharedState((s) => ({ ...s, [key]: value }));
  const [triedAgain, setTriedAgain] = useState(false);
  const [listened, setListened] = useState(false);
  const [closing, setClosing] = useState<{ stars: 0 | 1 | 2 | 3; reason: string } | undefined>();
  const [resting, setResting] = useState(false);
  const movement = useMovementBreak(focus.movementBreaks, profile.id, !closing);
  const scroll = useRef<ScrollView>(null);
  useEffect(() => scroll.current?.scrollTo({ y: 0, animated: false }), [index]);
  useEffect(() => () => stopSpeaking(), []);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const task = step.taskId ? unit.tasks.find((t) => t.id === step.taskId) : undefined;
  // El arreglo que eligió el niño en la tarea de transferencia decide qué evidencia final se le muestra.
  const transfer = unit.tasks.find((t) => t.kind === 'transferir');
  const fix = transfer ? picks[transfer.id]?.arreglo?.[0] : undefined;
  const choice: StepChoice | undefined = step.choiceByFix?.[fix ?? ''] ?? step.choice;

  // ---- ¿ya puede seguir?
  const taskDone = task ? done[task.id] !== undefined : true;
  const picked = choice ? choices[choice.id] ?? [] : [];
  const expected = choice?.options.filter((o) => o.expected).map((o) => o.id) ?? [];
  const compare = choice?.compareWith;
  const compareTask = compare ? unit.tasks.find((t) => t.id === compare.taskId) : undefined;
  const predicted = compare ? picks[compare.taskId]?.[compare.partId]?.[0] : undefined;
  const choiceGood = !choice
    ? true
    : compareTask && compare
      ? picked[0] !== undefined && (predicted === undefined || comparisonAdequate(compareTask, compare.partId, predicted, picked[0] as 'coincidio' | 'nocoincidio'))
      : expected.length
        ? picked.length === expected.length && expected.every((e) => picked.includes(e))
        : picked.length > 0;
  const needsCheck = !!choice && (expected.length > 0 || !!compare);
  const choiceReady = !choice || local.skipped || (needsCheck ? local.checked && choiceGood : picked.length > 0);

  // ---- distribución
  const contentWidth = Math.min(layout.width - layout.gutter * 2, 1000);
  const split = !layout.narrow;
  const visualWidth = split ? Math.floor(contentWidth * 0.55) : contentWidth;
  const small = layout.phone;

  const ctx: StepCtx = { unit, step, task, lang, calm, small, visualWidth, picks, setPicks, done, choice, choiceGood, fix, local, patch, shared, setShared, markTriedAgain: () => setTriedAgain(true), timer };
  const ready = taskDone && choiceReady && (family?.ready?.(ctx) ?? true);
  const visual: ReactNode = family?.visual(ctx) ?? null;
  const lastStep = index + 1 >= steps.length;
  const bg = calm || !step.scene ? undefined : (CIENCIA_BACKGROUNDS as Record<string, { horizontal: ImageSourcePropType; vertical: ImageSourcePropType } | undefined>)[step.scene];
  const bgSource = bg ? (layout.portrait ? bg.vertical : bg.horizontal) : undefined;
  const pose: MayaPose = task && done[task.id] === 'ok' ? 'celebra' : POSE[step.phase];

  // ---- acciones
  const complete = (t: UnitTask, outcome: TaskDone['outcome']) => {
    setDone((d) => ({ ...d, [t.id]: outcome === 'skipped' ? 'skipped' : 'ok' }));
    onTaskDone(t, { outcome, day: today(), maxHintLevel: hints[t.id] ?? 0, picks: picks[t.id] ?? {}, ...(listened ? { accessSupports: ['audio'] } : {}) });
  };
  const checkTask = (t: UnitTask) => {
    const r = evaluateTask(t, picks[t.id] ?? {});
    setResults((x) => ({ ...x, [t.id]: r }));
    if (r.outcome === 'ok') complete(t, 'ok');
    else setTriedAgain(true);
  };
  const setChoice = (ids: string[]) => {
    if (!choice) return;
    setChoices((x) => ({ ...x, [choice.id]: ids }));
    patch({ checked: false });
    if (!needsCheck) onChoice(choice.id, ids);
  };
  const toggleChoice = (id: string) => setChoice(choice?.multi ? (picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]) : [id]);
  const goNext = () => {
    stopSpeaking();
    if (index + 1 < steps.length) {
      const nextStep = steps[index + 1];
      setIndex(index + 1);
      setLocal(freshLocal(nextStep));
      onStep(index + 1);
      if (movement.due) setResting(true); // límite natural: entre un paso y otro
      return;
    }
    const reflection = unit.tasks.find((t) => t.kind === 'reflexionar');
    const revised = reflection ? picks[reflection.id]?.idea?.[0] === 'cambio' : false;
    const usedHintOrRevised = Object.values(hints).some((h) => h > 0) || revised;
    const stars = scienceStars({ finished: true, usedHintOrRevised, triedAgain });
    onFinish(stars);
    setClosing({ stars, reason: scienceStarsReason({ usedHintOrRevised, triedAgain })[lang] });
  };
  const listen = () => {
    setListened(true);
    speak(step.text[lang], lang);
  };
  const replay = () => {
    setClosing(undefined);
    setIndex(0);
    setLocal(freshLocal(steps[0]));
    setPicks({});
    setHints({});
    setResults({});
    setDone({});
    setSharedState({});
  };

  // ---- lo que el niño hace en este paso
  const interact: ReactNode = (
    <View style={styles.stack}>
      {step.kind === 'reflexion' ? <IdeaRecap lang={lang} unit={unit} chosen={choices.ideaInicial?.[0]} /> : null}
      {step.glossary ? (
        <View style={styles.glossary}>
          {step.glossary.map((g) => {
            const e = unit.glossary.find((x) => x.es === g);
            return e ? (
              <View key={g} style={styles.word}>
                <Text style={styles.wordTitle}>{lang === 'es' ? e.es : e.en}</Text>
                <Text style={styles.wordNote}>{e.note[lang]}</Text>
              </View>
            ) : null;
          })}
        </View>
      ) : null}
      {task ? (
        <TaskPanel
          task={task}
          lang={lang}
          small={small}
          picks={picks[task.id] ?? {}}
          onPicks={(next) => setPicks((p) => ({ ...p, [task.id]: next }))}
          hintLevel={hints[task.id] ?? 0}
          onHint={() => setHints((h) => ({ ...h, [task.id]: Math.min(3, (h[task.id] ?? 0) + 1) as 1 | 2 | 3 }))}
          result={results[task.id]}
          done={done[task.id]}
          onCheck={() => checkTask(task)}
          onSkip={() => complete(task, 'skipped')}
        />
      ) : null}
      {choice ? (
        <View style={styles.stack}>
          {compareTask && compare ? <CompareRecap lang={lang} task={compareTask} partId={compare.partId} predicted={predicted} /> : null}
          <OptionList small={small} compact={choice.options.every((o) => o.text[lang].length <= 3)} multi={choice.multi} options={choice.options.map((o) => ({ id: o.id, text: o.text[lang], state: local.checked && !choiceGood && needsCheck && picked.includes(o.id) && !o.expected && expected.length > 0 ? ('rejected' as const) : undefined }))} selected={picked} onToggle={toggleChoice} disabled={local.skipped || (local.checked && choiceGood)} />
          {needsCheck && !local.skipped && !(local.checked && choiceGood) ? (
            <View style={styles.buttonsRow}>
              <Button label={c.button.check[lang]} disabled={picked.length === 0} onPress={() => patch({ checked: true })} />
              <Button label={c.button.later[lang]} variant="secondary" onPress={() => patch({ skipped: true })} />
            </View>
          ) : null}
          {local.checked && needsCheck ? (
            <View style={[styles.note, choiceGood && styles.noteOk]} accessibilityLiveRegion="polite">
              <Text style={styles.noteText}>{choiceGood ? c.guide.wellDone[lang] : c.screen.tryAgainNote[lang]}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      {family?.skippable?.(step) && !(choice && needsCheck) && !local.skipped && !ready ? <Button label={c.button.later[lang]} variant="secondary" onPress={() => patch({ skipped: true })} /> : null}
    </View>
  );

  return (
    <View style={styles.screen}>
      {bgSource ? <Image source={bgSource} style={[FILL_IMAGE, styles.bg]} resizeMode="cover" accessible={false} /> : null}
      <View style={[styles.header, { paddingTop: insets.top + 12, paddingHorizontal: layout.gutter }]}>
        <View style={styles.headerRow}>
          <RoundButton onPress={() => onLeave(index)} label={c.screen.leave[lang]}>
            <ChevronLeftIcon />
          </RoundButton>
          <GradientView gradient={gradients.subjCiencia} style={styles.pill}>
            <Text style={styles.pillText}>🔬 {c.subject[lang]}</Text>
          </GradientView>
          {!layout.narrow ? <Phases current={step.phase} lang={lang} /> : null}
          <View style={styles.flex} />
          <Text style={styles.meta}>{c.screen.stepOf(index + 1, steps.length)[lang]}</Text>
        </View>
        {layout.narrow ? <Phases current={step.phase} lang={lang} /> : null}
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${Math.round(((index + 1) / steps.length) * 100)}%` }]} />
        </View>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingBottom: insets.bottom + 24 }]}>
        <View style={{ width: contentWidth, alignSelf: 'center', gap: 16 }}>
          <View style={styles.sayRow}>
            <View style={styles.flex}>
              <MayaSays pose={calm ? undefined : MAYA[pose]} height={small ? 88 : 118} text={step.text[lang]} />
            </View>
            <RoundButton onPress={listen} label={c.screen.listen[lang]}>
              <SpeakerIcon />
            </RoundButton>
          </View>
          <View style={[styles.body, split && styles.bodySplit]}>
            {visual ? <View style={split ? { width: visualWidth } : undefined}>{visual}</View> : null}
            <View style={styles.flex}>{interact}</View>
          </View>
          <View style={styles.footer}>
            <Button label={c.button.saveLater[lang]} variant="secondary" onPress={() => onLeave(index)} />
            <Button label={(lastStep ? c.button.done : c.button.next)[lang]} large disabled={!ready} onPress={goNext} />
          </View>
        </View>
      </ScrollView>
      {resting ? (
        <MovementBreakScreen
          n={movement.count}
          lang={lang}
          onDone={() => {
            movement.taken();
            setResting(false);
          }}
        />
      ) : null}
      {closing ? (
        <ClosingCard
          name={profile.name}
          stars={closing.stars}
          reason={closing.reason}
          stats={[
            { label: c.notebook.sessionOf(unit.sessions.findIndex((s) => s.id === session.id) + 1, unit.sessions.length)[lang], value: '✓' },
            { label: c.screen.steps[lang], value: String(steps.length) },
          ]}
          onAgain={replay}
          onDone={() => onDone()}
        />
      ) : null}
    </View>
  );
}

/** Las cuatro píldoras de la sesión: la actual resaltada, las anteriores con ✓. */
function Phases({ current, lang }: { current: UnitStep['phase']; lang: CienciaLang }) {
  const order: UnitStep['phase'][] = ['observa', 'explora', 'explica', 'usa'];
  const at = order.indexOf(current);
  return (
    <View style={styles.phases}>
      {order.map((p, i) => (
        <View key={p} style={[styles.phase, i < at && styles.phaseDone, i === at && styles.phaseNow]}>
          <Text style={[styles.phaseText, i === at && styles.phaseTextNow]}>{i < at ? '✓ ' : `${i + 1} `}{CIENCIA_COPY.phase[p][lang]}</Text>
        </View>
      ))}
    </View>
  );
}

/** «Tu idea de al principio»: se la devuelve al niño para que la revise con sus datos (S6). */
function IdeaRecap({ lang, unit, chosen }: { lang: CienciaLang; unit: ScienceUnit; chosen: string | undefined }) {
  const step = unit.sessions.flatMap((s) => s.steps).find((s) => s.choice?.id === 'ideaInicial');
  const option = step?.choice?.options.find((o) => o.id === chosen);
  if (!step || !option) return null;
  return (
    <View style={styles.recap}>
      <Text style={styles.recapKicker}>{CIENCIA_COPY.screen.initialIdea[lang]}</Text>
      <Text style={styles.recapText}>{`${step.text[lang]} ${option.text[lang]}`}</Text>
    </View>
  );
}

/** Lo que predijo y lo que se vio, lado a lado, para comparar con honestidad. */
function CompareRecap({ lang, task, partId, predicted }: { lang: CienciaLang; task: UnitTask; partId: string; predicted: string | undefined }) {
  const part = task.parts.find((p) => p.id === partId);
  const guess = part?.options.find((o) => o.id === predicted);
  const seen = part?.options.find((o) => o.id === part.observedOptionId);
  return (
    <View style={styles.recap}>
      {guess ? <Text style={styles.recapText}>{`${CIENCIA_COPY.screen.predicted[lang]}: ${guess.text[lang]}`}</Text> : null}
      {seen ? <Text style={styles.recapText}>{`${CIENCIA_COPY.screen.observed[lang]}: ${seen.text[lang]}`}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  bg: { opacity: 0.4 },
  header: { gap: 10, paddingBottom: 10, backgroundColor: 'rgba(255,253,248,0.94)', zIndex: 2 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: { borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  pillText: { fontFamily: fontFamily.ui.black, fontSize: 16, color: '#ffffff' },
  flex: { flex: 1 },
  meta: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.muted },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.track, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.ok, borderRadius: 4 },
  content: { paddingTop: 18, flexGrow: 1 },
  sayRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  body: { gap: 16 },
  bodySplit: { flexDirection: 'row', alignItems: 'flex-start' },
  stack: { gap: 12 },
  buttonsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  toggles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  alignStart: { alignSelf: 'flex-start' },
  weighRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  helper: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.inkSoft, flexShrink: 1 },
  badge: { alignSelf: 'center', backgroundColor: colors.warnTint, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 5 },
  badgeText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.orangeDeep },
  reveal: { backgroundColor: colors.violet50, borderRadius: radius.tile, padding: 12 },
  revealText: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.violetDeep },
  note: { backgroundColor: colors.warnTint, borderRadius: radius.tile, padding: 14 },
  noteOk: { backgroundColor: colors.okTint },
  noteText: { fontFamily: fontFamily.ui.bold, fontSize: 17, lineHeight: 24, color: colors.ink },
  glossary: { gap: 10 },
  word: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, gap: 2, boxShadow: shadows.soft },
  wordTitle: { fontFamily: fontFamily.ui.black, fontSize: 19, color: colors.navy },
  wordNote: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  recap: { backgroundColor: colors.focusTint, borderRadius: radius.tile, padding: 14, gap: 4 },
  recapKicker: { fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.orangeDeep, textTransform: 'uppercase' },
  recapText: { fontFamily: fontFamily.ui.bold, fontSize: 17, lineHeight: 24, color: colors.ink },
  footer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  phases: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  phase: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: colors.chip },
  phaseDone: { backgroundColor: colors.okTint },
  phaseNow: { backgroundColor: colors.phaseAprender, boxShadow: `inset 0px -3px 0px ${colors.phaseAprenderLedge}` },
  phaseText: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.muted },
  phaseTextNow: { color: colors.ink },
});

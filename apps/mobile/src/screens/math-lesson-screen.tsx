import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ExplorePayload, LearnBlock, MathLesson, MathRepresentation, MathUnit } from '@lee-conmigo/contracts';
import { buildLessonPlan, challengeReducer, dueSkills, initialChallenge, phaseOf, toAttempt, updateReviews, warmupSize, type GeneratedChallenge, type PlanItem } from '@lee-conmigo/math-content';
import { MATH_COPY, type MathLang } from '@lee-conmigo/ui-core';
import {
  ArrayGrid,
  Button,
  ChevronLeftIcon,
  colors,
  ConfidencePicker,
  EqualGroups,
  fontFamily,
  gradients,
  GradientView,
  HintLadder,
  NumericKeypad,
  PairsGame,
  PhaseTabs,
  radius,
  RoundButton,
  shadows,
  TapeDiagram,
  useLayout,
} from '@lee-conmigo/ui-native';
import type { MathProgress } from '../app-state';
import { speak } from '../tts';
import { today } from '../today';
import { Mila } from './math-visual/mila';

interface MathLessonScreenProps {
  lang: MathLang;
  unit: MathUnit;
  lesson: MathLesson;
  minutes: number;
  progress: MathProgress;
  onExit: () => void;
}


/**
 * Una lección del cuaderno de Matemáticas (Kitewise B5–B8, docs/research §6–7): calentamiento con lo que vuelve hoy →
 * Aprender → Explorar → Practicar → Juego → Cierre. La lógica vive en `@lee-conmigo/math-content` (plan, reto, dominio);
 * aquí solo se dibuja. Cada reto terminado se guarda como intento (para dominio y repaso), nunca como calificación.
 */
export function MathLessonScreen({ lang, unit, lesson, minutes, progress, onExit }: MathLessonScreenProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = MATH_COPY;
  const day = useMemo(today, []);
  const plan = useMemo(
    () => buildLessonPlan(unit, lesson, { minutes, seed: Date.now() % 1_000_000, dueSkillIds: dueSkills(progress.reviews, day, warmupSize(minutes)) }),
    // La lección se arma una vez al abrirla: el progreso que se guarda durante ella no la reordena.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unit, lesson],
  );
  const [index, setIndex] = useState(0);
  // Cada paso nuevo empieza arriba.
  const scroll = useRef<ScrollView>(null);
  useEffect(() => scroll.current?.scrollTo({ y: 0, animated: false }), [index]);
  const item = plan[index];
  const lessonNo = unit.lessons.findIndex((l) => l.id === lesson.id) + 1;
  const next = () => {
    if (index + 1 < plan.length) return setIndex(index + 1);
    progress.lessonsDone.add(lesson.id);
    onExit();
  };
  const contentWidth = Math.min(layout.width - layout.gutter * 2, 980);
  const split = !layout.narrow;
  const modelWidth = split ? Math.floor((contentWidth - 16) / 2) : contentWidth;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12, paddingHorizontal: layout.gutter }]}>
        <View style={styles.headerRow}>
          <RoundButton onPress={onExit} label="Volver">
            <ChevronLeftIcon />
          </RoundButton>
          <GradientView gradient={gradients.subjMate} style={styles.pill}>
            <Text style={styles.pillText}>½ {t.subject[lang]}</Text>
          </GradientView>
          {!layout.phone && <PhaseTabs current={phaseOf(item)} lang={lang} />}
          <View style={styles.flex} />
          <Text style={styles.meta}>{t.lessonOf[lang](lessonNo, unit.lessons.length)}</Text>
        </View>
        {layout.phone && <PhaseTabs current={phaseOf(item)} lang={lang} compact />}
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${Math.round(((index + 1) / plan.length) * 100)}%` }]} />
        </View>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingBottom: insets.bottom + 24 }]}>
        <View style={{ width: contentWidth, alignSelf: 'center', gap: 16 }}>
          <Step key={index} item={item} lang={lang} split={split} modelWidth={modelWidth} day={day} progress={progress} onNext={next} onAgain={() => setIndex(Math.max(0, index - 1))} />
        </View>
      </ScrollView>
    </View>
  );
}

interface StepProps {
  item: PlanItem;
  lang: MathLang;
  split: boolean;
  modelWidth: number;
  day: string;
  progress: MathProgress;
  onNext: () => void;
  onAgain: () => void;
}

function Step({ item, lang, split, modelWidth, day, progress, onNext, onAgain }: StepProps) {
  switch (item.kind) {
    case 'aprender':
      return <Learn blocks={item.blocks} lang={lang} split={split} modelWidth={modelWidth} onNext={onNext} onAgain={onAgain} />;
    case 'explorar':
      return <Explore payload={item.payload} lang={lang} modelWidth={modelWidth} onNext={onNext} />;
    case 'calentar':
    case 'practicar':
      return <Practice challenge={item.challenge} warmup={item.kind === 'calentar'} lang={lang} split={split} modelWidth={modelWidth} day={day} progress={progress} onNext={onNext} />;
    case 'juego':
      return <PairsGame data={item.payload} lang={lang} narrow={!split} onDone={onNext} />;
    case 'cierre':
      return <Closure prompt={item.closure.prompt[lang]} choices={item.closure.choices.map((c) => c[lang])} lang={lang} onDone={onNext} />;
  }
}

// ------------------------------------------------------------------ Aprender

function Learn({ blocks, lang, split, modelWidth, onNext, onAgain }: { blocks: LearnBlock[]; lang: MathLang; split: boolean; modelWidth: number; onNext: () => void; onAgain: () => void }) {
  const t = MATH_COPY;
  const overlay = blocks.find((b): b is Extract<LearnBlock, { type: 'annotatedIllustration' }> => b.type === 'annotatedIllustration');
  return (
    <View style={[styles.columns, !split && styles.stack]}>
      {overlay && (
        <View style={[styles.card, split && styles.flex]}>
          <Model rep={overlay.overlay} lang={lang} width={modelWidth - 36} />
        </View>
      )}
      <View style={[styles.card, styles.gap, split && styles.flex]}>
        {blocks.map((b, i) => {
          if (b.type === 'text')
            return (
              <View key={i} style={styles.gap}>
                <Text style={styles.body}>{b.text[lang]}</Text>
                <View style={styles.left}>
                  <Button label={`🔊 ${t.listen[lang]}`} variant="secondary" onPress={() => speak((b.audio ?? b.text)[lang], lang)} />
                </View>
              </View>
            );
          if (b.type === 'keyIdea')
            return (
              <View key={i} style={styles.keyIdea}>
                <Text style={styles.keyIdeaTitle}>{t.keyIdea[lang]}</Text>
                <Text style={styles.body}>{b.text[lang]}</Text>
              </View>
            );
          if (b.type === 'vocabulary')
            return (
              <View key={i} style={styles.vocab}>
                {b.items.map((v, j) => (
                  <View key={j} style={styles.chip}>
                    <Text style={styles.chipTerm}>{v.term[lang]}</Text>
                    <Text style={styles.chipDef}>{v.definition[lang]}</Text>
                  </View>
                ))}
              </View>
            );
          return null;
        })}
        <View style={styles.actions}>
          <Button label={t.again[lang]} variant="secondary" onPress={onAgain} />
          <Button label={t.gotIt[lang]} onPress={onNext} />
        </View>
      </View>
    </View>
  );
}

/** Modelo estático (lo que dibuja la app sobre la ilustración o junto a un reto). */
function Model({ rep, lang, width }: { rep: MathRepresentation; lang: MathLang; width: number }) {
  const t = MATH_COPY.model;
  if (rep.component === 'EqualGroups') return <EqualGroups groups={rep.groups} perGroup={rep.perGroup} width={width} label={t.groupsOf[lang](rep.groups, rep.perGroup)} />;
  if (rep.component === 'PaintGrid') return <ArrayGrid rows={rep.rows} columns={rep.columns} width={width} label={t.rowsOf[lang](rep.rows, rep.columns)} />;
  if (rep.component === 'TapeDiagram') return <TapeDiagram groups={rep.groups} perGroup={rep.perGroup} width={width} filled={rep.groups} totalLabel="?" />;
  return null;
}

// ------------------------------------------------------------------ Explorar

function Explore({ payload, lang, modelWidth, onNext }: { payload: ExplorePayload; lang: MathLang; modelWidth: number; onNext: () => void }) {
  const t = MATH_COPY.explore;
  const width = Math.min(modelWidth, 640) - 36;
  // Un solo estado numérico por actividad: fichas por bolsa, grupos contados, celdas pintadas o partes llenas.
  const [counts, setCounts] = useState<number[]>(() => Array(payload.component === 'PaintGrid' ? 0 : payload.groups).fill(0));
  const [counted, setCounted] = useState(0);
  const [painted, setPainted] = useState<Set<number>>(new Set());
  let instruction = '';
  let model = null;
  let status = '';
  let done = false;

  if (payload.component === 'DragZone') {
    const total = payload.groups * payload.perGroup;
    const placed = counts.reduce((a, b) => a + b, 0);
    done = counts.every((c) => c === payload.perGroup);
    instruction = t.buildEqualGroups[lang](payload.groups, payload.perGroup);
    status = done ? t.done[lang] : t.left[lang](total - placed);
    model = (
      <EqualGroups
        groups={payload.groups}
        perGroup={payload.perGroup}
        counts={counts}
        width={width}
        onPressGroup={(i) => setCounts((c) => c.map((n, j) => (j === i && n < payload.perGroup ? n + 1 : n)))}
      />
    );
  } else if (payload.component === 'EqualGroups') {
    done = counted >= payload.groups;
    instruction = t.connectModelToEquation[lang];
    const sum = Array(Math.max(1, counted)).fill(payload.perGroup).join(' + ');
    status = counted === 0 ? '' : done ? `${sum} = ${payload.groups * payload.perGroup}   ·   ${payload.groups} × ${payload.perGroup} = ${payload.groups * payload.perGroup}` : sum;
    model = <EqualGroups groups={payload.groups} perGroup={payload.perGroup} width={width} counted={counted} onPressGroup={(i) => i === counted && setCounted(counted + 1)} />;
  } else if (payload.component === 'PaintGrid') {
    const total = payload.rows * payload.columns;
    done = painted.size === total;
    instruction = t.buildArray[lang](payload.rows, payload.columns);
    status = done ? `${t.done[lang]}  ${payload.rows} × ${payload.columns} = ${total}` : t.painted[lang](painted.size, total);
    model = (
      <ArrayGrid
        rows={payload.rows}
        columns={payload.columns}
        width={width}
        painted={painted}
        onToggle={(i) =>
          setPainted((s) => {
            const n = new Set(s);
            if (n.has(i)) n.delete(i);
            else n.add(i);
            return n;
          })
        }
      />
    );
  } else {
    done = counted >= payload.groups;
    instruction = payload.prompt?.[lang] ?? t.modelStory[lang];
    const total = payload.groups * payload.perGroup;
    model = <TapeDiagram groups={payload.groups} perGroup={payload.perGroup} width={width} filled={counted} onPressPart={(i) => i === counted && setCounted(counted + 1)} totalLabel={done ? `${payload.groups} × ${payload.perGroup} = ${total}` : '?'} />;
    status = done ? t.done[lang] : '';
  }

  const undo = () => {
    if (payload.component === 'DragZone') {
      const last = counts.map((n, i) => (n > 0 ? i : -1)).filter((i) => i >= 0).pop();
      if (last !== undefined) setCounts((c) => c.map((n, j) => (j === last ? n - 1 : n)));
    } else if (payload.component === 'PaintGrid') setPainted(new Set());
    else setCounted(Math.max(0, counted - 1));
  };

  return (
    <View style={[styles.card, styles.gap, styles.center]}>
      <Text style={[styles.body, styles.centerText]}>{instruction}</Text>
      {model}
      {status ? <Text style={[styles.status, done && styles.statusDone]}>{status}</Text> : null}
      <View style={styles.actions}>
        <Button label={t.undo[lang]} variant="secondary" onPress={undo} />
        <Button label={MATH_COPY.next[lang]} onPress={onNext} disabled={!done} />
      </View>
    </View>
  );
}

// ------------------------------------------------------------------ Practicar

interface PracticeProps {
  challenge: GeneratedChallenge;
  warmup: boolean;
  lang: MathLang;
  split: boolean;
  modelWidth: number;
  day: string;
  progress: MathProgress;
  onNext: () => void;
}

function Practice({ challenge: c, warmup, lang, split, modelWidth, day, progress, onNext }: PracticeProps) {
  const t = MATH_COPY;
  const layout = useLayout();
  const [s, dispatch] = useReducer(challengeReducer, initialChallenge);
  const finished = s.solved || s.skipped;

  /** Guarda el intento una sola vez (al resolverlo o dejarlo para luego) y pasa al siguiente paso. */
  const finish = () => {
    const a = toAttempt(s, c, day);
    if (a) {
      progress.attempts.push(a);
      progress.reviews = updateReviews(progress.reviews, a);
    }
    onNext();
  };

  const feedback =
    s.feedback === 'needsConfidence' ? t.chooseConfidence[lang] : s.feedback === 'tryAgain' ? c.feedback.tryAgain[lang] : s.feedback === 'success' ? c.feedback.success[lang] : s.skipped ? t.laterNote[lang] : '';

  return (
    <View style={styles.gap}>
      {warmup && <Text style={styles.warmup}>🔁 {t.warmup[lang]}</Text>}
      <View style={[styles.columns, !split && styles.stack]}>
        <View style={[styles.card, styles.gap, split && styles.flex]}>
          <Text style={styles.prompt}>{c.prompt[lang]}</Text>
          <View style={styles.left}>
            <Button label={`🔊 ${t.listen[lang]}`} variant="secondary" onPress={() => speak(c.prompt[lang], lang)} />
          </View>
          <Model rep={c.representation} lang={lang} width={modelWidth - 36} />
          <HintLadder hints={c.hints} level={s.hintLevel} lang={lang} />
        </View>
        <View style={[styles.card, styles.gap, styles.center, split && styles.flex]}>
          <Text style={styles.label}>{t.yourAnswer[lang]}</Text>
          <NumericKeypad value={s.input} unit={c.answerUnit?.[lang]} lang={lang} compact={!split || layout.height < 900} onKey={(d) => dispatch({ type: 'key', digit: d })} onBack={() => dispatch({ type: 'back' })} />
          <ConfidencePicker value={s.confidence} onChange={(v) => dispatch({ type: 'confidence', value: v })} lang={lang} compact={!split} />
          {feedback ? <Text style={[styles.status, s.feedback === 'success' && styles.statusDone]}>{feedback}</Text> : null}
          {finished ? (
            <Button label={t.next[lang]} large onPress={finish} />
          ) : (
            <View style={styles.actions}>
              {s.hintLevel < 3 && <Button label={s.hintLevel === 0 ? t.hint[lang] : t.moreHelp[lang]} variant="secondary" onPress={() => dispatch({ type: 'hint' })} />}
              <Button label={t.later[lang]} variant="secondary" onPress={() => dispatch({ type: 'skip' })} />
              <Button label={t.check[lang]} onPress={() => dispatch({ type: 'check', answer: c.answer, requireConfidence: true })} disabled={!s.input} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// ------------------------------------------------------------------ Cierre

function Closure({ prompt, choices, lang, onDone }: { prompt: string; choices: string[]; lang: MathLang; onDone: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <View style={[styles.card, styles.gap, styles.center]}>
      <Mila pose="celebra" height={160} />
      <Text style={[styles.prompt, styles.centerText]}>{prompt}</Text>
      <View style={styles.actions}>
        {choices.map((c, i) => (
          <Button key={i} label={picked === i ? `✓ ${c}` : c} variant={picked === i ? 'primary' : 'secondary'} onPress={() => setPicked(i)} />
        ))}
      </View>
      <Button label={MATH_COPY.closure.done[lang]} large onPress={onDone} />
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
  meta: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.muted },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.brand100, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4, backgroundColor: colors.subjMate },
  content: { paddingTop: 8 },
  columns: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  stack: { flexDirection: 'column', alignItems: 'stretch' },
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 18, boxShadow: shadows.card },
  gap: { gap: 14 },
  center: { alignItems: 'center' },
  centerText: { textAlign: 'center' },
  left: { flexDirection: 'row' },
  body: { fontFamily: fontFamily.read.regular, fontSize: 20, lineHeight: 30, color: colors.ink },
  prompt: { fontFamily: fontFamily.read.bold, fontSize: 22, lineHeight: 32, color: colors.ink },
  keyIdea: { backgroundColor: colors.focus, borderRadius: radius.tile, padding: 14, gap: 4 },
  keyIdeaTitle: { fontFamily: fontFamily.ui.black, fontSize: 14, color: colors.navy },
  vocab: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: colors.brand50, borderRadius: radius.tile, paddingHorizontal: 12, paddingVertical: 8, maxWidth: 320 },
  chipTerm: { fontFamily: fontFamily.ui.black, fontSize: 15, color: colors.navy },
  chipDef: { fontFamily: fontFamily.ui.semibold, fontSize: 14, color: colors.inkSoft },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  status: { fontFamily: fontFamily.ui.extrabold, fontSize: 17, color: colors.inkSoft, textAlign: 'center' },
  statusDone: { color: colors.ok },
  label: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.muted },
  warmup: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.subjMate },
});

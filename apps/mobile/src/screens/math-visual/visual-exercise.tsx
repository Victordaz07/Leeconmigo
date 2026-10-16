import { useEffect, useMemo, useReducer, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  answerFields,
  canReveal,
  exerciseReducer,
  groupCapacity,
  parallelExample,
  startExercise,
  type ExerciseState,
  type VisualInstance,
} from '@lee-conmigo/math-content';
import { MATH_COPY, VISUAL_COPY, visualEquation, visualFeedback, visualFieldLabel, visualHint, visualHowTo, visualPrompt, type MathLang } from '@lee-conmigo/ui-core';
import { AnswerBoxes, Button, colors, DigitPad, fontFamily, GardenPlots, manip, radius, shadows, SharingBoard, TenFrameBoard, useLayout } from '@lee-conmigo/ui-native';
import { speak } from '../../tts';

interface VisualExerciseProps {
  instance: VisualInstance;
  lang: MathLang;
  /** Ancho disponible para el ejercicio. */
  width: number;
  /** Termina (resuelto o con la solución vista) y el niño toca "Siguiente". */
  onNext: (final: ExerciseState) => void;
  nextLabel?: string;
}

/**
 * Un ejercicio visual completo (docs/design/math-visual §1): consigna → manipular → responder → comprobar → ayuda →
 * explicación. El estado no tiene texto: cambiar ES/EN no reinicia nada (§13).
 */
export function VisualExercise({ instance, lang, width, onNext, nextLabel }: VisualExerciseProps) {
  const layout = useLayout();
  const [s, dispatch] = useReducer(exerciseReducer, instance, startExercise);
  const m = instance.model;
  const fields = useMemo(() => answerFields(m), [m]);
  const [active, setActive] = useState<string | null>(fields[0] ?? null);
  useEffect(() => setActive(fields[0] ?? null), [fields]);
  const done = s.phase === 'solved' || s.phase === 'revealed';
  const side = width >= 820;
  const sceneWidth = side ? Math.floor(width * 0.62) : width;
  /** Ancho útil dentro de la tarjeta (16 de relleno a cada lado). */
  const inner = sceneWidth - 32;
  const t = VISUAL_COPY;

  const write = (digit: string | null) => {
    if (!active) return;
    const current = s.work.values[active as keyof typeof s.work.values] ?? '';
    const value = digit === null ? current.slice(0, -1) : current + digit;
    dispatch({ type: 'work', action: { type: 'setValue', field: active as never, value } });
  };

  let scene = null;
  if (m.kind === 'tenFrame' && s.work.kind === 'tenFrame') {
    scene = (
      <TenFrameBoard
        capacity={m.capacity}
        cells={s.work.cells}
        fixed={m.start}
        width={Math.min(inner, 560)}
        disabled={done}
        onToggle={(index) => dispatch({ type: 'work', action: { type: 'toggleCell', index } })}
        cellLabel={(i, on) => (lang === 'es' ? `Casilla ${i + 1}${on ? ', con semilla' : ', vacía'}` : `Square ${i + 1}${on ? ', with a seed' : ', empty'}`)}
      />
    );
  } else if (m.kind === 'equalGroups' && s.work.kind === 'equalGroups') {
    scene = (
      <GardenPlots
        counts={s.work.counts}
        capacity={groupCapacity(m)}
        width={inner}
        editable={m.task === 'build'}
        disabled={done}
        onAdd={(group) => dispatch({ type: 'work', action: { type: 'addToGroup', group } })}
        onRemove={(group) => dispatch({ type: 'work', action: { type: 'removeFromGroup', group } })}
        plotLabel={(g, n) => `${t.plot[lang](g + 1)}: ${n}`}
        addLabel={lang === 'es' ? 'Plantar' : 'Plant'}
        removeLabel={lang === 'es' ? 'Quitar' : 'Remove'}
      />
    );
  } else if (m.kind === 'sharing' && s.work.kind === 'sharing') {
    const placement = s.work.placement;
    const containerName = m.mode === 'partitive' ? t.plate[lang] : t.bag[lang];
    scene = (
      <SharingBoard
        tokens={m.tokenIds.map((id) => ({ id, where: placement[id] ?? null }))}
        containers={m.containerIds.map((id, i) => ({ id, label: containerName(i + 1) }))}
        kind={m.mode === 'partitive' ? 'plate' : 'bag'}
        selected={s.selected}
        width={inner}
        disabled={done}
        trayLabel={t.tray[lang]}
        tokenLabel={(n, where) => t.cookie[lang](n, where)}
        onToken={(id) => dispatch({ type: 'select', token: id })}
        onTarget={(to) => s.selected && dispatch({ type: 'work', action: { type: 'place', token: s.selected, to } })}
      />
    );
  }

  const ev = s.evaluation;
  const message = s.phase === 'revealed' ? `${t.revealed[lang]} ${ev ? visualFeedback(ev.feedbackKey, ev.feedbackParams, lang) : ''}` : ev ? visualFeedback(ev.feedbackKey, ev.feedbackParams, lang) : '';
  const example = parallelExample(m);
  const equation = visualEquation(m, done);

  const answers = fields.length ? (
    <View style={[styles.answers, side && styles.answersSide]}>
      <AnswerBoxes boxes={fields.map((f) => ({ key: f, label: visualFieldLabel(f, m, lang), value: s.work.values[f] ?? '' }))} active={active} onFocus={setActive} disabled={done} />
      {!done && <DigitPad onKey={write} onBack={() => write(null)} compact={layout.phone} disabled={done} backLabel={lang === 'es' ? 'Borrar' : 'Delete'} />}
    </View>
  ) : null;

  return (
    <View style={styles.wrap}>
      <View style={styles.promptCard}>
        <Text style={[styles.prompt, layout.phone && styles.promptSmall]}>{visualPrompt(m, lang)}</Text>
        <View style={styles.left}>
          <Button label={`🔊 ${MATH_COPY.listen[lang]}`} variant="secondary" onPress={() => speak(visualPrompt(m, lang), lang)} />
        </View>
      </View>

      <View style={[styles.body, side && styles.bodySide]}>
        <View style={[styles.sceneCard, side && { width: sceneWidth }]}>
          {scene}
          {equation ? <Text style={styles.equation}>{equation}</Text> : null}
          {!done && <Text style={styles.howTo}>{visualHowTo(m, lang)}</Text>}
        </View>
        {answers}
      </View>

      {s.hintLevel > 0 && (
        <View style={styles.hints}>
          {([1, 2, 3] as const)
            .filter((l) => l <= s.hintLevel)
            .map((l) => (
              <View key={l} style={styles.hint}>
                <Text style={styles.hintTitle}>{MATH_COPY.hintTitles[lang][l - 1]}</Text>
                <Text style={styles.hintText}>{visualHint(m, l, example, lang)}</Text>
              </View>
            ))}
        </View>
      )}

      {message ? (
        <Text style={[styles.message, done && styles.messageDone]} accessibilityLiveRegion="polite">
          {message}
        </Text>
      ) : null}

      <View style={styles.actions}>
        {done ? (
          <Button label={nextLabel ?? MATH_COPY.next[lang]} large onPress={() => onNext(s)} />
        ) : (
          <>
            {s.hintLevel < 3 && <Button label={s.hintLevel === 0 ? MATH_COPY.hint[lang] : MATH_COPY.moreHelp[lang]} variant="secondary" onPress={() => dispatch({ type: 'hint' })} />}
            {m.kind !== 'equalGroups' || m.task === 'build' ? <Button label={t.undo[lang]} variant="secondary" onPress={() => dispatch({ type: 'undo' })} disabled={!s.history.length} /> : null}
            {m.kind !== 'equalGroups' || m.task === 'build' ? <Button label={t.reset[lang]} variant="secondary" onPress={() => dispatch({ type: 'reset' })} /> : null}
            {canReveal(s) && <Button label={t.reveal[lang]} variant="secondary" onPress={() => dispatch({ type: 'reveal' })} />}
            <Button label={MATH_COPY.check[lang]} onPress={() => dispatch({ type: 'submit' })} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  left: { flexDirection: 'row' },
  promptCard: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 18, gap: 10, boxShadow: shadows.card },
  prompt: { fontFamily: fontFamily.read.bold, fontSize: 22, lineHeight: 32, color: colors.ink },
  promptSmall: { fontSize: 19, lineHeight: 28 },
  body: { gap: 14 },
  bodySide: { flexDirection: 'row', alignItems: 'flex-start' },
  sceneCard: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 16, gap: 12, alignItems: 'center', boxShadow: shadows.card },
  equation: { fontFamily: fontFamily.ui.black, fontSize: 28, color: manip.ink },
  howTo: { fontFamily: fontFamily.ui.semibold, fontSize: 15, color: manip.blue, textAlign: 'center' },
  answers: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 16, gap: 14, alignItems: 'center', boxShadow: shadows.card },
  answersSide: { flex: 1 },
  hints: { gap: 8 },
  hint: { backgroundColor: colors.warnTint, borderRadius: radius.tile, padding: 12, gap: 2 },
  hintTitle: { fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.orangeDeep },
  hintText: { fontFamily: fontFamily.read.regular, fontSize: 18, lineHeight: 26, color: colors.ink },
  message: { fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.inkSoft, textAlign: 'center' },
  messageDone: { color: colors.ok },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
});

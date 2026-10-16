import { StyleSheet, Text, View } from 'react-native';
import type { TaskResult, UnitTask } from '@lee-conmigo/science-content';
import { CIENCIA_COPY, type CienciaLang } from '@lee-conmigo/ui-core';
import { Button, colors, fontFamily, OptionList, radius } from '@lee-conmigo/ui-native';

export type Picks = Record<string, string[]>;

interface TaskPanelProps {
  task: UnitTask;
  lang: CienciaLang;
  picks: Picks;
  onPicks: (next: Picks) => void;
  /** Escalón de pista abierto (0 = ninguna). */
  hintLevel: 0 | 1 | 2 | 3;
  onHint: () => void;
  /** Resultado de la última comprobación. */
  result?: TaskResult;
  /** Ya terminó la tarea (bien hecha o «lo veo luego»): las opciones quedan fijas. */
  done: 'ok' | 'skipped' | undefined;
  onCheck: () => void;
  onSkip: () => void;
  small?: boolean;
}

/** ¿Elige varias? Cuando la tarea pide 2 o más. */
const isMulti = (min: number) => min > 1;

/**
 * Una tarea evaluada de la unidad (observar, predecir, explicar…): cada parte es una pregunta de elegir; «Comprobar» da
 * retroalimentación de COMPAÑÍA (nunca «incorrecto»), la pista sube de a un escalón y «Lo veo luego» siempre está (nunca se
 * bloquea al niño). Lo que se evalúa lo decide `evaluateTask` (puro y probado), no esta pantalla.
 */
export function TaskPanel({ task, lang, picks, onPicks, hintLevel, onHint, result, done, onCheck, onSkip, small }: TaskPanelProps) {
  const c = CIENCIA_COPY;
  const ready = task.parts.every((p) => (picks[p.id]?.length ?? 0) >= Math.max(1, p.min));
  const toggle = (partId: string, multi: boolean) => (id: string) => {
    const cur = picks[partId] ?? [];
    onPicks({ ...picks, [partId]: multi ? (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]) : [id] });
  };
  return (
    <View style={styles.wrap}>
      {task.parts.map((part) => {
        const partResult = result?.parts[part.id];
        const wrong = partResult?.outcome === 'wrong';
        return (
          <View key={part.id} style={styles.part}>
            <Text style={[styles.prompt, small && styles.promptSmall]}>{part.prompt[lang]}</Text>
            <OptionList
              small={small}
              multi={isMulti(part.min)}
              disabled={done !== undefined}
              selected={picks[part.id] ?? []}
              onToggle={toggle(part.id, isMulti(part.min))}
              options={part.options.map((o) => ({ id: o.id, text: o.text[lang], state: wrong && !o.valid ? ('rejected' as const) : undefined }))}
            />
          </View>
        );
      })}
      {result && result.outcome !== 'ok' && !done ? (
        <View style={styles.note} accessibilityLiveRegion="polite">
          <Text style={styles.noteText}>{result.feedback[lang]}</Text>
          {result.whyNot.map((w, i) => (
            <Text key={i} style={styles.why}>
              • {w[lang]}
            </Text>
          ))}
        </View>
      ) : null}
      {done === 'ok' ? (
        <View style={[styles.note, styles.ok]} accessibilityLiveRegion="polite">
          <Text style={styles.noteText}>{task.feedback.ok[lang]}</Text>
        </View>
      ) : null}
      {done === 'skipped' ? (
        <View style={styles.note}>
          <Text style={styles.noteText}>{c.screen.skipNote[lang]}</Text>
        </View>
      ) : null}
      {hintLevel > 0 ? (
        <View style={[styles.note, styles.hint]}>
          <Text style={styles.hintKicker}>{c.screen.hintOf(hintLevel)[lang]}</Text>
          <Text style={styles.noteText}>{task.hints[hintLevel - 1][lang]}</Text>
        </View>
      ) : null}
      {!done ? (
        <View style={styles.buttons}>
          <Button label={c.button.check[lang]} disabled={!ready} onPress={onCheck} />
          {hintLevel < 3 ? <Button label={(hintLevel === 0 ? c.button.hint : c.button.moreHelp)[lang]} variant="secondary" onPress={onHint} /> : null}
          <Button label={c.button.later[lang]} variant="secondary" onPress={onSkip} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  part: { gap: 8 },
  prompt: { fontFamily: fontFamily.ui.black, fontSize: 20, lineHeight: 27, color: colors.navy },
  promptSmall: { fontSize: 18, lineHeight: 24 },
  note: { backgroundColor: colors.warnTint, borderRadius: radius.tile, padding: 14, gap: 4 },
  ok: { backgroundColor: colors.okTint },
  hint: { backgroundColor: colors.focusTint },
  noteText: { fontFamily: fontFamily.ui.bold, fontSize: 17, lineHeight: 24, color: colors.ink },
  why: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  hintKicker: { fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.orangeDeep, textTransform: 'uppercase' },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});

/** Los tres tipos de encuentro de las misiones de «Para la vida»: elegir y comparar, ordenar y detectar señales. La lógica viene de `@lee-conmigo/life-content`. */
import type { Dispatch } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { chooseFeedback, sortDisplayOrder, sortStatus, spotCheck, triedNeeded, type ChooseStep, type SessionAction, type SessionState, type SortStep, type SpotStep } from '@lee-conmigo/life-content';
import { VIDA_COPY, type VidaLang } from '@lee-conmigo/ui-core';
import { Button, colors, fontFamily } from '@lee-conmigo/ui-native';
import { Card, Hint, SectionTitle, Tile } from './parts';

interface BodyProps<S> {
  step: S;
  lang: VidaLang;
  session: SessionState;
  dispatch: Dispatch<SessionAction>;
  accent: string;
}

const t = VIDA_COPY;

export function ChooseBody({ step, lang, session, dispatch, accent }: BodyProps<ChooseStep>) {
  const st = session.choose[step.id];
  const picked = st?.picked ? step.options.find((o) => o.id === st.picked) : undefined;
  const fb = chooseFeedback(step, st?.picked);
  return (
    <View style={styles.body}>
      <Card tone="soft" accent={accent}>
        <SectionTitle accent={accent}>{t.choose.paths[lang]}</SectionTitle>
        <Text style={styles.scenario}>{step.scenario[lang]}</Text>
      </Card>
      <Text style={styles.small}>{t.choose.tap[lang]}</Text>
      <View style={styles.stack}>
        {step.options.map((o) => (
          <Tile key={o.id} label={o.text[lang]} accent={accent} state={o.id === st?.picked ? 'on' : st?.tried.includes(o.id) ? 'seen' : undefined} onPress={() => dispatch({ type: 'choose.pick', stepId: step.id, optionId: o.id })} />
        ))}
      </View>
      {picked && fb && (
        <Card tone="warm">
          <SectionTitle accent={accent}>{t.choose.whatHappens[lang]}</SectionTitle>
          <Text style={styles.result}>{picked.result[lang]}</Text>
          <Hint kind={fb}>{fb === 'affirm' ? t.choose.affirm[lang] : t.choose.gentle[lang]}</Hint>
        </Card>
      )}
      <Text style={styles.small}>{t.choose.tried[lang](Math.min(st?.tried.length ?? 0, triedNeeded(step)), triedNeeded(step))}</Text>
    </View>
  );
}

export function SortBody({ step, lang, session, dispatch, accent }: BodyProps<SortStep>) {
  const placed = session.sort[step.id] ?? [];
  const status = sortStatus(step, placed);
  const byId = (id: string) => step.items.find((i) => i.id === id)!;
  const rest = sortDisplayOrder(step).filter((i) => !placed.includes(i.id));
  return (
    <View style={styles.body}>
      <Card tone="soft" accent={accent}>
        <SectionTitle accent={accent}>{t.sort.yourOrder[lang]}</SectionTitle>
        {placed.length === 0 ? <Text style={styles.small}>{t.sort.empty[lang]}</Text> : <Text style={styles.small}>{t.sort.removeHint[lang]}</Text>}
        <View style={styles.stack}>
          {placed.map((id, i) => (
            <Tile key={id} label={byId(id).text[lang]} accent={accent} state="on" badge={String(i + 1)} onPress={() => dispatch({ type: 'sort.remove', stepId: step.id, itemId: id })} />
          ))}
        </View>
        <Text style={styles.small}>{t.sort.placed[lang](placed.length, step.items.length)}</Text>
      </Card>
      {rest.length > 0 && (
        <View style={styles.stack}>
          <SectionTitle accent={accent}>{t.sort.cards[lang]}</SectionTitle>
          {rest.map((i) => (
            <Tile key={i.id} label={i.text[lang]} accent={accent} onPress={() => dispatch({ type: 'sort.place', stepId: step.id, itemId: i.id })} />
          ))}
        </View>
      )}
      {status === 'wrong' && (
        <View style={styles.stack}>
          <Hint kind="gentle">{t.sort.wrong[lang]}</Hint>
          <Hint kind="info">{step.hint[lang]}</Hint>
        </View>
      )}
      {status === 'solved' && (
        <View style={styles.stack}>
          <Hint kind="affirm">{t.sort.solved[lang]}</Hint>
          <Text style={styles.small}>{step.solvedNote[lang]}</Text>
        </View>
      )}
      {placed.length > 0 && <Button label={t.button.startOver[lang]} variant="secondary" onPress={() => dispatch({ type: 'sort.reset', stepId: step.id })} />}
    </View>
  );
}

export function SpotBody({ step, lang, session, dispatch, accent }: BodyProps<SpotStep>) {
  const marked = session.spot[step.id] ?? [];
  const check = spotCheck(step, marked);
  return (
    <View style={styles.body}>
      <Card tone="soft" accent={accent}>
        <Text style={styles.scenario}>{step.context[lang]}</Text>
      </Card>
      <Text style={styles.small}>{t.spot.mark[lang]}</Text>
      <View style={styles.stack}>
        {step.items.map((it) => {
          const on = marked.includes(it.id);
          return (
            <View key={it.id} style={styles.stack}>
              <Tile label={it.text[lang]} accent={accent} role="checkbox" state={on ? 'on' : undefined} onPress={() => dispatch({ type: 'spot.toggle', stepId: step.id, itemId: it.id })} />
              {on && <Text style={styles.why}>{it.why[lang]}</Text>}
            </View>
          );
        })}
      </View>
      {marked.length > 0 && <Hint kind={check.exact ? 'affirm' : 'gentle'}>{check.exact ? t.spot.exact[lang] : t.spot.lookAgain[lang]}</Hint>}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: 14 },
  stack: { gap: 10, alignSelf: 'stretch' },
  small: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.inkSoft },
  scenario: { fontFamily: fontFamily.read.regular, fontSize: 18, lineHeight: 26, color: colors.ink },
  result: { fontFamily: fontFamily.read.regular, fontSize: 17, lineHeight: 25, color: colors.ink },
  why: { fontFamily: fontFamily.ui.bold, fontSize: 14, lineHeight: 20, color: colors.inkSoft, paddingHorizontal: 8 },
});

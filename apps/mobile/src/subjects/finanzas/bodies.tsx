/** Los seis encuentros de la unidad F4-U01, uno por tipo de paso. Toda la lógica viene de `@lee-conmigo/finance-content`; aquí solo se dibuja. */
import { useState, type Dispatch } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  alternativesView, balanceChoices, condKey, feedbackFor, freeable, ledgerView, offerView, planIssues, priorityResult, projectDone, projectPlan, protects, reserveView, unassigned,
  type AlternativesStep, type LedgerStep, type OfferStep, type PrioritiesStep, type ProjectStep, type ReserveStep, type SessionAction, type SessionState,
} from '@lee-conmigo/finance-content';
import { FINANZAS_COPY, type FinanzasLang } from '@lee-conmigo/ui-core';
import { Button, colors, fontFamily, radius, shadows } from '@lee-conmigo/ui-native';
import { Card, Choices, EnvelopeCard, Hint, SectionTitle, TEAL, Toggle, Um } from './parts';

interface BodyProps<S> {
  step: S;
  lang: FinanzasLang;
  session: SessionState;
  dispatch: Dispatch<SessionAction>;
}

const t = FINANZAS_COPY;

// ---------------------------------------------------------------------------------------------
// F4.1 Qué atender primero
// ---------------------------------------------------------------------------------------------
export function PrioritiesBody({ step, lang, session, dispatch }: BodyProps<PrioritiesStep>) {
  const cond = session.priorities.cond;
  const picked = session.priorities.picks[condKey(cond)];
  const tried = Object.keys(session.priorities.picks).length;
  const result = picked ? priorityResult(step, cond, picked) : undefined;
  const neededLabels = result?.needed.map((id) => step.items.find((i) => i.id === id)!.label[lang]).join(', ');
  return (
    <View style={styles.body}>
      <Card tone="teal">
        <SectionTitle>{t.priorities.situation[lang]}</SectionTitle>
        <View style={styles.row}>
          <Text style={styles.strong}>{t.priorities.budget[lang](step.budget)}</Text>
        </View>
        {step.conditions.map((c) => (
          <Toggle key={c.id} offLabel={c.off[lang]} onLabel={c.on[lang]} value={cond[c.id]} onChange={(value) => dispatch({ type: 'priorities.condition', id: c.id, value })} />
        ))}
      </Card>
      <Choices
        items={step.items.map((i) => ({ id: i.id, text: i.label[lang], note: <Um amount={i.cost} size="sm" /> }))}
        selectedId={picked}
        onSelect={(itemId) => dispatch({ type: 'priorities.pick', itemId })}
      />
      {result && (
        <View style={styles.stack}>
          {!result.affordable ? <Hint kind="gentle">{t.priorities.notEnough[lang]}</Hint> : <Hint kind={result.fine ? 'affirm' : 'gentle'}>{result.fine ? (result.needed.length === 0 ? t.priorities.nothingNeeded[lang] : t.priorities.fine[lang]) : t.priorities.canWait[lang]}</Hint>}
          {!result.fine && result.needed.length > 0 && <Hint kind="info">{t.priorities.needNow[lang](neededLabels!)}</Hint>}
          {result.affordable && <Text style={styles.small}>{t.priorities.leftover[lang](result.leftover)}</Text>}
        </View>
      )}
      <Text style={styles.small}>{t.priorities.tried[lang](Math.min(tried, 2))}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------------------------
// F4.2 Alternativas de verdad (costo de oportunidad)
// ---------------------------------------------------------------------------------------------
export function AlternativesBody({ step, lang, session, dispatch }: BodyProps<AlternativesStep>) {
  const a = session.alternatives;
  const view = alternativesView(step, session);
  const result = view.result;
  const bestId = result?.bestDiscarded?.id;
  const rank = (id: string) => (a.first === id ? t.alternatives.first[lang] : a.second === id ? t.alternatives.second[lang] : undefined);
  const leftFb = a.left !== undefined ? feedbackFor(bestId ? [bestId] : [], a.left) : undefined;
  const leftoverFb = feedbackFor(['remain'], a.leftover);
  return (
    <View style={styles.body}>
      <Text style={styles.strong}>{t.alternatives.budget[lang](step.budget)}</Text>

      <Card>
        <SectionTitle>{t.alternatives.stepNotFit[lang]}</SectionTitle>
        <Text style={styles.prompt}>{step.tapNotFit[lang]}</Text>
        <View style={styles.stack}>
          {step.options.map((o) => {
            const marked = a.notFit.includes(o.id);
            return (
              <Pressable key={o.id} onPress={() => dispatch({ type: 'alternatives.toggleNotFit', id: o.id })} accessibilityRole="checkbox" accessibilityState={{ checked: marked }} accessibilityLabel={`${o.label[lang]}, ${o.cost} UM`} style={[styles.option, marked && styles.optionMarked]}>
                <Text style={styles.optionName}>{marked ? '✕ ' : ''}{o.label[lang]}</Text>
                <View style={styles.optionRight}>
                  <Um amount={o.cost} size="sm" />
                  {marked && <Text style={styles.tag}>{t.alternatives.notFits[lang]}</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>
        {view.markedRight ? <Hint kind="affirm">{t.alternatives.notFitDone[lang]}</Hint> : a.notFit.length > 0 ? <Hint kind="gentle">{t.alternatives.notFitMore[lang]}</Hint> : null}
      </Card>

      {view.markedRight && (
        <Card>
          <SectionTitle>{t.alternatives.stepPrefer[lang]}</SectionTitle>
          <Text style={styles.prompt}>{step.preferPrompt[lang]}</Text>
          <View style={styles.stack}>
            {view.viable.map((o) => {
              const r = rank(o.id);
              return (
                <Pressable key={o.id} onPress={() => dispatch({ type: 'alternatives.prefer', id: o.id })} accessibilityRole="button" accessibilityLabel={`${o.label[lang]}, ${o.cost} UM${r ? `, ${r}` : ''}`} style={[styles.option, !!r && styles.optionPicked]}>
                  <Text style={styles.optionName}>{o.label[lang]}</Text>
                  <View style={styles.optionRight}>
                    <Um amount={o.cost} size="sm" />
                    {r && <Text style={styles.tag}>{r}</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>
          {a.first && <Button label={t.button.chooseAgain[lang]} variant="secondary" onPress={() => dispatch({ type: 'alternatives.resetPrefer' })} />}
        </Card>
      )}

      {result?.chosen && a.second && (
        <Card>
          <SectionTitle>{t.alternatives.stepLeft[lang]}</SectionTitle>
          <Text style={styles.prompt}>{step.leftPrompt[lang]}</Text>
          <Choices items={step.options.filter((o) => o.id !== a.first).map((o) => ({ id: o.id, text: o.label[lang] }))} selectedId={a.left} onSelect={(id) => dispatch({ type: 'alternatives.left', id })} />
          {leftFb === 'affirm' && <Hint kind="affirm">{t.alternatives.leftNote[lang](result.bestDiscarded!.label[lang])}</Hint>}
          {leftFb === 'gentle' && <Hint kind="gentle">{step.options.some((o) => o.id === a.left && o.cost > step.budget) ? t.alternatives.notFitMore[lang] : t.alternatives.notFitDone[lang]}</Hint>}
        </Card>
      )}

      {result?.chosen && a.left !== undefined && (
        <Card>
          <SectionTitle>{t.alternatives.stepLeftover[lang]}</SectionTitle>
          <Text style={styles.small}>{t.alternatives.leftoverIs[lang](result.leftover)}</Text>
          <Text style={styles.prompt}>{step.leftoverPrompt[lang]}</Text>
          <Choices items={step.leftoverChoices.map((c) => ({ id: c.id, text: c.text[lang] }))} selectedId={a.leftover} onSelect={(id) => dispatch({ type: 'alternatives.leftover', id })} />
          {leftoverFb && <Hint kind={leftoverFb}>{leftoverFb === 'affirm' ? t.alternatives.leftoverRight[lang] : t.alternatives.leftoverGentle[lang]}</Hint>}
        </Card>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------------------------
// F4.3 Un registro en orden
// ---------------------------------------------------------------------------------------------
export function LedgerBody({ step, lang, session, dispatch }: BodyProps<LedgerStep>) {
  const c = step.cases[0]!;
  const view = ledgerView(step, 0);
  const chosen = session.ledger.balance;
  const kind = chosen !== undefined ? balanceChoices(c).find((b) => b.value === chosen)?.kind : undefined;
  const missingFb = session.ledger.missing !== undefined ? feedbackFor(view.missingDirection ? [view.missingDirection] : [], session.ledger.missing) : undefined;
  const revealed = chosen === view.final;
  return (
    <View style={styles.body}>
      <Card>
        <Text style={styles.strong}>{t.ledger.start[lang](c.start)}</Text>
        <View style={styles.tableHead}>
          <Text style={[styles.th, styles.cellConcept]}>{t.ledger.concept[lang]}</Text>
          <Text style={[styles.th, styles.cellNum]}>{t.ledger.kindIn[lang]}</Text>
          <Text style={[styles.th, styles.cellNum]}>{t.ledger.kindOut[lang]}</Text>
          {revealed && <Text style={[styles.th, styles.cellNum]}>{t.ledger.balance[lang]}</Text>}
        </View>
        {c.movements.map((m, i) => (
          <View key={m.id} style={styles.tr}>
            <Text style={[styles.td, styles.cellConcept]}>{m.concept[lang]}</Text>
            <Text style={[styles.td, styles.cellNum, styles.tdIn]}>{m.kind === 'in' ? `+${m.amount}` : ''}</Text>
            <Text style={[styles.td, styles.cellNum]}>{m.kind === 'out' ? `−${m.amount}` : ''}</Text>
            {revealed && <Text style={[styles.td, styles.cellNum, styles.tdBal]}>{view.rows[i]!.balance}</Text>}
          </View>
        ))}
      </Card>

      <Text style={styles.prompt}>{step.balancePrompt[lang]}</Text>
      <Choices items={view.choices.map((b) => ({ id: String(b.value), text: `${b.value} UM` }))} selectedId={chosen !== undefined ? String(chosen) : undefined} onSelect={(id) => dispatch({ type: 'ledger.balance', value: Number(id) })} />
      {kind && <Hint kind={kind === 'right' ? 'affirm' : 'gentle'}>{t.ledger.hint[kind][lang]}</Hint>}
      {revealed && <Text style={styles.small}>{t.ledger.check[lang](view.final)}</Text>}

      {revealed && (
        <Card tone="warm">
          <SectionTitle>{t.ledger.missingTitle[lang]}</SectionTitle>
          <Text style={styles.prompt}>{step.missingPrompt[lang]}</Text>
          <Choices items={step.missingChoices.map((m) => ({ id: m.id, text: m.text[lang] }))} selectedId={session.ledger.missing} onSelect={(id) => dispatch({ type: 'ledger.missing', id })} />
          {missingFb && <Hint kind={missingFb}>{missingFb === 'affirm' ? t.ledger.missingRight[lang] : t.ledger.missingGentle[lang]}</Hint>}
        </Card>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------------------------
// F4.4 Una reserva para imprevistos
// ---------------------------------------------------------------------------------------------
export function ReserveBody({ step, lang, session, dispatch }: BodyProps<ReserveStep>) {
  const r = session.reserve;
  const view = reserveView(step);
  const smallR = view.small;
  const bigR = view.big;
  const shown = r.paidBig ? bigR.plan : r.paidSmall ? smallR.plan : view.base;
  return (
    <View style={styles.body}>
      <Card tone="teal">
        <SectionTitle>{t.reserve.plan[lang]}</SectionTitle>
        <Text style={styles.small}>{t.project.total[lang](shown.budget)}</Text>
        <View style={styles.stack}>
          {shown.envelopes.map((e) => (
            <EnvelopeCard key={e.id} lang={lang} label={e.label[lang]} kind={e.kind} amount={e.amount} cost={e.cost} />
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle>{t.reserve.small[lang]}</SectionTitle>
        <Text style={styles.prompt}>{step.unexpectedLabel[lang]} · {step.smallUnexpected} UM</Text>
        {!r.paidSmall ? (
          <Button label={t.reserve.payWithReserve[lang]} onPress={() => dispatch({ type: 'reserve.paySmall' })} />
        ) : (
          <View style={styles.stack}>
            <Hint kind="info">{t.reserve.paid[lang](smallR.paidFromReserve)}</Hint>
            <Text style={styles.small}>{t.reserve.left[lang](smallR.plan.envelopes.find((e) => e.kind === 'reserve')?.amount ?? 0)}</Text>
          </View>
        )}
      </Card>

      {r.paidSmall && (
        <Card>
          <SectionTitle>{t.reserve.big[lang]}</SectionTitle>
          <Text style={styles.small}>{t.reserve.otherDay[lang]}</Text>
          <Text style={styles.prompt}>{step.unexpectedLabel[lang]} · {step.bigUnexpected} UM</Text>
          {!r.paidBig ? (
            <Button label={t.reserve.payWithReserve[lang]} onPress={() => dispatch({ type: 'reserve.payBig' })} />
          ) : (
            <View style={styles.stack}>
              <Hint kind="info">{t.reserve.paid[lang](bigR.paidFromReserve)}</Hint>
              {bigR.shortfall > 0 && <Hint kind="gentle">{t.reserve.short[lang](bigR.shortfall)}</Hint>}
              <Text style={styles.small}>{t.reserve.freeAvailable[lang](freeable(bigR.plan))}</Text>
            </View>
          )}
        </Card>
      )}

      {r.paidBig && (
        <Card>
          <SectionTitle>{t.reserve.adjustTitle[lang]}</SectionTitle>
          <Text style={styles.prompt}>{step.adjustPrompt[lang]}</Text>
          <Choices items={step.adjustChoices.map((c) => ({ id: c.id, text: c.text[lang] }))} selectedId={r.adjust} onSelect={(id) => dispatch({ type: 'reserve.adjust', id })} />
        </Card>
      )}

      {r.adjust !== undefined && (
        <Card>
          <SectionTitle>{t.reserve.rebuildTitle[lang]}</SectionTitle>
          <Text style={styles.prompt}>{step.rebuildPrompt[lang]}</Text>
          <Choices items={step.rebuildChoices.map((c) => ({ id: c.id, text: c.text[lang] }))} selectedId={r.rebuild} onSelect={(id) => dispatch({ type: 'reserve.rebuild', id })} />
          {r.rebuild !== undefined && <Hint kind="info">{t.reserve.answered[lang]}</Hint>}
        </Card>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------------------------
// F4.7 Una oferta sospechosa (buzón de mentira)
// ---------------------------------------------------------------------------------------------
export function OfferBody({ step, lang, session, dispatch }: BodyProps<OfferStep>) {
  const signals = Object.keys(step.signalLabels) as (keyof OfferStep['signalLabels'])[];
  const actions = Object.keys(step.actionLabels) as (keyof OfferStep['actionLabels'])[];
  return (
    <View style={styles.body}>
      <Hint kind="info">{t.offer.reminder[lang]}</Hint>
      {step.messages.map((m, idx) => {
        const marked = session.offer.marks[m.id] ?? [];
        const v = offerView(step, session, m.id);
        const action = session.offer.actions[m.id];
        const actionOk = action !== undefined && m.preferredActions.includes(action as never);
        return (
          <Card key={m.id} tone="warm">
            <SectionTitle>{`✉ ${t.offer.mailbox[lang]} · ${t.offer.message[lang](idx + 1, step.messages.length)}`}</SectionTitle>
            <View style={styles.mail}>
              <Text style={styles.mailText}>{m.text[lang]}</Text>
            </View>
            <Text style={styles.prompt}>{step.signalsPrompt[lang]}</Text>
            <View style={styles.chips}>
              {signals.map((s) => {
                const on = marked.includes(s);
                return (
                  <Pressable key={s} onPress={() => dispatch({ type: 'offer.toggleSignal', messageId: m.id, signal: s })} accessibilityRole="checkbox" accessibilityState={{ checked: on }} style={[styles.chip, on && styles.chipOn]}>
                    <Text style={[styles.chipText, on && styles.chipTextOn]}>{on ? '✓ ' : ''}{step.signalLabels[s][lang]}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.prompt}>{step.actionPrompt[lang]}</Text>
            <Choices items={actions.map((a) => ({ id: a, text: step.actionLabels[a][lang] }))} selectedId={action} onSelect={(a) => dispatch({ type: 'offer.action', messageId: m.id, action: a })} />
            {action !== undefined && (
              <View style={styles.stack}>
                <Hint kind={v.check.exact ? 'affirm' : 'gentle'}>{v.check.exact ? (m.signals.length === 0 ? t.offer.exactNone[lang] : t.offer.exact[lang]) : t.offer.lookAgain[lang]}</Hint>
                <Hint kind={actionOk ? 'affirm' : 'gentle'}>{actionOk ? t.offer.actionFits[lang] : t.offer.actionGentle[lang]}</Hint>
              </View>
            )}
          </Card>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------------------------
// F4.8 Proyecto: un evento que resiste cambios
// ---------------------------------------------------------------------------------------------
export function ProjectBody({ step, lang, session, dispatch }: BodyProps<ProjectStep>) {
  const [from, setFrom] = useState<string | null>(null);
  const plan = projectPlan(step, session);
  const issues = planIssues(plan);
  const valid = projectDone(step, session);
  const fromName = from ? plan.envelopes.find((e) => e.id === from)?.label[lang] : undefined;
  const before = protects({ budget: step.plan.budget, envelopes: step.plan.envelopes });
  const now = protects(plan);
  const tap = (id: string) => {
    if (from === null) setFrom(id);
    else if (from === id) setFrom(null);
    else {
      dispatch({ type: 'project.move', step, from, to: id });
      setFrom(null);
    }
  };
  return (
    <View style={styles.body}>
      <Card tone="teal">
        <SectionTitle>{t.reserve.plan[lang]}</SectionTitle>
        <View style={styles.row}>
          <Text style={styles.small}>{t.project.total[lang](plan.budget)}</Text>
          <Text style={styles.small}>{t.project.unassigned[lang](unassigned(plan))}</Text>
        </View>
        <Text style={styles.prompt}>{fromName ? `${t.project.from[lang](fromName)} · ${t.project.pickTo[lang]}` : t.project.howTo[lang]}</Text>
        <View style={styles.stack}>
          {plan.envelopes.map((e) => (
            <EnvelopeCard key={e.id} lang={lang} label={e.label[lang]} kind={e.kind} amount={e.amount} cost={e.cost} selected={from === e.id} onPress={() => tap(e.id)} />
          ))}
        </View>
        <View style={styles.row}>
          <Text style={styles.small}>{t.project.moved[lang](session.project.moved)}</Text>
          <Button label={t.project.reset[lang]} variant="secondary" onPress={() => { setFrom(null); dispatch({ type: 'project.reset' }); }} />
        </View>
      </Card>

      {valid ? <Hint kind="affirm">{t.project.valid[lang]}</Hint> : issues.map((i) => <Hint key={i} kind="gentle">{t.project.issue[i][lang]}</Hint>)}

      {valid && (
        <Card>
          <SectionTitle>{t.project.compareTitle[lang]}</SectionTitle>
          <Text style={styles.prompt}>{step.comparePrompt[lang]}</Text>
          <View style={styles.tableHead}>
            <Text style={[styles.th, styles.cellConcept]} />
            <Text style={[styles.th, styles.cellNum]}>{t.project.before[lang]}</Text>
            <Text style={[styles.th, styles.cellNum]}>{t.project.after[lang]}</Text>
          </View>
          <View style={styles.tr}>
            <Text style={[styles.td, styles.cellConcept]}>{t.project.essentialRow[lang]}</Text>
            <Text style={[styles.td, styles.cellNum]}>{before.essentialsCovered ? '✓' : '—'}</Text>
            <Text style={[styles.td, styles.cellNum]}>{now.essentialsCovered ? '✓' : '—'}</Text>
          </View>
          <View style={styles.tr}>
            <Text style={[styles.td, styles.cellConcept]}>{t.project.reserveRow[lang]}</Text>
            <Text style={[styles.td, styles.cellNum]}>{before.reserve}</Text>
            <Text style={[styles.td, styles.cellNum]}>{now.reserve}</Text>
          </View>
          <View style={styles.tr}>
            <Text style={[styles.td, styles.cellConcept]}>{t.project.optionalRow[lang]}</Text>
            <Text style={[styles.td, styles.cellNum]}>{before.optionalKept}</Text>
            <Text style={[styles.td, styles.cellNum]}>{now.optionalKept}</Text>
          </View>
          <Hint kind="info">{t.project.noWinner[lang]}</Hint>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: 14 },
  stack: { gap: 10, alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 },
  strong: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.ink },
  small: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.inkSoft },
  prompt: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, lineHeight: 22, color: colors.ink },
  option: { minHeight: 64, borderRadius: radius.tile, backgroundColor: '#f7f9fd', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderWidth: 2, borderColor: 'transparent' },
  optionMarked: { backgroundColor: '#fff1c2', borderColor: colors.warn },
  optionPicked: { backgroundColor: '#e3f7f4', borderColor: TEAL },
  optionName: { flex: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.ink },
  optionRight: { alignItems: 'flex-end', gap: 2 },
  tag: { fontFamily: fontFamily.ui.black, fontSize: 12, color: colors.inkSoft },
  tableHead: { flexDirection: 'row', alignItems: 'center', gap: 6, borderBottomWidth: 2, borderBottomColor: colors.line, paddingBottom: 6 },
  tr: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.chip },
  th: { fontFamily: fontFamily.ui.black, fontSize: 12, color: colors.muted, textTransform: 'uppercase' },
  td: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.ink },
  tdIn: { color: colors.okDark },
  tdBal: { fontFamily: fontFamily.ui.black },
  cellConcept: { flex: 1 },
  cellNum: { width: 62, textAlign: 'right' },
  mail: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, boxShadow: shadows.soft },
  mailText: { fontFamily: fontFamily.read.regular, fontSize: 17, lineHeight: 25, color: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 48, borderRadius: radius.pill, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: '#ffffff', boxShadow: shadows.soft },
  chipOn: { backgroundColor: TEAL },
  chipText: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.ink },
  chipTextOn: { color: '#ffffff', fontFamily: fontFamily.ui.extrabold },
});

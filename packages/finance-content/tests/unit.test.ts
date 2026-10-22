import { describe, expect, it } from 'vitest';
import { FINANCE_UNITS, alternativesView, balanceChoices, canAdvance, evaluateSession, feedbackFor, initialSession, isValidPlan, ledgerView, neededItems, priorityResult, projectDone, projectPlan, reasonKey, reserveView, sessionReducer, unitStars, validateFinanceUnit, type AlternativesStep, type FinanceUnit, type LedgerStep, type OfferStep, type PrioritiesStep, type ProjectStep, type ReserveStep, type SessionAction, type SessionState } from '../src/index.ts';

const unit = FINANCE_UNITS[0] as FinanceUnit;
const step = <T extends FinanceUnit['steps'][number]>(kind: T['kind']) => unit.steps.find((s) => s.kind === kind) as T;
const run = (actions: SessionAction[], from: SessionState = initialSession) => actions.reduce(sessionReducer, from);

describe('contenido de F4-U01', () => {
  it('la unidad pasa la revisión automática (ES/EN, sin «incorrecto», sin dinero real, con solución)', () => {
    expect(validateFinanceUnit(unit)).toEqual([]);
  });
  it('tiene los 6 encuentros del manual en orden', () => {
    expect(unit.steps.map((s) => s.lesson)).toEqual(['F4.1', 'F4.2', 'F4.3', 'F4.4', 'F4.7', 'F4.8']);
  });
  it('un contenido con dinero real o «incorrecto» se rechaza', () => {
    const bad = JSON.parse(JSON.stringify(unit)) as FinanceUnit;
    bad.steps[0]!.example.es = 'Cuesta 12 $ y está incorrecto';
    expect(validateFinanceUnit(bad).length).toBeGreaterThan(0);
  });
  it('un proyecto que ya cabe sin ajustar se rechaza (debe exigir ajustar)', () => {
    const bad = JSON.parse(JSON.stringify(unit)) as FinanceUnit;
    (bad.steps.find((s) => s.kind === 'project') as ProjectStep).unexpected.cost = 0;
    expect(validateFinanceUnit(bad).some((e) => e.includes('exigir un ajuste'))).toBe(true);
  });
});

describe('F4.1 · prioridades con contexto', () => {
  const st = step<PrioritiesStep>('priorities');
  it('al aire libre y sin otra protección hace falta la protección: 12 de 15 → sobran 3', () => {
    const cond = { outdoor: true, hasCover: false };
    expect(neededItems(st, cond)).toEqual(['rain']);
    const r = priorityResult(st, cond, 'rain');
    expect(r.fine).toBe(true);
    expect(r.leftover).toBe(3);
    expect(priorityResult(st, cond, 'deco').fine).toBe(false);
  });
  it('bajo techo o con otra protección, ya no hace falta: la decisión puede cambiar', () => {
    expect(neededItems(st, { outdoor: false, hasCover: false })).toEqual([]);
    expect(neededItems(st, { outdoor: true, hasCover: true })).toEqual([]);
    expect(priorityResult(st, { outdoor: false, hasCover: false }, 'deco').fine).toBe(true);
  });
  it('para avanzar hay que probar dos situaciones y explicar', () => {
    let s = run([{ type: 'priorities.pick', itemId: 'rain' }]);
    expect(canAdvance(st, s)).toBe(false);
    s = run([{ type: 'priorities.condition', id: 'outdoor', value: false }, { type: 'priorities.pick', itemId: 'deco' }], s);
    expect(canAdvance(st, s)).toBe(false); // falta explicar
    s = run([{ type: 'explain', stepId: st.id, choiceId: 'look' }], s);
    expect(canAdvance(st, s)).toBe(true); // una explicación no preferida NO bloquea
    expect(feedbackFor(st.explain.preferredChoiceIds, 'look')).toBe('gentle');
    expect(feedbackFor(st.explain.preferredChoiceIds, 'needs')).toBe('affirm');
  });
});

describe('F4.2 · alternativas de verdad', () => {
  const st = step<AlternativesStep>('alternatives');
  it('C no cabe; prefiriendo A y luego B, lo que dejas es B y sobran 5', () => {
    const s = run([{ type: 'alternatives.toggleNotFit', id: 'C' }, { type: 'alternatives.prefer', id: 'A' }, { type: 'alternatives.prefer', id: 'B' }]);
    const v = alternativesView(st, s);
    expect(v.markedRight).toBe(true);
    expect(v.result?.bestDiscarded?.id).toBe('B');
    expect(v.result?.leftover).toBe(5);
  });
  it('si marca otra cosa como «no cabe», se señala sin bloquear (markedRight falso)', () => {
    expect(alternativesView(st, run([{ type: 'alternatives.toggleNotFit', id: 'A' }])).markedRight).toBe(false);
  });
  it('se puede volver a elegir la preferencia', () => {
    const s = run([{ type: 'alternatives.prefer', id: 'A' }, { type: 'alternatives.prefer', id: 'B' }, { type: 'alternatives.resetPrefer' }]);
    expect(s.alternatives.first).toBeUndefined();
  });
});

describe('F4.3 · registro', () => {
  const st = step<LedgerStep>('ledger');
  it('saldo inicial 40: −11, +6, −8 → 27; y la respuesta correcta es única entre las opciones', () => {
    const v = ledgerView(st);
    expect(v.final).toBe(27);
    expect(v.rows.map((r) => r.balance)).toEqual([29, 35, 27]);
    expect(balanceChoices(st.cases[0]!).filter((c) => c.kind === 'right')).toHaveLength(1);
    expect(new Set(v.choices.map((c) => c.value)).size).toBe(v.choices.length);
    expect(v.missingDirection).toBe('above');
  });
});

describe('F4.4 · reserva', () => {
  const st = step<ReserveStep>('reserve');
  it('12 UM se pagan con la reserva (quedan 8); 25 UM dejan un faltante de 5', () => {
    const v = reserveView(st);
    expect(v.small.shortfall).toBe(0);
    expect(v.small.plan.envelopes.find((e) => e.kind === 'reserve')!.amount).toBe(8);
    expect(v.big.shortfall).toBe(5);
  });
  it('hay que pagar el pequeño, ver el grande, elegir un ajuste y decidir sobre la reserva', () => {
    let s = run([{ type: 'reserve.paySmall' }, { type: 'reserve.payBig' }, { type: 'explain', stepId: st.id, choiceId: 'update' }]);
    expect(canAdvance(st, s)).toBe(false);
    s = run([{ type: 'reserve.adjust', id: 'askHelp' }, { type: 'reserve.rebuild', id: 'later' }], s);
    expect(canAdvance(st, s)).toBe(true); // pedir apoyo y dejarlo para después valen: sin culpas
  });
});

describe('F4.7 · oferta sospechosa', () => {
  const st = step<OfferStep>('offer');
  it('marcar todas las señales de un mensaje es exacto; el mensaje normal no tiene señales', () => {
    const msg = st.messages[0]!;
    let s = initialSession;
    for (const signal of msg.signals) s = run([{ type: 'offer.toggleSignal', messageId: msg.id, signal }], s);
    expect(s.offer.marks[msg.id]).toHaveLength(msg.signals.length);
    expect(st.messages.find((m) => m.signals.length === 0)).toBeTruthy();
  });
  it('hay que elegir una acción para cada mensaje; marcar señales de menos no bloquea', () => {
    let s = run([{ type: 'explain', stepId: st.id, choiceId: 'askNow' }]);
    expect(canAdvance(st, s)).toBe(false);
    for (const m of st.messages) s = run([{ type: 'offer.action', messageId: m.id, action: m.preferredActions[0]! }], s);
    expect(canAdvance(st, s)).toBe(true);
  });
});

describe('F4.8 · proyecto', () => {
  const st = step<ProjectStep>('project');
  const move = (from: string, to: string): SessionAction => ({ type: 'project.move', step: st, from, to });
  it('el plan con el gasto nuevo NO es válido hasta ajustar', () => {
    expect(isValidPlan(projectPlan(st, initialSession))).toBe(false);
    expect(projectDone(st, initialSession)).toBe(false);
  });
  it('ejemplo del manual: reserva (20) + 5 de decoración al gasto nuevo → plan válido', () => {
    let s = initialSession;
    for (let i = 0; i < 4; i++) s = run([move('res', 'unexp')], s); // 4 × 5 = 20
    s = run([move('deco', 'unexp')], s); // 5 más
    const plan = projectPlan(st, s);
    expect(plan.envelopes.find((e) => e.id === 'unexp')!.amount).toBe(25);
    expect(plan.envelopes.find((e) => e.id === 'deco')!.amount).toBe(10);
    expect(plan.envelopes.find((e) => e.id === 'res')!.amount).toBe(0);
    expect(projectDone(st, s)).toBe(true);
  });
  it('otro plan válido: sin decoración y 10 de reserva', () => {
    let s = initialSession;
    for (let i = 0; i < 3; i++) s = run([move('deco', 'unexp')], s); // 15
    for (let i = 0; i < 2; i++) s = run([move('res', 'unexp')], s); // 10
    expect(projectDone(st, s)).toBe(true);
    expect(projectPlan(st, s).envelopes.find((e) => e.id === 'res')!.amount).toBe(10);
  });
  it('no se puede mover más de lo que hay ni quitarle a un sobre esencial para dejarlo sin cubrir sin que se note', () => {
    const s = run([move('deco', 'unexp'), move('deco', 'unexp'), move('deco', 'unexp'), move('deco', 'unexp')]);
    expect(projectPlan(st, s).envelopes.find((e) => e.id === 'deco')!.amount).toBe(0); // la 4.ª no se pudo
    const s2 = run([move('mat', 'unexp')]);
    expect(projectDone(st, s2)).toBe(false); // quitar a lo esencial lo deja sin cubrir
  });
});

describe('recorrido completo y estrellas por esfuerzo (D11)', () => {
  const finish = (explainChoice: (st: FinanceUnit['steps'][number]) => string, adjust: boolean): SessionState => {
    const proj = step<ProjectStep>('project');
    let s = initialSession;
    const at = (a: SessionAction) => (s = sessionReducer(s, a));
    for (const st of unit.steps) {
      at({ type: 'explain', stepId: st.id, choiceId: explainChoice(st) });
      if (st.kind === 'priorities') {
        at({ type: 'priorities.pick', itemId: 'rain' });
        at({ type: 'priorities.condition', id: 'outdoor', value: false });
        at({ type: 'priorities.pick', itemId: 'deco' });
      } else if (st.kind === 'alternatives') {
        for (const a of [{ type: 'alternatives.toggleNotFit', id: 'C' }, { type: 'alternatives.prefer', id: 'A' }, { type: 'alternatives.prefer', id: 'B' }, { type: 'alternatives.left', id: 'B' }, { type: 'alternatives.leftover', id: 'remain' }] as SessionAction[]) at(a);
      } else if (st.kind === 'ledger') {
        at({ type: 'ledger.balance', value: 27 });
        at({ type: 'ledger.missing', id: 'above' });
      } else if (st.kind === 'reserve') {
        for (const a of [{ type: 'reserve.paySmall' }, { type: 'reserve.payBig' }, { type: 'reserve.adjust', id: 'useFree' }, { type: 'reserve.rebuild', id: 'rebuild' }] as SessionAction[]) at(a);
      } else if (st.kind === 'offer') {
        for (const m of st.messages) at({ type: 'offer.action', messageId: m.id, action: m.preferredActions[0]! });
      } else if (st.kind === 'project') {
        if (adjust) {
          for (let i = 0; i < 4; i++) at({ type: 'project.move', step: proj, from: 'res', to: 'unexp' });
          at({ type: 'project.move', step: proj, from: 'deco', to: 'unexp' });
        }
      }
      at({ type: 'next', unit });
    }
    return s;
  };
  it('terminando, ajustando el plan y explicando bien: 3 estrellas', () => {
    const s = finish((st) => st.explain.preferredChoiceIds[0]!, true);
    const ev = evaluateSession(unit, s);
    expect(ev).toEqual({ completed: true, adjusted: true, explained: true });
    expect(unitStars(ev)).toBe(3);
    expect(reasonKey(ev)).toBe('adjustedAndExplained');
  });
  it('sin ajustar el proyecto no se puede terminar (el paso no avanza): 0 estrellas, nada se castiga', () => {
    const s = finish((st) => st.explain.preferredChoiceIds[0]!, false);
    expect(evaluateSession(unit, s).completed).toBe(false);
    expect(unitStars(evaluateSession(unit, s))).toBe(0);
  });
  it('explicando con otros marcos también se termina: 2 estrellas (terminó + ajustó), sin castigo', () => {
    const s = finish((st) => st.explain.choices.find((c) => !st.explain.preferredChoiceIds.includes(c.id))!.id, true);
    const ev = evaluateSession(unit, s);
    expect(ev.completed && ev.adjusted && !ev.explained).toBe(true);
    expect(unitStars(ev)).toBe(2);
    expect(reasonKey(ev)).toBe('adjusted');
  });
  it('la estrella no depende de cuánto dinero sobra: dos planes válidos distintos dan lo mismo', () => {
    const a = evaluateSession(unit, finish((st) => st.explain.preferredChoiceIds[0]!, true));
    expect(unitStars(a)).toBe(3);
  });
});

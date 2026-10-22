import { describe, expect, it } from 'vitest';
import {
  LIFE_MISSIONS, LIFE_MODULE_IDS, canAdvance, evaluateSession, initialSession, missingKey, missionStars, reasonKey, sessionReducer, sortDisplayOrder, sortStatus, spotCheck, triedNeeded, validateMission,
  type LifeMission, type SessionState, type SessionAction, type SortStep, type SpotStep, type ChooseStep,
} from '../src/index.ts';

const run = (_m: LifeMission, actions: SessionAction[], from: SessionState = initialSession) => actions.reduce(sessionReducer, from);

/** Juega una misión entera «con esfuerzo»: prueba todos los caminos, ordena bien, marca bien y explica con el marco preferido. */
function playAll(m: LifeMission): SessionState {
  let s = initialSession;
  for (const st of m.steps) {
    const acts: SessionAction[] = [];
    if (st.kind === 'choose') for (const o of st.options) acts.push({ type: 'choose.pick', stepId: st.id, optionId: o.id });
    if (st.kind === 'sort') for (const it of st.items) acts.push({ type: 'sort.place', stepId: st.id, itemId: it.id });
    if (st.kind === 'spot') for (const it of st.items.filter((i) => i.sign)) acts.push({ type: 'spot.toggle', stepId: st.id, itemId: it.id });
    acts.push({ type: 'explain', stepId: st.id, choiceId: st.explain.preferredChoiceIds[0]! });
    acts.push({ type: 'next', mission: m });
    s = run(m, acts, s);
  }
  return s;
}

describe('las siete misiones de «Para la vida»', () => {
  it('hay una por módulo y todas pasan la revisión automática', () => {
    expect(Object.keys(LIFE_MISSIONS).sort()).toEqual([...LIFE_MODULE_IDS].sort());
    for (const id of LIFE_MODULE_IDS) {
      const m = LIFE_MISSIONS[id];
      expect(m.module).toBe(id);
      expect(validateMission(m), id).toEqual([]);
    }
  });

  it('cada misión se puede terminar y da 3 estrellas por esfuerzo', () => {
    for (const id of LIFE_MODULE_IDS) {
      const m = LIFE_MISSIONS[id];
      const s = playAll(m);
      const ev = evaluateSession(m, s);
      expect(ev, id).toEqual({ completed: true, explored: m.steps.some((x) => x.kind === 'choose'), explained: true });
      expect(missionStars(ev), id).toBe(m.steps.some((x) => x.kind === 'choose') ? 3 : 2);
    }
  });

  it('cada módulo es distinto: ids de misión únicos y mezcla de tipos de encuentro', () => {
    const ids = LIFE_MODULE_IDS.map((id) => LIFE_MISSIONS[id].id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of LIFE_MODULE_IDS) expect(new Set(LIFE_MISSIONS[id].steps.map((s) => s.kind)).size).toBeGreaterThanOrEqual(2);
  });

  it('nunca dice «incorrecto» ni pide datos reales (reglas comunes)', () => {
    const all = JSON.stringify(LIFE_MISSIONS);
    expect(all).not.toMatch(/incorrect|wrong answer/i);
    for (const id of LIFE_MODULE_IDS) expect(LIFE_MISSIONS[id].offScreen.es.length).toBeGreaterThan(10);
  });
});

describe('motor de misiones', () => {
  const m = LIFE_MISSIONS.emociones;
  const choose = m.steps[0] as ChooseStep;
  const sort = m.steps[1] as SortStep;
  const spot = m.steps[2] as SpotStep;

  it('elegir: hay que mirar varios caminos y explicar antes de seguir (sin importar si «acierta»)', () => {
    let s = run(m, [{ type: 'choose.pick', stepId: choose.id, optionId: 'send' }]);
    expect(canAdvance(choose, s)).toBe(false);
    expect(missingKey(choose, s)).toBe('choose');
    s = run(m, [{ type: 'choose.pick', stepId: choose.id, optionId: 'send' }, { type: 'choose.pick', stepId: choose.id, optionId: 'ignore' }, { type: 'choose.pick', stepId: choose.id, optionId: 'draft' }], s);
    expect(s.choose[choose.id]!.tried).toEqual(['send', 'ignore', 'draft']); // sin repetir
    expect(missingKey(choose, s)).toBe('explain');
    s = run(m, [{ type: 'explain', stepId: choose.id, choiceId: 'never' }], s); // el marco no preferido no bloquea
    expect(canAdvance(choose, s)).toBe(true);
    expect(triedNeeded(choose)).toBe(3);
  });

  it('ordenar: se muestra revuelto, se corrige quitando una tarjeta y solo se sigue en el orden bueno', () => {
    expect(sortDisplayOrder(sort).map((i) => i.id)).not.toEqual(sort.items.map((i) => i.id));
    expect(sortDisplayOrder(sort)).toHaveLength(sort.items.length);
    const wrong = ['away', 'notice', 'breathe', 'decide'];
    let s = run(m, wrong.map((itemId) => ({ type: 'sort.place', stepId: sort.id, itemId }) as SessionAction));
    expect(sortStatus(sort, s.sort[sort.id]!)).toBe('wrong');
    s = run(m, [{ type: 'sort.reset', stepId: sort.id }, ...sort.items.map((i) => ({ type: 'sort.place', stepId: sort.id, itemId: i.id }) as SessionAction)], s);
    expect(sortStatus(sort, s.sort[sort.id]!)).toBe('solved');
    // colocar dos veces la misma tarjeta no la duplica
    expect(run(m, [{ type: 'sort.place', stepId: sort.id, itemId: 'notice' }, { type: 'sort.place', stepId: sort.id, itemId: 'notice' }]).sort[sort.id]).toEqual(['notice']);
  });

  it('detectar: marcar y desmarcar; las señales que faltan o sobran dan una mirada de nuevo, no un bloqueo', () => {
    expect(spotCheck(spot, ['family', 'teacher', 'counselor']).exact).toBe(true);
    const c = spotCheck(spot, ['family', 'stranger']);
    expect(c).toMatchObject({ found: ['family'], extra: ['stranger'], exact: false });
    expect(c.missed).toEqual(['teacher', 'counselor']);
    let s = run(m, [{ type: 'spot.toggle', stepId: spot.id, itemId: 'family' }, { type: 'spot.toggle', stepId: spot.id, itemId: 'family' }]);
    expect(s.spot[spot.id]).toEqual([]);
    s = run(m, [{ type: 'spot.toggle', stepId: spot.id, itemId: 'stranger' }, { type: 'explain', stepId: spot.id, choiceId: 'hide' }], s);
    expect(canAdvance(spot, s)).toBe(true);
  });

  it('«next» no avanza si falta algo y «back» nunca baja de cero', () => {
    expect(run(m, [{ type: 'next', mission: m }]).stepIndex).toBe(0);
    expect(run(m, [{ type: 'back' }]).stepIndex).toBe(0);
  });

  it('estrellas por esfuerzo: terminar = 1; comparar y explicar suman; nunca por «acertar»', () => {
    expect(missionStars({ completed: false, explored: true, explained: true })).toBe(0);
    expect(missionStars({ completed: true, explored: false, explained: false })).toBe(1);
    expect(missionStars({ completed: true, explored: true, explained: false })).toBe(2);
    expect(missionStars({ completed: true, explored: true, explained: true })).toBe(3);
    expect(reasonKey({ completed: true, explored: false, explained: true })).toBe('explained');
    // terminar eligiendo siempre los caminos «no preferidos» también da las estrellas de esfuerzo
    let s = initialSession;
    for (const st of m.steps) {
      const acts: SessionAction[] = [];
      if (st.kind === 'choose') for (const o of st.options) acts.push({ type: 'choose.pick', stepId: st.id, optionId: o.id });
      if (st.kind === 'sort') for (const it of st.items) acts.push({ type: 'sort.place', stepId: st.id, itemId: it.id });
      if (st.kind === 'spot') acts.push({ type: 'spot.toggle', stepId: st.id, itemId: 'stranger' });
      acts.push({ type: 'explain', stepId: st.id, choiceId: st.explain.choices.at(-1)!.id }, { type: 'next', mission: m });
      s = run(m, acts, s);
    }
    expect(evaluateSession(m, s)).toEqual({ completed: true, explored: true, explained: false });
    expect(missionStars(evaluateSession(m, s))).toBe(2);
  });
});

describe('revisión automática', () => {
  it('detecta una misión con problemas', () => {
    const base = LIFE_MISSIONS.digital;
    const broken = { ...base, steps: [{ ...base.steps[0]!, explain: { ...base.steps[0]!.explain, preferredChoiceIds: ['nope'] } }, base.steps[1]!] } as LifeMission;
    const errs = validateMission(broken);
    expect(errs.some((e) => e.includes('muy pocos pasos'))).toBe(true);
    expect(errs.some((e) => e.includes('la preferida nope no existe'))).toBe(true);
  });
});

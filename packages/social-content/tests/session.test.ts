import { describe, expect, it } from 'vitest';
import {
  canAdvance,
  evaluateSession,
  feedbackFor,
  initialSession,
  investigationReasonKey,
  investigationStars,
  sessionReducer,
  socialUnitById,
  type SessionState,
} from '../src/index.ts';

const unit = socialUnitById('s3u03')!;

function playThrough(choices: { s3Choice: string; s4Choice: string; gap: string }): SessionState {
  let s = initialSession;
  // s1 pregunta: no hace falta nada.
  s = sessionReducer(s, { type: 'next', unit });
  // s2 comparar: clasificar las 3 afirmaciones.
  for (const st of (unit.steps[1] as Extract<(typeof unit.steps)[number], { kind: 'comparar' }>).statements) {
    s = sessionReducer(s, { type: 'classify', statementId: st.id, status: st.status });
  }
  s = sessionReducer(s, { type: 'next', unit });
  // s3 fuente
  s = sessionReducer(s, { type: 'choose', stepId: unit.steps[2].id, choiceId: choices.s3Choice });
  s = sessionReducer(s, { type: 'next', unit });
  // s4 testimonio
  s = sessionReducer(s, { type: 'choose', stepId: unit.steps[3].id, choiceId: choices.s4Choice });
  s = sessionReducer(s, { type: 'next', unit });
  // s5 explicar: marcar 2 fuentes
  s = sessionReducer(s, { type: 'toggleSource', sourceId: 'plano' });
  s = sessionReducer(s, { type: 'toggleSource', sourceId: 'foto' });
  s = sessionReducer(s, { type: 'next', unit });
  // s6 revisar
  s = sessionReducer(s, { type: 'pickGap', choiceId: choices.gap });
  s = sessionReducer(s, { type: 'next', unit });
  return s;
}

describe('sesión de Sociedad (s3u03)', () => {
  it('no deja avanzar el paso "comparar" hasta clasificar las 3 afirmaciones', () => {
    const step = unit.steps[1];
    let s = sessionReducer(initialSession, { type: 'next', unit }); // ahora en "comparar"
    expect(canAdvance(step, s)).toBe(false);
    s = sessionReducer(s, { type: 'classify', statementId: 'casas', status: 'igual' });
    s = sessionReducer(s, { type: 'classify', statementId: 'arroyo', status: 'igual' });
    expect(canAdvance(step, s)).toBe(false);
    s = sessionReducer(s, { type: 'classify', statementId: 'puente', status: 'nuevo' });
    expect(canAdvance(step, s)).toBe(true);
  });

  it('"next" no avanza si falta algo, y sí avanza cuando ya se puede', () => {
    let s = initialSession;
    const before = s.stepIndex;
    s = sessionReducer(s, { type: 'next', unit }); // s1 "pregunta" siempre se puede avanzar
    expect(s.stepIndex).toBe(before + 1);
  });

  it('marcar y desmarcar una fuente en "explicar" la quita del conjunto', () => {
    let s = initialSession;
    s = sessionReducer(s, { type: 'toggleSource', sourceId: 'foto' });
    expect(s.sourcesSelected).toEqual(['foto']);
    s = sessionReducer(s, { type: 'toggleSource', sourceId: 'foto' });
    expect(s.sourcesSelected).toEqual([]);
  });

  it('feedbackFor nunca dice "incorrecto": afirma la opción preferida, invita a mirar de nuevo con la otra', () => {
    const step = unit.steps[2] as Extract<(typeof unit.steps)[number], { kind: 'fuente' }>;
    let s = sessionReducer(initialSession, { type: 'choose', stepId: step.id, choiceId: step.preferredChoiceIds[0] });
    expect(feedbackFor(step, s)).toBe('affirm');
    const otherChoice = step.choices.find((c) => !step.preferredChoiceIds.includes(c.id))!;
    s = sessionReducer(s, { type: 'choose', stepId: step.id, choiceId: otherChoice.id });
    expect(feedbackFor(step, s)).toBe('gentle');
  });

  it('terminar con ≥2 fuentes y el hueco correcto da 3 estrellas', () => {
    const step3 = unit.steps[2] as Extract<(typeof unit.steps)[number], { kind: 'fuente' }>;
    const step4 = unit.steps[3] as Extract<(typeof unit.steps)[number], { kind: 'testimonio' }>;
    const step6 = unit.steps[5] as Extract<(typeof unit.steps)[number], { kind: 'revisar' }>;
    const s = playThrough({ s3Choice: step3.preferredChoiceIds[0], s4Choice: step4.preferredChoiceIds[0], gap: step6.gapChoiceId });
    const ev = evaluateSession(unit, s);
    expect(ev.completed).toBe(true);
    expect(ev.sourcesUsedEnough).toBe(true);
    expect(ev.gapIdentified).toBe(true);
    expect(investigationStars(ev)).toBe(3);
    expect(investigationReasonKey(ev)).toBe('sourcesAndGap');
  });

  it('elegir el hueco equivocado no bloquea terminar, pero da menos estrellas', () => {
    const step3 = unit.steps[2] as Extract<(typeof unit.steps)[number], { kind: 'fuente' }>;
    const step4 = unit.steps[3] as Extract<(typeof unit.steps)[number], { kind: 'testimonio' }>;
    const step6 = unit.steps[5] as Extract<(typeof unit.steps)[number], { kind: 'revisar' }>;
    const notGap = step6.choices.find((c) => c.id !== step6.gapChoiceId)!;
    const s = playThrough({ s3Choice: step3.preferredChoiceIds[0], s4Choice: step4.preferredChoiceIds[0], gap: notGap.id });
    const ev = evaluateSession(unit, s);
    expect(ev.completed).toBe(true);
    expect(ev.gapIdentified).toBe(false);
    expect(investigationStars(ev)).toBe(2);
    expect(investigationReasonKey(ev)).toBe('sources');
  });

  it('sin terminar todos los pasos no hay estrellas', () => {
    const ev = evaluateSession(unit, initialSession);
    expect(ev.completed).toBe(false);
    expect(investigationStars(ev)).toBe(0);
  });
});

describe('unidad sin fuentes (s1u01, puro razonamiento) — pasos "elegir"', () => {
  const s1 = socialUnitById('s1u01')!;

  it('se completa de principio a fin solo con pasos "elegir"', () => {
    let s = initialSession;
    for (const step of s1.steps) {
      if (step.kind === 'elegir') s = sessionReducer(s, { type: 'choose', stepId: step.id, choiceId: step.preferredChoiceIds[0] });
      expect(canAdvance(step, s), step.id).toBe(true);
      s = sessionReducer(s, { type: 'next', unit: s1 });
    }
    const ev = evaluateSession(s1, s);
    expect(ev.completed).toBe(true);
    // Sin fuentes: elegir siempre la opción preferida da la mejor calificación posible (quality === 1).
    expect(investigationStars(ev)).toBe(3);
  });

  it('elegir opciones no preferidas en una unidad sin fuentes no bloquea terminar, pero da menos estrellas', () => {
    let s = initialSession;
    for (const step of s1.steps) {
      if (step.kind === 'elegir') {
        const notPreferred = step.choices.find((c) => !step.preferredChoiceIds.includes(c.id))!;
        s = sessionReducer(s, { type: 'choose', stepId: step.id, choiceId: notPreferred.id });
      }
      s = sessionReducer(s, { type: 'next', unit: s1 });
    }
    const ev = evaluateSession(s1, s);
    expect(ev.completed).toBe(true);
    expect(investigationStars(ev)).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';
import { buildLessonPlan, challengeReducer, generateChallenge, initialChallenge, MATH_UNITS, phaseOf, toAttempt, type ChallengeAction } from '../src/index.ts';

const unit = MATH_UNITS[0];
const lesson = unit.lessons[0];

describe('plan de una lección', () => {
  it('sigue el orden de los momentos y termina en el cierre', () => {
    const plan = buildLessonPlan(unit, lesson, { minutes: 15, seed: 1 });
    const phases = plan.map(phaseOf);
    expect(phases[0]).toBe('aprender');
    expect(phases.at(-1)).toBe('cierre');
    expect(phases.indexOf('explorar')).toBeLessThan(phases.indexOf('practicar'));
    expect(phases.lastIndexOf('practicar')).toBeLessThan(phases.indexOf('juego'));
  });

  it('el primer reto de cada paso es el del autor; la duración cambia cuántos extra hay', () => {
    const count = (m: number) => buildLessonPlan(unit, lesson, { minutes: m, seed: 1 }).filter((p) => p.kind === 'practicar').length;
    // La lección 1 tiene 2 retos del autor.
    expect([count(8), count(15), count(20)]).toEqual([2, 4, 6]);
    const first = buildLessonPlan(unit, lesson, { minutes: 20, seed: 1 }).find((p) => p.kind === 'practicar');
    expect(first?.kind === 'practicar' && first.challenge.authored).toBe(true);
  });

  it('lo que vuelve hoy entra como calentamiento, sin pasar del máximo de la sesión', () => {
    const plan = buildLessonPlan(unit, unit.lessons[2], { minutes: 8, seed: 3, dueSkillIds: ['g3u1.s1', 'g3u1.s2', 'g3u1.s3'] });
    const warm = plan.filter((p) => p.kind === 'calentar');
    expect(warm).toHaveLength(2);
    expect(plan[0].kind).toBe('calentar');
  });

  it('es determinista con la misma semilla', () => {
    expect(buildLessonPlan(unit, lesson, { minutes: 20, seed: 9 })).toEqual(buildLessonPlan(unit, lesson, { minutes: 20, seed: 9 }));
  });
});

describe('un reto', () => {
  const step = unit.lessons[1].steps.find((s) => s.kind === 'practicar');
  if (step?.kind !== 'practicar') throw new Error('la lección 2 no tiene reto');
  const c = generateChallenge(step.challenge, 0);
  const run = (actions: ChallengeAction[]) => actions.reduce(challengeReducer, initialChallenge);
  const check: ChallengeAction = { type: 'check', answer: c.answer, requireConfidence: true };

  it('pide la confianza antes de comprobar', () => {
    const s = run([{ type: 'key', digit: '1' }, { type: 'key', digit: '2' }, check]);
    expect(s.feedback).toBe('needsConfidence');
    expect(s.firstCorrect).toBeNull();
  });

  it('acierto a la primera, sin pistas: evidencia independiente', () => {
    const s = run([{ type: 'key', digit: '1' }, { type: 'key', digit: '2' }, { type: 'confidence', value: 'seguro' }, check]);
    expect(s).toMatchObject({ solved: true, feedback: 'success', firstCorrect: true });
    expect(toAttempt(s, c, '2026-10-16')).toMatchObject({ firstCorrect: true, maxHintLevel: 0, confidence: 'seguro' });
  });

  it('si no coincide: "revisemos" y otra oportunidad; acertar después NO cuenta como a la primera', () => {
    let s = run([{ type: 'key', digit: '7' }, { type: 'confidence', value: 'adivino' }, check]);
    expect(s.feedback).toBe('tryAgain');
    const more: ChallengeAction[] = [{ type: 'back' }, { type: 'hint' }, { type: 'key', digit: '1' }, { type: 'key', digit: '2' }, check];
    s = more.reduce(challengeReducer, s);
    expect(s.solved).toBe(true);
    expect(toAttempt(s, c, '2026-10-16')).toMatchObject({ firstCorrect: false, maxHintLevel: 1 });
  });

  it('la escalera tiene 3 escalones; "lo veo luego" lo manda al repaso', () => {
    const s = run([{ type: 'hint' }, { type: 'hint' }, { type: 'hint' }, { type: 'hint' }, { type: 'skip' }]);
    expect(s.hintLevel).toBe(3);
    expect(toAttempt(s, c, '2026-10-16')).toMatchObject({ skipped: true, maxHintLevel: 3 });
  });

  it('el teclado no pasa de 4 cifras ni acepta ceros a la izquierda; sin terminar no se guarda nada', () => {
    const s = run(['0', '0', '5', '1', '2', '3', '4'].map((d) => ({ type: 'key', digit: d }) as ChallengeAction));
    expect(s.input).toBe('5123');
    expect(toAttempt(s, c, '2026-10-16')).toBeNull();
  });
});

describe('ejercicios manipulables dentro de las lecciones', () => {
  it('cada lección de g3u1 trae sus ejercicios visuales, en Practicar y antes del juego', async () => {
    const { LESSON_VISUALS } = await import('../src/session.ts');
    for (const l of unit.lessons) {
      const plan = buildLessonPlan(unit, l, { minutes: 15, seed: 3 });
      const visual = plan.filter((p) => p.kind === 'visual');
      expect(visual.length).toBe(LESSON_VISUALS[l.id].length);
      const phases = plan.map(phaseOf);
      const juego = phases.indexOf('juego');
      const lastVisual = plan.map((p) => p.kind).lastIndexOf('visual');
      if (juego >= 0) expect(lastVisual).toBeLessThan(juego);
    }
  });
});

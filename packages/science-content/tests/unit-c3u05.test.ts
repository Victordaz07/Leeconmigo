import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C3-U05') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C3-U05 «Fuerzas y movimiento» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 3-PS2-1 y 3-PS2-2', () => {
    const m = scienceUnitById('C3-U05');
    expect(unit.grade).toBe(3);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    for (const s of unit.standards) expect(unit.standardTasks[s].length, s).toBeGreaterThanOrEqual(3);
  });

  it('cada respuesta válida pasa; cada distractor se rechaza con su motivo en ES y EN', () => {
    for (const t of unit.tasks) {
      expect(evaluateTask(t, valids(t)).outcome, t.id).toBe('ok');
      for (const part of t.parts) for (const o of part.options.filter((x) => !x.valid)) {
        const r = evaluateTask(t, { ...valids(t), [part.id]: [o.id] });
        expect(r.outcome, `${t.id}.${part.id}.${o.id}`).not.toBe('ok');
        expect(r.whyNot[0].es.trim()).not.toBe('');
        expect(r.whyNot[0].en.trim()).not.toBe('');
      }
    }
  });

  it('los errores del tema («solo se mueve si lo empujan», «siempre a la derecha», «no se puede predecir») se corrigen con la tabla', () => {
    const nunca = evaluateTask(task('t5'), { afirmacion: ['nunca'], evidencia: ['iguales', 'desiguales'], limite: ['este'] });
    expect(nunca.whyNot[0].es).toMatch(/2 empujones de cada lado se quedó quieto/);
    const siempre = evaluateTask(task('t5'), { afirmacion: ['siempre'], evidencia: ['iguales', 'desiguales'], limite: ['este'] });
    expect(siempre.whyNot[0].es).toMatch(/3 empujones hacia la izquierda y 1 hacia la derecha/);
    const azar = evaluateTask(task('t6'), { patron: ['azar'], prediccion: ['izq'], evidencia: ['tabla', 'repite'], limite: ['este'] });
    expect(azar.whyNot[0].es).toMatch(/se puede predecir/);
    const todos = evaluateTask(task('t6'), { patron: ['alterna'], prediccion: ['izq'], evidencia: ['tabla', 'repite'], limite: ['todo'] });
    expect(todos.whyNot[0].es).toMatch(/pasto/);
  });

  it('el péndulo se predice con el patrón: el latido 10 es par, a la izquierda', () => {
    expect(evaluateTask(task('t6'), { patron: ['alterna'], prediccion: ['izq'], evidencia: ['tabla', 'repite'], limite: ['este'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t6'), { patron: ['alterna'], prediccion: ['der'], evidencia: ['tabla', 'repite'], limite: ['este'] }).whyNot[0].es).toMatch(/10 es par/);
  });

  it('el caso nuevo de la cuerda: fuerzas iguales no cambian el movimiento; desiguales sí', () => {
    expect(evaluateTask(task('t7'), { igual: ['equilibrio'], desigual: ['mueve'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t7'), { igual: ['equilibrio'], desigual: ['igual'] }).outcome).toBe('wrong');
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'quieto', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'derecha', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'derecha', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'derecha', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['fuerzas.equilibrio'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad excluye empujar entre personas y bolas duras', () => {
    expect(unit.safety.excluded.es).toMatch(/empujar entre personas/);
    expect(unit.safety.stopIf.some((t) => /bola es pesada o dura/.test(t.es))).toBe(true);
  });
});

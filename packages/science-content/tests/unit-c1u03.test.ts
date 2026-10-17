import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C1-U03') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C1-U03 «Caminos de luz» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 1-PS4-3', () => {
    const m = scienceUnitById('C1-U03');
    expect(unit.grade).toBe(1);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    expect(unit.standardTasks['1-PS4-3'].length).toBeGreaterThanOrEqual(3);
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

  it('los errores del tema («pasa igual por todos», «la luz solo desaparece», «cualquier metal») se corrigen con la tabla', () => {
    const todos = evaluateTask(task('t5'), { afirmacion: ['todos'], evidencia: ['transparente', 'cartulina'], limite: ['cuatro'] });
    expect(todos.whyNot[0].es).toMatch(/cartulina la luz no pasó/);
    const ninguno = evaluateTask(task('t5'), { afirmacion: ['ninguno'], evidencia: ['transparente', 'cartulina'], limite: ['cuatro'] });
    expect(ninguno.whyNot[0].es).toMatch(/plástico transparente la luz pasó toda/);
    const metal = evaluateTask(task('t6'), { afirmacion: ['rebota'], evidencia: ['aluminio', 'brillante'], limite: ['todo'] });
    expect(metal.whyNot[0].es).toMatch(/aluminio brillante/);
    const pasa = evaluateTask(task('t6'), { afirmacion: ['pasa'], evidencia: ['aluminio', 'brillante'], limite: ['parecido'] });
    expect(pasa.whyNot[0].es).toMatch(/rebota/);
  });

  it('el parasol solo se hace con el material que no deja pasar la luz', () => {
    expect(evaluateTask(task('t7'), { material: ['cartulina'], porque: ['nopasa'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t7'), { material: ['transparente'], porque: ['nopasa'] }).outcome).toBe('wrong');
    expect(evaluateTask(task('t7'), { material: ['calco'], porque: ['nopasa'] }).whyNot[0].es).toMatch(/débil/);
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'poca', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'nada', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'nada', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'rebota', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['luz.pasa'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad prohíbe apuntar la linterna a los ojos y mirar el sol', () => {
    expect(unit.safety.stopIf.some((t) => /ojos/.test(t.es))).toBe(true);
    expect(unit.safety.excluded.es).toMatch(/mirar el sol/);
  });
});

import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C2-U01') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C2-U01 «Detectives de materiales» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 2-PS1-1', () => {
    const m = scienceUnitById('C2-U01');
    expect(unit.grade).toBe(2);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    expect(unit.standardTasks['2-PS1-1'].length).toBeGreaterThanOrEqual(3);
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

  it('los errores del tema («siempre el mismo grupo», «una sola manera», «con una propiedad basta») se corrigen con los grupos', () => {
    const igual = evaluateTask(task('t5'), { afirmacion: ['igual'], evidencia: ['dureza', 'brillo'], limite: ['seis'] });
    expect(igual.whyNot[0].es).toMatch(/la pelota va con los blandos/);
    const una = evaluateTask(task('t5'), { afirmacion: ['una'], evidencia: ['dureza', 'brillo'], limite: ['seis'] });
    expect(una.whyNot[0].es).toMatch(/tres maneras/);
    const unaProp = evaluateTask(task('t6'), { objeto: ['pelota'], evidencia: ['blando', 'liso'], limite: ['una'] });
    expect(unaProp.whyNot[0].es).toMatch(/tres son blandos y tres son lisos/);
    const esponja = evaluateTask(task('t6'), { objeto: ['esponja'], evidencia: ['blando', 'liso'], limite: ['dos'] });
    expect(esponja.whyNot[0].es).toMatch(/rugosa/);
  });

  it('el caso nuevo del juguete solo vale con las dos propiedades a la vez', () => {
    expect(evaluateTask(task('t7'), { objeto: ['pelota'], porque: ['dos'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t7'), { objeto: ['taza'], porque: ['dos'] }).whyNot[0].es).toMatch(/dura/);
    expect(evaluateTask(task('t7'), { objeto: ['pelota'], porque: ['color'] }).outcome).toBe('wrong');
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'blando', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'duro', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'duro', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'duro', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['materiales.agrupar'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad prohíbe llevarse objetos a la boca y los objetos con filo', () => {
    expect(unit.safety.stopIf.some((t) => /boca/.test(t.es))).toBe(true);
    expect(unit.safety.excluded.es).toMatch(/filo/);
  });
});

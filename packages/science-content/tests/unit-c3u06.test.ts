import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C3-U06') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C3-U06 «Interacciones sin tocar» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 3-PS2-3 y 3-PS2-4', () => {
    const m = scienceUnitById('C3-U06');
    expect(m?.pilot).toBe(true);
    expect(unit.grade).toBe(3);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(['3-PS2-3', '3-PS2-4']);
    expect(m?.labs).toEqual(['fuerzas-imanes']);
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

  it('los errores del tema («atrae todo», «desde cualquier distancia», «todos los metales») se corrigen con lo que se probó', () => {
    const lejos = evaluateTask(task('t5'), { afirmacion: ['siempre'], evidencia: ['cerca', 'lejos'], limite: ['este'] });
    expect(lejos.outcome).toBe('wrong');
    expect(lejos.whyNot[0].es).toMatch(/marcas 4 y 5/);
    const metales = evaluateTask(task('t6'), { afirmacion: ['todos'], evidencia: ['acero', 'otros'], limite: ['cuatro'] });
    expect(metales.whyNot[0].es).toMatch(/aluminio es de metal/);
    const todos = evaluateTask(task('t5'), { afirmacion: ['cerca'], evidencia: ['cerca', 'lejos'], limite: ['todos'] });
    expect(todos.whyNot[0].es).toMatch(/solo probaste este imán/i);
  });

  it('el problema de diseño solo vale con objetos de acero y el imán cerca (3-PS2-4)', () => {
    expect(evaluateTask(task('t7'), { problema: ['recoger'], como: ['cerca'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t7'), { problema: ['plastico'], como: ['cerca'] }).outcome).toBe('wrong');
    expect(evaluateTask(task('t7'), { problema: ['recoger'], como: ['todo'] }).whyNot[0].es).toMatch(/no atrae todos los materiales/);
  });

  it('la predicción se compara con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'nada', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'mueve', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'mueve', 'nocoincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t4', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['iman.material'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad prohíbe imanes pequeños y de neodimio', () => {
    expect(unit.safety.materials.es).toMatch(/GRANDE/);
    expect(unit.safety.excluded.es).toMatch(/neodimio/);
    expect(unit.safety.stopIf.some((t) => /neodimio/.test(t.es))).toBe(true);
  });
});

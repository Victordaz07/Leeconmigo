import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C3-U07') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C3-U07 «Tiempo y clima» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 3-ESS2-1 y 3-ESS2-2', () => {
    const m = scienceUnitById('C3-U07');
    expect(unit.grade).toBe(3);
    expect(unit.area).toBe(m?.area);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    for (const s of unit.standards) expect(unit.standardTasks[s].length).toBeGreaterThanOrEqual(3);
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

  it('el error del tema («el clima es el tiempo de hoy») se corrige con el registro', () => {
    const hoy = evaluateTask(task('t5'), { afirmacion: ['seco'], evidencia: ['verano', 'ayer'], limite: ['dia'] });
    expect(hoy.whyNot[0].es).toMatch(/Un día no es el clima/);
    const martes = evaluateTask(task('t5'), { afirmacion: ['seco'], evidencia: ['verano', 'poca'], limite: ['martes'] });
    expect(martes.whyNot[0].es).toMatch(/no el tiempo de un día/);
    const reporte = evaluateTask(task('t7'), { esperar: ['hoy'], ropa: ['abrigo'] });
    expect(reporte.whyNot[0].es).toMatch(/lo típico del invierno/);
  });

  it('evaluar la gráfica exige decir qué muestra, qué le falta y cómo mejorarla', () => {
    expect(evaluateTask(task('t6'), { muestra: ['cambia'], falta: ['temp'], mejora: ['rotular'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t6'), { muestra: ['cambia'], falta: ['nada'], mejora: ['rotular'] }).outcome).toBe('wrong');
    expect(evaluateTask(task('t6'), { muestra: ['manana'], falta: ['temp'], mejora: ['rotular'] }).whyNot[0].es).toMatch(/no el tiempo de un día/);
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'invierno', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'verano', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t4'), 'resultado', 'altas', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'bajas', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['clima.registro'].stage).toBe('loExplico');
    expect(statusByIdea(p.attempts)['clima.regiones'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad excluye salir con tormenta y los termómetros de mercurio', () => {
    expect(unit.safety.excluded.es).toMatch(/tormenta/);
    expect(unit.safety.stopIf.some((t) => /mercurio/.test(t.es))).toBe(true);
  });
});

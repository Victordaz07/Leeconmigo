import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C6-U05') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C6-U05 «Agua en movimiento» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con MS-ESS2-4', () => {
    const m = scienceUnitById('C6-U05');
    expect(unit.grade).toBe(6);
    expect(unit.area).toBe(m?.area);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    expect(unit.standardTasks['MS-ESS2-4'].length).toBeGreaterThanOrEqual(3);
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

  it('los errores del tema («solo el Sol mueve el agua», «el agua se gasta», «la gravedad la sube») se corrigen con el modelo', () => {
    const sol = evaluateTask(task('t5'), { afirmacion: ['sol'], evidencia: ['sube', 'baja'], limite: ['seis'] });
    expect(sol.whyNot[0].es).toMatch(/gravedad/);
    const gasta = evaluateTask(task('t5'), { afirmacion: ['gasta'], evidencia: ['sube', 'baja'], limite: ['seis'] });
    expect(gasta.whyNot[0].es).toMatch(/el ciclo se cierra/);
    const todo = evaluateTask(task('t5'), { afirmacion: ['ciclo'], evidencia: ['sube', 'baja'], limite: ['todo'] });
    expect(todo.whyNot[0].es).toMatch(/deja cosas fuera/);
    const grav = evaluateTask(task('t7'), { donde: ['aire'], motor: ['gravedad'] });
    expect(grav.whyNot[0].es).toMatch(/baja el agua, no la sube/);
  });

  it('evaluar el modelo exige decir qué muestra, qué le falta y cómo mejorarlo', () => {
    expect(evaluateTask(task('t6'), { muestra: ['ciclo'], falta: ['cantidad'], mejora: ['hielo'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t6'), { muestra: ['ciclo'], falta: ['nada'], mejora: ['hielo'] }).outcome).toBe('wrong');
    expect(evaluateTask(task('t6'), { muestra: ['ciclo'], falta: ['cantidad'], mejora: ['colores'] }).whyNot[0].es).toMatch(/Los colores no cambian/);
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'menos', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'igual', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'igual', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'baja', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['agua.circula'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad excluye calentar agua en la estufa y acercarse a agua profunda', () => {
    expect(unit.safety.excluded.es).toMatch(/Calentar agua/);
    expect(unit.safety.stopIf.some((t) => /río, un lago/.test(t.es))).toBe(true);
  });
});

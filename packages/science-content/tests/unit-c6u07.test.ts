import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C6-U07') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C6-U07 «Evidencias de cambio» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con MS-ESS3-5', () => {
    const m = scienceUnitById('C6-U07');
    expect(unit.grade).toBe(6);
    expect(unit.area).toBe(m?.area);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    expect(unit.standardTasks['MS-ESS3-5'].length).toBeGreaterThanOrEqual(3);
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

  it('la unidad enseña la conclusión correcta: causa principal humana, no el Sol ni los volcanes, y un día de calor no es prueba', () => {
    const sol = evaluateTask(task('t5'), { afirmacion: ['sol'], evidencia: ['co2', 'descarte'], limite: ['correl'] });
    expect(sol.whyNot[0].es).toMatch(/casi no cambia/);
    const volcanes = evaluateTask(task('t5'), { afirmacion: ['volcanes'], evidencia: ['co2', 'descarte'], limite: ['correl'] });
    expect(volcanes.whyNot[0].es).toMatch(/sin tendencia/);
    const dia = evaluateTask(task('t5'), { afirmacion: ['humanos'], evidencia: ['co2', 'dia'], limite: ['correl'] });
    expect(dia.whyNot[0].es).toMatch(/tiempo, no clima/);
    const semana = evaluateTask(task('t7'), { prueba: ['si'], pregunta: ['registro'] });
    expect(semana.whyNot[0].es).toMatch(/tiempo, no clima/);
    expect(task('t5').parts[0].options.find((o) => o.id === 'humanos')?.text.es).toMatch(/causa principal/);
  });

  it('el razonamiento reconoce sus límites: correlación no basta y los datos son de práctica', () => {
    expect(evaluateTask(task('t5'), { afirmacion: ['humanos'], evidencia: ['co2', 'mecanismo'], limite: ['prueba'] }).whyNot[0].es).toMatch(/Una serie sola no prueba/);
    expect(unit.review.notes).toMatch(/práctica/);
    expect(unit.safety.excluded.es).toMatch(/datos de una institución/);
  });

  it('evaluar la cadena exige decir qué muestra, qué deja fuera y cómo mejorarla', () => {
    expect(evaluateTask(task('t6'), { muestra: ['cadena'], falta: ['otros'], mejora: ['datos'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t6'), { muestra: ['cadena'], falta: ['nada'], mejora: ['datos'] }).outcome).toBe('wrong');
    expect(evaluateTask(task('t6'), { muestra: ['cadena'], falta: ['otros'], mejora: ['borrar'] }).whyNot[0].es).toMatch(/el Sol es parte del mecanismo/);
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'plana', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'sube', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t4'), 'resultado', 'plana', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'sube', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['clima.evidencia'].stage).toBe('loExplico');
    expect(statusByIdea(p.attempts)['clima.humanos'].stage).toBe('loExplico');
  });
});

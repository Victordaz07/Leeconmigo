import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C1-U01') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C1-U01 «Vibraciones» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 1-PS4-1', () => {
    const m = scienceUnitById('C1-U01');
    expect(unit.grade).toBe(1);
    expect(unit.area).toBe(m?.area);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    expect(unit.standardTasks['1-PS4-1'].length).toBeGreaterThanOrEqual(3);
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

  it('los errores del tema («algo quieto puede sonar», «la cuerda está quieta») se corrigen con lo visto', () => {
    const quieto = evaluateTask(task('t5'), { afirmacion: ['quieto'], evidencia: ['arroz', 'mano'], limite: ['otros'] });
    expect(quieto.whyNot[0].es).toMatch(/arroz/);
    const cuerda = evaluateTask(task('t7'), { cuerda: ['quieta'], mano: ['calla'] });
    expect(cuerda.whyNot[0].es).toMatch(/ligas/);
    const fuerte = evaluateTask(task('t7'), { cuerda: ['vibra'], mano: ['fuerte'] });
    expect(fuerte.whyNot[0].es).toMatch(/sujetaste/);
  });

  it('evaluar la tabla exige decir qué muestra, qué le falta y cómo mejorarla', () => {
    expect(evaluateTask(task('t6'), { muestra: ['suena'], falta: ['otros'], mejora: ['mas'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t6'), { muestra: ['suena'], falta: ['nada'], mejora: ['mas'] }).outcome).toBe('wrong');
    expect(evaluateTask(task('t6'), { muestra: ['color'], falta: ['otros'], mejora: ['mas'] }).whyNot[0].es).toMatch(/no el color/);
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'calla', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'sigue', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t4'), 'resultado', 'quieto', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'salta', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['sonido.vibracion'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad excluye estirar ligas hacia la cara y los ruidos muy fuertes', () => {
    expect(unit.safety.excluded.es).toMatch(/ligas hacia la cara/);
    expect(unit.safety.stopIf.some((t) => /liga se estira/.test(t.es))).toBe(true);
  });
});

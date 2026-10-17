import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C5-U01') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C5-U01 «Materia invisible» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 5-PS1-1', () => {
    const m = scienceUnitById('C5-U01');
    expect(unit.grade).toBe(5);
    expect(unit.area).toBe(m?.area);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    expect(unit.standardTasks['5-PS1-1'].length).toBeGreaterThanOrEqual(3);
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

  it('los errores del tema («lo que no se ve desaparece», «la sal se vuelve agua») se corrigen con el modelo de puntitos', () => {
    const desaparece = evaluateTask(task('t5'), { afirmacion: ['desaparece'], evidencia: ['cuenta', 'reparte'], limite: ['dibujo'] });
    expect(desaparece.whyNot[0].es).toMatch(/no desaparecen/);
    const agua = evaluateTask(task('t5'), { afirmacion: ['agua'], evidencia: ['cuenta', 'reparte'], limite: ['dibujo'] });
    expect(agua.whyNot[0].es).toMatch(/siguen ahí/);
    const foto = evaluateTask(task('t5'), { afirmacion: ['sigue'], evidencia: ['cuenta', 'reparte'], limite: ['todo'] });
    expect(foto.whyNot[0].es).toMatch(/no una fotografía/);
    const nada = evaluateTask(task('t7'), { donde: ['nada'], como: ['dulce'] });
    expect(nada.whyNot[0].es).toMatch(/sigue ahí/);
  });

  it('evaluar el modelo exige decir qué muestra, qué le falta y cómo mejorarlo', () => {
    expect(evaluateTask(task('t6'), { muestra: ['espacio'], falta: ['dentro'], mejora: ['mas'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t6'), { muestra: ['espacio'], falta: ['nada'], mejora: ['mas'] }).outcome).toBe('wrong');
    expect(evaluateTask(task('t6'), { muestra: ['espacio'], falta: ['dentro'], mejora: ['colores'] }).whyNot[0].es).toMatch(/Los colores no cambian/);
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'parejo', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'fondo', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'arriba', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'aprieta', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't6']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['materia.particulas'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad excluye agujas y probar el colorante', () => {
    expect(unit.safety.excluded.es).toMatch(/Agujas/);
    expect(unit.safety.stopIf.some((t) => /probar el colorante/.test(t.es))).toBe(true);
  });
});

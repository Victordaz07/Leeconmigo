import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C5-U03') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C5-U03 «Mezclas bajo investigación» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 5-PS1-4', () => {
    const m = scienceUnitById('C5-U03');
    expect(unit.grade).toBe(5);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    expect(unit.standardTasks['5-PS1-4'].length).toBeGreaterThanOrEqual(3);
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

  it('los errores del tema («si no se ve es algo nuevo», «una sola prueba basta», «probar con la boca») se corrigen con evidencia', () => {
    const ver = evaluateTask(task('t5'), { afirmacion: ['aveces'], evidencia: ['gas', 'ver'], limite: ['cinco'] });
    expect(ver.outcome).toBe('wrong');
    expect(ver.whyNot[0].es).toMatch(/ya no se vea no prueba/);
    const una = evaluateTask(task('t6'), { afirmacion: ['nonueva'], evidencia: ['burbujas', 'filtro'], limite: ['una'] });
    expect(una.whyNot[0].es).toMatch(/Una sola prueba no decide/);
    const boca = evaluateTask(task('t7'), { decision: ['no'], pruebas: ['probar'] });
    expect(boca.whyNot[0].es).toMatch(/Nunca se prueba/);
    const siempre = evaluateTask(task('t5'), { afirmacion: ['siempre'], evidencia: ['gas', 'sal'], limite: ['cinco'] });
    expect(siempre.whyNot[0].es).toMatch(/recuperar lo de antes/);
  });

  it('el caso nuevo de la limonada solo vale si se decide con pruebas', () => {
    expect(evaluateTask(task('t7'), { decision: ['no'], pruebas: ['dos'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t7'), { decision: ['si'], pruebas: ['dos'] }).outcome).toBe('wrong');
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'si', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'no', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'no', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'si', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['sustancia.nueva'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad prohíbe cerrar el recipiente que hace burbujas y probar las mezclas', () => {
    expect(unit.safety.stopIf.some((t) => /cierra o tapa/.test(t.es))).toBe(true);
    expect(unit.safety.excluded.es).toMatch(/Probar o oler/);
    expect(unit.safety.hygiene.es).toMatch(/Gafas/);
    expect(unit.safety.stopIf.some((t) => /alergia/.test(t.es))).toBe(true);
  });
});

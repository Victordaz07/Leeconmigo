import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C5-U02') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C5-U02 «Cantidad y propiedades» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 5-PS1-2 y 5-PS1-3 (sin densidad como requisito)', () => {
    const m = scienceUnitById('C5-U02');
    expect(m?.pilot).toBe(true);
    expect(unit.grade).toBe(5);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(['5-PS1-2', '5-PS1-3']);
    for (const s of unit.standards) expect(unit.standardTasks[s].length, s).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify({ ...unit, review: undefined })).not.toMatch(/densidad|density/i);
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

  it('los errores del tema («desapareció y pesa menos», «con el color basta») se corrigen con las pesadas y la tabla', () => {
    const menos = evaluateTask(task('t5'), { afirmacion: ['menos'], evidencia: ['sal', 'azucar'], limite: ['cerrado'] });
    expect(menos.outcome).toBe('wrong');
    expect(menos.whyNot[0].es).toMatch(/230 g/);
    const abierto = evaluateTask(task('t5'), { afirmacion: ['conserva'], evidencia: ['sal', 'azucar'], limite: ['todo'] });
    expect(abierto.whyNot[0].es).toMatch(/abierto/);
    const color = evaluateTask(task('t6'), { afirmacion: ['azucar'], evidencia: ['agua', 'color'], limite: ['dos'] });
    expect(color.outcome).toBe('wrong');
    expect(color.whyNot[0].es).toMatch(/color solo no alcanza/);
    const sal = evaluateTask(task('t6'), { afirmacion: ['sal'], evidencia: ['agua', 'granitos'], limite: ['dos'] });
    expect(sal.whyNot[0].es).toMatch(/cubitos/);
  });

  it('el caso nuevo del hielo solo vale si se conserva la masa en el frasco cerrado', () => {
    expect(evaluateTask(task('t7'), { resultado: ['igual'], porque: ['cambia'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t7'), { resultado: ['menos'], porque: ['cambia'] }).outcome).toBe('wrong');
    expect(evaluateTask(task('t7'), { resultado: ['igual'], porque: ['desaparece'] }).whyNot[0].es).toMatch(/cambia de forma/);
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'igual', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'menos', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'menos', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'disuelve', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['materia.conserva'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad prohíbe probar las muestras y nombra la alergia al trigo', () => {
    expect(unit.safety.hygiene.es).toMatch(/Nunca probar/);
    expect(unit.safety.excluded.es).toMatch(/Probar o oler/);
    expect(unit.safety.stopIf.some((t) => /alergia/.test(t.es))).toBe(true);
  });
});

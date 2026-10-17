import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C6-U04') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C6-U04 «Energía térmica» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con MS-PS3-3, -4 y -5', () => {
    const m = scienceUnitById('C6-U04');
    expect(m?.pilot).toBe(true);
    expect(unit.grade).toBe(6);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(['MS-PS3-3', 'MS-PS3-4', 'MS-PS3-5']);
    expect(m?.labs).toEqual(['probador-materiales', 'constructor-modelos']);
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

  it('los errores del tema («la funda produce frío», «entra el frío») se rechazan y se corrigen sin decir «incorrecto»', () => {
    const frio = evaluateTask(task('t5'), { afirmacion: ['frio'], evidencia: ['sin', 'dos'], razonamiento: ['energia'] });
    expect(frio.outcome).toBe('wrong');
    expect(frio.whyNot[0].es).toMatch(/no produce frío/);
    const entra = evaluateTask(task('t5'), { afirmacion: ['entra'], evidencia: ['sin', 'dos'], razonamiento: ['energia'] });
    expect(entra.whyNot[0].es).toMatch(/lugar más caliente al más frío/);
    const calor = evaluateTask(task('t7'), { direccion: ['sale'], funda: ['calor'] });
    expect(calor.whyNot[0].es).toMatch(/no produce calor/);
  });

  it('el diseño que no cumple el criterio se rechaza con sus datos (subió 5 °C y el criterio es 3 °C)', () => {
    const r = evaluateTask(task('t6'), { afirmacion: ['aluminio3'], evidencia: ['e2', 'a3'], limites: ['tiempo', 'real'] });
    expect(r.outcome).toBe('wrong');
    expect(r.whyNot[0].es).toMatch(/5 °C/);
    expect(r.whyNot[0].es).toMatch(/3 °C/);
  });

  it('la predicción se compara con lo medido con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'menos', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'baja', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'baja', 'nocoincidio')).toBe(true);
  });

  it('cada idea se explica en 2 o 3 casos y el dominio llega con dos casos distintos', () => {
    expect(unit.ideas.find((i) => i.id === 'aislante.frena')?.contexts).toEqual(['funda', 'rediseno', 'chocolate']);
    let p = EMPTY_SCIENCE;
    for (const id of ['t3', 't4']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['aislante.frena'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad excluye agua hirviendo, termómetros de vidrio y corriente doméstica', () => {
    expect(unit.safety.excluded.es).toMatch(/Agua hirviendo/);
    expect(unit.safety.excluded.es).toMatch(/termómetros de vidrio/);
    expect(unit.safety.excluded.es).toMatch(/corriente eléctrica/);
  });
});

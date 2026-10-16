import { describe, expect, it } from 'vitest';
import { LIGHT_MODEL, LIGHT_OBJECTS, LIGHT_ROWS, scienceUnitById, scienceUnitContent, SCIENCE_UNITS, dataTextProblems, evaluateTask, sighting, sightingsFor, statusByIdea, comparisonAdequate, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C1-U02') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('modelo de la luz (luz-materiales)', () => {
  it('un objeto se distingue SOLO con la luz encendida, y el resultado es siempre el mismo', () => {
    expect(sighting('on')).toBe('distingo');
    expect(sighting('off')).toBe('noDistingo');
    expect(sightingsFor('on')).toEqual(['distingo', 'distingo', 'distingo']);
    expect(sightingsFor('off', 2)).toEqual(['noDistingo', 'noDistingo']);
    expect(LIGHT_ROWS).toEqual(['off', 'on']);
    expect(LIGHT_OBJECTS).toEqual(['osito', 'pelota', 'taza']);
  });

  it('declara lo que representa y lo que NO representa, en los dos idiomas', () => {
    expect(LIGHT_MODEL.doesNotRepresent.length).toBeGreaterThanOrEqual(3);
    for (const t of [LIGHT_MODEL.represents, ...LIGHT_MODEL.assumptions, ...LIGHT_MODEL.doesNotRepresent, ...LIGHT_MODEL.controls]) {
      expect(t.es.trim()).not.toBe('');
      expect(t.en.trim()).not.toBe('');
    }
  });
});

describe('unidad C1-U02 «Ver en la oscuridad» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
    expect(SCIENCE_UNITS.map((u) => u.id)).toContain('C1-U02');
  });

  it('coincide con el mapa curricular y con 1-PS4-2', () => {
    const m = scienceUnitById('C1-U02');
    expect(m?.pilot).toBe(true);
    expect(unit.grade).toBe(1);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(['1-PS4-2']);
    expect(m?.labs).toEqual(['luz-materiales']);
    expect(unit.standardTasks['1-PS4-2']).toEqual(['t3', 't5', 't6', 't7']);
  });

  it('cada idea se explica en 3 casos y la evidencia de dominio llega con dos casos distintos', () => {
    for (const i of unit.ideas) expect(i.contexts).toEqual(['caja.osito', 'caja.pelota', 'armario']);
    let p = EMPTY_SCIENCE;
    for (const id of ['t3', 't4']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-16', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['luz.ver'].stage).toBe('loExplico');
    expect(statusByIdea(p.attempts)['objeto.sigue']).toBeUndefined();
  });

  it('cada respuesta válida pasa; cada distractor se rechaza con su motivo en ES y EN', () => {
    for (const t of unit.tasks) {
      expect(evaluateTask(t, valids(t)).outcome, t.id).toBe('ok');
      for (const part of t.parts) for (const o of part.options.filter((x) => !x.valid)) {
        const r = evaluateTask(t, { ...valids(t), [part.id]: [o.id] });
        expect(r.outcome, `${t.id}.${part.id}.${o.id}`).not.toBe('ok');
        expect(r.whyNot.length).toBeGreaterThan(0);
        expect(r.whyNot[0].es.trim()).not.toBe('');
        expect(r.whyNot[0].en.trim()).not.toBe('');
      }
    }
  });

  it('la idea errónea «el objeto desapareció» se rechaza y se corrige con lo que se vio', () => {
    const r = evaluateTask(task('t7'), { decision: ['desaparecio'], arreglo: ['luz'] });
    expect(r.outcome).toBe('wrong');
    expect(r.whyNot[0].es).toMatch(/sigue en su lugar/);
    expect(evaluateTask(task('t7'), { decision: ['sinluz'], arreglo: ['cortina'] }).outcome).toBe('ok');
  });

  it('la predicción se compara con lo observado (con la luz encendida se distingue) con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'distingo', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'igual', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'igual', 'nocoincidio')).toBe(true);
  });

  it('la ficha de seguridad evita cuartos totalmente oscuros y luz a los ojos', () => {
    expect(unit.safety.excluded.es).toMatch(/totalmente oscuros/);
    expect(unit.safety.excluded.es).toMatch(/ojos/);
    expect(unit.safety.enabledByParent).toBe(true);
    expect(unit.safety.review).toBe('pendienteDocente');
  });
});

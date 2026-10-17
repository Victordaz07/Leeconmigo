import { describe, expect, it } from 'vitest';
import { bestMaterial, comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C2-U02') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C2-U02 «Un techo para el muñeco» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 2-PS1-2', () => {
    const m = scienceUnitById('C2-U02');
    expect(m?.pilot).toBe(true);
    expect(unit.grade).toBe(2);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(['2-PS1-2']);
    expect(m?.labs).toEqual(['probador-materiales']);
    expect(unit.standardTasks['2-PS1-2']).toEqual(['t3', 't5', 't6', 't7']);
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

  it('el propósito decide: el mejor techo (plástico) se rechaza para secar y el mejor para secar (papel) se rechaza para cubrir', () => {
    expect(bestMaterial('techo')).toBe('plastico');
    expect(evaluateTask(task('t6'), { afirmacion: ['plastico'], evidencia: ['papel', 'plastico'], razonamiento: ['empape'] }).outcome).toBe('wrong');
    const cubrir = evaluateTask(task('t7'), { material: ['papel'], porque: ['no'] });
    expect(cubrir.outcome).toBe('wrong');
    expect(cubrir.whyNot[0].es).toMatch(/sirve para secar/);
  });

  it('elegir «el más bonito» o «el primero» no es evidencia: se corrige con lo que se probó', () => {
    const r = evaluateTask(task('t5'), { afirmacion: ['plastico'], evidencia: ['plastico', 'tela'], razonamiento: ['bonito'] });
    expect(r.outcome).toBe('wrong');
    expect(r.whyNot[0].es).toMatch(/deja pasar el agua/);
  });

  it('la predicción se compara con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'material', 'plastico', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'material', 'tela', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'material', 'tela', 'nocoincidio')).toBe(true);
  });

  it('cada idea se explica en 2 o 3 casos y el dominio llega con dos casos distintos', () => {
    expect(unit.ideas.find((i) => i.id === 'material.sirve')?.contexts).toEqual(['techo', 'secar', 'bici']);
    let p = EMPTY_SCIENCE;
    for (const id of ['t3', 't4']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-16', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['material.sirve'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad excluye agua caliente, productos de limpieza y agua cerca de enchufes', () => {
    expect(unit.safety.excluded.es).toMatch(/Agua caliente/);
    expect(unit.safety.excluded.es).toMatch(/enchufes/);
    expect(unit.safety.enabledByParent).toBe(true);
  });
});

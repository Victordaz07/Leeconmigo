import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C4-U02') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C4-U02 «Energía en movimiento» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 4-PS3-1 y 4-PS3-3', () => {
    const m = scienceUnitById('C4-U02');
    expect(unit.grade).toBe(4);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
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

  it('los errores del tema («la altura no importa», «la energía desaparece», «cambiar también la bola») se corrigen con los datos', () => {
    const igual = evaluateTask(task('t5'), { afirmacion: ['igual'], evidencia: ['cuatro', 'uno'], limite: ['misma'] });
    expect(igual.whyNot[0].es).toMatch(/4 cm.*22 cm/);
    const todas = evaluateTask(task('t5'), { afirmacion: ['mas'], evidencia: ['cuatro', 'uno'], limite: ['todas'] });
    expect(todas.whyNot[0].es).toMatch(/cambias también la bola/);
    const desaparece = evaluateTask(task('t6'), { afirmacion: ['desaparecio'], evidencia: ['bloque', 'sonido'], limite: ['numeros'] });
    expect(desaparece.whyNot[0].es).toMatch(/no desaparece/);
  });

  it('el caso nuevo del carrito solo vale con más rapidez → más energía de movimiento', () => {
    expect(evaluateTask(task('t7'), { resultado: ['alta'], porque: ['energia'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t7'), { resultado: ['baja'], porque: ['energia'] }).outcome).toBe('wrong');
    expect(evaluateTask(task('t7'), { resultado: ['alta'], porque: ['color'] }).outcome).toBe('wrong');
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'mas', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'menos', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t3'), 'resultado', 'menos', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'suave', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['rapidez.energia'].stage).toBe('loExplico');
  });

  it('la ficha de seguridad excluye bolas duras o pesadas y lanzar cosas a personas', () => {
    expect(unit.safety.excluded.es).toMatch(/duras o pesadas/);
    expect(unit.safety.stopIf.some((t) => /lanza la bola/.test(t.es))).toBe(true);
  });
});

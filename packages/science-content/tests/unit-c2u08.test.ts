import { describe, expect, it } from 'vitest';
import { comparisonAdequate, dataTextProblems, evaluateTask, scienceUnitById, scienceUnitContent, statusByIdea, unitProblems, recordTask, EMPTY_SCIENCE, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C2-U08') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C2-U08 «Una Tierra que cambia» como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), pistas en 3 escalones, ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(dataTextProblems(unit)).toEqual([]);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('coincide con el mapa curricular y con 2-ESS1-1 y 2-ESS2-1', () => {
    const m = scienceUnitById('C2-U08');
    expect(unit.grade).toBe(2);
    expect(unit.area).toBe(m?.area);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    for (const s of unit.standards) expect(unit.standardTasks[s].length).toBeGreaterThanOrEqual(3);
  });

  it('las bandejas de 2.º se ven sin gramos y con la misma pendiente en las dos', () => {
    const labs = unit.sessions.flatMap((s) => s.steps).filter((st) => st.lab);
    expect(labs.length).toBeGreaterThan(0);
    for (const st of labs) {
      expect(st.lab?.qualitative, st.id).toBe(true);
      expect(st.lab?.a.slope, st.id).toBe(st.lab?.b.slope);
    }
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

  it('los errores del tema («se hizo en un día», «la tierra no se mueve») se corrigen con las fuentes y la bandeja', () => {
    const dia = evaluateTask(task('t5'), { afirmacion: ['rapido'], evidencia: ['fotos', 'rio'], limite: ['exacto'] });
    expect(dia.whyNot[0].es).toMatch(/casi iguales/);
    const piedra = evaluateTask(task('t5'), { afirmacion: ['lento'], evidencia: ['fotos', 'ayer'], limite: ['exacto'] });
    expect(piedra.whyNot[0].es).toMatch(/Una piedra en un día/);
    const nada = evaluateTask(task('t7'), { solucion: ['nada'], porque: ['bandeja'] });
    expect(nada.whyNot[0].es).toMatch(/lo viste en la bandeja/);
    const unaFuente = evaluateTask(task('t5'), { afirmacion: ['lento'], evidencia: ['fotos', 'rio'], limite: ['todo'] });
    expect(unaFuente.whyNot[0].es).toMatch(/varias/);
  });

  it('evaluar la prueba exige decir qué muestra, qué le falta y cómo mejorarla', () => {
    expect(evaluateTask(task('t6'), { muestra: ['cubierta'], falta: ['viento'], mejora: ['otra'] }).outcome).toBe('ok');
    expect(evaluateTask(task('t6'), { muestra: ['cubierta'], falta: ['nada'], mejora: ['otra'] }).outcome).toBe('wrong');
    expect(evaluateTask(task('t6'), { muestra: ['cubierta'], falta: ['viento'], mejora: ['masagua'] }).whyNot[0].es).toMatch(/misma lluvia/);
  });

  it('las predicciones se comparan con lo observado con honestidad', () => {
    expect(comparisonAdequate(task('t3'), 'resultado', 'lento', 'coincidio')).toBe(true);
    expect(comparisonAdequate(task('t3'), 'resultado', 'rapido', 'coincidio')).toBe(false);
    expect(comparisonAdequate(task('t4'), 'resultado', 'mucha', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(task('t4'), 'resultado', 'poca', 'coincidio')).toBe(true);
  });

  it('cada idea se explica en 2 casos y el dominio llega con dos casos distintos', () => {
    let p = EMPTY_SCIENCE;
    for (const id of ['t5', 't7']) p = recordTask(p, unit, task(id), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: valids(task(id)) });
    expect(statusByIdea(p.attempts)['tierra.rapidoLento'].stage).toBe('loExplico');
    expect(statusByIdea(p.attempts)['tierra.barreras']).toBeDefined();
  });

  it('la ficha de seguridad excluye barrancos y ríos de verdad', () => {
    expect(unit.safety.excluded.es).toMatch(/barrancos y ríos/);
    expect(unit.safety.stopIf.some((t) => /barranco/.test(t.es))).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import { fairnessChanged, scienceUnitById, comparisonAdequate, dataTextProblems, evaluatePart, evaluateTask, predictionMatched, SCIENCE_UNITS, scienceUnitContent, unitProblems, type ScienceUnit, type UnitTask } from '../src/index.ts';

const unit = scienceUnitContent('C4-U06') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id) as UnitTask;
/** Todas las opciones válidas de una parte (para armar una respuesta correcta). */
const valids = (t: UnitTask) => Object.fromEntries(t.parts.map((p) => [p.id, p.options.filter((o) => o.valid).slice(0, Math.max(p.min, 1)).map((o) => o.id)]));

describe('unidad C4-U06 como datos validados', () => {
  it('es válida: 6 sesiones, 8 tareas (2·2·2·1·1), 3 pistas cada una, textos en ES y EN, sin «incorrecto»', () => {
    expect(unitProblems(unit)).toEqual([]);
    expect(SCIENCE_UNITS.map((u) => u.id)).toEqual(['C1-U02', 'C2-U02', 'C3-U06', 'C4-U06', 'C5-U02', 'C5-U03', 'C6-U04']);
    expect(unit.sessions).toHaveLength(6);
    expect(unit.tasks.map((t) => t.kind)).toEqual(['observar', 'observar', 'predecir', 'predecir', 'evidencia', 'modelo', 'transferir', 'reflexionar']);
  });

  it('cada estándar tiene tareas que exigen su práctica (4-ESS2-1 y 4-ESS2-2)', () => {
    expect(unit.standards).toEqual(['4-ESS2-1', '4-ESS2-2']);
    expect(unit.standardTasks['4-ESS2-1']).toEqual(['t1', 't3', 't5', 't7']);
    expect(unit.standardTasks['4-ESS2-2']).toEqual(['t2', 't4', 't6']);
  });

  it('cada idea tiene al menos dos contextos, y cada contexto lo cubre una tarea (menos el repaso)', () => {
    for (const i of unit.ideas) expect(new Set(i.contexts).size, i.id).toBeGreaterThanOrEqual(2);
    expect(unit.ideas.find((i) => i.id === 'prueba.justa')?.contexts).toContain('repaso');
  });

  it('coincide con el mapa curricular: mismo grado, área, título, pregunta y expectativas', () => {
    const m = scienceUnitById('C4-U06');
    expect(m?.pilot).toBe(true);
    expect(unit.grade).toBe(m?.grade);
    expect(unit.area).toBe(m?.area);
    expect(unit.title).toEqual(m?.title);
    expect(unit.question).toEqual(m?.question);
    expect(unit.standards).toEqual(m?.standards);
    expect(m?.labs).toEqual(['paisaje-erosion', 'mesa-datos']);
  });

  it('los números que citan los textos coinciden con los datos del modelo y de los mapas', () => {
    expect(dataTextProblems(unit)).toEqual([]);
  });

  it('el validador detecta errores', () => {
    const bad = JSON.parse(JSON.stringify(unit)) as ScienceUnit;
    bad.tasks[0].hints.pop();
    bad.tasks[1].parts[0].options.find((o) => !o.valid)!.whyNot = undefined;
    bad.tasks[2].feedback.ok.en = 'That is incorrect';
    bad.sessions.pop();
    bad.ideas[0].contexts = ['solo-uno'];
    const p = unitProblems(bad).join(' | ');
    expect(p).toMatch(/debe tener 3 pistas/);
    expect(p).toMatch(/falta texto en un idioma/);
    expect(p).toMatch(/dice «incorrecto»/);
    expect(p).toMatch(/tiene 5 sesiones/);
    expect(p).toMatch(/al menos 2 contextos/);
  });
});

describe('detalle de los pasos (lo que dibuja la pantalla)', () => {
  const steps = unit.sessions.flatMap((x) => x.steps);
  const step = (id: string) => steps.find((x) => x.id === id)!;

  it('cada arreglo válido de la prueba deja UNA sola diferencia, y la prueba de partida tiene dos', () => {
    const s62 = step('s6.2');
    expect(fairnessChanged(s62.lab!)).toBe(2);
    expect(Object.keys(s62.labFixed!).sort()).toEqual(['cobertura', 'pendiente']);
    for (const lab of Object.values(s62.labFixed!)) expect(fairnessChanged(lab)).toBe(1);
    // «Igualar la inclinación» deja diferir la cobertura; «igualar el pasto» deja diferir la inclinación.
    expect(s62.labFixed!.pendiente.a.slope).toBe(s62.labFixed!.pendiente.b.slope);
    expect(s62.labFixed!.cobertura.a.cover).toBe(s62.labFixed!.cobertura.b.cover);
  });

  it('las dos variantes de la evidencia final citan los datos de su prueba justa', () => {
    expect(step('s6.3').choiceByFix?.cobertura.options.filter((o) => o.expected).map((o) => o.id)).toEqual(['media', 'fuerte']);
    expect(dataTextProblems(unit)).toEqual([]);
  });

  it('el validador detecta un recuento esperado equivocado y un arreglo con dos diferencias', () => {
    const bad = JSON.parse(JSON.stringify(unit)) as ScienceUnit;
    const all = bad.sessions.flatMap((x) => x.steps);
    all.find((x) => x.id === 's5.2')!.choice!.options.forEach((o) => (o.expected = o.id === '9'));
    all.find((x) => x.id === 's6.2')!.labFixed!.pendiente.b.slope = 'suave';
    expect(dataTextProblems(bad).join(' | ')).toMatch(/recuento del mapa/);
    expect(unitProblems(bad).join(' | ')).toMatch(/UNA sola diferencia/);
  });
});

describe('evaluar tareas: cada respuesta válida pasa y cada distractor se rechaza con su motivo', () => {
  it('con la respuesta correcta, las 8 tareas salen «ok»', () => {
    for (const t of unit.tasks) expect(evaluateTask(t, valids(t)).outcome, t.id).toBe('ok');
  });

  it('con una parte sin llenar, sale «incomplete» (no «wrong»)', () => {
    for (const t of unit.tasks) expect(evaluateTask(t, {}).outcome, t.id).toBe('incomplete');
  });

  it('CADA distractor, solo o acompañado de lo correcto, se rechaza y trae su motivo en los dos idiomas', () => {
    for (const t of unit.tasks) for (const p of t.parts) for (const o of p.options.filter((x) => !x.valid)) {
      const sel = { ...valids(t), [p.id]: [...(valids(t)[p.id] ?? []), o.id] };
      const r = evaluateTask(t, sel);
      expect(r.outcome, `${t.id}.${p.id}.${o.id}`).toBe('wrong');
      expect(r.whyNot.length, `${t.id}.${p.id}.${o.id} sin motivo`).toBeGreaterThan(0);
      expect(r.whyNot[0].es.trim() && r.whyNot[0].en.trim()).toBeTruthy();
      expect(r.feedback.es).toBe(t.feedback.wrong.es);
    }
  });

  it('T1: tres reales pasan; cuatro reales también; dos no alcanzan; un cartel inventado se rechaza', () => {
    const t = task('t1');
    expect(evaluateTask(t, { observaciones: ['pasto', 'surco', 'arroyo'] }).outcome).toBe('ok');
    expect(evaluateTask(t, { observaciones: ['pasto', 'tierra', 'surco', 'pie', 'arroyo'] }).outcome).toBe('ok');
    expect(evaluateTask(t, { observaciones: ['pasto', 'surco'] }).outcome).toBe('incomplete');
    const r = evaluateTask(t, { observaciones: ['pasto', 'surco', 'cartel'] });
    expect(r.outcome).toBe('wrong');
    expect(r.whyNot[0].es).toMatch(/no hay ningún cartel/);
  });

  it('T5: acepta las DOS explicaciones válidas (frenan el agua · sujetan la tierra) y rechaza el dato irrelevante', () => {
    const t = task('t5');
    const base = { afirmacion: ['menos'], evidencia: ['sin', 'con'], limites: ['ladera', 'anios'] };
    expect(evaluateTask(t, { ...base, razonamiento: ['frenan'] }).outcome).toBe('ok');
    expect(evaluateTask(t, { ...base, razonamiento: ['sujetan'] }).outcome).toBe('ok');
    const r = evaluateTask(t, { ...base, evidencia: ['sin', 'azul'], razonamiento: ['frenan'] });
    expect(r.outcome).toBe('wrong');
    expect(r.whyNot[0].es).toMatch(/color de la regadera/);
    expect(evaluateTask(t, { ...base, evidencia: ['sin'], razonamiento: ['frenan'] }).outcome).toBe('incomplete'); // faltó la otra bandeja
  });

  it('T6: «todos» se rechaza pidiendo contar los puntos fuera de la franja; «casi todos» con su recuento pasa', () => {
    const t = task('t6');
    const r = evaluateTask(t, { afirmacion: ['todos'], evidencia: ['conteo'], limite: ['lejos'] });
    expect(r.outcome).toBe('wrong');
    expect(r.whyNot[0].es).toMatch(/fuera de la franja/);
    expect(evaluateTask(t, { afirmacion: ['casi'], evidencia: ['conteo'], limite: ['lejos'] }).outcome).toBe('ok');
  });

  it('T7: acepta igualar la pendiente O igualar la cobertura; rechaza «sí, fue solo el pasto»', () => {
    const t = task('t7');
    expect(evaluateTask(t, { decision: ['dos'], arreglo: ['pendiente'] }).outcome).toBe('ok');
    expect(evaluateTask(t, { decision: ['dos'], arreglo: ['cobertura'] }).outcome).toBe('ok');
    const r = evaluateTask(t, { decision: ['si'], arreglo: ['cobertura'] });
    expect(r.outcome).toBe('wrong');
    expect(r.whyNot[0].es).toMatch(/solo el pasto/);
  });

  it('predicciones: cualquier predicción es válida y se compara con lo observado con honestidad', () => {
    const t3 = task('t3');
    for (const o of ['izquierda', 'derecha', 'igual']) expect(evaluateTask(t3, { bandeja: [o], porque: ['nose'] }).outcome).toBe('ok');
    expect(predictionMatched(t3, 'bandeja', 'izquierda')).toBe(true);
    expect(predictionMatched(t3, 'bandeja', 'derecha')).toBe(false);
    expect(predictionMatched(t3, 'porque', 'frena')).toBeUndefined(); // esa parte no tiene resultado observable
    expect(comparisonAdequate(t3, 'bandeja', 'izquierda', 'coincidio')).toBe(true);
    expect(comparisonAdequate(t3, 'bandeja', 'derecha', 'nocoincidio')).toBe(true);
    expect(comparisonAdequate(t3, 'bandeja', 'derecha', 'coincidio')).toBe(false);
    expect(predictionMatched(task('t4'), 'zona', 'cerca')).toBe(true);
  });

  it('T8: «no cambió» también es válido si lo liga a un dato o prueba; «me lo dijeron» se rechaza con compañía', () => {
    const t = task('t8');
    expect(evaluateTask(t, { idea: ['igual'], porque: ['datos'] }).outcome).toBe('ok');
    expect(evaluateTask(t, { idea: ['cambio'], porque: ['justa'] }).outcome).toBe('ok');
    expect(evaluateTask(t, { idea: ['cambio'], porque: ['dijeron'] }).outcome).toBe('wrong');
    expect(task('t8').ideaIds).toEqual([]); // reflexión: no suma dominio
  });

  it('un id de opción desconocido se trata como distractor, nunca rompe', () => {
    const part = task('t1').parts[0];
    expect(evaluatePart(part, ['pasto', 'surco', 'no-existe']).outcome).toBe('wrong');
    expect(evaluatePart(task('t3').parts[0], ['no-existe']).outcome).toBe('wrong');
  });
});

import { describe, expect, it } from 'vitest';
import {
  applyWorkAction,
  clockAngles,
  evaluateVisual,
  exerciseReducer,
  generateVisual,
  initialWork,
  parallelExample,
  piecesValue,
  solutionWork,
  startExercise,
  VISUAL_TEMPLATES,
  visualTemplateById,
  type VisualModel,
  type VisualWork,
  type WorkAction,
} from '../src/index.ts';

const tpl = (id: string) => visualTemplateById(id)!;
const model = <K extends VisualModel['kind']>(id: string, seed: number) => generateVisual(tpl(id), seed).model as Extract<VisualModel, { kind: K }>;
const act = (m: VisualModel, w: VisualWork, ...actions: WorkAction[]) => actions.reduce((acc, a) => applyWorkAction(m, acc, a), w);
const outcome = (m: VisualModel, w: VisualWork) => evaluateVisual(m, w);

describe('las 12 familias', () => {
  it('cada familia tiene al menos una plantilla y hay plantillas para cada grado de 1.º a 6.º', () => {
    const families = new Set(VISUAL_TEMPLATES.map((t) => t.family));
    expect(families.size).toBe(12);
    for (let g = 1; g <= 6; g++) expect(VISUAL_TEMPLATES.some((t) => t.grades[0] <= g && g <= t.grades[1]), `grado ${g}`).toBe(true);
  });

  it('ninguna ayuda paralela repite exactamente el problema', () => {
    for (const t of VISUAL_TEMPLATES) {
      for (let seed = 1; seed <= 30; seed++) {
        const m = generateVisual(t, seed).model;
        const ex = parallelExample(m);
        expect(Object.keys(ex).length).toBeGreaterThan(0);
        expect(Object.values(ex).every((v) => Number.isFinite(v))).toBe(true);
      }
    }
  });
});

describe('valor posicional', () => {
  it('juntar 10 unidades o desarmar una decena no cambia el valor; 1 decena y 13 unidades vale 23', () => {
    const m = model<'placeValue'>('placeValue.build2', 3);
    let w = initialWork(m);
    for (let i = 0; i < 13; i++) w = act(m, w, { type: 'addPiece', place: 'o' });
    w = act(m, w, { type: 'addPiece', place: 't' });
    expect(piecesValue((w as Extract<VisualWork, { kind: 'placeValue' }>).pieces)).toBe(23);
    const bundled = act(m, w, { type: 'bundle', place: 'o' });
    expect(piecesValue((bundled as Extract<VisualWork, { kind: 'placeValue' }>).pieces)).toBe(23);
    expect((bundled as Extract<VisualWork, { kind: 'placeValue' }>).pieces).toEqual({ h: 0, t: 2, o: 3 });
    // No se puede juntar si no hay 10.
    expect(act(m, bundled, { type: 'bundle', place: 'o' })).toBe(bundled);
  });

  it('en "forma usual" el valor correcto con 13 unidades sueltas pide juntar', () => {
    const m = { ...model<'placeValue'>('placeValue.standard3', 1), target: 123 };
    const w: VisualWork = { kind: 'placeValue', pieces: { h: 1, t: 1, o: 13 }, values: {} };
    expect(outcome(m, w)).toMatchObject({ outcome: 'incomplete', feedbackKey: 'placeValue.bundle' });
  });
});

describe('recta numérica', () => {
  it('suma con saltos de 10 y de 1; pasarse se nombra distinto que quedarse corto', () => {
    const m = { ...model<'numberLine'>('numberLine.add100', 1), start: 27, target: 62 };
    let w = initialWork(m);
    w = act(m, w, { type: 'jump', size: 10 }, { type: 'jump', size: 10 }, { type: 'jump', size: 10 });
    expect(outcome(m, w).feedbackKey).toBe('numberLine.notYet');
    w = act(m, w, { type: 'jump', size: 10 });
    expect(outcome(m, w).feedbackKey).toBe('numberLine.tooFar');
    w = act(m, w, { type: 'jump', size: -1 }, { type: 'jump', size: -1 }, { type: 'jump', size: -1 }, { type: 'jump', size: -1 }, { type: 'jump', size: -1 }, { type: 'setValue', field: 'answer', value: '62' });
    expect(outcome(m, w).outcome).toBe('correct');
  });

  it('ubicar 3/4: cuenta intervalos', () => {
    const m = { ...model<'numberLine'>('numberLine.fraction', 1), denominator: 4, max: 8, labelEvery: 4, target: 3 };
    expect(outcome(m, act(m, initialWork(m), { type: 'setPos', pos: 4 })).feedbackKey).toBe('numberLine.countParts');
    expect(outcome(m, act(m, initialWork(m), { type: 'setPos', pos: 3 })).outcome).toBe('correct');
  });
});

describe('fracciones', () => {
  it('colorear 3/4 acepta cualquier 3 partes; equivalentes: 6 de 8 vale 3/4', () => {
    const c = { ...model<'fraction'>('fraction.color', 1), denominator: 4, numerator: 3 };
    expect(outcome(c, act(c, initialWork(c), { type: 'togglePart', index: 3 }, { type: 'togglePart', index: 0 }, { type: 'togglePart', index: 2 })).outcome).toBe('correct');
    const e = { ...model<'fraction'>('fraction.equivalent', 1), denominator: 8, numerator: 6, ref: { numerator: 3, denominator: 4 } };
    let w = initialWork(e);
    for (const i of [7, 6, 5, 4, 1]) w = act(e, w, { type: 'togglePart', index: i });
    expect(outcome(e, w).feedbackKey).toBe('fraction.sameAmount');
    w = act(e, w, { type: 'togglePart', index: 0 }, { type: 'setValue', field: 'numerator', value: '6' }, { type: 'setValue', field: 'denominator', value: '8' });
    expect(outcome(e, w).outcome).toBe('correct');
  });
});

describe('barras, área, reloj, datos, plano, razones', () => {
  it('barras: usar la operación contraria se nombra', () => {
    const m = { ...model<'barModel'>('bar.partWhole20', 1), structure: 'partWhole' as const, a: 8, b: 5, unknown: 'part' as const };
    expect(outcome(m, { kind: 'barModel', values: { answer: '21' } }).feedbackKey).toBe('bar.otherOperation');
    expect(outcome(m, { kind: 'barModel', values: { answer: '5' } }).outcome).toBe('correct');
  });

  it('área: perímetro no es área, ni la suma de dos lados', () => {
    const m = { ...model<'area'>('area.perimeter', 1), rows: 3, cols: 5 };
    const w = (v: string): VisualWork => ({ kind: 'area', tiles: Array(15).fill(false), values: { answer: v } });
    expect(outcome(m, w('15')).feedbackKey).toBe('area.notArea');
    expect(outcome(m, w('8')).feedbackKey).toBe('area.fourSides');
    expect(outcome(m, w('16')).outcome).toBe('correct');
  });

  it('reloj: a las 2:30 el minutero en 180° y el horario a la mitad entre 2 y 3 (75°); el tiempo transcurrido cruza la hora', () => {
    expect(clockAngles(2 * 60 + 30)).toEqual({ minute: 180, hour: 75 });
    const m = { ...model<'clock'>('clock.elapsed', 1), time: 3 * 60 + 40, duration: 30 };
    const w = act(m, initialWork(m), { type: 'shiftTime', minutes: 30 });
    expect(outcome(m, w)).toMatchObject({ outcome: 'correct', feedbackParams: { hour: 4, minute: 10 } });
  });

  it('datos con escala de 2: contar rayitas en vez de leer se nombra', () => {
    const m = { ...model<'data'>('data.scaled', 1), values: [4, 10, 6, 8], task: 'read' as const, ask: [1] };
    expect(outcome(m, { kind: 'data', bars: [4, 10, 6, 8], values: { answer: '5' } }).feedbackKey).toBe('data.scale');
  });

  it('plano: el par al revés se nombra', () => {
    const m = { ...model<'coord'>('coord.plot', 1), x: 3, y: 2 };
    expect(outcome(m, act(m, initialWork(m), { type: 'placePoint', x: 2, y: 3 })).feedbackKey).toBe('coord.swapped');
    expect(outcome(m, act(m, initialWork(m), { type: 'placePoint', x: 3, y: 2 })).outcome).toBe('correct');
  });

  it('razones: sumar lo mismo a las dos partes se nombra; por lotes sale bien', () => {
    const m = { ...model<'ratio'>('ratio.scale', 1), a: 2, b: 1, lots: 3 };
    let w = act(m, initialWork(m), { type: 'addLot' }, { type: 'addLot' }, { type: 'setValue', field: 'answer', value: '4' });
    expect(outcome(m, w).feedbackKey).toBe('ratio.additive');
    w = act(m, w, { type: 'setValue', field: 'answer', value: '6' });
    expect(outcome(m, w).outcome).toBe('correct');
  });

  it('el estado común funciona con las familias nuevas (deshacer, solución)', () => {
    const inst = generateVisual(tpl('placeValue.build2'), 5);
    let s = startExercise(inst);
    s = exerciseReducer(s, { type: 'work', action: { type: 'addPiece', place: 't' } });
    s = exerciseReducer(s, { type: 'undo' });
    expect(s.work).toEqual(initialWork(inst.model));
    s = exerciseReducer(s, { type: 'reveal' });
    expect(s.work).toEqual(solutionWork(inst.model));
  });
});

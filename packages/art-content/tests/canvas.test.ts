import { describe, expect, it } from 'vitest';
import {
  MAX_POINTS_PER_STROKE, MAX_STROKES, MAX_TOTAL_POINTS, MIN_POINT_DISTANCE, beginStroke, brush, cancelStroke, canRedo, canUndo, clearDrawing,
  emptyDrawing, endStroke, extendStroke, fromSaved, meanPressure, redo, strokePathData, toSaved, totalPoints, undo, visibleStrokes, widthAt,
  type Drawing,
} from '../src/index.ts';

const b = brush();
const draw = (d: Drawing, n: number, x0 = 0): Drawing => {
  let s = beginStroke(d, x0, 0, 0.5, b);
  for (let i = 1; i <= n; i++) s = extendStroke(s, x0 + i * 5, i * 3, 0.5);
  return endStroke(s);
};

describe('trazos', () => {
  it('un trazo terminado se guarda y ya no hay trazo activo', () => {
    const d = draw(emptyDrawing(), 10);
    expect(d.strokes).toHaveLength(1);
    expect(d.active).toBeNull();
    expect(d.strokes[0]!.points).toHaveLength(11);
  });

  it('un toque sin movimiento queda como un puntito, no se pierde', () => {
    const d = endStroke(beginStroke(emptyDrawing(), 10, 10, 0.5, b));
    expect(d.strokes).toHaveLength(1);
    expect(strokePathData(d.strokes[0]!.points)).toBe('M 10 10 L 10 10');
  });

  it('empezar otro trazo con uno activo TERMINA el primero (no se pierde)', () => {
    let d = beginStroke(emptyDrawing(), 0, 0, 0.5, b);
    d = extendStroke(d, 20, 20, 0.5);
    d = beginStroke(d, 100, 100, 0.5, b);
    expect(d.strokes).toHaveLength(1);
    expect(d.strokes[0]!.points).toHaveLength(2);
    expect(d.active!.points).toHaveLength(1);
    expect(d.active!.id).not.toBe(d.strokes[0]!.id);
  });

  it('cancelar un trazo no lo guarda ni lo deja colgado', () => {
    let d = beginStroke(draw(emptyDrawing(), 5), 50, 50, 0.5, b);
    d = extendStroke(d, 80, 80, 0.5);
    d = cancelStroke(d);
    expect(d.active).toBeNull();
    expect(d.strokes).toHaveLength(1);
    expect(d.cancelled).toBe(1);
    // seguir dibujando después de cancelar funciona
    expect(draw(d, 3, 200).strokes).toHaveLength(2);
    // cancelar sin trazo activo no cambia nada
    expect(cancelStroke(d)).toBe(d);
  });

  it('extender o terminar sin trazo activo no hace nada', () => {
    const d = emptyDrawing();
    expect(extendStroke(d, 1, 1, 0.5)).toBe(d);
    expect(endStroke(d)).toBe(d);
  });

  it('ignora puntos muy cercanos y valores no numéricos', () => {
    let d = beginStroke(emptyDrawing(), 0, 0, 0.5, b);
    d = extendStroke(d, MIN_POINT_DISTANCE / 2, 0, 0.5);
    d = extendStroke(d, NaN, 4, 0.5);
    d = extendStroke(d, Infinity, 4, 0.5);
    expect(d.active!.points).toHaveLength(1);
    expect(beginStroke(emptyDrawing(), NaN, 0, 0.5, b).active).toBeNull();
  });

  it('la presión se limita a 0–1 y 0.5 es el grosor base', () => {
    expect(widthAt(brush('#000', 10), 0.5)).toBeCloseTo(10);
    expect(widthAt(brush('#000', 10), 1)).toBeCloseTo(14);
    expect(widthAt(brush('#000', 10), 0)).toBeCloseTo(6);
    expect(widthAt(brush('#000', 10), 7)).toBeCloseTo(14);
    expect(widthAt(brush('#000', 10, true), 1)).toBe(10); // la goma no cambia con la presión
    expect(meanPressure([])).toBe(0.5);
  });
});

describe('deshacer y rehacer', () => {
  it('deshacer quita el último trazo y rehacer lo devuelve', () => {
    let d = draw(draw(emptyDrawing(), 4), 4, 100);
    const [first, second] = d.strokes;
    d = undo(d);
    expect(d.strokes).toEqual([first]);
    expect(canRedo(d)).toBe(true);
    d = redo(d);
    expect(d.strokes).toEqual([first, second]);
    expect(canRedo(d)).toBe(false);
  });

  it('dibujar algo nuevo borra lo que se podía rehacer', () => {
    let d = undo(draw(emptyDrawing(), 4));
    expect(canRedo(d)).toBe(true);
    d = draw(d, 2);
    expect(canRedo(d)).toBe(false);
  });

  it('con un trazo activo no se puede deshacer (no se pierde el dedo puesto)', () => {
    const d = beginStroke(draw(emptyDrawing(), 3), 5, 5, 0.5, b);
    expect(canUndo(d)).toBe(false);
    expect(undo(d)).toBe(d);
  });

  it('deshacer y rehacer 100 veces no pierde nada', () => {
    let d = emptyDrawing();
    for (let i = 0; i < 20; i++) d = draw(d, 5, i * 30);
    const before = d.strokes;
    for (let i = 0; i < 20; i++) d = undo(d);
    expect(d.strokes).toHaveLength(0);
    for (let i = 0; i < 20; i++) d = redo(d);
    expect(d.strokes).toEqual(before);
  });

  it('borrar todo deja el papel en blanco y conserva el contador de ids', () => {
    const d = clearDrawing(draw(emptyDrawing(), 5));
    expect(d.strokes).toHaveLength(0);
    expect(d.nextId).toBeGreaterThan(1);
    expect(draw(d, 2).strokes[0]!.id).toBe(d.nextId);
  });
});

describe('memoria acotada', () => {
  it('un trazo no pasa del tope de puntos', () => {
    let d = beginStroke(emptyDrawing(), 0, 0, 0.5, b);
    for (let i = 1; i < MAX_POINTS_PER_STROKE + 500; i++) d = extendStroke(d, i * 3, (i % 7) * 4, 0.5);
    expect(d.active!.points.length).toBe(MAX_POINTS_PER_STROKE);
  });

  it('no pasa del tope de trazos: se descarta el más viejo', () => {
    let d = emptyDrawing();
    for (let i = 0; i < MAX_STROKES + 25; i++) d = endStroke(beginStroke(d, i, i, 0.5, b));
    expect(d.strokes).toHaveLength(MAX_STROKES);
    expect(d.strokes[0]!.id).toBe(26);
  });

  it('el total de puntos no pasa del tope', () => {
    let d = emptyDrawing();
    for (let s = 0; s < 40; s++) {
      d = beginStroke(d, 0, 0, 0.5, b);
      for (let i = 1; i < MAX_POINTS_PER_STROKE; i++) d = extendStroke(d, i * 3, (i % 5) * 4, 0.5);
      d = endStroke(d);
    }
    expect(totalPoints(d)).toBeLessThanOrEqual(MAX_TOTAL_POINTS);
  });
});

describe('camino suavizado', () => {
  it('sin puntos no hay camino', () => expect(strokePathData([])).toBeNull());
  it('dos puntos son una recta', () =>
    expect(strokePathData([{ x: 0, y: 0, p: 0.5 }, { x: 10, y: 10, p: 0.5 }])).toBe('M 0 0 L 10 10'));
  it('varios puntos usan curvas por los puntos medios y terminan en el último', () => {
    const d = draw(emptyDrawing(), 6);
    const path = strokePathData(d.strokes[0]!.points)!;
    expect(path.startsWith('M 0 0')).toBe(true);
    expect(path).toContain(' Q ');
    expect(path.endsWith('L 30 18')).toBe(true);
  });
  it('visibleStrokes incluye el trazo activo', () => {
    const d = beginStroke(draw(emptyDrawing(), 3), 9, 9, 0.5, b);
    expect(visibleStrokes(d)).toHaveLength(2);
  });
});

describe('guardado', () => {
  it('ida y vuelta conserva los trazos y los ids siguen creciendo', () => {
    const d = draw(draw(emptyDrawing(), 6), 6, 100);
    const back = fromSaved(JSON.parse(JSON.stringify(toSaved(d))))!;
    expect(back.strokes).toEqual(d.strokes);
    expect(back.nextId).toBe(Math.max(...d.strokes.map((s) => s.id)) + 1);
  });

  it('rechaza lo que no cuadra (versión, forma, topes, números)', () => {
    expect(fromSaved(null)).toBeNull();
    expect(fromSaved({ version: 2, strokes: [] })).toBeNull();
    expect(fromSaved({ version: 1, strokes: 'x' })).toBeNull();
    expect(fromSaved({ version: 1, strokes: [{ id: 1, brush: { color: '#000', width: 4, eraser: false }, points: [] }] })).toBeNull();
    expect(fromSaved({ version: 1, strokes: [{ id: 1, brush: { color: '#000', width: 4, eraser: false }, points: [{ x: NaN, y: 0, p: 0.5 }] }] })).toBeNull();
    expect(fromSaved({ version: 1, strokes: [{ id: 1, brush: { color: 3, width: 4, eraser: false }, points: [{ x: 0, y: 0, p: 0.5 }] }] })).toBeNull();
  });

  it('un dibujo vacío es válido', () => expect(fromSaved(toSaved(emptyDrawing()))!.strokes).toEqual([]));
});

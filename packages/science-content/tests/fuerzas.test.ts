import { describe, expect, it } from 'vitest';
import { FORCE_MODEL, MAX_PUSHES, CART_MOVE_TEXT, SWING_TEXT, TABLE_PAIRS, balanced, cartMove, netPush, swingSide, travelCm } from '../src/labs/fuerzas.ts';

describe('modelo de fuerzas del carrito', () => {
  it('empujones iguales (equilibrados) no cambian el movimiento: se queda quieto', () => {
    for (let n = 0; n <= MAX_PUSHES; n++) {
      expect(balanced(n, n)).toBe(true);
      expect(cartMove(n, n)).toBe('quieto');
      expect(travelCm(n, n)).toBe(0);
    }
  });
  it('desiguales: se mueve hacia el lado del empujón más fuerte', () => {
    expect(cartMove(0, 2)).toBe('derecha');
    expect(cartMove(3, 1)).toBe('izquierda');
    expect(cartMove(1, 3)).toBe('derecha');
    expect(netPush(3, 1)).toBe(-2);
  });
  it('a mayor diferencia, más lejos; y es simétrico', () => {
    expect(travelCm(0, 1)).toBeLessThan(travelCm(0, 2));
    expect(travelCm(0, 2)).toBeLessThan(travelCm(0, 3));
    expect(travelCm(3, 1)).toBe(travelCm(1, 3));
    expect([travelCm(0, 1), travelCm(0, 2), travelCm(0, 3)]).toEqual([10, 24, 42]);
  });
  it('la tabla del niño mezcla casos equilibrados y desequilibrados', () => {
    expect(TABLE_PAIRS.filter(([l, r]) => balanced(l, r))).toHaveLength(2);
    expect(TABLE_PAIRS.filter(([l, r]) => !balanced(l, r))).toHaveLength(3);
  });
  it('el péndulo alterna izquierda y derecha, y el patrón predice el latido siguiente', () => {
    expect([0, 1, 2, 3, 4, 5].map(swingSide)).toEqual(['izquierda', 'derecha', 'izquierda', 'derecha', 'izquierda', 'derecha']);
    expect(swingSide(7)).toBe('derecha');
    expect(swingSide(10)).toBe('izquierda');
    for (let t = 0; t < 12; t++) expect(swingSide(t + 2)).toBe(swingSide(t));
  });
  it('los textos existen en los dos idiomas', () => {
    for (const m of Object.values(CART_MOVE_TEXT)) expect(m.es.trim() && m.en.trim()).toBeTruthy();
    for (const m of Object.values(SWING_TEXT)) expect(m.es.trim() && m.en.trim()).toBeTruthy();
  });
  it('el modelo dice qué NO representa (fricción, fuerza en números)', () => {
    expect(FORCE_MODEL.doesNotRepresent.some((t) => /fricción/.test(t.es))).toBe(true);
    expect(FORCE_MODEL.doesNotRepresent.some((t) => /en números/.test(t.es))).toBe(true);
  });
});

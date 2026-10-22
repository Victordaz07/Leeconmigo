import { describe, expect, it } from 'vitest';
import { canNavigate, creditedMs, MAX_TICK_GAP_MS, NAV_DEBOUNCE_MS, pageCapMs, tickDelta } from '../src/session/free-clock';

describe('reloj de lectura libre', () => {
  it('el tope por página crece con las palabras y deja margen', () => {
    expect(pageCapMs(0)).toBe(25_000);
    expect(pageCapMs(100)).toBe(225_000);
    expect(pageCapMs(300)).toBeGreaterThan(pageCapMs(100));
  });
  it('se acredita el tiempo real hasta el tope; lo que sobra no cuenta', () => {
    expect(creditedMs(60_000, 100)).toBe(60_000);
    expect(creditedMs(10 * 60_000, 100)).toBe(225_000); // dejó la tablet 10 min en una página de 100 palabras
    expect(creditedMs(-5, 100)).toBe(0);
  });
  it('un doble toque no salta dos páginas', () => {
    expect(canNavigate(null, 1000)).toBe(true);
    expect(canNavigate(1000, 1000 + NAV_DEBOUNCE_MS - 1)).toBe(false);
    expect(canNavigate(1000, 1000 + NAV_DEBOUNCE_MS)).toBe(true);
  });
  it('el segundo plano (salto grande) y un reloj hacia atrás no suman', () => {
    expect(tickDelta(1000, 1250)).toBe(250);
    expect(tickDelta(1000, 1000 + MAX_TICK_GAP_MS)).toBe(MAX_TICK_GAP_MS);
    expect(tickDelta(1000, 1000 + MAX_TICK_GAP_MS + 1)).toBe(0);
    expect(tickDelta(5000, 4000)).toBe(0);
  });
});

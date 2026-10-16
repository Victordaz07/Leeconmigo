import { describe, expect, it } from 'vitest';
import { effortReason, effortStars, ENERGY_OPTIONS, kiteMeters } from '../src/index.ts';

describe('estrellas por esfuerzo (D11)', () => {
  it('1 por terminar, +1 por pedir ayuda o reintentar, +1 por leer sin pausas largas', () => {
    expect(effortStars({ completed: true, helpedOrRetried: false, longPauses: 2 })).toBe(1);
    expect(effortStars({ completed: true, helpedOrRetried: true, longPauses: 1 })).toBe(2);
    expect(effortStars({ completed: true, helpedOrRetried: false, longPauses: 0 })).toBe(2);
    expect(effortStars({ completed: true, helpedOrRetried: true, longPauses: 0 })).toBe(3);
  });

  it('sin terminar no hay estrellas de cierre (no es un fracaso: la historia sigue a medias)', () => {
    expect(effortStars({ completed: false, helpedOrRetried: true, longPauses: 0 })).toBe(0);
  });

  it('la frase celebra el esfuerzo concreto, nunca califica', () => {
    expect(effortReason({ helpedOrRetried: true, longPauses: 3 })).toBe('por volver a intentarlo');
    for (const r of [effortReason({ helpedOrRetried: false, longPauses: 0 }), effortReason({ helpedOrRetried: false, longPauses: 2 })]) {
      expect(r).not.toMatch(/mal|incorrect|error/i);
    }
  });
});

describe('papalote y energía', () => {
  it('el papalote sube 1 m por cada 20 s de lectura válida', () => {
    expect(kiteMeters(840)).toBe(42);
    expect(kiteMeters(0)).toBe(0);
    expect(kiteMeters(-5)).toBe(0);
  });

  it('tres energías: 20, 15 y 8 minutos (B2)', () => {
    expect(ENERGY_OPTIONS.map((o) => o.minutes)).toEqual([20, 15, 8]);
  });
});

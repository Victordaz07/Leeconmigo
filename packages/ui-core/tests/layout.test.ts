import { describe, expect, it } from 'vitest';
import { columnsFor, itemWidth, layoutFor } from '../src/index.ts';

describe('acomodo por pantalla', () => {
  it('tablet acostada: riel completo', () => {
    expect(layoutFor(1280, 800)).toMatchObject({ phone: false, portrait: false, narrow: false, short: false, nav: 'rail' });
  });
  it('tablet en vertical: barra abajo y una columna', () => {
    expect(layoutFor(800, 1280)).toMatchObject({ phone: false, portrait: true, nav: 'bottom' });
  });
  it('teléfono vertical: barra abajo, estrecho, margen pequeño', () => {
    expect(layoutFor(390, 844)).toMatchObject({ phone: true, portrait: true, narrow: true, nav: 'bottom', gutter: 16 });
  });
  it('teléfono acostado: riel compacto y poca altura', () => {
    expect(layoutFor(844, 390)).toMatchObject({ phone: true, portrait: false, short: true, nav: 'railCompact' });
  });
  it('columnas que caben y ancho de cada una', () => {
    expect(columnsFor(358, 150, 12)).toBe(2);
    expect(columnsFor(1100, 160, 16)).toBe(6);
    expect(columnsFor(100, 150, 12)).toBe(1);
    expect(itemWidth(358, 2, 12)).toBe(173);
  });
});

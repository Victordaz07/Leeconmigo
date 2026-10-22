import { describe, expect, it } from 'vitest';
import { FINANZAS_COPY } from '../../ui-core/src/index.ts';
import { FINANCE_UNITS, reasonKey } from '../src/index.ts';

/** Los textos de la interfaz cubren todo lo que el motor puede devolver, en los dos idiomas, sin «incorrecto». */
describe('textos de la interfaz de Finanzas', () => {
  it('cada razón de estrellas tiene frase en ES y EN', () => {
    for (const k of ['adjustedAndExplained', 'adjusted', 'explained', 'completed'] as const) {
      expect(FINANZAS_COPY.closing.reason[k].es.length).toBeGreaterThan(5);
      expect(FINANZAS_COPY.closing.reason[k].en.length).toBeGreaterThan(5);
    }
    expect(reasonKey({ completed: true, adjusted: false, explained: false })).toBe('completed');
  });

  it('cada paso de la unidad tiene su aviso de lo que falta', () => {
    for (const s of FINANCE_UNITS[0]!.steps) expect(FINANZAS_COPY.missing[s.kind].es.length).toBeGreaterThan(5);
  });

  it('ni un texto de la interfaz dice «incorrecto» o «wrong» ni usa $ o € (dinero de mentira)', () => {
    const all = JSON.stringify(FINANZAS_COPY, (_k, v) => (typeof v === 'function' ? v(1, 2, 'x') : v));
    expect(all).not.toMatch(/incorrect|wrong|mal hecho/i);
    expect(all).not.toMatch(/[$€£]/);
  });
});

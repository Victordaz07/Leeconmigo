import { describe, expect, it } from 'vitest';
import { INGREDIENT_NAME, MIXES, MIX_INGREDIENTS, MIX_MODEL, MIX_NAME, MIX_TESTS, hasBubbles, mixObserved, newSubstance, recoverable } from '../src/labs/mezclas.ts';

describe('modelo de las mezclas', () => {
  it('hay cinco mezclas y dos pruebas', () => {
    expect(MIXES).toHaveLength(5);
    expect([...MIX_TESTS]).toEqual(['burbujas', 'recuperar']);
  });
  it('solo el bicarbonato con vinagre da burbujas y no se puede recuperar lo de antes', () => {
    expect(MIXES.filter(hasBubbles)).toEqual(['bicarbonato_vinagre']);
    expect(MIXES.filter((m) => !recoverable(m))).toEqual(['bicarbonato_vinagre']);
    expect(MIXES.filter(newSubstance)).toEqual(['bicarbonato_vinagre']);
  });
  it('disolver (sal, azúcar) o revolver (arena, harina) NO crea una sustancia nueva', () => {
    for (const m of ['sal_agua', 'azucar_agua', 'arena_agua', 'harina_agua'] as const) expect(newSubstance(m), m).toBe(false);
  });
  it('una sola prueba no decide: la regla pide señal Y no recuperar', () => {
    for (const m of MIXES) expect(newSubstance(m)).toBe(hasBubbles(m) && !recoverable(m));
  });
  it('cada observación y cada ingrediente están en los dos idiomas', () => {
    for (const m of MIXES) {
      expect(MIX_NAME[m].es && MIX_NAME[m].en).toBeTruthy();
      for (const t of MIX_TESTS) expect(mixObserved(m, t).es.trim() && mixObserved(m, t).en.trim()).toBeTruthy();
      for (const i of MIX_INGREDIENTS[m]) expect(INGREDIENT_NAME[i].es && INGREDIENT_NAME[i].en).toBeTruthy();
    }
  });
  it('el texto de lo recuperable concuerda con el modelo', () => {
    for (const m of MIXES) expect(/^(Sí|Yes)/.test(mixObserved(m, 'recuperar').es) || /^No/.test(mixObserved(m, 'recuperar').es)).toBe(true);
    for (const m of MIXES) expect(mixObserved(m, 'recuperar').es.startsWith('Sí')).toBe(recoverable(m));
    for (const m of MIXES) expect(mixObserved(m, 'recuperar').en.startsWith('Yes')).toBe(recoverable(m));
  });
  it('el modelo dice qué NO representa (recipiente cerrado, átomos)', () => {
    expect(MIX_MODEL.doesNotRepresent.some((t) => /cerrado/.test(t.es))).toBe(true);
    expect(MIX_MODEL.doesNotRepresent.some((t) => /átomos/.test(t.es))).toBe(true);
  });
});

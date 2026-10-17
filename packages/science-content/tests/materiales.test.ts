import { describe, expect, it } from 'vitest';
import { bestFor, bestMaterial, LEVEL_TEXT, MATERIAL_NAME, MATERIALS, MATERIALS_MODEL, materialResult } from '../src/index.ts';

describe('modelo del probador de materiales', () => {
  it('cada propósito tiene UN material claramente mejor (la decisión del niño no depende de un empate)', () => {
    expect(bestMaterial('techo')).toBe('plastico');
    expect(bestMaterial('secar')).toBe('papel');
    for (const test of ['techo', 'secar'] as const) {
      const [first, second] = bestFor(test);
      const rank = { nada: 0, poco: 1, mucho: 2 };
      const score = (m: (typeof MATERIALS)[number]) => (test === 'techo' ? rank[materialResult(m, test)] : -rank[materialResult(m, test)]);
      expect(score(first), test).toBeLessThan(score(second));
    }
  });

  it('el mejor material para un techo NO es el mejor para secar: el propósito decide', () => {
    expect(bestMaterial('techo')).not.toBe(bestMaterial('secar'));
    expect(materialResult('plastico', 'techo')).toBe('nada');
    expect(materialResult('plastico', 'secar')).toBe('nada');
    expect(materialResult('papel', 'techo')).toBe('mucho');
    expect(materialResult('papel', 'secar')).toBe('mucho');
  });

  it('los cuatro materiales y los tres niveles se dicen en palabras, en español e inglés', () => {
    expect(MATERIALS).toHaveLength(4);
    for (const m of MATERIALS) expect(MATERIAL_NAME[m].es && MATERIAL_NAME[m].en).toBeTruthy();
    for (const test of ['techo', 'secar'] as const) for (const lvl of ['nada', 'poco', 'mucho'] as const) {
      expect(LEVEL_TEXT[test][lvl].es.trim()).not.toBe('');
      expect(LEVEL_TEXT[test][lvl].en.trim()).not.toBe('');
    }
  });

  it('el modelo dice qué NO representa (no es un material real ni mide cantidades)', () => {
    expect(MATERIALS_MODEL.doesNotRepresent.length).toBeGreaterThanOrEqual(3);
    expect(MATERIALS_MODEL.assumptions.some((a) => /iguales/.test(a.es))).toBe(true);
  });
});

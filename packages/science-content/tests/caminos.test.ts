import { describe, expect, it } from 'vitest';
import { OUTCOME_TEXT, PATH_MATERIALS, PATH_MODEL, PATH_NAME, WALL_BRIGHTNESS, lightReachesWall, makesShadow, outcomeOf } from '../src/labs/caminos.ts';

describe('modelo de los caminos de luz', () => {
  it('hay cuatro materiales y cada uno da un resultado distinto', () => {
    expect(PATH_MATERIALS).toHaveLength(4);
    expect(new Set(PATH_MATERIALS.map(outcomeOf)).size).toBe(4);
  });
  it('transparente deja pasar toda, calco un poco, cartulina nada y el aluminio la rebota', () => {
    expect(outcomeOf('transparente')).toBe('toda');
    expect(outcomeOf('calco')).toBe('poca');
    expect(outcomeOf('cartulina')).toBe('nada');
    expect(outcomeOf('aluminio')).toBe('rebota');
  });
  it('la pared se ilumina más cuanta más luz pasa; con cartulina y aluminio hay sombra', () => {
    expect(WALL_BRIGHTNESS.toda).toBeGreaterThan(WALL_BRIGHTNESS.poca);
    expect(WALL_BRIGHTNESS.poca).toBeGreaterThan(WALL_BRIGHTNESS.nada);
    expect(PATH_MATERIALS.filter(lightReachesWall)).toEqual(['transparente', 'calco']);
    expect(PATH_MATERIALS.filter(makesShadow)).toEqual(['cartulina', 'aluminio']);
  });
  it('los textos existen en los dos idiomas', () => {
    for (const t of [...Object.values(OUTCOME_TEXT), ...Object.values(PATH_NAME)]) expect(t.es.trim() && t.en.trim()).toBeTruthy();
  });
  it('el modelo dice qué NO representa (otros grosores, números)', () => {
    expect(PATH_MODEL.doesNotRepresent.some((t) => /grosores/.test(t.es))).toBe(true);
    expect(PATH_MODEL.doesNotRepresent.some((t) => /números/.test(t.es))).toBe(true);
  });
});

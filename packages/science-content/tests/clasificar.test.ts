import { describe, expect, it } from 'vitest';
import { MATERIAL_OF, SORT_OBJECT_NAME, SORT_PROP_NAME, PROP_VALUES, SORT_MODEL, SORT_OBJECTS, SORT_PROPS, VALUE_TEXT, matching, propertyOf, withValue } from '../src/labs/clasificar.ts';

describe('modelo de clasificación de materiales', () => {
  it('seis objetos, tres propiedades de dos valores cada una', () => {
    expect(SORT_OBJECTS).toHaveLength(6);
    expect(SORT_PROPS).toHaveLength(3);
    for (const p of SORT_PROPS) expect(PROP_VALUES[p]).toHaveLength(2);
  });
  it('cada objeto tiene un valor válido en cada propiedad', () => {
    for (const o of SORT_OBJECTS) for (const p of SORT_PROPS) expect(PROP_VALUES[p]).toContain(propertyOf(o, p));
  });
  it('cada propiedad separa los objetos en dos grupos que no quedan vacíos', () => {
    for (const p of SORT_PROPS) for (const v of PROP_VALUES[p]) expect(withValue(p, v).length, `${p}:${v}`).toBeGreaterThan(0);
    expect(withValue('dureza', 'duro')).toEqual(['cuchara', 'bloque', 'taza']);
    expect(withValue('dureza', 'blando')).toEqual(['esponja', 'pelota', 'tela']);
    expect(withValue('brillo', 'brilla')).toEqual(['cuchara', 'taza']);
  });
  it('el mismo objeto cae en grupos distintos según la propiedad: ninguna propiedad sola describe un material', () => {
    // La pelota es blanda y lisa; la esponja, blanda y rugosa: la textura las separa aunque la dureza no.
    expect(propertyOf('pelota', 'dureza')).toBe(propertyOf('esponja', 'dureza'));
    expect(propertyOf('pelota', 'textura')).not.toBe(propertyOf('esponja', 'textura'));
    // La cuchara y la taza son iguales en las tres propiedades; el material las distingue.
    for (const p of SORT_PROPS) expect(propertyOf('cuchara', p)).toBe(propertyOf('taza', p));
    expect(MATERIAL_OF.cuchara.es).not.toBe(MATERIAL_OF.taza.es);
  });
  it('varias propiedades a la vez dejan menos objetos', () => {
    expect(matching({ dureza: 'duro', brillo: 'brilla' })).toEqual(['cuchara', 'taza']);
    expect(matching({ dureza: 'blando', textura: 'liso' })).toEqual(['pelota']);
    expect(matching({ dureza: 'duro', textura: 'liso', brillo: 'brilla' })).toEqual(['cuchara', 'taza']);
  });
  it('los textos existen en los dos idiomas', () => {
    for (const o of SORT_OBJECTS) for (const t of [MATERIAL_OF[o], SORT_OBJECT_NAME[o]]) expect(t.es.trim() && t.en.trim()).toBeTruthy();
    for (const t of [...Object.values(VALUE_TEXT), ...Object.values(SORT_PROP_NAME)]) expect(t.es.trim() && t.en.trim()).toBeTruthy();
  });
  it('el modelo dice qué NO representa (más propiedades, en el medio, la boca)', () => {
    expect(SORT_MODEL.doesNotRepresent.some((t) => /boca/.test(t.es))).toBe(true);
    expect(SORT_MODEL.doesNotRepresent.some((t) => /en el medio/.test(t.es))).toBe(true);
  });
});

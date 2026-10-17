/**
 * Laboratorio «Detectives de materiales» (C2-U01, 2-PS1-1): seis objetos que se miran con una lupa y se agrupan según una propiedad
 * que se ve o se siente. Es determinista y DIDÁCTICO:
 *
 *   dureza:  duro / blando          textura:  liso / rugoso          brillo:  brilla / mate
 *
 * El mismo objeto cae en grupos distintos según la propiedad que se mire; ninguna propiedad sola describe un material.
 * Nunca se prueba nada con la boca ni se usa algo peligroso: todo son objetos de casa, grandes y seguros.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const SORT_OBJECTS = ['cuchara', 'bloque', 'esponja', 'pelota', 'taza', 'tela'] as const;
export type SortObject = (typeof SORT_OBJECTS)[number];

export const SORT_PROPS = ['dureza', 'textura', 'brillo'] as const;
export type SortProp = (typeof SORT_PROPS)[number];

/** Los dos valores posibles de cada propiedad: el primero y el segundo. */
export const PROP_VALUES: Record<SortProp, readonly [string, string]> = {
  dureza: ['duro', 'blando'],
  textura: ['liso', 'rugoso'],
  brillo: ['brilla', 'mate'],
};

const TABLE: Record<SortObject, Record<SortProp, string>> = {
  cuchara: { dureza: 'duro', textura: 'liso', brillo: 'brilla' },
  bloque: { dureza: 'duro', textura: 'rugoso', brillo: 'mate' },
  esponja: { dureza: 'blando', textura: 'rugoso', brillo: 'mate' },
  pelota: { dureza: 'blando', textura: 'liso', brillo: 'mate' },
  taza: { dureza: 'duro', textura: 'liso', brillo: 'brilla' },
  tela: { dureza: 'blando', textura: 'rugoso', brillo: 'mate' },
};

/** El valor de una propiedad en un objeto. */
export const propertyOf = (o: SortObject, p: SortProp): string => TABLE[o][p];

/** Los objetos que tienen cierto valor de una propiedad. */
export const withValue = (p: SortProp, value: string): SortObject[] => SORT_OBJECTS.filter((o) => TABLE[o][p] === value);

/** Los objetos que cumplen varias propiedades a la vez. */
export const matching = (wanted: Partial<Record<SortProp, string>>): SortObject[] =>
  SORT_OBJECTS.filter((o) => (Object.entries(wanted) as [SortProp, string][]).every(([p, v]) => TABLE[o][p] === v));

export const MATERIAL_OF: Record<SortObject, Localized> = {
  cuchara: { es: 'metal', en: 'metal' },
  bloque: { es: 'madera', en: 'wood' },
  esponja: { es: 'esponja', en: 'sponge' },
  pelota: { es: 'goma', en: 'rubber' },
  taza: { es: 'cerámica', en: 'ceramic' },
  tela: { es: 'tela', en: 'cloth' },
};

export const SORT_OBJECT_NAME: Record<SortObject, Localized> = {
  cuchara: { es: 'cuchara', en: 'spoon' },
  bloque: { es: 'bloque', en: 'block' },
  esponja: { es: 'esponja', en: 'sponge' },
  pelota: { es: 'pelota', en: 'ball' },
  taza: { es: 'taza', en: 'cup' },
  tela: { es: 'tela', en: 'cloth' },
};

export const VALUE_TEXT: Record<string, Localized> = {
  duro: { es: 'duro', en: 'hard' },
  blando: { es: 'blando', en: 'soft' },
  liso: { es: 'liso', en: 'smooth' },
  rugoso: { es: 'rugoso', en: 'rough' },
  brilla: { es: 'brilla', en: 'shiny' },
  mate: { es: 'mate (no brilla)', en: 'dull (not shiny)' },
};

export const SORT_PROP_NAME: Record<SortProp, Localized> = {
  dureza: { es: 'Dureza', en: 'Hardness' },
  textura: { es: 'Textura', en: 'Texture' },
  brillo: { es: 'Brillo', en: 'Shine' },
};

/** Lo que el modelo declara de sí mismo (toda simulación dice qué representa y qué NO). */
export const SORT_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que los objetos se pueden describir y agrupar por propiedades que se ven y se sienten, y que el mismo objeto cae en grupos distintos según la propiedad que se mire.',
    en: 'That objects can be described and grouped by properties you can see and feel, and that the same object falls in different groups depending on which property you look at.',
  },
  assumptions: [
    { es: 'Seis objetos de casa, siempre los mismos, y tres propiedades con dos valores cada una.', en: 'Six household objects, always the same, and three properties with two values each.' },
    { es: 'Cada propiedad es «una cosa o la otra»: duro o blando, liso o rugoso, brilla o es mate.', en: 'Each property is “one or the other”: hard or soft, smooth or rough, shiny or dull.' },
  ],
  doesNotRepresent: [
    { es: 'Todas las propiedades de un material (peso, si flota, si conduce calor…): aquí solo se miran tres.', en: 'All the properties of a material (weight, whether it floats, whether it conducts heat…): only three are looked at here.' },
    { es: 'Casos en el medio: un objeto puede ser «un poco blando». Aquí se elige el valor más claro.', en: 'In-between cases: an object can be “a little soft”. Here the clearest value is chosen.' },
    { es: 'Probar con la boca o con algo peligroso: los objetos se miran, se tocan con cuidado y se agrupan.', en: 'Tasting or anything dangerous: objects are looked at, touched carefully and grouped.' },
  ],
  controls: [
    { es: 'Lo que se cambia: la propiedad por la que se agrupa.', en: 'What changes: the property used to group.' },
    { es: 'Lo que se observa: en qué grupo cae cada objeto.', en: 'What is observed: which group each object falls in.' },
  ],
};

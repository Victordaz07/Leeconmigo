/**
 * Laboratorio «Probador de materiales» (C2-U02): cuatro piezas CUADRADAS E IGUALES de distintos materiales y dos pruebas, una
 * para cada propósito (un techo que no deje pasar el agua; algo que seque un derrame). Es determinista y cualitativo
 * (2-PS1-2 no pide medir): el resultado es «nada / poco / mucho».
 *
 * La prueba es justa porque todo es igual menos el material: tamaño de la pieza, inclinación y cantidad de agua.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const MATERIALS = ['papel', 'tela', 'plastico', 'carton'] as const;
export type Material = (typeof MATERIALS)[number];
export const MATERIAL_TESTS = ['techo', 'secar'] as const;
export type MaterialTest = (typeof MATERIAL_TESTS)[number];
export type Level = 'nada' | 'poco' | 'mucho';

/**
 * Lo que mide cada prueba:
 *  - `techo`: cuánta agua PASA al otro lado de la pieza (queremos poca).
 *  - `secar`: cuánta agua SE QUEDA en la pieza, o sea cuánto se empapa (queremos mucha).
 * Los valores son DIDÁCTICOS (inventados para aprender), no mediciones de materiales reales.
 */
const RESULTS: Record<MaterialTest, Record<Material, Level>> = {
  techo: { plastico: 'nada', carton: 'poco', tela: 'mucho', papel: 'mucho' },
  secar: { plastico: 'nada', carton: 'poco', tela: 'poco', papel: 'mucho' },
};

export const materialResult = (material: Material, test: MaterialTest): Level => RESULTS[test][material];

/** Orden de más a menos adecuado para el propósito de la prueba. */
export function bestFor(test: MaterialTest): Material[] {
  const rank: Record<Level, number> = { nada: 0, poco: 1, mucho: 2 };
  const score = (m: Material) => (test === 'techo' ? rank[RESULTS.techo[m]] : -rank[RESULTS.secar[m]]);
  return [...MATERIALS].sort((a, b) => score(a) - score(b));
}

/** El único material que cumple mejor el propósito (sin empates arriba): la tarea de decisión depende de que sea único. */
export const bestMaterial = (test: MaterialTest): Material => bestFor(test)[0];

/** Palabras para cada nivel, según la prueba (nunca números). */
export const LEVEL_TEXT: Record<MaterialTest, Record<Level, Localized>> = {
  techo: {
    nada: { es: 'No pasó agua', en: 'No water came through' },
    poco: { es: 'Pasó un poco', en: 'A little water came through' },
    mucho: { es: 'Pasó mucha', en: 'A lot of water came through' },
  },
  secar: {
    nada: { es: 'No se empapó', en: 'It didn’t soak up water' },
    poco: { es: 'Se empapó un poco', en: 'It soaked up a little' },
    mucho: { es: 'Se empapó mucho', en: 'It soaked up a lot' },
  },
};

export const MATERIAL_NAME: Record<Material, Localized> = {
  papel: { es: 'papel absorbente', en: 'paper towel' },
  tela: { es: 'tela', en: 'cloth' },
  plastico: { es: 'plástico', en: 'plastic' },
  carton: { es: 'cartón', en: 'cardboard' },
};

/** Lo que el modelo declara de sí mismo (toda simulación dice qué representa y qué NO). */
export const MATERIALS_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que materiales distintos se comportan distinto con el agua y que el mejor depende de para qué lo necesitamos.',
    en: 'That different materials behave differently with water, and the best one depends on what we need it for.',
  },
  assumptions: [
    { es: 'Las cuatro piezas son cuadradas e iguales en tamaño.', en: 'The four pieces are equal squares.' },
    { es: 'La inclinación y la cantidad de agua son las mismas en todas las pruebas.', en: 'The slope and the amount of water are the same in every test.' },
    { es: 'Los resultados son de práctica (inventados para aprender), en tres niveles.', en: 'Results are practice data (made up for learning), in three levels.' },
  ],
  doesNotRepresent: [
    { es: 'El comportamiento de un material real: depende de su grosor, su tejido y cuánto tiempo llueva.', en: 'How a real material behaves: it depends on thickness, weave and how long it rains.' },
    { es: 'Un techo de verdad (viento, goteras, resistencia).', en: 'A real roof (wind, leaks, strength).' },
    { es: 'Cuánta agua es «poca» o «mucha» en gramos o mililitros.', en: 'How much water “a little” or “a lot” is in grams or milliliters.' },
  ],
  controls: [
    { es: 'Material: papel absorbente, tela, plástico o cartón.', en: 'Material: paper towel, cloth, plastic or cardboard.' },
    { es: 'Prueba: techo o secar un derrame.', en: 'Test: roof or drying a spill.' },
  ],
};

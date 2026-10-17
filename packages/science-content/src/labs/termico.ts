/**
 * Laboratorio «Funda aislante» (C6-U04, MS-PS3-3/4/5): un vaso con agua fría (10 °C) en un lugar más cálido y una funda de
 * hasta 3 capas. Mide la temperatura a los 0, 5 y 10 minutos. Es determinista y DIDÁCTICO (inventado para aprender):
 *
 *   temperatura(t) = 10 + redondeo( subidaSinFunda(t) × factor )   factor = producto del factor de cada capa
 *
 * El aislante NO produce frío: hace más LENTA la transferencia de energía hacia el agua (por eso el factor es < 1 y la
 * temperatura sigue subiendo, solo que más despacio). Reproduce los datos del informe: sin funda 10, 14, 17 · funda A (una
 * capa de espuma) 10, 12, 14 · funda B (dos capas de espuma) 10, 11, 12.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const MINUTES = [0, 5, 10] as const;
export const START_TEMP = 10;
/** Cuánto sube la temperatura SIN funda a los 0, 5 y 10 minutos. */
const BASE_RISE = [0, 4, 7] as const;
export const MAX_LAYERS = 3;
/** Criterio del reto de diseño: que a los 10 minutos haya subido como máximo esto. */
export const CRITERION_MAX_RISE = 3;

export const LAYER_IDS = ['espuma', 'fieltro', 'aluminio'] as const;
export type Layer = (typeof LAYER_IDS)[number];
/** Qué tanto frena la transferencia cada capa (más chico = frena más). Valores didácticos. */
export const LAYER_FACTOR: Record<Layer, number> = { espuma: 0.5, fieltro: 0.75, aluminio: 0.9 };

export const LAYER_NAME: Record<Layer, Localized> = {
  espuma: { es: 'espuma', en: 'foam' },
  fieltro: { es: 'fieltro', en: 'felt' },
  aluminio: { es: 'aluminio', en: 'aluminum foil' },
};

/** Redondeo «de escuela»: 3,5 → 4. */
const round = (n: number) => Math.round(n + 1e-9);

export const factorOf = (layers: readonly Layer[]): number => layers.reduce((f, l) => f * LAYER_FACTOR[l], 1);

/** Temperaturas a los 0, 5 y 10 minutos con esas capas (sin capas = el vaso sin funda). */
export const temperatures = (layers: readonly Layer[]): number[] => BASE_RISE.map((r) => START_TEMP + round(r * factorOf(layers)));

/** Cuánto subió a los 10 minutos. */
export const riseAt10 = (layers: readonly Layer[]): number => temperatures(layers)[2] - START_TEMP;

export const meetsCriterion = (layers: readonly Layer[]): boolean => layers.length <= MAX_LAYERS && riseAt10(layers) <= CRITERION_MAX_RISE;

/** «2 capas de espuma» / «espuma + fieltro»: el nombre de un diseño para mostrarlo con palabras. */
export function designLabel(layers: readonly Layer[], lang: 'es' | 'en'): string {
  if (layers.length === 0) return lang === 'es' ? 'Sin funda' : 'No sleeve';
  if (layers.length === 1) return lang === 'es' ? `1 capa de ${LAYER_NAME[layers[0]][lang]}` : `1 layer of ${LAYER_NAME[layers[0]][lang]}`;
  const counts = new Map<Layer, number>();
  for (const l of layers) counts.set(l, (counts.get(l) ?? 0) + 1);
  const parts = [...counts].map(([l, n]) => (n === 1 ? LAYER_NAME[l][lang] : lang === 'es' ? `${n} capas de ${LAYER_NAME[l][lang]}` : `${n} layers of ${LAYER_NAME[l][lang]}`));
  return parts.join(' + ');
}

/** Lo que el modelo declara de sí mismo (toda simulación dice qué representa y qué NO). */
export const THERMAL_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que un aislante hace más lenta la transferencia de energía hacia el agua fría: la temperatura sube igual, pero más despacio.',
    en: 'That an insulator slows the transfer of energy into cold water: the temperature still rises, just more slowly.',
  },
  assumptions: [
    { es: 'Mismo vaso, misma cantidad de agua, misma temperatura inicial (10 °C), mismo ambiente y misma posición del termómetro en todas las pruebas.', en: 'Same cup, same amount of water, same starting temperature (10 °C), same surroundings and same thermometer position in every test.' },
    { es: 'Se mide a los 0, 5 y 10 minutos; hay hasta 3 capas.', en: 'It is measured at 0, 5 and 10 minutes; there are up to 3 layers.' },
    { es: 'Los resultados son de práctica (inventados para aprender).', en: 'The results are practice data (made up for learning).' },
  ],
  doesNotRepresent: [
    { es: 'Materiales reales: espuma, fieltro o aluminio de verdad se comportan distinto según su grosor y cómo se ponen.', en: 'Real materials: real foam, felt or foil behave differently depending on thickness and how they are placed.' },
    { es: 'Más de 10 minutos, otras cantidades de agua u otros ambientes (eso sería otra investigación).', en: 'More than 10 minutes, other amounts of water or other surroundings (that would be a different investigation).' },
    { es: 'Cómo se mueven las partículas por dentro: la temperatura es solo la lectura del termómetro.', en: 'How particles move inside: temperature is just the thermometer reading.' },
  ],
  controls: [
    { es: 'Lo que se cambia: las capas de la funda (hasta 3).', en: 'What changes: the sleeve layers (up to 3).' },
    { es: 'Lo que se mide: la temperatura a los 0, 5 y 10 minutos.', en: 'What is measured: temperature at 0, 5 and 10 minutes.' },
  ],
};

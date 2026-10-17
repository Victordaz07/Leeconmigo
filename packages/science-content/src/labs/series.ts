/**
 * Series de datos del clima (C6-U07, MS-ESS3-5): cuatro series de práctica de 1900 a 2020 (cada 20 años) para comparar y preguntar por factores y
 * mecanismos: la temperatura media, el CO2 del aire, el brillo del Sol y las erupciones volcánicas.
 *
 * TODO es dato DIDÁCTICO (inventado para aprender) con la FORMA de los registros reales: nunca se atribuye a NASA, NOAA ni a ninguna institución, y la
 * pantalla lo dice. La conclusión que la unidad enseña (las actividades humanas son la causa principal del calentamiento actual) sí es la que
 * respaldan los registros reales; aquí se practica cómo se razona con datos y mecanismos.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const YEARS = [1900, 1920, 1940, 1960, 1980, 2000, 2020] as const;
export const SERIES_IDS = ['temp', 'co2', 'sol', 'volcanes'] as const;
export type SeriesId = (typeof SERIES_IDS)[number];

export const SERIES_VALUES: Record<SeriesId, readonly number[]> = {
  /** Diferencia de la temperatura media con el promedio de referencia (°C). */
  temp: [-0.3, -0.3, 0, 0, 0.25, 0.6, 1.2],
  /** Dióxido de carbono en el aire (partes por millón). */
  co2: [296, 303, 310, 317, 339, 369, 413],
  /** Brillo del Sol (índice: 100 es el brillo medio). */
  sol: [100, 100.1, 99.9, 100, 100.1, 100, 99.9],
  /** Erupciones volcánicas grandes en ese año (cuenta de práctica). */
  volcanes: [3, 2, 1, 3, 2, 2, 1],
};

/** Eje de cada serie en su propia gráfica: mínimo, máximo y cada cuánto va una rayita. */
export const SERIES_AXIS: Record<SeriesId, { min: number; max: number; tick: number }> = {
  temp: { min: -1, max: 2, tick: 1 },
  co2: { min: 280, max: 420, tick: 40 },
  sol: { min: 98, max: 102, tick: 1 },
  volcanes: { min: 0, max: 4, tick: 1 },
};

export const SERIES_NAME: Record<SeriesId, Localized> = {
  temp: { es: 'Temperatura media', en: 'Average temperature' },
  co2: { es: 'CO2 en el aire', en: 'CO2 in the air' },
  sol: { es: 'Brillo del Sol', en: 'Brightness of the Sun' },
  volcanes: { es: 'Erupciones volcánicas', en: 'Volcanic eruptions' },
};

export const SERIES_UNIT: Record<SeriesId, Localized> = {
  temp: { es: '°C respecto del promedio de referencia', en: '°C compared with the reference average' },
  co2: { es: 'partes por millón (ppm)', en: 'parts per million (ppm)' },
  sol: { es: 'índice (100 = brillo medio)', en: 'index (100 = average brightness)' },
  volcanes: { es: 'erupciones grandes en ese año', en: 'large eruptions that year' },
};

export type Trend = 'sube' | 'plano' | 'irregular';

/** Cómo cambia una serie de 1900 a 2020: sube de forma sostenida, casi no cambia o sube y baja sin una tendencia. */
export function trendOf(values: readonly number[]): Trend {
  const rise = values[values.length - 1] - values[0];
  const path = values.slice(1).reduce((sum, v, i) => sum + Math.abs(v - values[i]), 0);
  const spread = Math.max(...values) - Math.min(...values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (rise > 0 && rise / path >= 0.8) return 'sube';
  if (spread / Math.abs(mean) < 0.02) return 'plano';
  return 'irregular';
}

export const trendOfSeries = (id: SeriesId): Trend => trendOf(SERIES_VALUES[id]);

/** Correlación de Pearson entre dos series (−1 a 1): qué tanto suben y bajan juntas. */
export function correlation(a: readonly number[], b: readonly number[]): number {
  const n = a.length;
  const ma = a.reduce((x, y) => x + y, 0) / n;
  const mb = b.reduce((x, y) => x + y, 0) / n;
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return num / Math.sqrt(da * db);
}

export const TREND_TEXT: Record<Trend, Localized> = {
  sube: { es: 'sube', en: 'rises' },
  plano: { es: 'casi no cambia', en: 'hardly changes' },
  irregular: { es: 'sube y baja sin una tendencia', en: 'goes up and down with no trend' },
};

/** La cadena del mecanismo: de la luz del Sol al calor atrapado, en cinco pasos. */
export const MECHANISM: Localized[] = [
  { es: 'La luz del Sol calienta la Tierra.', en: 'Sunlight warms the Earth.' },
  { es: 'La Tierra devuelve parte de ese calor hacia el espacio.', en: 'The Earth sends part of that heat back out to space.' },
  { es: 'Los gases de efecto invernadero, como el CO2, atrapan parte de ese calor.', en: 'Greenhouse gases, like CO2, trap part of that heat.' },
  { es: 'Quemar carbón, petróleo y gas agrega más CO2 al aire.', en: 'Burning coal, oil and gas adds more CO2 to the air.' },
  { es: 'Con más CO2 se atrapa más calor y la Tierra se calienta.', en: 'With more CO2 more heat is trapped and the Earth warms.' },
];

export const SERIES_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Cuatro series de práctica de 1900 a 2020 con la forma de los registros reales, y la cadena que explica por qué más CO2 atrapa más calor.',
    en: 'Four practice series from 1900 to 2020 shaped like real records, and the chain that explains why more CO2 traps more heat.',
  },
  assumptions: [
    { es: 'Los números son de práctica (inventados para aprender), no son registros de ninguna institución.', en: 'The numbers are practice data (made up for learning), not records from any institution.' },
    { es: 'Cada punto es un promedio de toda la Tierra cada 20 años, no el tiempo de un día ni de una ciudad.', en: 'Each point is an average for the whole Earth every 20 years, not the weather of a day or a city.' },
  ],
  doesNotRepresent: [
    { es: 'Otros factores y gases (como el metano) ni el papel de los océanos y de la lluvia.', en: 'Other factors and gases (like methane) or the role of oceans and rain.' },
    { es: 'Cuánto calor atrapa cada gas ni cuántos grados subirá la temperatura en el futuro.', en: 'How much heat each gas traps or how many degrees the temperature will rise in the future.' },
    { es: 'Datos reales: los registros reales vienen de muchos laboratorios y se comparan entre sí.', en: 'Real data: real records come from many laboratories and are compared with each other.' },
  ],
  controls: [
    { es: 'Lo que se elige: qué series se comparan.', en: 'What is chosen: which series are compared.' },
    { es: 'Lo que se observa: si cada serie sube, casi no cambia o sube y baja sin tendencia.', en: 'What is observed: whether each series rises, hardly changes or goes up and down with no trend.' },
  ],
};

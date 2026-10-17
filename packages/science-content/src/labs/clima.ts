/**
 * Mesa de datos del tiempo y el clima (C3-U07, 3-ESS2-1 y 3-ESS2-2): el REGISTRO de tres pueblos inventados, estación por estación.
 * El tiempo es lo que pasa un día; el clima es lo típico que se repite en cada estación, año tras año (lo que dicen las tablas y las barras).
 *
 * TODO es un dato didáctico (inventado para aprender): ningún pueblo ni número es real.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const TOWNS = ['azul', 'seco', 'alto'] as const;
export type Town = (typeof TOWNS)[number];
export const SEASONS = ['invierno', 'primavera', 'verano', 'otono'] as const;
export type Season = (typeof SEASONS)[number];
export const MEASURES = ['lluvia', 'temp'] as const;
export type Measure = (typeof MEASURES)[number];

/** Tope del eje de las barras de lluvia (días en un mes típico de la estación) y cada cuánto va una rayita. */
export const MAX_RAIN_DAYS = 15;
export const RAIN_TICK = 5;

export const TOWN_NAME: Record<Town, Localized> = {
  azul: { es: 'Pueblo Azul', en: 'Blue Town' },
  seco: { es: 'Pueblo Seco', en: 'Dry Town' },
  alto: { es: 'Pueblo Alto', en: 'High Town' },
};
export const SEASON_NAME: Record<Season, Localized> = {
  invierno: { es: 'Invierno', en: 'Winter' },
  primavera: { es: 'Primavera', en: 'Spring' },
  verano: { es: 'Verano', en: 'Summer' },
  otono: { es: 'Otoño', en: 'Fall' },
};
export const MEASURE_NAME: Record<Measure, Localized> = {
  lluvia: { es: 'Días con lluvia', en: 'Rainy days' },
  temp: { es: 'Temperatura de la tarde', en: 'Afternoon temperature' },
};

/** Días con lluvia en un mes típico de cada estación (registro de muchos años). */
export const RAIN_DAYS: Record<Town, Record<Season, number>> = {
  azul: { invierno: 12, primavera: 8, verano: 1, otono: 6 },
  seco: { invierno: 3, primavera: 1, verano: 0, otono: 2 },
  alto: { invierno: 10, primavera: 9, verano: 5, otono: 7 },
};
/** Temperatura típica de la tarde en cada estación, en grados Celsius. */
export const AFTERNOON_C: Record<Town, Record<Season, number>> = {
  azul: { invierno: 14, primavera: 18, verano: 26, otono: 20 },
  seco: { invierno: 22, primavera: 32, verano: 41, otono: 30 },
  alto: { invierno: 0, primavera: 8, verano: 19, otono: 9 },
};

export const valueOf = (town: Town, season: Season, measure: Measure): number => (measure === 'lluvia' ? RAIN_DAYS[town][season] : AFTERNOON_C[town][season]);

const byValue = (town: Town, measure: Measure, pick: 'max' | 'min'): Season => {
  const vals = SEASONS.map((s) => [s, valueOf(town, s, measure)] as const);
  return vals.reduce((best, cur) => (pick === 'max' ? (cur[1] > best[1] ? cur : best) : cur[1] < best[1] ? cur : best))[0];
};
/** La estación con más (o menos) lluvia o calor de un pueblo. */
export const peakSeason = (town: Town, measure: Measure, pick: 'max' | 'min' = 'max'): Season => byValue(town, measure, pick);

/** El pueblo con más (o menos) lluvia o calor en una estación. */
export function peakTown(season: Season, measure: Measure, pick: 'max' | 'min' = 'max'): Town {
  const vals = TOWNS.map((t) => [t, valueOf(t, season, measure)] as const);
  return vals.reduce((best, cur) => (pick === 'max' ? (cur[1] > best[1] ? cur : best) : cur[1] < best[1] ? cur : best))[0];
}

/** ¿Un pueblo tiene menos lluvia que los otros dos en TODAS las estaciones? */
export const alwaysDrier = (town: Town): boolean => SEASONS.every((s) => peakTown(s, 'lluvia', 'min') === town);

/** Las estaciones en que las barras del niño no coinciden con el registro (vacías no cuentan: todavía no las dibujó). */
export function barsOff(town: Town, bars: Partial<Record<Season, number | null>>): Season[] {
  return SEASONS.filter((s) => bars[s] !== undefined && bars[s] !== null && bars[s] !== RAIN_DAYS[town][s]);
}
export const barsComplete = (bars: Partial<Record<Season, number | null>>): boolean => SEASONS.every((s) => bars[s] !== undefined && bars[s] !== null);

/** Cómo describe el clima cada pueblo, en palabras (lo que se puede concluir del registro). */
export const CLIMATE_WORD: Record<Town, Localized> = {
  azul: { es: 'templado, con mucha lluvia en invierno y casi nada en verano', en: 'mild, with a lot of rain in winter and almost none in summer' },
  seco: { es: 'caluroso y con muy poca lluvia', en: 'hot, with very little rain' },
  alto: { es: 'frío en invierno y con lluvia o nieve casi todo el año', en: 'cold in winter, with rain or snow almost all year' },
};

export const CLIMATE_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Lo típico del tiempo en cada estación de tres pueblos, tal como lo dirían registros de muchos años; sirve para describir el clima y compararlo.',
    en: 'What the weather is typically like in each season of three towns, as records of many years would say; it helps describe the climate and compare it.',
  },
  assumptions: [
    { es: 'Los números son de práctica (inventados para aprender): ningún pueblo ni registro es real.', en: 'The numbers are practice data (made up for learning): no town or record is real.' },
    { es: 'Cada número es lo típico de un mes de esa estación, no el de un día.', en: 'Each number is what is typical for a month of that season, not for a day.' },
  ],
  doesNotRepresent: [
    { es: 'Qué tiempo hará un día en particular (mañana o el martes).', en: 'What the weather will be like on a particular day (tomorrow or on Tuesday).' },
    { es: 'Por qué cada lugar tiene su clima (océanos, montañas, latitud…): no hace falta para esta unidad.', en: 'Why each place has its climate (oceans, mountains, latitude…): not needed for this unit.' },
    { es: 'Cómo cambia el clima a lo largo de muchos años.', en: 'How the climate changes over many years.' },
  ],
  controls: [
    { es: 'Lo que se elige: el pueblo y la estación que se mira.', en: 'What is chosen: the town and the season that is looked at.' },
    { es: 'Lo que se observa: los días con lluvia y la temperatura típica.', en: 'What is observed: the rainy days and the typical temperature.' },
  ],
};

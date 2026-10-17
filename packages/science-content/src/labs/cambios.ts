/**
 * Cambios de la Tierra (C2-U08, 2-ESS1-1): seis sucesos, cada uno con DOS pistas de fuentes distintas (una foto, un dibujo, lo que se ve hoy…)
 * y la rapidez con que cambia la Tierra: rápido (minutos, horas o un día) o lento (muchos años). Aquí no hay imágenes ni pantallas.
 *
 * Los sucesos son ejemplos didácticos: sirven para decidir con evidencia, no son datos de un lugar real.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const EARTH_EVENTS = ['volcan', 'deslizamiento', 'crecida', 'canon', 'duna', 'montana'] as const;
export type EarthEvent = (typeof EARTH_EVENTS)[number];
export type Speed = 'rapido' | 'lento';
export const SPEEDS: readonly Speed[] = ['rapido', 'lento'];

export const EVENT_SPEED: Record<EarthEvent, Speed> = {
  volcan: 'rapido',
  deslizamiento: 'rapido',
  crecida: 'rapido',
  canon: 'lento',
  duna: 'lento',
  montana: 'lento',
};

export const EVENT_NAME: Record<EarthEvent, Localized> = {
  volcan: { es: 'Un volcán hace erupción', en: 'A volcano erupts' },
  deslizamiento: { es: 'La tierra se desliza por una ladera', en: 'Soil slides down a hillside' },
  crecida: { es: 'Un arroyo arrastra tierra en una tormenta', en: 'A stream carries soil in a storm' },
  canon: { es: 'Un río talla un cañón', en: 'A river carves a canyon' },
  duna: { es: 'El viento mueve una duna', en: 'Wind moves a dune' },
  montana: { es: 'Una montaña se va gastando', en: 'A mountain wears away' },
};

export const SPEED_NAME: Record<Speed, Localized> = {
  rapido: { es: 'Rápido', en: 'Fast' },
  lento: { es: 'Lento', en: 'Slow' },
};

/** Lo que dice cada fuente: dos pistas por suceso, de fuentes distintas (se necesita más de una para estar seguro). */
export const EVENT_CLUES: Record<EarthEvent, [Localized, Localized]> = {
  volcan: [
    { es: 'Foto de la mañana: el volcán está tranquilo. Foto de la tarde: sale lava.', en: 'Morning photo: the volcano is quiet. Afternoon photo: lava is coming out.' },
    { es: 'Un video corto muestra la erupción empezar en pocos minutos.', en: 'A short video shows the eruption starting within a few minutes.' },
  ],
  deslizamiento: [
    { es: 'Ayer la ladera estaba firme. Hoy hay tierra en el camino.', en: 'Yesterday the hillside was firm. Today there is soil on the road.' },
    { es: 'La lluvia fuerte cayó en una sola noche.', en: 'The heavy rain fell in a single night.' },
  ],
  crecida: [
    { es: 'Por la mañana el agua del arroyo estaba clara. Por la tarde, turbia.', en: 'In the morning the stream water was clear. In the afternoon, muddy.' },
    { es: 'La tormenta duró unas pocas horas.', en: 'The storm lasted a few hours.' },
  ],
  canon: [
    { es: 'Fotos de hace 50 años y de hoy: el cañón se ve casi igual.', en: 'Photos from 50 years ago and today: the canyon looks almost the same.' },
    { es: 'El río, chiquito, se lleva solo un poquito de roca cada año.', en: 'The little river carries away only a tiny bit of rock each year.' },
  ],
  duna: [
    { es: 'Fotos de cada año: la duna está solo un poco más allá.', en: 'Photos from each year: the dune is only a little farther along.' },
    { es: 'El viento mueve unos granitos de arena cada día.', en: 'The wind moves a few grains of sand each day.' },
  ],
  montana: [
    { es: 'Las montañas muy viejas son más bajas y redondas que las nuevas.', en: 'Very old mountains are lower and rounder than new ones.' },
    { es: 'La lluvia y el viento se llevan un poquito de roca, año tras año.', en: 'Rain and wind carry away a little rock, year after year.' },
  ],
};

export const speedOf = (e: EarthEvent): Speed => EVENT_SPEED[e];

export const EARTH_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Seis ejemplos de cambios de la Tierra y las pistas de dos fuentes de cada uno, para decidir si el cambio es rápido (minutos, horas o un día) o lento (muchos años).',
    en: 'Six examples of Earth changes and clues from two sources for each, to decide whether the change is fast (minutes, hours or a day) or slow (many years).',
  },
  assumptions: [
    { es: 'Cada ejemplo cuenta lo que pasa casi siempre; hay excepciones.', en: 'Each example tells what happens almost always; there are exceptions.' },
    { es: 'Los datos son de práctica (inventados para aprender), no de un lugar real.', en: 'The data are practice data (made up for learning), not from a real place.' },
  ],
  doesNotRepresent: [
    { es: 'Cuántos años exactos tarda cada cambio.', en: 'Exactly how many years each change takes.' },
    { es: 'Por qué pasa cada cambio por dentro (placas, magma…): no hace falta para esta unidad.', en: 'Why each change happens inside (plates, magma…): not needed for this unit.' },
  ],
  controls: [
    { es: 'Lo que se hace: mirar las dos pistas de cada ejemplo y decidir rápido o lento.', en: 'What is done: look at the two clues of each example and decide fast or slow.' },
  ],
};

/**
 * Laboratorio «Modelo de puntitos» (C5-U01, 5-PS1-1): la materia se imagina hecha de partículas tan pequeñas que no se ven, dibujadas como
 * puntitos. Es un MODELO, no una fotografía: no se pide ningún mecanismo atómico formal. Tres fenómenos, todos deterministas y didácticos:
 *
 *   colorante en agua  → los puntitos azules se mueven entre los del agua hasta repartirse por todo el vaso (pasos 0–4);
 *   aire en la jeringa → al apretar el émbolo los puntitos se acercan (hay espacio entre ellos), hasta un tope;
 *   sal en agua        → los puntitos de sal se reparten entre los del agua (como el colorante).
 *
 * Los puntitos siempre son los MISMOS (ninguno se pierde ni se crea): lo único que cambia es dónde están.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const DYE_STEPS = [0, 1, 2, 3, 4] as const;
export type DyeStep = (typeof DYE_STEPS)[number];
/** Cuánto se ha repartido el colorante en cada paso (0 = una gota junta, 1 = parejo por todo el vaso). */
export const DYE_SPREAD: Record<DyeStep, number> = { 0: 0, 1: 0.25, 2: 0.5, 3: 0.8, 4: 1 };

export const SYRINGE_POSITIONS = [3, 2, 1] as const;
export type SyringePos = (typeof SYRINGE_POSITIONS)[number];
/** Qué tan separados están los puntitos del aire con el émbolo en cada posición (3 = suelto, 1 = apretado hasta el tope). */
export const SYRINGE_GAP: Record<SyringePos, number> = { 3: 1, 2: 0.7, 1: 0.45 };

export const DYE_COUNT = 18;
export const WATER_COUNT = 54;
export const AIR_COUNT = 24;

export interface Dot {
  x: number;
  y: number;
}

/** Números «al azar» pero siempre iguales (semilla fija): el mismo modelo en todas las pantallas y pruebas. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Puntitos del agua: repartidos parejo por todo el vaso (siempre los mismos). */
export function waterDots(): Dot[] {
  const r = rng(11);
  return Array.from({ length: WATER_COUNT }, () => ({ x: 0.06 + r() * 0.88, y: 0.06 + r() * 0.88 }));
}

/** Puntitos del colorante o de la sal en el paso `step`: juntos arriba al principio y repartidos por todo el vaso al final. */
export function soluteDots(step: DyeStep): Dot[] {
  const start = rng(23);
  const end = rng(37);
  const s = DYE_SPREAD[step];
  return Array.from({ length: DYE_COUNT }, () => {
    const from = { x: 0.42 + start() * 0.16, y: 0.08 + start() * 0.12 };
    const to = { x: 0.06 + end() * 0.88, y: 0.06 + end() * 0.88 };
    return { x: lerp(from.x, to.x, s), y: lerp(from.y, to.y, s) };
  });
}

/** Puntitos del aire en la jeringa con el émbolo en `pos`: la misma cantidad, más juntos cuanto más se aprieta. */
export function airDots(pos: SyringePos): Dot[] {
  const r = rng(51);
  const gap = SYRINGE_GAP[pos];
  return Array.from({ length: AIR_COUNT }, () => ({ x: 0.06 + r() * 0.88 * gap, y: 0.06 + r() * 0.88 }));
}

const dist = (a: Dot, b: Dot) => Math.hypot(a.x - b.x, a.y - b.y);

/** Distancia media entre cada puntito y su vecino más cercano. */
export function meanNearest(dots: readonly Dot[]): number {
  let sum = 0;
  for (const d of dots) {
    let best = Infinity;
    for (const o of dots) if (o !== d) best = Math.min(best, dist(d, o));
    sum += best;
  }
  return sum / dots.length;
}

/** Distancia media entre todas las parejas de puntitos (qué tan repartidos están). */
export function meanPairDistance(dots: readonly Dot[]): number {
  let sum = 0;
  let n = 0;
  for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) {
    sum += dist(dots[i], dots[j]);
    n++;
  }
  return sum / n;
}

export const FACT_TEXT = {
  dye: { es: 'El colorante se reparte por todo el vaso aunque nadie lo revuelva.', en: 'The dye spreads through the whole glass even if nobody stirs it.' },
  syringe: { es: 'El aire de una jeringa tapada se puede apretar un poco.', en: 'The air in a capped syringe can be squeezed a little.' },
  salt: { es: 'La sal disuelta ya no se ve, pero sigue ahí.', en: 'Dissolved salt can’t be seen anymore, but it is still there.' },
} satisfies Record<string, Localized>;

export const PHENOMENA = ['dye', 'syringe', 'salt'] as const;
export type Phenomenon = (typeof PHENOMENA)[number];

export const PHENOMENON_NAME: Record<Phenomenon, Localized> = {
  dye: { es: 'Colorante en agua', en: 'Dye in water' },
  syringe: { es: 'Aire en la jeringa', en: 'Air in the syringe' },
  salt: { es: 'Sal en agua', en: 'Salt in water' },
};

/** Lo que hacen los puntitos en cada fenómeno (la columna «con puntitos» de la tabla). */
export const DOTS_TEXT: Record<Phenomenon, Localized> = {
  dye: { es: 'Los puntitos azules se mueven entre los del agua y se reparten por todo el vaso.', en: 'The blue dots move among the water’s dots and spread through the whole glass.' },
  syringe: { es: 'Los puntitos del aire se acercan: había espacio entre ellos.', en: 'The air’s dots move closer: there was space between them.' },
  salt: { es: 'Los puntitos de sal se reparten entre los del agua: siguen ahí, aunque no se vean.', en: 'The salt’s dots spread among the water’s dots: they are still there, even if they can’t be seen.' },
};

export const PARTICLE_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que la materia está hecha de partículas tan pequeñas que no se ven, que se mueven y que tienen espacio entre ellas; por eso lo invisible sigue ahí.',
    en: 'That matter is made of particles too small to be seen, that move and that have space between them; that is why what is invisible is still there.',
  },
  assumptions: [
    { es: 'Cada puntito es una partícula; siempre hay los mismos: ninguno aparece ni desaparece.', en: 'Each dot is a particle; there are always the same ones: none appears or disappears.' },
    { es: 'El colorante y la sal se imaginan como puntitos de otro color entre los puntitos del agua.', en: 'Dye and salt are imagined as dots of another color among the water’s dots.' },
  ],
  doesNotRepresent: [
    { es: 'Cómo son de verdad las partículas por dentro ni cómo se unen (átomos y moléculas): no hace falta para esta unidad.', en: 'What the particles are really like inside or how they join (atoms and molecules): not needed for this unit.' },
    { es: 'El tamaño real de las partículas ni cuántas hay: los puntitos son un dibujo, no una fotografía.', en: 'The real size of particles or how many there are: the dots are a drawing, not a photograph.' },
    { es: 'Todos los materiales: aquí solo se miran un líquido con colorante, el aire y una sal disuelta.', en: 'All materials: only a liquid with dye, air and dissolved salt are looked at here.' },
  ],
  controls: [
    { es: 'Lo que se cambia: el tiempo (colorante y sal) o cuánto se aprieta el émbolo (aire).', en: 'What changes: the time (dye and salt) or how much the plunger is pressed (air).' },
    { es: 'Lo que se observa: dónde están los puntitos y qué tan juntos o separados quedan.', en: 'What is observed: where the dots are and how close together or apart they end up.' },
  ],
};

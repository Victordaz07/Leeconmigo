/**
 * Laboratorio «Materia en sistemas» (C5-U02, 5-PS1-2 y 5-PS1-3). Dos partes, las dos deterministas y DIDÁCTICAS (inventadas para aprender):
 *
 * 1) Cantidad (masa): un frasco cerrado con agua en una balanza. Se pesa el frasco con agua, se pesa la sustancia aparte, se
 *    echa y se cierra, y se vuelve a pesar. En un frasco CERRADO nada entra ni sale, así que:
 *
 *        masa después = masa del frasco con agua + masa de la sustancia      (siempre; disolver o derretir no la cambia)
 *
 *    La sustancia puede dejar de verse y la masa total sigue igual. No se usa densidad ni volumen (no hay rayas en el frasco).
 *
 * 2) Propiedades: cuatro muestras de polvo en platitos (sal, azúcar, arena, harina) y una muestra misteriosa (X, es azúcar).
 *    Se compara cómo se ven (color, granitos con lupa) y qué pasa en agua. Una sola propiedad (el color) no basta para
 *    identificar una muestra; se combinan varias. NUNCA se prueba una muestra con la boca.
 */
import type { Localized } from '@lee-conmigo/contracts';

// ------------------------------------------------------------------ cantidad (masa)

/** Frasco cerrado con agua, vacío de otra cosa: lo que marca la balanza (en gramos). */
export const JAR_WITH_WATER_G = 220;

export const SUBSTANCES = ['sal', 'azucar', 'hielo'] as const;
export type Substance = (typeof SUBSTANCES)[number];
/** Las sustancias que el niño echa en el frasco en el laboratorio (el hielo solo aparece en la transferencia). */
export const LAB_SUBSTANCES: readonly Substance[] = ['sal', 'azucar'];

/** Masa de la sustancia pesada aparte (g). */
export const SUBSTANCE_G: Record<Substance, number> = { sal: 10, azucar: 15, hielo: 20 };

export const SUBSTANCE_NAME: Record<Substance, Localized> = {
  sal: { es: 'sal', en: 'salt' },
  azucar: { es: 'azúcar', en: 'sugar' },
  hielo: { es: 'hielo', en: 'ice' },
};

/** Lo que cambia la sustancia dentro del frasco: la sal y el azúcar se disuelven, el hielo se derrite. */
export const SUBSTANCE_CHANGE: Record<Substance, 'disuelve' | 'derrite'> = { sal: 'disuelve', azucar: 'disuelve', hielo: 'derrite' };

/** Las acciones de la pesada, en orden: 0 nada · 1 frasco · 2 sustancia aparte · 3 echada y frasco cerrado · 4 ya disuelta. */
export const WEIGH_STEPS = ['frasco', 'sustancia', 'echar', 'esperar'] as const;
export type WeighStep = (typeof WEIGH_STEPS)[number];

/** Lo que marca la balanza después de `done` acciones (0 = sin nada en el plato). */
export function scaleReading(substance: Substance, done: number): number {
  if (done <= 0) return 0;
  if (done === 1) return JAR_WITH_WATER_G;
  if (done === 2) return SUBSTANCE_G[substance];
  return JAR_WITH_WATER_G + SUBSTANCE_G[substance];
}

/** Masa total ANTES de mezclar: el frasco con agua más la sustancia (lo que el niño suma). */
export const totalBefore = (substance: Substance): number => JAR_WITH_WATER_G + SUBSTANCE_G[substance];
/** Masa total DESPUÉS, con el frasco cerrado: es la misma. */
export const totalAfter = (substance: Substance): number => scaleReading(substance, 4);

/** ¿Se ven todavía los cristales o el cubo? Solo justo después de echar (acción 3). */
export const stillVisible = (done: number): boolean => done === 3;

// ------------------------------------------------------------------ propiedades de las muestras

export const SAMPLES = ['sal', 'azucar', 'arena', 'harina', 'X'] as const;
export type Sample = (typeof SAMPLES)[number];
/** Lo que es de verdad la muestra misteriosa (el niño lo descubre con las pruebas). */
export const MYSTERY_IS: Sample = 'azucar';
export const KNOWN_SAMPLES: readonly Sample[] = ['sal', 'azucar', 'arena', 'harina'];

export const PROPS = ['color', 'granitos', 'agua'] as const;
export type Prop = (typeof PROPS)[number];

export const SAMPLE_NAME: Record<Sample, Localized> = {
  sal: { es: 'sal', en: 'salt' },
  azucar: { es: 'azúcar', en: 'sugar' },
  arena: { es: 'arena', en: 'sand' },
  harina: { es: 'harina', en: 'flour' },
  X: { es: 'muestra X', en: 'sample X' },
};

export const PROP_NAME: Record<Prop, Localized> = {
  color: { es: 'Color', en: 'Color' },
  granitos: { es: 'Con la lupa', en: 'With a lens' },
  agua: { es: 'En agua', en: 'In water' },
};

/** Lo que se observa de cada muestra con cada prueba (palabras, no números). */
const OBSERVED: Record<Exclude<Sample, 'X'>, Record<Prop, Localized>> = {
  sal: {
    color: { es: 'Blanca', en: 'White' },
    granitos: { es: 'Cubitos de buen tamaño', en: 'Little cubes, fairly big' },
    agua: { es: 'Se disuelve', en: 'Dissolves' },
  },
  azucar: {
    color: { es: 'Blanca', en: 'White' },
    granitos: { es: 'Granitos finos que brillan', en: 'Fine grains that sparkle' },
    agua: { es: 'Se disuelve', en: 'Dissolves' },
  },
  arena: {
    color: { es: 'Beige', en: 'Beige' },
    granitos: { es: 'Granitos desparejos', en: 'Uneven grains' },
    agua: { es: 'No se disuelve', en: 'Doesn’t dissolve' },
  },
  harina: {
    color: { es: 'Blanca', en: 'White' },
    granitos: { es: 'Polvo sin granitos', en: 'Powder, no grains' },
    agua: { es: 'No se disuelve', en: 'Doesn’t dissolve' },
  },
};

/** El resultado de una prueba en una muestra (la X da lo de la muestra que de verdad es). */
export const observed = (sample: Sample, prop: Prop): Localized => OBSERVED[sample === 'X' ? MYSTERY_IS : sample][prop];

/** ¿Se disuelve en agua? */
export const dissolves = (sample: Sample): boolean => (sample === 'X' ? MYSTERY_IS : sample) === 'sal' || (sample === 'X' ? MYSTERY_IS : sample) === 'azucar';

/** Muestras que NO se pueden distinguir de la X con esta prueba sola (dicen lo mismo que la X). */
export const confusableWith = (sample: Sample, prop: Prop): Sample[] =>
  KNOWN_SAMPLES.filter((s) => observed(s, prop).es === observed(sample, prop).es);

/** Las muestras que quedan posibles después de hacer estas pruebas a la muestra X. */
export function remainingAfter(tests: readonly Prop[]): Sample[] {
  return KNOWN_SAMPLES.filter((s) => tests.every((p) => observed(s, p).es === observed('X', p).es));
}

/** Lo que el modelo declara de sí mismo (toda simulación dice qué representa y qué NO). */
export const MATTER_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que en un frasco cerrado la masa total no cambia aunque la sustancia se disuelva o se derrita, y que un material se identifica con varias propiedades, no con una sola.',
    en: 'That in a closed jar the total mass doesn’t change even if the substance dissolves or melts, and that a material is identified by several properties, not just one.',
  },
  assumptions: [
    { es: 'El frasco siempre está cerrado y es el mismo; la misma balanza, el mismo frasco y la misma cantidad de agua en todas las pruebas.', en: 'The jar is always closed and always the same one; same scale, same jar and same amount of water in every test.' },
    { es: 'Las masas son de práctica (inventadas para aprender), en gramos enteros.', en: 'The masses are practice values (made up for learning), in whole grams.' },
    { es: 'Cuatro muestras conocidas y una misteriosa; las propiedades que se miran son el color, los granitos con la lupa y qué pasa en agua.', en: 'Four known samples and one mystery sample; the properties looked at are color, grains with a lens and what happens in water.' },
  ],
  doesNotRepresent: [
    { es: 'Qué pasa con un frasco abierto: allí algo podría escaparse (como el vapor del agua) y la balanza marcaría menos.', en: 'What happens with an open jar: something could escape (like water vapor) and the scale would show less.' },
    { es: 'Reacciones que forman sustancias nuevas, ni cómo son las partículas por dentro.', en: 'Reactions that make new substances, or what the particles look like inside.' },
    { es: 'Todos los materiales: solo se comparan cuatro polvos, y nunca se prueban con la boca.', en: 'All materials: only four powders are compared, and they are never tasted.' },
  ],
  controls: [
    { es: 'Lo que se cambia: la sustancia que se echa al frasco, o la muestra que se prueba.', en: 'What changes: the substance put in the jar, or the sample being tested.' },
    { es: 'Lo que se mide: la masa total en la balanza (g); lo que se observa: color, granitos y qué pasa en agua.', en: 'What is measured: total mass on the scale (g); what is observed: color, grains and what happens in water.' },
  ],
};

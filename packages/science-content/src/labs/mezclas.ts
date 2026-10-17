/**
 * Laboratorio «Mezclas» (C5-U03, 5-PS1-4): cinco mezclas en vasitos ABIERTOS y con poca cantidad. Para cada una el niño hace dos pruebas:
 *
 *   ¿hay burbujas?   (una señal que se ve)
 *   ¿se puede recuperar lo de antes?   (evaporando o separando con un colador)
 *
 * REGLA DEL MODELO (didáctica): «apareció una sustancia nueva» ⇔ hubo una señal (burbujas de gas) Y lo de antes ya no se puede recuperar.
 * Una sola prueba no decide: disolver algo hace que ya no se vea, y eso NO es una sustancia nueva (la sal vuelve al evaporar).
 * Todo es determinista y DIDÁCTICO; nunca se prueba nada con la boca ni se cierra un recipiente con la reacción.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const MIXES = ['sal_agua', 'azucar_agua', 'arena_agua', 'harina_agua', 'bicarbonato_vinagre'] as const;
export type Mix = (typeof MIXES)[number];

export const MIX_TESTS = ['burbujas', 'recuperar'] as const;
export type MixTest = (typeof MIX_TESTS)[number];

/** Los materiales que se mezclan (para dibujar sus platitos). */
export const MIX_INGREDIENTS: Record<Mix, [string, string]> = {
  sal_agua: ['sal', 'agua'],
  azucar_agua: ['azucar', 'agua'],
  arena_agua: ['arena', 'agua'],
  harina_agua: ['harina', 'agua'],
  bicarbonato_vinagre: ['bicarbonato', 'vinagre'],
};

export const INGREDIENT_NAME: Record<string, Localized> = {
  sal: { es: 'sal', en: 'salt' },
  azucar: { es: 'azúcar', en: 'sugar' },
  arena: { es: 'arena', en: 'sand' },
  harina: { es: 'harina', en: 'flour' },
  agua: { es: 'agua', en: 'water' },
  bicarbonato: { es: 'bicarbonato', en: 'baking soda' },
  vinagre: { es: 'vinagre', en: 'vinegar' },
};

export const MIX_NAME: Record<Mix, Localized> = {
  sal_agua: { es: 'Sal + agua', en: 'Salt + water' },
  azucar_agua: { es: 'Azúcar + agua', en: 'Sugar + water' },
  arena_agua: { es: 'Arena + agua', en: 'Sand + water' },
  harina_agua: { es: 'Harina + agua', en: 'Flour + water' },
  bicarbonato_vinagre: { es: 'Bicarbonato + vinagre', en: 'Baking soda + vinegar' },
};

export const MIX_TEST_NAME: Record<MixTest, Localized> = {
  burbujas: { es: '¿Burbujas?', en: 'Bubbles?' },
  recuperar: { es: '¿Recupero lo de antes?', en: 'Can I get back what I had?' },
};

/** Hubo una señal visible (burbujas de gas). */
export const hasBubbles = (mix: Mix): boolean => mix === 'bicarbonato_vinagre';
/** Se puede recuperar lo que se mezcló (evaporando o separando). */
export const recoverable = (mix: Mix): boolean => mix !== 'bicarbonato_vinagre';
/** ¿Apareció una sustancia nueva? Hace falta una señal Y que no se pueda recuperar lo de antes. */
export const newSubstance = (mix: Mix): boolean => hasBubbles(mix) && !recoverable(mix);

const OBSERVED: Record<Mix, Record<MixTest, Localized>> = {
  sal_agua: { burbujas: { es: 'No hay burbujas', en: 'No bubbles' }, recuperar: { es: 'Sí: queda sal al evaporar', en: 'Yes: salt is left when it evaporates' } },
  azucar_agua: { burbujas: { es: 'No hay burbujas', en: 'No bubbles' }, recuperar: { es: 'Sí: queda azúcar al evaporar', en: 'Yes: sugar is left when it evaporates' } },
  arena_agua: { burbujas: { es: 'No hay burbujas', en: 'No bubbles' }, recuperar: { es: 'Sí: la arena se separa con un colador', en: 'Yes: the sand separates with a strainer' } },
  harina_agua: { burbujas: { es: 'No hay burbujas', en: 'No bubbles' }, recuperar: { es: 'Sí: la harina se separa con un filtro', en: 'Yes: the flour separates with a filter' } },
  bicarbonato_vinagre: { burbujas: { es: 'Muchas burbujas', en: 'Lots of bubbles' }, recuperar: { es: 'No: ya no hay bicarbonato ni vinagre', en: 'No: the baking soda and vinegar are gone' } },
};

/** Lo que se observa en una mezcla con una prueba (palabras, no números). */
export const mixObserved = (mix: Mix, test: MixTest): Localized => OBSERVED[mix][test];

/** Lo que el modelo declara de sí mismo (toda simulación dice qué representa y qué NO). */
export const MIX_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que mezclar no siempre hace una sustancia nueva: se decide con evidencias (una señal como las burbujas) y mirando si se puede recuperar lo de antes.',
    en: 'That mixing doesn’t always make a new substance: you decide with evidence (a sign like bubbles) and by checking whether you can get back what you had.',
  },
  assumptions: [
    { es: 'Poca cantidad de cada cosa, en un vasito abierto, siempre el mismo y con las mismas pruebas.', en: 'A small amount of each thing, in an open cup, always the same one and with the same tests.' },
    { es: 'Las dos pruebas son las mismas para las cinco mezclas: burbujas y recuperar lo de antes.', en: 'The two tests are the same for all five mixtures: bubbles and getting back what you had.' },
    { es: 'Los resultados son de práctica (inventados para aprender).', en: 'The results are practice data (made up for learning).' },
  ],
  doesNotRepresent: [
    { es: 'Cómo se forman las sustancias nuevas por dentro (átomos y moléculas): no hace falta para esta unidad.', en: 'How new substances form inside (atoms and molecules): not needed for this unit.' },
    { es: 'Todas las mezclas ni todas las señales: el color o el calor también pueden ser pistas, pero ninguna decide sola.', en: 'All mixtures or all signs: color or heat can be clues too, but none decides alone.' },
    { es: 'Mezclas en un recipiente cerrado: la que hace burbujas se hace siempre abierta; cerrarla es peligroso.', en: 'Mixtures in a closed container: the one that makes bubbles is always done open; closing it is dangerous.' },
  ],
  controls: [
    { es: 'Lo que se cambia: qué dos cosas se mezclan.', en: 'What changes: which two things are mixed.' },
    { es: 'Lo que se observa: si hay burbujas y si se puede recuperar lo de antes.', en: 'What is observed: whether there are bubbles and whether you can get back what you had.' },
  ],
};

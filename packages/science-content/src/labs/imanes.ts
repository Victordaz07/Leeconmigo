/**
 * Laboratorio «Fuerzas e imanes» (C3-U06, 3-PS2-3 y 3-PS2-4): un imán GRANDE en herradura que se acerca a un objeto sin tocarlo, en
 * cinco posiciones marcadas. Es determinista y cualitativo («se movió / no se movió»):
 *
 *   se mueve  ⇔  el objeto es de un material que el imán atrae  Y  el imán está dentro del alcance de ese objeto.
 *
 * Los alcances son DIDÁCTICOS (inventados para aprender), no medidas de un imán real: el clavo, más liviano, se mueve hasta la
 * marca 3; la llave, hasta la marca 2. El bloque de plástico y la bola de aluminio nunca se mueven (el aluminio no es atraído por un
 * imán común). Nunca se usan imanes pequeños ni de neodimio.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const MAGNET_OBJECTS = ['clavo', 'llave', 'bloque', 'aluminio'] as const;
export type MagnetObject = (typeof MAGNET_OBJECTS)[number];
/** Posiciones marcadas del imán: la 1 es la más cerca del objeto y la 5 la más lejos. */
export const MAGNET_MARKS = [1, 2, 3, 4, 5] as const;
export type Mark = (typeof MAGNET_MARKS)[number];

/** Hasta qué marca llega la fuerza del imán sobre cada objeto (0 = no lo atrae). */
export const MAGNET_REACH: Record<MagnetObject, number> = { clavo: 3, llave: 2, bloque: 0, aluminio: 0 };
/** Objetos de acero: los que el imán sí atrae. */
export const ATTRACTED: readonly MagnetObject[] = MAGNET_OBJECTS.filter((o) => MAGNET_REACH[o] > 0);

export const magnetMoves = (object: MagnetObject, mark: number): boolean => mark >= 1 && mark <= MAGNET_REACH[object];

export const MOVE_TEXT: Record<'si' | 'no', Localized> = {
  si: { es: 'Se movió', en: 'It moved' },
  no: { es: 'No se movió', en: 'It didn’t move' },
};

export const OBJECT_NAME: Record<MagnetObject, Localized> = {
  clavo: { es: 'clavo', en: 'nail' },
  llave: { es: 'llave', en: 'key' },
  bloque: { es: 'bloque de plástico', en: 'plastic block' },
  aluminio: { es: 'bola de aluminio', en: 'aluminum ball' },
};

/** Lo que el modelo declara de sí mismo (toda simulación dice qué representa y qué NO). */
export const MAGNET_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que un imán puede mover un objeto sin tocarlo, solo si el objeto es de un material que atrae y está lo bastante cerca.',
    en: 'That a magnet can move an object without touching it, only if the object is made of a material it attracts and is close enough.',
  },
  assumptions: [
    { es: 'Siempre es el mismo imán grande en herradura, la misma mesa y la misma orientación.', en: 'It is always the same big horseshoe magnet, the same table and the same orientation.' },
    { es: 'Las cinco marcas están a pasos iguales; la 1 es la más cercana al objeto.', en: 'The five marks are equally spaced; mark 1 is the closest to the object.' },
    { es: 'Los alcances son de práctica (inventados para aprender), no medidas reales.', en: 'The reaches are practice values (made up for learning), not real measurements.' },
  ],
  doesNotRepresent: [
    { es: 'Cuánta fuerza hay en cada marca ni en qué unidades se mide.', en: 'How much force there is at each mark or what units it is measured in.' },
    { es: 'Imanes de otros tamaños o fuerzas: aquí no se usan imanes pequeños ni muy potentes.', en: 'Magnets of other sizes or strengths: small or very strong magnets are not used here.' },
    { es: 'Todos los metales: no todos los metales son atraídos (el aluminio no lo es).', en: 'All metals: not all metals are attracted (aluminum isn’t).' },
  ],
  controls: [
    { es: 'Lo que se cambia: la distancia (la marca del imán) o el objeto, de uno en uno.', en: 'What changes: the distance (the magnet’s mark) or the object, one at a time.' },
    { es: 'Lo que se observa: si el objeto se movió o no.', en: 'What is observed: whether the object moved or not.' },
  ],
};

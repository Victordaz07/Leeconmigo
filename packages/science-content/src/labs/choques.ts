/**
 * Laboratorio «Rampa y choques» (C4-U02, 4-PS3-1 y 4-PS3-3): una MISMA bola se suelta desde una de cuatro alturas de una rampa y choca
 * con un MISMO bloque de madera al final. Es determinista y DIDÁCTICO (inventado para aprender):
 *
 *   más alto se suelta  →  más rápido llega abajo  →  más lejos empuja el bloque y más fuerte suena el golpe
 *
 * Se mantienen iguales la masa y el material (la misma bola, el mismo bloque, la misma rampa y la misma mesa): lo ÚNICO que cambia es
 * la altura de la que se suelta, es decir, la rapidez con que llega. Nunca se mide energía en números: se razona con «más» y «menos».
 */
import type { Localized } from '@lee-conmigo/contracts';

/** Marcas de la rampa: la 1 es la más baja y la 4, la más alta. */
export const RELEASE_MARKS = [1, 2, 3, 4] as const;
export type ReleaseMark = (typeof RELEASE_MARKS)[number];

/** Cuánto se desliza el bloque (cm) cuando la bola se suelta de cada marca. Valores didácticos. */
export const BLOCK_SLIDE_CM: Record<ReleaseMark, number> = { 1: 4, 2: 9, 3: 15, 4: 22 };

export const SPEED_WORD: Record<ReleaseMark, Localized> = {
  1: { es: 'despacio', en: 'slowly' },
  2: { es: 'a rapidez media', en: 'at medium speed' },
  3: { es: 'rápido', en: 'fast' },
  4: { es: 'muy rápido', en: 'very fast' },
};

export const SOUND_WORD: Record<ReleaseMark, Localized> = {
  1: { es: 'Sonido suave', en: 'Soft sound' },
  2: { es: 'Sonido medio', en: 'Medium sound' },
  3: { es: 'Sonido fuerte', en: 'Loud sound' },
  4: { es: 'Sonido muy fuerte', en: 'Very loud sound' },
};

export const isMark = (n: number): n is ReleaseMark => (RELEASE_MARKS as readonly number[]).includes(n);

/** Cuánto se desliza el bloque desde esta marca. */
export const slideCm = (mark: ReleaseMark): number => BLOCK_SLIDE_CM[mark];

/** ¿La marca `a` empuja el bloque más lejos que la `b`? */
export const pushesFarther = (a: ReleaseMark, b: ReleaseMark): boolean => BLOCK_SLIDE_CM[a] > BLOCK_SLIDE_CM[b];

/** Los números de la tabla de un niño que probó estas marcas, en orden de marca. */
export const slides = (marks: readonly ReleaseMark[]): number[] => [...marks].sort((a, b) => a - b).map(slideCm);

/** Lo que el modelo declara de sí mismo (toda simulación dice qué representa y qué NO). */
export const RAMP_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que una bola que llega más rápido tiene más energía de movimiento: al chocar empuja un bloque más lejos y suena más fuerte.',
    en: 'That a ball that arrives faster has more energy of motion: when it hits it pushes a block farther and makes a louder sound.',
  },
  assumptions: [
    { es: 'Siempre la misma bola, el mismo bloque, la misma rampa y la misma mesa: solo cambia la marca desde la que se suelta.', en: 'Always the same ball, the same block, the same ramp and the same table: only the mark it is released from changes.' },
    { es: 'Las cuatro marcas están a alturas iguales, de la 1 (la más baja) a la 4 (la más alta).', en: 'The four marks are equally spaced in height, from 1 (lowest) to 4 (highest).' },
    { es: 'Las distancias son de práctica (inventadas para aprender), en centímetros enteros.', en: 'The distances are practice values (made up for learning), in whole centimeters.' },
  ],
  doesNotRepresent: [
    { es: 'Cuánta energía hay en números ni en qué unidades se mide: aquí se razona con «más» y «menos».', en: 'How much energy there is in numbers or what units it is measured in: here you reason with “more” and “less”.' },
    { es: 'Bolas de otro tamaño o material: eso cambiaría dos cosas a la vez y sería otra investigación.', en: 'Balls of another size or material: that would change two things at once and would be a different investigation.' },
    { es: 'Todo el recorrido de la energía: parte pasa al bloque y al sonido, y el resto se reparte de formas que aquí no se miden.', en: 'The full path of the energy: part goes to the block and the sound, and the rest spreads in ways not measured here.' },
  ],
  controls: [
    { es: 'Lo que se cambia: la marca desde la que se suelta la bola (su altura).', en: 'What changes: the mark the ball is released from (its height).' },
    { es: 'Lo que se mide: cuánto se desliza el bloque (cm) y cómo suena el golpe.', en: 'What is measured: how far the block slides (cm) and how the hit sounds.' },
  ],
};

/**
 * Laboratorio «Luz y materiales» (docs/design/ciencia/unidades/C1-U02.md): la caja de observación con un objeto y una luz.
 *
 * REGLA DEL MODELO (1-PS4-2): un objeto se distingue SOLO cuando hay luz que lo ilumina. Con la luz apagada se ve apenas una
 * silueta; el objeto nunca cambia de lugar ni de forma. Es determinista: no hay azar, así que lo que el niño anota se puede
 * comprobar siempre.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const LIGHT_OBJECTS = ['osito', 'pelota', 'taza'] as const;
export type LightObject = (typeof LIGHT_OBJECTS)[number];
export const LIGHT_STATES = ['off', 'on'] as const;
export type LightState = (typeof LIGHT_STATES)[number];

/** Lo que el niño puede anotar en cada observación. */
export type Sighting = 'distingo' | 'noDistingo';

/** ¿Se distingue el objeto? Solo con la luz encendida. */
export const sighting = (light: LightState): Sighting => (light === 'on' ? 'distingo' : 'noDistingo');

/** Las observaciones de una tabla de `n` repeticiones: una fila por condición de luz. */
export const LIGHT_ROWS: readonly LightState[] = ['off', 'on'];
export const sightingsFor = (light: LightState, n = 3): Sighting[] => Array.from({ length: n }, () => sighting(light));

/** Lo que el modelo declara de sí mismo (informe §6: toda simulación dice qué representa y qué NO representa). */
export const LIGHT_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que un objeto se distingue cuando hay luz que lo ilumina y casi no se distingue cuando no la hay.',
    en: 'That an object can be made out when light shines on it, and hardly at all when there is none.',
  },
  assumptions: [
    { es: 'El objeto no se mueve ni cambia: solo cambia la luz.', en: 'The object does not move or change: only the light changes.' },
    { es: 'La luz es una linterna LED apuntada al objeto, sin otras fuentes.', en: 'The light is an LED flashlight aimed at the object, with no other sources.' },
  ],
  doesNotRepresent: [
    { es: 'Cómo viaja la luz hasta el ojo (se verá en grados más altos).', en: 'How light travels to the eye (this comes in later grades).' },
    { es: 'Luz de luna, de la calle o de ventanas, ni distintos brillos o colores de luz.', en: 'Moonlight, street light or window light, or different brightness or colors of light.' },
    { es: 'Objetos que producen su propia luz.', en: 'Objects that make their own light.' },
  ],
  controls: [
    { es: 'Luz: encendida o apagada.', en: 'Light: on or off.' },
    { es: 'Objeto: osito, pelota o taza.', en: 'Object: teddy bear, ball or cup.' },
  ],
};

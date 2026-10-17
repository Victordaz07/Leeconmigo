/**
 * Mesa de vibraciones (C1-U01, 1-PS4-1): tres objetos (una regla de plástico sujeta al borde de una tabla, un tambor con arroz y una caja con ligas)
 * y cuatro cosas que se pueden hacer: dejarlos quietos, golpearlos o puntearlos, sujetarlos con la mano o hablarles fuerte cerca.
 *
 * Es un modelo cualitativo: dice si el objeto SE MUEVE (vibra), si SUENA y si el arroz del tambor SALTA. No hay frecuencias ni decibeles.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const VIB_OBJECTS = ['regla', 'tambor', 'ligas'] as const;
export type VibObject = (typeof VIB_OBJECTS)[number];
export const VIB_ACTIONS = ['quieta', 'golpear', 'sujetar', 'voz'] as const;
export type VibAction = (typeof VIB_ACTIONS)[number];

export interface VibState {
  /** El objeto se mueve muy rápido de un lado a otro (vibra). */
  moves: boolean;
  /** El objeto suena por sí mismo. */
  sound: boolean;
  /** Los granitos de arroz del tambor saltan. */
  riceJumps: boolean;
}

export function stateOf(object: VibObject, action: VibAction): VibState {
  switch (action) {
    case 'quieta':
    case 'sujetar':
      return { moves: false, sound: false, riceJumps: false };
    case 'golpear':
      return { moves: true, sound: true, riceJumps: object === 'tambor' };
    case 'voz':
      // El sonido de la voz hace vibrar la piel del tambor (el arroz salta); la regla y las ligas no se nota.
      return object === 'tambor' ? { moves: true, sound: false, riceJumps: true } : { moves: false, sound: false, riceJumps: false };
  }
}

export const VIB_OBJECT_NAME: Record<VibObject, Localized> = {
  regla: { es: 'Regla', en: 'Ruler' },
  tambor: { es: 'Tambor', en: 'Drum' },
  ligas: { es: 'Ligas', en: 'Rubber bands' },
};

export const VIB_ACTION_NAME: Record<VibAction, Localized> = {
  quieta: { es: 'Quieta', en: 'Still' },
  golpear: { es: 'Golpear', en: 'Strike' },
  sujetar: { es: 'Sujetar con la mano', en: 'Hold with a hand' },
  voz: { es: 'Hablar fuerte cerca', en: 'Speak loudly nearby' },
};

/** Lo que se ve y se oye en cada caso, en palabras. */
export function stateText(object: VibObject, action: VibAction): Localized {
  const s = stateOf(object, action);
  if (s.riceJumps && !s.sound) return { es: 'El arroz salta · No suena solo', en: 'The rice jumps · It doesn’t sound by itself' };
  if (s.sound && s.moves) return { es: s.riceJumps ? 'Suena · Se mueve · El arroz salta' : 'Suena · Se mueve', en: s.riceJumps ? 'It sounds · It moves · The rice jumps' : 'It sounds · It moves' };
  return { es: 'Silencio · Quieta', en: 'Silent · Still' };
}

export const VIB_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Qué pasa con tres objetos cuando suenan: se mueven muy rápido de un lado a otro (vibran) y, si se sujetan, dejan de sonar; además, el sonido de la voz puede hacer vibrar la piel de un tambor.',
    en: 'What happens to three objects when they make sound: they move very fast from side to side (they vibrate) and, if held, they stop making sound; also, the sound of a voice can make a drum skin vibrate.',
  },
  assumptions: [
    { es: 'Cada objeto se golpea o se puntea con la misma fuerza.', en: 'Each object is struck or plucked with the same force.' },
    { es: 'El tambor tiene arroz encima y las otras cosas no.', en: 'The drum has rice on top and the other things do not.' },
  ],
  doesNotRepresent: [
    { es: 'Qué tan fuerte o qué tan agudo suena cada objeto.', en: 'How loud or how high each object sounds.' },
    { es: 'Cómo viaja el sonido por el aire hasta los oídos: no hace falta para esta unidad.', en: 'How sound travels through the air to our ears: not needed for this unit.' },
    { es: 'Todos los objetos del mundo: aquí solo hay tres.', en: 'All objects in the world: there are only three here.' },
  ],
  controls: [
    { es: 'Lo que se cambia: el objeto y lo que se hace con él (golpear, sujetar o hablarle).', en: 'What changes: the object and what is done with it (strike, hold or speak to it).' },
    { es: 'Lo que se observa: si se mueve, si suena y si el arroz salta.', en: 'What is observed: whether it moves, whether it sounds and whether the rice jumps.' },
  ],
};

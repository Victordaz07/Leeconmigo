/**
 * Laboratorio «Caminos de luz» (C1-U03, 1-PS4-3): una linterna apunta a una pared lisa y entre las dos se pone un marco con un material.
 * Es determinista y DIDÁCTICO:
 *
 *   plástico transparente → la luz pasa toda          (la pared se ilumina)
 *   papel de calco        → la luz pasa un poco       (la pared se ilumina apenas)
 *   cartulina             → la luz no pasa            (hay sombra)
 *   papel de aluminio     → la luz rebota             (no pasa: vuelve hacia la linterna)
 *
 * Nunca se mide la luz en números. Los haces y la pared iluminada los dibuja la app; la imagen es solo la escena.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const PATH_MATERIALS = ['transparente', 'calco', 'cartulina', 'aluminio'] as const;
export type PathMaterial = (typeof PATH_MATERIALS)[number];
export type PathOutcome = 'toda' | 'poca' | 'nada' | 'rebota';

export const PATH_OUTCOME: Record<PathMaterial, PathOutcome> = { transparente: 'toda', calco: 'poca', cartulina: 'nada', aluminio: 'rebota' };

export const outcomeOf = (m: PathMaterial): PathOutcome => PATH_OUTCOME[m];
/** ¿Algo de luz llega a la pared? */
export const lightReachesWall = (m: PathMaterial): boolean => PATH_OUTCOME[m] === 'toda' || PATH_OUTCOME[m] === 'poca';
/** Qué tan iluminada queda la pared: 0 oscura, 1 apenas, 3 muy iluminada. */
export const WALL_BRIGHTNESS: Record<PathOutcome, number> = { toda: 3, poca: 1, nada: 0, rebota: 0 };
/** ¿Se forma sombra en la pared? */
export const makesShadow = (m: PathMaterial): boolean => !lightReachesWall(m);

export const OUTCOME_TEXT: Record<PathOutcome, Localized> = {
  toda: { es: 'La luz pasa toda', en: 'All the light passes' },
  poca: { es: 'La luz pasa un poco', en: 'A little light passes' },
  nada: { es: 'La luz no pasa', en: 'No light passes' },
  rebota: { es: 'La luz rebota', en: 'The light bounces back' },
};

export const PATH_NAME: Record<PathMaterial, Localized> = {
  transparente: { es: 'plástico transparente', en: 'clear plastic' },
  calco: { es: 'papel de calco', en: 'tracing paper' },
  cartulina: { es: 'cartulina', en: 'cardstock' },
  aluminio: { es: 'papel de aluminio', en: 'aluminum foil' },
};

/** Lo que el modelo declara de sí mismo (toda simulación dice qué representa y qué NO). */
export const PATH_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que, según el material que se pone en el camino de la luz, la luz pasa toda, pasa un poco, no pasa o rebota.',
    en: 'That, depending on the material placed in the path of the light, the light all passes, a little passes, none passes or it bounces back.',
  },
  assumptions: [
    { es: 'Siempre la misma linterna, la misma pared y el mismo marco; solo cambia el material.', en: 'Always the same flashlight, the same wall and the same frame; only the material changes.' },
    { es: 'Cada material es una hoja delgada y lisa de un solo tipo.', en: 'Each material is a thin, smooth sheet of a single kind.' },
  ],
  doesNotRepresent: [
    { es: 'Cuánta luz hay en números ni los colores de la luz.', en: 'How much light there is in numbers or the colors of light.' },
    { es: 'Otros materiales ni otros grosores: una hoja más gruesa podría dejar pasar menos luz.', en: 'Other materials or other thicknesses: a thicker sheet could let less light through.' },
    { es: 'Por qué la luz se comporta así por dentro del material: aquí solo se observa lo que pasa.', en: 'Why light behaves this way inside the material: here you only observe what happens.' },
  ],
  controls: [
    { es: 'Lo que se cambia: el material del marco.', en: 'What changes: the material in the frame.' },
    { es: 'Lo que se observa: qué pasa con la luz en la pared.', en: 'What is observed: what happens to the light on the wall.' },
  ],
};

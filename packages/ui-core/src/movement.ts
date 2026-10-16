/**
 * Pausa de movimiento del Modo Enfoque (Kitewise B12, docs/10 §1): 60 s con tres movimientos, cada ~10 min de actividad.
 * Solo se ofrece en un límite natural (al terminar una página o un ejercicio), nunca a media frase. No es castigo ni
 * premio: el niño puede volver antes con "Listo, volvamos".
 */
import type { MathLang } from './math-copy.ts';

/** Minutos de actividad entre pausas. */
export const MOVEMENT_EVERY_MS = 10 * 60_000;
/** Duración de la pausa (la spec dice 60–90 s). */
export const MOVEMENT_SECONDS = 60;

type Text2 = Record<MathLang, string>;
export interface MovementRoutine {
  title: Text2;
  steps: [Text2, Text2, Text2];
}

export const MOVEMENT_ROUTINES: MovementRoutine[] = [
  {
    title: { es: 'Estira como un papalote', en: 'Stretch like a kite' },
    steps: [
      { es: 'Brazos arriba, bien largos', en: 'Arms up, nice and long' },
      { es: 'Gira despacio como el viento', en: 'Turn slowly like the wind' },
      { es: 'Respira hondo tres veces', en: 'Take three deep breaths' },
    ],
  },
  {
    title: { es: 'Crece como un árbol', en: 'Grow like a tree' },
    steps: [
      { es: 'Párate derecho, pies juntos', en: 'Stand tall, feet together' },
      { es: 'Sube los brazos como ramas', en: 'Raise your arms like branches' },
      { es: 'Muévete suave con la brisa', en: 'Sway gently in the breeze' },
    ],
  },
  {
    title: { es: 'Despierta el cuerpo', en: 'Wake up your body' },
    steps: [
      { es: 'Mueve los hombros en círculos', en: 'Roll your shoulders in circles' },
      { es: 'Toca tus rodillas y sube', en: 'Touch your knees and come back up' },
      { es: 'Sacude las manos y respira', en: 'Shake your hands and breathe' },
    ],
  },
];

/** Una rutina distinta cada vez (por número de pausa del día). */
export const routineFor = (n: number): MovementRoutine => MOVEMENT_ROUTINES[((n % MOVEMENT_ROUTINES.length) + MOVEMENT_ROUTINES.length) % MOVEMENT_ROUTINES.length]!;

/** Qué movimiento toca con `left` segundos por delante (tercios del tiempo); 3 = terminó. */
export function movementStep(left: number, total = MOVEMENT_SECONDS): 0 | 1 | 2 | 3 {
  if (left <= 0) return 3;
  const done = total - left;
  return Math.min(2, Math.floor((done * 3) / total)) as 0 | 1 | 2;
}

export const MOVEMENT_COPY = {
  kicker: { es: 'Pausa de movimiento', en: 'Movement break' },
  seconds: { es: 'segundos', en: 'seconds' },
  back: { es: 'Listo, volvamos', en: 'Done, let’s go back' },
  stepDone: { es: 'hecho', en: 'done' },
} as const;

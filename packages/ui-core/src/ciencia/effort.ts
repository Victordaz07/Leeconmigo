/**
 * Cierre de una sesión de Ciencia: estrellas por ESFUERZO, nunca por precisión (D11 + DC-7, docs/DECISIONS.md D13):
 * 1 por terminar la sesión · +1 si pidió una pista o REVISÓ su idea · +1 si volvió a probar (repitió una prueba o arregló una).
 */
import type { Loc } from './copy.ts';

export interface ScienceEffort {
  /** Llegó al final de la sesión. */
  finished: boolean;
  /** Abrió una pista, o dijo «cambié mi idea» / revisó su idea con datos. */
  usedHintOrRevised: boolean;
  /** Repitió una prueba o arregló una prueba para que cambiara una sola cosa. */
  triedAgain: boolean;
}

/** 0–3 estrellas. Sin terminar no hay estrellas (la sesión queda guardada a medias, no «falló»). */
export function scienceStars({ finished, usedHintOrRevised, triedAgain }: ScienceEffort): 0 | 1 | 2 | 3 {
  if (!finished) return 0;
  return (1 + (usedHintOrRevised ? 1 : 0) + (triedAgain ? 1 : 0)) as 1 | 2 | 3;
}

/** Celebra el esfuerzo concreto que las ganó (nunca compara ni califica). */
export function scienceStarsReason({ usedHintOrRevised, triedAgain }: Omit<ScienceEffort, 'finished'>): Loc {
  if (usedHintOrRevised && triedAgain) return { es: 'por revisar tu idea y volver a probar', en: 'for revisiting your idea and trying again' };
  if (usedHintOrRevised) return { es: 'por pedir ayuda y revisar tu idea', en: 'for asking for help and revisiting your idea' };
  if (triedAgain) return { es: 'por volver a probar', en: 'for trying again' };
  return { es: 'por terminar la sesión', en: 'for finishing the session' };
}

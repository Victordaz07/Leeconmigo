/**
 * Reloj del modo lectura libre. Sin micrófono nadie "oye" la lectura, así que el tiempo se cuenta con reglas honestas (docs/03: el tiempo válido no
 * debe acumularse solo por tener la app abierta):
 *  - solo corre mientras se lee de verdad: pantalla de lectura y app en primer plano;
 *  - de cada visita a una página se acredita como máximo lo razonable para leerla (`pageCapMs`): si el niño se va a jugar y deja la tablet, no suma;
 *  - volver a una página y seguir no cuenta la página dos veces (eso lo cuida el flujo con `free.forward`).
 */

/** Segundos que se dan por palabra como tope (un lector lento lee ~1 palabra por segundo; el doble deja margen). */
export const FREE_SECONDS_PER_WORD = 2;
/** Segundos extra por página para mirar la ilustración, pensar o pedir ayuda con una palabra. */
export const FREE_PAGE_OVERHEAD_SECONDS = 25;
/** Entre dos cambios de página tiene que pasar este tiempo: evita saltar páginas por un doble toque accidental. */
export const NAV_DEBOUNCE_MS = 450;
/** Un salto mayor entre dos pulsos del reloj es la app en segundo plano o la tablet dormida: ese rato no se cuenta. */
export const MAX_TICK_GAP_MS = 2000;

/** Tope de tiempo que se puede acreditar por una visita a una página con `wordCount` palabras. */
export const pageCapMs = (wordCount: number): number => (Math.max(0, wordCount) * FREE_SECONDS_PER_WORD + FREE_PAGE_OVERHEAD_SECONDS) * 1000;

/** Lo que de verdad se acredita de una visita: el tiempo activo, sin pasar del tope. */
export const creditedMs = (activeMs: number, wordCount: number): number => Math.max(0, Math.min(activeMs, pageCapMs(wordCount)));

/** ¿Se puede cambiar de página ahora? (anti doble toque). */
export const canNavigate = (lastNavAt: number | null, now: number): boolean => lastNavAt === null || now - lastNavAt >= NAV_DEBOUNCE_MS;

/** Milisegundos activos desde el pulso anterior; 0 si el salto es raro (segundo plano, reloj movido hacia atrás). */
export const tickDelta = (previous: number, now: number): number => {
  const dt = now - previous;
  return dt > 0 && dt <= MAX_TICK_GAP_MS ? dt : 0;
};

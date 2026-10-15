/**
 * Cierre de sesión de Kitewise (B13) y energía del día (B2): reglas puras, compartidas y probadas.
 *
 * DECISIÓN D11 (Victor, 2026-10-15): las estrellas son POR ESFUERZO, nunca por precisión:
 *   1 por terminar la historia · +1 si pidió ayuda o volvió a intentar una palabra · +1 si leyó sin pausas largas.
 */

export interface EffortInput {
  /** Llegó al final de la historia. */
  completed: boolean;
  /** Pidió ayuda (tocó una palabra, "?", "Léeme el comienzo") o volvió a intentar una palabra. */
  helpedOrRetried: boolean;
  /** Cuántas pausas largas hubo en la sesión. */
  longPauses: number;
}

/** 0–3 estrellas. Sin terminar no hay estrellas de cierre (la sesión sigue a medias, no "falló"). */
export function effortStars({ completed, helpedOrRetried, longPauses }: EffortInput): 0 | 1 | 2 | 3 {
  if (!completed) return 0;
  return (1 + (helpedOrRetried ? 1 : 0) + (longPauses === 0 ? 1 : 0)) as 1 | 2 | 3;
}

/** Frase debajo de las estrellas: celebra el esfuerzo concreto que las ganó (nunca compara ni califica). */
export function effortReason({ helpedOrRetried, longPauses }: Omit<EffortInput, 'completed'>): string {
  if (helpedOrRetried && longPauses === 0) return 'por pedir ayuda y leer sin parar';
  if (helpedOrRetried) return 'por volver a intentarlo';
  if (longPauses === 0) return 'por leer sin parar';
  return 'por terminar la historia';
}

/**
 * Papalote (Kitewise, progreso "+m"): sube 1 metro por cada 20 s de lectura VÁLIDA (14 min ≈ +42 m). Es una forma visual
 * de mostrar el tiempo leído sin un reloj; ajustable sin tocar pantallas.
 */
export const KITE_SECONDS_PER_METER = 20;
export const kiteMeters = (validSeconds: number): number => Math.max(0, Math.round(validSeconds / KITE_SECONDS_PER_METER));

/** "¿Cómo llegas hoy?" (B2): la energía del niño decide cuánto dura la misión del día. */
export type Energy = 'alta' | 'normal' | 'baja';

export interface EnergyOption {
  id: Energy;
  title: string;
  detail: string;
  minutes: 20 | 15 | 8;
  glyph: string;
}

export const ENERGY_OPTIONS: readonly EnergyOption[] = [
  { id: 'alta', title: 'Con energía', detail: '20 min · retos largos', minutes: 20, glyph: '☺' },
  { id: 'normal', title: 'Normal', detail: '15 min · misión de siempre', minutes: 15, glyph: '–' },
  { id: 'baja', title: 'Cansado', detail: '8 min · juegos y repaso suave', minutes: 8, glyph: '☾' },
];

export const energyOption = (id: Energy): EnergyOption => ENERGY_OPTIONS.find((o) => o.id === id)!;

/** "¿Cómo estuvo tu enfoque?" (B13): autoevaluación con 3 caritas. Solo para el niño y sus padres, nunca una nota. */
export type FocusSelfReport = 1 | 2 | 3;
export const FOCUS_FACES: readonly { value: FocusSelfReport; glyph: string; label: string }[] = [
  { value: 1, glyph: '☹', label: 'Me costó concentrarme' },
  { value: 2, glyph: '–', label: 'Más o menos' },
  { value: 3, glyph: '☺', label: 'Muy concentrado' },
];

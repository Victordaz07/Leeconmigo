/**
 * Cierre de sesión de Kitewise (B13) y energía del día (B2): reglas puras, compartidas y probadas.
 *
 * DECISIÓN D11 (Victor, 2026-10-15): las estrellas son POR ESFUERZO, nunca por precisión:
 *   1 por terminar la historia · +1 si pidió ayuda o volvió a intentar una palabra · +1 si leyó sin pausas largas.
 */
import type { MathLang as EffortLang } from './math-copy.ts';

export type { EffortLang };

const L = <T>(es: T, en: T) => ({ es, en });

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

const EFFORT_REASON_COPY = {
  helpedAndNoPauses: L('por pedir ayuda y leer sin parar', 'for asking for help and reading without stopping'),
  helped: L('por volver a intentarlo', 'for trying again'),
  noPauses: L('por leer sin parar', 'for reading without stopping'),
  completed: L('por terminar la historia', 'for finishing the story'),
};

/** Frase debajo de las estrellas: celebra el esfuerzo concreto que las ganó (nunca compara ni califica). */
export function effortReason({ helpedOrRetried, longPauses }: Omit<EffortInput, 'completed'>, lang: EffortLang = 'es'): string {
  if (helpedOrRetried && longPauses === 0) return EFFORT_REASON_COPY.helpedAndNoPauses[lang];
  if (helpedOrRetried) return EFFORT_REASON_COPY.helped[lang];
  if (longPauses === 0) return EFFORT_REASON_COPY.noPauses[lang];
  return EFFORT_REASON_COPY.completed[lang];
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
  title: Record<EffortLang, string>;
  detail: Record<EffortLang, string>;
  minutes: 20 | 15 | 8;
  glyph: string;
}

export const ENERGY_OPTIONS: readonly EnergyOption[] = [
  { id: 'alta', title: L('Con energía', 'With energy'), detail: L('20 min · retos largos', '20 min · longer challenges'), minutes: 20, glyph: '☺' },
  { id: 'normal', title: L('Normal', 'Normal'), detail: L('15 min · misión de siempre', '15 min · the usual mission'), minutes: 15, glyph: '–' },
  { id: 'baja', title: L('Cansado', 'Tired'), detail: L('8 min · juegos y repaso suave', '8 min · games and light review'), minutes: 8, glyph: '☾' },
];

export const energyOption = (id: Energy): EnergyOption => ENERGY_OPTIONS.find((o) => o.id === id)!;

/** "¿Cómo estuvo tu enfoque?" (B13): autoevaluación con 3 caritas. Solo para el niño y sus padres, nunca una nota. */
export type FocusSelfReport = 1 | 2 | 3;
export const FOCUS_FACES: readonly { value: FocusSelfReport; glyph: string; label: Record<EffortLang, string> }[] = [
  { value: 1, glyph: '☹', label: L('Me costó concentrarme', "I had trouble focusing") },
  { value: 2, glyph: '–', label: L('Más o menos', 'So-so') },
  { value: 3, glyph: '☺', label: L('Muy concentrado', 'Very focused') },
];

export const CLOSING_COPY = {
  title: L((name: string) => `¡Buen trabajo, ${name}!`, (name: string) => `Great job, ${name}!`),
  starsOf3: L((n: number) => `${n} de 3 estrellas`, (n: number) => `${n} of 3 stars`),
  focusQuestion: L('¿Cómo estuvo tu enfoque?', 'How was your focus?'),
  again: L('Leer de nuevo', 'Read again'),
  done: L('Listo', 'Done'),
};

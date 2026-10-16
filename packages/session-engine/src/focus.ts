/**
 * Resolver el Modo Enfoque de un niño en un momento dado (lógica pura, docs/10 §1): qué apoyos rigen ahora según la
 * posición elegida por el padre (Apagado / Encendido / Personalizado) y el horario, si lo hay.
 */
import type { FocusSchedule, FocusSettings, FocusSupports } from '@lee-conmigo/contracts';

export const FOCUS_OFF: FocusSupports = { reducedMotion: false, roundSize: 6, focusReading: false, movementBreaks: false };
export const FOCUS_ON: FocusSupports = { reducedMotion: true, roundSize: 4, focusReading: true, movementBreaks: true };

/** Lo que tiene un perfil nuevo (o uno guardado antes de que existiera el Modo Enfoque). */
export const DEFAULT_FOCUS: FocusSettings = { mode: 'off', custom: { ...FOCUS_ON } };

const minutes = (hhmm: string): number | null => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!m) return null;
  const [h, mm] = [Number(m[1]), Number(m[2])];
  return h < 24 && mm < 60 ? h * 60 + mm : null;
};

/** ¿Está `now` dentro del horario? Admite horarios que cruzan la medianoche (22:00–06:00 cuenta para el día de inicio). */
export function inSchedule(s: FocusSchedule, now: Date): boolean {
  const [from, to] = [minutes(s.from), minutes(s.to)];
  if (from === null || to === null || from === to) return false;
  const t = now.getHours() * 60 + now.getMinutes();
  const day = now.getDay();
  if (from < to) return s.days.includes(day) && t >= from && t < to;
  // Cruza la medianoche: la parte de antes de las 24:00 es del día de hoy; la de después, del día anterior.
  return (t >= from && s.days.includes(day)) || (t < to && s.days.includes((day + 6) % 7));
}

/** Completa lo que falte (perfiles guardados antes, datos a medias) sin tirar lo que sí está. */
export function normalizeFocus(saved: Partial<FocusSettings> | null | undefined): FocusSettings {
  const mode = saved?.mode === 'on' || saved?.mode === 'custom' ? saved.mode : 'off';
  const c: Partial<FocusSupports> = saved?.custom ?? {};
  const roundSize = Number.isInteger(c.roundSize) && c.roundSize! >= 3 && c.roundSize! <= 10 ? c.roundSize! : FOCUS_ON.roundSize;
  const flag = (k: 'reducedMotion' | 'focusReading' | 'movementBreaks') => (typeof c[k] === 'boolean' ? c[k]! : FOCUS_ON[k]);
  return { mode, custom: { reducedMotion: flag('reducedMotion'), roundSize, focusReading: flag('focusReading'), movementBreaks: flag('movementBreaks') }, ...(saved?.schedule ? { schedule: saved.schedule } : {}) };
}

/** Apoyos que rigen ahora. Con horario, fuera de él el modo queda apagado. */
export function resolveFocus(settings: FocusSettings | undefined, now: Date = new Date()): FocusSupports {
  const s = normalizeFocus(settings);
  if (s.mode === 'off') return FOCUS_OFF;
  if (s.schedule && !inSchedule(s.schedule, now)) return FOCUS_OFF;
  return s.mode === 'on' ? FOCUS_ON : s.custom;
}

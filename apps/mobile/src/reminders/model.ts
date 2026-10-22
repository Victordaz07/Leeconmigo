/**
 * Recordatorios de Kitewise (locales, sin servidor ni cuentas). Los configura el adulto en Modo padres (tras el PIN).
 * Dos tipos: un recordatorio diario de lectura para cada niño y un aviso semanal de que el resumen está listo.
 * Reglas (D5): amables, nunca de culpa ni de «perdiste tu racha»; si el niño no abre la app en una semana, los avisos se acaban solos.
 */
export const REMINDERS_FORMAT = 1;

/** Días 0 = lunes … 6 = domingo (como el resto de la app). */
export interface ChildReminder {
  enabled: boolean;
  hour: number;
  minute: number;
  days: boolean[];
}

export interface ParentReminder {
  enabled: boolean;
  /** 0 = lunes … 6 = domingo. */
  weekday: number;
  hour: number;
  minute: number;
}

export interface ReminderSettings {
  format: typeof REMINDERS_FORMAT;
  /** Por id de niño. Si falta, se usan los valores de partida (apagado). */
  child: Record<string, ChildReminder>;
  parent: ParentReminder;
}

/** Después de la escuela, de lunes a viernes. */
export const defaultChildReminder = (): ChildReminder => ({ enabled: false, hour: 16, minute: 30, days: [true, true, true, true, true, false, false] });
export const defaultParentReminder = (): ParentReminder => ({ enabled: false, weekday: 6, hour: 18, minute: 0 });
export const emptyReminders = (): ReminderSettings => ({ format: REMINDERS_FORMAT, child: {}, parent: defaultParentReminder() });

export const childReminderOf = (s: ReminderSettings, profileId: string): ChildReminder => s.child[profileId] ?? defaultChildReminder();

const isHour = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 23;
const isMinute = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 59;

export function isChildReminder(v: unknown): v is ChildReminder {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Record<string, unknown>;
  return typeof c.enabled === 'boolean' && isHour(c.hour) && isMinute(c.minute) && Array.isArray(c.days) && c.days.length === 7 && c.days.every((d) => typeof d === 'boolean');
}

export function isParentReminder(v: unknown): v is ParentReminder {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return typeof p.enabled === 'boolean' && typeof p.weekday === 'number' && Number.isInteger(p.weekday) && p.weekday >= 0 && p.weekday <= 6 && isHour(p.hour) && isMinute(p.minute);
}

export function isReminderSettings(v: unknown): v is ReminderSettings {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  if (s.format !== REMINDERS_FORMAT || !isParentReminder(s.parent) || typeof s.child !== 'object' || s.child === null || Array.isArray(s.child)) return false;
  return Object.values(s.child).every(isChildReminder);
}

export const setChildReminder = (s: ReminderSettings, profileId: string, patch: Partial<ChildReminder>): ReminderSettings => ({ ...s, child: { ...s.child, [profileId]: { ...childReminderOf(s, profileId), ...patch } } });
export const setParentReminder = (s: ReminderSettings, patch: Partial<ParentReminder>): ReminderSettings => ({ ...s, parent: { ...s.parent, ...patch } });

/** ¿Hay algún aviso activo? (si no, no hace falta ni pedir el permiso). */
export const anyReminderOn = (s: ReminderSettings): boolean => s.parent.enabled || Object.values(s.child).some((c) => c.enabled);

/** «16:30» con dos dígitos; la pantalla lo muestra así. */
export const timeLabel = (hour: number, minute: number): string => `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

/**
 * Qué avisos quedan programados, calculado de forma pura (se prueba sin el teléfono). Se vuelve a calcular cada vez que se abre la app y al
 * terminar una sesión; por eso:
 * - el aviso del niño solo existe para los próximos 7 días: si no abre la app en una semana, se acaban solos (sin insistir);
 * - si hoy ya leyó, el aviso de hoy no se manda.
 */
import { REMINDER_COPY } from './copy';
import { childReminderOf, type ReminderSettings } from './model';

export const CHILD_HORIZON_DAYS = 7;
export const PARENT_WEEKS_AHEAD = 2;
/** Prefijo de todo lo que programa Kitewise: así se puede cancelar lo propio sin tocar nada más. */
export const REMINDER_PREFIX = 'kw-';

export interface PlannedReminder {
  id: string;
  at: Date;
  kind: 'child' | 'parent';
  title: string;
  body: string;
}

export interface PlanInput {
  settings: ReminderSettings;
  profiles: { id: string; name: string }[];
  lang: 'es' | 'en';
  now: Date;
  /** ¿Ya leyó hoy? (con lectura válida). */
  readToday: (profileId: string) => boolean;
}

const mondayIndex = (d: Date) => (d.getDay() + 6) % 7;
const withTime = (d: Date, hour: number, minute: number): Date => {
  const c = new Date(d);
  c.setHours(hour, minute, 0, 0);
  return c;
};
const addDays = (d: Date, n: number): Date => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};
const ymd = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
/** Número estable por texto (para variar el mensaje de cada niño sin azar). */
const hash = (s: string) => [...s].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7);

export function planReminders({ settings, profiles, lang, now, readToday }: PlanInput): PlannedReminder[] {
  const copy = REMINDER_COPY[lang];
  const out: PlannedReminder[] = [];
  for (const p of profiles) {
    const c = childReminderOf(settings, p.id);
    if (!c.enabled) continue;
    for (let i = 0; i < CHILD_HORIZON_DAYS; i++) {
      const day = addDays(now, i);
      const at = withTime(day, c.hour, c.minute);
      if (!c.days[mondayIndex(day)] || at.getTime() <= now.getTime()) continue;
      if (i === 0 && readToday(p.id)) continue;
      const base = copy.childBodies[(hash(p.id) + Math.floor(at.getTime() / 86_400_000)) % copy.childBodies.length]!;
      out.push({ id: `${REMINDER_PREFIX}child-${p.id}-${ymd(at)}`, at, kind: 'child', title: copy.childTitle, body: profiles.length > 1 ? copy.named(p.name, base) : base });
    }
  }
  const par = settings.parent;
  if (par.enabled) {
    const ahead = (par.weekday - mondayIndex(now) + 7) % 7;
    for (let w = 0; w < PARENT_WEEKS_AHEAD + 1 && out.filter((r) => r.kind === 'parent').length < PARENT_WEEKS_AHEAD; w++) {
      const at = withTime(addDays(now, ahead + 7 * w), par.hour, par.minute);
      if (at.getTime() > now.getTime()) out.push({ id: `${REMINDER_PREFIX}parent-${ymd(at)}`, at, kind: 'parent', title: copy.parentTitle, body: copy.parentBody });
    }
  }
  return out.sort((a, b) => a.at.getTime() - b.at.getTime());
}

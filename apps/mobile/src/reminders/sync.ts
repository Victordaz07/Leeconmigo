import { dayKey } from '@lee-conmigo/session-engine';
import { loadReminderSettings, progressStoreFor, type ChildProfile } from '../app-state';
import { planReminders } from './plan';
import { syncScheduled } from './scheduler';
import type { ReminderSettings } from './model';

/** ¿Ya leyó hoy? (al menos un minuto de lectura válida). */
export function readToday(profileId: string, now: Date = new Date()): boolean {
  const today = dayKey(now);
  return progressStoreFor(profileId).summaries().some((s) => dayKey(new Date(s.completedAt)) === today && s.validReadingSeconds >= 60);
}

/** Vuelve a programar los avisos con lo guardado (al abrir la app, al volver a ella y al terminar una sesión). */
export function syncReminders(profiles: ChildProfile[], settings: ReminderSettings = loadReminderSettings(), now: Date = new Date()): Promise<void> {
  const lang = profiles[0]?.language === 'en' ? 'en' : 'es';
  return syncScheduled(planReminders({ settings, profiles: profiles.map((p) => ({ id: p.id, name: p.name })), lang, now, readToday: (id) => readToday(id, now) }));
}

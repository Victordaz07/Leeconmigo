import { describe, expect, it } from 'vitest';
import { childReminderOf, defaultChildReminder, emptyReminders, isReminderSettings, setChildReminder, setParentReminder, timeLabel, anyReminderOn } from '../src/reminders/model';
import { CHILD_HORIZON_DAYS, REMINDER_PREFIX, planReminders } from '../src/reminders/plan';

// miércoles 21 de octubre de 2026, 15:00
const NOW = new Date(2026, 9, 21, 15, 0, 0);
const noah = [{ id: 'noah', name: 'Noah' }];
const on = (s = emptyReminders()) => setChildReminder(s, 'noah', { enabled: true });

describe('modelo', () => {
  it('por defecto todo está apagado y es válido', () => {
    const s = emptyReminders();
    expect(isReminderSettings(s)).toBe(true);
    expect(anyReminderOn(s)).toBe(false);
    expect(childReminderOf(s, 'x')).toEqual(defaultChildReminder());
  });
  it('rechaza lo mal formado', () => {
    expect(isReminderSettings(null)).toBe(false);
    expect(isReminderSettings({ ...emptyReminders(), format: 2 })).toBe(false);
    expect(isReminderSettings(setChildReminder(emptyReminders(), 'a', { hour: 25 }))).toBe(false);
    expect(isReminderSettings(setChildReminder(emptyReminders(), 'a', { days: [true] }))).toBe(false);
    expect(isReminderSettings(setParentReminder(emptyReminders(), { weekday: 7 }))).toBe(false);
  });
  it('anyReminderOn y la hora con dos dígitos', () => {
    expect(anyReminderOn(on())).toBe(true);
    expect(anyReminderOn(setParentReminder(emptyReminders(), { enabled: true }))).toBe(true);
    expect(timeLabel(7, 5)).toBe('07:05');
  });
});

describe('planReminders', () => {
  const plan = (s = on(), over: Partial<Parameters<typeof planReminders>[0]> = {}) => planReminders({ settings: s, profiles: noah, lang: 'es', now: NOW, readToday: () => false, ...over });
  it('apagado no programa nada', () => {
    expect(plan(emptyReminders())).toEqual([]);
  });
  it('programa solo los días elegidos y a futuro', () => {
    const r = plan(); // L–V a las 16:30; hoy es miércoles 15:00 → mié, jue, vie, lun, mar
    expect(r.map((x) => x.at.getDay())).toEqual([3, 4, 5, 1, 2]);
    expect(r.every((x) => x.at.getTime() > NOW.getTime() && x.at.getHours() === 16 && x.at.getMinutes() === 30)).toBe(true);
    expect(r.every((x) => x.id.startsWith(REMINDER_PREFIX))).toBe(true);
    expect(new Set(r.map((x) => x.id)).size).toBe(r.length);
  });
  it('si la hora de hoy ya pasó, hoy no se programa', () => {
    const late = new Date(2026, 9, 21, 17, 0, 0);
    expect(plan(on(), { now: late }).some((x) => x.at.getDate() === 21)).toBe(false);
  });
  it('si hoy ya leyó, no avisa hoy pero sí mañana', () => {
    const r = plan(on(), { readToday: () => true });
    expect(r.some((x) => x.at.getDate() === 21)).toBe(false);
    expect(r.some((x) => x.at.getDate() === 22)).toBe(true);
  });
  it('nunca pasa del horizonte de una semana', () => {
    const everyDay = setChildReminder(on(), 'noah', { days: [true, true, true, true, true, true, true] });
    const r = plan(everyDay);
    expect(r.length).toBeLessThanOrEqual(CHILD_HORIZON_DAYS);
    expect(Math.max(...r.map((x) => x.at.getTime()))).toBeLessThan(NOW.getTime() + CHILD_HORIZON_DAYS * 86_400_000);
  });
  it('el mensaje es amable, sin nombre con un solo niño y con nombre si hay varios', () => {
    const one = plan()[0]!;
    expect(one.body).not.toContain('Noah');
    expect(one.body).not.toMatch(/racha|perdiste|olvidaste|no has/i);
    const two = planReminders({ settings: on(), profiles: [...noah, { id: 'mia', name: 'Mía' }], lang: 'es', now: NOW, readToday: () => false })[0]!;
    expect(two.body.startsWith('Noah: ')).toBe(true);
  });
  it('el resumen del padre: las próximas dos semanas, solo a futuro', () => {
    const s = setParentReminder(emptyReminders(), { enabled: true, weekday: 6, hour: 18, minute: 0 }); // domingo 18:00
    const r = plan(s);
    expect(r).toHaveLength(2);
    expect(r.every((x) => x.kind === 'parent' && x.at.getDay() === 0 && x.at.getHours() === 18)).toBe(true);
    expect(r[0]!.at.getDate()).toBe(25);
    expect(r[1]!.at.getDate()).toBe(1);
    const sundayLate = new Date(2026, 9, 25, 19, 0, 0);
    expect(plan(s, { now: sundayLate })[0]!.at.getDate()).toBe(1);
  });
  it('en inglés usa los textos en inglés', () => {
    expect(plan(on(), { lang: 'en' })[0]!.body).toMatch(/story|adventure|reading|kite|read/i);
  });
});

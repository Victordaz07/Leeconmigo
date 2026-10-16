/**
 * I. Reloj (1.MD.3, 2.MD.7, 3.MD.1). La hora es un solo número: minutos desde las 12:00 (0–719). Las dos agujas salen
 * de él (horario = hora·30° + minutos·0.5°): nunca se guardan ángulos sueltos que puedan contradecirse.
 */
import { isInt, num, pick, result, type FamilyDef } from './common.ts';

export const DAY = 720;
export const wrap = (m: number) => ((m % DAY) + DAY) % DAY;
/** Hora del reloj (1–12) y minuto. */
export const clockParts = (m: number) => {
  const w = wrap(m);
  const h = Math.floor(w / 60);
  return { hour: h === 0 ? 12 : h, minute: w % 60 };
};
/** Ángulos desde las 12, en sentido horario. */
export const clockAngles = (m: number) => {
  const w = wrap(m);
  return { minute: (w % 60) * 6, hour: Math.floor(w / 60) * 30 + (w % 60) * 0.5 };
};
const at = (hour: number, minute: number) => wrap((hour % 12) * 60 + minute);

export const clock: FamilyDef<'clock'> = {
  kind: 'clock',
  fields: (m) => (m.task === 'read' ? ['hour', 'minute'] : []),
  init: (m) => ({ kind: 'clock', minutes: m.task === 'read' ? m.time : m.task === 'elapsed' ? m.time : 0, values: {} }),
  solution: (m) => {
    const end = m.task === 'elapsed' ? wrap(m.time + m.duration) : m.time;
    const p = clockParts(end);
    return { kind: 'clock', minutes: end, values: m.task === 'read' ? { hour: String(p.hour), minute: String(p.minute) } : {} };
  },
  apply(m, w, a) {
    if (m.task === 'read' || a.type !== 'shiftTime' || !isInt(a.minutes) || a.minutes === 0) return w;
    return { ...w, minutes: wrap(w.minutes + a.minutes) };
  },
  evaluate(m, w) {
    if (m.task === 'read') {
      const h = num(w.values.hour);
      const mi = num(w.values.minute);
      if (h === null || mi === null) return result('incomplete', 'common.writeAll');
      const p = clockParts(m.time);
      if (h !== p.hour) return result('incorrect', 'clock.hourHand', { minute: p.minute });
      if (mi !== p.minute) return result('incorrect', 'clock.minuteHand');
      return result('correct', 'clock.explainRead', p);
    }
    const target = m.task === 'elapsed' ? wrap(m.time + m.duration) : m.time;
    const now = clockParts(w.minutes);
    const goal = clockParts(target);
    if (w.minutes === (m.task === 'elapsed' ? m.time : 0)) return result('incomplete', 'clock.move');
    if (now.minute !== goal.minute) return result('incorrect', 'clock.minuteHand');
    if (now.hour !== goal.hour) return result('incorrect', 'clock.hourHand', { minute: goal.minute });
    if (m.task === 'elapsed') {
      const s = clockParts(m.time);
      return result('correct', 'clock.explainElapsed', { startHour: s.hour, startMinute: s.minute, duration: m.duration, hour: goal.hour, minute: goal.minute });
    }
    return result('correct', 'clock.explainSet', goal);
  },
  problems(m) {
    const p: string[] = [];
    if (!isInt(m.time) || m.time < 0 || m.time >= DAY) p.push('hora');
    if (m.task === 'elapsed' && (m.duration <= 0 || m.duration >= 120)) p.push('duración');
    if (m.task === 'set' && m.time === 0) p.push('ya está en las 12');
    if (m.time % m.step !== 0) p.push('paso');
    return p;
  },
  example: (m): Record<string, number> => (m.task === 'elapsed' ? { startHour: 3, startMinute: 40, duration: 30, hour: 4, minute: 10 } : { hour: 2, minute: 30 }),
  templates: [
    { id: 'clock.setHalf', version: 1, skillId: 'g1.md.time', grades: [1, 1], generate: (r) => ({ kind: 'clock', task: 'set', time: at(r.int(1, 11), pick(r, [0, 30] as const)), duration: 0, step: 30 }) },
    { id: 'clock.setFive', version: 1, skillId: 'g2.md.timeFive', grades: [2, 3], generate: (r) => ({ kind: 'clock', task: 'set', time: at(r.int(1, 11), r.int(1, 11) * 5), duration: 0, step: 5 }) },
    { id: 'clock.readFive', version: 1, skillId: 'g2.md.timeFive', grades: [2, 3], generate: (r) => ({ kind: 'clock', task: 'read', time: at(r.int(1, 12), r.int(1, 11) * 5), duration: 0, step: 5 }) },
    {
      id: 'clock.elapsed',
      version: 1,
      skillId: 'g3.md.elapsed',
      grades: [3, 4],
      // Empieza a una hora con minutos y dura 10–55 min: a veces cruza la hora en punto (lo que más cuesta).
      generate: (r) => ({ kind: 'clock', task: 'elapsed', time: at(r.int(1, 10), r.int(2, 10) * 5), duration: r.int(2, 11) * 5, step: 5 }),
    },
  ],
};

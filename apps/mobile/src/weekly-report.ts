/**
 * Informe semanal para padres (Kitewise P5: «una página, exportable a PDF»). Se calcula SOLO con los resúmenes guardados (docs/07): minutos válidos,
 * días con lectura, historias, preguntas, enfoque que dijo el niño y palabras para practicar. Nunca voz ni texto reconocido. Lo que no existe sale
 * vacío; no se inventa nada (por eso no lleva estándares ni «para observar en clase»: eso espera a que un docente los valide).
 */
import type { SessionSummary } from '@lee-conmigo/contracts';
import { dayKey } from '@lee-conmigo/session-engine';

export interface ReportDay {
  /** Lun–Dom. */
  label: string;
  minutes: number;
}

export interface ReportStory {
  storyId: string;
  minutes: number;
  completed: boolean;
  /** 0–1: lo más lejos que llegó esta semana. */
  completion: number;
}

export interface WeeklyReport {
  /** Lunes y domingo de la semana (fecha local). */
  monday: Date;
  sunday: Date;
  days: ReportDay[];
  totalMinutes: number;
  /** Días de la semana con algo de lectura válida (0–7). */
  activeDays: number;
  /** Días que llegó a la meta diaria. */
  goalDays: number;
  goalMinutes: number;
  sessions: number;
  stories: ReportStory[];
  comprehensionCorrect: number;
  comprehensionTotal: number;
  /** Cuántas veces eligió cada carita de enfoque (1 = me costó, 3 = muy concentrado). */
  focus: { 1: number; 2: number; 3: number };
  /** Palabras que necesitaron ayuda esta semana, sin repetir, para practicar juntos. */
  words: string[];
}

const LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/** `now` cae en la semana (lunes–domingo) que se reporta; `weeksAgo` = 1 reporta la anterior. */
export function weeklyReport(summaries: SessionSummary[], goalMinutes: number, now: Date = new Date(), weeksAgo = 0): WeeklyReport {
  const monday = addDays(now, -((now.getDay() + 6) % 7) - 7 * weeksAgo);
  const keys = LABELS.map((_, i) => dayKey(addDays(monday, i)));
  const inWeek = summaries.filter((s) => keys.includes(dayKey(new Date(s.completedAt))));
  const secondsByDay = new Map<string, number>();
  const byStory = new Map<string, { seconds: number; completed: boolean; completion: number; last: string }>();
  const focus = { 1: 0, 2: 0, 3: 0 };
  const words: string[] = [];
  let correct = 0;
  let total = 0;
  for (const s of inWeek) {
    const k = dayKey(new Date(s.completedAt));
    secondsByDay.set(k, (secondsByDay.get(k) ?? 0) + s.validReadingSeconds);
    correct += s.comprehensionCorrect;
    total += s.comprehensionTotal;
    if (s.focusSelfReport) focus[s.focusSelfReport] += 1;
    words.push(...s.wordsHelped);
    const a = byStory.get(s.storyId) ?? { seconds: 0, completed: false, completion: 0, last: s.completedAt };
    a.seconds += s.validReadingSeconds;
    a.completed ||= s.completion >= 1;
    a.completion = Math.max(a.completion, s.completion);
    if (s.completedAt > a.last) a.last = s.completedAt;
    byStory.set(s.storyId, a);
  }
  const days = LABELS.map((label, i) => ({ label, minutes: Math.round((secondsByDay.get(keys[i]!) ?? 0) / 60) }));
  const stories = [...byStory.entries()]
    .sort((a, b) => b[1].last.localeCompare(a[1].last))
    .map(([storyId, a]) => ({ storyId, minutes: Math.round(a.seconds / 60), completed: a.completed, completion: a.completion }));
  return {
    monday,
    sunday: addDays(monday, 6),
    days,
    totalMinutes: days.reduce((n, d) => n + d.minutes, 0),
    activeDays: keys.filter((k) => (secondsByDay.get(k) ?? 0) >= 30).length,
    goalDays: keys.filter((k) => Math.round((secondsByDay.get(k) ?? 0) / 60) >= goalMinutes).length,
    goalMinutes,
    sessions: inWeek.length,
    stories,
    comprehensionCorrect: correct,
    comprehensionTotal: total,
    focus,
    words: [...new Set(words)],
  };
}

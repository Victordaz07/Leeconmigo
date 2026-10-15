/**
 * "Hoy con {niño}" del Modo padres (Kitewise P2): lo que hizo HOY, calculado solo con los resúmenes guardados (docs/07:
 * nunca audio ni texto reconocido). Si un dato no existe, sale vacío o `null` — nunca se inventa (la pantalla lo dice).
 */
import type { SessionSummary } from '@lee-conmigo/contracts';
import { computeProgressStats, dayKey, type WeekDay } from './progress-data.ts';

export interface TodayActivity {
  storyId: string;
  /** Minutos de lectura válida de hoy en esa historia (redondeados; 0 si fue menos de medio minuto). */
  minutes: number;
  /** ¿La terminó hoy al menos una vez? */
  completed: boolean;
  /** 0–1: lo más lejos que llegó hoy. */
  completion: number;
}

export interface TodayReport {
  validMinutes: number;
  goalMinutes: number;
  comprehensionCorrect: number;
  comprehensionTotal: number;
  /** La última autoevaluación de enfoque de hoy (B13), o `null` si no la dio. */
  focusSelfReport: 1 | 2 | 3 | null;
  /** Con qué energía llegó hoy (B2), o `null` si no se preguntó. */
  energy: 'alta' | 'normal' | 'baja' | null;
  /** Lo que leyó hoy, lo más reciente primero. */
  activities: TodayActivity[];
  /** Palabras que hoy necesitaron ayuda (para practicar juntos), sin repetir. */
  wordsToday: string[];
  /** La semana (lunes–domingo) con los minutos de cada día. */
  week: WeekDay[];
}

export function todayReport(summaries: SessionSummary[], goalMinutes: number, now: Date = new Date()): TodayReport {
  const today = dayKey(now);
  const todays = summaries.filter((s) => dayKey(new Date(s.completedAt)) === today);
  const byStory = new Map<string, { seconds: number; completed: boolean; completion: number; last: string }>();
  let seconds = 0;
  let correct = 0;
  let total = 0;
  let focus: TodayReport['focusSelfReport'] = null;
  let energy: TodayReport['energy'] = null;
  const words: string[] = [];
  for (const s of todays) {
    seconds += s.validReadingSeconds;
    correct += s.comprehensionCorrect;
    total += s.comprehensionTotal;
    if (s.focusSelfReport) focus = s.focusSelfReport;
    if (s.energy && !energy) energy = s.energy;
    words.push(...s.wordsHelped);
    const a = byStory.get(s.storyId) ?? { seconds: 0, completed: false, completion: 0, last: s.completedAt };
    a.seconds += s.validReadingSeconds;
    a.completed ||= s.completion >= 1;
    a.completion = Math.max(a.completion, s.completion);
    if (s.completedAt > a.last) a.last = s.completedAt;
    byStory.set(s.storyId, a);
  }
  const activities = [...byStory.entries()]
    .sort((a, b) => b[1].last.localeCompare(a[1].last))
    .map(([storyId, a]) => ({ storyId, minutes: Math.round(a.seconds / 60), completed: a.completed, completion: a.completion }));
  return {
    validMinutes: Math.round(seconds / 60),
    goalMinutes,
    comprehensionCorrect: correct,
    comprehensionTotal: total,
    focusSelfReport: focus,
    energy,
    activities,
    wordsToday: [...new Set(words)],
    week: computeProgressStats(summaries, now).week,
  };
}

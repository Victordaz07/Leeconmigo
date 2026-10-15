/**
 * Estadísticas REALES de "Mi progreso", calculadas a partir de los resúmenes guardados (docs/07: son los únicos
 * datos que existen; nunca audio ni texto reconocido). Antes esta pantalla mostraba datos de relleno del
 * prototipo ("Alex", 89 % fijo…) — esto es lo que los sustituye, con lo que de verdad hay guardado.
 *
 * "Precisión" aquí es la de COMPRENSIÓN (aciertos de las preguntas / preguntas hechas): es lo único preciso que
 * se puede calcular de los resúmenes guardados, porque el error de pronunciación de una sesión ya vieja no se
 * conserva (solo las estrellas 1–3 que salieron de él, docs/07 "Qué SÍ se puede guardar").
 */
import type { LanguageCode, SessionSummary } from '@lee-conmigo/contracts';

export interface WeekDay {
  /** Lun–Dom. */
  day: string;
  minutes: number;
}

export interface ProgressStats {
  /** Historias distintas con al menos una lectura completa. */
  storiesRead: number;
  /** Suma de todo el tiempo de lectura VÁLIDA guardado, en minutos. */
  totalMinutes: number;
  /** 0–100: aciertos de comprensión a la primera / preguntas contestadas. 100 si todavía no hay ninguna (no castiga). */
  comprehensionAccuracy: number;
  /** Días seguidos (hasta hoy o ayer) con algo de lectura válida. */
  streakDays: number;
  /** Mejor cantidad de estrellas de cada historia terminada, sumadas. */
  starsTotal: number;
  /** La semana de calendario (lunes–domingo) que contiene `now`. */
  week: WeekDay[];
  /** Claves de vocabulario que costaron, sin repetir, de la más reciente a la más antigua. */
  practicedWords: string[];
  /** Idiomas en los que se ha leído al menos una vez. */
  languagesUsed: LanguageCode[];
  /** Días de calendario distintos (no necesariamente seguidos) con lectura válida. */
  activeDays: number;
  /** Categorías distintas de historias TERMINADAS (para el logro "Aventurero", docs/01). */
  categoriesRead: string[];
  /**
   * Palabras que costaron en una sesión y ya NO aparecieron entre las que costaron la última vez que se
   * terminó la MISMA historia otra vez (docs/03 "Vocabulario personal": "se lee bien varias veces"). Sin
   * relectura de una historia no hay forma honesta de saber si una palabra se dominó, así que la lista sale
   * vacía hasta entonces — nunca se inventa un dato que no está guardado (docs/07).
   */
  masteredWords: string[];
}

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** Día del calendario en formato `YYYY-MM-DD`, en hora LOCAL (no UTC: un resumen de las 11 de la noche no debe caer en otro día). */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 0 = lunes … 6 = domingo (a diferencia de `Date.getDay()`, que empieza en domingo). */
function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/**
 * Palabras "dominadas": costaron en la primera vez que se terminó una historia y ya no aparecieron entre las
 * que costaron la última vez que se terminó esa MISMA historia otra vez. Sin al menos 2 lecturas completas de
 * una historia no hay nada que comparar, así que esas historias no aportan ninguna palabra dominada.
 */
function masteredWordsOf(summaries: SessionSummary[]): string[] {
  const completedByStory = new Map<string, SessionSummary[]>();
  for (const s of summaries) {
    if (s.completion < 1) continue;
    const list = completedByStory.get(s.storyId) ?? [];
    list.push(s);
    completedByStory.set(s.storyId, list);
  }
  const mastered = new Set<string>();
  for (const list of completedByStory.values()) {
    if (list.length < 2) continue;
    const sorted = [...list].sort((a, b) => a.completedAt.localeCompare(b.completedAt));
    const first = sorted[0];
    const lastHelped = new Set(sorted[sorted.length - 1].wordsHelped);
    for (const w of first.wordsHelped) if (!lastHelped.has(w)) mastered.add(w);
  }
  return [...mastered];
}

export function computeProgressStats(summaries: SessionSummary[], now: Date = new Date()): ProgressStats {
  const validMinutesByDay = new Map<string, number>();
  const languagesUsed = new Set<LanguageCode>();
  const bestStarsByStory = new Map<string, number>();
  const completedStories = new Set<string>();
  const categoriesRead = new Set<string>();
  let totalValidSeconds = 0;
  let comprehensionCorrect = 0;
  let comprehensionTotal = 0;
  const practiced: string[] = []; // se recorre de más antiguo a más reciente; al final se invierte

  for (const s of summaries) {
    totalValidSeconds += s.validReadingSeconds;
    comprehensionCorrect += s.comprehensionCorrect;
    comprehensionTotal += s.comprehensionTotal;
    languagesUsed.add(s.language);
    if (s.completion >= 1) {
      completedStories.add(s.storyId);
      if (s.stars) bestStarsByStory.set(s.storyId, Math.max(bestStarsByStory.get(s.storyId) ?? 0, s.stars));
      if (s.category) categoriesRead.add(s.category);
    }
    const key = dayKey(new Date(s.completedAt));
    validMinutesByDay.set(key, (validMinutesByDay.get(key) ?? 0) + s.validReadingSeconds / 60);
    for (const w of s.wordsHelped) practiced.push(w);
  }

  // La semana de calendario (lunes–domingo) que contiene `now`.
  const monday = addDays(now, -mondayIndex(now));
  const week: WeekDay[] = WEEKDAY_LABELS.map((day, i) => {
    const minutes = validMinutesByDay.get(dayKey(addDays(monday, i))) ?? 0;
    return { day, minutes: Math.round(minutes) };
  });

  // Racha: días seguidos con lectura, contando hacia atrás desde hoy (o desde ayer, si hoy aún no se ha leído).
  let streakDays = 0;
  if (validMinutesByDay.size > 0) {
    let cursor = validMinutesByDay.has(dayKey(now)) ? now : addDays(now, -1);
    while (validMinutesByDay.has(dayKey(cursor))) {
      streakDays++;
      cursor = addDays(cursor, -1);
    }
  }

  return {
    storiesRead: completedStories.size,
    totalMinutes: Math.round(totalValidSeconds / 60),
    comprehensionAccuracy: comprehensionTotal > 0 ? Math.round((comprehensionCorrect / comprehensionTotal) * 100) : 100,
    streakDays,
    starsTotal: [...bestStarsByStory.values()].reduce((a, b) => a + b, 0),
    week,
    practicedWords: [...new Set(practiced.reverse())],
    languagesUsed: [...languagesUsed],
    activeDays: validMinutesByDay.size,
    categoriesRead: [...categoriesRead],
    masteredWords: masteredWordsOf(summaries),
  };
}

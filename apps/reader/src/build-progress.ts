/**
 * Convierte `computeProgressStats` (session-engine, solo datos que ya se guardan — docs/07) en el `ProgressData`
 * que pide la pantalla "Mi progreso" (`packages/ui/src/screens/progress.tsx`). Antes esta pantalla mostraba
 * `demoProgress` (relleno del prototipo, "Alex" con 89 % fijo); esto es lo que lo sustituye con datos reales.
 *
 * Logros (docs/01 "Motivación"): los 7 nombrados ya se calculan honestamente de los `SessionSummary` guardados.
 * "Aventurero" cuenta categorías distintas entre historias TERMINADAS (`SessionSummary.category`, docs/07: es
 * metadato de contenido, no dato del niño). "Nueva palabra dominada" compara, historia por historia, las
 * palabras que costaron la PRIMERA vez que se terminó contra las que costaron la ÚLTIMA vez — solo aparece tras
 * releer una historia completa; sin eso, `stats.masteredWords` sale vacío y el logro queda bloqueado, no se
 * inventa un desbloqueo sin datos reales detrás.
 */
import type { ProgressStats } from '@lee-conmigo/session-engine';
import type { ProgressBadge, ProgressData } from '@lee-conmigo/ui';

/** Días de calendario distintos con lectura para considerar "regresaste por más" (docs/01: "7 días distintos"). */
const RETURN_DAYS = 7;
/** Historias distintas terminadas para "Explorador" (docs/01). */
const EXPLORER_STORIES = 5;
/** Minutos válidos acumulados para "15 minutos reales" (docs/01). */
const REAL_MINUTES_BADGE = 15;
/** Categorías distintas terminadas para "Aventurero" (docs/01). */
const ADVENTURER_CATEGORIES = 5;

export function buildProgressData(childName: string, stats: ProgressStats, dailyGoalMinutes: number): ProgressData {
  const badgeDefs: Array<{ label: string; icon: string; tone: Exclude<ProgressBadge['tone'], 'locked'>; unlocked: boolean }> = [
    { label: 'Primer capítulo', icon: '1', tone: 'violet', unlocked: stats.storiesRead >= 1 },
    { label: 'Explorador', icon: '5', tone: 'coral', unlocked: stats.storiesRead >= EXPLORER_STORIES },
    { label: 'Dos idiomas', icon: '🌐', tone: 'gold', unlocked: stats.languagesUsed.length >= 2 },
    { label: '15 minutos reales', icon: '15', tone: 'violet', unlocked: stats.totalMinutes >= REAL_MINUTES_BADGE },
    { label: 'Regresaste por más', icon: '7', tone: 'coral', unlocked: stats.activeDays >= RETURN_DAYS },
    { label: 'Aventurero', icon: '🧭', tone: 'coral', unlocked: stats.categoriesRead.length >= ADVENTURER_CATEGORIES },
    { label: 'Nueva palabra dominada', icon: '🏅', tone: 'gold', unlocked: stats.masteredWords.length >= 1 },
  ];
  const badges: ProgressBadge[] = badgeDefs.map((b) => ({ label: b.label, icon: b.icon, tone: b.unlocked ? b.tone : 'locked' }));

  return {
    childName,
    starsTotal: stats.starsTotal,
    storiesRead: stats.storiesRead,
    totalMinutes: stats.totalMinutes,
    accuracy: stats.comprehensionAccuracy,
    streakDays: stats.streakDays,
    dailyGoalMinutes,
    week: stats.week,
    practicedWords: stats.practicedWords,
    badges,
  };
}

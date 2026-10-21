import type { MathLang } from '@lee-conmigo/ui-core';
import type { AchievementId } from './achievements';

/** Textos de Logros (ES/EN). Celebran lo que el niño hizo; lo que falta se dice como una invitación, nunca como un reproche. */
export interface AchievementsCopy {
  title: string;
  back: string;
  count: (n: number, total: number) => string;
  intro: string;
  empty: string;
  earned: string;
  badges: Record<AchievementId, { name: string; earned: string; hint: string }>;
  progress: (have: number, need: number) => string;
}

const ES: AchievementsCopy = {
  title: 'Tus logros',
  back: 'Volver',
  count: (n, t) => `${n} de ${t}`,
  intro: 'Estas pegatinas celebran que sigues, que exploras y que lo intentas. No hay prisa: llegan solas.',
  empty: 'Todavía no tienes pegatinas. La primera llega cuando termines una historia.',
  earned: 'Ganada',
  badges: {
    firstChapter: { name: 'Primer capítulo', earned: 'Terminaste tu primera historia.', hint: 'Termina una historia.' },
    explorer: { name: 'Explorador', earned: 'Leíste cinco historias distintas.', hint: 'Lee cinco historias distintas.' },
    twoLanguages: { name: 'Dos idiomas', earned: 'Leíste en español y en inglés.', hint: 'Lee en dos idiomas.' },
    real15: { name: '15 minutos reales', earned: 'Juntaste 15 minutos de lectura de verdad.', hint: 'Junta 15 minutos de lectura.' },
    cameBack: { name: 'Regresaste por más', earned: 'Volviste a leer en siete días distintos.', hint: 'Vuelve a leer en siete días distintos.' },
    adventurer: { name: 'Aventurero', earned: 'Terminaste historias de cinco tipos distintos.', hint: 'Termina historias de cinco tipos distintos.' },
    newWord: { name: 'Nueva palabra dominada', earned: 'Una palabra que te costaba ya te sale.', hint: 'Vuelve a leer una historia y verás cuáles palabras ya dominas.' },
  },
  progress: (h, n) => `${h} de ${n}`,
};

const EN: AchievementsCopy = {
  title: 'Your achievements',
  back: 'Back',
  count: (n, t) => `${n} of ${t}`,
  intro: 'These stickers celebrate that you keep going, explore and try. No rush: they come on their own.',
  empty: 'You have no stickers yet. The first one comes when you finish a story.',
  earned: 'Earned',
  badges: {
    firstChapter: { name: 'First chapter', earned: 'You finished your first story.', hint: 'Finish a story.' },
    explorer: { name: 'Explorer', earned: 'You read five different stories.', hint: 'Read five different stories.' },
    twoLanguages: { name: 'Two languages', earned: 'You read in Spanish and in English.', hint: 'Read in two languages.' },
    real15: { name: '15 real minutes', earned: 'You collected 15 minutes of real reading.', hint: 'Collect 15 minutes of reading.' },
    cameBack: { name: 'You came back for more', earned: 'You read again on seven different days.', hint: 'Read again on seven different days.' },
    adventurer: { name: 'Adventurer', earned: 'You finished stories of five different kinds.', hint: 'Finish stories of five different kinds.' },
    newWord: { name: 'New word mastered', earned: 'A word that was hard for you now comes easily.', hint: 'Read a story again and you will see which words you now know.' },
  },
  progress: (h, n) => `${h} of ${n}`,
};

export const ACHIEVEMENTS_COPY: Record<MathLang, AchievementsCopy> = { es: ES, en: EN };

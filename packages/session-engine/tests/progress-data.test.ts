/**
 * `computeProgressStats`: los números REALES de "Mi progreso" (docs/07: solo lo que ya se guarda de las sesiones).
 * El jueves 2026-09-24 a las 18:00 es el "hoy" de referencia en estas pruebas (un jueves, para probar la semana
 * y la racha sin ambigüedad).
 */
import { describe, expect, it } from 'vitest';
import type { SessionSummary } from '@lee-conmigo/contracts';
import { computeProgressStats } from '../src/progress-data.ts';

const NOW = new Date('2026-09-24T18:00:00'); // jueves, hora local

const summary = (over: Partial<SessionSummary> & Pick<SessionSummary, 'storyId' | 'completedAt'>): SessionSummary => ({
  language: 'es',
  level: 1,
  validReadingSeconds: 0,
  sessionSeconds: 0,
  comprehensionCorrect: 0,
  comprehensionTotal: 0,
  wordsHelped: [],
  completion: 0,
  ...over,
});

describe('computeProgressStats: sin ninguna sesión', () => {
  it('todo en cero, sin castigar con 0 % de comprensión', () => {
    const s = computeProgressStats([], NOW);
    expect(s).toMatchObject({ storiesRead: 0, totalMinutes: 0, comprehensionAccuracy: 100, streakDays: 0, starsTotal: 0, practicedWords: [], languagesUsed: [], activeDays: 0 });
    expect(s.week).toHaveLength(7);
    expect(s.week.every((d) => d.minutes === 0)).toBe(true);
    expect(s.week.map((d) => d.day)).toEqual(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']);
  });
});

describe('computeProgressStats: historias, minutos, estrellas', () => {
  it('cuenta historias TERMINADAS (completion 1) y suma el tiempo válido de TODAS las sesiones, aunque no terminen', () => {
    const s = computeProgressStats([
      summary({ storyId: 'a', completedAt: NOW.toISOString(), completion: 1, validReadingSeconds: 300, stars: 3 }),
      summary({ storyId: 'b', completedAt: NOW.toISOString(), completion: 0.4, validReadingSeconds: 120 }), // a medias: no cuenta como leída
    ]);
    expect(s.storiesRead).toBe(1);
    expect(s.totalMinutes).toBe(7); // (300+120)/60 = 7
  });

  it('la misma historia terminada dos veces: se cuenta UNA vez, con la MEJOR cantidad de estrellas', () => {
    const s = computeProgressStats([
      summary({ storyId: 'a', completedAt: NOW.toISOString(), completion: 1, validReadingSeconds: 60, stars: 1 }),
      summary({ storyId: 'a', completedAt: NOW.toISOString(), completion: 1, validReadingSeconds: 60, stars: 3 }),
    ]);
    expect(s.storiesRead).toBe(1);
    expect(s.starsTotal).toBe(3); // no 1+3=4: se queda con la mejor de esa historia
  });

  it('dos historias distintas terminadas: las estrellas de cada una se SUMAN', () => {
    const s = computeProgressStats([
      summary({ storyId: 'a', completedAt: NOW.toISOString(), completion: 1, stars: 2 }),
      summary({ storyId: 'b', completedAt: NOW.toISOString(), completion: 1, stars: 3 }),
    ]);
    expect(s.starsTotal).toBe(5);
  });
});

describe('computeProgressStats: comprensión', () => {
  it('suma aciertos y preguntas de TODAS las sesiones antes de sacar el porcentaje (no promedia porcentajes sueltos)', () => {
    const s = computeProgressStats([
      summary({ storyId: 'a', completedAt: NOW.toISOString(), comprehensionCorrect: 1, comprehensionTotal: 2 }), // 50 %
      summary({ storyId: 'b', completedAt: NOW.toISOString(), comprehensionCorrect: 3, comprehensionTotal: 3 }), // 100 %
    ]);
    expect(s.comprehensionAccuracy).toBe(80); // 4 de 5, no el promedio (50+100)/2=75
  });
});

describe('computeProgressStats: palabras practicadas', () => {
  it('sin repetidos, de la más reciente a la más antigua', () => {
    const s = computeProgressStats([
      summary({ storyId: 'a', completedAt: '2026-09-20T10:00:00', wordsHelped: ['puerta', 'montaña'] }),
      summary({ storyId: 'b', completedAt: '2026-09-22T10:00:00', wordsHelped: ['montaña', 'sendero'] }),
    ]);
    expect(s.practicedWords).toEqual(['sendero', 'montaña', 'puerta']);
  });
});

describe('computeProgressStats: categorías leídas (logro "Aventurero")', () => {
  it('junta las categorías de historias TERMINADAS, sin repetir; ignora las a medias y las sin categoría', () => {
    const s = computeProgressStats([
      summary({ storyId: 'a', completedAt: NOW.toISOString(), completion: 1, category: 'misterio' }),
      summary({ storyId: 'b', completedAt: NOW.toISOString(), completion: 1, category: 'amistad' }),
      summary({ storyId: 'c', completedAt: NOW.toISOString(), completion: 1, category: 'misterio' }), // repetida
      summary({ storyId: 'd', completedAt: NOW.toISOString(), completion: 0.5, category: 'oficios' }), // a medias: no cuenta
      summary({ storyId: 'e', completedAt: NOW.toISOString(), completion: 1 }), // sin categoría: se ignora
    ]);
    expect(s.categoriesRead.sort()).toEqual(['amistad', 'misterio']);
  });
});

describe('computeProgressStats: palabras dominadas (logro "Nueva palabra dominada")', () => {
  it('sin releer ninguna historia completa, no hay ninguna palabra dominada', () => {
    const s = computeProgressStats([summary({ storyId: 'a', completedAt: NOW.toISOString(), completion: 1, wordsHelped: ['puerta'] })]);
    expect(s.masteredWords).toEqual([]);
  });

  it('una palabra que costó la primera vez y ya no cuesta la última vez que se termina la MISMA historia: dominada', () => {
    const s = computeProgressStats([
      summary({ storyId: 'a', completedAt: '2026-09-01T10:00:00', completion: 1, wordsHelped: ['puerta', 'montaña'] }),
      summary({ storyId: 'a', completedAt: '2026-09-10T10:00:00', completion: 1, wordsHelped: ['montaña'] }),
    ]);
    expect(s.masteredWords).toEqual(['puerta']); // "montaña" TODAVÍA cuesta la última vez: no dominada
  });

  it('la misma palabra en OTRA historia distinta no cuenta: hay que releer la MISMA historia', () => {
    const s = computeProgressStats([
      summary({ storyId: 'a', completedAt: NOW.toISOString(), completion: 1, wordsHelped: ['puerta'] }),
      summary({ storyId: 'b', completedAt: NOW.toISOString(), completion: 1, wordsHelped: [] }),
    ]);
    expect(s.masteredWords).toEqual([]);
  });
});

describe('computeProgressStats: idiomas', () => {
  it('junta los idiomas en los que se ha leído, sin repetir', () => {
    const s = computeProgressStats([
      summary({ storyId: 'a', completedAt: NOW.toISOString(), language: 'es' }),
      summary({ storyId: 'b', completedAt: NOW.toISOString(), language: 'en' }),
      summary({ storyId: 'c', completedAt: NOW.toISOString(), language: 'es' }),
    ]);
    expect(s.languagesUsed.sort()).toEqual(['en', 'es']);
  });
});

describe('computeProgressStats: semana de calendario (lunes–domingo)', () => {
  it('reparte los minutos en el día de la semana que les toca, sin importar la hora del día', () => {
    const s = computeProgressStats(
      [
        summary({ storyId: 'a', completedAt: '2026-09-21T23:50:00', validReadingSeconds: 480 }), // lunes tarde: 8 min
        summary({ storyId: 'b', completedAt: '2026-09-24T07:00:00', validReadingSeconds: 600 }), // jueves temprano: 10 min
      ],
      NOW,
    );
    const byDay = Object.fromEntries(s.week.map((d) => [d.day, d.minutes]));
    expect(byDay).toEqual({ Lun: 8, Mar: 0, Mié: 0, Jue: 10, Vie: 0, Sáb: 0, Dom: 0 });
  });

  it('una sesión de la semana pasada NO aparece en la semana actual', () => {
    const s = computeProgressStats([summary({ storyId: 'a', completedAt: '2026-09-14T12:00:00', validReadingSeconds: 600 })], NOW);
    expect(s.week.every((d) => d.minutes === 0)).toBe(true);
    expect(s.totalMinutes).toBe(10); // pero sigue contando en el total de siempre
  });
});

describe('computeProgressStats: racha', () => {
  it('cuenta hacia atrás desde HOY si ya se leyó hoy', () => {
    const s = computeProgressStats(
      [
        summary({ storyId: 'a', completedAt: '2026-09-24T09:00:00' }), // hoy (jueves)
        summary({ storyId: 'b', completedAt: '2026-09-23T09:00:00' }), // ayer
        summary({ storyId: 'c', completedAt: '2026-09-22T09:00:00' }), // antier
      ],
      NOW,
    );
    expect(s.streakDays).toBe(3);
  });

  it('si hoy todavía no se ha leído, cuenta desde AYER (no rompe la racha a medio día)', () => {
    const s = computeProgressStats(
      [summary({ storyId: 'a', completedAt: '2026-09-23T09:00:00' }), summary({ storyId: 'b', completedAt: '2026-09-22T09:00:00' })],
      NOW,
    );
    expect(s.streakDays).toBe(2);
  });

  it('un día sin lectura corta la racha (solo cuenta lo más reciente y seguido)', () => {
    const s = computeProgressStats(
      [
        summary({ storyId: 'a', completedAt: '2026-09-24T09:00:00' }), // hoy
        summary({ storyId: 'b', completedAt: '2026-09-20T09:00:00' }), // hace días, sin conexión con hoy
      ],
      NOW,
    );
    expect(s.streakDays).toBe(1);
    expect(s.activeDays).toBe(2); // pero los días activos (no seguidos) sí cuentan los dos
  });

  it('sin ninguna sesión hoy ni ayer, la racha es 0', () => {
    const s = computeProgressStats([summary({ storyId: 'a', completedAt: '2026-09-10T09:00:00' })], NOW);
    expect(s.streakDays).toBe(0);
  });
});

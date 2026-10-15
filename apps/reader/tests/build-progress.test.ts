/**
 * `buildProgressData`: mapea `ProgressStats` (session-engine) al `ProgressData` de la pantalla, y decide qué
 * logros están desbloqueados (docs/01 "Motivación") con lo único que se puede calcular honestamente.
 */
import { describe, expect, it } from 'vitest';
import type { ProgressStats } from '@lee-conmigo/session-engine';
import { buildProgressData } from '../src/build-progress.ts';

const baseStats: ProgressStats = {
  storiesRead: 0,
  totalMinutes: 0,
  comprehensionAccuracy: 100,
  streakDays: 0,
  starsTotal: 0,
  week: [],
  practicedWords: [],
  languagesUsed: [],
  activeDays: 0,
  categoriesRead: [],
  masteredWords: [],
};

function badgeTone(data: ReturnType<typeof buildProgressData>, label: string): string {
  const b = data.badges.find((x) => x.label === label);
  if (!b) throw new Error(`no existe la insignia "${label}"`);
  return b.tone;
}

describe('buildProgressData: campos que pasan directo', () => {
  it('usa el nombre, la meta diaria y los números de ProgressStats tal cual', () => {
    const stats: ProgressStats = { ...baseStats, storiesRead: 3, totalMinutes: 42, comprehensionAccuracy: 80, streakDays: 2, starsTotal: 9, practicedWords: ['puerta'] };
    const data = buildProgressData('Noah', stats, 20);
    expect(data.childName).toBe('Noah');
    expect(data.dailyGoalMinutes).toBe(20);
    expect(data.storiesRead).toBe(3);
    expect(data.totalMinutes).toBe(42);
    expect(data.accuracy).toBe(80); // viene de comprehensionAccuracy, no de precisión de pronunciación
    expect(data.streakDays).toBe(2);
    expect(data.starsTotal).toBe(9);
    expect(data.practicedWords).toEqual(['puerta']);
  });
});

describe('buildProgressData: logros', () => {
  it('sin ninguna sesión, todas las insignias salen bloqueadas', () => {
    const data = buildProgressData('Noah', baseStats, 10);
    expect(data.badges).toHaveLength(7);
    expect(data.badges.every((b) => b.tone === 'locked')).toBe(true);
  });

  it('"Primer capítulo" se desbloquea con 1 historia terminada; "Explorador" necesita 5', () => {
    const conUna = buildProgressData('Noah', { ...baseStats, storiesRead: 1 }, 10);
    expect(badgeTone(conUna, 'Primer capítulo')).not.toBe('locked');
    expect(badgeTone(conUna, 'Explorador')).toBe('locked');

    const conCinco = buildProgressData('Noah', { ...baseStats, storiesRead: 5 }, 10);
    expect(badgeTone(conCinco, 'Explorador')).not.toBe('locked');
  });

  it('"Dos idiomas" solo se desbloquea con 2 idiomas usados, no con 1', () => {
    const unIdioma = buildProgressData('Noah', { ...baseStats, languagesUsed: ['es'] }, 10);
    expect(badgeTone(unIdioma, 'Dos idiomas')).toBe('locked');

    const dosIdiomas = buildProgressData('Noah', { ...baseStats, languagesUsed: ['es', 'en'] }, 10);
    expect(badgeTone(dosIdiomas, 'Dos idiomas')).not.toBe('locked');
  });

  it('"15 minutos reales" pide 15 minutos totales exactos o más, no 14', () => {
    const catorce = buildProgressData('Noah', { ...baseStats, totalMinutes: 14 }, 10);
    expect(badgeTone(catorce, '15 minutos reales')).toBe('locked');

    const quince = buildProgressData('Noah', { ...baseStats, totalMinutes: 15 }, 10);
    expect(badgeTone(quince, '15 minutos reales')).not.toBe('locked');
  });

  it('"Regresaste por más" pide 7 días activos DISTINTOS, no necesariamente seguidos (no es la racha)', () => {
    const seisDias = buildProgressData('Noah', { ...baseStats, activeDays: 6, streakDays: 1 }, 10);
    expect(badgeTone(seisDias, 'Regresaste por más')).toBe('locked');

    const sieteDias = buildProgressData('Noah', { ...baseStats, activeDays: 7, streakDays: 1 }, 10);
    expect(badgeTone(sieteDias, 'Regresaste por más')).not.toBe('locked');
  });

  it('"Aventurero" pide 5 categorías distintas TERMINADAS, no 4', () => {
    const cuatro = buildProgressData('Noah', { ...baseStats, categoriesRead: ['misterio', 'amistad', 'oficios', 'fantasia'] }, 10);
    expect(badgeTone(cuatro, 'Aventurero')).toBe('locked');

    const cinco = buildProgressData('Noah', { ...baseStats, categoriesRead: ['misterio', 'amistad', 'oficios', 'fantasia', 'crecimiento'] }, 10);
    expect(badgeTone(cinco, 'Aventurero')).not.toBe('locked');
  });

  it('"Nueva palabra dominada" se desbloquea en cuanto hay al menos una palabra dominada', () => {
    const sinDominar = buildProgressData('Noah', { ...baseStats, masteredWords: [] }, 10);
    expect(badgeTone(sinDominar, 'Nueva palabra dominada')).toBe('locked');

    const unaDominada = buildProgressData('Noah', { ...baseStats, masteredWords: ['puerta'] }, 10);
    expect(badgeTone(unaDominada, 'Nueva palabra dominada')).not.toBe('locked');
  });
});

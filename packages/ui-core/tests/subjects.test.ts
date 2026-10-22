import { describe, expect, it } from 'vitest';
import { NOTEBOOK_TABS, progressSegments, SUBJECTS } from '../src/index.ts';

describe('materias de Kitewise', () => {
  it('siete cuadernos; Lectura, Matemáticas y Sociedad tienen contenido (no se inventan los demás)', () => {
    expect(SUBJECTS.map((s) => s.name)).toEqual(['Lectura', 'Matemáticas', 'Ciencia', 'Sociedad', 'Arte y música', 'Finanzas', 'Mi cuaderno']);
    expect(SUBJECTS.filter((s) => s.available).map((s) => s.id)).toEqual(['lectura', 'mate', 'sociedad']);
    expect(NOTEBOOK_TABS.some((s) => s.id === 'mi-cuaderno')).toBe(false);
  });

  it('progreso en 3 segmentos, nunca porcentaje; algo empezado llena al menos uno', () => {
    expect(progressSegments(0, 10)).toBe(0);
    expect(progressSegments(1, 24)).toBe(1);
    expect(progressSegments(12, 24)).toBe(2);
    expect(progressSegments(23, 24)).toBe(2);
    expect(progressSegments(24, 24)).toBe(3);
    expect(progressSegments(3, 0)).toBe(0);
  });
});

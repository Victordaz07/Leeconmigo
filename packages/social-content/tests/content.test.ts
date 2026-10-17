import { describe, expect, it } from 'vitest';
import { SOCIAL_UNITS, socialUnitById, validateSocialUnit } from '../src/index.ts';

describe('contenido de Sociedad', () => {
  it('s3u03 existe y se encuentra por id', () => {
    expect(socialUnitById('s3u03')?.id).toBe('s3u03');
    expect(socialUnitById('no-existe')).toBeUndefined();
  });

  it('hay una unidad piloto por grado, 1.º a 6.º', () => {
    expect(SOCIAL_UNITS.map((u) => u.grade)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(SOCIAL_UNITS.map((u) => u.id)).size).toBe(6);
  });

  it('todas las unidades pasan la validación automática', () => {
    for (const unit of SOCIAL_UNITS) {
      expect(validateSocialUnit(unit), `${unit.id}: ${validateSocialUnit(unit).join('; ')}`).toEqual([]);
    }
  });

  it('s3u03 tiene las 6 sesiones en orden (pregunta, comparar, fuente, testimonio, explicar, revisar)', () => {
    const unit = socialUnitById('s3u03')!;
    expect(unit.steps.map((s) => s.kind)).toEqual(['pregunta', 'comparar', 'fuente', 'testimonio', 'explicar', 'revisar']);
  });

  it('s3u03 tiene 3 fuentes (mapa, foto, testimonio)', () => {
    const unit = socialUnitById('s3u03')!;
    expect(unit.sources.map((s) => s.kind).sort()).toEqual(['foto', 'mapa', 'testimonio']);
  });

  it('los estándares son borrador y solo para padres', () => {
    const unit = socialUnitById('s3u03')!;
    expect(unit.standardsReview.displayAudience).toBe('parentsOnly');
    expect(unit.standardsReview.isCertified).toBe(false);
  });

  it('detecta una unidad incompleta (falta el inglés del título)', () => {
    const unit = socialUnitById('s3u03')!;
    const broken = { ...unit, title: { es: unit.title.es, en: '' } };
    expect(validateSocialUnit(broken)).toContain(`${unit.id}: falta el título en algún idioma`);
  });

  it('una unidad sin fuentes (razonamiento cívico puro) no necesita "explicar" ni "revisar"', () => {
    const s1u01 = socialUnitById('s1u01')!;
    expect(s1u01.sources).toEqual([]);
    expect(s1u01.steps.some((s) => s.kind === 'explicar')).toBe(false);
    expect(validateSocialUnit(s1u01)).toEqual([]);
  });

  it('detecta un paso "explicar" que pide menos de 2 fuentes', () => {
    const unit = socialUnitById('s3u03')!;
    const steps = unit.steps.map((s) => (s.kind === 'explicar' ? { ...s, minSources: 1 } : s));
    const broken = { ...unit, steps };
    const explicar = broken.steps.find((s) => s.kind === 'explicar')!;
    expect(validateSocialUnit(broken)).toContain(`${explicar.id}: debe pedir al menos 2 fuentes (docs/research/sociedad-investigacion.md §12: usar ≥2 fuentes)`);
  });
});

import { describe, expect, it } from 'vitest';
import { initialSession, socialUnitById } from '@lee-conmigo/social-content';
import { closingStatsFor } from '../src/sociedad-closing';

/**
 * Bug reportado por la cuenta A (Ciencia) tras el PR #3: la tarjeta de cierre mostraba «Fuentes usadas 0/3» y un
 * motivo basado en fuentes en unidades que no tienen ninguna (1.º y 6.º). El contador de fuentes solo debe
 * aparecer cuando la unidad trae fuentes de verdad, y con el denominador real (no un "/3" fijo).
 */
describe('closingStatsFor', () => {
  it('en una unidad SIN fuentes (s1u01), no muestra ningún contador de fuentes', () => {
    const unit = socialUnitById('s1u01')!;
    const stats = closingStatsFor(unit, initialSession, 'es');
    expect(stats).toHaveLength(1);
    expect(stats[0].label).toBe('Pasos');
    expect(stats.some((s) => /fuentes/i.test(s.label))).toBe(false);
  });

  it('en otra unidad SIN fuentes (s6u02), tampoco muestra el contador', () => {
    const unit = socialUnitById('s6u02')!;
    const stats = closingStatsFor(unit, initialSession, 'en');
    expect(stats.some((s) => /sources/i.test(s.label))).toBe(false);
  });

  it('en una unidad CON fuentes (s3u03, 3 fuentes), muestra el contador con el denominador real', () => {
    const unit = socialUnitById('s3u03')!;
    expect(unit.sources.length).toBe(3);
    const session = { ...initialSession, sourcesSelected: ['plano', 'foto'] };
    const stats = closingStatsFor(unit, session, 'es');
    const sourcesStat = stats.find((s) => s.label === 'Fuentes usadas');
    expect(sourcesStat?.value).toBe('2/3');
  });

  it('en una unidad CON fuentes pero solo 2 (s4u03), el denominador es 2, no 3 (el bug original también tenía esto mal)', () => {
    const unit = socialUnitById('s4u03')!;
    expect(unit.sources.length).toBe(2);
    const stats = closingStatsFor(unit, initialSession, 'es');
    const sourcesStat = stats.find((s) => s.label === 'Fuentes usadas');
    expect(sourcesStat?.value).toBe('0/2');
  });
});

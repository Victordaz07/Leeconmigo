import { describe, expect, it } from 'vitest';
import { addDays, EVIDENCE_POLICY, ideaStatus, reviewsDue, STAGE_LABEL, statusByIdea, type EvidenceAttempt } from '../src/index.ts';

let n = 0;
const at = (day: string, contextId: string, over: Partial<EvidenceAttempt> = {}): EvidenceAttempt => ({ ideaId: 'erosion.cobertura', taskId: `t${n++}`, contextId, day, adequate: true, maxHintLevel: 0, ...over });

describe('scienceEvidence.v1', () => {
  it('sin intentos no hay estado; con un intento, «explorando»', () => {
    expect(ideaStatus([]).stage).toBe('none');
    expect(ideaStatus([at('2026-10-16', 'bandejas', { adequate: false })]).stage).toBe('explorando');
  });

  it('una explicación adecuada en un contexto es «practicando», nunca «lo explico»', () => {
    const s = ideaStatus([at('2026-10-16', 'bandejas'), at('2026-10-17', 'bandejas'), at('2026-10-18', 'bandejas')]);
    expect(s.stage).toBe('practicando');
    expect(s.adequateContexts).toEqual(['bandejas']); // repetir el mismo contexto no es evidencia nueva
  });

  it('«lo explico» pide DOS contextos y al menos una explicación sin pista explicativa', () => {
    expect(ideaStatus([at('2026-10-16', 'bandejas'), at('2026-10-17', 'pendiente')]).stage).toBe('loExplico');
    // Dos contextos pero siempre con la 3.ª pista: sigue «practicando».
    expect(ideaStatus([at('2026-10-16', 'bandejas', { maxHintLevel: 3 }), at('2026-10-17', 'pendiente', { maxHintLevel: 2 })]).stage).toBe('practicando');
    // Dos contextos y una de las dos sin pista: sí.
    expect(ideaStatus([at('2026-10-16', 'bandejas', { maxHintLevel: 3 }), at('2026-10-17', 'pendiente')]).stage).toBe('loExplico');
  });

  it('las ayudas de ACCESO (audio, idioma) no restan: no son pistas explicativas', () => {
    const s = ideaStatus([at('2026-10-16', 'bandejas', { accessSupports: ['audio', 'idioma'] }), at('2026-10-17', 'pendiente', { accessSupports: ['audio'] })]);
    expect(s.stage).toBe('loExplico');
    expect(s.independentAdequate).toBe(2);
  });

  it('«lo veo luego» no cuenta como evidencia ni quita nada', () => {
    const s = ideaStatus([at('2026-10-16', 'bandejas'), at('2026-10-17', 'pendiente', { skipped: true })]);
    expect(s.stage).toBe('practicando');
    expect(s.attempts).toBe(2);
  });

  it('dos fallos en días distintos DESPUÉS de «lo explico» piden repaso, sin perder el logro', () => {
    const base = [at('2026-10-16', 'bandejas'), at('2026-10-17', 'pendiente')];
    const oneDay = [...base, at('2026-10-20', 'mapa', { adequate: false }), at('2026-10-20', 'mapa', { adequate: false })];
    expect(ideaStatus(oneDay).needsReview).toBe(false);
    const twoDays = [...base, at('2026-10-20', 'mapa', { adequate: false }), at('2026-10-24', 'mapa', { adequate: false })];
    const s = ideaStatus(twoDays);
    expect(s.needsReview).toBe(true);
    expect(s.stage).toBe('loExplico');
    // Fallos ANTES de lograrlo no cuentan.
    expect(ideaStatus([at('2026-10-14', 'x', { adequate: false }), at('2026-10-15', 'x', { adequate: false }), ...base]).needsReview).toBe(false);
  });

  it('repaso a los 1, 3 y 7 días del primer logro, y solo se da por hecho con un CASO NUEVO', () => {
    expect(EVIDENCE_POLICY.reviewOffsets).toEqual([1, 3, 7]);
    const first = at('2026-10-16', 'bandejas');
    expect(reviewsDue([first], '2026-10-16')).toEqual([]);
    expect(reviewsDue([first], '2026-10-17')).toEqual([1]);
    expect(reviewsDue([first], '2026-10-19')).toEqual([1, 3]);
    expect(reviewsDue([first], '2026-10-23')).toEqual([1, 3, 7]);
    // Repetir el MISMO contexto no cierra el repaso de +1…
    expect(reviewsDue([first, at('2026-10-17', 'bandejas')], '2026-10-17')).toEqual([1]);
    // …un contexto nuevo sí.
    expect(reviewsDue([first, at('2026-10-17', 'pendiente')], '2026-10-17')).toEqual([]);
    expect(reviewsDue([at('2026-10-16', 'x', { adequate: false })], '2026-10-30')).toEqual([]); // sin primer logro, nada que repasar
  });

  it('resumen por idea y etiquetas del niño: sin «incorrecto» ni porcentajes', () => {
    const all = [at('2026-10-16', 'a'), { ...at('2026-10-16', 'b'), ideaId: 'mapa.patrones' }];
    expect(Object.keys(statusByIdea(all)).sort()).toEqual(['erosion.cobertura', 'mapa.patrones']);
    for (const l of Object.values(STAGE_LABEL)) {
      expect(l.es + l.en).not.toMatch(/incorrect|%/i);
    }
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
  });
});

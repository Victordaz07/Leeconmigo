import { describe, expect, it } from 'vitest';
import { EMPTY_SCIENCE, finishSession, homeSegments, isScienceProgress, nextSession, recordChoice, recordTask, saveResume, statusByIdea, unitProgress, scienceUnitContent, type ScienceUnit } from '../src/index.ts';

const unit = scienceUnitContent('C4-U06') as ScienceUnit;
const task = (id: string) => unit.tasks.find((t) => t.id === id)!;

describe('progreso de Ciencia (solo datos derivados)', () => {
  it('empieza limpio y es válido; lo guardado con otra forma se rechaza', () => {
    expect(isScienceProgress(EMPTY_SCIENCE)).toBe(true);
    expect(isScienceProgress({ v: 2, units: {}, attempts: [] })).toBe(false);
    expect(isScienceProgress({ v: 1, units: { x: { sessionsDone: 'no' } }, attempts: [] })).toBe(false);
    expect(isScienceProgress({ v: 1, units: {}, attempts: [{ ideaId: 1 }] })).toBe(false);
    expect(isScienceProgress(null)).toBe(false);
  });

  it('una tarea terminada guarda un intento por idea y, si es explicación, su entrada del cuaderno', () => {
    const p = recordTask(EMPTY_SCIENCE, unit, task('t5'), { outcome: 'ok', day: '2026-10-16', maxHintLevel: 1, picks: { afirmacion: ['menos'] } });
    expect(p.attempts.map((a) => a.ideaId)).toEqual(['erosion.agua', 'erosion.cobertura']);
    expect(p.attempts.every((a) => a.adequate && a.contextId === 'bandejas' && a.maxHintLevel === 1)).toBe(true);
    expect(unitProgress(p, 'C4-U06').notebook).toEqual([{ taskId: 't5', day: '2026-10-16', picks: { afirmacion: ['menos'] } }]);
    expect(isScienceProgress(p)).toBe(true);
  });

  it('repetir una explicación reemplaza su entrada del cuaderno (no la duplica)', () => {
    let p = recordTask(EMPTY_SCIENCE, unit, task('t5'), { outcome: 'ok', day: '2026-10-16', maxHintLevel: 0, picks: { afirmacion: ['menos'] } });
    p = recordTask(p, unit, task('t5'), { outcome: 'ok', day: '2026-10-17', maxHintLevel: 0, picks: { afirmacion: ['menos'], evidencia: ['sin', 'con'] } });
    expect(unitProgress(p, 'C4-U06').notebook).toHaveLength(1);
    expect(unitProgress(p, 'C4-U06').notebook[0].day).toBe('2026-10-17');
  });

  it('«lo veo luego» no cuenta como dominio ni como fallo y no entra al cuaderno', () => {
    const p = recordTask(EMPTY_SCIENCE, unit, task('t5'), { outcome: 'skipped', day: '2026-10-16', maxHintLevel: 0, picks: {} });
    expect(p.attempts.every((a) => a.skipped)).toBe(true);
    expect(unitProgress(p, 'C4-U06').notebook).toEqual([]);
    expect(statusByIdea(p.attempts)['erosion.agua'].stage).toBe('none');
  });

  it('la reflexión (sin ideas) no suma dominio pero sí queda en el cuaderno', () => {
    const p = recordTask(EMPTY_SCIENCE, unit, task('t8'), { outcome: 'ok', day: '2026-10-16', maxHintLevel: 0, picks: { idea: ['cambio'], porque: ['datos'] } });
    expect(p.attempts).toEqual([]);
    expect(unitProgress(p, 'C4-U06').notebook).toHaveLength(1);
  });

  it('terminar sesiones: guarda estrellas (la mayor), limpia el «seguir después» y avanza a la siguiente', () => {
    let p = saveResume(EMPTY_SCIENCE, 'C4-U06', 's1', 2);
    p = recordChoice(p, 'C4-U06', 'ideaInicial', ['agua']);
    expect(unitProgress(p, 'C4-U06').resume).toEqual({ sessionId: 's1', step: 2 });
    p = finishSession(p, 'C4-U06', 's1', 2);
    p = finishSession(p, 'C4-U06', 's1', 1);
    const u = unitProgress(p, 'C4-U06');
    expect(u.resume).toBeUndefined();
    expect(u.stars.s1).toBe(2);
    expect(u.sessionsDone).toEqual(['s1']);
    expect(u.choices.ideaInicial).toEqual(['agua']);
    expect(nextSession(unit, u)?.id).toBe('s2');
  });

  it('terminar otra sesión no borra el «seguir después» de una sesión distinta', () => {
    let p = saveResume(EMPTY_SCIENCE, 'C4-U06', 's3', 1);
    p = finishSession(p, 'C4-U06', 's1', 1);
    expect(unitProgress(p, 'C4-U06').resume?.sessionId).toBe('s3');
  });

  it('los segmentos de la portada de Inicio avanzan por tercios de la unidad', () => {
    let p = EMPTY_SCIENCE;
    expect(homeSegments(unit, unitProgress(p, 'C4-U06'))).toBe(0);
    const seen: number[] = [];
    for (const s of unit.sessions) {
      p = finishSession(p, 'C4-U06', s.id, 1);
      seen.push(homeSegments(unit, unitProgress(p, 'C4-U06')));
    }
    expect(seen).toEqual([1, 1, 2, 2, 3, 3]);
    expect(nextSession(unit, unitProgress(p, 'C4-U06'))).toBeUndefined();
  });
});

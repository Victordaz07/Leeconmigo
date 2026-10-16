import { describe, expect, it } from 'vitest';
import { SUBJECTS } from '@lee-conmigo/ui-core';
import { SUBJECT_KEYS } from '../src/persist/store.ts';
import { SUBJECT_MODULE_IDS } from '../src/subjects/ids.ts';

describe('materias por módulo', () => {
  it('cada materia con módulo está en la estantería y tiene guardado propio (y entra en "Borrar el progreso")', () => {
    for (const id of SUBJECT_MODULE_IDS) expect(SUBJECTS.some((s) => s.id === id), `${id} en SUBJECTS`).toBe(true);
    expect([...SUBJECT_MODULE_IDS].sort()).toEqual([...SUBJECT_KEYS].sort());
  });
});

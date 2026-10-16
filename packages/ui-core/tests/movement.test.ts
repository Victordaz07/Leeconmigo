import { describe, expect, it } from 'vitest';
import { MOVEMENT_ROUTINES, MOVEMENT_SECONDS, movementStep, routineFor } from '../src/index.ts';

describe('pausa de movimiento (B12)', () => {
  it('reparte el minuto en tres movimientos y termina en 0', () => {
    expect(movementStep(MOVEMENT_SECONDS)).toBe(0);
    expect(movementStep(41)).toBe(0);
    expect(movementStep(40)).toBe(1);
    expect(movementStep(21)).toBe(1);
    expect(movementStep(20)).toBe(2);
    expect(movementStep(1)).toBe(2);
    expect(movementStep(0)).toBe(3);
  });

  it('cada pausa cambia de rutina, y todas tienen sus textos en ES y EN', () => {
    expect(routineFor(0)).not.toBe(routineFor(1));
    expect(routineFor(MOVEMENT_ROUTINES.length)).toBe(routineFor(0));
    expect(routineFor(-1)).toBe(MOVEMENT_ROUTINES[MOVEMENT_ROUTINES.length - 1]);
    for (const r of MOVEMENT_ROUTINES) for (const t of [r.title, ...r.steps]) expect(t.es && t.en).toBeTruthy();
  });
});

import { describe, expect, it } from 'vitest';
import { VIB_ACTION_NAME, VIB_OBJECT_NAME, VIB_ACTIONS, VIB_MODEL, VIB_OBJECTS, stateOf, stateText } from '../src/labs/vibracion.ts';

describe('mesa de vibraciones', () => {
  it('quieta o sujetada: ni se mueve ni suena', () => {
    for (const o of VIB_OBJECTS) for (const a of ['quieta', 'sujetar'] as const) expect(stateOf(o, a), `${o} ${a}`).toEqual({ moves: false, sound: false, riceJumps: false });
  });

  it('golpeado: se mueve y suena (y en el tambor el arroz salta)', () => {
    for (const o of VIB_OBJECTS) {
      const s = stateOf(o, 'golpear');
      expect(s.moves, o).toBe(true);
      expect(s.sound, o).toBe(true);
      expect(s.riceJumps, o).toBe(o === 'tambor');
    }
  });

  it('la voz hace vibrar el tambor (el arroz salta) pero no la regla ni las ligas', () => {
    expect(stateOf('tambor', 'voz')).toEqual({ moves: true, sound: false, riceJumps: true });
    expect(stateOf('regla', 'voz').moves).toBe(false);
    expect(stateOf('ligas', 'voz').moves).toBe(false);
  });

  it('todo lo que suena se mueve (nunca suena algo quieto)', () => {
    for (const o of VIB_OBJECTS) for (const a of VIB_ACTIONS) if (stateOf(o, a).sound) expect(stateOf(o, a).moves, `${o} ${a}`).toBe(true);
  });

  it('hay nombres y descripciones en ES y EN', () => {
    for (const t of [...VIB_OBJECTS.map((o) => VIB_OBJECT_NAME[o]), ...VIB_ACTIONS.map((a) => VIB_ACTION_NAME[a]), ...VIB_OBJECTS.flatMap((o) => VIB_ACTIONS.map((a) => stateText(o, a))), VIB_MODEL.represents, ...VIB_MODEL.assumptions, ...VIB_MODEL.doesNotRepresent, ...VIB_MODEL.controls]) {
      expect(t.es.trim()).not.toBe('');
      expect(t.en.trim()).not.toBe('');
    }
  });
});

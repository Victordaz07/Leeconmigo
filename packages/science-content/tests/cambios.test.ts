import { describe, expect, it } from 'vitest';
import { EARTH_EVENTS, EARTH_MODEL, EVENT_CLUES, EVENT_NAME, EVENT_SPEED, SPEED_NAME, SPEEDS, speedOf } from '../src/labs/cambios.ts';

describe('cambios de la Tierra: rápido o lento', () => {
  it('hay tantos rápidos como lentos y cada suceso tiene dos pistas distintas', () => {
    expect(EARTH_EVENTS.filter((e) => speedOf(e) === 'rapido')).toEqual(['volcan', 'deslizamiento', 'crecida']);
    expect(EARTH_EVENTS.filter((e) => speedOf(e) === 'lento')).toEqual(['canon', 'duna', 'montana']);
    for (const e of EARTH_EVENTS) {
      expect(EVENT_CLUES[e]).toHaveLength(2);
      expect(EVENT_CLUES[e][0].es).not.toBe(EVENT_CLUES[e][1].es);
    }
  });

  it('las pistas de lo rápido hablan de minutos, horas o un día y las de lo lento de años', () => {
    for (const e of EARTH_EVENTS) {
      const text = EVENT_CLUES[e].map((c) => c.es).join(' ');
      if (EVENT_SPEED[e] === 'rapido') expect(text, e).toMatch(/minutos|horas|noche|ayer|mañana|tarde/i);
      else expect(text, e).toMatch(/años|año|cada día|viej/i);
    }
  });

  it('todo texto está en ES y EN', () => {
    for (const t of [...EARTH_EVENTS.map((e) => EVENT_NAME[e]), ...SPEEDS.map((s) => SPEED_NAME[s]), ...EARTH_EVENTS.flatMap((e) => EVENT_CLUES[e]), EARTH_MODEL.represents, ...EARTH_MODEL.assumptions, ...EARTH_MODEL.doesNotRepresent, ...EARTH_MODEL.controls]) {
      expect(t.es.trim()).not.toBe('');
      expect(t.en.trim()).not.toBe('');
    }
  });
});

import { describe, expect, it } from 'vitest';
import { PumpMonitor } from '../src/index.ts';

describe('monitor del planificador', () => {
  it('con llamadas parejas cada 25 ms no hay congelamientos', () => {
    const m = new PumpMonitor(100);
    for (let i = 0; i < 100; i++) m.record(i * 25);
    expect(m.report()).toEqual({ pumps: 99, maxGapMs: 25, meanGapMs: 25, stalls: 0 });
  });

  it('un hueco mayor que la anticipación cuenta como congelamiento', () => {
    const m = new PumpMonitor(100);
    [0, 25, 50, 250, 275].forEach((t) => m.record(t));
    const r = m.report();
    expect(r.stalls).toBe(1);
    expect(r.maxGapMs).toBe(200);
  });

  it('reiniciar borra lo medido; sin datos todo es cero', () => {
    const m = new PumpMonitor();
    m.record(0);
    m.record(500);
    m.reset();
    expect(m.report()).toEqual({ pumps: 0, maxGapMs: 0, meanGapMs: 0, stalls: 0 });
  });
});

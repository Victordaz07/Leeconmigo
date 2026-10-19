import { describe, expect, it } from 'vitest';
import { FakeAudioOutput, Sequencer, emptyPattern, stepSeconds, toggleCell, type Pattern } from '../src/index.ts';

/** Corre el planificador como lo haría la interfaz: cada 25 ms del reloj de audio. */
function run(out: FakeAudioOutput, seq: Sequencer, seconds: number, every = 0.025) {
  const steps = Math.round(seconds / every);
  for (let i = 0; i < steps; i++) {
    out.advance(every);
    seq.pump();
  }
}

const allSteps = (): Pattern => {
  let p = emptyPattern();
  for (let s = 0; s < 8; s++) p = toggleCell(p, 'a', s);
  return p;
};

describe('secuenciador de ocho pulsos', () => {
  it('toca un golpe por pulso exacto, sin huecos ni dobles, durante 16 ciclos', () => {
    const out = new FakeAudioOutput();
    const seq = new Sequencer(out, { bpm: 120, pattern: allSteps() });
    seq.start();
    run(out, seq, 16 * 4, 0.025);
    const times = out.events.map((e) => e.time);
    expect(times.length).toBeGreaterThanOrEqual(8 * 16);
    for (let i = 1; i < times.length; i++) expect(times[i] - times[i - 1]).toBeCloseTo(0.5, 6);
    expect(seq.stats.skippedSteps).toBe(0);
  });

  it('el paso 8 enlaza con el paso 1 sin pausa añadida (el patrón se repite exacto)', () => {
    const out = new FakeAudioOutput();
    const seq = new Sequencer(out, { bpm: 90, pattern: toggleCell(emptyPattern(), 'b', 0) });
    seq.start();
    run(out, seq, 8 * stepSeconds(90) * 3 + 0.5);
    const t = out.events.map((e) => e.time);
    expect(t.length).toBeGreaterThanOrEqual(3);
    expect(t[1] - t[0]).toBeCloseTo(8 * stepSeconds(90), 6);
    expect(t[2] - t[1]).toBeCloseTo(8 * stepSeconds(90), 6);
  });

  it('programa por adelantado: lo que suena en el próximo ~0,1 s ya está en el reloj de audio', () => {
    const out = new FakeAudioOutput();
    const seq = new Sequencer(out, { bpm: 120, lookahead: 0.1, pattern: allSteps() });
    seq.start();
    expect(out.events.length).toBeGreaterThan(0);
    expect(Math.max(...out.events.map((e) => e.time))).toBeLessThanOrEqual(out.now() + 0.1 + 1e-9);
    expect(Math.min(...out.events.map((e) => e.time))).toBeGreaterThanOrEqual(out.now());
  });

  it('un cambio de tempo entra en el siguiente ciclo, no a mitad', () => {
    const out = new FakeAudioOutput();
    const seq = new Sequencer(out, { bpm: 120, pattern: allSteps() });
    seq.start();
    run(out, seq, 1.2); // a mitad del primer ciclo
    seq.setTempo(60);
    expect(seq.tempo).toBe(120);
    expect(seq.pendingTempo).toBe(60);
    run(out, seq, 12);
    expect(seq.tempo).toBe(60);
    expect(seq.pendingTempo).toBeNull();
    const t = out.events.map((e) => e.time);
    const gaps = t.slice(1).map((x, i) => Math.round((x - t[i]) * 1000) / 1000);
    expect(gaps.slice(0, 7).every((g) => g === 0.5)).toBe(true);
    expect(gaps.slice(8, 15).every((g) => g === 1)).toBe(true);
    // la transición ocurre exactamente al volver al paso 1: el último hueco del primer ciclo todavía dura 0,5 s
    expect(gaps[7]).toBe(0.5);
  });

  it('si no está sonando, el tempo cambia de inmediato', () => {
    const seq = new Sequencer(new FakeAudioOutput(), { bpm: 90 });
    seq.setTempo(100);
    expect(seq.tempo).toBe(100);
    expect(seq.pendingTempo).toBeNull();
    seq.setTempo(500);
    expect(seq.tempo).toBe(140);
  });

  it('editar el patrón mientras suena solo afecta a lo que aún no se programó', () => {
    const out = new FakeAudioOutput();
    const seq = new Sequencer(out, { bpm: 60, pattern: emptyPattern() });
    seq.start();
    run(out, seq, 2);
    expect(out.events).toHaveLength(0);
    seq.toggle('a', 4);
    run(out, seq, 10);
    const t = out.events.map((e) => e.time);
    expect(t.length).toBeGreaterThanOrEqual(1);
    for (let i = 1; i < t.length; i++) expect(t[i] - t[i - 1]).toBeCloseTo(8, 6);
  });

  it('solo y silencio por capa', () => {
    const out = new FakeAudioOutput();
    let p = emptyPattern();
    p = toggleCell(toggleCell(p, 'a', 0), 'b', 0);
    const seq = new Sequencer(out, { bpm: 120, pattern: p });
    seq.setMuted('b', true);
    seq.start();
    run(out, seq, 1);
    expect(out.events.every((e) => e.sound === 'bombo')).toBe(true);
    out.events.length = 0;
    seq.setMuted('b', false);
    seq.setSolo('b');
    run(out, seq, 8);
    expect(out.events.length).toBeGreaterThan(0);
    expect(out.events.every((e) => e.sound === 'palmas')).toBe(true);
  });

  it('cada fila suena con el sonido que el niño le eligió, y cambiarlo vale para lo que aún no se programó', () => {
    const out = new FakeAudioOutput();
    const seq = new Sequencer(out, { bpm: 120, pattern: toggleCell(emptyPattern(), 'a', 0), kit: { a: 'bongo', b: 'palmas', c: 'sonaja', d: 'voz' } });
    seq.start();
    run(out, seq, 4.2);
    expect(out.events.length).toBeGreaterThanOrEqual(2);
    expect(out.events.every((e) => e.sound === 'bongo')).toBe(true);
    seq.setSound('a', 'marimba');
    expect(seq.getKit().a).toBe('marimba');
    out.events.length = 0;
    run(out, seq, 8.2);
    expect(out.events.length).toBeGreaterThanOrEqual(2);
    expect(out.events.every((e) => e.sound === 'marimba')).toBe(true);
  });

  it('dos filas pueden tener el mismo sonido y por defecto el juego es bombo, palmas, sonaja y voz', () => {
    const seq = new Sequencer(new FakeAudioOutput());
    expect(seq.getKit()).toEqual({ a: 'bombo', b: 'palmas', c: 'sonaja', d: 'voz' });
    seq.setSound('b', 'bombo');
    expect(seq.getKit().a).toBe(seq.getKit().b);
  });

  it('detener corta el sonido y volver a empezar reinicia en el paso 1', () => {
    const out = new FakeAudioOutput();
    const seq = new Sequencer(out, { bpm: 120, pattern: allSteps() });
    seq.start();
    run(out, seq, 1);
    seq.stop();
    expect(out.stopped).toBe(1);
    expect(seq.playing).toBe(false);
    const before = out.events.length;
    run(out, seq, 1);
    expect(out.events.length).toBe(before);
    seq.start();
    expect(seq.recentTicks()[0].step).toBe(0);
    expect(seq.stats.scheduled).toBeGreaterThan(0);
  });

  it('si el planificador se atrasa (app congelada), se salta lo pasado en vez de tocarlo todo de golpe', () => {
    const out = new FakeAudioOutput();
    const seq = new Sequencer(out, { bpm: 120, pattern: allSteps() });
    seq.start();
    run(out, seq, 1);
    const before = out.events.length;
    out.advance(5); // se congela 5 s
    seq.pump();
    expect(seq.stats.skippedSteps).toBeGreaterThan(0);
    // nada de lo nuevo cae en el pasado
    for (const e of out.events.slice(before)) expect(e.time).toBeGreaterThanOrEqual(out.now() - 0.02);
  });

  it('el cursor sabe qué pulso se está oyendo en un instante del reloj de audio', () => {
    const out = new FakeAudioOutput();
    const seq = new Sequencer(out, { bpm: 120, pattern: allSteps() });
    seq.start();
    run(out, seq, 3);
    const k = seq.recentTicks();
    const third = k[k.length - 3];
    expect(seq.stepAt(third.time + 0.01)).toBe(third.step);
    expect(seq.stepAt(-1)).toBeNull();
  });
});

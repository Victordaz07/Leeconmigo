import { describe, expect, it } from 'vitest';
import type { TimerTransition } from '@lee-conmigo/contracts';
import { LiveReadingTimer, ManualScheduler, ReadingTimerMachine, type ReadingTimerConfig } from '../src/index.ts';

const seg = (fromMs: number, toMs: number, valid: boolean) => ({ fromMs, toMs, valid });

function machine(cfg: Partial<ReadingTimerConfig> = {}) {
  const m = new ReadingTimerMachine(cfg);
  const trs: TimerTransition[] = [];
  m.onTransition((t) => trs.push(t));
  m.prepare();
  return { m, trs };
}

describe('ReadingTimerMachine — ciclo de vida', () => {
  it('IDLE → READY al preparar; en IDLE se ignora todo', () => {
    const m = new ReadingTimerMachine();
    m.ingest(seg(0, 5000, true));
    expect(m.state).toBe('IDLE');
    expect(m.snapshot().validSeconds).toBe(0);
    m.prepare();
    expect(m.state).toBe('READY');
  });

  it('READY espera sin sumar tiempo válido; la primera lectura pasa DIRECTO a READING (docs/03)', () => {
    const { m, trs } = machine();
    m.ingest(seg(0, 2000, false));
    expect(m.state).toBe('READY');
    expect(m.snapshot().timeInStateMs.READY).toBe(2000);
    m.ingest(seg(2000, 7000, true));
    expect(m.state).toBe('READING');
    expect(m.snapshot().validSeconds).toBe(5);
    expect(trs.map((t) => [t.from, t.to, t.atMs])).toEqual([
      ['IDLE', 'READY', 0],
      ['READY', 'READING', 2000],
    ]);
  });

  it('con startNeedsResume (como el Prototipo 00) los primeros 3 s no cuentan', () => {
    const { m } = machine({ startNeedsResume: true });
    m.ingest(seg(0, 4000, true));
    expect(m.state).toBe('READING');
    expect(m.snapshot().validSeconds).toBe(1);
  });

  it('complete() → COMPLETED y después ignora todo', () => {
    const { m } = machine();
    m.ingest(seg(0, 5000, true));
    m.complete();
    expect(m.state).toBe('COMPLETED');
    m.ingest(seg(5000, 9000, true));
    expect(m.snapshot().validSeconds).toBe(5);
  });
});

describe('ReadingTimerMachine — reglas de 10 s y 3 s', () => {
  it('silencio corto (respiro ≤ holdMs) dentro de la lectura se acredita como lectura', () => {
    const { m } = machine();
    m.ingest(seg(0, 4000, true));
    m.ingest(seg(4000, 5000, false)); // 1 s < holdMs (1.5 s)
    m.ingest(seg(5000, 8000, true));
    const s = m.snapshot();
    expect(s.state).toBe('READING');
    expect(s.validSeconds).toBe(8);
    expect(s.timeInStateMs.GRACE_PERIOD).toBe(0);
  });

  it('silencio largo: GRACE_PERIOD fechado en el fin de la lectura y PAUSED a los 10 s exactos', () => {
    const { m, trs } = machine();
    m.ingest(seg(0, 10_000, true));
    m.ingest(seg(10_000, 30_000, false));
    const s = m.snapshot();
    expect(s.state).toBe('PAUSED');
    expect(s.pauses).toBe(1);
    expect(trs.find((t) => t.to === 'GRACE_PERIOD')!.atMs).toBe(10_000); // retroactivo: no 1.5 s después
    expect(trs.find((t) => t.to === 'PAUSED')!.atMs).toBe(20_000);
    expect(s.validSeconds).toBe(10);
    expect(s.timeInStateMs.GRACE_PERIOD).toBe(10_000); // los segundos de GRACE no son válidos
    expect(s.timeInStateMs.PAUSED).toBe(10_000);
  });

  it('desde GRACE_PERIOD se vuelve a READING de inmediato, sin los 3 s de reanudación', () => {
    const { m, trs } = machine();
    m.ingest(seg(0, 5000, true));
    m.ingest(seg(5000, 11_000, false)); // 6 s → GRACE
    expect(m.state).toBe('GRACE_PERIOD');
    m.ingest(seg(11_000, 12_000, true));
    expect(m.state).toBe('READING');
    expect(m.snapshot().validSeconds).toBe(6);
    expect(trs.some((t) => t.to === 'RESUMING')).toBe(false);
  });

  it('desde PAUSED hacen falta 3 s consecutivos (RESUMING) y esos 3 s NO cuentan como válidos', () => {
    const { m, trs } = machine();
    m.ingest(seg(0, 5000, true));
    m.ingest(seg(5000, 17_000, false)); // PAUSED a los 15 s
    m.ingest(seg(17_000, 22_000, true)); // 5 s de lectura
    expect(m.state).toBe('READING');
    expect(trs.find((t) => t.from === 'RESUMING' && t.to === 'READING')!.atMs).toBe(20_000);
    expect(m.snapshot().validSeconds).toBe(5 + 2); // 5 s iniciales + (5 − 3) s tras reanudar
  });

  it('una interrupción durante RESUMING vuelve a PAUSED y reinicia la racha', () => {
    const { m } = machine();
    m.ingest(seg(0, 5000, true));
    m.ingest(seg(5000, 17_000, false)); // PAUSED
    m.ingest(seg(17_000, 19_000, true)); // 2 s de 3
    m.ingest(seg(19_000, 21_000, false)); // silencio ≥ holdMs
    expect(m.state).toBe('PAUSED');
    m.ingest(seg(21_000, 23_000, true));
    expect(m.state).toBe('RESUMING');
    m.ingest(seg(23_000, 24_500, true)); // 3.5 s consecutivos en total
    expect(m.state).toBe('READING');
  });

  it('los tramos partidos en trozos dan el mismo resultado que uno solo', () => {
    const a = machine();
    a.m.ingest(seg(0, 20_000, true));
    a.m.ingest(seg(20_000, 40_000, false));
    const b = machine();
    for (let t = 0; t < 20_000; t += 320) b.m.ingest(seg(t, Math.min(t + 320, 20_000), true));
    for (let t = 20_000; t < 40_000; t += 320) b.m.ingest(seg(t, Math.min(t + 320, 40_000), false));
    expect(b.m.snapshot()).toEqual(a.m.snapshot());
    expect(b.trs.map((t) => [t.to, t.atMs])).toEqual(a.trs.map((t) => [t.to, t.atMs]));
  });

  it('la suma del tiempo en cada estado es el tiempo confirmado', () => {
    const { m } = machine();
    m.ingest(seg(0, 7000, true));
    m.ingest(seg(7000, 8000, false));
    m.ingest(seg(8000, 9000, true));
    m.ingest(seg(9000, 25_000, false));
    m.complete();
    const s = m.snapshot();
    const total = Object.values(s.timeInStateMs).reduce((a, b) => a + b, 0);
    expect(Math.abs(total - s.confirmedMs)).toBeLessThan(1);
  });
});

describe('ReadingTimerMachine — app en segundo plano (docs/06)', () => {
  it('forcePause() pausa de inmediato y al volver se exige lectura válida (3 s) antes de sumar', () => {
    const { m, trs } = machine();
    m.ingest(seg(0, 5000, true));
    m.forcePause('la app pasó a segundo plano');
    expect(m.state).toBe('PAUSED');
    expect(trs.at(-1)!.atMs).toBe(5000);
    expect(m.snapshot().pauses).toBe(1);
    m.ingest(seg(5000, 7000, true));
    expect(m.state).toBe('RESUMING');
    m.ingest(seg(7000, 9000, true));
    expect(m.state).toBe('READING');
    expect(m.snapshot().validSeconds).toBe(5 + 1);
  });
});

describe('LiveReadingTimer (contrato ReadingTimer, con reloj y señales)', () => {
  function live() {
    const clock = new ManualScheduler();
    const timer = new LiveReadingTimer({}, () => clock.now());
    timer.prepare();
    return { clock, timer };
  }
  const readFor = (clock: ManualScheduler, timer: LiveReadingTimer, ms: number) => {
    for (let t = 0; t < ms; t += 500) {
      clock.advance(500);
      timer.onValidReading();
    }
  };

  it('lectura continua: READING y el tiempo válido crece con el reloj', () => {
    const { clock, timer } = live();
    expect(timer.state).toBe('READY');
    readFor(clock, timer, 5000);
    expect(timer.state).toBe('READING');
    expect(timer.validSeconds).toBeCloseTo(5, 1);
    expect(timer.sessionSeconds).toBeCloseTo(5, 1);
  });

  it('sin lectura 12 s → GRACE_PERIOD y luego PAUSED; el tiempo válido se detiene', () => {
    const { clock, timer } = live();
    readFor(clock, timer, 5000);
    clock.advance(4000);
    timer.onSilence();
    expect(timer.state).toBe('GRACE_PERIOD');
    clock.advance(8000);
    timer.onSilence();
    expect(timer.state).toBe('PAUSED');
    expect(timer.validSeconds).toBeCloseTo(5, 1);
    expect(timer.sessionSeconds).toBeCloseTo(17, 1);
    expect(timer.snapshot().pauses).toBe(1);
  });

  it('al retomar, hacen falta ~3 s de lectura antes de volver a sumar', () => {
    const { clock, timer } = live();
    readFor(clock, timer, 5000);
    clock.advance(12_000);
    timer.onSilence();
    expect(timer.state).toBe('PAUSED');
    readFor(clock, timer, 1500);
    expect(timer.state).toBe('RESUMING');
    readFor(clock, timer, 3000);
    expect(timer.state).toBe('READING');
    expect(timer.validSeconds).toBeGreaterThan(5);
    expect(timer.validSeconds).toBeLessThan(8);
  });

  it('onVoiceActivity() por sí sola NO reanuda ni suma tiempo válido', () => {
    const { clock, timer } = live();
    readFor(clock, timer, 3000);
    clock.advance(14_000);
    timer.onSilence();
    expect(timer.state).toBe('PAUSED');
    for (let i = 0; i < 10; i++) {
      clock.advance(500);
      timer.onVoiceActivity();
    }
    expect(timer.state).toBe('PAUSED');
  });

  it('suspend() (app en segundo plano) pausa al instante; complete() congela los relojes', () => {
    const { clock, timer } = live();
    readFor(clock, timer, 4000);
    timer.suspend();
    expect(timer.state).toBe('PAUSED');
    timer.complete();
    const v = timer.validSeconds;
    clock.advance(60_000);
    expect(timer.state).toBe('COMPLETED');
    expect(timer.validSeconds).toBe(v);
    expect(timer.sessionSeconds).toBeCloseTo(4, 1);
  });
});

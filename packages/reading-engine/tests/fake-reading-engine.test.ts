import { describe, expect, it } from 'vitest';
import type { ReadingEvent, ReadingSessionState, ReadingWord } from '@lee-conmigo/contracts';
import { FakeReadingEngine, ManualScheduler } from '../src/index.ts';

const words = (n: number): ReadingWord[] => Array.from({ length: n }, (_, i) => ({ id: `w${i}`, text: `palabra${i}`, index: i, normalized: `palabra${i}` }));

function setup(n = 5) {
  const sched = new ManualScheduler();
  const engine = new FakeReadingEngine({ scheduler: sched });
  const log: Array<ReadingEvent | null> = [];
  let last: ReadingSessionState = engine.getState();
  engine.subscribe((e, s) => {
    log.push(e);
    last = s;
  });
  engine.startSession(words(n));
  const types = () => log.map((e) => e?.type ?? null);
  return { sched, engine, log, types, state: () => last };
}

describe('FakeReadingEngine', () => {
  it('startSession emite session.started y deja la sesión "escuchando, sin voz todavía"', () => {
    const { types, state } = setup();
    expect(types()).toEqual(['session.started']);
    expect(state().status).toBe('listening');
    expect(state().hasHeardVoice).toBe(false);
  });

  it('leer toda la página: speech.started, una palabra correcta por palabra y page.completed tras un breve retardo', () => {
    const { engine, sched, types, state } = setup(3);
    for (let i = 0; i < 3; i++) engine.simulate.correct();
    expect(types()).toEqual(['session.started', 'speech.started', 'word.correct', 'word.correct', 'word.correct']);
    expect(state().status).toBe('listening');
    sched.advance(400);
    expect(types().at(-1)).toBe('page.completed');
    expect(state().status).toBe('complete');
    expect(state().currentWordIndex).toBe(3);
  });

  it('la lectura automática avanza una palabra cada ~520 ms y se detiene al terminar', () => {
    const { engine, sched, state } = setup(4);
    engine.simulate.correct(); // arranca la sesión "con voz"
    engine.simulate.autoRead(true);
    expect(engine.isAutoReading).toBe(true);
    sched.advance(520 * 2);
    expect(state().currentWordIndex).toBe(3);
    sched.advance(520 + 400);
    expect(state().status).toBe('complete');
    expect(engine.isAutoReading).toBe(false);
  });

  it('pausas: corta = "paused" sin anotar; larga anota la palabra; leer de nuevo activa "¡Muy bien!" un instante', () => {
    const { engine, sched, state } = setup();
    engine.simulate.correct();
    engine.simulate.pauseShort();
    expect(state().pause).toBe('short');
    engine.simulate.pauseLong();
    expect(state().pause).toBe('long');
    expect(state().practicedWordIndices).toEqual([1]);
    engine.simulate.correct();
    expect(state().recovered).toBe(true);
    sched.advance(1800);
    expect(state().recovered).toBe(false);
  });

  it('dudosa / incorrecta / saltada / repetida disparan sus eventos y no bloquean la lectura', () => {
    const { engine, types, state, sched } = setup(8);
    engine.simulate.correct();
    engine.simulate.uncertain();
    engine.simulate.incorrect();
    engine.simulate.repeated();
    expect(state().issue).toBe('repeated');
    sched.advance(1500);
    expect(state().issue).toBeNull();
    engine.simulate.skipped();
    expect(state().issue).toBe('skipped');
    engine.simulate.correct();
    expect(state().issue).toBeNull();
    expect(types()).toEqual([
      'session.started',
      'speech.started',
      'word.correct',
      'word.uncertain',
      'word.incorrect',
      'word.repeated',
      null, // ui.repeated.cleared: cambio momentáneo sin evento del contrato
      'word.skipped',
      'word.correct',
    ]);
  });

  it('pedir ayuda: sin índice usa la palabra saltada (o la actual); mientras esté abierta las palabras correctas se ignoran', () => {
    const { engine, state, types } = setup(8);
    engine.simulate.correct();
    engine.simulate.skipped(); // se salta la palabra 1
    engine.requestHelp();
    expect(state().helpWordIndex).toBe(1);
    expect(state().status).toBe('helping');
    const before = types().length;
    engine.simulate.correct();
    expect(types().length).toBe(before); // ignorada
    engine.closeHelp();
    expect(state().status).toBe('listening');
    engine.requestHelp(5); // tocar cualquier palabra abre la ayuda
    expect(state().helpWordIndex).toBe(5);
  });

  it('"léeme el comienzo": help.requested con kind read-start y pasos de animación a los 250/810/1370 ms, listo a los 1930 ms', () => {
    const { engine, sched, log, state } = setup(8);
    engine.simulate.correct();
    engine.requestReadStart();
    expect(log.at(-1)).toEqual({ type: 'help.requested', wordIndex: 1, kind: 'read-start' });
    expect(state().readStart).toEqual({ fromWordIndex: 1, step: -1, done: false });
    sched.advance(250);
    expect(state().readStart?.step).toBe(0);
    sched.advance(560);
    expect(state().readStart?.step).toBe(1);
    sched.advance(560);
    expect(state().readStart?.step).toBe(2);
    expect(state().readStart?.done).toBe(false);
    sched.advance(560);
    expect(state().readStart?.done).toBe(true);
  });

  it('los cambios momentáneos (sin evento del contrato) llegan a los suscriptores con event = null', () => {
    const { engine, sched, log } = setup(8);
    engine.simulate.pauseLong();
    engine.simulate.correct(); // recovered
    sched.advance(1800);
    expect(log.at(-1)).toBeNull();
  });

  it('el temporizador va por su cuenta: leer mantiene READING; una pausa larga real lo lleva a GRACE_PERIOD y PAUSED', () => {
    const { engine, sched } = setup(30);
    engine.simulate.autoRead(false);
    engine.simulate.correct();
    engine.simulate.autoRead(true);
    sched.advance(5000);
    expect(engine.timer.state).toBe('READING');
    expect(engine.timer.validSeconds).toBeGreaterThan(4);
    engine.simulate.autoRead(false);
    engine.simulate.pauseLong();
    sched.advance(4000);
    expect(engine.getTimerSnapshot().state).toBe('GRACE_PERIOD');
    sched.advance(8000);
    expect(engine.getTimerSnapshot().state).toBe('PAUSED');
    expect(engine.getTimerSnapshot().pauses).toBe(1);
  });

  it('story.completed cierra el temporizador (COMPLETED)', () => {
    const { engine } = setup(3);
    engine.simulate.correct();
    engine.simulate.completeStory();
    expect(engine.timer.state).toBe('COMPLETED');
  });

  it('stopSession y dispose cancelan todo: ya no llegan eventos ni quedan temporizadores', () => {
    const { engine, sched, log } = setup(10);
    engine.simulate.correct();
    engine.simulate.autoRead(true);
    engine.stopSession();
    const n = log.length; // ya incluye el cambio a "idle"
    sched.advance(10_000);
    expect(log.length).toBe(n);
    expect(engine.getState().status).toBe('idle');
    engine.dispose();
    expect(sched.pendingCount).toBe(0);
  });
});

describe('FakeReadingEngine — varias páginas y segundo plano', () => {
  it('loadPage empieza otra página SIN reiniciar el temporizador ni el tiempo válido', () => {
    const { engine, sched, types, state } = setup(30);
    engine.simulate.correct();
    engine.simulate.autoRead(true);
    sched.advance(5000);
    const before = engine.getTimerSnapshot();
    expect(before.state).toBe('READING');
    expect(before.validSeconds).toBeGreaterThan(4);
    engine.loadPage(words(12)); // página siguiente, con otro número de palabras
    expect(types().at(-1)).toBe('page.started');
    expect(state().wordCount).toBe(12);
    expect(state().currentWordIndex).toBe(0);
    expect(state().hasHeardVoice).toBe(false); // vuelve a "esperando voz"
    expect(engine.isAutoReading).toBe(false);
    const after = engine.getTimerSnapshot();
    expect(after.validSeconds).toBeCloseTo(before.validSeconds, 0); // el tiempo válido se conserva
    expect(after.sessionSeconds).toBeGreaterThanOrEqual(before.sessionSeconds);
    engine.simulate.correct();
    engine.simulate.correct();
    sched.advance(600);
    expect(engine.getState().currentWordIndex).toBe(2);
  });

  it('loadPage sin sesión previa la arranca', () => {
    const sched = new ManualScheduler();
    const engine = new FakeReadingEngine({ scheduler: sched });
    engine.loadPage(words(5));
    expect(engine.getState().status).toBe('listening');
    expect(engine.timer.machine.state).toBe('READY');
  });

  it('suspend (app en segundo plano) pausa el temporizador al instante y no acepta lectura; resume exige leer de nuevo', () => {
    const { engine, sched, state } = setup(30);
    engine.simulate.correct();
    engine.simulate.autoRead(true);
    sched.advance(4000);
    engine.suspend();
    expect(engine.getTimerSnapshot().state).toBe('PAUSED');
    expect(engine.isAutoReading).toBe(false);
    const idx = state().currentWordIndex;
    engine.simulate.correct(); // ignorado: la app no está en primer plano
    expect(state().currentWordIndex).toBe(idx);
    const valid = engine.getTimerSnapshot().validSeconds;
    sched.advance(30_000);
    expect(engine.getTimerSnapshot().validSeconds).toBe(valid); // sin lectura no suma
    engine.resume();
    engine.simulate.correct();
    sched.advance(300); // sin alinear con el reloj interno (250 ms) para que la lectura deje evidencia
    engine.simulate.correct();
    expect(engine.getTimerSnapshot().state).toBe('RESUMING'); // hay que leer ~3 s seguidos para reanudar
  });

  it.each([300, 5000, 30_000])('tras %i ms en segundo plano, leer con regularidad (una palabra cada 300 ms) reanuda a los ~3 s y vuelve a sumar tiempo', (gap) => {
    const { engine, sched } = setup(60);
    engine.simulate.correct();
    engine.simulate.autoRead(true);
    sched.advance(3000);
    engine.suspend();
    sched.advance(gap);
    engine.resume();
    const states: string[] = [];
    for (let k = 0; k < 16; k++) {
      engine.simulate.correct();
      sched.advance(300);
      states.push(engine.getTimerSnapshot().state);
    }
    expect(states[0]).toBe('RESUMING');
    expect(states.slice(0, 8).every((x) => x === 'RESUMING')).toBe(true); // sigue reanudando mientras lee
    expect(states.at(-1)).toBe('READING'); // ~3 s seguidos de lectura: reanudó
    const valid = engine.getTimerSnapshot().validSeconds;
    engine.simulate.correct();
    sched.advance(300);
    expect(engine.getTimerSnapshot().validSeconds).toBeGreaterThan(valid); // ya suma otra vez
  });

  it('la lectura que llega justo después de un tick también deja evidencia (no se pierde por alineación de relojes)', () => {
    const { engine, sched } = setup(60);
    engine.simulate.correct();
    sched.advance(250); // el reloj interno ya confirmó hasta aquí
    const before = engine.getTimerSnapshot().validSeconds;
    engine.simulate.correct();
    sched.advance(250);
    expect(engine.getTimerSnapshot().validSeconds).toBeGreaterThan(before);
  });
});

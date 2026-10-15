import { describe, expect, it } from 'vitest';
import type { ReadingEvent } from '@lee-conmigo/contracts';
import { createSessionState, reduceSession, type SessionAction } from '../src/index.ts';

const run = (wordCount: number, actions: SessionAction[]) => actions.reduce(reduceSession, createSessionState(wordCount));

describe('reduceSession (lógica del prototipo aprobado, sin UI)', () => {
  it('fuera de una sesión activa todo se ignora; session.started la abre "esperando voz"', () => {
    const s0 = createSessionState(5);
    expect(reduceSession(s0, { type: 'word.correct', wordIndex: 0 })).toBe(s0);
    const s1 = run(5, [{ type: 'session.started' }]);
    expect(s1.status).toBe('listening');
    expect(s1.hasHeardVoice).toBe(false);
    expect(reduceSession(s1, { type: 'speech.started' }).hasHeardVoice).toBe(true);
  });

  it('word.correct marca la palabra, avanza y limpia pausas y dificultades', () => {
    const s = run(5, [{ type: 'session.started' }, { type: 'word.correct', wordIndex: 0 }, { type: 'word.correct', wordIndex: 1 }]);
    expect(s.currentWordIndex).toBe(2);
    expect(s.wordMarks).toEqual({ 0: 'read', 1: 'read' });
    expect(s.hasHeardVoice).toBe(true);
    expect(s.recovered).toBe(false);
  });

  it('pausa corta vs larga según la duración; la larga anota la palabra para el repaso', () => {
    const base: SessionAction[] = [{ type: 'session.started' }, { type: 'word.correct', wordIndex: 0 }];
    const short = run(5, [...base, { type: 'pause.detected', duration: 1800 }]);
    expect(short.pause).toBe('short');
    expect(short.status).toBe('paused');
    expect(short.practicedWordIndices).toEqual([]);
    const long = run(5, [...base, { type: 'pause.detected', duration: 5200 }]);
    expect(long.pause).toBe('long');
    expect(long.practicedWordIndices).toEqual([1]);
  });

  it('superar una dificultad o una pausa larga activa "¡Muy bien!" (recovered); una simple repetición no', () => {
    const stuck = run(5, [{ type: 'session.started' }, { type: 'pause.detected', duration: 5200 }, { type: 'word.correct', wordIndex: 0 }]);
    expect(stuck.recovered).toBe(true);
    expect(stuck.pause).toBeNull();
    const rep = run(5, [{ type: 'session.started' }, { type: 'word.correct', wordIndex: 0 }, { type: 'word.repeated', wordIndex: 0 }, { type: 'word.correct', wordIndex: 1 }]);
    expect(rep.recovered).toBe(false);
    const clear = reduceSession(stuck, { type: 'ui.recovered.cleared' });
    expect(clear.recovered).toBe(false);
  });

  it('dudosa / incorrecta / saltada: dificultad suave, errores solo como métrica interna, palabra anotada', () => {
    const s = run(6, [
      { type: 'session.started' },
      { type: 'word.uncertain', wordIndex: 0 },
      { type: 'word.incorrect', wordIndex: 0 },
      { type: 'word.skipped', wordIndex: 0 },
    ]);
    expect(s.issue).toBe('skipped');
    expect(s.issueWordIndex).toBe(0);
    expect(s.wordMarks[0]).toBe('skipped');
    expect(s.currentWordIndex).toBe(1);
    expect(s.errorCount).toBe(2); // incorrecta + saltada (la dudosa no cuenta)
    expect(s.practicedWordIndices).toEqual([0]); // sin repetidos
  });

  it('repetida se resalta un instante y se suelta con ui.repeated.cleared', () => {
    const s = run(5, [{ type: 'session.started' }, { type: 'word.correct', wordIndex: 0 }, { type: 'word.repeated', wordIndex: 0 }]);
    expect(s.issue).toBe('repeated');
    expect(s.repeatedWordIndex).toBe(0);
    const c = reduceSession(s, { type: 'ui.repeated.cleared' });
    expect(c.issue).toBeNull();
    expect(c.repeatedWordIndex).toBeNull();
  });

  it('ayuda: status "helping"; mientras está abierta las palabras correctas se ignoran; se cierra con ui.help.closed', () => {
    const s = run(5, [{ type: 'session.started' }, { type: 'word.correct', wordIndex: 0 }, { type: 'help.requested', wordIndex: 1 }]);
    expect(s.status).toBe('helping');
    expect(s.helpWordIndex).toBe(1);
    expect(s.practicedWordIndices).toEqual([1]);
    expect(reduceSession(s, { type: 'word.correct', wordIndex: 1 })).toBe(s);
    const closed = reduceSession(s, { type: 'ui.help.closed' });
    expect(closed.status).toBe('listening');
    expect(closed.helpWordIndex).toBeNull();
  });

  it('pedir ayuda (o "léeme el comienzo") durante "esperando voz" ya cuenta como interacción', () => {
    const help = run(5, [{ type: 'session.started' }, { type: 'help.requested', wordIndex: 0 }]);
    expect(help.hasHeardVoice).toBe(true);
    const echo = run(5, [{ type: 'session.started' }, { type: 'help.requested', wordIndex: 0, kind: 'read-start' }]);
    expect(echo.hasHeardVoice).toBe(true);
  });

  it('"léeme el comienzo": pasos de animación y cede el turno; se mantiene hasta leer 2 palabras propias', () => {
    let s = run(8, [{ type: 'session.started' }, { type: 'word.correct', wordIndex: 0 }, { type: 'help.requested', wordIndex: 1, kind: 'read-start' }]);
    expect(s.readStart).toEqual({ fromWordIndex: 1, step: -1, done: false });
    expect(s.helpWordIndex).toBeNull(); // no abre el modal de ayuda
    s = reduceSession(s, { type: 'ui.readStart.step', step: 2 });
    s = reduceSession(s, { type: 'ui.readStart.done' });
    expect(s.readStart).toEqual({ fromWordIndex: 1, step: 2, done: true });
    s = reduceSession(s, { type: 'word.correct', wordIndex: 1 });
    expect(s.readStart).not.toBeNull(); // aún dentro de las 2 primeras palabras
    s = reduceSession(s, { type: 'word.correct', wordIndex: 2 });
    s = reduceSession(s, { type: 'word.correct', wordIndex: 3 });
    expect(s.readStart).toBeNull();
  });

  it('page.completed marca todo como leído y cierra la página; story.completed también', () => {
    const s = run(4, [{ type: 'session.started' }, { type: 'word.correct', wordIndex: 0 }, { type: 'word.skipped', wordIndex: 1 }, { type: 'page.completed' }]);
    expect(s.status).toBe('complete');
    expect(s.currentWordIndex).toBe(4);
    expect(s.wordMarks).toEqual({ 0: 'read', 1: 'skipped', 2: 'read', 3: 'read' });
    expect(run(4, [{ type: 'session.started' }, { type: 'story.completed' }]).status).toBe('complete');
  });

  it('el estado es un dato puro: dos reproducciones del mismo flujo dan el mismo resultado', () => {
    const flow: ReadingEvent[] = [
      { type: 'session.started' },
      { type: 'speech.started' },
      { type: 'word.correct', wordIndex: 0 },
      { type: 'pause.detected', duration: 5200 },
      { type: 'word.correct', wordIndex: 1 },
    ];
    expect(run(5, flow)).toEqual(run(5, flow));
    expect(JSON.parse(JSON.stringify(run(5, flow)))).toEqual(run(5, flow)); // serializable
  });
});

describe('page.started', () => {
  it('reinicia el estado de página (marcas, dificultad, ayuda) y vuelve a "esperando voz"', () => {
    const mid = run(5, [{ type: 'session.started' }, { type: 'word.correct', wordIndex: 0 }, { type: 'word.skipped', wordIndex: 1 }, { type: 'help.requested', wordIndex: 2 }]);
    expect(mid.helpWordIndex).toBe(2);
    const fresh = reduceSession({ ...createSessionState(9), status: 'listening' }, { type: 'page.started' });
    expect(fresh).toMatchObject({ status: 'listening', hasHeardVoice: false, currentWordIndex: 0, wordCount: 9, helpWordIndex: null, issue: null });
    expect(fresh.wordMarks).toEqual({});
  });
});

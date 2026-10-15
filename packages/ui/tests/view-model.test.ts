import { describe, expect, it } from 'vitest';
import type { ReadingEvent } from '@lee-conmigo/contracts';
import { createSessionState, reduceSession } from '@lee-conmigo/reading-engine';
import { pilotStory, tokenizePage } from '@lee-conmigo/story-engine';
import { cleanWord, copy, defaultPrefs, deriveReadingView, wordVisual, type ReaderPrefs } from '../src/index.ts';
import { readingMinutes } from '../src/view-model.ts';

const words = tokenizePage(pilotStory.pages[0]);
const N = words.length;
const play = (events: Array<ReadingEvent | Parameters<typeof reduceSession>[1]>) => events.reduce(reduceSession, createSessionState(N));
const start: ReadingEvent = { type: 'session.started' };
const lector: ReaderPrefs = { ...defaultPrefs, audience: 'lector' };
const view = (events: Parameters<typeof play>[0], screen: Parameters<typeof deriveReadingView>[0]['screen'] = 'reading', prefs = defaultPrefs) =>
  deriveReadingView({ screen, reading: play(events), words, prefs });

describe('deriveReadingView', () => {
  it('"esperando voz": micrófono listo y ondas quietas, mensaje de inicio', () => {
    const v = view([start]);
    expect(v.waiting).toBe(true);
    expect(v.listening).toBe(false);
    expect(v.micLabel).toBe(copy.mic.waiting);
    expect(v.feedback).toBe(copy.feedback.explorador.start);
    expect(v.currentBlock).toBe(0);
  });

  it('leyendo: verde y "Te escucho"; tras unas palabras, el coach felicita el ritmo', () => {
    const early = view([start, { type: 'word.correct', wordIndex: 0 }]);
    expect(early.micTone).toBe('ok');
    expect(early.listening).toBe(true);
    expect(early.micLabel).toBe(copy.mic.listening);
    expect(early.feedback).toBe(copy.feedback.explorador.listen);
    const later = view([start, ...[0, 1, 2, 3, 4].map((i) => ({ type: 'word.correct', wordIndex: i }) as const)]);
    expect(later.feedback).toBe(copy.feedback.explorador.good);
  });

  it('pausa corta: gris "En pausa", sin velo; pausa larga: ámbar "Te espero", velo y nube de ayuda', () => {
    const short = view([start, { type: 'pause.detected', duration: 1800 }]);
    expect(short.micTone).toBe('idle');
    expect(short.micLabel).toBe(copy.mic.shortPause);
    expect(short.scrim).toBe(false);
    const long = view([start, { type: 'pause.detected', duration: 5200 }]);
    expect(long.micTone).toBe('warn');
    expect(long.micLabel).toBe(copy.mic.longPause);
    expect(long.scrim).toBe(true);
    expect(long.pauseCloud).toBe(true);
  });

  it('con la ayuda abierta hay velo, mic gris "Ayuda abierta" y la nube de pausa desaparece', () => {
    const v = view([start, { type: 'pause.detected', duration: 5200 }, { type: 'help.requested', wordIndex: 0 }]);
    expect(v.scrim).toBe(true);
    expect(v.pauseCloud).toBe(false);
    expect(v.micLabel).toBe(copy.mic.help);
    expect(v.micTone).toBe('idle');
    expect(v.feedback).toBe(copy.feedback.explorador.help);
  });

  it('el mensaje se adapta a la audiencia y menciona la palabra sin puntuación', () => {
    const events = [start, { type: 'word.incorrect', wordIndex: 0 } as const];
    expect(view(events, 'reading', defaultPrefs).feedback).toBe('Casi. Escuchemos «El».');
    expect(view(events, 'reading', lector).feedback).toBe('Revisa «El». Puedes escucharla.');
  });

  it('palabra saltada: el coach nombra la palabra saltada', () => {
    const v = view([start, { type: 'word.skipped', wordIndex: 3 }]);
    expect(v.feedback).toBe(copy.feedback.explorador.skipped(cleanWord(words[3].text)));
  });

  it('superar una dificultad: "¡Muy bien!"; "léeme el comienzo": el mic dice "Yo leo" hasta que cede el turno', () => {
    expect(view([start, { type: 'pause.detected', duration: 5200 }, { type: 'word.correct', wordIndex: 0 }]).feedback).toBe(copy.feedback.explorador.praise);
    const echo = play([start, { type: 'help.requested', wordIndex: 0, kind: 'read-start' }]);
    const during = deriveReadingView({ screen: 'reading', reading: echo, words, prefs: defaultPrefs });
    expect(during.micLabel).toBe(copy.mic.echo);
    const done = reduceSession(reduceSession(echo, { type: 'ui.readStart.step', step: 2 }), { type: 'ui.readStart.done' });
    const after = deriveReadingView({ screen: 'reading', reading: done, words, prefs: defaultPrefs });
    expect(after.micLabel).toBe(copy.mic.listening);
    expect(after.feedback).toBe(copy.feedback.explorador.echoDone('El'));
  });

  it('fin de página, pregunta y repaso: "¡Terminaste!" y mensaje de cierre', () => {
    const done = [start, { type: 'page.completed' } as const];
    for (const screen of ['pageDone', 'question', 'review'] as const) expect(view(done, screen).micLabel).toBe(copy.mic.done);
    expect(view(done, 'pageDone').feedback).toBe(copy.feedback.explorador.done);
    expect(view(done, 'pageDone').scrim).toBe(false); // aviso breve, sin oscurecer la ilustración (antes sí)
    expect(view(done, 'review').feedback).toBe(copy.feedback.explorador.review);
  });

  it('la cámara sigue el cuadro de la palabra actual', () => {
    const at = (i: number) => view([start, { type: 'word.correct', wordIndex: i - 1 }]).currentBlock;
    expect(at(1)).toBe(0);
    expect(at(words.findIndex((w) => w.blockIndex === 4))).toBe(4);
  });
});

describe('wordVisual (cómo se marca cada palabra)', () => {
  const state = (...e: Parameters<typeof play>[0]) => play([start, ...e]);

  it('solo la palabra actual se marca; las ya leídas no cambian (no es un examen)', () => {
    const s = state({ type: 'word.correct', wordIndex: 0 });
    expect(wordVisual(1, s, 'reading', defaultPrefs).style.background).toBe('var(--color-focus)');
    expect(wordVisual(0, s, 'reading', defaultPrefs).style).toEqual({});
    expect(wordVisual(5, s, 'reading', defaultPrefs).style).toEqual({});
  });

  it('"subrayado" usa una línea azul en vez del resaltador (opción temporal, docs/09 #2)', () => {
    const s = state({ type: 'word.correct', wordIndex: 0 });
    const v = wordVisual(1, s, 'reading', { ...defaultPrefs, highlight: 'subrayado' });
    expect(v.style.background).toBeUndefined();
    expect(v.style.boxShadow).toContain('var(--color-brand)');
  });

  it('duda o error suave: ámbar, nunca rojo', () => {
    for (const type of ['word.uncertain', 'word.incorrect'] as const) {
      const s = state({ type, wordIndex: 0 });
      const st = wordVisual(0, s, 'reading', defaultPrefs).style;
      expect(st.background).toBe('var(--color-warn-tint)');
      expect(JSON.stringify(st)).not.toMatch(/red|#f00|coral/i);
    }
  });

  it('saltada: línea punteada; repetida: verde un instante; pausa larga: la palabra "respira"', () => {
    const skipped = state({ type: 'word.skipped', wordIndex: 2 });
    expect(wordVisual(2, skipped, 'reading', defaultPrefs).style.backgroundImage).toContain('linear-gradient(to right');
    const rep = state({ type: 'word.correct', wordIndex: 0 }, { type: 'word.repeated', wordIndex: 0 });
    expect(wordVisual(0, rep, 'reading', defaultPrefs).style.background).toBe('var(--color-ok-tint)');
    const long = state({ type: 'pause.detected', duration: 5200 });
    expect(wordVisual(0, long, 'reading', defaultPrefs).className).toBe('animate-pulse-soft');
  });

  it('sin voz oída (esperando) o fuera de la lectura no se marca ninguna palabra actual', () => {
    const waiting = play([start]);
    expect(wordVisual(0, waiting, 'reading', defaultPrefs).style).toEqual({});
    const reading = state({ type: 'word.correct', wordIndex: 0 });
    expect(wordVisual(1, reading, 'select', defaultPrefs).style).toEqual({});
  });
});

describe('readingMinutes: duración estimada de la historia (antes un «3–5 minutos» fijo)', () => {
  const storyOf = (wordsPerBlock: number[]): Parameters<typeof readingMinutes>[0] => ({
    ...pilotStory,
    pages: [{ ...pilotStory.pages[0], blocks: wordsPerBlock.map((n, i) => ({ id: `b${i}`, title: 'x', lines: [Array.from({ length: n }, () => 'palabra').join(' ')] })) }],
  });

  it('crece con el texto: una historia corta y una larga no dicen lo mismo', () => {
    const short = readingMinutes(storyOf([70, 74]));
    const long = readingMinutes(storyOf(Array.from({ length: 40 }, () => 22)));
    expect(short).toEqual({ min: 2, max: 4 });
    expect(long.min).toBeGreaterThanOrEqual(10);
    expect(long.max).toBeGreaterThan(long.min);
  });

  it('nunca baja de 1 minuto y el máximo nunca es menor que el mínimo', () => {
    expect(readingMinutes(storyOf([3]))).toEqual({ min: 1, max: 1 });
    const r = readingMinutes(storyOf([100]));
    expect(r.max).toBeGreaterThanOrEqual(r.min);
  });

  it('el texto de la ficha usa el rango, o una sola cifra si coinciden', () => {
    expect(copy.select.duration(12, 22)).toBe('12–22 minutos');
    expect(copy.select.duration(1, 1)).toBe('1 minuto');
    expect(copy.select.duration(3, 3)).toBe('3 minutos');
  });
});

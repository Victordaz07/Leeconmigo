import { describe, expect, it } from 'vitest';
import { createSessionState, reduceSession } from '@lee-conmigo/reading-engine';
import {
  MemoryProgressStore,
  SCREEN_STATE_LABELS,
  accuracyPercent,
  buildSessionSummary,
  createReview,
  formatDuration,
  initialFlow,
  latestOf,
  reduceFlow,
  screenStateNumber,
  starsFor,
  storyProgress,
  tapTile,
  tileOrder,
  tilesOf,
  wordsPerMinute,
  type FlowAction,
  type FlowState,
  type ReviewWord,
} from '../src/index.ts';

const play = (actions: FlowAction[], from: FlowState = initialFlow) => actions.reduce(reduceFlow, from);
const WORDS: ReviewWord[] = [
  { key: 'puerta', syllables: ['puer', 'ta'] },
  { key: 'montañas', syllables: ['mon', 'ta', 'ñas'] },
];

describe('flujo de pantallas', () => {
  it('home → select → prep → reading → pageDone → question', () => {
    const s = play([{ type: 'go', screen: 'select' }, { type: 'prep.open' }, { type: 'reading.begin' }, { type: 'reading.pageCompleted' }, { type: 'question.open' }]);
    expect(s.screen).toBe('question');
    expect(s.answer).toBeNull();
  });

  it('page.completed solo cambia de pantalla si se estaba leyendo', () => {
    expect(reduceFlow(initialFlow, { type: 'reading.pageCompleted' }).screen).toBe('home');
  });

  it('pregunta: se puede reintentar; al acertar la respuesta queda fija; "Continuar" solo con la correcta', () => {
    let s = play([{ type: 'question.open' }]);
    expect(reduceFlow(s, { type: 'question.finish', correctIndex: 1, words: WORDS })).toBe(s); // sin responder: no avanza
    s = reduceFlow(s, { type: 'question.pick', index: 0, correctIndex: 1 });
    expect(s.answer).toBe(0);
    expect(reduceFlow(s, { type: 'question.finish', correctIndex: 1, words: WORDS })).toBe(s); // respuesta incorrecta: no avanza
    s = reduceFlow(s, { type: 'question.pick', index: 1, correctIndex: 1 });
    expect(s.answer).toBe(1);
    expect(reduceFlow(s, { type: 'question.pick', index: 2, correctIndex: 1 }).answer).toBe(1); // fija
    expect(reduceFlow(s, { type: 'question.finish', correctIndex: 1, words: WORDS }).screen).toBe('review');
  });

  it('si no hay palabras para repasar, va directo al final', () => {
    const s = play([{ type: 'question.open' }, { type: 'question.pick', index: 1, correctIndex: 1 }, { type: 'question.finish', correctIndex: 1, words: [] }]);
    expect(s.screen).toBe('end');
  });

  it('restart vuelve a la lectura sin arrastrar respuesta ni repaso', () => {
    const s = play([{ type: 'question.open' }, { type: 'question.pick', index: 1, correctIndex: 1 }, { type: 'restart' }]);
    expect(s).toMatchObject({ screen: 'reading', answer: null, review: null });
  });
});

describe('lectura libre: ir y volver entre páginas', () => {
  const reading = (pageIndex: number): FlowState => ({ ...initialFlow, screen: 'reading', pageIndex, startPage: 0 });
  it('volver baja una página y nunca pasa de la primera', () => {
    expect(reduceFlow(reading(2), { type: 'free.back' }).pageIndex).toBe(1);
    expect(reduceFlow(reading(0), { type: 'free.back' }).pageIndex).toBe(0);
  });
  it('volver y seguir no suma páginas leídas', () => {
    let s = play([{ type: 'reading.pageCompleted' }], reading(1)); // lee la página 2
    s = reduceFlow(s, { type: 'page.next', words: [], isLastPage: false });
    expect(s.pageIndex).toBe(2);
    const pagesRead = s.totals.pagesRead;
    s = reduceFlow(s, { type: 'free.back' });
    s = reduceFlow(s, { type: 'free.forward', isLastPage: false });
    expect(s.pageIndex).toBe(2);
    expect(s.screen).toBe('reading');
    expect(s.totals.pagesRead).toBe(pagesRead);
  });
  it('seguir desde la última página ya leída va al final', () => {
    expect(reduceFlow(reading(5), { type: 'free.forward', isLastPage: true }).screen).toBe('end');
  });
  it('seguir solo vale mientras se lee', () => {
    const s = { ...initialFlow, screen: 'pageDone' as const };
    expect(reduceFlow(s, { type: 'free.forward', isLastPage: false })).toBe(s);
  });
});

describe('repaso por sílabas', () => {
  it('tileOrder es una permutación válida para 2 a 5 sílabas', () => {
    for (const n of [2, 3, 4, 5]) expect([...tileOrder(n)].sort()).toEqual(Array.from({ length: n }, (_, i) => i));
  });

  it('las fichas salen mezcladas (no en orden) y contienen las sílabas', () => {
    const t = tilesOf(WORDS[1]);
    expect(t).toEqual(['ñas', 'mon', 'ta']);
    expect([...t].sort()).toEqual([...WORDS[1].syllables].sort());
  });

  it('tocar la ficha correcta la coloca; una equivocada solo se sacude (wrong) y no penaliza', () => {
    let r = createReview(WORDS); // "puer·ta": fichas [ta, puer]
    r = tapTile(r, 0); // "ta" no es la primera
    expect(r.built).toEqual([]);
    expect(r.wrong).toBe(0);
    r = tapTile(r, 1); // "puer"
    expect(r.built).toEqual([1]);
    expect(r.wrong).toBeNull();
    r = tapTile(r, 1); // ya colocada: se ignora
    expect(r.built).toEqual([1]);
  });

  it('completar todas las palabras lleva a "end"; "siguiente" solo funciona con la palabra completa', () => {
    let s: FlowState = { ...initialFlow, screen: 'question', answer: 1 };
    s = reduceFlow(s, { type: 'question.finish', correctIndex: 1, words: WORDS });
    expect(reduceFlow(s, { type: 'review.next' })).toBe(s); // incompleta
    // palabra 1: puer·ta → fichas [ta(0), puer(1)] → tocar 1 y luego 0
    s = reduceFlow(reduceFlow(s, { type: 'review.tap', tile: 1 }), { type: 'review.tap', tile: 0 });
    s = reduceFlow(s, { type: 'review.next' });
    expect(s.review?.index).toBe(1);
    // palabra 2: mon·ta·ñas → fichas [ñas(0), mon(1), ta(2)] → 1, 2, 0
    for (const tile of [1, 2, 0]) s = reduceFlow(s, { type: 'review.tap', tile });
    s = reduceFlow(s, { type: 'review.next' });
    expect(s.screen).toBe('end');
    expect(s.review).toBeNull();
  });
});

describe('estadísticas', () => {
  it('precisión, estrellas (mínimo 1), palabras por minuto y duración', () => {
    expect(accuracyPercent(0, 144)).toBe(100);
    expect(accuracyPercent(16, 144)).toBe(89); // el 89 % del prototipo
    expect(accuracyPercent(500, 144)).toBe(0);
    expect(starsFor(95)).toBe(3);
    expect(starsFor(80)).toBe(2);
    expect(starsFor(10)).toBe(1);
    expect(wordsPerMinute(144, 272)).toBe(32);
    expect(formatDuration(272)).toBe('4:32');
  });
});

describe('los 20 estados del prototipo, derivados', () => {
  const reading = (actions: Parameters<typeof reduceSession>[1][]) => actions.reduce(reduceSession, createSessionState(20));
  const at = (screen: FlowState['screen']): FlowState => ({ ...initialFlow, screen });

  it('pantallas fuera de la lectura', () => {
    const idle = createSessionState(20);
    const expected: Array<[FlowState['screen'], number]> = [['select', 1], ['prep', 2], ['pageDone', 14], ['question', 15], ['end', 16], ['home', 17], ['progress', 18], ['review', 20]];
    for (const [screen, n] of expected) expect(screenStateNumber(at(screen), idle)).toBe(n);
  });

  it('estados de lectura según lo que pasa en el motor', () => {
    const start = { type: 'session.started' } as const;
    expect(screenStateNumber(at('reading'), reading([start]))).toBe(3); // esperando voz
    expect(screenStateNumber(at('reading'), reading([start, { type: 'word.correct', wordIndex: 0 }]))).toBe(4);
    expect(screenStateNumber(at('reading'), reading([start, { type: 'pause.detected', duration: 1800 }]))).toBe(5);
    expect(screenStateNumber(at('reading'), reading([start, { type: 'pause.detected', duration: 5200 }]))).toBe(6);
    expect(screenStateNumber(at('reading'), reading([start, { type: 'word.uncertain', wordIndex: 0 }]))).toBe(7);
    expect(screenStateNumber(at('reading'), reading([start, { type: 'word.incorrect', wordIndex: 0 }]))).toBe(8);
    expect(screenStateNumber(at('reading'), reading([start, { type: 'word.correct', wordIndex: 0 }, { type: 'word.repeated', wordIndex: 0 }]))).toBe(9);
    expect(screenStateNumber(at('reading'), reading([start, { type: 'word.skipped', wordIndex: 0 }]))).toBe(10);
    const help = reading([start, { type: 'help.requested', wordIndex: 2 }]);
    expect(screenStateNumber(at('reading'), help)).toBe(11);
    expect(screenStateNumber(at('reading'), help, true)).toBe(12);
    expect(screenStateNumber(at('reading'), reading([start, { type: 'pause.detected', duration: 5200 }, { type: 'word.correct', wordIndex: 0 }]))).toBe(13);
    expect(screenStateNumber(at('reading'), reading([start, { type: 'help.requested', wordIndex: 0, kind: 'read-start' }]))).toBe(19);
  });

  it('hay una etiqueta para cada uno de los 20 estados', () => {
    expect(SCREEN_STATE_LABELS).toHaveLength(20);
  });
});

describe('varias páginas', () => {
  const stats = (errorCount: number, wordCount: number, practicedKeys: string[]) => ({ errorCount, wordCount, practicedKeys });
  /** Lee una página entera y contesta su pregunta (con `wrongFirst` intentos equivocados antes de acertar). */
  const readPage = (s: FlowState, o: { isLastPage: boolean; stats: ReturnType<typeof stats>; wrongFirst?: number; words?: ReviewWord[] }): FlowState => {
    let r = reduceFlow(s, { type: 'reading.pageCompleted', stats: o.stats });
    r = reduceFlow(r, { type: 'question.open' });
    for (let i = 0; i < (o.wrongFirst ?? 0); i++) r = reduceFlow(r, { type: 'question.pick', index: i === 0 ? 0 : 2, correctIndex: 1 });
    r = reduceFlow(r, { type: 'question.pick', index: 1, correctIndex: 1 });
    return reduceFlow(r, { type: 'question.finish', correctIndex: 1, words: o.words ?? [], isLastPage: o.isLastPage });
  };
  const start = (pageIndex = 0) => play([{ type: 'story.select', pageIndex }, { type: 'prep.open' }, { type: 'reading.begin' }]);

  it('story.select abre la ficha en la página indicada y borra lo acumulado de sesiones anteriores', () => {
    const dirty = reduceFlow(start(), { type: 'reading.pageCompleted', stats: stats(2, 30, ['puerta']) });
    const s = reduceFlow(dirty, { type: 'story.select', pageIndex: 2 });
    expect(s).toMatchObject({ screen: 'select', pageIndex: 2, startPage: 2, attempts: 0, comprehension: { correct: 0, total: 0 } });
    expect(s.totals).toEqual({ pagesRead: 0, errorCount: 0, wordCount: 0, practicedKeys: [] });
    expect(reduceFlow(dirty, { type: 'story.select' }).pageIndex).toBe(0);
  });

  it('una página que no es la última pasa a la siguiente, en lectura y sin arrastrar la respuesta', () => {
    const s = readPage(start(), { isLastPage: false, stats: stats(1, 40, ['puerta']) });
    expect(s).toMatchObject({ screen: 'reading', pageIndex: 1, answer: null, attempts: 0, review: null });
    expect(s.totals).toEqual({ pagesRead: 1, errorCount: 1, wordCount: 40, practicedKeys: ['puerta'] });
  });

  it('acumula errores, palabras y palabras practicadas (sin repetidos) a lo largo de las páginas', () => {
    let s = readPage(start(), { isLastPage: false, stats: stats(1, 40, ['puerta', 'sendero']) });
    s = readPage(s, { isLastPage: false, stats: stats(2, 30, ['sendero', 'puente']) });
    expect(s.pageIndex).toBe(2);
    expect(s.totals).toEqual({ pagesRead: 2, errorCount: 3, wordCount: 70, practicedKeys: ['puerta', 'sendero', 'puente'] });
  });

  it('la última página va al repaso (o directo al final si no hay palabras)', () => {
    expect(readPage(start(), { isLastPage: true, stats: stats(0, 10, []), words: WORDS }).screen).toBe('review');
    expect(readPage(start(), { isLastPage: true, stats: stats(0, 10, []) }).screen).toBe('end');
  });

  it('comprensión: solo cuenta como acierto la respuesta correcta a la primera; equivocarse no penaliza ni bloquea', () => {
    let s = readPage(start(), { isLastPage: false, stats: stats(0, 10, []) }); // a la primera
    expect(s.comprehension).toEqual({ correct: 1, total: 1 });
    s = readPage(s, { isLastPage: false, stats: stats(0, 10, []), wrongFirst: 2 }); // dos intentos fallidos
    expect(s.comprehension).toEqual({ correct: 1, total: 2 });
    s = readPage(s, { isLastPage: true, stats: stats(0, 10, []), wrongFirst: 1 });
    expect(s.comprehension).toEqual({ correct: 1, total: 3 });
  });

  it('tocar dos veces la misma opción equivocada cuenta un solo intento', () => {
    let s = reduceFlow(reduceFlow(start(), { type: 'reading.pageCompleted' }), { type: 'question.open' });
    s = reduceFlow(reduceFlow(s, { type: 'question.pick', index: 0, correctIndex: 1 }), { type: 'question.pick', index: 0, correctIndex: 1 });
    expect(s.attempts).toBe(1);
  });

  it('una respuesta ya acertada no cambia los intentos', () => {
    let s = reduceFlow(reduceFlow(start(), { type: 'reading.pageCompleted' }), { type: 'question.open' });
    s = reduceFlow(s, { type: 'question.pick', index: 1, correctIndex: 1 });
    expect(reduceFlow(s, { type: 'question.pick', index: 2, correctIndex: 1 })).toBe(s);
  });

  it('página sin pregunta: page.next avanza sin tocar la comprensión; solo desde "página terminada"', () => {
    const done = reduceFlow(start(), { type: 'reading.pageCompleted', stats: stats(0, 10, []) });
    expect(reduceFlow(start(), { type: 'page.next', isLastPage: false, words: [] })).toEqual(start()); // no estaba en pageDone
    const next = reduceFlow(done, { type: 'page.next', isLastPage: false, words: [] });
    expect(next).toMatchObject({ screen: 'reading', pageIndex: 1, comprehension: { correct: 0, total: 0 } });
    expect(reduceFlow(done, { type: 'page.next', isLastPage: true, words: [] }).screen).toBe('end');
  });

  it('page.completed repetido (p. ej. desde el panel de desarrollo) no cuenta la página dos veces', () => {
    const once = reduceFlow(start(), { type: 'reading.pageCompleted', stats: stats(0, 10, []) });
    expect(reduceFlow(once, { type: 'reading.pageCompleted', stats: stats(0, 10, []) })).toBe(once);
  });

  it('restart empieza de cero: página 0 y sin acumulados', () => {
    const s = reduceFlow(readPage(start(), { isLastPage: false, stats: stats(1, 10, ['puerta']) }), { type: 'restart' });
    expect(s).toMatchObject({ screen: 'reading', pageIndex: 0, startPage: 0, comprehension: { correct: 0, total: 0 } });
    expect(s.totals.pagesRead).toBe(0);
  });

  it('reanudar en la página 2: la sesión cuenta desde ahí (startPage)', () => {
    const s = start(2);
    expect(s).toMatchObject({ screen: 'reading', pageIndex: 2, startPage: 2 });
  });

  it('salir a la ficha y volver a empezar es una sesión nueva en la página en que se quedó, sin doble conteo', () => {
    const mid = readPage(start(), { isLastPage: false, stats: stats(1, 40, ['puerta']) }); // ya en la página 1
    const back = play([{ type: 'go', screen: 'select' }, { type: 'prep.open' }, { type: 'reading.begin' }], mid);
    expect(back).toMatchObject({ screen: 'reading', pageIndex: 1, startPage: 1, comprehension: { correct: 0, total: 0 } });
    expect(back.totals).toEqual({ pagesRead: 0, errorCount: 0, wordCount: 0, practicedKeys: [] });
  });
});

describe('resumen de la sesión (docs/07: solo datos derivados)', () => {
  const story = { id: 'dev-tres-paginas', language: 'es' as const, level: 1, pageCount: 3 };
  const now = new Date('2026-09-25T20:00:00.000Z');
  const flow = (patch: Partial<FlowState>): FlowState => ({ ...initialFlow, ...patch });

  it('historia terminada: completion 1, palabras que costaron, comprensión y estrellas', () => {
    const f = flow({ comprehension: { correct: 2, total: 3 }, totals: { pagesRead: 3, errorCount: 4, wordCount: 100, practicedKeys: ['puente', 'sendero'] } });
    expect(buildSessionSummary({ story, flow: f, validReadingSeconds: 271.6, sessionSeconds: 300.2, now })).toEqual({
      storyId: 'dev-tres-paginas',
      language: 'es',
      level: 1,
      validReadingSeconds: 272,
      sessionSeconds: 300,
      comprehensionCorrect: 2,
      comprehensionTotal: 3,
      wordsHelped: ['puente', 'sendero'],
      completion: 1,
      stars: 3, // 96 % de precisión
      completedAt: '2026-09-25T20:00:00.000Z',
    });
  });

  it('con categoría en la historia: el resumen la incluye tal cual (logro "Aventurero")', () => {
    const s = buildSessionSummary({ story: { ...story, category: 'misterio' }, flow: flow({ totals: { pagesRead: 3, errorCount: 0, wordCount: 9, practicedKeys: [] } }), validReadingSeconds: 1, sessionSeconds: 1, now });
    expect(s.category).toBe('misterio');
  });

  it('a medias: completion parcial; reanudando en la página 2 cuentan como leídas las anteriores', () => {
    const one = buildSessionSummary({ story, flow: flow({ totals: { pagesRead: 1, errorCount: 0, wordCount: 30, practicedKeys: [] } }), validReadingSeconds: 40, sessionSeconds: 50, now });
    expect(one.completion).toBe(0.33);
    const resumed = buildSessionSummary({ story, flow: flow({ startPage: 1, totals: { pagesRead: 1, errorCount: 0, wordCount: 30, practicedKeys: [] } }), validReadingSeconds: 40, sessionSeconds: 50, now });
    expect(resumed.completion).toBe(0.67);
  });

  it('sin ninguna página leída no hay estrellas; completion nunca pasa de 1', () => {
    expect(buildSessionSummary({ story, flow: flow({}), validReadingSeconds: 0, sessionSeconds: 5, now })).not.toHaveProperty('stars');
    const over = buildSessionSummary({ story, flow: flow({ startPage: 2, totals: { pagesRead: 5, errorCount: 0, wordCount: 9, practicedKeys: [] } }), validReadingSeconds: 1, sessionSeconds: 1, now });
    expect(over.completion).toBe(1);
  });

  it('el resumen no contiene nada que no sea un dato derivado (sin audio ni texto reconocido)', () => {
    const keys = Object.keys(buildSessionSummary({ story, flow: flow({ totals: { pagesRead: 1, errorCount: 0, wordCount: 9, practicedKeys: [] } }), validReadingSeconds: 1, sessionSeconds: 1, now })).sort();
    expect(keys).toEqual(['completedAt', 'completion', 'comprehensionCorrect', 'comprehensionTotal', 'language', 'level', 'sessionSeconds', 'stars', 'storyId', 'validReadingSeconds', 'wordsHelped']);
  });
});

describe('almacén de progreso en memoria', () => {
  const summary = (storyId: string, completion: number, stars?: 1 | 2 | 3) => ({
    storyId, language: 'es' as const, level: 1, validReadingSeconds: 60, sessionSeconds: 70, comprehensionCorrect: 1, comprehensionTotal: 1, wordsHelped: [], completion, stars, completedAt: '2026-09-25T20:00:00.000Z',
  });

  it('guarda resúmenes en orden y los devuelve como copia', () => {
    const store = new MemoryProgressStore();
    store.saveSummary(summary('a', 1, 3));
    store.saveSummary(summary('b', 0.5));
    const list = store.summaries();
    expect(list.map((s) => s.storyId)).toEqual(['a', 'b']);
    list.pop();
    expect(store.summaries()).toHaveLength(2);
  });

  it('conserva solo los 200 resúmenes más recientes', () => {
    const store = new MemoryProgressStore();
    for (let i = 0; i < 205; i++) store.saveSummary(summary(`s${i}`, 1));
    expect(store.summaries()).toHaveLength(200);
    expect(store.summaries()[0].storyId).toBe('s5');
  });

  it('punto de reanudación por historia; "el más reciente" para Inicio; se puede borrar', () => {
    const store = new MemoryProgressStore();
    expect(store.latestResumePoint()).toBeNull();
    store.setResumePoint({ storyId: 'a', pageIndex: 1, updatedAt: '2026-09-25T10:00:00.000Z' });
    store.setResumePoint({ storyId: 'b', pageIndex: 0, updatedAt: '2026-09-25T11:00:00.000Z' });
    store.setResumePoint({ storyId: 'a', pageIndex: 2, updatedAt: '2026-09-25T09:00:00.000Z' });
    expect(store.resumePoint('a')?.pageIndex).toBe(2);
    expect(store.latestResumePoint()?.storyId).toBe('b');
    store.clearResumePoint('b');
    expect(store.latestResumePoint()?.storyId).toBe('a');
    expect(store.resumePoint('b')).toBeNull();
    expect(latestOf([])).toBeNull();
  });

  it('progreso por historia: terminada solo si alguna sesión llegó al final; mejores estrellas', () => {
    const list = [summary('a', 0.5, 2), summary('a', 1, 2), summary('a', 1, 3), summary('b', 0.66)];
    expect(storyProgress(list, 'a')).toEqual({ completed: true, stars: 3 });
    expect(storyProgress(list, 'b')).toEqual({ completed: false, stars: 0 });
    expect(storyProgress(list, 'zzz')).toEqual({ completed: false, stars: 0 });
  });
});

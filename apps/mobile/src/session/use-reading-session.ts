/**
 * Une el motor de lectura, el flujo de pantallas y la historia, y expone lo que la pantalla de lectura necesita. Es la
 * ÚNICA capa de la app nativa que conoce al motor: los componentes de `@lee-conmigo/ui-native` solo reciben estado y
 * callbacks (docs/02, regla de desacoplamiento).
 *
 * Versión nativa reducida de `apps/reader/src/use-session.ts` (RN-04, docs/11): mismo `FakeReadingEngine`, mismo
 * `reduceFlow` y mismo modelo de vista (`@lee-conmigo/ui-core`). Todavía SIN preguntas de comprensión ni repaso (RN-06):
 * al terminar una página se pasa a la siguiente y, tras la última, al fin. El progreso (resumen de la sesión y dónde
 * retomar) se guarda en el `ProgressStore` que se le pase — solo datos derivados (docs/07).
 * Cuando exista el motor de voz nativo (RN-07), se cambia aquí la línea que crea el motor.
 */
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { ReadingSessionState, ReadingTimerSnapshot, Story } from '@lee-conmigo/contracts';
import { FakeReadingEngine, vocabularyKey } from '@lee-conmigo/reading-engine';
import { buildSessionSummary, formatDuration, initialFlow, reduceFlow, selectCheckpointPages, type FlowAction, type ProgressStore } from '@lee-conmigo/session-engine';
import { reviewWordsFromKeys, tokenizePage, type StoryWord } from '@lee-conmigo/story-engine';
import { cleanWord, defaultPrefs, deriveReadingView, effortReason, effortStars, kiteMeters, type Energy, type FocusSelfReport, type ReaderPrefs } from '@lee-conmigo/ui-core';
import { speak, stopSpeaking } from '../tts';
import { canNavigate, creditedMs, tickDelta } from './free-clock';

/** Cuánto se ve el aviso de "página completa" antes de seguir sola (igual que en la app web). */
const PAGE_DONE_MS = 600;
/** En lectura libre no hay aviso que esperar: se sigue casi enseguida (un instante, para que el reloj y la pausa de movimiento alcancen a verse). */
const FREE_PAGE_DONE_MS = 200;
/** Cuánto se ve la ayuda del coach en lectura libre. */
const FREE_HINT_MS = 8000;

/** Claves de vocabulario (sin repetidos) de las palabras de la página que costaron o necesitaron ayuda. */
const practicedKeysOf = (indices: number[], words: StoryWord[]): string[] => [...new Set(indices.map((i) => vocabularyKey(words[i]?.text ?? '')).filter(Boolean))];

export interface DevSimulation {
  label: string;
  run: () => void;
}

export interface ReadingSessionOptions {
  store: ProgressStore;
  prefs?: ReaderPrefs;
  /** Reloj inyectable (pruebas). */
  now?: () => Date;
  /** Energía con la que llegó hoy (B2); se guarda en el resumen. */
  energy?: Energy;
  /** Meta diaria del padre (min): para el "sello del día" del cierre. */
  dailyGoalMinutes?: number;
  /** Empezar en lectura libre (ajuste de padres, P4): sin micrófono, la página se pasa con un botón. */
  freeReading?: boolean;
  /** Quedarse en "página completa" sin pasar a la siguiente (mientras dura una pausa de movimiento, B12). */
  holdAtPageEnd?: boolean;
  /** Prepared editions opt into the shared comprehension and syllable-review flow. */
  enablePractice?: boolean;
}

export function useReadingSession(story: Story, options: ReadingSessionOptions) {
  const { store, prefs = defaultPrefs, now = () => new Date(), energy, dailyGoalMinutes = 15 } = options;
  const clockRef = useRef(now);
  clockRef.current = now;
  const [engine] = useState(() => new FakeReadingEngine());
  // Se retoma donde se quedó (a nivel de página), como en la app web.
  const [flow, dispatch] = useReducer(reduceFlow, null, () => {
    const start = Math.min(store.resumePoint(story.id)?.pageIndex ?? 0, story.pages.length - 1);
    return { ...initialFlow, screen: 'prep' as const, pageIndex: start, startPage: start };
  });
  const pageIndex = Math.min(flow.pageIndex, story.pages.length - 1);
  const page = story.pages[pageIndex];
  const isLastPage = pageIndex === story.pages.length - 1;
  const words = useMemo(() => tokenizePage(page), [page]);
  const checkpointPages = useMemo(() => selectCheckpointPages(story.pages), [story]);
  const checkpoint = options.enablePractice && checkpointPages.has(pageIndex) ? (page.checkpoint?.variants.find(v => v.audience === prefs.audience) ?? page.checkpoint?.variants[0]) : undefined;
  const answeredPages = useRef(new Set<number>());
  const helpedKeys = useRef(new Set<string>());
  const [reading, setReading] = useState<ReadingSessionState>(engine.getState());
  const [timer, setTimer] = useState<ReadingTimerSnapshot>(engine.getTimerSnapshot());
  const [auto, setAuto] = useState(false);
  /**
   * Problema con la voz que impide escuchar (Kitewise G11). Por ahora solo se simula desde el panel DEV; el motor real lo
   * informará en RN-07 (`SpeechEngine.onError`, código `permission-denied`/`not-available`). Nunca se cae a la nube (D1).
   */
  const [voiceProblem, setVoiceProblem] = useState<'permission-denied' | 'not-available' | null>(null);
  /** "Modo libre": se lee sin micrófono y se pasa de página con un botón (como el modo lectura libre de la app web). */
  const [freeReading, setFreeReading] = useState(options.freeReading ?? false);
  /** El niño cerró la tarjeta de pausa larga ("Seguir leyendo"): no se vuelve a mostrar hasta la próxima pausa larga. */
  const [pauseDismissed, setPauseDismissed] = useState(false);
  /** Instante en que se cargó la página actual (modo libre: el tiempo real leído se acredita al pasar de página). */
  const pageStartedAt = useRef(now().getTime());
  /**
   * Reloj de lectura libre (`free-clock.ts`): milisegundos ACTIVOS en la página actual (pantalla de lectura y app en primer plano), el último
   * pulso del reloj y el último cambio de página (anti doble toque).
   */
  const freeClock = useRef({ pageMs: 0, lastTick: now().getTime(), lastNavAt: null as number | null });
  const [freePageMs, setFreePageMs] = useState(0);
  /** Páginas ya leídas en esta sesión (las anteriores a la de partida cuentan como leídas): volver a una y seguir no la cuenta de nuevo. */
  const completedPages = useRef(new Set<number>());

  const wordsRef = useRef(words);
  wordsRef.current = words;
  const flowRef = useRef(flow);
  flowRef.current = flow;
  const freeRef = useRef(freeReading);
  freeRef.current = freeReading;
  /** Ya se guardó el resumen de esta sesión (para no guardarlo dos veces). */
  const summarySaved = useRef(false);
  /** Esfuerzo de la sesión para las estrellas del cierre (D11): ¿pidió ayuda o reintentó? ¿cuántas pausas largas? */
  const effort = useRef({ helpedOrRetried: false, longPauses: 0 });

  const saveResume = (pageIndex: number) => store.setResumePoint({ storyId: story.id, pageIndex, updatedAt: now().toISOString() });

  /**
   * Guarda el resumen de la sesión en curso (una sola vez; sin páginas leídas no hay nada que guardar). Las estrellas son
   * las de ESFUERZO (D11), no las de precisión que calcula `buildSessionSummary` para la app web.
   */
  const persistSession = (focusSelfReport?: FocusSelfReport) => {
    const f = flowRef.current;
    const t = engine.getTimerSnapshot();
    if (summarySaved.current || (f.totals.pagesRead === 0 && !(options.enablePractice && (t.validSeconds > 0 || helpedKeys.current.size > 0)))) return;
    const base = buildSessionSummary({
      story: { id: story.id, language: story.language, level: story.level, pageCount: story.pages.length, category: story.category },
      flow: f,
      validReadingSeconds: t.validSeconds,
      sessionSeconds: t.sessionSeconds,
      now: now(),
    });
    const stars = effortStars({ completed: base.completion >= 1, ...effort.current });
    const { stars: _accuracyStars, ...rest } = base;
    store.saveSummary({ ...rest, readingMode: freeRef.current ? 'free' : 'simulated', wordsHelped: [...new Set([...rest.wordsHelped, ...helpedKeys.current])], ...(stars ? { stars } : {}), ...(focusSelfReport ? { focusSelfReport } : {}), ...(energy ? { energy } : {}) });
    summarySaved.current = true;
    if (options.enablePractice && f.screen === 'end') store.clearResumePoint(story.id);
  };
  const screenRef = useRef(flow.screen);
  screenRef.current = flow.screen;

  // --- el motor avisa; la app reacciona -----------------------------------------------------------
  useEffect(() => {
    const off = engine.subscribe((event, state) => {
      setReading(state);
      if (event?.type === 'help.requested' || event?.type === 'word.repeated' || state.recovered) effort.current.helpedOrRetried = true;
      if (event?.type === 'pause.detected' && state.pause === 'long') effort.current.longPauses += 1;
      if (event?.type === 'page.completed') {
        completedPages.current.add(flowRef.current.pageIndex);
        const w = wordsRef.current;
        dispatch({ type: 'reading.pageCompleted', stats: { errorCount: state.errorCount, wordCount: w.length, practicedKeys: practicedKeysOf(state.practicedWordIndices, w) } });
      }
    });
    const tick = setInterval(() => {
      setTimer(engine.getTimerSnapshot());
      setAuto(engine.isAutoReading);
      // Lectura libre: el reloj corre solo mientras se lee con la app a la vista (el segundo plano no suma).
      const t = clockRef.current().getTime();
      const dt = tickDelta(freeClock.current.lastTick, t);
      freeClock.current.lastTick = t;
      if (dt > 0 && freeRef.current && screenRef.current === 'reading' && AppState.currentState === 'active') {
        freeClock.current.pageMs += dt;
        setFreePageMs(freeClock.current.pageMs);
      }
    }, 250);
    return () => {
      off();
      clearInterval(tick);
      engine.dispose();
      stopSpeaking();
    };
  }, [engine]);

  // docs/03 y docs/06: si la app pasa a segundo plano se pausa la lectura y el temporizador de inmediato; al volver, el
  // tiempo solo se reanuda tras leer de nuevo.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') engine.resume();
      else if (screenRef.current === 'reading') engine.suspend();
    });
    return () => sub.remove();
  }, [engine]);

  /** Aplica una acción del flujo; si con ella se pasa a otra página, el motor carga la página nueva. */
  const advance = (action: FlowAction) => {
    const next = reduceFlow(flow, action);
    if (next === flow) return;
    dispatch(action);
    if (next.screen === 'reading' && next.pageIndex !== flow.pageIndex) {
      goToPage(next.pageIndex);
    }
  };

  const reviewItems = () => reviewWordsFromKeys(story, [...flowRef.current.totals.practicedKeys, ...helpedKeys.current]).map(key => ({ key, syllables: story.vocabulary[key].syllables! }));

  /** Carga una página en el motor y deja el reloj de la página en cero. */
  const goToPage = (index: number) => {
    engine.loadPage(tokenizePage(story.pages[index]));
    pageStartedAt.current = now().getTime();
    freeClock.current.pageMs = 0;
    setFreePageMs(0);
    saveResume(index);
  };

  // Prepared editions use at most three checkpoints at natural page boundaries; other stories retain their existing flow.
  useEffect(() => {
    if (flow.screen !== 'pageDone' || options.holdAtPageEnd) return;
    const id = setTimeout(() => {
      if (checkpoint && !answeredPages.current.has(pageIndex)) advance({ type: 'question.open' });
      else advance({ type: 'page.next', words: options.enablePractice && isLastPage ? reviewItems() : [], isLastPage });
    }, freeReading ? FREE_PAGE_DONE_MS : PAGE_DONE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.screen, options.holdAtPageEnd]);

  // Al terminar la historia: se cierra el temporizador y ya no hay nada que retomar. El resumen se guarda al cerrar el
  // cierre (B13), con la carita de enfoque que elija el niño (o sin ella si sale con Volver).
  useEffect(() => {
    if (flow.screen !== 'end') return;
    engine.simulate.completeStory();
    if (!options.enablePractice) store.clearResumePoint(story.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.screen, engine]);

  // Cuando la pausa larga termina, la tarjeta vuelve a poder mostrarse en la siguiente.
  useEffect(() => {
    if (reading.pause !== 'long') setPauseDismissed(false);
  }, [reading.pause]);

  const resetFreeClock = (startPage: number) => {
    freeClock.current = { pageMs: 0, lastTick: now().getTime(), lastNavAt: null };
    setFreePageMs(0);
    completedPages.current = new Set(Array.from({ length: startPage }, (_, i) => i));
  };

  const begin = () => {
    summarySaved.current = false;
    effort.current = { helpedOrRetried: false, longPauses: 0 };
    helpedKeys.current.clear();
    answeredPages.current.clear();
    resetFreeClock(flow.pageIndex);
    pageStartedAt.current = now().getTime();
    engine.startSession(words);
    saveResume(flow.pageIndex);
    dispatch({ type: 'reading.begin' });
  };

  const restart = () => {
    summarySaved.current = false;
    effort.current = { helpedOrRetried: false, longPauses: 0 };
    helpedKeys.current.clear();
    answeredPages.current.clear();
    resetFreeClock(0);
    engine.simulate.autoRead(false);
    engine.startSession(tokenizePage(story.pages[0]));
    saveResume(0);
    dispatch({ type: 'restart' });
  };

  /** Salir de la lectura (botón Volver): lo leído hasta ahora cuenta y queda guardado dónde retomar. */
  const leave = () => {
    if (flowRef.current.screen === 'reading') creditFreePage(); // lo que se alcanzó a leer de esta página también cuenta
    persistSession();
    engine.simulate.autoRead(false);
    engine.stopSession();
    stopSpeaking();
  };

  /** Acredita al motor el tiempo activo de la página actual (con tope, `free-clock.ts`) y deja el reloj de la página en cero. Solo en lectura libre. */
  const creditFreePage = () => {
    if (!freeRef.current) return;
    const ms = creditedMs(freeClock.current.pageMs, wordsRef.current.length);
    freeClock.current.pageMs = 0;
    setFreePageMs(0);
    if (ms <= 0) return;
    const from = engine.timer.machine.confirmedMs;
    engine.timer.machine.ingest({ fromMs: from, toMs: from + ms, valid: true });
    setTimer(engine.getTimerSnapshot());
  };

  /**
   * Modo libre: el niño (o el padre) confirma con un botón que la página ya se leyó. Se acredita el tiempo ACTIVO de la página (con tope) y se
   * termina la página por el mismo camino que el panel DEV. Si la página ya se había leído (se volvió atrás), solo se sigue: no cuenta dos veces.
   */
  const freeAdvance = () => {
    const f = flowRef.current;
    const t = now().getTime();
    if (f.screen !== 'reading' || !canNavigate(freeClock.current.lastNavAt, t)) return;
    freeClock.current.lastNavAt = t;
    creditFreePage();
    if (completedPages.current.has(f.pageIndex)) {
      if (checkpoint && !answeredPages.current.has(f.pageIndex)) {
        dispatch({ type: 'question.open' });
        return;
      }
      const last = f.pageIndex === story.pages.length - 1;
      dispatch({ type: 'free.forward', isLastPage: last, words: options.enablePractice && last ? reviewItems() : [] });
      if (!last) goToPage(f.pageIndex + 1);
    } else {
      engine.simulate.completePage();
    }
  };

  /** Modo libre: volver a la página anterior (sin repetir preguntas ni perder lo leído). En la primera página no hace nada. */
  const freeBack = () => {
    const f = flowRef.current;
    const t = now().getTime();
    if (f.screen !== 'reading' || f.pageIndex <= 0 || !canNavigate(freeClock.current.lastNavAt, t)) return;
    freeClock.current.lastNavAt = t;
    creditFreePage();
    dispatch({ type: 'free.back' });
    goToPage(f.pageIndex - 1);
  };

  const startFreeReading = () => {
    freeClock.current = { pageMs: 0, lastTick: now().getTime(), lastNavAt: null };
    setFreePageMs(0);
    setFreeReading(true);
    setVoiceProblem(null);
    engine.simulate.autoRead(false);
  };

  /** Datos del cierre (B13), derivados de lo que realmente pasó en la sesión. */
  const closing = (() => {
    if (flow.screen !== 'end') return null;
    const valid = timer.validSeconds;
    const today = now().toISOString().slice(0, 10);
    const todaySeconds = store.summaries().filter((x) => x.completedAt.slice(0, 10) === today).reduce((n, x) => n + x.validReadingSeconds, 0) + (summarySaved.current ? 0 : valid);
    return {
      stars: effortStars({ completed: true, ...effort.current }),
      reason: effortReason(effort.current),
      minutes: Math.max(1, Math.round(valid / 60)),
      kiteMeters: kiteMeters(valid),
      /** Sello del día: la lectura de hoy ya llegó a la meta del padre. */
      dailyStamp: todaySeconds >= dailyGoalMinutes * 60,
      /** Palabras que costaron: vuelven en el repaso. */
      returning: new Set([...flow.totals.practicedKeys, ...helpedKeys.current]).size,
    };
  })();

  const current = reading.hasHeardVoice ? words[Math.min(reading.currentWordIndex, words.length - 1)] : undefined;

  const helpWord = reading.helpWordIndex !== null ? words[reading.helpWordIndex] : undefined;
  const helpKey = helpWord ? vocabularyKey(helpWord.text) : '';

  const pronounce = () => {
    if (helpWord) speak(cleanWord(helpWord.text), story.language);
  };

  const sim = engine.simulate;
  const simulations: DevSimulation[] = [
    { label: 'Palabra correcta', run: sim.correct },
    { label: 'Pausa corta', run: sim.pauseShort },
    { label: 'Pausa larga', run: sim.pauseLong },
    { label: 'Palabra dudosa', run: sim.uncertain },
    { label: 'Palabra incorrecta', run: sim.incorrect },
    { label: 'Palabra repetida', run: sim.repeated },
    { label: 'Palabra saltada', run: sim.skipped },
    { label: 'Pide ayuda', run: () => engine.requestHelp() },
    { label: 'Léeme el comienzo', run: () => engine.requestReadStart() },
    { label: 'Terminar página', run: sim.completePage },
    {
      label: 'Sin micrófono',
      run: () => {
        sim.autoRead(false);
        setVoiceProblem('permission-denied');
      },
    },
    { label: 'Reiniciar', run: restart },
  ];

  return {
    story,
    page,
    pageIndex,
    words,
    flow,
    reading,
    prefs,
    view: deriveReadingView({ screen: flow.screen, reading, words, prefs, freeReading, language: story.language === 'en' ? 'en' : 'es' }),
    /** Tiempo LEÍDO (docs/06: cuenta hacia arriba; solo avanza con lectura válida). */
    elapsed: formatDuration(timer.validSeconds + (freeReading && flow.screen === 'reading' ? creditedMs(freePageMs, words.length) / 1000 : 0)),
    help: helpWord ? { word: cleanWord(helpWord.text), entry: story.vocabulary[helpKey] } : null,
    /** Párrafo que se está leyendo (para atenuar los siguientes); `null` antes de oír la voz. */
    currentParagraph: current ? { block: current.blockIndex, line: current.lineIndex } : null,
    voiceProblem,
    freeReading,
    /** Lectura libre: ¿se puede volver a una página anterior? */
    canGoBack: freeReading && pageIndex > 0,
    /** Lectura libre: la ayuda del coach («toca › para seguir») solo se ve unos segundos al llegar a la página de partida; después tapaba el texto. */
    freeHintVisible: freeReading && pageIndex === flow.startPage && freePageMs < FREE_HINT_MS,
    closing,
    checkpoint,
    /** Tarjeta "Te espero…" de la pausa larga (B11). Nunca en modo libre: nadie le habla al micrófono. */
    showPauseCard: flow.screen === 'reading' && reading.pause === 'long' && !pauseDismissed && !freeReading && reading.helpWordIndex === null,
    actions: {
      rememberWord: (key: string) => {
        helpedKeys.current.add(key);
        effort.current.helpedOrRetried = true;
      },
      answerQuestion: (index: number) => {
        if (checkpoint && flowRef.current.screen === 'question') dispatch({ type: 'question.pick', index, correctIndex: checkpoint.correctIndex });
      },
      continueQuestion: () => {
        if (!checkpoint || flowRef.current.screen !== 'question' || flowRef.current.answer !== checkpoint.correctIndex) return;
        answeredPages.current.add(pageIndex);
        advance({ type: 'question.finish', correctIndex: checkpoint.correctIndex, isLastPage, words: isLastPage ? reviewItems() : [] });
      },
      reviewTap: (tile: number) => dispatch({ type: 'review.tap', tile }),
      reviewNext: () => {
        if (flowRef.current.screen !== 'review') return;
        advance({ type: 'review.next' });
      },
      begin,
      restart,
      leave,
      tapWord: (i: number) => engine.requestHelp(i),
      closeHelp: () => engine.closeHelp(),
      pronounce,
      askHelp: () => engine.requestHelp(),
      readStart: () => engine.requestReadStart(),
      dismissPause: () => setPauseDismissed(true),
      /** "Listo" en el cierre: guarda el resumen con la carita de enfoque elegida. */
      finish: (focus?: FocusSelfReport) => persistSession(focus),
      freeAdvance,
      freeBack,
      startFreeReading,
      /** "Pedir permiso": con el motor real abrirá el permiso del sistema (RN-07). Con el simulador solo cierra el aviso. */
      requestVoicePermission: () => setVoiceProblem(null),
    },
    dev: {
      simulations,
      auto,
      toggleAuto: () => {
        if (auto) return sim.autoRead(false);
        if (flow.screen !== 'reading') begin();
        sim.autoRead(true);
      },
    },
  };
}

export type ReadingSession = ReturnType<typeof useReadingSession>;

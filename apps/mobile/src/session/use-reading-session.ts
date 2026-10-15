/**
 * Une el motor de lectura, el flujo de pantallas y la historia, y expone lo que la pantalla de lectura necesita. Es la
 * ÚNICA capa de la app nativa que conoce al motor: los componentes de `@lee-conmigo/ui-native` solo reciben estado y
 * callbacks (docs/02, regla de desacoplamiento).
 *
 * Versión nativa reducida de `apps/reader/src/use-session.ts` (RN-04, docs/11): mismo `FakeReadingEngine`, mismo
 * `reduceFlow` y mismo modelo de vista (`@lee-conmigo/ui-core`). Todavía SIN preguntas de comprensión, repaso ni
 * progreso guardado (RN-06/RN-08): al terminar una página se pasa a la siguiente y, tras la última, al fin.
 * Cuando exista el motor de voz nativo (RN-07), se cambia aquí la línea que crea el motor.
 */
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { ReadingSessionState, ReadingTimerSnapshot, Story } from '@lee-conmigo/contracts';
import { FakeReadingEngine, vocabularyKey } from '@lee-conmigo/reading-engine';
import { formatDuration, initialFlow, reduceFlow, type FlowAction } from '@lee-conmigo/session-engine';
import { tokenizePage, type StoryWord } from '@lee-conmigo/story-engine';
import { cleanWord, defaultPrefs, deriveReadingView, type ReaderPrefs } from '@lee-conmigo/ui-core';
import { speak, stopSpeaking } from '../tts';

/** Cuánto se ve el aviso de "página completa" antes de seguir sola (igual que en la app web). */
const PAGE_DONE_MS = 600;

/** Claves de vocabulario (sin repetidos) de las palabras de la página que costaron o necesitaron ayuda. */
const practicedKeysOf = (indices: number[], words: StoryWord[]): string[] => [...new Set(indices.map((i) => vocabularyKey(words[i]?.text ?? '')).filter(Boolean))];

export interface DevSimulation {
  label: string;
  run: () => void;
}

export function useReadingSession(story: Story, prefs: ReaderPrefs = defaultPrefs) {
  const [engine] = useState(() => new FakeReadingEngine());
  const [flow, dispatch] = useReducer(reduceFlow, { ...initialFlow, screen: 'prep' });
  const pageIndex = Math.min(flow.pageIndex, story.pages.length - 1);
  const page = story.pages[pageIndex];
  const isLastPage = pageIndex === story.pages.length - 1;
  const words = useMemo(() => tokenizePage(page), [page]);
  const [reading, setReading] = useState<ReadingSessionState>(engine.getState());
  const [timer, setTimer] = useState<ReadingTimerSnapshot>(engine.getTimerSnapshot());
  const [auto, setAuto] = useState(false);

  const wordsRef = useRef(words);
  wordsRef.current = words;
  const screenRef = useRef(flow.screen);
  screenRef.current = flow.screen;

  // --- el motor avisa; la app reacciona -----------------------------------------------------------
  useEffect(() => {
    const off = engine.subscribe((event, state) => {
      setReading(state);
      if (event?.type === 'page.completed') {
        const w = wordsRef.current;
        dispatch({ type: 'reading.pageCompleted', stats: { errorCount: state.errorCount, wordCount: w.length, practicedKeys: practicedKeysOf(state.practicedWordIndices, w) } });
      }
    });
    const tick = setInterval(() => {
      setTimer(engine.getTimerSnapshot());
      setAuto(engine.isAutoReading);
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
    if (next.screen === 'reading' && next.pageIndex !== flow.pageIndex) engine.loadPage(tokenizePage(story.pages[next.pageIndex]));
  };

  // Al terminar una página, seguir sola tras el aviso. TODO(RN-06): pregunta de comprensión y repaso por sílabas.
  useEffect(() => {
    if (flow.screen !== 'pageDone') return;
    const id = setTimeout(() => advance({ type: 'page.next', words: [], isLastPage }), PAGE_DONE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.screen]);

  useEffect(() => {
    if (flow.screen === 'end') engine.simulate.completeStory();
  }, [flow.screen, engine]);

  const begin = () => {
    engine.startSession(words);
    dispatch({ type: 'reading.begin' });
  };

  const restart = () => {
    engine.simulate.autoRead(false);
    engine.startSession(tokenizePage(story.pages[0]));
    dispatch({ type: 'restart' });
  };

  const leave = () => {
    engine.simulate.autoRead(false);
    engine.stopSession();
    stopSpeaking();
  };

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
    view: deriveReadingView({ screen: flow.screen, reading, words, prefs }),
    /** Tiempo LEÍDO (docs/06: cuenta hacia arriba; solo avanza con lectura válida). */
    elapsed: formatDuration(timer.validSeconds),
    help: helpWord ? { word: cleanWord(helpWord.text), entry: story.vocabulary[helpKey] } : null,
    actions: {
      begin,
      restart,
      leave,
      tapWord: (i: number) => engine.requestHelp(i),
      closeHelp: () => engine.closeHelp(),
      pronounce,
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

/**
 * Une el motor de lectura (FakeReadingEngine), el flujo de pantallas, las historias y el progreso guardado, y
 * expone lo que la interfaz necesita. Es la ÚNICA capa que conoce al motor: los componentes de
 * `@lee-conmigo/ui` solo reciben estado y callbacks. Cuando exista el motor real, se cambia aquí la línea que
 * crea el `FakeReadingEngine`.
 *
 * Qué se guarda (docs/07): solo datos derivados. Al terminar (o dejar a medias) una sesión, su resumen; y el
 * punto de reanudación de cada historia a medias (a nivel de página). Nunca audio ni texto reconocido.
 */
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ReadingEvent, ReadingProfile, ReadingSessionState, ReadingTimerSnapshot, Story } from '@lee-conmigo/contracts';
import { FakeReadingEngine, RealReadingEngine, vocabularyKey } from '@lee-conmigo/reading-engine';
import { WhisperSpeechEngine } from '@lee-conmigo/speech-engine';
import {
  accuracyPercent,
  buildSessionSummary,
  formatDuration,
  initialFlow,
  reduceFlow,
  screenStateNumber,
  selectCheckpointPages,
  starsFor,
  storyProgress,
  wordsPerMinute,
  type FlowAction,
  type FlowState,
  type ProgressStore,
  type ReviewWord,
} from '@lee-conmigo/session-engine';
import { blocksBeforePage, pickVariants, pilotStory, reviewWordsFromKeys, tokenizePage, toCatalogEntry, type StoryRepository, type StoryWord } from '@lee-conmigo/story-engine';
import { cleanWord, copy, defaultPrefs, readingMinutesOfWordCount, type DevSim, type EndStat, type LibraryEntry, type ReaderPrefs, type SessionActions, type StoryCard } from '@lee-conmigo/ui';
import { buildPreset } from './dev-presets.ts';
import { DEV_TOOLS, FLAGS, REAL_VOICE } from './flags.ts';
import { demoOtherStories } from './mock-data.ts';
import { speak } from './tts.ts';
import { DEFAULT_PROFILE } from './profile.ts';

const describeEvent = (e: ReadingEvent): string => {
  const extra: string[] = [];
  if ('wordIndex' in e) extra.push(`wordIndex: ${e.wordIndex}`);
  if ('duration' in e) extra.push(`duration: ${e.duration}`);
  if (e.type === 'help.requested' && e.kind) extra.push(`kind: "${e.kind}"`);
  return extra.length ? `${e.type} { ${extra.join(', ')} }` : e.type;
};

/** Claves de vocabulario (sin repetidos) de las palabras de la página que costaron o necesitaron ayuda. */
const practicedKeysOf = (indices: number[], words: StoryWord[]): string[] => [...new Set(indices.map((i) => vocabularyKey(words[i]?.text ?? '')).filter(Boolean))];

/** Cuántas tarjetas tiene la cuadrícula "Mis historias" del diseño. */
const HOME_GRID_SLOTS = 4;

/** Cuánto se ve el aviso de "página completa" antes de seguir sola: coincide con su animación (`animate-pop`, 0.5 s) más un margen. */
const PAGE_DONE_MS = 600;

export interface SessionDeps {
  repository: StoryRepository;
  store: ProgressStore;
  /** Idioma y nivel de lectura del niño (por defecto español, nivel 1). TEMPORAL: docs/09 #3. */
  profile?: ReadingProfile;
  /** Se llama cuando cambia el perfil (para recordarlo). */
  onProfileChange?: (profile: ReadingProfile) => void;
  /** Reloj inyectable (pruebas). */
  now?: () => Date;
  /** "Modo lectura libre" (Modo padres): el padre lee y avanza de página con un botón, sin motor de voz. */
  freeReading?: boolean;
}

export function useSession({ repository, store, profile: initialProfile = DEFAULT_PROFILE, onProfileChange, now = () => new Date(), freeReading = false }: SessionDeps) {
  const catalog = useMemo(() => repository.list(), [repository]);
  const [profile, setProfileState] = useState<ReadingProfile>(initialProfile);
  // Una tarjeta por historia: la variante que corresponde al idioma y nivel del perfil (las de prueba, fuera).
  const variants = useMemo(() => pickVariants(catalog.filter((c) => !c.dev), profile), [catalog, profile]);
  const firstPublic = variants[0] ?? catalog[0];
  if (!firstPublic) throw new Error('No hay ninguna historia disponible');

  // Solo desarrollo: `?story=<id>` elige la historia inicial, y `?screen=<n>` (los 20 estados del prototipo) usa la piloto, que es
  // la de esos estados.
  const [storyId, setStoryId] = useState(() => {
    if (DEV_TOOLS && typeof location !== 'undefined') {
      const q = new URLSearchParams(location.search);
      const wanted = q.get('story') ?? (q.get('screen') ? pilotStory.id : null);
      if (wanted && repository.get(wanted)) return wanted;
    }
    return firstPublic.id;
  });
  const story = (repository.get(storyId) ?? repository.get(firstPublic.id)) as Story;
  const [flow, dispatch] = useReducer(reduceFlow, initialFlow);
  const pageIndex = Math.min(flow.pageIndex, story.pages.length - 1);
  const page = story.pages[pageIndex];
  const isLastPage = pageIndex === story.pages.length - 1;
  const words = useMemo(() => tokenizePage(page), [page]);

  // Como mucho 3 preguntas de comprensión por historia (ver `selectCheckpointPages`): el resto de las páginas con
  // checkpoint se leen seguidas, sin interrumpir.
  const checkpointPageIndices = useMemo(() => selectCheckpointPages(story.pages), [story]);

  // En "modo lectura libre" nunca se usa el motor de voz (ni siquiera si VITE_REAL_VOICE=1 está activo): el padre
  // avanza de página con un botón (`freeAdvance`, más abajo), así que no hace falta pedir el micrófono.
  const [engine] = useState(() =>
    REAL_VOICE && !freeReading ? new RealReadingEngine(new WhisperSpeechEngine(), { language: story.language }) : new FakeReadingEngine(),
  );
  const [reading, setReading] = useState<ReadingSessionState>(engine.getState());
  const [timer, setTimer] = useState<ReadingTimerSnapshot>(engine.getTimerSnapshot());
  const [log, setLog] = useState<string[]>([]);
  const [prefs, setPrefs] = useState<ReaderPrefs>(defaultPrefs);
  const [collapsed, setCollapsed] = useState(false);
  const [storyHidden, setStoryHidden] = useState(false);
  const [pronounceNonce, setPronounceNonce] = useState(0);
  const [pronouncing, setPronouncing] = useState(false);
  const [auto, setAuto] = useState(false);
  const [demoSeconds, setDemoSeconds] = useState<number | null>(null);
  const [homeDemo, setHomeDemo] = useState(false);
  const jumpToRef = useRef<(n: number) => void>(() => {});

  // Lo que los callbacks del motor y de la pestaña necesitan ver "ahora", no el valor de cuando se registraron.
  const wordsRef = useRef(words);
  wordsRef.current = words;
  const flowRef = useRef(flow);
  flowRef.current = flow;
  const storyRef = useRef(story);
  storyRef.current = story;
  /** Ya se guardó el resumen de esta sesión (para no guardarlo dos veces). */
  const summarySaved = useRef(false);
  /** Se saltó con el panel de desarrollo: esos estados son de mentira y NO se guardan. */
  const devJumped = useRef(false);
  /** "Modo lectura libre": instante en que se cargó la página actual, para acreditar el tiempo real leído al avanzar a mano. */
  const pageStartedAt = useRef(now().getTime());

  // --- el motor avisa; la app reacciona ------------------------------------------------------
  useEffect(() => {
    const off = engine.subscribe((event, state) => {
      setReading(state);
      if (!event) return;
      setLog((prev) => [describeEvent(event), ...prev].slice(0, 8));
      if (event.type === 'page.completed') {
        const w = wordsRef.current;
        dispatch({ type: 'reading.pageCompleted', stats: { errorCount: state.errorCount, wordCount: w.length, practicedKeys: practicedKeysOf(state.practicedWordIndices, w) } });
      }
    });
    const tick = window.setInterval(() => {
      setTimer(engine.getTimerSnapshot());
      setAuto(engine.isAutoReading);
    }, 250);
    return () => {
      off();
      window.clearInterval(tick);
      engine.dispose();
    };
  }, [engine]);

  // docs/03 y docs/06: si la app deja de estar en primer plano se pausa la lectura, el temporizador y (con el
  // motor real) el micrófono de inmediato; al volver, el tiempo solo se reanuda tras leer de nuevo.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        if (flowRef.current.screen === 'reading') engine.suspend();
      } else {
        engine.resume();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [engine]);

  // --- progreso guardado ---------------------------------------------------------------------
  const saveResume = (id: string, index: number) => store.setResumePoint({ storyId: id, pageIndex: index, updatedAt: now().toISOString() });

  /** Guarda el resumen de la sesión en curso (una sola vez). Sin páginas leídas o con un salto de desarrollo: nada. */
  const persistSession = () => {
    const f = flowRef.current;
    if (devJumped.current || summarySaved.current || f.totals.pagesRead === 0) return;
    summarySaved.current = true;
    const s = storyRef.current;
    const t = engine.getTimerSnapshot();
    store.saveSummary(buildSessionSummary({ story: { id: s.id, language: s.language, level: s.level, pageCount: s.pages.length, category: s.category }, flow: f, validReadingSeconds: t.validSeconds, sessionSeconds: t.sessionSeconds, now: now() }));
  };

  // Al terminar la historia: se cierra el temporizador, se guarda el resumen y ya no hay nada que reanudar.
  useEffect(() => {
    if (flow.screen !== 'end') return;
    engine.simulate.completeStory();
    persistSession();
    if (!devJumped.current) store.clearResumePoint(storyRef.current.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.screen, engine]);

  // Una ficha equivocada del repaso se "sacude" medio segundo y se suelta.
  useEffect(() => {
    if (flow.review?.wrong == null) return;
    const h = window.setTimeout(() => dispatch({ type: 'review.clearWrong' }), 500);
    return () => window.clearTimeout(h);
  }, [flow.review?.wrong]);

  // Audio real de pronunciación (docs/04: "reproducción de audio" en la ayuda de palabra difícil). Dice la
  // palabra en ayuda cada vez que se pide escucharla ("Escuchar"/icono de altavoz/"Escuchar de nuevo"), en el
  // idioma de la historia. No es un motor de reconocimiento y no graba nada (docs/07 no aplica: es la app
  // hablando hacia afuera, con `speechSynthesis` del navegador).
  useEffect(() => {
    if (pronounceNonce === 0) return;
    const word = reading.helpWordIndex !== null ? words[reading.helpWordIndex] : undefined;
    if (word) speak(cleanWord(word.text), story.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pronounceNonce]);

  // Solo desarrollo: abrir un estado concreto desde la URL (?screen=6&audience=lector&highlight=subrayado&bubbles=progresivo&collapsed=1).
  // Sirve para revisar los 20 estados y para las capturas de comparación con el prototipo.
  useEffect(() => {
    if (!DEV_TOOLS) return;
    const q = new URLSearchParams(location.search);
    setPrefs((p) => ({
      ...p,
      audience: q.get('audience') === 'lector' ? 'lector' : p.audience,
      highlight: q.get('highlight') === 'subrayado' ? 'subrayado' : p.highlight,
      bubbles: q.get('bubbles') === 'progresivo' ? 'progresivo' : p.bubbles,
    }));
    if (q.get('collapsed') === '1') setCollapsed(true);
    const n = Number(q.get('screen'));
    if (n >= 1 && n <= 20) jumpToRef.current(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- datos derivados -----------------------------------------------------------------------
  const variant = page.checkpoint?.variants.find((v) => v.audience === prefs.audience) ?? page.checkpoint?.variants[0];
  const correctIndex = variant?.correctIndex ?? 0;

  const reviewWords = useMemo<ReviewWord[]>(
    () =>
      reviewWordsFromKeys(story, flow.totals.practicedKeys)
        .filter((key) => story.vocabulary[key]?.syllables)
        .map((key) => ({ key, syllables: story.vocabulary[key].syllables as string[] })),
    [story, flow.totals.practicedKeys],
  );

  const endStats = useMemo<EndStat[]>(() => {
    const { errorCount, wordCount } = flow.totals;
    const seconds = demoSeconds ?? timer.validSeconds;
    const acc = accuracyPercent(errorCount, wordCount);
    const time: EndStat = { label: copy.end.time, value: formatDuration(seconds) };
    const accuracy: EndStat = { label: copy.end.accuracy, value: `${acc}%` };
    const wpm: EndStat = { label: copy.end.wordsPerMinute, value: String(wordsPerMinute(wordCount, seconds)) };
    const total: EndStat = { label: copy.end.words, value: String(wordCount) };
    // docs/09 #4: sin precisión visible al niño, la tarjeta se reemplaza por otro dato neutro.
    if (!FLAGS.showAccuracyToChild) return prefs.audience === 'lector' ? [time, wpm, total] : [time, total, wpm];
    return prefs.audience === 'lector' ? [time, wpm, accuracy] : [time, accuracy, total];
  }, [demoSeconds, timer.validSeconds, flow.totals, prefs.audience]);

  const stars = starsFor(accuracyPercent(flow.totals.errorCount, flow.totals.wordCount));
  const practicedKeys = flow.totals.practicedKeys;
  // Tiempo LEÍDO para mostrar en pantalla (docs/06: cuenta hacia arriba, nunca cuenta atrás sin meta del padre).
  // `demoSeconds` fija el de la pantalla de fin de historia (estado 16 del panel de desarrollo) para que sea reproducible.
  const elapsedSeconds = demoSeconds ?? timer.validSeconds;

  // Inicio: progreso real (o, con el salto de desarrollo al estado 17, los datos de ejemplo del prototipo).
  const progress = useMemo(() => ({ summaries: store.summaries(), resume: store.latestResumePoint() }), [store, flow.screen]);

  // --- navegación entre historias y páginas --------------------------------------------------
  const leaveSession = () => {
    persistSession();
    engine.simulate.autoRead(false);
    engine.stopSession();
  };

  /** Abre la ficha de una historia, desde el principio (`pageIndex` 0) o desde donde se quedó. */
  const openStory = (id: string, index = 0) => {
    leaveSession();
    setHomeDemo(false);
    devJumped.current = false;
    setStoryId(id);
    dispatch({ type: 'story.select', pageIndex: index });
  };

  const begin = () => {
    setDemoSeconds(null);
    setHomeDemo(false);
    devJumped.current = false;
    summarySaved.current = false;
    if (engine instanceof RealReadingEngine) engine.setLanguage(story.language);
    engine.startSession(words);
    pageStartedAt.current = now().getTime();
    saveResume(story.id, flow.pageIndex);
    dispatch({ type: 'reading.begin' });
  };

  const restart = () => {
    setDemoSeconds(null);
    devJumped.current = false;
    summarySaved.current = false;
    if (engine instanceof RealReadingEngine) engine.setLanguage(story.language);
    engine.startSession(tokenizePage(story.pages[0]));
    pageStartedAt.current = now().getTime();
    saveResume(story.id, 0);
    dispatch({ type: 'restart' });
  };

  /** Aplica una acción del flujo; si con ella se pasa a otra página, el motor carga la página nueva. */
  const advance = (action: FlowAction) => {
    const next: FlowState = reduceFlow(flow, action);
    if (next === flow) return;
    dispatch(action);
    if (next.screen === 'reading' && next.pageIndex !== flow.pageIndex) {
      engine.loadPage(tokenizePage(story.pages[next.pageIndex]));
      pageStartedAt.current = now().getTime();
      saveResume(story.id, next.pageIndex);
    }
  };

  /**
   * "Modo lectura libre" (Modo padres): en vez de esperar a que el motor de voz reconozca la lectura, el padre
   * confirma con un botón que la página ya se leyó. Se acredita como tiempo válido el tiempo real transcurrido
   * desde que se cargó la página (así "Mi progreso" no se queda en cero solo porque no hubo voz que reconocer) y
   * se marca la página como terminada exactamente por el mismo camino que ya usa el panel de desarrollo
   * (`simulate.completePage`): la pregunta de comprensión de la página, si la tiene, sigue apareciendo igual.
   */
  const freeAdvance = () => {
    const elapsedMs = Math.max(0, now().getTime() - pageStartedAt.current);
    const from = engine.timer.machine.confirmedMs;
    if (elapsedMs > 0) engine.timer.machine.ingest({ fromMs: from, toMs: from + elapsedMs, valid: true });
    engine.simulate.completePage();
  };

  /**
   * "Modo lectura libre": vuelve a la página anterior directamente (sin pedir de nuevo la pregunta de
   * comprensión que ya se contestó). No hay nada que hacer en la primera página.
   */
  const freeBack = () => {
    if (flow.pageIndex <= 0) return;
    const prevIndex = flow.pageIndex - 1;
    dispatch({ type: 'free.back' });
    engine.loadPage(tokenizePage(story.pages[prevIndex]));
    pageStartedAt.current = now().getTime();
    saveResume(story.id, prevIndex);
  };

  // Al terminar una página, seguir SOLA tras un instante: a la pregunta si la tiene, si no a la página siguiente
  // (o repaso/fin). Antes hacía falta tocar "Siguiente página"; el aviso (`PageDoneFlourish`) ya dice lo que pasó,
  // así que no hace falta pedir permiso para algo que ya se sabe que toca. Un salto del panel de desarrollo
  // (`devJumped`) se queda quieto en el estado, para poder inspeccionarlo (estado 14 de docs/04).
  useEffect(() => {
    if (flow.screen !== 'pageDone' || devJumped.current) return;
    const id = window.setTimeout(() => {
      if (variant && checkpointPageIndices.has(flow.pageIndex)) dispatch({ type: 'question.open' });
      else advance({ type: 'page.next', words: reviewWords, isLastPage });
    }, PAGE_DONE_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.screen]);

  const listenCurrent = () => {
    if (engine.getState().helpWordIndex === null) engine.requestHelp();
    window.setTimeout(() => setPronounceNonce((n) => n + 1), 60);
  };

  const actions: SessionActions = {
    onBack: () => {
      leaveSession();
      dispatch({ type: 'go', screen: 'select' });
    },
    onTogglePanel: () => setCollapsed((c) => !c),
    onToggleStory: () => setStoryHidden((h) => !h),
    onWordTap: (i) => engine.requestHelp(i),
    onAskHelp: () => engine.requestHelp(),
    onCloseHelp: () => engine.closeHelp(),
    onListen: listenCurrent,
    onReadStart: () => engine.requestReadStart(),
    onPronounce: () => setPronounceNonce((n) => n + 1),
    onPronouncingChange: setPronouncing,
    onBegin: begin,
    onPickAnswer: (index) => dispatch({ type: 'question.pick', index, correctIndex }),
    onContinue: () => advance({ type: 'question.finish', correctIndex, words: reviewWords, isLastPage }),
    onReviewTap: (tile) => dispatch({ type: 'review.tap', tile }),
    onReviewNext: () => dispatch({ type: 'review.next' }),
    onReviewListen: () => {
      const r = flow.review;
      if (r) speak(r.words[r.index].key, story.language);
    },
    onFreeAdvance: freeAdvance,
    onFreeBack: freeBack,
  };

  const go = (screen: 'home' | 'progress' | 'select') => () => {
    leaveSession();
    setHomeDemo(false);
    dispatch({ type: 'go', screen });
  };

  // --- Inicio --------------------------------------------------------------------------------
  const home = (() => {
    const resume = homeDemo ? null : progress.resume;
    const resumeStory = resume ? repository.get(resume.storyId) : undefined;
    // El Inicio de ejemplo del prototipo (estado 17) es SIEMPRE con la historia piloto, por muchas historias que haya.
    const demoStory = homeDemo ? repository.get(pilotStory.id) : undefined;
    const featured = resumeStory ?? demoStory ?? (repository.get(firstPublic.id) as Story);
    const startAt = resumeStory && resume ? Math.min(resume.pageIndex, featured.pages.length - 1) : 0;
    const totalFrames = toCatalogEntry(featured).blockCount;
    const demoFrame = homeDemo ? 3 : undefined; // el "Cuadro 3 de 10" del prototipo
    const frame = demoFrame ?? (resumeStory ? blocksBeforePage(featured, startAt) + 1 : undefined);

    // El Inicio de ejemplo del prototipo (estado 17) solo lleva la historia piloto, como en el diseño.
    const realCards: StoryCard[] = (homeDemo ? variants.filter((c) => c.id === pilotStory.id).concat(variants.filter((c) => c.id !== pilotStory.id)).slice(0, 1) : variants).map((c) => {
        const p = storyProgress(progress.summaries, c.id);
        return {
          id: c.id,
          title: c.title,
          meta: `Nivel ${c.level}`,
          // Con los datos de ejemplo del prototipo la historia piloto sale con 3 estrellas, como en el diseño.
          stars: homeDemo ? 3 : p.stars,
          status: !homeDemo && p.completed ? ('read' as const) : ('new' as const),
          cover: c.cover,
          onOpen: () => openStory(c.id),
        };
      });
    const filler: StoryCard[] = FLAGS.showDemoStories ? demoOtherStories.slice(0, Math.max(0, HOME_GRID_SLOTS - realCards.length)) : [];

    return {
      current: {
        title: featured.title,
        frame,
        totalFrames,
        // Con `heroFocus` el banner usa la portada (recorte panorámico centrado en lo importante); si no, el recorte fijo de la página.
        image: featured.heroFocus && featured.cover ? featured.cover : featured.pages[startAt].illustration,
        focus: featured.heroFocus && featured.cover ? featured.heroFocus : undefined,
      },
      cards: [...realCards, ...filler],
      onContinue: () => openStory(featured.id, resumeStory ? startAt : 0),
    };
  })();

  // --- Biblioteca (docs/08 Fase G): TODAS las historias reales del idioma/nivel actual, sin cupo ni relleno. ---
  const library = {
    cards: variants.map((c): LibraryEntry => {
      const p = storyProgress(progress.summaries, c.id);
      // Todos los niveles de esta misma historia (familia) en el idioma actual, de menor a mayor: para que se vea
      // de un vistazo que "El puente de Lolo" existe en varios niveles, no solo en el que toca leer ahora.
      const levels = [...new Set(catalog.filter((e) => !e.dev && e.familyId === c.familyId && e.language === c.language).map((e) => e.level))].sort((a, b) => a - b);
      return {
        id: c.id,
        title: c.title,
        meta: `Nivel ${c.level}`,
        stars: p.stars,
        status: p.completed ? 'read' : 'new',
        cover: c.cover,
        description: c.description,
        category: c.category,
        levels,
        duration: readingMinutesOfWordCount(c.wordCount),
        onOpen: () => openStory(c.id),
      };
    }),
  };

  // --- panel de desarrollo -------------------------------------------------------------------
  const sim = engine.simulate;
  const sims: DevSim[] = [
    { label: 'Palabra correcta', event: 'word.correct', run: sim.correct },
    { label: 'Pausa corta', event: 'pause.detected', run: sim.pauseShort },
    { label: 'Pausa larga', event: 'pause.detected', run: sim.pauseLong },
    { label: 'Palabra dudosa', event: 'word.uncertain', run: sim.uncertain },
    { label: 'Palabra incorrecta', event: 'word.incorrect', run: sim.incorrect },
    { label: 'Palabra repetida', event: 'word.repeated', run: sim.repeated },
    { label: 'Palabra saltada', event: 'word.skipped', run: sim.skipped },
    { label: 'Pide ayuda', event: 'help.requested', run: () => engine.requestHelp() },
    { label: 'Léeme el comienzo', event: 'help · read-start', run: () => engine.requestReadStart() },
    { label: 'Terminar página', event: 'page.completed', run: sim.completePage },
    { label: 'Reiniciar', event: 'session.started', run: restart },
  ];

  const jumpTo = (n: number) => {
    const preset = buildPreset(n, words, reviewWords);
    engine.simulate.autoRead(false);
    engine.debugLoadState(preset.reading);
    // El salto conserva la historia y la página en las que estamos; los datos son de mentira y no se guardan.
    devJumped.current = true;
    dispatch({ type: 'debug.set', state: { ...preset.flow, pageIndex: flow.pageIndex, startPage: flow.startPage } });
    setDemoSeconds(preset.demoSeconds ?? null);
    setHomeDemo(preset.homeDemo ?? false);
    setStoryHidden(false);
    if (preset.thenPronounce) window.setTimeout(() => setPronounceNonce((k) => k + 1), 60);
    if (preset.thenReadStart) window.setTimeout(() => engine.requestReadStart(), 60);
  };

  jumpToRef.current = jumpTo;

  const toggleAuto = () => {
    if (auto) return engine.simulate.autoRead(false);
    if (flow.screen !== 'reading') begin();
    engine.simulate.autoRead(true);
  };

  // El lienzo toma el alto de la pantalla real (dentro de un rango razonable, ver stage.tsx) en vez de quedarse
  // fijo en 996px: así se evitan los bordes negros de "letterbox" en tablets con otra proporción de pantalla
  // (reportado por Victor probando en un dispositivo real, 2026-09-29). Antes solo se activaba en páginas con
  // globos dibujados y en pantallas de lectura; ahora es universal — Inicio/Biblioteca/Progreso/Fin de
  // historia también aprovechan toda la pantalla, no solo la sesión de lectura en sí.
  const fitMode = true;

  /** Cambia idioma/nivel del perfil (Modo padres, docs/01: lo elige el padre; también lo usa el panel DEV). */
  const setProfile = (p: ReadingProfile) => {
    setProfileState(p);
    onProfileChange?.(p);
  };

  return {
    story,
    page,
    words,
    fitMode,
    freeReading,
    reading,
    flow,
    prefs,
    setPrefs,
    collapsed,
    storyHidden,
    pronounceNonce,
    elapsedSeconds,
    profile,
    setProfile,
    variantCorrect: correctIndex,
    actions,
    go,
    begin,
    restart,
    home,
    library,
    /** Resúmenes guardados de sesiones (docs/07): lo único que existe para calcular "Mi progreso". */
    summaries: progress.summaries,
    goPrep: () => dispatch({ type: 'prep.open' }),
    setProgressTab: (tab: 0 | 1 | 2 | 3) => dispatch({ type: 'progress.tab', tab }),
    togglePanel: () => setCollapsed((c) => !c),
    end: { stats: endStats, stars, practiced: practicedKeys.length ? practicedKeys : ['—'] },
    dev: {
      sims,
      log,
      auto,
      toggleAuto,
      jumpTo,
      stories: catalog.map((c) => ({ id: c.id, title: c.title, dev: c.dev, active: c.id === story.id })),
      profile,
      setProfile,
      openStory: (id: string) => openStory(id),
      pageLabel: `${pageIndex + 1} / ${story.pages.length}`,
      stateNumber: screenStateNumber(flow, reading, pronouncing),
      timer: { state: timer.state, valid: formatDuration(timer.validSeconds), session: formatDuration(timer.sessionSeconds), pauses: timer.pauses },
    },
  };
}

/**
 * RealReadingEngine: primer `ReadingEngine` real (docs/03), alimentado por un `SpeechEngine` real
 * (hoy: `WhisperSpeechEngine`) en vez de "botones" simulados.
 *
 * Reutiliza SIN cambios la lógica ya construida y probada del motor: `TextReadingMatcher`/
 * `ReadingProgressTracker` (alineación de texto) y `LiveReadingTimer` (máquina de estados del
 * temporizador). Lo único nuevo aquí es EL PEGAMENTO: traducir los eventos crudos del `SpeechEngine`
 * (texto reconocido, voz activa/inactiva) en los mismos `ReadingEvent`/`SessionAction` que ya emite
 * `FakeReadingEngine`, para que la UI (que solo conoce esos eventos) no note la diferencia.
 *
 * Expone la MISMA superficie extra que `FakeReadingEngine` (`simulate.*`, `isAutoReading`,
 * `debugLoadState`, `getTimerSnapshot`) para poder sustituir uno por otro en `apps/reader/src/
 * use-session.ts` sin tocar esa capa: `simulate.autoRead` no hace nada real aquí (no tiene sentido
 * con voz real) y `simulate.completeStory`/`debugLoadState` se comportan igual que en el simulador
 * (son navegación, no lectura).
 *
 * SIN PROBAR EN TABLET REAL todavía (ver `whisper-speech-engine.ts`). `suspend()`/`resume()` paran y
 * vuelven a arrancar el motor de voz por completo (recarga el modelo Whisper) en vez de solo
 * silenciar el procesamiento: más simple y más alineado con docs/06 ("el micrófono se detiene al
 * salir de sesión"), a costa de unos segundos de recarga al volver — aceptable mientras no se pruebe
 * lo contrario con uso real.
 */
import type {
  ReadingEngine,
  ReadingEngineListener,
  ReadingEvent,
  ReadingSessionState,
  ReadingTimerSnapshot,
  ReadingWord,
  SpeechEngine,
  Unsubscribe,
} from '@lee-conmigo/contracts';
import { LiveReadingTimer, type ReadingTimerConfig } from './timer.ts';
import { createSessionState, reduceSession, type SessionAction } from './session-state.ts';
import { realScheduler, type Scheduler } from './scheduler.ts';
import { ReadingProgressTracker, type MatchOptions } from './matcher.ts';

export interface RealReadingEngineOptions {
  scheduler?: Scheduler;
  timerConfig?: Partial<ReadingTimerConfig>;
  matchOptions?: Partial<MatchOptions>;
  /** "es" | "en"-… tal como lo trae `Story.language`. */
  language: string;
  /** Puntaje mínimo de una transcripción para contar como lectura válida (0-1). */
  minScore?: number;
  /** Palabras mínimas alineadas para no descartar la transcripción como ruido/charla ajena. */
  minMatchedWords?: number;
  /** ms sin lectura válida para la burbuja de "pausa corta" / "pausa larga" (solo UI; el temporizador tiene su propia lógica). */
  shortPauseMs?: number;
  longPauseMs?: number;
}

const isInternal = (a: SessionAction): boolean => a.type.startsWith('ui.');

export class RealReadingEngine implements ReadingEngine {
  private state: ReadingSessionState = createSessionState(0);
  private listeners: ReadingEngineListener[] = [];
  private handles = new Set<unknown>();
  private tickHandle: unknown = null;
  private suspended = false;
  private micStarted = false;
  private tracker: ReadingProgressTracker | null = null;
  private lastValidAt = 0;
  private pausedShort = false;
  private pausedLong = false;
  private unsubs: Unsubscribe[] = [];

  private readonly sched: Scheduler;
  private readonly speech: SpeechEngine;
  private readonly o: Required<Pick<RealReadingEngineOptions, 'minScore' | 'minMatchedWords' | 'shortPauseMs' | 'longPauseMs'>>;
  private readonly matchOptions?: Partial<MatchOptions>;
  /** Mutable: `setLanguage` la cambia entre historias sin reconstruir el motor (docs/00: bilingüe). */
  private language: string;

  readonly timer: LiveReadingTimer;

  constructor(speech: SpeechEngine, opts: RealReadingEngineOptions) {
    this.speech = speech;
    this.sched = opts.scheduler ?? realScheduler;
    this.language = opts.language;
    this.o = {
      minScore: opts.minScore ?? 0.4,
      minMatchedWords: opts.minMatchedWords ?? 1,
      shortPauseMs: opts.shortPauseMs ?? 1800,
      longPauseMs: opts.longPauseMs ?? 5200,
    };
    this.matchOptions = opts.matchOptions;
    this.timer = new LiveReadingTimer(opts.timerConfig, () => this.sched.now());
    this.unsubs.push(
      this.speech.onFinalResult((r) => this.onRecognized(r.text)),
      this.speech.onVoiceActivity((active) => this.onVoiceActivity(active)),
      // Sin UI dedicada para errores del motor de voz todavía (docs/06 "Reconocimiento no disponible" es
      // un estado pendiente de diseño explícito, ver docs/09): por ahora solo se deja constancia en consola.
      this.speech.onError((e) => console.warn('[RealReadingEngine] error del motor de voz:', e.code, e.message)),
    );
  }

  // ------------------------------------------------------------------ contrato ReadingEngine

  getState(): ReadingSessionState {
    return this.state;
  }

  getTimerSnapshot(): ReadingTimerSnapshot {
    return this.timer.snapshot();
  }

  subscribe(listener: ReadingEngineListener): Unsubscribe {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  startSession(words: ReadingWord[]): void {
    this.clearTimers();
    this.suspended = false;
    this.state = createSessionState(words.length);
    this.setWords(words);
    this.timer.prepare();
    this.startTick();
    this.ensureMic();
    this.emit({ type: 'session.started' });
  }

  loadPage(words: ReadingWord[]): void {
    this.clearTimers();
    if (this.timer.machine.state === 'IDLE' || this.timer.machine.state === 'COMPLETED') {
      this.timer.prepare();
      this.startTick();
    }
    this.state = createSessionState(words.length);
    this.setWords(words);
    this.ensureMic();
    this.emit({ type: 'page.started' });
  }

  suspend(): void {
    if (this.suspended) return;
    this.suspended = true;
    this.timer.suspend();
    void this.speech.stop();
    this.micStarted = false;
  }

  resume(): void {
    this.suspended = false;
    this.ensureMic();
  }

  requestHelp(wordIndex?: number): void {
    const s = this.state;
    if (!this.live()) return;
    const at = wordIndex ?? (s.issue === 'skipped' && s.issueWordIndex !== null ? s.issueWordIndex : Math.min(s.currentWordIndex, Math.max(s.wordCount - 1, 0)));
    this.clearTimers();
    this.emit({ type: 'help.requested', wordIndex: at });
  }

  requestReadStart(): void {
    if (!this.live()) return;
    const from = this.state.currentWordIndex;
    this.clearTimers();
    this.emit({ type: 'help.requested', wordIndex: from, kind: 'read-start' });
    [0, 1, 2].forEach((k) => this.later(() => this.emit({ type: 'ui.readStart.step', step: k }), 250 + k * 560));
    this.later(() => this.emit({ type: 'ui.readStart.done' }), 250 + 3 * 560);
  }

  closeHelp(): void {
    if (this.state.helpWordIndex === null) return;
    this.clearTimers();
    this.emit({ type: 'ui.help.closed' });
  }

  stopSession(): void {
    this.clearTimers();
    this.stopTick();
    this.timer.complete();
    void this.speech.stop();
    this.micStarted = false;
    this.emit({ type: 'ui.session.stopped' });
  }

  /** Mismo uso que en `FakeReadingEngine`: solo el panel de desarrollo (saltar a un estado ya armado). */
  debugLoadState(state: ReadingSessionState): void {
    this.clearTimers();
    this.state = state;
    this.emit({ type: 'ui.debug.loaded', state });
  }

  dispose(): void {
    this.clearTimers();
    this.stopTick();
    this.unsubs.forEach((u) => u());
    this.unsubs = [];
    void this.speech.stop();
    this.listeners = [];
  }

  // ------------------------------------------------------------------ superficie compatible con FakeReadingEngine
  //
  // El panel DEV (`use-session.ts`) llama a estos mismos métodos sin importar qué motor esté activo, así que
  // se replican aquí uno a uno: sirven para probar la UI a mano incluso con el motor de voz real encendido
  // (útil en la tablet, donde no siempre es cómodo hablar para cada prueba). `autoRead` es la única que de
  // verdad no tiene sentido con voz real (no hay temporizador de "lectura automática" que simular) y queda sin
  // efecto.

  readonly simulate = {
    correct: (): void => {
      const s = this.state;
      if (!this.live() || s.helpWordIndex !== null || s.currentWordIndex >= s.wordCount) return;
      if (!s.hasHeardVoice) this.emit({ type: 'speech.started' });
      const idx = s.currentWordIndex;
      this.emit({ type: 'word.correct', wordIndex: idx });
      this.timer.onValidReading();
      this.lastValidAt = this.sched.now();
      this.pausedShort = false;
      this.pausedLong = false;
    },
    pauseShort: (): void => {
      if (this.live()) this.emit({ type: 'pause.detected', duration: this.o.shortPauseMs });
    },
    pauseLong: (): void => {
      if (this.live()) this.emit({ type: 'pause.detected', duration: this.o.longPauseMs });
    },
    uncertain: (): void => {
      if (this.live()) this.emit({ type: 'word.uncertain', wordIndex: this.currentIndex() });
    },
    incorrect: (): void => {
      if (this.live()) this.emit({ type: 'word.incorrect', wordIndex: this.currentIndex() });
    },
    repeated: (): void => {
      const s = this.state;
      if (!this.live() || s.currentWordIndex === 0) return;
      this.emit({ type: 'word.repeated', wordIndex: s.currentWordIndex - 1 });
    },
    skipped: (): void => {
      const s = this.state;
      if (!this.live() || s.currentWordIndex >= s.wordCount) return;
      this.emit({ type: 'word.skipped', wordIndex: s.currentWordIndex });
    },
    completePage: (): void => {
      if (!this.live()) return;
      this.emit({ type: 'page.completed' });
    },
    completeStory: (): void => {
      this.emit({ type: 'story.completed' });
    },
    /** Sin efecto: con voz real la lectura la produce el niño, no un temporizador de demo. */
    autoRead: (_on: boolean): void => {},
  };

  get isAutoReading(): boolean {
    return false;
  }

  private currentIndex(): number {
    return Math.min(this.state.currentWordIndex, Math.max(this.state.wordCount - 1, 0));
  }

  // ------------------------------------------------------------------ internos

  private setWords(words: ReadingWord[]): void {
    const expected = words.map((w) => w.normalized).join(' ');
    this.tracker = new ReadingProgressTracker(expected, { wordSimilarity: 0.7, ...this.matchOptions });
    this.lastValidAt = this.sched.now();
    this.pausedShort = false;
    this.pausedLong = false;
  }

  /** Cambia el idioma para la PRÓXIMA vez que arranque el micrófono (no interrumpe uno ya activo). */
  setLanguage(language: string): void {
    this.language = language;
  }

  private ensureMic(): void {
    if (this.micStarted || this.suspended) return;
    this.micStarted = true;
    this.speech.start(this.language).catch(() => {
      this.micStarted = false;
    });
  }

  private onVoiceActivity(active: boolean): void {
    if (!this.live()) return;
    if (active) {
      if (!this.state.hasHeardVoice) this.emit({ type: 'speech.started' });
      this.timer.onVoiceActivity();
    }
  }

  private onRecognized(text: string): void {
    if (!this.live() || this.state.helpWordIndex !== null || !this.tracker) return;
    const m = this.tracker.match(text);
    const valid = m.matched >= this.o.minMatchedWords && m.score >= this.o.minScore;
    if (!valid || m.startIdx > this.state.currentWordIndex + 2) return;
    this.tracker.commit(m);
    this.lastValidAt = this.sched.now();
    this.pausedShort = false;
    this.pausedLong = false;
    for (const i of m.matchedIdx) {
      if (i < 0 || i >= this.state.wordCount || this.state.wordMarks[i] === 'read') continue;
      this.emit({ type: 'word.correct', wordIndex: i });
      this.timer.onValidReading();
    }
  }

  private live(): boolean {
    if (this.suspended) return false;
    const st = this.state.status;
    return st === 'listening' || st === 'paused' || st === 'helping';
  }

  private emit(action: SessionAction): void {
    this.state = reduceSession(this.state, action);
    if (!isInternal(action)) this.driveTimer(action as ReadingEvent);
    const ev = isInternal(action) ? null : (action as ReadingEvent);
    for (const l of [...this.listeners]) l(ev, this.state);
  }

  private driveTimer(e: ReadingEvent): void {
    switch (e.type) {
      case 'speech.started':
        this.timer.onVoiceActivity();
        break;
      case 'story.completed':
        this.timer.complete();
        break;
      default:
        break;
    }
  }

  private later(fn: () => void, ms: number): void {
    const h = this.sched.setTimeout(() => {
      this.handles.delete(h);
      fn();
    }, ms);
    this.handles.add(h);
  }

  private clearTimers(): void {
    this.handles.forEach((h) => this.sched.clearTimeout(h));
    this.handles.clear();
  }

  private startTick(): void {
    this.stopTick();
    this.tickHandle = this.sched.setInterval(() => {
      this.timer.tick();
      this.checkPause();
    }, 250);
  }

  private stopTick(): void {
    if (this.tickHandle !== null) this.sched.clearInterval(this.tickHandle);
    this.tickHandle = null;
  }

  /** Burbuja de "pausa corta"/"pausa larga" en la UI, en base al tiempo sin una lectura válida aceptada. */
  private checkPause(): void {
    if (!this.live()) return;
    const silentMs = this.sched.now() - this.lastValidAt;
    if (silentMs >= this.o.longPauseMs && !this.pausedLong) {
      this.pausedLong = true;
      this.emit({ type: 'pause.detected', duration: this.o.longPauseMs });
    } else if (silentMs >= this.o.shortPauseMs && !this.pausedShort) {
      this.pausedShort = true;
      this.emit({ type: 'pause.detected', duration: this.o.shortPauseMs });
    }
  }
}

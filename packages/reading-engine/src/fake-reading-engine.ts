/**
 * FakeReadingEngine: motor de lectura SIMULADO (docs/04-READING-SESSION.md, "FakeReadingEngine").
 *
 * Permite construir y probar toda la experiencia en el navegador sin micrófono, sin Android y sin
 * reconocimiento de voz. Genera exactamente el mismo flujo de `ReadingEvent` que tendrá el motor real,
 * a partir de "botones" (`simulate.*`): palabra correcta, pausa corta/larga, dudosa, incorrecta,
 * repetida, saltada, pedir ayuda, "léeme el comienzo", terminar página y lectura automática.
 *
 * Es la lógica del panel "DEV READING SIMULATOR" del prototipo aprobado, pero como paquete reutilizable
 * (tests, Storybook, el panel de desarrollo de la app...). El panel visual NUNCA forma parte de la
 * experiencia del niño.
 */
import type { ReadingEngine, ReadingEngineListener, ReadingEvent, ReadingSessionState, ReadingTimerSnapshot, ReadingWord, Unsubscribe } from '@lee-conmigo/contracts';
import { LiveReadingTimer, type ReadingTimerConfig } from './timer.ts';
import { createSessionState, reduceSession, type SessionAction } from './session-state.ts';
import { realScheduler, type Scheduler } from './scheduler.ts';

export interface FakeReadingEngineOptions {
  scheduler?: Scheduler;
  timerConfig?: Partial<ReadingTimerConfig>;
  /** Cada cuánto avanza la lectura automática (prototipo: 520 ms). */
  autoReadIntervalMs?: number;
  /** Espera entre leer la última palabra y emitir `page.completed`. */
  completePageDelayMs?: number;
  /** Duraciones de las pausas simuladas (ms). */
  shortPauseMs?: number;
  longPauseMs?: number;
}

const isInternal = (a: SessionAction): boolean => a.type.startsWith('ui.');

export class FakeReadingEngine implements ReadingEngine {
  private state: ReadingSessionState = createSessionState(0);
  private listeners: ReadingEngineListener[] = [];
  private handles = new Set<unknown>();
  private autoHandle: unknown = null;
  private tickHandle: unknown = null;
  private suspended = false;

  private readonly sched: Scheduler;
  private readonly o: Required<Omit<FakeReadingEngineOptions, 'scheduler' | 'timerConfig'>>;

  /** Temporizador de lectura, alimentado por los eventos simulados. No conoce al motor de voz. */
  readonly timer: LiveReadingTimer;

  constructor(opts: FakeReadingEngineOptions = {}) {
    this.sched = opts.scheduler ?? realScheduler;
    this.o = {
      autoReadIntervalMs: opts.autoReadIntervalMs ?? 520,
      completePageDelayMs: opts.completePageDelayMs ?? 400,
      shortPauseMs: opts.shortPauseMs ?? 1800,
      longPauseMs: opts.longPauseMs ?? 5200,
    };
    this.timer = new LiveReadingTimer(opts.timerConfig, () => this.sched.now());
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
    this.stopAuto();
    this.suspended = false;
    this.state = createSessionState(words.length);
    this.timer.prepare();
    this.startTick();
    this.emit({ type: 'session.started' });
  }

  loadPage(words: ReadingWord[]): void {
    this.clearTimers();
    this.stopAuto();
    // Si no había sesión (p. ej. tras un salto de desarrollo) se arranca; si la había, el temporizador SIGUE.
    if (this.timer.machine.state === 'IDLE' || this.timer.machine.state === 'COMPLETED') {
      this.timer.prepare();
      this.startTick();
    }
    this.state = createSessionState(words.length);
    this.emit({ type: 'page.started' });
  }

  suspend(): void {
    if (this.suspended) return;
    this.suspended = true;
    this.stopAuto();
    this.timer.suspend();
  }

  resume(): void {
    // No hay que hacer nada más: al volver, el temporizador está en PAUSED y exige lectura válida (RESUMING).
    this.suspended = false;
  }

  requestHelp(wordIndex?: number): void {
    const s = this.state;
    if (!this.live()) return;
    const at =
      wordIndex ?? (s.issue === 'skipped' && s.issueWordIndex !== null ? s.issueWordIndex : Math.min(s.currentWordIndex, Math.max(s.wordCount - 1, 0)));
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
    this.stopAuto();
    this.stopTick();
    this.timer.complete();
    this.emit({ type: 'ui.session.stopped' });
  }

  /**
   * SOLO DESARROLLO (panel "Ir a pantalla"): salta directamente a un estado de lectura ya armado, sin
   * pasar por los eventos. Notifica a los suscriptores con event = null.
   */
  debugLoadState(state: ReadingSessionState): void {
    this.clearTimers();
    this.stopAuto();
    this.state = state;
    this.emit({ type: 'ui.debug.loaded', state });
  }

  dispose(): void {
    this.clearTimers();
    this.stopAuto();
    this.stopTick();
    this.listeners = [];
  }

  // ------------------------------------------------------------------ simulador

  /** "Botones" del panel de desarrollo. Cada uno emite los mismos eventos que emitiría el motor real. */
  readonly simulate = {
    /** El niño lee bien la palabra actual. */
    correct: (): void => {
      const s = this.state;
      if (!this.live() || s.helpWordIndex !== null || s.currentWordIndex >= s.wordCount) return;
      if (!s.hasHeardVoice) this.emit({ type: 'speech.started' });
      const idx = s.currentWordIndex;
      const stuck = (s.issue !== null && s.issue !== 'repeated') || s.pause === 'long';
      this.emit({ type: 'word.correct', wordIndex: idx });
      if (stuck) this.later(() => this.emit({ type: 'ui.recovered.cleared' }), 1800);
      if (idx + 1 >= s.wordCount) this.later(() => this.simulate.completePage(), this.o.completePageDelayMs);
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
    /** Repite la palabra anterior (tartamudeo / relectura). */
    repeated: (): void => {
      const s = this.state;
      if (!this.live() || s.currentWordIndex === 0) return;
      const i = s.currentWordIndex - 1;
      this.emit({ type: 'word.repeated', wordIndex: i });
      this.later(() => this.emit({ type: 'ui.repeated.cleared' }), 1500);
    },
    /** Se salta la palabra actual y sigue con la siguiente. */
    skipped: (): void => {
      const s = this.state;
      if (!this.live() || s.currentWordIndex >= s.wordCount) return;
      const i = s.currentWordIndex;
      this.emit({ type: 'word.skipped', wordIndex: i });
      if (i + 1 >= s.wordCount) this.later(() => this.simulate.completePage(), this.o.completePageDelayMs);
    },
    help: (wordIndex?: number): void => this.requestHelp(wordIndex),
    readStart: (): void => this.requestReadStart(),
    completePage: (): void => {
      if (!this.live()) return;
      this.stopAuto();
      this.emit({ type: 'page.completed' });
    },
    completeStory: (): void => {
      this.stopAuto();
      this.emit({ type: 'story.completed' });
    },
    /** Lectura automática: dispara `word.correct` cada `autoReadIntervalMs` (modo demo). */
    autoRead: (on: boolean): void => {
      if (!on) return this.stopAuto();
      if (!this.live() || this.autoHandle !== null) return;
      this.autoHandle = this.sched.setInterval(() => {
        if (!this.live()) return this.stopAuto();
        if (this.state.helpWordIndex === null) this.simulate.correct();
      }, this.o.autoReadIntervalMs);
    },
  };

  get isAutoReading(): boolean {
    return this.autoHandle !== null;
  }

  // ------------------------------------------------------------------ internos

  private live(): boolean {
    if (this.suspended) return false; // en segundo plano no se acepta lectura
    const st = this.state.status;
    return st === 'listening' || st === 'paused' || st === 'helping';
  }

  private currentIndex(): number {
    return Math.min(this.state.currentWordIndex, Math.max(this.state.wordCount - 1, 0));
  }

  private emit(action: SessionAction): void {
    this.state = reduceSession(this.state, action);
    if (!isInternal(action)) this.driveTimer(action as ReadingEvent);
    const ev = isInternal(action) ? null : (action as ReadingEvent);
    for (const l of [...this.listeners]) l(ev, this.state);
  }

  /** El temporizador solo recibe "hay lectura" / "silencio": no sabe nada del motor. */
  private driveTimer(e: ReadingEvent): void {
    switch (e.type) {
      case 'speech.started':
        this.timer.onVoiceActivity();
        break;
      case 'word.correct':
      case 'word.uncertain':
      case 'word.incorrect':
      case 'word.repeated':
      case 'word.skipped':
        this.timer.onValidReading(); // el niño está intentando leer, aunque se equivoque
        break;
      case 'pause.detected':
        this.timer.onSilence();
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

  private stopAuto(): void {
    if (this.autoHandle !== null) this.sched.clearInterval(this.autoHandle);
    this.autoHandle = null;
  }

  private startTick(): void {
    this.stopTick();
    this.tickHandle = this.sched.setInterval(() => this.timer.tick(), 250);
  }

  private stopTick(): void {
    if (this.tickHandle !== null) this.sched.clearInterval(this.tickHandle);
    this.tickHandle = null;
  }
}

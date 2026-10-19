import { clampBpm, DEFAULT_BPM, TRACKS, STEPS, stepSeconds, toggleCell, emptyPattern, type Track, type Pattern } from './pattern.ts';
import { DEFAULT_KIT, type Kit, type SoundId } from './sounds.ts';
import type { AudioOutput } from './output.ts';

export interface SequencerOptions {
  /** Cuánto se programa por adelantado, en segundos (el planificador corre cada ~25 ms). */
  lookahead?: number;
  bpm?: number;
  pattern?: Pattern;
  /** Qué sonido tiene cada fila (por defecto bombo, palmas, sonaja y voz). */
  kit?: Kit;
}

/** Un pulso marcado en el reloj de audio: lo usa la interfaz para dibujar el cursor. */
export interface Tick {
  time: number;
  step: number;
  cycle: number;
}

export interface SequencerStats {
  /** Golpes programados desde el último `start()`. */
  scheduled: number;
  /** Ciclos completos (8 pasos) ya programados. */
  cycles: number;
  /** Veces que el planificador llegó tarde y tuvo que saltarse pasos (no debería pasar con la app en primer plano). */
  skippedSteps: number;
}

const START_DELAY = 0.06;
/** Si el planificador se atrasa más de esto, se salta lo que ya pasó en vez de tocarlo todo de golpe. */
const LATE_TOLERANCE = 0.02;
const MAX_TICKS = 64;

/**
 * El secuenciador de ocho pulsos. Programa los golpes en el RELOJ DE AUDIO con anticipación; la interfaz solo llama a `pump()` cada ~25 ms
 * y lee `stepAt(now)` para dibujar el cursor. Reglas fijas (ESPECIFICACION §3):
 *  - el paso 8 enlaza con el paso 1 sin hueco añadido;
 *  - un cambio de tempo se aplica en el siguiente ciclo, nunca a mitad;
 *  - editar el patrón afecta solo a lo que todavía no se programó;
 *  - un paso programado nunca se vuelve a programar.
 */
export class Sequencer {
  private pattern: Pattern;
  private kit: Kit;
  private bpm: number;
  private pending: number | null = null;
  private readonly lookahead: number;
  private running = false;
  private nextStep = 0;
  private nextTime = 0;
  private cycle = 0;
  private muted = new Set<Track>();
  private solo: Track | null = null;
  private ticks: Tick[] = [];
  private st: SequencerStats = { scheduled: 0, cycles: 0, skippedSteps: 0 };

  constructor(private readonly out: AudioOutput, opts: SequencerOptions = {}) {
    this.lookahead = opts.lookahead ?? 0.1;
    this.bpm = clampBpm(opts.bpm ?? DEFAULT_BPM);
    this.pattern = opts.pattern ?? emptyPattern();
    this.kit = { ...(opts.kit ?? DEFAULT_KIT) };
  }

  get playing(): boolean {
    return this.running;
  }

  get tempo(): number {
    return this.bpm;
  }

  /** Tempo que entrará en el próximo ciclo, si hay un cambio pendiente. */
  get pendingTempo(): number | null {
    return this.pending;
  }

  get stats(): SequencerStats {
    return { ...this.st };
  }

  getPattern(): Pattern {
    return this.pattern;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.nextStep = 0;
    this.cycle = 0;
    this.nextTime = this.out.now() + START_DELAY;
    this.ticks = [];
    this.st = { scheduled: 0, cycles: 0, skippedSteps: 0 };
    this.pump();
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.out.stopAll();
    this.ticks = [];
  }

  /** Cambia el tempo: si está sonando, entra en el siguiente ciclo; si no, entra ya. */
  setTempo(bpm: number): void {
    const next = clampBpm(bpm);
    if (!this.running) {
      this.bpm = next;
      this.pending = null;
      return;
    }
    this.pending = next === this.bpm ? null : next;
  }

  setPattern(p: Pattern): void {
    this.pattern = p;
  }

  toggle(track: Track, step: number): void {
    this.pattern = toggleCell(this.pattern, track, step);
  }

  /** Cambia el sonido de una fila: vale para los golpes que todavía no se programaron. */
  setSound(track: Track, sound: SoundId): void {
    this.kit = { ...this.kit, [track]: sound };
  }

  getKit(): Kit {
    return this.kit;
  }

  setKit(kit: Kit): void {
    this.kit = { ...kit };
  }

  setMuted(track: Track, muted: boolean): void {
    if (muted) this.muted.add(track);
    else this.muted.delete(track);
  }

  isMuted(track: Track): boolean {
    return this.muted.has(track);
  }

  /** Escuchar una sola fila; `null` quita el solo. */
  setSolo(track: Track | null): void {
    this.solo = track;
  }

  get soloTrack(): Track | null {
    return this.solo;
  }

  private audible(track: Track): boolean {
    if (this.solo !== null) return track === this.solo;
    return !this.muted.has(track);
  }

  /** El planificador: programa todo lo que caiga dentro de la ventana de anticipación. Se llama cada ~25 ms. */
  pump(): void {
    if (!this.running) return;
    const now = this.out.now();
    // Atrasado (p. ej. la app se congeló): saltar lo que ya pasó, sin tocarlo de golpe.
    while (this.nextTime < now - LATE_TOLERANCE) {
      this.advance();
      this.st.skippedSteps++;
    }
    while (this.nextTime < now + this.lookahead) {
      const step = this.nextStep;
      const time = this.nextTime;
      this.ticks.push({ time, step, cycle: this.cycle });
      if (this.ticks.length > MAX_TICKS) this.ticks.shift();
      for (const track of TRACKS) {
        if (this.pattern[track][step] && this.audible(track)) {
          this.out.play(this.kit[track], time);
          this.st.scheduled++;
        }
      }
      this.advance();
    }
  }

  private advance(): void {
    this.nextTime += stepSeconds(this.bpm);
    this.nextStep = (this.nextStep + 1) % STEPS;
    if (this.nextStep === 0) {
      this.cycle++;
      this.st.cycles++;
      if (this.pending !== null) {
        this.bpm = this.pending;
        this.pending = null;
      }
    }
  }

  /** El pulso que se está oyendo en el instante `t` del reloj de audio (para el cursor), o `null` antes del primero. */
  stepAt(t: number): number | null {
    let found: number | null = null;
    for (const k of this.ticks) if (k.time <= t) found = k.step;
    return found;
  }

  /** Marcas recientes (para pruebas y para dibujar). */
  recentTicks(): readonly Tick[] {
    return this.ticks;
  }
}

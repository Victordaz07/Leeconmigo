/**
 * Temporizador de lectura (docs/03-READING-ENGINE.md, "Máquina de estados del temporizador").
 *
 *   IDLE → READY → READING ⇄ GRACE_PERIOD → PAUSED → RESUMING → READING → COMPLETED
 *
 * REGLA DE DISEÑO: el temporizador NO conoce el motor de voz. Hay dos formas de alimentarlo:
 *
 *  - `ReadingTimerMachine`: consume SEGMENTOS de la línea de tiempo del audio { fromMs, toMs, valid }.
 *    Es la que usa un motor real con latencia (Whisper tarda segundos en responder, pero los
 *    segmentos llevan la hora REAL del audio, así que las transiciones se fechan con exactitud
 *    aunque se descubran tarde). Es la lógica validada en el Prototipo 00.
 *
 *  - `LiveReadingTimer` (implementa el contrato `ReadingTimer`): se alimenta con señales
 *    `onValidReading()` / `onSilence()` y un reloj. Es la que usa el FakeReadingEngine.
 *
 * Reglas:
 *  - READING es el ÚNICO estado que suma tiempo válido. Los segundos de GRACE_PERIOD no cuentan.
 *  - Sin lectura válida durante `pauseAfterMs` (~10 s) → PAUSED. Desde GRACE_PERIOD, si vuelve la
 *    lectura, se retoma READING sin trámite.
 *  - Desde PAUSED hacen falta `resumeNeedMs` (~3 s) CONSECUTIVOS de lectura válida (RESUMING). Esos
 *    ~3 s no se suman como tiempo válido.
 *  - Los silencios cortos dentro de la lectura (respirar, dudar ≤ `holdMs`) se acreditan como lectura;
 *    si duran más, se retroactúa y ese tramo cuenta como GRACE_PERIOD.
 *  - Estado inicial de la lectura: READY. La primera lectura válida pasa directo a READING (así lo
 *    muestra el diagrama de docs/03). El Prototipo 00 exigía 3 s también al inicio: `startNeedsResume`.
 *
 * Los umbrales de 10 s y 3 s son aproximados y deben calibrarse con el Prototipo 00 en la tablet real.
 */
import { READING_TIMER_STATES } from '@lee-conmigo/contracts';
import type { ReadingTimer, ReadingTimerSnapshot, ReadingTimerState, TimerTransition } from '@lee-conmigo/contracts';

/** Tramo de la línea de tiempo del audio (ms desde el inicio de la sesión). */
export interface TimerSegment {
  fromMs: number;
  toMs: number;
  valid: boolean;
}

export interface ReadingTimerConfig {
  /** Sin lectura válida durante este tiempo → PAUSED. */
  pauseAfterMs: number;
  /** Lectura válida consecutiva necesaria en RESUMING para volver a READING. */
  resumeNeedMs: number;
  /** Silencio máximo que aún cuenta como parte de la lectura. */
  holdMs: number;
  /** true = la primera lectura también pasa por RESUMING (3 s). false = READY → READING directo. */
  startNeedsResume: boolean;
}

export const DEFAULT_TIMER_CONFIG: ReadingTimerConfig = {
  pauseAfterMs: 10_000,
  resumeNeedMs: 3_000,
  holdMs: 1_500,
  startNeedsResume: false,
};

const zeroTimes = (): Record<ReadingTimerState, number> =>
  Object.fromEntries(READING_TIMER_STATES.map((s) => [s, 0])) as Record<ReadingTimerState, number>;

export class ReadingTimerMachine {
  private cfg: ReadingTimerConfig;
  private st: ReadingTimerState = 'IDLE';
  private t = 0; // instante confirmado
  private validMs = 0;
  private timeInState = zeroTimes();
  private pauses = 0;
  /** Silencio pendiente de clasificar (READING / RESUMING): se acredita si vuelve la lectura a tiempo. */
  private gapMs = 0;
  /** Progreso consecutivo en RESUMING. */
  private streakMs = 0;
  /** Silencio acumulado en GRACE_PERIOD (desde el fin de la última lectura válida). */
  private graceMs = 0;
  private listeners: Array<(t: TimerTransition) => void> = [];

  constructor(cfg: Partial<ReadingTimerConfig> = {}) {
    this.cfg = { ...DEFAULT_TIMER_CONFIG, ...cfg };
  }

  setConfig(cfg: Partial<ReadingTimerConfig>): void {
    this.cfg = { ...this.cfg, ...cfg };
  }

  onTransition(cb: (t: TimerTransition) => void): void {
    this.listeners.push(cb);
  }

  get state(): ReadingTimerState {
    return this.st;
  }

  get confirmedMs(): number {
    return this.t;
  }

  snapshot(): ReadingTimerSnapshot {
    return {
      state: this.st,
      validSeconds: this.validMs / 1000,
      sessionSeconds: this.t / 1000,
      confirmedMs: this.t,
      timeInStateMs: { ...this.timeInState },
      pauses: this.pauses,
    };
  }

  /** IDLE → READY: historia cargada, micrófono preparado, esperando inicio. */
  prepare(): void {
    if (this.st === 'IDLE') this.go('READY', 0, 'sesión preparada');
  }

  /** Vuelve a IDLE y borra todo. */
  reset(): void {
    this.st = 'IDLE';
    this.t = 0;
    this.validMs = 0;
    this.timeInState = zeroTimes();
    this.pauses = 0;
    this.gapMs = this.streakMs = this.graceMs = 0;
  }

  /** Procesa el siguiente tramo de la línea de tiempo. Se ignora en IDLE y COMPLETED. */
  ingest(seg: TimerSegment): void {
    if (this.st === 'IDLE' || this.st === 'COMPLETED') return;
    // Robustez: rellenar huecos como "sin lectura" y recortar solapes.
    if (seg.fromMs > this.t) this.step(false, seg.fromMs - this.t);
    const from = Math.max(seg.fromMs, this.t);
    if (seg.toMs > from) this.step(seg.valid, seg.toMs - from);
  }

  /**
   * Pausa inmediata (p. ej. la app pasó a segundo plano: docs/06). Al volver, se exige lectura
   * válida (RESUMING) antes de seguir sumando tiempo.
   */
  forcePause(reason = 'pausa forzada'): void {
    if (this.st === 'IDLE' || this.st === 'READY' || this.st === 'COMPLETED' || this.st === 'PAUSED') return;
    this.resolveGapAsSilence();
    this.graceMs = 0;
    this.streakMs = 0;
    this.go('PAUSED', this.t, reason);
  }

  /** La sesión / meta terminó. Un silencio pendiente que no alcanzó a acreditarse pasa a GRACE_PERIOD. */
  complete(): void {
    if (this.st === 'IDLE' || this.st === 'COMPLETED') return;
    this.resolveGapAsSilence();
    this.go('COMPLETED', this.t, 'sesión completada');
  }

  // -------------------------------------------------------------------------

  private go(to: ReadingTimerState, atMs: number, reason: string): void {
    if (to === this.st) return;
    const tr: TimerTransition = { from: this.st, to, atMs, reason };
    if (to === 'PAUSED') this.pauses++;
    this.st = to;
    this.listeners.forEach((cb) => cb(tr));
  }

  /** Avanza `dur` ms en el estado actual, partiendo el tramo en cada umbral que se cruce. */
  private step(valid: boolean, dur: number): void {
    let remaining = dur;
    while (remaining > 1e-6) {
      const used = valid ? this.stepValid(remaining) : this.stepInvalid(remaining);
      this.t += used;
      remaining -= used;
    }
  }

  private stepValid(remaining: number): number {
    switch (this.st) {
      case 'READY':
        this.streakMs = 0;
        this.gapMs = 0;
        this.go(this.cfg.startNeedsResume ? 'RESUMING' : 'READING', this.t, 'primera lectura válida');
        return 0; // reprocesa el mismo tramo en el estado nuevo

      case 'READING': {
        // El silencio corto que precedía se acredita como lectura.
        const credit = this.gapMs;
        this.gapMs = 0;
        this.timeInState.READING += credit + remaining;
        this.validMs += credit + remaining;
        return remaining;
      }
      case 'GRACE_PERIOD':
        // Volvió la lectura antes de los 10 s: se retoma sin más trámite.
        this.graceMs = 0;
        this.go('READING', this.t, 'lectura válida antes del límite de pausa');
        return 0;

      case 'PAUSED':
        this.streakMs = 0;
        this.gapMs = 0;
        this.go('RESUMING', this.t, 'lectura válida detectada durante la pausa');
        return 0;

      case 'RESUMING': {
        const credit = this.gapMs;
        this.gapMs = 0;
        this.streakMs += credit;
        this.timeInState.RESUMING += credit;
        const need = Math.max(this.cfg.resumeNeedMs - this.streakMs, 0);
        const used = Math.min(remaining, need);
        this.streakMs += used;
        this.timeInState.RESUMING += used;
        if (this.streakMs >= this.cfg.resumeNeedMs - 1e-6) {
          // Consecutivos suficientes: vuelve a READING justo al cruzar el umbral.
          this.streakMs = 0;
          this.go('READING', this.t + used, `${this.cfg.resumeNeedMs} ms consecutivos de lectura válida`);
        }
        // used=0 significa que la racha ya se completó (con un silencio acreditado) y ahora estamos en
        // READING: el bucle reprocesa el resto del tramo como lectura válida.
        return used;
      }
      default:
        return remaining; // IDLE / COMPLETED no llegan aquí (ingest los ignora)
    }
  }

  private stepInvalid(remaining: number): number {
    switch (this.st) {
      case 'READY':
        this.timeInState.READY += remaining;
        return remaining;

      case 'PAUSED':
        this.timeInState.PAUSED += remaining;
        return remaining;

      case 'READING':
      case 'RESUMING': {
        // Silencio pendiente de clasificar: ¿respiro o pausa real?
        const hold = Math.max(this.cfg.holdMs, 1);
        const used = Math.min(remaining, Math.max(hold - this.gapMs, 0));
        this.gapMs += used;
        if (this.gapMs >= hold - 1e-6) {
          const gapStart = this.t + used - this.gapMs;
          this.resolveGapAsSilence(gapStart);
        }
        return used;
      }

      case 'GRACE_PERIOD': {
        const used = Math.min(remaining, Math.max(this.cfg.pauseAfterMs - this.graceMs, 0));
        this.graceMs += used;
        this.timeInState.GRACE_PERIOD += used;
        if (this.graceMs >= this.cfg.pauseAfterMs - 1e-6) {
          this.graceMs = 0;
          this.go('PAUSED', this.t + used, `${this.cfg.pauseAfterMs} ms sin lectura válida`);
        }
        return used;
      }
      default:
        return remaining;
    }
  }

  /**
   * El silencio pendiente ya no es un simple respiro: se "retroactúa".
   *  - En READING pasa a GRACE_PERIOD, fechado en el inicio del silencio (el instante en que
   *    realmente terminó la última lectura válida).
   *  - En RESUMING la racha se rompe y se vuelve a PAUSED.
   */
  private resolveGapAsSilence(gapStart = this.t - this.gapMs): void {
    const gap = this.gapMs;
    if (gap <= 0) return;
    this.gapMs = 0;
    if (this.st === 'READING') {
      this.go('GRACE_PERIOD', gapStart, `sin lectura válida durante más de ${this.cfg.holdMs} ms`);
      this.graceMs = gap;
      this.timeInState.GRACE_PERIOD += gap;
    } else if (this.st === 'RESUMING') {
      this.streakMs = 0;
      this.go('PAUSED', gapStart, 'la lectura se interrumpió antes de completar la reanudación');
      this.timeInState.PAUSED += gap;
    }
  }
}

// ---------------------------------------------------------------------------

export interface LiveTimerOptions {
  /**
   * Cada señal `onValidReading()` respalda los últimos `evidenceTtlMs` ms como lectura ("acabo de
   * leer una palabra"). Debe ser un poco mayor que el intervalo típico entre palabras.
   */
  evidenceTtlMs: number;
}

/**
 * Implementación del contrato `ReadingTimer` basada en un reloj y señales. Llama a `tick()` de vez
 * en cuando (p. ej. cada 250 ms) para que el estado avance aunque no lleguen señales.
 */
export class LiveReadingTimer implements ReadingTimer {
  readonly machine: ReadingTimerMachine;
  private clock: () => number;
  private startedAt = 0;
  private endedAtMs: number | null = null;
  private ttl: number;
  private pending: Array<[number, number]> = [];

  constructor(config: Partial<ReadingTimerConfig> = {}, clock: () => number = () => Date.now(), opts: Partial<LiveTimerOptions> = {}) {
    this.machine = new ReadingTimerMachine(config);
    this.clock = clock;
    this.ttl = opts.evidenceTtlMs ?? 800;
  }

  /** IDLE → READY y arranca el reloj de sesión. */
  prepare(): void {
    this.machine.reset();
    this.pending = [];
    this.endedAtMs = null;
    this.startedAt = this.clock();
    this.machine.prepare();
  }

  onTransition(cb: (t: TimerTransition) => void): void {
    this.machine.onTransition(cb);
  }

  get state(): ReadingTimerState {
    this.tick();
    return this.machine.state;
  }
  get validSeconds(): number {
    this.tick();
    return this.machine.snapshot().validSeconds;
  }
  get sessionSeconds(): number {
    return this.elapsed() / 1000;
  }

  /** Hay voz, pero no sabemos si es lectura: no suma ni reanuda por sí sola. Solo avanza el reloj. */
  onVoiceActivity(): void {
    this.tick();
  }

  onValidReading(): void {
    const now = this.elapsed();
    const from = Math.max(this.machine.confirmedMs, now - this.ttl);
    if (now > from) this.pending.push([from, now]);
    this.tick();
  }

  onSilence(): void {
    this.tick();
  }

  /**
   * Avanza la línea de tiempo con la evidencia acumulada.
   *
   * El silencio se confirma con un retraso de `evidenceTtlMs` respecto de "ahora": la lectura que llega en este
   * instante respalda los últimos ms hacia atrás, así que esos ms no pueden darse por perdidos todavía. Sin este
   * retraso, una palabra que llegara justo después de un `tick` no dejaría evidencia y una reanudación con lectura
   * regular podía no reconocerse nunca. `flush` confirma hasta "ahora" (al pausar o terminar no queda nada por llegar).
   */
  tick(flush = false): void {
    if (this.machine.state === 'IDLE' || this.machine.state === 'COMPLETED') return;
    const now = this.elapsed();
    let cursor = this.machine.confirmedMs;
    for (const [a, b] of this.pending.sort((x, y) => x[0] - y[0])) {
      const from = Math.max(a, cursor);
      if (b <= from) continue;
      if (from > cursor) this.machine.ingest({ fromMs: cursor, toMs: from, valid: false });
      this.machine.ingest({ fromMs: from, toMs: b, valid: true });
      cursor = b;
    }
    this.pending = [];
    const frontier = flush ? now : now - this.ttl;
    if (frontier > cursor) this.machine.ingest({ fromMs: cursor, toMs: frontier, valid: false });
  }

  /** La app pasó a segundo plano: pausa inmediata (docs/06). */
  suspend(reason = 'la app pasó a segundo plano'): void {
    this.tick(true);
    this.machine.forcePause(reason);
  }

  complete(): void {
    this.tick(true);
    this.endedAtMs = this.elapsed();
    this.machine.complete();
  }

  snapshot(): ReadingTimerSnapshot {
    this.tick();
    return { ...this.machine.snapshot(), sessionSeconds: this.sessionSeconds };
  }

  private elapsed(): number {
    if (this.machine.state === 'IDLE') return 0;
    return this.endedAtMs ?? this.clock() - this.startedAt;
  }
}

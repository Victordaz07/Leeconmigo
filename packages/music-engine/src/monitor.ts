/**
 * Mide qué tan parejo corre el planificador en el teléfono: cada vez que la interfaz llama a `pump()` anota el instante; si pasa más tiempo del
 * margen de anticipación entre dos llamadas, el hilo de la interfaz se «congeló» y probablemente se oyó un hueco. Es la medida clave de AR-T1.
 */
export interface MonitorReport {
  /** Llamadas a `pump()` medidas. */
  pumps: number;
  /** El hueco más largo entre dos llamadas, en milisegundos. */
  maxGapMs: number;
  /** Media de los huecos, en milisegundos (con el temporizador a 25 ms debería rondar 25). */
  meanGapMs: number;
  /** Cuántos huecos superaron el margen de anticipación (cada uno es un riesgo de corte de sonido). */
  stalls: number;
}

export class PumpMonitor {
  private last: number | null = null;
  private n = 0;
  private sum = 0;
  private max = 0;
  private stallCount = 0;

  /** `marginMs` = la anticipación del planificador (por defecto 100 ms). */
  constructor(private readonly marginMs = 100) {}

  /** Anota una llamada a `pump()` en el instante `nowMs` (reloj monótono en ms). */
  record(nowMs: number): void {
    if (this.last !== null) {
      const gap = nowMs - this.last;
      this.n++;
      this.sum += gap;
      this.max = Math.max(this.max, gap);
      if (gap > this.marginMs) this.stallCount++;
    }
    this.last = nowMs;
  }

  /** Vuelve a empezar (p. ej. al detener y arrancar de nuevo). */
  reset(): void {
    this.last = null;
    this.n = 0;
    this.sum = 0;
    this.max = 0;
    this.stallCount = 0;
  }

  report(): MonitorReport {
    return { pumps: this.n, maxGapMs: Math.round(this.max), meanGapMs: this.n ? Math.round((this.sum / this.n) * 10) / 10 : 0, stalls: this.stallCount };
  }
}

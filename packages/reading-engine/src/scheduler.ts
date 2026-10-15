/**
 * Planificador inyectable: el motor nunca llama a setTimeout/Date.now directamente.
 * Así las pruebas corren con tiempo simulado (`ManualScheduler`) y no dependen de relojes reales.
 */
export interface Scheduler {
  now(): number;
  setTimeout(fn: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
  setInterval(fn: () => void, ms: number): unknown;
  clearInterval(handle: unknown): void;
}

export const realScheduler: Scheduler = {
  now: () => Date.now(),
  setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms),
  clearTimeout: (h) => globalThis.clearTimeout(h as ReturnType<typeof setTimeout>),
  setInterval: (fn, ms) => globalThis.setInterval(fn, ms),
  clearInterval: (h) => globalThis.clearInterval(h as ReturnType<typeof setInterval>),
};

interface Task {
  id: number;
  at: number;
  fn: () => void;
  every?: number;
}

/** Reloj simulado: `advance(ms)` ejecuta en orden todo lo que venza. Para pruebas y demos. */
export class ManualScheduler implements Scheduler {
  private t = 0;
  private nextId = 1;
  private tasks: Task[] = [];

  now(): number {
    return this.t;
  }
  setTimeout(fn: () => void, ms: number): number {
    const id = this.nextId++;
    this.tasks.push({ id, at: this.t + ms, fn });
    return id;
  }
  clearTimeout(h: unknown): void {
    this.tasks = this.tasks.filter((k) => k.id !== h);
  }
  setInterval(fn: () => void, ms: number): number {
    const id = this.nextId++;
    this.tasks.push({ id, at: this.t + ms, fn, every: ms });
    return id;
  }
  clearInterval(h: unknown): void {
    this.clearTimeout(h);
  }

  /** Avanza el tiempo simulado, ejecutando las tareas vencidas en orden cronológico. */
  advance(ms: number): void {
    const target = this.t + ms;
    for (;;) {
      const due = this.tasks.filter((k) => k.at <= target).sort((a, b) => a.at - b.at || a.id - b.id)[0];
      if (!due) break;
      this.t = due.at;
      if (due.every !== undefined) due.at += due.every;
      else this.tasks = this.tasks.filter((k) => k.id !== due.id);
      due.fn();
    }
    this.t = target;
  }

  get pendingCount(): number {
    return this.tasks.length;
  }
}

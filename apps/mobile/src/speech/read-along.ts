/**
 * "¿Sabe lo que estoy leyendo?" (Prueba de voz, RN-03): compara lo que reconoció la voz con la frase que se lee, con el
 * MISMO comparador que usa la lectura de verdad (`ReadingProgressTracker` de reading-engine), y dice qué palabras del
 * texto ya se oyeron. Módulo puro.
 */
import { normalizeText, ReadingProgressTracker } from '@lee-conmigo/reading-engine';

export interface ReadAlongWord {
  /** Tal como se muestra (con puntuación y acentos). */
  text: string;
  /** Índices de esta palabra en el texto normalizado (normalmente uno; ninguno si es solo puntuación). */
  idx: number[];
}

export interface HeardResult {
  /** Palabras reconocidas (sin repeticiones). */
  recognized: number;
  /** Cuántas coincidieron con el texto. */
  matched: number;
  /** matched / recognized: ¿lo que se oyó ES el texto? (0–1) */
  score: number;
}

export function splitForReadAlong(text: string): ReadAlongWord[] {
  let n = 0;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => {
      const k = normalizeText(t).length;
      const idx = Array.from({ length: k }, (_, i) => n + i);
      n += k;
      return { text: t, idx };
    });
}

export class ReadAlong {
  readonly words: ReadAlongWord[];
  private tracker: ReadingProgressTracker;

  constructor(text: string) {
    this.words = splitForReadAlong(text);
    this.tracker = new ReadingProgressTracker(text);
  }

  /** Agrega una frase reconocida: marca las palabras del texto que coincidieron. */
  hear(recognized: string): HeardResult {
    const m = this.tracker.match(recognized);
    this.tracker.commit(m);
    return { recognized: m.recognizedWords, matched: m.matched, score: m.score };
  }

  /** Índices (de `words`) ya oídos. */
  heardWords(): Set<number> {
    const covered = new Set(this.tracker.coveredIndices());
    const out = new Set<number>();
    this.words.forEach((w, i) => {
      if (w.idx.some((k) => covered.has(k))) out.add(i);
    });
    return out;
  }

  /** 0–1: cuánto del texto ya se oyó. */
  coverage(): number {
    return this.tracker.state().coverage;
  }

  reset(): void {
    this.tracker.reset();
  }
}

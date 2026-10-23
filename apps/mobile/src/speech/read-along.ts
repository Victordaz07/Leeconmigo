/**
 * "¿Sabe lo que estoy leyendo?" (Prueba de voz, RN-03): compara lo que reconoció la voz con la frase que se lee, con el
 * MISMO comparador que usa la lectura de verdad (`ReadingFollower` de reading-engine), y dice qué palabras del
 * texto ya se oyeron. Módulo puro.
 */
import { normalizeText, ReadingFollower } from '@lee-conmigo/reading-engine';

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
  private follower: ReadingFollower;
  private sequence = 0;

  constructor(text: string) {
    this.words = splitForReadAlong(text);
    this.follower = new ReadingFollower(this.words.map(word => word.text));
  }

  /** Agrega una frase reconocida: marca las palabras del texto que coincidieron. */
  hear(recognized: string): HeardResult {
    const state = this.follower.accept(recognized, false, ++this.sequence);
    this.follower.accept(recognized, true, this.sequence);
    const count = normalizeText(recognized).length;
    const matched = state.preview.length;
    return { recognized: count, matched, score: count ? matched / count : 0 };
  }

  /** Indices are the exact displayed words, not a range from cursor to last match. */
  heardWords(): Set<number> { return new Set(this.follower.snapshot().confirmed); }

  /** 0–1: cuánto del texto ya se oyó. */
  coverage(): number {
    return this.follower.snapshot().confirmed.length / Math.max(1, this.words.filter(w => normalizeText(w.text).length).length);
  }

  reset(): void {
    this.follower = new ReadingFollower(this.words.map(word => word.text));
    this.sequence = 0;
  }
}

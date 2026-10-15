/**
 * Comparador de lectura: ¿lo que reconoció el motor de voz corresponde al texto que el niño debe leer?
 * (docs/03-READING-ENGINE.md, "Reading Alignment Engine"). Módulo puro: solo recibe texto.
 *
 * Porte del comparador del Prototipo 00, ya probado en Chrome con Whisper real (ver ese README).
 *
 * Idea general
 *  1. Normalizar el texto esperado y el reconocido.
 *  2. Quitar repeticiones inmediatas del reconocido: un tartamudeo NO debe bajar el puntaje.
 *  3. Alinear localmente (Smith-Waterman a nivel de palabras): una palabra "coincide" si es igual o
 *     muy parecida (distancia de edición) → tolera pronunciación imperfecta; saltarse palabras del
 *     texto y palabras sobrantes cuestan poco, pero no son gratis.
 *  4. `confidence` de una ventana = coincidentes / palabras reconocidas ("¿esto que se oyó es el
 *     texto?"). Con charla ajena o alucinaciones sale bajo aunque haya voz.
 *
 * NOTA: esto es alineación por VENTANAS de texto (sirve para saber si el niño lee el texto y dónde).
 * El seguimiento palabra por palabra con resultados parciales en streaming (Etapas 15-16) es
 * trabajo posterior y depende del proveedor de voz elegido.
 */
import type { MatchResult, ReadingMatcher } from '@lee-conmigo/contracts';
import { collapseRepeats, normalizeText, wordSimilarity } from './normalize.ts';

export interface MatchOptions {
  /** Similitud mínima (0-1) para considerar que dos palabras coinciden. */
  wordSimilarity: number;
}

export const DEFAULT_MATCH_OPTIONS: MatchOptions = { wordSimilarity: 0.7 };

export interface WindowMatch {
  /** Palabras reconocidas tras quitar repeticiones. */
  recognizedWords: number;
  /** Cuántas de ellas quedaron alineadas con palabras del texto. */
  matched: number;
  /** matched / recognizedWords (0 si no hay palabras). */
  score: number;
  /** Índices (en el texto esperado) de las palabras alineadas. */
  matchedIdx: number[];
  /** Primera / última palabra del texto alineada (-1 si no hubo alineación). */
  startIdx: number;
  endIdx: number;
}

const MATCH_SCORE = 2; // bonus por coincidencia (se multiplica por la similitud)
const MISMATCH = -1; // sustitución
const GAP = -0.6; // omisión o palabra sobrante: barato, porque los niños omiten y agregan cosas

/**
 * Alinea las palabras reconocidas contra el texto esperado (ya normalizados).
 * `hintIdx` (última posición conocida) solo sirve para desempatar entre alineaciones igual de buenas.
 */
export function alignWindow(expected: string[], recognizedRaw: string[], opts: MatchOptions, hintIdx = -1): WindowMatch {
  const rec = collapseRepeats(recognizedRaw);
  const m = rec.length;
  const n = expected.length;
  const empty: WindowMatch = { recognizedWords: m, matched: 0, score: 0, matchedIdx: [], startIdx: -1, endIdx: -1 };
  if (m === 0 || n === 0) return empty;

  const sim: number[][] = rec.map((r) => expected.map((e) => wordSimilarity(r, e)));
  const H: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  // 0 = fin, 1 = diagonal, 2 = arriba (palabra sobrante), 3 = izquierda (palabra omitida)
  const T: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

  let best = 0;
  let bi = 0;
  let bj = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const s = sim[i - 1][j - 1];
      const diag = H[i - 1][j - 1] + (s >= opts.wordSimilarity ? MATCH_SCORE * s : MISMATCH);
      const up = H[i - 1][j] + GAP;
      const left = H[i][j - 1] + GAP;
      const v = Math.max(0, diag, up, left);
      H[i][j] = v;
      T[i][j] = v === 0 ? 0 : v === diag ? 1 : v === up ? 2 : 3;
      const better = v > best + 1e-9;
      const tie = Math.abs(v - best) <= 1e-9 && v > 0 && hintIdx >= 0 && Math.abs(j - 1 - (hintIdx + 1)) < Math.abs(bj - 1 - (hintIdx + 1));
      if (better || tie) {
        best = v;
        bi = i;
        bj = j;
      }
    }
  }
  if (best <= 0) return empty;

  const matchedIdx: number[] = [];
  let i = bi;
  let j = bj;
  while (i > 0 && j > 0 && H[i][j] > 0) {
    const t = T[i][j];
    if (t === 1) {
      if (sim[i - 1][j - 1] >= opts.wordSimilarity) matchedIdx.push(j - 1);
      i--;
      j--;
    } else if (t === 2) i--;
    else if (t === 3) j--;
    else break;
  }
  matchedIdx.reverse();
  const matched = matchedIdx.length;
  return {
    recognizedWords: m,
    matched,
    score: matched / m,
    matchedIdx,
    startIdx: matched ? matchedIdx[0] : -1,
    endIdx: matched ? matchedIdx[matched - 1] : -1,
  };
}

/** Implementación sin estado del contrato `ReadingMatcher` (no guarda datos). */
export class TextReadingMatcher implements ReadingMatcher {
  private opts: MatchOptions;

  constructor(opts: MatchOptions = DEFAULT_MATCH_OPTIONS) {
    this.opts = opts;
  }

  align(expectedText: string, recognizedText: string): MatchResult {
    const expected = normalizeText(expectedText);
    const w = alignWindow(expected, normalizeText(recognizedText), this.opts);
    // Palabra esperada dentro del tramo alineado que no se reconoció: posible dificultad.
    let suspected: number | undefined;
    if (w.startIdx >= 0) {
      for (let k = w.startIdx; k <= w.endIdx; k++) {
        if (!w.matchedIdx.includes(k)) {
          suspected = k;
          break;
        }
      }
    }
    return { confidence: w.score, currentTokenIndex: w.endIdx, matchedTokens: w.matchedIdx, suspectedDifficultWord: suspected };
  }
}

export interface TrackerState {
  /** Fracción del texto ya oída (0-1) en la pasada actual. */
  coverage: number;
  /** Índice de la última palabra alineada (-1 si aún ninguna). */
  position: number;
  /** Cuántas veces se ha reiniciado el texto (sesiones largas repiten el texto). */
  passes: number;
}

/** Comparador con memoria: acumula el avance sobre un texto esperado fijo. */
export class ReadingProgressTracker {
  private expected: string[] = [];
  private covered = new Set<number>();
  private lastEnd = -1;
  private passes = 0;
  private opts: MatchOptions;

  constructor(expectedText: string, opts: MatchOptions = DEFAULT_MATCH_OPTIONS) {
    this.opts = opts;
    this.setText(expectedText);
  }

  setText(expectedText: string): void {
    this.expected = normalizeText(expectedText);
    this.reset();
  }

  reset(): void {
    this.covered.clear();
    this.lastEnd = -1;
    this.passes = 0;
  }

  get wordCount(): number {
    return this.expected.length;
  }

  /** Evalúa un texto reconocido SIN modificar el avance acumulado. */
  match(recognizedText: string): WindowMatch {
    return alignWindow(this.expected, normalizeText(recognizedText), this.opts, this.lastEnd);
  }

  /** Registra una ventana ya aceptada como lectura válida: actualiza avance y posición. */
  commit(m: WindowMatch): void {
    if (m.matched === 0) return;
    // Si salta hacia atrás más de la mitad del texto tras haber leído bastante → empezó otra pasada.
    if (this.lastEnd >= 0 && m.startIdx < this.lastEnd - this.expected.length / 2 && this.covered.size >= this.expected.length * 0.6) {
      this.covered.clear();
      this.passes++;
    }
    m.matchedIdx.forEach((k) => this.covered.add(k));
    this.lastEnd = m.endIdx;
  }

  coveredIndices(): number[] {
    return [...this.covered];
  }

  state(): TrackerState {
    return {
      coverage: this.expected.length ? this.covered.size / this.expected.length : 0,
      position: this.lastEnd,
      passes: this.passes,
    };
  }
}

/**
 * Repaso rápido: mini-juego de armar cada palabra por sílabas (docs/04, estado 20 "Repaso rápido").
 * Lógica pura extraída del prototipo aprobado. Usa las palabras que costaron durante la lectura
 * (más las palabras base de la historia si faltan) — ver `reviewWords()` en story-engine.
 */

export interface ReviewWord {
  /** Clave de vocabulario (minúsculas, con acentos): "montañas". */
  key: string;
  /** Sílabas en orden correcto: ["mon", "ta", "ñas"]. */
  syllables: string[];
}

export interface ReviewState {
  words: ReviewWord[];
  /** Palabra actual del repaso. */
  index: number;
  /** Posiciones (en la fila de fichas) ya colocadas, en el orden en que se colocaron. */
  built: number[];
  /** Ficha tocada que NO era la que seguía: se sacude un instante (nunca "incorrecto"). */
  wrong: number | null;
}

/**
 * Orden en que se muestran las fichas mezcladas: la ficha `i` de la fila contiene la sílaba
 * `tileOrder(n)[i]`. Es una permutación fija (el repaso es reproducible y testeable), igual que el prototipo.
 *
 * BUG real encontrado por contenido, no por código nuevo (2026-09-29): el respaldo anterior para n≥5 era el
 * arreglo fijo `[3,1,4,0,2]` (5 elementos) recortado con `.slice(0, n)` — para n=5 daba los 5 elementos
 * completos (permutación válida, por eso la prueba existente con n hasta 5 nunca lo detectó), pero para n≥6
 * `.slice(0, n)` sobre un arreglo de solo 5 elementos SIGUE devolviendo nada más esos 5: faltaba una sílaba
 * entera y su ficha nunca se dibujaba. Nunca había pasado hasta que "bioluminiscencia" (6 sílabas) llegó como
 * palabra de repaso. Arreglo: para n≥5 se intercala desde ambos extremos hacia el centro — siempre una
 * permutación COMPLETA de `n` elementos, para cualquier `n`.
 */
export function tileOrder(n: number): number[] {
  if (n === 2) return [1, 0];
  if (n === 3) return [2, 0, 1];
  if (n === 4) return [2, 0, 3, 1];
  const order: number[] = [];
  let lo = 0;
  let hi = n - 1;
  let takeHigh = true;
  while (lo <= hi) {
    order.push(takeHigh ? hi-- : lo++);
    takeHigh = !takeHigh;
  }
  return order;
}

/** Textos de las fichas (mezcladas) de una palabra. */
export function tilesOf(word: ReviewWord): string[] {
  return tileOrder(word.syllables.length).map((k) => word.syllables[k]);
}

export function createReview(words: ReviewWord[]): ReviewState {
  return { words, index: 0, built: [], wrong: null };
}

export const isWordComplete = (r: ReviewState): boolean => r.built.length >= r.words[r.index].syllables.length;
export const isLastWord = (r: ReviewState): boolean => r.index >= r.words.length - 1;

/** Toca una ficha. Si es la sílaba que sigue, se coloca; si no, queda marcada como `wrong` un instante. */
export function tapTile(r: ReviewState, tileIndex: number): ReviewState {
  const word = r.words[r.index];
  if (r.built.includes(tileIndex) || r.built.length >= word.syllables.length) return r;
  const order = tileOrder(word.syllables.length);
  return order[tileIndex] === r.built.length ? { ...r, built: [...r.built, tileIndex], wrong: null } : { ...r, wrong: tileIndex };
}

export const clearWrong = (r: ReviewState): ReviewState => (r.wrong === null ? r : { ...r, wrong: null });

/** Pasa a la siguiente palabra. No hace nada si la actual aún no está completa o si era la última. */
export function nextWord(r: ReviewState): ReviewState {
  if (!isWordComplete(r) || isLastWord(r)) return r;
  return { ...r, index: r.index + 1, built: [], wrong: null };
}

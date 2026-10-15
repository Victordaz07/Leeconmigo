/**
 * Normalización de texto para comparar lo esperado con lo reconocido (docs/03, "Text Normalization").
 * Módulo puro: sin DOM, sin red, sin audio.
 *
 * Alcance actual: minúsculas, sin acentos/diéresis (ñ → n), sin puntuación ni símbolos, sin anotaciones
 * tipo [Música]. Pendiente para más adelante (Etapa 14 del roadmap): apóstrofes/contracciones del
 * inglés ("didn't"), números y variantes.
 */

/** Minúsculas, sin acentos, sin puntuación. Es la forma que se COMPARA. */
export function normalizeWord(w: string): string {
  return w
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Texto libre → palabras normalizadas. Descarta anotaciones que los motores de voz meten a veces:
 * [Música], (aplausos), ♪...
 */
export function normalizeText(text: string): string[] {
  return text
    .replace(/\[[^\]]*\]|\([^)]*\)|[♪♫]/g, ' ')
    .split(/[\s\-–—…/]+/)
    .map(normalizeWord)
    .filter((w) => w.length > 0);
}

/**
 * Clave de vocabulario: minúsculas, CON acentos, sin puntuación ("Puerta," → "puerta").
 * Es la forma que usan los diccionarios de sílabas/definiciones de las historias.
 */
export function vocabularyKey(w: string): string {
  return w.toLowerCase().replace(/[.,;:!?¡¿—–…"«»“”‘’()\[\]]/g, '').trim();
}

/** Quita repeticiones inmediatas de una palabra o de un grupo de 2-4 palabras ("el el gato el gato" → "el gato"). */
export function collapseRepeats(words: string[]): string[] {
  const out: string[] = [];
  for (const w of words) {
    out.push(w);
    for (let n = 1; n <= 4; n++) {
      if (out.length >= 2 * n) {
        const a = out.slice(out.length - 2 * n, out.length - n);
        const b = out.slice(out.length - n);
        if (a.every((x, i) => x === b[i])) {
          out.length -= n; // deja solo una copia
          break;
        }
      }
    }
  }
  return out;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** 1 = iguales, 0 = nada que ver. Palabras de ≤3 letras solo coinciden si son idénticas. */
export function wordSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length <= 3 || b.length <= 3) return 0;
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length);
}

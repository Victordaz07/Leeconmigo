/**
 * Estadísticas de fin de historia (docs/04, pantalla "Fin de historia").
 *
 * Reglas de docs/06: la precisión NUNCA se muestra al niño como calificación constante; puede aparecer
 * al final como logro. Qué audiencia la ve queda como decisión abierta (docs/09 #4): esta capa solo
 * calcula los números; la UI decide qué mostrar.
 */

/** Porcentaje de palabras sin error (0-100). Las "dudosas" no cuentan como error. */
export function accuracyPercent(errorCount: number, wordCount: number): number {
  if (wordCount <= 0) return 100;
  return Math.max(0, Math.round((1 - errorCount / wordCount) * 100));
}

/** Estrellas de celebración: siempre al menos 1 (nunca se castiga al niño). */
export function starsFor(accuracy: number): 1 | 2 | 3 {
  return accuracy >= 90 ? 3 : accuracy >= 75 ? 2 : 1;
}

export function wordsPerMinute(wordCount: number, seconds: number): number {
  return Math.round(wordCount / Math.max(1, seconds / 60));
}

/** 272 → "4:32" */
export function formatDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Limpia lo que devuelve Whisper (módulo puro): quita las marcas que pone en vez de texto ("[música]", "(risas)",
 * "[BLANK_AUDIO]") y los espacios de sobra. Lo que queda se compara con el texto esperado (`TextReadingMatcher`).
 */
export function cleanTranscript(raw: string): string {
  return raw
    .replace(/\[[^\]]*\]|\([^)]*\)|\*[^*]*\*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

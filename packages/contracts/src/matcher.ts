/** Contrato del comparador de lectura (docs/02-ARCHITECTURE.md). El matcher no guarda datos. */

export interface MatchResult {
  /** 0.00–1.00: 0 = no corresponde, ~0.6 = probablemente leyendo, 1 = coincidencia fuerte. Nunca se muestra al niño. */
  confidence: number;
  /** Índice de la última palabra esperada alineada; -1 si no hubo alineación. */
  currentTokenIndex: number;
  /** Índices de las palabras esperadas que quedaron alineadas. */
  matchedTokens: number[];
  /** Índice de una palabra esperada dentro del tramo alineado que no se reconoció (posible dificultad). */
  suspectedDifficultWord?: number;
}

export interface ReadingMatcher {
  align(expectedText: string, recognizedText: string): MatchResult;
}

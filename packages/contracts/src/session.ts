/**
 * Datos DERIVADOS de una sesión de lectura: lo único que se guarda al terminar (docs/07-PRIVACY-AUDIO.md).
 * Nunca audio ni texto reconocido: solo duraciones, contadores y las palabras que costaron.
 */
import type { LanguageCode } from './story.ts';

export interface SessionSummary {
  storyId: string;
  language: LanguageCode;
  /** Nivel de lectura de la app (NO el grado escolar: docs/01). */
  level: number;
  /** Categoría editorial de la historia leída (para el logro "Aventurero", docs/01). */
  category?: string;
  /** Tiempo de lectura VÁLIDA (el que llena la barra de metas del padre). */
  validReadingSeconds: number;
  sessionSeconds: number;
  comprehensionCorrect: number;
  comprehensionTotal: number;
  /** Palabras que necesitaron ayuda o costaron (claves de vocabulario). Sin repetidos. */
  wordsHelped: string[];
  /** 0–1: páginas leídas / páginas de la historia. */
  completion: number;
  /** Estrellas de celebración del final (1–3). Nunca se muestra como calificación. */
  stars?: 1 | 2 | 3;
  /** ISO 8601. */
  completedAt: string;
}

/** Dónde retomar una historia a medias. Granularidad de página: se retoma al inicio de la página. */
export interface ResumePoint {
  storyId: string;
  pageIndex: number;
  updatedAt: string;
}

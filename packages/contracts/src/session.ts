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
  /** Procedencia del tiempo: lectura libre estimada, simulador o reconocimiento real. Ausente en resúmenes antiguos. */
  readingMode?: 'free' | 'simulated' | 'voice';
  sessionSeconds: number;
  comprehensionCorrect: number;
  comprehensionTotal: number;
  /** Palabras que necesitaron ayuda o costaron (claves de vocabulario). Sin repetidos. */
  wordsHelped: string[];
  /** 0–1: páginas leídas / páginas de la historia. */
  completion: number;
  /** Estrellas de celebración del final (1–3). Nunca se muestra como calificación. */
  stars?: 1 | 2 | 3;
  /**
   * Kitewise (B13): cómo sintió el niño su enfoque, con 3 caritas (1 = me costó, 3 = muy concentrado). Autoevaluación:
   * nunca se usa como nota. Opcional (la app web no lo pide).
   */
  focusSelfReport?: 1 | 2 | 3;
  /** Kitewise (B2): la energía con la que llegó ese día. Opcional. */
  energy?: 'alta' | 'normal' | 'baja';
  /** ISO 8601. */
  completedAt: string;
}

/** Dónde retomar una historia a medias. Sin ancla de bloque/párrafo se retoma al inicio de la página editorial. */
export interface ResumePoint {
  storyId: string;
  pageIndex: number;
  /** Ancla opcional del lector por escenas; pageIndex conserva la página editorial para clientes anteriores. */
  blockId?: string;
  lineIndex?: number;
  updatedAt: string;
}

/**
 * Contenido del cuaderno de Sociedad (Kitewise, docs/13 K6-equivalente para Sociedad; diseño en
 * `docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md`). Aditivo: nada aquí cambia una historia ni una unidad de Matemáticas.
 *
 * Reglas que el contenido respeta (y valida `@lee-conmigo/social-content`):
 * - `grade` es la referencia curricular; el nivel de práctica lo elige la familia (docs/01: el nivel NO es el grado).
 * - Todo texto viene en los dos idiomas, escrito de forma natural en cada uno (no traducido palabra por palabra).
 * - El arte (mapas, fotos) es evidencia específica de la unidad, nunca texto incrustado (docs/05).
 * - Nunca "incorrecto" ni rojo (docs/06): las preguntas de fuente nombran una preferida, con pista si el niño elige
 *   otra, pero siempre se puede seguir.
 * - Los códigos de estándares son BORRADOR y solo los ven los padres hasta que un docente los valide.
 */
import type { Localized } from './math.ts';
import type { StandardsReview } from './math.ts';

export type SocialSourceKind = 'mapa' | 'foto' | 'testimonio';

/** Una fuente de evidencia (Mesa de fuentes, `docs/research/sociedad-investigacion.md` §7). */
export interface SocialSource {
  id: string;
  kind: SocialSourceKind;
  title: Localized;
  /** Texto breve que explica qué es esta fuente (nunca dentro de la imagen). */
  caption: Localized;
  /** Clave de arte resuelta en la app (`sociedad-art.ts`); `null` = sin imagen (p. ej. un testimonio hablado). */
  art: string | null;
}

/** Una capa del mapa por capas (antes/después del mismo lugar). */
export interface SocialMapLayer {
  id: string;
  label: Localized;
  /** Clave de arte resuelta en la app. */
  art: string;
}

export interface SocialChoice {
  id: string;
  text: Localized;
}

/** Afirmación del paso "comparar": el niño la clasifica como "sigue igual" o "es nuevo". */
export interface SocialStatement {
  id: string;
  text: Localized;
  status: 'igual' | 'nuevo';
}

export type SocialStep =
  | { id: string; kind: 'pregunta'; prompt: Localized; layers: SocialMapLayer[] }
  | { id: string; kind: 'comparar'; prompt: Localized; layers: SocialMapLayer[]; statements: SocialStatement[] }
  | { id: string; kind: 'fuente'; prompt: Localized; sourceId: string; choices: SocialChoice[]; preferredChoiceIds: string[] }
  | { id: string; kind: 'testimonio'; prompt: Localized; sourceId: string; quote: Localized; choices: SocialChoice[]; preferredChoiceIds: string[] }
  | { id: string; kind: 'explicar'; prompt: Localized; sourceIds: string[]; minSources: number }
  | { id: string; kind: 'revisar'; prompt: Localized; choices: SocialChoice[]; gapChoiceId: string };

export interface SocialUnit {
  id: string;
  grade: number;
  /** Referencia curricular, p. ej. "CA HSS 3.3" (borrador, ver `standardsReview`). */
  standard: string;
  standardsReview: StandardsReview;
  title: Localized;
  /** IDs del elenco reusado (docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md): `['ines','teo','elena']`. */
  cast: string[];
  sources: SocialSource[];
  steps: SocialStep[];
}

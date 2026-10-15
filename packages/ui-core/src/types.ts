import type { Audience } from '@lee-conmigo/contracts';

/**
 * Preferencias de presentación de la lectura. Son las opciones que docs/09-OPEN-DECISIONS.md deja abiertas:
 * cada una implementa el comportamiento del prototipo aprobado como valor por defecto y queda detrás de
 * una opción explícita, para poder cambiarla sin tocar componentes.
 */
export interface ReaderPrefs {
  /** TEMPORAL (docs/09 #5): 2 audiencias del prototipo vs. los 6 niveles / 3 bandas visuales. */
  audience: Audience;
  /**
   * TEMPORAL (docs/09 #2): marca de la palabra actual. El prototipo resalta la palabra (`resaltador`) o la
   * subraya (`subrayado`). Resaltar por FRASE (lo que pedía la visión original) aún no está implementado.
   */
  highlight: 'resaltador' | 'subrayado';
  /** `todos` = todos los globos visibles; `progresivo` = los globos aparecen a medida que se leen. */
  bubbles: 'todos' | 'progresivo';
  /** Tamaño del texto del panel lateral (px). Por defecto 27, el valor del lienzo aprobado; ajustable por accesibilidad (docs/06). */
  textSize: number;
}

export const defaultPrefs: ReaderPrefs = { audience: 'explorador', highlight: 'resaltador', bubbles: 'todos', textSize: 27 };

/** Metas diarias de lectura que se ofrecen en Modo padres (docs/01: "presets 5, 10, 15, 20 o 30 min o personalizado"). */
export const DAILY_GOAL_PRESETS = [5, 10, 15, 20, 30] as const;
export const DEFAULT_DAILY_GOAL_MINUTES = 15;

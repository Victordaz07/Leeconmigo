/**
 * Misiones de «Para la vida» (módulos 02–08). Una misión es una situación FICTICIA con tres encuentros de tres tipos: ELEGIR y comparar caminos
 * (`choose`), ORDENAR pasos (`sort`) y DETECTAR señales (`spot`). Cada encuentro cierra con «Explica tu decisión» (un marco de frase, nunca escritura libre).
 * Todo texto viene en ES y EN, natural en cada idioma. Reglas comunes (docs/research/vida-8-modulos.md §7): escenarios etiquetados como ficticios, sin pedir
 * datos, contraseñas ni relatos íntimos reales, sin castigo por explorar, y nunca «incorrecto» (docs/06).
 */
export const LIFE_MODULE_IDS = ['emociones', 'comunicacion', 'digital', 'critico', 'autonomia', 'organizacion', 'emprendimiento'] as const;
export type LifeModuleId = (typeof LIFE_MODULE_IDS)[number];

export type Lang = 'es' | 'en';
export type Localized = Record<Lang, string>;

export interface Choice {
  id: string;
  text: Localized;
}

/** «Explica tu decisión»: elegir un marco de frase. Una opción no preferida da una pista, no bloquea. */
export interface Explain {
  prompt: Localized;
  choices: Choice[];
  preferredChoiceIds: string[];
}

interface StepBase {
  id: string;
  title: Localized;
  /** «Aprende»: la idea, breve. */
  learn: Localized;
  /** El caso resuelto del manual. */
  example: Localized;
  prompt: Localized;
  explain: Explain;
}

export interface ChooseOption {
  id: string;
  text: Localized;
  /** Lo que pasa si se elige esto (consecuencia, sin juicio). */
  result: Localized;
  /** Camino que cuida lo importante en esta situación (puede haber más de uno). */
  preferred: boolean;
}

/** Elegir y comparar: se pueden probar los caminos y ver qué pasa; hay que mirar al menos `minTried` antes de seguir. */
export interface ChooseStep extends StepBase {
  kind: 'choose';
  scenario: Localized;
  options: ChooseOption[];
  minTried: number;
}

/** Ordenar: la lista va en el ORDEN CORRECTO; la app la muestra revuelta. */
export interface SortStep extends StepBase {
  kind: 'sort';
  items: Choice[];
  hint: Localized;
  solvedNote: Localized;
}

export interface SpotItem {
  id: string;
  text: Localized;
  /** ¿Es una señal que conviene notar? */
  sign: boolean;
  /** Por qué es (o no) una señal: se muestra al marcarla. */
  why: Localized;
}

/** Detectar: marcar lo que merece una mirada atenta. Puede haber elementos que NO son señales. */
export interface SpotStep extends StepBase {
  kind: 'spot';
  items: SpotItem[];
  /** El texto que acompaña al contexto (un mensaje, una pantalla, una lista). */
  context: Localized;
}

export type LifeStep = ChooseStep | SortStep | SpotStep;

export interface LifeMission {
  id: string;
  module: LifeModuleId;
  /** Grado del piloto (el nivel no depende del grado: todo abre, D13/D15). */
  grade: number;
  title: Localized;
  blurb: Localized;
  /** Aviso fijo del módulo: ficticio, sin datos reales, con adulto cuando corresponde. */
  safety: Localized;
  /** Una acción opcional fuera de pantalla (vida-8-modulos §7). */
  offScreen: Localized;
  steps: LifeStep[];
}

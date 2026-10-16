/**
 * Modo Enfoque (docs/10 §1, DECISIÓN D4): apoyos de atención que el padre enciende por perfil, tras el PIN. Los
 * componentes leen APOYOS CONCRETOS (`reducedMotion`, `roundSize`…), nunca un "¿es TDAH?": así "Personalizado" sale
 * gratis y ningún diagnóstico entra en el código ni en la pantalla del niño.
 */
export type FocusMode = 'off' | 'on' | 'custom';

/** Los apoyos que hoy cambian algo de verdad. Se agregan aquí a medida que cada uno se construye (docs/10 §1). */
export interface FocusSupports {
  /** Menos dibujos de fondo, personajes y animaciones alrededor del ejercicio (el modelo y sus números no cambian). */
  reducedMotion: boolean;
  /** Ejercicios por ronda en el Taller de Matemáticas (Apagado: 6 · Encendido: 4). */
  roundSize: number;
}

/** Horario en que se enciende solo (p. ej. lunes a viernes de 15:00 a 19:00). Fuera de él, apagado. */
export interface FocusSchedule {
  /** 0 = domingo … 6 = sábado. */
  days: number[];
  /** "HH:MM", hora local del equipo. */
  from: string;
  to: string;
}

export interface FocusSettings {
  mode: FocusMode;
  /** Solo se usan en `custom`; en `on` y `off` mandan los valores de siempre. */
  custom: FocusSupports;
  schedule?: FocusSchedule;
}

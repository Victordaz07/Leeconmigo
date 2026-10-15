/**
 * Estado de la app nativa que comparten las pantallas: perfiles de los niños y su progreso.
 *
 * TEMPORAL: todo vive en memoria y se pierde al cerrar la app; guardarlo en el dispositivo es RN-08 (docs/11). Agregar o
 * editar niños se hace en Modo padres con PIN (K4); hasta entonces hay un solo perfil. Solo datos derivados, nunca audio
 * (docs/07). El nivel es de la app, NO el grado escolar (docs/01).
 */
import type { ReadingProfile } from '@lee-conmigo/contracts';
import { MemoryProgressStore, type ProgressStore } from '@lee-conmigo/session-engine';
import { DEFAULT_DAILY_GOAL_MINUTES } from '@lee-conmigo/ui-core';

export interface ChildProfile extends ReadingProfile {
  id: string;
  name: string;
  dailyGoalMinutes: number;
  /** Degradado del avatar (token de `gradients`). */
  avatar: 'sunDiag' | 'coralDiag' | 'blueDiag' | 'violetDiag' | 'greenDiag';
  /** Preguntar "¿Cómo llegas hoy?" al empezar (Ajustes de padres, P4). */
  askEnergy: boolean;
}

export const PROFILES: ChildProfile[] = [
  { id: 'noah', name: 'Noah', language: 'es', level: 3, dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES, avatar: 'sunDiag', askEnergy: true },
];

const stores = new Map<string, ProgressStore>();

/** El progreso de cada niño va aparte (racha, estrellas, dónde retomar). */
export function progressStoreFor(profileId: string): ProgressStore {
  let s = stores.get(profileId);
  if (!s) {
    s = new MemoryProgressStore();
    stores.set(profileId, s);
  }
  return s;
}

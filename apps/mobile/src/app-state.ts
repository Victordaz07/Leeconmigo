/**
 * Estado de la app nativa que comparten las pantallas: perfil del niño y progreso.
 *
 * TEMPORAL: el progreso vive en memoria (`MemoryProgressStore`) y se pierde al cerrar la app; guardarlo en el dispositivo es
 * RN-08 (docs/11). El perfil es fijo hasta que existan los perfiles de verdad (K3, pantalla B1) y Modo padres (K4). Solo se
 * guardan datos derivados, nunca audio (docs/07).
 */
import type { ReadingProfile } from '@lee-conmigo/contracts';
import { MemoryProgressStore, type ProgressStore } from '@lee-conmigo/session-engine';
import { DEFAULT_DAILY_GOAL_MINUTES } from '@lee-conmigo/ui-core';

export interface ChildProfile extends ReadingProfile {
  name: string;
  dailyGoalMinutes: number;
}

export const DEFAULT_CHILD: ChildProfile = { name: 'Noah', language: 'es', level: 3, dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES };

export const progressStore: ProgressStore = new MemoryProgressStore();

/**
 * Estado de la app nativa que comparten las pantallas: perfiles de los niños y su progreso.
 *
 * TEMPORAL: todo vive en memoria y se pierde al cerrar la app; guardarlo en el dispositivo es RN-08 (docs/11). Agregar o
 * editar niños se hace en Modo padres con PIN (K4); hasta entonces hay un solo perfil. Solo datos derivados, nunca audio
 * (docs/07). El nivel es de la app, NO el grado escolar (docs/01).
 */
import type { ReadingProfile } from '@lee-conmigo/contracts';
import { MemoryProgressStore, type ProgressStore } from '@lee-conmigo/session-engine';
import type { MathAttempt, ReviewEntry } from '@lee-conmigo/math-content';
import { DEFAULT_DAILY_GOAL_MINUTES } from '@lee-conmigo/ui-core';

export interface ChildProfile extends ReadingProfile {
  id: string;
  name: string;
  dailyGoalMinutes: number;
  /** Degradado del avatar (token de `gradients`). */
  avatar: 'sunDiag' | 'coralDiag' | 'blueDiag' | 'violetDiag' | 'greenDiag';
  /** Preguntar "¿Cómo llegas hoy?" al empezar (Ajustes de padres, P4). */
  askEnergy: boolean;
  /** Lectura libre: un adulto lee (o el niño lee sin micrófono) y la página se pasa con un botón. */
  freeReading: boolean;
}

export const PROFILES: ChildProfile[] = [
  { id: 'noah', name: 'Noah', language: 'es', level: 3, dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES, avatar: 'sunDiag', askEnergy: true, freeReading: false },
];

const AVATARS: ChildProfile['avatar'][] = ['sunDiag', 'blueDiag', 'violetDiag', 'greenDiag', 'coralDiag'];

/** Perfil nuevo ("Agregar niño", tras el PIN): valores de partida que el padre ajusta antes de guardar. */
export function newChildProfile(existing: ChildProfile[]): ChildProfile {
  const n = existing.length;
  return { id: `child-${Date.now().toString(36)}`, name: '', language: 'es', level: 1, dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES, avatar: AVATARS[n % AVATARS.length], askEnergy: true, freeReading: false };
}

const stores = new Map<string, ProgressStore>();

/** Borra el progreso guardado de un niño ("Borrar el progreso", P4; docs/12 P-03). */
export function resetProgressFor(profileId: string): void {
  stores.delete(profileId);
  mathStores.delete(profileId);
}

/**
 * Progreso de Matemáticas de un niño (K6): respuestas (solo datos derivados: habilidad, día, si acertó, ayuda usada,
 * confianza), agenda de repaso y lecciones terminadas. TEMPORAL en memoria, como el resto, hasta RN-08.
 */
export interface MathProgress {
  attempts: MathAttempt[];
  reviews: ReviewEntry[];
  lessonsDone: Set<string>;
}

const mathStores = new Map<string, MathProgress>();

export function mathProgressFor(profileId: string): MathProgress {
  let s = mathStores.get(profileId);
  if (!s) {
    s = { attempts: [], reviews: [], lessonsDone: new Set() };
    mathStores.set(profileId, s);
  }
  return s;
}

/** El progreso de cada niño va aparte (racha, estrellas, dónde retomar). */
export function progressStoreFor(profileId: string): ProgressStore {
  let s = stores.get(profileId);
  if (!s) {
    s = new MemoryProgressStore();
    stores.set(profileId, s);
  }
  return s;
}

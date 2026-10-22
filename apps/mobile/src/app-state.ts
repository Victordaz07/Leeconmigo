/**
 * Estado de la app nativa que comparten las pantallas: perfiles de los niños, PIN de padres y progreso.
 *
 * Se guarda en el equipo (RN-08, `persist/`): SQLite local, sin red. Solo datos derivados, nunca audio (docs/07). Agregar
 * o editar niños se hace en Modo padres con PIN (K4). El nivel es de la app, NO el grado escolar (docs/01).
 */
import { isLegalConsent, type LegalConsent } from './legal/consent';
import { emptyReminders, isReminderSettings, type ReminderSettings } from './reminders/model';
import type { FocusSettings, ReadingProfile } from '@lee-conmigo/contracts';
import { DEFAULT_FOCUS, normalizeFocus, type ProgressStore } from '@lee-conmigo/session-engine';
import type { MathAttempt, ReviewEntry } from '@lee-conmigo/math-content';
import { DEFAULT_DAILY_GOAL_MINUTES } from '@lee-conmigo/ui-core';
import { deviceKV } from './persist/kv';
import { applyFreeReadingDefault, eraseChild, eraseEverything, KEYS, loadMath, loadSubject, PersistentProgressStore, readJSON, saveMath, saveSubject, writeJSON, type KV, type SubjectKey } from './persist/store';

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
  /** Modo Enfoque (D4): lo pone el padre tras el PIN; las pantallas leen los apoyos con `resolveFocus`. */
  focus: FocusSettings;
}

export const PROFILES: ChildProfile[] = [
  { id: 'noah', name: 'Noah', language: 'es', level: 3, dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES, avatar: 'sunDiag', askEnergy: true, freeReading: true, focus: DEFAULT_FOCUS },
];

const AVATARS: ChildProfile['avatar'][] = ['sunDiag', 'blueDiag', 'violetDiag', 'greenDiag', 'coralDiag'];

/** Perfil nuevo ("Agregar niño", tras el PIN): valores de partida que el padre ajusta antes de guardar. */
export function newChildProfile(existing: ChildProfile[]): ChildProfile {
  const n = existing.length;
  return { id: `child-${Date.now().toString(36)}`, name: '', language: 'es', level: 1, dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES, avatar: AVATARS[n % AVATARS.length], askEnergy: true, freeReading: true, focus: DEFAULT_FOCUS };
}

/** Almacén del equipo (las pruebas usan uno en memoria). */
let kv: KV = deviceKV;
export const useKVForTests = (k: KV) => {
  kv = k;
  stores.clear();
  mathStores.clear();
};

/**
 * Perfiles guardados; la primera vez, el de partida. La lectura libre es el modo POR DEFECTO (la lectura con escucha todavía no está lista):
 * una sola vez (`migrations.freeReadingDefault`) se enciende en los perfiles que ya existían; si después el adulto la apaga, se respeta.
 */
export function loadProfiles(): ChildProfile[] {
  const saved = readJSON<ChildProfile[]>(kv, KEYS.profiles, []);
  const hadSaved = Array.isArray(saved) && saved.length > 0;
  // Perfiles guardados antes del Modo Enfoque (o a medias): se completan, sin perder lo demás.
  const list = hadSaved ? saved.map((p) => ({ ...p, focus: normalizeFocus(p.focus) })) : PROFILES;
  return applyFreeReadingDefault(kv, list, hadSaved);
}
export const saveProfiles = (list: ChildProfile[]) => writeJSON(kv, KEYS.profiles, list);

/** PIN de padres. Es un candado para que el niño no entre solo, no una contraseña: vive en el equipo. */
export const loadPin = (): string | null => kv.get(KEYS.pin);
export const savePin = (pin: string | null) => (pin ? kv.set(KEYS.pin, pin) : kv.remove(KEYS.pin));

/** Recordatorios (Modo padres → Recordatorios): ajustes del equipo; lo guardado que no tenga la forma esperada se ignora. */
export const loadReminderSettings = (): ReminderSettings => {
  const v = readJSON<unknown>(kv, KEYS.reminders, emptyReminders());
  return isReminderSettings(v) ? v : emptyReminders();
};
export const saveReminderSettings = (s: ReminderSettings) => writeJSON(kv, KEYS.reminders, s);

/** Aceptación del aviso legal (docs/12 §2). Lo guardado con otra forma se ignora (se vuelve a pedir). */
export const loadLegalConsent = (): LegalConsent | null => {
  const v = readJSON<unknown>(kv, KEYS.legal, {});
  return isLegalConsent(v) ? v : null;
};
export const saveLegalConsent = (c: LegalConsent) => writeJSON(kv, KEYS.legal, c);

/** «Borrar todos los datos» (Modo padres → Legal y privacidad): deja la app como recién instalada. */
export function eraseAllData(): void {
  const ids = [...new Set([...loadProfiles().map((p) => p.id), ...PROFILES.map((p) => p.id)])];
  stores.clear();
  mathStores.clear();
  eraseEverything(kv, ids);
}

const stores = new Map<string, ProgressStore>();

/** Borra el progreso guardado de un niño ("Borrar el progreso", P4; docs/12 P-03). */
export function resetProgressFor(profileId: string): void {
  stores.delete(profileId);
  mathStores.delete(profileId);
  eraseChild(kv, profileId);
}

/**
 * Progreso de Matemáticas de un niño (K6): respuestas (solo datos derivados: habilidad, día, si acertó, ayuda usada,
 * confianza), agenda de repaso y lecciones terminadas. Se guarda en el equipo.
 */
export interface MathProgress {
  attempts: MathAttempt[];
  reviews: ReviewEntry[];
  lessonsDone: Set<string>;
  /** Escribe en el equipo lo que cambió (las pantallas lo llaman después de cada respuesta o lección). */
  save(): void;
}

const mathStores = new Map<string, MathProgress>();

export function mathProgressFor(profileId: string): MathProgress {
  let s = mathStores.get(profileId);
  if (!s) {
    const saved = loadMath(kv, profileId);
    const progress: MathProgress = { attempts: saved.attempts, reviews: saved.reviews, lessonsDone: new Set(saved.lessonsDone), save: () => saveMath(kv, profileId, progress) };
    s = progress;
    mathStores.set(profileId, s);
  }
  return s;
}

/**
 * Guardado de una materia nueva (Ciencia, Sociedad…): una sola pieza de datos por niño y materia, con la forma que cada
 * materia decida (`valid` rechaza lo guardado que no la tenga). Va aparte de Lectura y Matemáticas y entra en "Borrar el
 * progreso". Nunca audio ni texto reconocido (docs/07).
 */
export function subjectStorageFor<T>(subject: SubjectKey, profileId: string, fallback: T, valid: (v: unknown) => v is T) {
  return {
    load: (): T => loadSubject(kv, subject, profileId, fallback, valid),
    save: (value: T) => saveSubject(kv, subject, profileId, value),
  };
}

/** El progreso de cada niño va aparte (racha, estrellas, dónde retomar). */
export function progressStoreFor(profileId: string): ProgressStore {
  let s = stores.get(profileId);
  if (!s) {
    s = new PersistentProgressStore(kv, KEYS.reading(profileId));
    stores.set(profileId, s);
  }
  return s;
}

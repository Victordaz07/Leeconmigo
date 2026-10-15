/**
 * Idioma y nivel de lectura del niño. TEMPORAL (docs/09 #3): en el producto los elegirá el padre en su panel (con PIN,
 * docs/09 #1); ese panel aún no existe. Mientras tanto se fijan con la URL —`?lang=en&level=2`— y la elección se
 * recuerda en el dispositivo; en desarrollo también se cambian desde el panel `DEV`.
 *
 * El nivel es de la app, NO el grado escolar (docs/01).
 */
import type { LanguageCode, ReadingProfile } from '@lee-conmigo/contracts';

export const PROFILE_STORAGE_KEY = 'lee-conmigo:profile:v1';
export const DEFAULT_PROFILE: ReadingProfile = { language: 'es', level: 1 };
export const MAX_LEVEL = 6;

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

const asLanguage = (x: unknown): LanguageCode | null => (x === 'es' || x === 'en' ? x : null);
const asLevel = (x: unknown): number | null => {
  const n = typeof x === 'string' && x.trim() !== '' ? Number(x) : x;
  return typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= MAX_LEVEL ? n : null;
};

function defaultStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/** Perfil guardado (o el de por defecto si no hay o está corrupto). Acepta datos parciales. */
export function readStoredProfile(storage: StorageLike | null = defaultStorage()): ReadingProfile {
  try {
    const o = JSON.parse(storage?.getItem(PROFILE_STORAGE_KEY) ?? 'null') as Partial<ReadingProfile> | null;
    return { language: asLanguage(o?.language) ?? DEFAULT_PROFILE.language, level: asLevel(o?.level) ?? DEFAULT_PROFILE.level };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: ReadingProfile, storage: StorageLike | null = defaultStorage()): void {
  try {
    storage?.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ language: profile.language, level: profile.level }));
  } catch {
    // sin almacenamiento: el ajuste dura hasta cerrar la app
  }
}

/**
 * Perfil con el que arranca la app: lo que diga la URL (`?lang=` y `?level=`, valores inválidos se ignoran) manda sobre
 * lo guardado, y si la URL cambió algo se recuerda para la próxima vez.
 */
export function loadProfile(search: string = typeof location === 'undefined' ? '' : location.search, storage: StorageLike | null = defaultStorage()): ReadingProfile {
  const stored = readStoredProfile(storage);
  const q = new URLSearchParams(search);
  const language = asLanguage(q.get('lang')) ?? stored.language;
  const level = asLevel(q.get('level')) ?? stored.level;
  const profile = { language, level };
  if (language !== stored.language || level !== stored.level) saveProfile(profile, storage);
  return profile;
}

/**
 * PIN de padres y meta diaria de lectura (docs/01, docs/09 #1). El PIN es un candado SENCILLO para que el nivel y el
 * idioma no cambien sin querer al tocar la pantalla: este es un proyecto familiar sin cuentas, no hace falta más.
 * Lo crea el propio padre la primera vez que abre "Modo padres" (sin PIN por defecto, sin recuperación por correo:
 * si se olvida, se borra desde el propio Modo padres una vez dentro, o borrando los datos del sitio).
 */
import { DEFAULT_DAILY_GOAL_MINUTES } from '@lee-conmigo/ui';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const PIN_KEY = 'lee-conmigo:parent-pin:v1';
const GOAL_KEY = 'lee-conmigo:daily-goal:v1';
const FREE_READING_KEY = 'lee-conmigo:free-reading:v1';
const CHILD_NAME_KEY = 'lee-conmigo:child-name:v1';

/** Antes "Alex" (marcador de relleno del prototipo); Noah es el niño real para el que se construyó la app. */
export const DEFAULT_CHILD_NAME = 'Noah';

function defaultStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/** PIN guardado (4 dígitos), o `null` si el padre todavía no ha creado uno. */
export function readParentPin(storage: StorageLike | null = defaultStorage()): string | null {
  try {
    const v = storage?.getItem(PIN_KEY) ?? null;
    return v && /^[0-9]{4}$/.test(v) ? v : null;
  } catch {
    return null;
  }
}

export function saveParentPin(pin: string, storage: StorageLike | null = defaultStorage()): void {
  try {
    storage?.setItem(PIN_KEY, pin);
  } catch {
    // sin almacenamiento: el PIN dura hasta cerrar la app (mejor que bloquear el modo padres)
  }
}

/** Borra el PIN guardado: la próxima vez que se abra "Modo padres" se pide crear uno nuevo. */
export function clearParentPin(storage: StorageLike | null = defaultStorage()): void {
  try {
    storage?.removeItem(PIN_KEY);
  } catch {
    // ídem
  }
}

export function readDailyGoalMinutes(storage: StorageLike | null = defaultStorage()): number {
  try {
    const n = Number(storage?.getItem(GOAL_KEY));
    return Number.isInteger(n) && n > 0 ? n : DEFAULT_DAILY_GOAL_MINUTES;
  } catch {
    return DEFAULT_DAILY_GOAL_MINUTES;
  }
}

export function saveDailyGoalMinutes(minutes: number, storage: StorageLike | null = defaultStorage()): void {
  try {
    storage?.setItem(GOAL_KEY, String(minutes));
  } catch {
    // ídem
  }
}

/**
 * "Modo lectura libre" (pedido por Victor probando con Noah, 2026-09-29): el padre lee en voz alta (o el niño
 * lee sin que la app siga su voz) y avanza de página con un botón, en vez de que la app espere reconocer la
 * lectura por el micrófono. Se sigue guardando tiempo de lectura (se acredita el tiempo real entre páginas) y
 * las preguntas de comprensión de cada página se mantienen: solo cambia cómo se avanza de página.
 */
export function readFreeReadingMode(storage: StorageLike | null = defaultStorage()): boolean {
  try {
    return storage?.getItem(FREE_READING_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveFreeReadingMode(enabled: boolean, storage: StorageLike | null = defaultStorage()): void {
  try {
    storage?.setItem(FREE_READING_KEY, enabled ? '1' : '0');
  } catch {
    // ídem
  }
}

/** Nombre del niño que lee (Inicio/Progreso: "¡Hola, {nombre}!"). Editable en Modo padres. */
export function readChildName(storage: StorageLike | null = defaultStorage()): string {
  try {
    const v = storage?.getItem(CHILD_NAME_KEY)?.trim();
    return v ? v : DEFAULT_CHILD_NAME;
  } catch {
    return DEFAULT_CHILD_NAME;
  }
}

export function saveChildName(name: string, storage: StorageLike | null = defaultStorage()): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  try {
    storage?.setItem(CHILD_NAME_KEY, trimmed);
  } catch {
    // ídem
  }
}

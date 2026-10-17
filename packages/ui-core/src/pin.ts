/**
 * Candado de padres (Kitewise P1; docs/01 "PIN de padres obligatorio", D4). Lógica pura del teclado y del flujo:
 * crear el PIN (escribirlo y confirmarlo) o entrar con él. Es un candado SENCILLO para que el niño no cambie ajustes sin
 * querer — sin cuentas ni correo (no hay nube en v1). Tras varios intentos fallidos espera un poco, para que adivinar a
 * toques no sea un juego. Sin rojo ni "incorrecto" (docs/06): los mensajes son neutros.
 */
import type { MathLang as GateLang } from './math-copy.ts';

export type { GateLang };

export const PIN_LENGTH = 4;
export const MAX_PIN_ATTEMPTS = 5;
export const PIN_LOCK_SECONDS = 30;

export type PinKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'back';

export const isCompletePin = (digits: string): boolean => new RegExp(`^[0-9]{${PIN_LENGTH}}$`).test(digits);

export type GatePhase = 'create' | 'confirm' | 'enter' | 'open';
export type GateMessage = 'none' | 'mismatch' | 'wrong' | 'locked';

export interface GateState {
  phase: GatePhase;
  digits: string;
  /** Al crear: el primer PIN escrito, esperando confirmación. */
  first: string | null;
  attempts: number;
  /** Hasta cuándo (ms) el teclado espera tras demasiados intentos. */
  lockedUntil: number | null;
  message: GateMessage;
  /** El PIN recién creado (solo en la fase `open` tras crearlo), para que la app lo guarde. */
  created: string | null;
}

/** Sin PIN guardado se crea uno; con PIN se pide. */
export function startGate(savedPin: string | null): GateState {
  return { phase: savedPin ? 'enter' : 'create', digits: '', first: null, attempts: 0, lockedUntil: null, message: 'none', created: null };
}

export const isLocked = (s: GateState, nowMs: number): boolean => s.lockedUntil !== null && nowMs < s.lockedUntil;

/** Un toque en el teclado. Al escribir de nuevo se borra el mensaje anterior. */
export function gateKey(s: GateState, key: PinKey, nowMs: number): GateState {
  if (s.phase === 'open' || isLocked(s, nowMs)) return s;
  const unlocked = s.lockedUntil !== null ? { attempts: 0, lockedUntil: null } : {};
  if (key === 'back') return { ...s, ...unlocked, digits: s.digits.slice(0, -1), message: 'none' };
  if (s.digits.length >= PIN_LENGTH) return s;
  return { ...s, ...unlocked, digits: s.digits + key, message: 'none' };
}

/** El botón ✓. Solo hace algo con el PIN completo. */
export function gateSubmit(s: GateState, savedPin: string | null, nowMs: number): GateState {
  if (s.phase === 'open' || isLocked(s, nowMs) || !isCompletePin(s.digits)) return s;
  switch (s.phase) {
    case 'create':
      return { ...s, phase: 'confirm', first: s.digits, digits: '', message: 'none' };
    case 'confirm':
      return s.digits === s.first
        ? { ...s, phase: 'open', digits: '', created: s.digits, message: 'none' }
        : { ...s, phase: 'create', first: null, digits: '', message: 'mismatch' };
    case 'enter': {
      if (s.digits === savedPin) return { ...s, phase: 'open', digits: '', attempts: 0, message: 'none' };
      const attempts = s.attempts + 1;
      if (attempts >= MAX_PIN_ATTEMPTS) return { ...s, digits: '', attempts, lockedUntil: nowMs + PIN_LOCK_SECONDS * 1000, message: 'locked' };
      return { ...s, digits: '', attempts, message: 'wrong' };
    }
  }
}

const L = <T>(es: T, en: T) => ({ es, en });

/** Textos ES/EN del candado de padres. El dominio de arriba solo devuelve claves (`GatePhase`/`GateMessage`); este
 * objeto es la única parte con texto, para que `parent-gate-screen.tsx` nunca tenga que traducir a mano. */
export const GATE_COPY = {
  createTitle: L('Crea tu PIN', 'Create your PIN'),
  createHint: L('Con él entras a los reportes y ajustes. Tu hijo no lo verá.', "You'll use it to open reports and settings. Your child won't see it."),
  confirmTitle: L('Escríbelo otra vez', 'Enter it again'),
  confirmHint: L('Para asegurarnos de que lo recuerdas.', 'Just to make sure you remember it.'),
  enterTitle: L('Solo para padres', 'Parents only'),
  enterHint: L('Escribe tu PIN.', 'Enter your PIN.'),
  mismatch: L('No coincidieron. Empecemos de nuevo.', "Those didn't match. Let's start again."),
  wrong: L('Ese no es el PIN. Prueba otra vez.', "That's not the PIN. Try again."),
  locked: L(`Espera ${PIN_LOCK_SECONDS} segundos y vuelve a intentarlo.`, `Wait ${PIN_LOCK_SECONDS} seconds and try again.`),
  kickerCreating: L((step: 1 | 2) => `PASO ${step} DE 2 · SOLO PARA PADRES`, (step: 1 | 2) => `STEP ${step} OF 2 · PARENTS ONLY`),
  kickerEnter: L('MODO PADRES', 'PARENTS MODE'),
  back: L('Volver', 'Back'),
  tagline: L('Aprender en casa, a su ritmo.', 'Learning at home, at their pace.'),
  privacy: L('La voz de tu hijo nunca se graba ni se almacena.', "Your child's voice is never recorded or stored."),
} as const;

export function gateMessage(m: GateMessage, lang: GateLang = 'es'): string | null {
  return m === 'none' ? null : GATE_COPY[m][lang];
}

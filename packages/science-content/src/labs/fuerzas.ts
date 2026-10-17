/**
 * Laboratorio «Fuerzas y movimiento» (C3-U05, 3-PS2-1 y 3-PS2-2). Dos partes, deterministas y DIDÁCTICAS (inventadas para aprender):
 *
 * 1) El carrito en una mesa lisa recibe empujones desde la izquierda (0–3) y desde la derecha (0–3):
 *      iguales (equilibrados)  → su movimiento no cambia: se queda quieto;
 *      desiguales              → se mueve hacia el lado del empujón más fuerte, y más rápido cuanto mayor es la diferencia.
 * 2) El péndulo (una bola colgada de un hilo) oscila con un patrón que se repite: izquierda, derecha, izquierda, derecha…
 *    Con el patrón se predice dónde estará en el latido siguiente.
 *
 * Nunca se miden fuerzas en números de newtons: se cuentan «empujones» y se razona con «más» y «menos».
 */
import type { Localized } from '@lee-conmigo/contracts';

export const MAX_PUSHES = 3;
export type Pushes = 0 | 1 | 2 | 3;
export type CartMove = 'quieto' | 'derecha' | 'izquierda';

/** La diferencia entre los empujones (derecha − izquierda): positiva empuja hacia la derecha. */
export const netPush = (left: number, right: number): number => right - left;

/** ¿Los empujones están equilibrados (iguales)? */
export const balanced = (left: number, right: number): boolean => left === right;

/** Hacia dónde se mueve el carrito. */
export const cartMove = (left: number, right: number): CartMove => (left === right ? 'quieto' : right > left ? 'derecha' : 'izquierda');

/** Cuánto se mueve el carrito en 3 segundos (cm) según la diferencia de empujones. Valores didácticos. */
const TRAVEL_CM = [0, 10, 24, 42] as const;
export const travelCm = (left: number, right: number): number => TRAVEL_CM[Math.abs(right - left)] ?? 0;

export const CART_MOVE_TEXT: Record<CartMove, Localized> = {
  quieto: { es: 'Se quedó quieto', en: 'It stayed still' },
  derecha: { es: 'Se movió a la derecha', en: 'It moved to the right' },
  izquierda: { es: 'Se movió a la izquierda', en: 'It moved to the left' },
};

/** Las combinaciones de la tabla del niño (izquierda, derecha). */
export const TABLE_PAIRS: readonly [number, number][] = [[0, 2], [2, 2], [3, 1], [1, 3], [0, 0]];

// ------------------------------------------------------------------ péndulo

export type SwingSide = 'izquierda' | 'derecha';
/** En el latido 0 la bola está a la izquierda; después se alterna. */
export const swingSide = (tick: number): SwingSide => (tick % 2 === 0 ? 'izquierda' : 'derecha');
export const SWING_TEXT: Record<SwingSide, Localized> = {
  izquierda: { es: 'A la izquierda', en: 'On the left' },
  derecha: { es: 'A la derecha', en: 'On the right' },
};

/** Lo que el modelo declara de sí mismo (toda simulación dice qué representa y qué NO). */
export const FORCE_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que si los empujones sobre un objeto son iguales y opuestos su movimiento no cambia, y si no lo son, se mueve hacia el lado del más fuerte; y que un movimiento que se repite en un patrón permite predecir el siguiente.',
    en: 'That if the pushes on an object are equal and opposite its motion doesn’t change, and if not, it moves toward the stronger side; and that a motion that repeats in a pattern lets you predict the next one.',
  },
  assumptions: [
    { es: 'Siempre el mismo carrito en la misma mesa lisa; solo cambian los empujones de cada lado (0 a 3).', en: 'Always the same cart on the same smooth table; only the pushes from each side change (0 to 3).' },
    { es: 'Cada empujón es igual de fuerte; se cuentan, no se miden.', en: 'Every push is equally strong; they are counted, not measured.' },
    { es: 'El péndulo es siempre el mismo y oscila a un ritmo constante, sin que nadie lo empuje de nuevo.', en: 'The pendulum is always the same one and swings at a steady rhythm, with nobody pushing it again.' },
    { es: 'Las distancias son de práctica (inventadas para aprender).', en: 'The distances are practice values (made up for learning).' },
  ],
  doesNotRepresent: [
    { es: 'Cuánta fuerza hay en números ni sus unidades: aquí se cuentan empujones y se razona con «más» y «menos».', en: 'How much force there is in numbers or units: here pushes are counted and you reason with “more” and “less”.' },
    { es: 'La fricción ni el aire: el carrito se mueve en una mesa muy lisa y el péndulo no se frena.', en: 'Friction or air: the cart moves on a very smooth table and the pendulum doesn’t slow down.' },
    { es: 'Todos los movimientos: no todos siguen un patrón (una pelota que rebota en el pasto, por ejemplo).', en: 'All motions: not all follow a pattern (a ball bouncing on grass, for example).' },
  ],
  controls: [
    { es: 'Lo que se cambia: cuántos empujones vienen de cada lado.', en: 'What changes: how many pushes come from each side.' },
    { es: 'Lo que se observa: hacia dónde se mueve el carrito y dónde está la bola del péndulo en cada latido.', en: 'What is observed: which way the cart moves and where the pendulum ball is at each beat.' },
  ],
};

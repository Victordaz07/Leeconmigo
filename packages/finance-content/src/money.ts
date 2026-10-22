/**
 * Dinero de los ejercicios: UNIDADES MONETARIAS ficticias (UM). No son dinero real ni una moneda de ningún país, y NUNCA se mezclan con las
 * estrellas o recompensas de Kitewise (docs/research/vida-01-economia-finanzas.md §1). Siempre enteros: los decimales llegan en 5.º (`cents`).
 */
export type Lang = 'es' | 'en';

/** Una cantidad de UM, entera (en 1.º–4.º) y nunca negativa en un saldo; las cuentas que quedan «en contra» se muestran con una pista, no como un error. */
export type UM = number;

export const isUM = (n: unknown): n is UM => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 1_000_000;

/** «12 UM» (en los dos idiomas la unidad es la misma, es ficticia). */
export const formatUM = (n: UM): string => `${n} UM`;

/** Suma segura de cantidades (para que un total nunca sea NaN si falta un dato). */
export const sum = (values: readonly number[]): number => values.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

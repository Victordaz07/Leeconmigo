/**
 * Libro de movimientos (F4.3 «Un registro en orden»): fecha/orden, concepto, entrada o salida y saldo. El orden importa: permite saber si había dinero
 * en el momento de pagar. Una misma compra no se registra dos veces. Un registro con un error se puede corregir; aquí solo se calcula y se comprueba.
 */
import { isUM, sum, type UM } from './money.ts';

export interface Movement {
  id: string;
  /** Clave del concepto (el texto lo pone la interfaz en ES/EN). */
  concept: string;
  kind: 'in' | 'out';
  amount: UM;
}

export interface LedgerRow extends Movement {
  /** Saldo DESPUÉS de este movimiento. */
  balance: number;
  /** `true` si al pagar no alcanzaba el dinero (saldo negativo): la pista es «¿había dinero en ese momento?», nunca un reproche. */
  short: boolean;
}

/** Recorre los movimientos en orden y devuelve cada fila con su saldo. */
export function runLedger(start: UM, movements: readonly Movement[]): LedgerRow[] {
  let balance = start;
  return movements.map((m) => {
    balance += m.kind === 'in' ? m.amount : -m.amount;
    return { ...m, balance, short: balance < 0 };
  });
}

/** Saldo final del registro. */
export const finalBalance = (start: UM, movements: readonly Movement[]): number => start + sum(movements.filter((m) => m.kind === 'in').map((m) => m.amount)) - sum(movements.filter((m) => m.kind === 'out').map((m) => m.amount));

/** Comprobación global (la del ejemplo: 50 + 12 − 18 − 9 = 35). Debe coincidir con el recorrido fila por fila. */
export function ledgerChecks(start: UM, movements: readonly Movement[]): boolean {
  const rows = runLedger(start, movements);
  return (rows.at(-1)?.balance ?? start) === finalBalance(start, movements);
}

/**
 * Si falta un movimiento en el registro, ¿el saldo anotado queda por encima o por debajo del correcto? (F4.3 b: si falta una compra, el saldo anotado queda
 * por encima.) `missing` es el movimiento que no se anotó.
 */
export function notedVsReal(start: UM, noted: readonly Movement[], missing: Movement): { noted: number; real: number; diff: number; direction: 'above' | 'below' | 'equal' } {
  const n = finalBalance(start, noted);
  const real = finalBalance(start, [...noted, missing]);
  const diff = n - real;
  return { noted: n, real, diff: Math.abs(diff), direction: diff > 0 ? 'above' : diff < 0 ? 'below' : 'equal' };
}

/** Un movimiento bien formado: monto entero válido y mayor que cero. */
export const isMovement = (v: unknown): v is Movement => {
  if (typeof v !== 'object' || v === null) return false;
  const m = v as Record<string, unknown>;
  return typeof m.id === 'string' && typeof m.concept === 'string' && (m.kind === 'in' || m.kind === 'out') && isUM(m.amount) && (m.amount as number) > 0;
};

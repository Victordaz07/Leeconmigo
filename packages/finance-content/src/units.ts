/** Unidades de Finanzas incluidas en la app (todo dentro del paquete, sin red). */
import f4u01 from '../content/f4u01.json';
import type { FinanceUnit } from './unit.ts';

/** Una unidad piloto por grado, en orden. Hoy solo 4.º (DF-2); las demás llegan después del piloto. */
export const FINANCE_UNITS: readonly FinanceUnit[] = [f4u01] as unknown as FinanceUnit[];

export const financeUnitById = (id: string): FinanceUnit | undefined => FINANCE_UNITS.find((u) => u.id === id);

/** Unidades de Matemáticas incluidas en la app (todo dentro del paquete, sin red). */
import type { MathUnit } from '@lee-conmigo/contracts';
import g3u1 from '../content/g3u1.json';

export const MATH_UNITS: readonly MathUnit[] = [g3u1 as MathUnit];

export function mathUnitById(id: string): MathUnit | undefined {
  return MATH_UNITS.find((u) => u.id === id);
}

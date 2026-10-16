import { rng } from '../generate.ts';

export interface IntRng {
  /** Entero en [min, max], ambos incluidos. */
  int(min: number, max: number): number;
}

export function intRng(seed: number): IntRng {
  const next = rng(seed);
  return { int: (min, max) => min + Math.floor(next() * (max - min + 1)) };
}

/**
 * Costo de oportunidad (F4.2 «Comparar alternativas de verdad»): antes de elegir se separan las opciones que CABEN en el presupuesto de las que no. La
 * mejor alternativa descartada tiene que ser una posibilidad REAL: una opción imposible no es lo que sacrificaste. Y las UM que sobran no desaparecen.
 */
import type { UM } from './money.ts';

export interface Option {
  id: string;
  label: string;
  cost: UM;
}

/** Las que caben en el presupuesto (costo ≤ presupuesto), en el orden recibido. */
export const viableOptions = (budget: UM, options: readonly Option[]): Option[] => options.filter((o) => o.cost <= budget);

export interface OpportunityResult {
  viable: Option[];
  notViable: Option[];
  chosen: Option | undefined;
  /** La mejor alternativa VIABLE que se dejó: la siguiente de tus preferencias entre las viables. `undefined` si no había otra. */
  bestDiscarded: Option | undefined;
  /** Lo que sobra después de la elección: no desaparece, queda disponible o se asigna a otra cosa. */
  leftover: UM;
}

/**
 * `preference`: los ids en orden de preferencia (la primera es la que más quieres). Si eliges una que no cabe, `chosen` es `undefined` (no era posible).
 */
export function opportunityCost(budget: UM, options: readonly Option[], preference: readonly string[], chosenId: string): OpportunityResult {
  const viable = viableOptions(budget, options);
  const notViable = options.filter((o) => o.cost > budget);
  const chosen = viable.find((o) => o.id === chosenId);
  const order = preference.filter((id) => viable.some((o) => o.id === id));
  const bestDiscarded = chosen ? viable.find((o) => o.id === order.find((id) => id !== chosen.id)) : undefined;
  return { viable, notViable, chosen, bestDiscarded, leftover: chosen ? budget - chosen.cost : budget };
}

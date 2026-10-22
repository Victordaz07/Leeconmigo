/**
 * Costo de oportunidad (F4.2 «Comparar alternativas de verdad»): antes de elegir se separan las opciones que CABEN en el presupuesto de las que no. La
 * mejor alternativa descartada tiene que ser una posibilidad REAL: una opción imposible no es lo que sacrificaste. Y las UM que sobran no desaparecen.
 */
import type { UM } from './money.ts';

export interface Option<L = string> {
  id: string;
  label: L;
  cost: UM;
}

/** Las que caben en el presupuesto (costo ≤ presupuesto), en el orden recibido. */
export const viableOptions = <L>(budget: UM, options: readonly Option<L>[]): Option<L>[] => options.filter((o) => o.cost <= budget);

export interface OpportunityResult<L = string> {
  viable: Option<L>[];
  notViable: Option<L>[];
  chosen: Option<L> | undefined;
  /** La mejor alternativa VIABLE que se dejó: la siguiente de tus preferencias entre las viables. `undefined` si no había otra. */
  bestDiscarded: Option<L> | undefined;
  /** Lo que sobra después de la elección: no desaparece, queda disponible o se asigna a otra cosa. */
  leftover: UM;
}

/**
 * `preference`: los ids en orden de preferencia (la primera es la que más quieres). Si eliges una que no cabe, `chosen` es `undefined` (no era posible).
 */
export function opportunityCost<L>(budget: UM, options: readonly Option<L>[], preference: readonly string[], chosenId: string): OpportunityResult<L> {
  const viable = viableOptions(budget, options);
  const notViable = options.filter((o) => o.cost > budget);
  const chosen = viable.find((o) => o.id === chosenId);
  const order = preference.filter((id) => viable.some((o) => o.id === id));
  const bestDiscarded = chosen ? viable.find((o) => o.id === order.find((id) => id !== chosen.id)) : undefined;
  return { viable, notViable, chosen, bestDiscarded, leftover: chosen ? budget - chosen.cost : budget };
}

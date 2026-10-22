/**
 * Plan con sobres (F4.1, F4.4, F4.8; sandbox «Sobres vivos»): el dinero disponible se reparte en sobres. Hay esenciales, opcionales, reserva y libres.
 * Un plan es VÁLIDO si no reparte más de lo que hay y si cubre lo esencial; no hay «el mejor plan»: dos planes válidos se comparan por lo que protegen
 * y lo que cambian, sin declarar automáticamente superior al que conserva más dinero (docs/research/vida-01 F4.8).
 */
import { sum, type UM } from './money.ts';

export type EnvelopeKind = 'essential' | 'optional' | 'reserve' | 'free';

export interface Envelope<L = string> {
  id: string;
  /** Etiqueta del sobre: una clave (la interfaz pone el texto) o un texto en los dos idiomas. */
  label: L;
  kind: EnvelopeKind;
  /** Lo que tiene asignado ahora. */
  amount: UM;
  /** Lo que cuesta cubrirlo del todo (esenciales y opcionales). La reserva y lo libre no tienen costo fijo. */
  cost?: UM;
}

export interface Plan<L = string> {
  budget: UM;
  envelopes: Envelope<L>[];
}

export const assigned = <L>(p: Plan<L>): number => sum(p.envelopes.map((e) => e.amount));
export const unassigned = <L>(p: Plan<L>): number => p.budget - assigned(p);

/** Un sobre esencial queda cubierto si tiene todo su costo. */
export const isCovered = <L>(e: Envelope<L>): boolean => e.cost === undefined || e.amount >= e.cost;

export type PlanIssue = 'over-budget' | 'essential-uncovered' | 'negative';

/** Lo que impide que un plan sea válido (vacío = válido). Son claves para textos amables, nunca «incorrecto». */
export function planIssues<L>(p: Plan<L>): PlanIssue[] {
  const out: PlanIssue[] = [];
  if (p.envelopes.some((e) => e.amount < 0)) out.push('negative');
  if (assigned(p) > p.budget) out.push('over-budget');
  if (p.envelopes.some((e) => e.kind === 'essential' && !isCovered(e))) out.push('essential-uncovered');
  return out;
}
export const isValidPlan = <L>(p: Plan<L>): boolean => planIssues(p).length === 0;

/** Mueve `amount` de un sobre a otro (reasignar). Devuelve otro plan; si no se puede (no alcanza), el mismo. */
export function moveBetween<L>(p: Plan<L>, fromId: string, toId: string, amount: UM): Plan<L> {
  const from = p.envelopes.find((e) => e.id === fromId);
  const to = p.envelopes.find((e) => e.id === toId);
  if (!from || !to || from === to || amount <= 0 || amount > from.amount) return p;
  return { ...p, envelopes: p.envelopes.map((e) => (e.id === fromId ? { ...e, amount: e.amount - amount } : e.id === toId ? { ...e, amount: e.amount + amount } : e)) };
}

/**
 * Un imprevisto de `cost` UM se paga primero con la reserva y, si no alcanza, queda un FALTANTE. Después de usar la reserva el plan se actualiza (F4.4: «cuando
 * se usa, hay que actualizar el saldo y decidir si es posible reconstruirla»). `shortfall` > 0 significa que hay que ajustar: revisar dinero libre, bajar
 * gastos opcionales, cambiar el plan o pedir apoyo (nunca se culpa al niño por no tener disciplina).
 */
export function payUnexpected<L>(p: Plan<L>, cost: UM): { plan: Plan<L>; paidFromReserve: UM; shortfall: UM } {
  const reserve = p.envelopes.find((e) => e.kind === 'reserve');
  const fromReserve = Math.min(reserve?.amount ?? 0, cost);
  const plan = reserve ? { ...p, envelopes: p.envelopes.map((e) => (e === reserve ? { ...e, amount: e.amount - fromReserve } : e)) } : p;
  return { plan, paidFromReserve: fromReserve, shortfall: cost - fromReserve };
}

/**
 * Qué se hace con el faltante: ¿alcanza lo que hay en los sobres LIBRES y OPCIONALES para cubrirlo sin tocar lo esencial? Devuelve cuánto se podría liberar
 * (no decide por el niño qué sobre achicar: eso es su decisión y su explicación).
 */
export function freeable<L>(p: Plan<L>): UM {
  return sum(p.envelopes.filter((e) => e.kind === 'free' || e.kind === 'optional').map((e) => e.amount));
}

/** Cuánto «protege» un plan: lo esencial cubierto y la reserva que queda (para comparar dos planes válidos sin decir cuál es «mejor»). */
export function protects<L>(p: Plan<L>): { essentialsCovered: boolean; reserve: UM; optionalKept: UM } {
  return {
    essentialsCovered: p.envelopes.filter((e) => e.kind === 'essential').every(isCovered),
    reserve: sum(p.envelopes.filter((e) => e.kind === 'reserve').map((e) => e.amount)),
    optionalKept: sum(p.envelopes.filter((e) => e.kind === 'optional').map((e) => e.amount)),
  };
}

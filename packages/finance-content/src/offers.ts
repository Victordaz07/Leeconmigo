/**
 * Oferta sospechosa (F4.7): urgencia, secreto, pago por adelantado y pedido de datos o códigos son señales para PARAR y pedir ayuda. Un logo o una foto
 * no prueban que el mensaje sea auténtico. Todo es un buzón FICTICIO: nunca se piden contraseñas reales. Se evalúa que reconozca señales y sepa qué
 * hacer (pedir ayuda a un adulto de confianza, verificar por un canal oficial conocido), sin vergüenza si ya compartió algo.
 */
export const SIGNALS = ['urgency', 'secrecy', 'prepay', 'personalData', 'tooGood'] as const;
export type Signal = (typeof SIGNALS)[number];

export interface Offer {
  id: string;
  /** Señales que de verdad tiene esta oferta (puede no tener ninguna: no todo mensaje es una estafa). */
  signals: Signal[];
}

/** Acciones posibles ante una oferta: las seguras. */
export const SAFE_ACTIONS = ['stop-and-ask', 'verify-official', 'do-not-share-code', 'do-not-open-link'] as const;
export type SafeAction = (typeof SAFE_ACTIONS)[number];

export interface OfferCheck {
  /** Señales que el niño marcó y SÍ están. */
  found: Signal[];
  /** Señales que marcó y NO están (se le invita a mirar otra vez, sin «incorrecto»). */
  extra: Signal[];
  /** Señales que están y no marcó. */
  missed: Signal[];
  /** ¿Marcó todas y solo las que están? */
  exact: boolean;
  /** ¿Una oferta con alguna señal pide parar? (siempre que haya al menos una). */
  shouldStop: boolean;
}

export function checkOffer(offer: Offer, marked: readonly Signal[]): OfferCheck {
  const marks = new Set(marked);
  const found = offer.signals.filter((s) => marks.has(s));
  const extra = [...marks].filter((s) => !offer.signals.includes(s));
  const missed = offer.signals.filter((s) => !marks.has(s));
  return { found, extra, missed, exact: extra.length === 0 && missed.length === 0, shouldStop: offer.signals.length > 0 };
}

/** Ante cualquier oferta con señales, la acción segura SIEMPRE incluye parar y pedir ayuda; compartir un código o abrir un enlace inesperado nunca es seguro. */
export const isSafeAction = (a: string): a is SafeAction => (SAFE_ACTIONS as readonly string[]).includes(a);

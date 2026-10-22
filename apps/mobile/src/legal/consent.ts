/** Aceptación del aviso legal por el adulto. Se guarda en el equipo con la versión de los textos: si los textos cambian, se vuelve a pedir. */
export interface LegalConsent {
  version: string;
  /** ISO 8601. */
  acceptedAt: string;
  lang: 'es' | 'en';
}

export function isLegalConsent(v: unknown): v is LegalConsent {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Record<string, unknown>;
  return typeof c.version === 'string' && c.version !== '' && typeof c.acceptedAt === 'string' && !Number.isNaN(Date.parse(c.acceptedAt)) && (c.lang === 'es' || c.lang === 'en');
}

/** ¿Hay que mostrar el aviso? Sí si nunca se aceptó o si se aceptó otra versión de los textos. */
export const needsConsent = (saved: LegalConsent | null, version: string): boolean => !saved || saved.version !== version;

export const newConsent = (version: string, lang: 'es' | 'en', now: Date = new Date()): LegalConsent => ({ version, acceptedAt: now.toISOString(), lang });

/** Candado de adultos de la pantalla de aceptación: una multiplicación que un niño de primaria no resuelve de memoria. Determinista con `seed` (pruebas). */
export function adultQuestion(seed: number = Math.random()): { a: number; b: number; answer: number } {
  const a = 12 + Math.floor(seed * 7); // 12–18
  const b = 6 + Math.floor((seed * 7919) % 4); // 6–9
  return { a, b, answer: a * b };
}

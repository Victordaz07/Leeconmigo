/**
 * Datos legales que SOLO Victor puede dar (no se inventan). Mientras sean `null`, los textos muestran un marcador visible y `legalReady()` es falso
 * (docs/DECISIONS.md C11: persona o LLC; docs/12 §2: correo de soporte). Antes de publicar: completar, regenerar `docs/legal/` (`node scripts/legal-docs.mjs`)
 * y que un abogado revise todo.
 */
export interface LegalConfig {
  /** Quién publica la app: nombre de la persona o de la LLC (C11). */
  publisherName: string | null;
  /** Correo de soporte y de privacidad, visible en la app. */
  contactEmail: string | null;
  /** Dirección pública de la política de privacidad (las tiendas la exigen). */
  privacyUrl: string | null;
  /** Estado/país cuyas leyes rigen los Términos (lo define el abogado). */
  governingLaw: string | null;
}

export const LEGAL_CONFIG: LegalConfig = { publisherName: null, contactEmail: null, privacyUrl: null, governingLaw: null };

/** Versión de los textos. Si cambia, el adulto tiene que volver a aceptar (formato AAAA-MM-DD + borrador/final). */
export const LEGAL_VERSION = '2026-10-22-borrador';

export const legalReady = (c: LegalConfig = LEGAL_CONFIG): boolean => Object.values(c).every((v) => typeof v === 'string' && v.trim() !== '');

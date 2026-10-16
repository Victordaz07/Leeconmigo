/** Unidades de Sociedad incluidas en la app (todo dentro del paquete, sin red). */
import type { SocialUnit } from '@lee-conmigo/contracts';
import s1u01 from '../content/s1u01.json';
import s2u01 from '../content/s2u01.json';
import s3u03 from '../content/s3u03.json';
import s4u03 from '../content/s4u03.json';
import s5u04 from '../content/s5u04.json';
import s6u02 from '../content/s6u02.json';

/** Una unidad piloto por grado, en orden (1.º–6.º). Todas siguen el mismo patrón de 6 pasos como mucho (algunas
 * sin fuentes, como s1u01 y s6u02, son puro razonamiento/deliberación en vez de investigación con evidencia —
 * ver `validateSocialUnit`). */
export const SOCIAL_UNITS: readonly SocialUnit[] = [s1u01, s2u01, s3u03, s4u03, s5u04, s6u02] as SocialUnit[];

export function socialUnitById(id: string): SocialUnit | undefined {
  return SOCIAL_UNITS.find((u) => u.id === id);
}

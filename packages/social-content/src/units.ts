/** Unidades de Sociedad incluidas en la app (todo dentro del paquete, sin red). */
import type { SocialUnit } from '@lee-conmigo/contracts';
import s3u03 from '../content/s3u03.json';

export const SOCIAL_UNITS: readonly SocialUnit[] = [s3u03 as SocialUnit];

export function socialUnitById(id: string): SocialUnit | undefined {
  return SOCIAL_UNITS.find((u) => u.id === id);
}

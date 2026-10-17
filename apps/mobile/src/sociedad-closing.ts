import type { SocialUnit } from '@lee-conmigo/contracts';
import type { SessionState } from '@lee-conmigo/social-content';
import type { SocialLang } from '@lee-conmigo/ui-core';

/**
 * Estadísticas de la tarjeta de cierre de una investigación de Sociedad. Solo muestra "Fuentes usadas" cuando la
 * unidad tiene fuentes de verdad (`unit.sources.length > 0`) — 1.º y 6.º son puro razonamiento (paso `elegir`),
 * sin ninguna fuente que mostrar, así que no deben ver un contador de fuentes ni mucho menos "0/3" (bug
 * reportado: ese "/3" además estaba fijo, cuando las unidades con fuentes tienen 2 o 3, no siempre 3).
 */
export function closingStatsFor(unit: SocialUnit, session: SessionState, lang: SocialLang): { label: string; value: string }[] {
  const stats = [{ label: lang === 'es' ? 'Pasos' : 'Steps', value: `${session.stepsDone.length}/${unit.steps.length}` }];
  if (unit.sources.length > 0) {
    stats.push({ label: lang === 'es' ? 'Fuentes usadas' : 'Sources used', value: `${session.sourcesSelected.length}/${unit.sources.length}` });
  }
  return stats;
}

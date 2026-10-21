import type { SessionSummary } from '@lee-conmigo/contracts';
import { createBundledRepository } from '../../bundled-stories';
import { wordsFromSummaries, type WordCard } from './model';

let repo: ReturnType<typeof createBundledRepository> | null = null;

/**
 * Las palabras nuevas de un niño. El repositorio de historias se arma UNA vez (validar todas las historias es caro y la portada de Inicio
 * se pinta muchas veces).
 */
export function wordsOf(summaries: readonly SessionSummary[]): WordCard[] {
  repo ??= createBundledRepository();
  const r = repo;
  return wordsFromSummaries(summaries, (storyId, key) => r.get(storyId)?.vocabulary[key]);
}

/**
 * Los 6 niveles de lectura de la app (docs/01: tabla de grados, adaptada a nombres que un niño entiende).
 * El nivel es de la app, NO el grado escolar, y lo elige libremente el padre (docs/01, DECISIÓN) — no hay
 * "desbloqueos" por progreso (docs/09 #3): la tensión del prototipo original queda resuelta a favor de la
 * decisión ya escrita en los docs. Un solo lugar para los nombres/iconos: los usan Inicio y Modo padres.
 */
import type { LevelTile } from './screens/home.tsx';

export const READING_LEVELS: ReadonlyArray<Omit<LevelTile, 'current'>> = [
  { n: 1, name: 'Primeras palabras', icon: 'leaf', tone: 'green' },
  { n: 2, name: 'Frases cortas', icon: 'sun', tone: 'blue' },
  { n: 3, name: 'Cuentos', icon: 'mountain', tone: 'violet' },
  { n: 4, name: 'Lector ilustrado', icon: 'crown', tone: 'amber' },
  { n: 5, name: 'Lector con más letra', icon: 'book', tone: 'coral' },
  { n: 6, name: 'Casi un libro', icon: 'trophy', tone: 'gold' },
];

/** Las 6 fichas de nivel, marcando cuál es la actual (para la cuadrícula de Inicio). */
export function levelTilesFor(currentLevel: number): LevelTile[] {
  return READING_LEVELS.map((l) => ({ ...l, current: l.n === currentLevel }));
}

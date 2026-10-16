/**
 * Historias que viajan dentro de la app nativa: TODO `.json` de `packages/story-engine/stories/<idioma>/` y los ajustes de
 * `packages/story-engine/layouts/`. Mismo criterio que `apps/reader/src/bundled-stories.ts` (allí con `import.meta.glob`
 * de Vite; aquí con `require.context` de Metro): agregar una historia es soltar su JSON, sin tocar código.
 */
import { buildRepository, type InMemoryStoryRepository } from '@lee-conmigo/story-engine';

// Metro analiza estas llamadas al empaquetar: deben quedar literales (rutas fijas, sin variables).
const storyFiles = require.context('../../../packages/story-engine/stories', true, /\.json$/);
const layoutFiles = require.context('../../../packages/story-engine/layouts', false, /\.layout\.json$/);

const isDev = (s: unknown) => !!(s as { dev?: boolean }).dev;

/** `includeDev`: las historias de prueba (`dev: true`) solo en desarrollo. Las de verdad van primero. */
export function createBundledRepository(includeDev: boolean = __DEV__): InMemoryStoryRepository {
  const sources = storyFiles
    .keys()
    .map((k) => storyFiles(k))
    .filter((s) => includeDev || !isDev(s))
    .sort((a, b) => Number(isDev(a)) - Number(isDev(b)));
  const layouts = layoutFiles.keys().map((k) => layoutFiles(k));
  return buildRepository(sources, (id, problems) => console.error(`[historias] "${id}" no se cargó:\n - ${problems.join('\n - ')}`), layouts);
}

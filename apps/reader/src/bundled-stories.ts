/**
 * Historias que viajan dentro de la app: TODO `.json` que haya en `packages/story-engine/stories/<idioma>/`.
 * Agregar una historia es soltar su JSON ahí (más sus imágenes en `apps/reader/public/stories/<id>/`);
 * no hay que tocar código. Las historias inválidas no se cargan y se avisan por consola.
 */
import { buildRepository, type InMemoryStoryRepository } from '@lee-conmigo/story-engine';
import { DEV_TOOLS } from './flags.ts';

const modules = import.meta.glob('../../../packages/story-engine/stories/*/*.json', { eager: true, import: 'default' });
/** Ajustes hechos con el modo editor (posición, tamaño y alineación del texto), uno por familia de historias. */
const layoutModules = import.meta.glob('../../../packages/story-engine/layouts/*.layout.json', { eager: true, import: 'default' });

/**
 * `includeDev`: las historias de prueba (`dev: true`) solo existen en desarrollo. En producción no se cargan.
 * Las de verdad van primero, para que "la primera historia" sea siempre una que un niño puede leer.
 */
export function createBundledRepository(includeDev: boolean = DEV_TOOLS): InMemoryStoryRepository {
  const sources = Object.values(modules)
    .filter((s) => includeDev || !(s as { dev?: boolean }).dev)
    .sort((a, b) => Number(!!(a as { dev?: boolean }).dev) - Number(!!(b as { dev?: boolean }).dev));
  return buildRepository(sources, (id, problems) => console.error(`[historias] "${id}" no se cargó:\n - ${problems.join('\n - ')}`), Object.values(layoutModules));
}

/**
 * Ilustraciones de las historias para la app nativa. Las historias citan su arte con una ruta relativa
 * (`stories/<historia>/page-01.webp`, la misma que usa la app web desde `apps/reader/public/`). Metro necesita `require()`
 * estáticos, así que se toma TODA la carpeta con `require.context` — sin copiar las imágenes (docs/11, RN-05).
 *
 * Por ahora todo el arte va dentro de la app; a futuro, paquetes de contenido descargables por historia (docs/02).
 */
import type { ImageSourcePropType } from 'react-native';

// Metro analiza esta llamada al empaquetar: debe quedar literal.
const images = require.context('../../reader/public/stories', true, /\.webp$/);
const byPath = new Map<string, ImageSourcePropType>(images.keys().map((k) => [`stories/${k.replace(/^\.\//, '')}`, images(k)]));

/** Imagen de una ilustración por su ruta en la historia; `undefined` si no está empaquetada. */
export function storyImage(src: string): ImageSourcePropType | undefined {
  return byPath.get(src.replace(/^\//, ''));
}

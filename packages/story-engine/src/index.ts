import type { Story } from '@lee-conmigo/contracts';
import devJson from '../stories/es/dev-tres-paginas.json';
import pilotJson from '../stories/es/la-luna-y-la-puerta-azul.json';

export * from './catalog.ts';
export * from './layout-editing.ts';
export * from './layout-file.ts';
export * from './templates.ts';
export * from './tokenize.ts';
export * from './validate.ts';

/**
 * Historia piloto del prototipo de Reading Session ("La luna y la puerta azul", español).
 * Es la referencia de esquema, NO una historia final. Las historias son datos (JSON) y se agregan
 * sin tocar componentes.
 */
export const pilotStory = pilotJson as unknown as Story;

/**
 * Historia de PRUEBA de tres páginas (una es solo de texto) para desarrollar y probar el flujo de varias
 * páginas, las preguntas por página y la reanudación con el arte del piloto. Marcada `dev`: no se muestra a
 * los niños.
 */
export const devStory = devJson as unknown as Story;

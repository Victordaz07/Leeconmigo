/**
 * Contenido y lógica pura de Ciencia (sin React ni nada nativo). Sigue el patrón de `@lee-conmigo/math-content`
 * (docs/design/subjects/PATRON-MATEMATICAS.md): unidades en JSON validadas, generador determinista con semilla, dominio
 * por evidencia y repaso. Lo edita SOLO la cuenta de Ciencia (docs/14-MATERIAS-EN-PARALELO.md).
 */
export const SUBJECT_ID = 'ciencia' as const;
export * from './map.ts';
export * from './labs/erosion.ts';
export * from './datasets.ts';
export * from './evidence.ts';
export * from './unit.ts';
export * from './progress.ts';
export * from './labs/luz.ts';
export * from './labs/materiales.ts';
export * from './labs/termico.ts';
export * from './labs/imanes.ts';
export * from './labs/materia.ts';
export * from './labs/mezclas.ts';
export * from './labs/choques.ts';

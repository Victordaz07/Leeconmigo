/** Materias que se enchufan por módulo. Lista pura (sin React Native) para poder probarla; `registry.ts` la completa. */
export const SUBJECT_MODULE_IDS = ['ciencia', 'sociedad', 'arte'] as const;
export type SubjectModuleId = (typeof SUBJECT_MODULE_IDS)[number];

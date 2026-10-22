import type { SubjectId } from '@lee-conmigo/ui-core';
import { arteModule } from './arte';
import { cienciaModule } from './ciencia';
import { finanzasModule } from './finanzas';
import { vidaModules } from './vida';
import { miCuadernoModule } from './mi-cuaderno';
import { sociedadModule } from './sociedad';
import type { SubjectModuleId } from './ids';
import type { SubjectModule } from './types';

/**
 * Materias enchufadas por módulo (Lectura y Matemáticas, las primeras, tienen su propio cableado). Este archivo NO se
 * edita para trabajar dentro de una materia: solo se agrega una línea cuando nace una materia nueva (p. ej. Arte).
 */
export const SUBJECT_MODULES: Record<SubjectModuleId, SubjectModule> = {
  ciencia: cienciaModule,
  sociedad: sociedadModule,
  arte: arteModule,
  finanzas: finanzasModule,
  ...vidaModules,
  'mi-cuaderno': miCuadernoModule,
};

/** El módulo de una materia, si lo tiene y ya tiene contenido. */
export const availableModule = (id: SubjectId): SubjectModule | undefined => {
  const m = (SUBJECT_MODULES as Partial<Record<SubjectId, SubjectModule>>)[id];
  return m?.available ? m : undefined;
};

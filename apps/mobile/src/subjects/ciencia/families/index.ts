import type { UnitStep } from '@lee-conmigo/science-content';
import { erosionFamily } from './erosion';
import { lightFamily } from './light';
import { mapFamily } from './map';
import { magnetsFamily } from './magnets';
import { materialsFamily } from './materials';
import { sceneFamily } from './scene';
import { thermalFamily } from './thermal';
import type { Family } from './types';

/** Las familias, de la más específica a la más general: una escena sola es lo último. */
export const FAMILIES: Family[] = [mapFamily, erosionFamily, lightFamily, materialsFamily, thermalFamily, magnetsFamily, sceneFamily];

export const familyOf = (step: UnitStep): Family | undefined => FAMILIES.find((f) => f.owns(step));
export type { Family, Local, StepCtx } from './types';

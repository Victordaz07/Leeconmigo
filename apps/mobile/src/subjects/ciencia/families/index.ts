import type { UnitStep } from '@lee-conmigo/science-content';
import { climateFamily } from './climate';
import { cycleFamily } from './cycle';
import { earthFamily } from './earth';
import { energyFamily } from './energy';
import { erosionFamily } from './erosion';
import { forcesFamily } from './forces';
import { lightFamily } from './light';
import { mapFamily } from './map';
import { magnetsFamily } from './magnets';
import { materialsFamily } from './materials';
import { matterFamily } from './matter';
import { particlesFamily } from './particles';
import { pathFamily } from './path';
import { rampFamily } from './ramp';
import { sceneFamily } from './scene';
import { sortFamily } from './sort';
import { thermalFamily } from './thermal';
import { trendFamily } from './trend';
import { vibrationFamily } from './vibration';
import type { Family } from './types';

/** Las familias, de la más específica a la más general: una escena sola es lo último. */
export const FAMILIES: Family[] = [mapFamily, erosionFamily, lightFamily, materialsFamily, thermalFamily, magnetsFamily, matterFamily, rampFamily, forcesFamily, pathFamily, sortFamily, cycleFamily, particlesFamily, climateFamily, earthFamily, vibrationFamily, energyFamily, trendFamily, sceneFamily];

export const familyOf = (step: UnitStep): Family | undefined => FAMILIES.find((f) => f.owns(step));
export type { Family, Local, StepCtx } from './types';

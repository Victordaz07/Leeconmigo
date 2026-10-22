import type { LifeMission, LifeModuleId } from '../types.ts';
import { AUTONOMIA_MISSION } from './autonomia.ts';
import { COMUNICACION_MISSION } from './comunicacion.ts';
import { CRITICO_MISSION } from './critico.ts';
import { DIGITAL_MISSION } from './digital.ts';
import { EMOCIONES_MISSION } from './emociones.ts';
import { EMPRENDIMIENTO_MISSION } from './emprendimiento.ts';
import { ORGANIZACION_MISSION } from './organizacion.ts';

/** Una mini-misión («primer vistazo») por módulo. Los módulos 04–08 todavía no tienen investigación completa: la revisión de un especialista va antes de ampliarlos. */
export const LIFE_MISSIONS: Record<LifeModuleId, LifeMission> = {
  emociones: EMOCIONES_MISSION,
  comunicacion: COMUNICACION_MISSION,
  digital: DIGITAL_MISSION,
  critico: CRITICO_MISSION,
  autonomia: AUTONOMIA_MISSION,
  organizacion: ORGANIZACION_MISSION,
  emprendimiento: EMPRENDIMIENTO_MISSION,
};

export const missionOf = (id: LifeModuleId): LifeMission => LIFE_MISSIONS[id];

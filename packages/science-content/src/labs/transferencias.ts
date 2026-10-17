/**
 * Dispositivos de energía (C4-U03, 4-PS3-2 y 4-PS3-4): tres dispositivos virtuales y lo que ENTRA y lo que SALE de cada uno.
 *
 *   lámpara (pila + bombilla): entra electricidad → sale luz y calor
 *   campana:                   entra movimiento (el golpe) → sale sonido
 *   molinete:                  entra movimiento (el soplido) → sale movimiento (el giro)
 *
 * Es un modelo cualitativo: dice QUÉ formas de energía intervienen, no cuánta. La energía no aparece ni desaparece: se transfiere (de un lugar a otro)
 * o se transforma (de una forma a otra).
 */
import type { Localized } from '@lee-conmigo/contracts';

export const FORMS = ['electricidad', 'movimiento', 'sonido', 'luz', 'calor'] as const;
export type Form = (typeof FORMS)[number];
export const DEVICES = ['bombilla', 'campana', 'molinete'] as const;
export type Device = (typeof DEVICES)[number];

export interface DeviceModel {
  /** Lo que entra (una forma de energía). */
  entra: Form;
  /** Lo que sale (una o más formas). */
  sale: Form[];
  /** Lo que se hace para que funcione. */
  action: 'conectar' | 'golpear' | 'soplar';
}

export const DEVICE_MODEL: Record<Device, DeviceModel> = {
  bombilla: { entra: 'electricidad', sale: ['luz', 'calor'], action: 'conectar' },
  campana: { entra: 'movimiento', sale: ['sonido'], action: 'golpear' },
  molinete: { entra: 'movimiento', sale: ['movimiento'], action: 'soplar' },
};

export const FORM_NAME: Record<Form, Localized> = {
  electricidad: { es: 'Electricidad', en: 'Electricity' },
  movimiento: { es: 'Movimiento', en: 'Motion' },
  sonido: { es: 'Sonido', en: 'Sound' },
  luz: { es: 'Luz', en: 'Light' },
  calor: { es: 'Calor', en: 'Heat' },
};

export const DEVICE_NAME: Record<Device, Localized> = {
  bombilla: { es: 'Lámpara (pila y bombilla)', en: 'Lamp (battery and bulb)' },
  campana: { es: 'Campana', en: 'Bell' },
  molinete: { es: 'Molinete', en: 'Pinwheel' },
};

/** Lo que se hace con cada dispositivo (el botón). */
export const ACTION_NAME: Record<DeviceModel['action'], Localized> = {
  conectar: { es: 'Conectar la pila', en: 'Connect the battery' },
  golpear: { es: 'Golpear la campana', en: 'Strike the bell' },
  soplar: { es: 'Soplar el molinete', en: 'Blow on the pinwheel' },
};

/** Lo que se nota al usar el dispositivo (se ve, se oye o se siente). */
export const NOTICED: Record<Device, Localized[]> = {
  bombilla: [
    { es: 'La bombilla da luz.', en: 'The bulb gives light.' },
    { es: 'La bombilla se siente tibia.', en: 'The bulb feels warm.' },
  ],
  campana: [{ es: 'La campana suena.', en: 'The bell sounds.' }],
  molinete: [{ es: 'El molinete gira.', en: 'The pinwheel spins.' }],
};

/** Ejemplos para transferir: otros dispositivos y su modelo. */
export const EXTRA_DEVICES = {
  tostador: { entra: 'electricidad', sale: ['calor', 'luz'] },
  timbre: { entra: 'electricidad', sale: ['sonido'] },
} as const satisfies Record<string, { entra: Form; sale: readonly Form[] }>;

export interface DiagramCheck {
  ok: boolean;
  /** Lo que entra está bien. */
  entraOk: boolean;
  /** Formas que salen y no se marcaron. */
  missing: Form[];
  /** Formas marcadas que no salen. */
  extra: Form[];
}

/** Compara el diagrama del niño (lo que entra y lo que sale) con el modelo del dispositivo. */
export function diagramCheck(device: Device, entra: Form | null, sale: readonly Form[]): DiagramCheck {
  const m = DEVICE_MODEL[device];
  const missing = m.sale.filter((f) => !sale.includes(f));
  const extra = sale.filter((f) => !m.sale.includes(f));
  const entraOk = entra === m.entra;
  return { ok: entraOk && missing.length === 0 && extra.length === 0, entraOk, missing, extra };
}

/** ¿Es una transformación (cambia la forma de energía) o una transferencia (la misma forma pasa de un lugar a otro)? */
export const kindOf = (device: Device): 'transforma' | 'transfiere' => (DEVICE_MODEL[device].sale.every((f) => f === DEVICE_MODEL[device].entra) ? 'transfiere' : 'transforma');

export const ENERGY_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Qué formas de energía entran y salen de tres dispositivos (una lámpara, una campana y un molinete): la energía se transfiere de un lugar a otro o se transforma de una forma a otra.',
    en: 'Which forms of energy go into and come out of three devices (a lamp, a bell and a pinwheel): energy is transferred from one place to another or transformed from one form to another.',
  },
  assumptions: [
    { es: 'La energía no aparece de la nada ni desaparece: lo que entra sale en otras formas.', en: 'Energy doesn’t appear from nowhere or vanish: what goes in comes out in other forms.' },
    { es: 'Cada dispositivo se usa de una sola manera (conectar, golpear o soplar).', en: 'Each device is used in one way only (connect, strike or blow).' },
  ],
  doesNotRepresent: [
    { es: 'Cuánta energía sale en cada forma (cuánta luz y cuánto calor).', en: 'How much energy comes out in each form (how much light and how much heat).' },
    { es: 'Cómo funciona por dentro cada dispositivo (circuitos, filamentos): no hace falta para esta unidad.', en: 'How each device works inside (circuits, filaments): not needed for this unit.' },
    { es: 'Dispositivos reales: son ejemplos virtuales para aprender.', en: 'Real devices: they are virtual examples for learning.' },
  ],
  controls: [
    { es: 'Lo que se hace: conectar, golpear o soplar el dispositivo.', en: 'What is done: connect, strike or blow on the device.' },
    { es: 'Lo que se observa: luz, calor, sonido o giro, y lo que se dibuja en el diagrama (entra y sale).', en: 'What is observed: light, heat, sound or spinning, and what is drawn in the diagram (goes in and comes out).' },
  ],
};

/**
 * Constructor del ciclo del agua (C6-U05, MS-ESS2-4): el estudiante arma un MODELO con piezas (mar, nube, montaña, río, árbol, suelo) y
 * flechas de «el agua va de A a B». Cada flecha válida tiene un nombre y un MOTOR: el Sol (energía) o la gravedad. Es determinista y
 * DIDÁCTICO: un modelo, no la realidad completa.
 *
 *   El Sol sube el agua (evaporación del mar, transpiración del árbol).  La gravedad la baja (precipitación, escorrentía, infiltración…).
 *
 * Un modelo vale cuando se puede recorrer en círculo (el agua vuelve al mar) y tiene al menos un flujo impulsado por el Sol y uno por la gravedad.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const PIECES = ['mar', 'nube', 'montana', 'rio', 'arbol', 'suelo'] as const;
export type Piece = (typeof PIECES)[number];
export type Driver = 'sol' | 'gravedad';

export interface Flow {
  id: string;
  from: Piece;
  to: Piece;
  name: Localized;
  driver: Driver;
}

export const FLOWS: readonly Flow[] = [
  { id: 'evaporacion', from: 'mar', to: 'nube', name: { es: 'Evaporación', en: 'Evaporation' }, driver: 'sol' },
  { id: 'transpiracion', from: 'arbol', to: 'nube', name: { es: 'Transpiración', en: 'Transpiration' }, driver: 'sol' },
  { id: 'lluviaMontana', from: 'nube', to: 'montana', name: { es: 'Precipitación (sobre la montaña)', en: 'Precipitation (over the mountain)' }, driver: 'gravedad' },
  { id: 'lluviaMar', from: 'nube', to: 'mar', name: { es: 'Precipitación (sobre el mar)', en: 'Precipitation (over the sea)' }, driver: 'gravedad' },
  { id: 'escorrentia', from: 'montana', to: 'rio', name: { es: 'Escorrentía', en: 'Runoff' }, driver: 'gravedad' },
  { id: 'desembocadura', from: 'rio', to: 'mar', name: { es: 'El río llega al mar', en: 'The river reaches the sea' }, driver: 'gravedad' },
  { id: 'infiltracion', from: 'montana', to: 'suelo', name: { es: 'Infiltración', en: 'Infiltration' }, driver: 'gravedad' },
  { id: 'subterranea', from: 'suelo', to: 'rio', name: { es: 'Agua subterránea hacia el río', en: 'Groundwater toward the river' }, driver: 'gravedad' },
];

export const PIECE_NAME: Record<Piece, Localized> = {
  mar: { es: 'mar', en: 'sea' },
  nube: { es: 'nube', en: 'cloud' },
  montana: { es: 'montaña', en: 'mountain' },
  rio: { es: 'río', en: 'river' },
  arbol: { es: 'árbol', en: 'tree' },
  suelo: { es: 'suelo', en: 'soil' },
};

export const DRIVER_NAME: Record<Driver, Localized> = {
  sol: { es: 'el Sol (energía)', en: 'the Sun (energy)' },
  gravedad: { es: 'la gravedad', en: 'gravity' },
};

/** El flujo que va de `from` a `to`, o `undefined` si el agua no va así directamente. */
export const flowBetween = (from: Piece, to: Piece): Flow | undefined => FLOWS.find((f) => f.from === from && f.to === to);

export const flowById = (id: string): Flow | undefined => FLOWS.find((f) => f.id === id);

/** Por qué una flecha que no existe no vale (texto de acompañamiento, nunca «incorrecto»). */
export function whyNotFlow(from: Piece, to: Piece): Localized {
  if (from === to) return { es: 'El agua tiene que ir de una pieza a otra distinta.', en: 'The water has to go from one piece to a different one.' };
  if (from === 'mar' && to !== 'nube') return { es: 'Del mar el agua no pasa directo a eso: primero sube a la nube (evaporación).', en: 'From the sea the water doesn’t go straight there: it first rises to the cloud (evaporation).' };
  if (from === 'nube' && to !== 'montana' && to !== 'mar') return { es: 'De la nube el agua cae como lluvia, y llega a la montaña o al mar.', en: 'From the cloud the water falls as rain, and reaches the mountain or the sea.' };
  if (to === 'montana') return { es: 'El agua no sube a la montaña por sí sola: llega con la lluvia que cae de la nube.', en: 'Water doesn’t climb the mountain by itself: it arrives with rain falling from the cloud.' };
  if (from === 'rio' && to !== 'mar') return { es: 'El río baja hasta el mar por la gravedad.', en: 'The river runs down to the sea because of gravity.' };
  return { es: 'Piensa en qué mueve el agua ahí: el Sol la sube y la gravedad la baja.', en: 'Think about what moves the water there: the Sun lifts it and gravity pulls it down.' };
}

/** ¿Se puede ir del mar de vuelta al mar siguiendo estas flechas? (el ciclo está cerrado) */
export function isClosedCycle(flowIds: readonly string[]): boolean {
  const flows = flowIds.map(flowById).filter((f): f is Flow => !!f);
  const seen = new Set<Piece>();
  const stack: Piece[] = ['mar'];
  let returned = false;
  while (stack.length) {
    const at = stack.pop() as Piece;
    for (const f of flows) {
      if (f.from !== at) continue;
      if (f.to === 'mar') returned = true;
      else if (!seen.has(f.to)) {
        seen.add(f.to);
        stack.push(f.to);
      }
    }
  }
  return returned;
}

/** Los motores presentes en un modelo. */
export const driversIn = (flowIds: readonly string[]): Driver[] => {
  const set = new Set(flowIds.map((id) => flowById(id)?.driver).filter((d): d is Driver => !!d));
  return (['sol', 'gravedad'] as const).filter((d) => set.has(d));
};

export interface ModelCheck {
  closed: boolean;
  hasSun: boolean;
  hasGravity: boolean;
  ok: boolean;
}

/** Revisa un modelo: ciclo cerrado y los dos motores. */
export function checkModel(flowIds: readonly string[]): ModelCheck {
  const drivers = driversIn(flowIds);
  const closed = isClosedCycle(flowIds);
  const hasSun = drivers.includes('sol');
  const hasGravity = drivers.includes('gravedad');
  return { closed, hasSun, hasGravity, ok: closed && hasSun && hasGravity };
}

/** El modelo mínimo que ya es un ciclo (3 flechas: evaporación, lluvia sobre la montaña… no: mar → nube → mar). */
export const MINIMAL_CYCLE: readonly string[] = ['evaporacion', 'lluviaMar'];

/** Lo que el modelo declara de sí mismo (toda simulación dice qué representa y qué NO). */
export const CYCLE_MODEL: { represents: Localized; assumptions: Localized[]; doesNotRepresent: Localized[]; controls: Localized[] } = {
  represents: {
    es: 'Que el agua circula entre el mar, el aire, la tierra y los ríos: el Sol (energía) la sube y la gravedad la baja, y el ciclo se cierra.',
    en: 'That water circulates among the sea, the air, the land and rivers: the Sun (energy) lifts it and gravity pulls it down, and the cycle closes.',
  },
  assumptions: [
    { es: 'Seis piezas y ocho flechas posibles; cada flecha dice de dónde a dónde va el agua y qué la mueve.', en: 'Six pieces and eight possible arrows; each arrow says where the water goes from and to, and what moves it.' },
    { es: 'Cada flecha tiene un solo motor principal: el Sol o la gravedad.', en: 'Each arrow has a single main driver: the Sun or gravity.' },
  ],
  doesNotRepresent: [
    { es: 'Cuánta agua hay en cada pieza ni cuánto tarda cada paso.', en: 'How much water there is in each piece or how long each step takes.' },
    { es: 'Todos los caminos del agua: el hielo, los lagos, los animales y la gente también la mueven.', en: 'All the paths water takes: ice, lakes, animals and people also move it.' },
    { es: 'Cómo es el agua por dentro cuando cambia de estado: solo se dice que sube o baja.', en: 'What water is like inside when it changes state: it only says it rises or falls.' },
  ],
  controls: [
    { es: 'Lo que se cambia: qué flechas tiene el modelo.', en: 'What changes: which arrows the model has.' },
    { es: 'Lo que se comprueba: si el ciclo se cierra y si están los dos motores (Sol y gravedad).', en: 'What is checked: whether the cycle closes and whether both drivers (Sun and gravity) are present.' },
  ],
};

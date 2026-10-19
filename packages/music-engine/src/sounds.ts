import type { Localized } from '@lee-conmigo/contracts';
import { TRACKS, type Track } from './pattern.ts';

/**
 * El catálogo de 16 sonidos del estudio (ESPECIFICACION §3b): cuatro familias de cuatro. Todos se sintetizan por código (`synth.ts`): sin
 * grabaciones, sin derechos que revisar. Los nombres describen cómo suena o cómo se toca; ninguno dice «auténtico» de una tradición.
 */
export const FAMILIES = ['tambores', 'cuerpo', 'madera-metal', 'tonos'] as const;
export type Family = (typeof FAMILIES)[number];

export const FAMILY_NAME: Record<Family, Localized> = {
  tambores: { es: 'Tambores', en: 'Drums' },
  cuerpo: { es: 'Cuerpo y voz', en: 'Body and voice' },
  'madera-metal': { es: 'Madera, metal y sonajas', en: 'Wood, metal and shakers' },
  tonos: { es: 'Con tono (notas)', en: 'Pitched (notes)' },
};

export const SOUND_IDS = ['bombo', 'tom', 'bongo', 'caja', 'palmas', 'chasquido', 'pisada', 'voz', 'claves', 'bloque', 'triangulo', 'sonaja', 'marimba', 'carillon', 'cuerda', 'bajo'] as const;
export type SoundId = (typeof SOUND_IDS)[number];

export interface SoundInfo {
  id: SoundId;
  family: Family;
  name: Localized;
  /** Cómo suena, en una frase corta (para el lector de pantalla y la ayuda). */
  hint: Localized;
  /** Tiene una altura de nota definida (marimba, carillón, cuerda, bajo, voz); los demás son percusión sin nota. */
  pitched: boolean;
}

export const SOUNDS: Record<SoundId, SoundInfo> = {
  bombo: { id: 'bombo', family: 'tambores', name: { es: 'Bombo', en: 'Bass drum' }, hint: { es: 'Golpe grave y profundo.', en: 'A deep, low thump.' }, pitched: false },
  tom: { id: 'tom', family: 'tambores', name: { es: 'Tambor medio', en: 'Mid drum' }, hint: { es: 'Tambor redondo, de tono medio.', en: 'A round drum with a middle tone.' }, pitched: false },
  bongo: { id: 'bongo', family: 'tambores', name: { es: 'Bongó', en: 'Bongo' }, hint: { es: 'Tambor pequeño, agudo y seco.', en: 'A small, high, dry drum.' }, pitched: false },
  caja: { id: 'caja', family: 'tambores', name: { es: 'Caja', en: 'Snare' }, hint: { es: 'Golpe seco con sonido de arena.', en: 'A crisp hit with a sandy rattle.' }, pitched: false },
  palmas: { id: 'palmas', family: 'cuerpo', name: { es: 'Palmas', en: 'Claps' }, hint: { es: 'Dos manos que aplauden.', en: 'Two hands clapping.' }, pitched: false },
  chasquido: { id: 'chasquido', family: 'cuerpo', name: { es: 'Chasquido', en: 'Finger snap' }, hint: { es: 'Chasquido de dedos, muy corto.', en: 'A very short finger snap.' }, pitched: false },
  pisada: { id: 'pisada', family: 'cuerpo', name: { es: 'Pisada', en: 'Stomp' }, hint: { es: 'Un pie que pisa fuerte el suelo.', en: 'A foot stomping the floor.' }, pitched: false },
  voz: { id: 'voz', family: 'cuerpo', name: { es: 'Voz «a»', en: 'Voice “ah”' }, hint: { es: 'Una voz sintética que canta «a» (no es la de nadie).', en: 'A synthetic voice singing “ah” (nobody’s real voice).' }, pitched: true },
  claves: { id: 'claves', family: 'madera-metal', name: { es: 'Claves', en: 'Claves' }, hint: { es: 'Dos palitos de madera que chocan.', en: 'Two wooden sticks hitting each other.' }, pitched: false },
  bloque: { id: 'bloque', family: 'madera-metal', name: { es: 'Bloque de madera', en: 'Wood block' }, hint: { es: 'Madera hueca, «toc».', en: 'Hollow wood, “tock”.' }, pitched: false },
  triangulo: { id: 'triangulo', family: 'madera-metal', name: { es: 'Triángulo', en: 'Triangle' }, hint: { es: 'Metal brillante que resuena largo.', en: 'Bright metal that rings for a while.' }, pitched: false },
  sonaja: { id: 'sonaja', family: 'madera-metal', name: { es: 'Sonaja', en: 'Shaker' }, hint: { es: 'Semillas que se sacuden.', en: 'Seeds being shaken.' }, pitched: false },
  marimba: { id: 'marimba', family: 'tonos', name: { es: 'Marimba', en: 'Marimba' }, hint: { es: 'Placa de madera con nota (do).', en: 'A wooden bar playing a note (C).' }, pitched: true },
  carillon: { id: 'carillon', family: 'tonos', name: { es: 'Campanita', en: 'Little bell' }, hint: { es: 'Campana clara con nota (sol).', en: 'A clear bell playing a note (G).' }, pitched: true },
  cuerda: { id: 'cuerda', family: 'tonos', name: { es: 'Cuerda', en: 'Plucked string' }, hint: { es: 'Una cuerda pulsada con nota (sol grave).', en: 'A plucked string playing a low G.' }, pitched: true },
  bajo: { id: 'bajo', family: 'tonos', name: { es: 'Bajo', en: 'Bass' }, hint: { es: 'Nota muy grave y redonda (do).', en: 'A very low, round note (C).' }, pitched: true },
};

export const soundsOf = (family: Family): SoundId[] => SOUND_IDS.filter((id) => SOUNDS[id].family === family);

/** Qué sonido tiene cada fila. */
export type Kit = Record<Track, SoundId>;

/** El juego de partida: bombo, palmas, sonaja y voz (los cuatro sonidos con que empezó el estudio). */
export const DEFAULT_KIT: Kit = { a: 'bombo', b: 'palmas', c: 'sonaja', d: 'voz' };

export const isSoundId = (v: unknown): v is SoundId => typeof v === 'string' && (SOUND_IDS as readonly string[]).includes(v);

export const isValidKit = (k: unknown): k is Kit => typeof k === 'object' && k !== null && TRACKS.every((t) => isSoundId((k as Record<string, unknown>)[t]));

/**
 * Laboratorio «Paisaje y erosión» (docs/design/ciencia/unidades/C4-U06.md §3). Modelo CIENTÍFICO ACOTADO y determinista:
 * una bandeja inclinada con tierra, una lluvia constante y un vaso que recoge el sedimento. Mismo estado + misma semilla =
 * mismos resultados. Separado del aspecto visual: aquí no hay imágenes ni pantallas, solo la regla.
 *
 * TODOS los gramos que salen de aquí son DATOS DIDÁCTICOS (inventados para aprender): se rotulan así en pantalla y nunca se
 * atribuyen a una medición real ni a una institución.
 */
import type { Localized } from '@lee-conmigo/contracts';

export const COVERS = ['ninguna', 'parcial', 'completa'] as const;
export const SLOPES = ['suave', 'media', 'fuerte'] as const;
export type Cover = (typeof COVERS)[number];
export type Slope = (typeof SLOPES)[number];
export type TrayId = 'A' | 'B';

/** Gramos de sedimento de la bandeja de referencia (pendiente media, sin cobertura). */
export const BASE_GRAMS = 19;
export const COVER_FACTOR: Record<Cover, number> = { ninguna: 1, parcial: 0.6, completa: 0.32 };
export const SLOPE_FACTOR: Record<Slope, number> = { suave: 0.6, media: 1, fuerte: 1.5 };
/** La lluvia no se cambia en esta unidad: «lluvia mediana». */
export const RAIN = 'mediana' as const;

export interface TrayConfig {
  cover: Cover;
  slope: Slope;
}

/** «Variación natural» al repetir una prueba: siempre dentro de ±1 g (bandeja A y B recorren el ciclo en sentido distinto). */
const OFFSETS: Record<TrayId, readonly number[]> = { A: [-1, 1, 0], B: [0, 1, -1] };

const mod3 = (n: number) => ((n % 3) + 3) % 3;

/** Desvío de la prueba `trial` (0, 1, 2…) con la semilla `seed`. */
export const offsetFor = (tray: TrayId, seed: number, trial: number): number => OFFSETS[tray][mod3(seed + trial)];

/** Gramos que la tierra de la bandeja lleva al vaso en UNA prueba. Redondeo clásico (28,5 → 29). */
export function sedimentGrams(cfg: TrayConfig, tray: TrayId, seed: number, trial: number): number {
  return Math.round(BASE_GRAMS * COVER_FACTOR[cfg.cover] * SLOPE_FACTOR[cfg.slope]) + offsetFor(tray, seed, trial);
}

/** Las pruebas 0…n−1 de una bandeja. */
export const runTrials = (cfg: TrayConfig, tray: TrayId, seed: number, n = 3): number[] => Array.from({ length: n }, (_, t) => sedimentGrams(cfg, tray, seed, t));

/** Lo que se VE en el vaso antes de tener números (S2): ≤ 7 g poca · 8–17 g algo · ≥ 18 g mucha tierra. */
export type Turbidity = 'poca' | 'algo' | 'mucha';
export const turbidity = (grams: number): Turbidity => (grams <= 7 ? 'poca' : grams <= 17 ? 'algo' : 'mucha');

export interface FairTest {
  /** Qué controles son distintos entre las dos bandejas. */
  changed: ('cover' | 'slope')[];
  /** `true` si cambia UNA sola cosa (la única forma de atribuir la diferencia). Nunca se muestra como error: es una pista. */
  fair: boolean;
}

export function fairTest(a: TrayConfig, b: TrayConfig): FairTest {
  const changed: FairTest['changed'] = [];
  if (a.cover !== b.cover) changed.push('cover');
  if (a.slope !== b.slope) changed.push('slope');
  return { changed, fair: changed.length === 1 };
}

/** Lo que el modelo declara de sí mismo (informe §6: toda simulación dice qué representa, supuestos y lo que NO representa). */
export interface LabModelInfo {
  represents: Localized;
  assumptions: Localized[];
  doesNotRepresent: Localized[];
  controls: { id: 'cover' | 'slope'; values: readonly string[] }[];
  unit: Localized;
}

export const EROSION_MODEL: LabModelInfo = {
  represents: {
    es: 'Una bandeja de laboratorio con tierra, una lluvia constante y el efecto de una cubierta de plantas sobre cuánta tierra baja con el agua.',
    en: 'A lab tray with soil, constant rain, and the effect of a plant cover on how much soil washes away with the water.',
  },
  assumptions: [
    { es: 'Es la misma tierra en las dos bandejas.', en: 'The soil is the same in both trays.' },
    { es: 'Cae la misma cantidad de agua durante el mismo tiempo.', en: 'The same amount of water falls for the same time.' },
    { es: 'El vaso está vacío al empezar.', en: 'The cup is empty at the start.' },
  ],
  doesNotRepresent: [
    { es: 'Una ladera real.', en: 'A real hillside.' },
    { es: 'Tormentas muy fuertes.', en: 'Very strong storms.' },
    { es: 'Distintos tipos de suelo ni raíces profundas.', en: 'Different soil types or deep roots.' },
    { es: 'Lo que pasa en muchos años.', en: 'What happens over many years.' },
    { es: 'Hielo ni viento.', en: 'Ice or wind.' },
  ],
  controls: [
    { id: 'cover', values: COVERS },
    { id: 'slope', values: SLOPES },
  ],
  unit: { es: 'gramos (datos de práctica)', en: 'grams (practice data)' },
};

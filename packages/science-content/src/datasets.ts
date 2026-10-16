/**
 * Conjuntos de datos y mapas de práctica de C4-U06 (docs/design/ciencia/unidades/C4-U06.md §4).
 *
 * REGLA: todo dato lleva su PROCEDENCIA. Hoy todo es `didactic` (inventado para aprender) y la pantalla lo dice con un
 * distintivo. Nunca se atribuye una medición inventada a NASA, NOAA, USGS ni a una ciudad real.
 */
import type { Localized } from '@lee-conmigo/contracts';
import { runTrials, type TrayConfig } from './labs/erosion.ts';

export type Provenance =
  | { kind: 'observed' } // lo midió o vio el niño en la sesión
  | { kind: 'real'; source: string; url: string; date: string; license: string } // registro real, con procedencia y permiso
  | { kind: 'didactic'; note: Localized }; // inventado para enseñar: se dice

export const DIDACTIC: Provenance = {
  kind: 'didactic',
  note: { es: 'Datos de práctica (inventados para aprender)', en: 'Practice data (made up for learning)' },
};

/** Etiqueta que se muestra junto a un dato según su procedencia. */
export const provenanceLabel = (p: Provenance): Localized =>
  p.kind === 'didactic' ? p.note : p.kind === 'observed' ? { es: 'Lo observaste tú', en: 'You observed this' } : { es: `Registro real (${p.source}, ${p.date})`, en: `Real record (${p.source}, ${p.date})` };

export interface DatasetRow {
  id: string;
  label: Localized;
  values: number[];
}
export interface Dataset {
  id: string;
  provenance: Provenance;
  unit: Localized;
  rows: DatasetRow[];
}

const GRAMS: Localized = { es: 'gramos', en: 'grams' };
const tray = (id: string, label: Localized, cfg: TrayConfig, which: 'A' | 'B'): DatasetRow => ({ id, label, values: runTrials(cfg, which, 0) });

/** Datos de las bandejas, generados por el MODELO (semilla 0): nunca escritos a mano, para que no puedan contradecirlo. */
export const LADERA_DATASETS: Record<string, Dataset> = {
  base: {
    id: 'ladera.base',
    provenance: DIDACTIC,
    unit: GRAMS,
    rows: [
      tray('ninguna', { es: 'Sin cobertura', en: 'No cover' }, { cover: 'ninguna', slope: 'media' }, 'A'),
      tray('completa', { es: 'Con cobertura', en: 'With cover' }, { cover: 'completa', slope: 'media' }, 'B'),
    ],
  },
  /** S6: cambian DOS cosas a la vez; no se puede atribuir la diferencia. */
  mixta: {
    id: 'ladera.mixta',
    provenance: DIDACTIC,
    unit: GRAMS,
    rows: [
      tray('A', { es: 'Bandeja A (muy inclinada, sin cobertura)', en: 'Tray A (steep, no cover)' }, { cover: 'ninguna', slope: 'fuerte' }, 'A'),
      tray('B', { es: 'Bandeja B (poco inclinada, con cobertura)', en: 'Tray B (gentle, with cover)' }, { cover: 'completa', slope: 'suave' }, 'B'),
    ],
  },
  /** S6: la prueba arreglada: solo cambia la cobertura. */
  justaCobertura: {
    id: 'ladera.justa.cobertura',
    provenance: DIDACTIC,
    unit: GRAMS,
    rows: [
      tray('A', { es: 'Bandeja A (sin cobertura)', en: 'Tray A (no cover)' }, { cover: 'ninguna', slope: 'fuerte' }, 'A'),
      tray('B', { es: 'Bandeja B (con cobertura)', en: 'Tray B (with cover)' }, { cover: 'completa', slope: 'fuerte' }, 'B'),
    ],
  },
  /** Extensión: solo cambia la pendiente. */
  justaPendiente: {
    id: 'ladera.justa.pendiente',
    provenance: DIDACTIC,
    unit: GRAMS,
    rows: [
      tray('A', { es: 'Bandeja A (poco inclinada)', en: 'Tray A (moderate slope)' }, { cover: 'ninguna', slope: 'media' }, 'A'),
      tray('B', { es: 'Bandeja B (muy inclinada)', en: 'Tray B (steep)' }, { cover: 'ninguna', slope: 'fuerte' }, 'B'),
    ],
  },
};

// ------------------------------------------------------------------ mapas de práctica

export interface Cell {
  col: number;
  row: number;
}
export type MapZone = 'cerca' | 'llanura' | 'mar';

export interface PracticeMap {
  id: string;
  provenance: Provenance;
  /** Siempre visible: «Mapa de práctica: no es un lugar real». */
  disclaimer: Localized;
  cols: number;
  rows: number;
  /** Casillas de la cordillera (relieve). */
  range: Cell[];
  volcanoes: Cell[];
  earthquakes: Cell[];
  /** Columnas de mar (de la 0 a `seaCols − 1`). 0 = no hay mar en este mapa. */
  seaCols: number;
}

const DISCLAIMER: Localized = { es: 'Mapa de práctica: no es un lugar real', en: 'Practice map: not a real place' };
const c = (col: number, row: number): Cell => ({ col, row });

export const PRACTICE_MAPS: Record<'A' | 'B', PracticeMap> = {
  A: {
    id: 'mapa.A',
    provenance: DIDACTIC,
    disclaimer: DISCLAIMER,
    cols: 12,
    rows: 8,
    seaCols: 0,
    range: [c(2, 1), c(3, 2), c(4, 3), c(5, 4), c(6, 5), c(7, 6)],
    volcanoes: [c(3, 2), c(5, 4), c(7, 6)],
    // 13 dentro de la franja de ±1 casilla de la cordillera y 2 lejos: «casi todos», no «todos».
    earthquakes: [c(2, 2), c(3, 1), c(3, 3), c(4, 2), c(4, 4), c(5, 3), c(5, 5), c(6, 4), c(6, 6), c(7, 5), c(8, 6), c(1, 1), c(6, 5), c(10, 1), c(1, 6)],
  },
  B: {
    id: 'mapa.B',
    provenance: DIDACTIC,
    disclaimer: DISCLAIMER,
    cols: 12,
    rows: 8,
    seaCols: 3,
    range: [c(8, 1), c(8, 2), c(8, 3), c(8, 4), c(8, 5)],
    volcanoes: [c(8, 2), c(8, 4)],
    // 10 en la franja; 2 lejos (uno en la llanura y uno en el mar).
    earthquakes: [c(7, 1), c(9, 1), c(7, 2), c(9, 3), c(7, 4), c(9, 5), c(8, 3), c(8, 1), c(7, 6), c(9, 6), c(4, 5), c(1, 2)],
  },
};

const same = (a: Cell, b: Cell) => a.col === b.col && a.row === b.row;
const distance = (a: Cell, b: Cell) => Math.max(Math.abs(a.col - b.col), Math.abs(a.row - b.row));

/** ¿La casilla está en la franja de ±1 casilla (incluida la diagonal) alrededor de la cordillera? */
export const inBand = (map: PracticeMap, cell: Cell): boolean => map.range.some((r) => distance(r, cell) <= 1);

/** Dónde cae un punto: cerca de la cordillera, en la llanura lejana o en el mar (T4). */
export function zoneOf(map: PracticeMap, cell: Cell): MapZone {
  if (inBand(map, cell)) return 'cerca';
  return cell.col < map.seaCols ? 'mar' : 'llanura';
}

/** Cuántos sismos caen en la franja (lo calcula la app: el niño nunca ve un número escrito a mano, T6). */
export function bandCount(map: PracticeMap): { inside: number; total: number } {
  return { inside: map.earthquakes.filter((e) => inBand(map, e)).length, total: map.earthquakes.length };
}

/** Sismos por zona (lo que se revela al comparar en T4). */
export function quakesByZone(map: PracticeMap): Record<MapZone, number> {
  const z: Record<MapZone, number> = { cerca: 0, llanura: 0, mar: 0 };
  for (const e of map.earthquakes) z[zoneOf(map, e)]++;
  return z;
}

/** Comprueba un mapa de práctica (lista vacía = válido). */
export function practiceMapProblems(map: PracticeMap): string[] {
  const p: string[] = [];
  const inside = (x: Cell) => x.col >= 0 && x.col < map.cols && x.row >= 0 && x.row < map.rows;
  for (const [name, cells] of [['cordillera', map.range], ['volcán', map.volcanoes], ['sismo', map.earthquakes]] as const) {
    for (const cell of cells) if (!inside(cell)) p.push(`${map.id}: ${name} fuera de la cuadrícula (${cell.col},${cell.row})`);
  }
  for (const v of map.volcanoes) if (!map.range.some((r) => same(r, v))) p.push(`${map.id}: el volcán (${v.col},${v.row}) no está sobre la cordillera`);
  const seen = new Set<string>();
  for (const e of map.earthquakes) {
    const k = `${e.col},${e.row}`;
    if (seen.has(k)) p.push(`${map.id}: sismo repetido (${k})`);
    seen.add(k);
  }
  const { inside: n, total } = bandCount(map);
  if (n / total < 0.8) p.push(`${map.id}: solo ${n}/${total} sismos en la franja (se piden ≥ 80 %)`);
  if (n === total) p.push(`${map.id}: ningún sismo fuera de la franja: el patrón sería «todos», no «casi todos»`);
  if (map.seaCols > 0 && !map.earthquakes.some((e) => zoneOf(map, e) === 'mar')) p.push(`${map.id}: hay mar pero ningún punto en él`);
  if (map.provenance.kind !== 'didactic') p.push(`${map.id}: un mapa de práctica debe ser didáctico`);
  return p;
}

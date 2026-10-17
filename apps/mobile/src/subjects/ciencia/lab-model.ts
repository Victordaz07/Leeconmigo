/**
 * Del modelo de erosión a lo que se dibuja (Ciencia). Sin React Native: pura y probada. Los gramos SIEMPRE salen del modelo
 * de `@lee-conmigo/science-content` (semilla 0, la misma de los conjuntos de datos), nunca se escriben a mano en una pantalla.
 */
import { inBand, sedimentGrams, turbidity, type LabSetup, type PracticeMap, type Slope } from '@lee-conmigo/science-content';
import { CIENCIA_COPY, type CienciaLang } from '@lee-conmigo/ui-core';
import type { MapCell, MapView2D, TrayView } from '@lee-conmigo/ui-native';

export type Side = 'a' | 'b';
export const SEED = 0;
/** Tope del eje de la gráfica: el dato más alto del modelo (30 g) con aire. */
export const MAX_GRAMS = 32;
export const SLOPE_DEG: Record<Slope, number> = { suave: 5, media: 12, fuerte: 22 };

/** Gramos de la prueba `trial` (0, 1, 2) de una bandeja. */
export const gramsFor = (lab: LabSetup, side: Side, trial: number): number => sedimentGrams(lab[side], side === 'a' ? 'A' : 'B', SEED, trial);

/** Las 3 (o las que se hayan hecho) pruebas de una bandeja. */
export const trialsFor = (lab: LabSetup, side: Side, n = 3): number[] => Array.from({ length: n }, (_, t) => gramsFor(lab, side, t));

/** Cuánta tierra hay en el vaso (0–1) para dibujar el nivel. */
export const levelOf = (grams: number): number => Math.min(1, grams / MAX_GRAMS);

const CUP = (g: number, lang: CienciaLang) => CIENCIA_COPY.cup[turbidity(g)][lang];

/** Lo que se ve en cada bandeja tras la prueba número `shown` (1, 2, 3); `0` = todavía no se regó. */
export function trayViews(lab: LabSetup, shown: number, lang: CienciaLang): [TrayView, TrayView] {
  const c = CIENCIA_COPY;
  const view = (side: Side): TrayView => {
    const g = shown > 0 ? gramsFor(lab, side, shown - 1) : null;
    return {
      key: side,
      title: c.tray[side === 'a' ? 'A' : 'B'][lang],
      cover: lab[side].cover,
      slopeDeg: SLOPE_DEG[lab[side].slope],
      caption: `${c.cover[lab[side].cover][lang]} · ${c.slope[lab[side].slope][lang]}`,
      level: g === null ? null : levelOf(g),
      cupCaption: g === null ? undefined : CUP(g, lang),
    };
  };
  return [view('a'), view('b')];
}

/** El mapa de práctica tal como lo dibuja la pantalla; con `withBand`, la franja de ±1 casilla alrededor de la cordillera. */
export function mapView(map: PracticeMap, withBand: boolean): MapView2D {
  const band: MapCell[] = [];
  if (withBand) for (let row = 0; row < map.rows; row++) for (let col = 0; col < map.cols; col++) if (inBand(map, { col, row })) band.push({ col, row });
  return { cols: map.cols, rows: map.rows, range: map.range, volcanoes: map.volcanoes, quakes: map.earthquakes, seaCols: map.seaCols, band };
}

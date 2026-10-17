/**
 * Una «familia» de laboratorio es lo que dibuja y deja HACER un paso (bandejas de erosión, mapa de práctica, caja de luz…).
 * El reproductor de sesión es genérico (cabecera, Maya, tareas, preguntas, cierre); cada familia pone su visual y dice cuándo el
 * paso está listo. Así una unidad nueva no toca el reproductor: solo agrega su familia (docs/14).
 */
import type { MutableRefObject, ReactNode } from 'react';
import type { MapCell, MapLayers } from '@lee-conmigo/ui-native';
import type { ScienceUnit, StepChoice, UnitStep, UnitTask } from '@lee-conmigo/science-content';
import type { CienciaLang } from '@lee-conmigo/ui-core';
import type { Side } from '../lab-model';
import type { Picks } from '../task-panel';

/** Estado de UN paso: se reinicia al cambiar de paso. */
export interface Local {
  trial: number;
  watering: boolean;
  weighing?: { side: Side; col: number };
  layers: MapLayers;
  marks: MapCell[];
  /** Pulsó «Comprobar» en una pregunta suelta. */
  checked: boolean;
  skipped: boolean;
  /** Estado propio de cada familia (p. ej. la caja de luz). */
  bag: Record<string, unknown>;
}

export interface StepCtx {
  unit: ScienceUnit;
  step: UnitStep;
  task?: UnitTask;
  lang: CienciaLang;
  calm: boolean;
  small: boolean;
  /** Ancho disponible para el dibujo (la mitad izquierda en pantallas anchas). */
  visualWidth: number;
  picks: Record<string, Picks>;
  setPicks: (f: (p: Record<string, Picks>) => Record<string, Picks>) => void;
  done: Record<string, 'ok' | 'skipped'>;
  choice?: StepChoice;
  choiceGood: boolean;
  /** Arreglo que eligió el niño en la tarea de transferencia (`arreglo`), si ya la hizo. */
  fix?: string;
  local: Local;
  patch: (p: Partial<Local>) => void;
  /** Datos que cruzan de un paso a otro dentro de la sesión (la tabla de pesadas, las barras…). */
  shared: Record<string, unknown>;
  setShared: (key: string, value: unknown) => void;
  markTriedAgain: () => void;
  timer: MutableRefObject<ReturnType<typeof setTimeout> | undefined>;
}

export interface Family {
  id: string;
  /** ¿Este paso es de esta familia? */
  owns: (step: UnitStep) => boolean;
  /** Estado de partida del paso. */
  initial?: (step: UnitStep) => Partial<Local>;
  visual: (ctx: StepCtx) => ReactNode;
  /** Lo que falta además de la tarea y la pregunta (p. ej. regar tres veces). */
  ready?: (ctx: StepCtx) => boolean;
  /** Pasos donde el niño puede decir «Lo veo luego» aunque la familia no tenga su propio botón. */
  skippable?: (step: UnitStep) => boolean;
}

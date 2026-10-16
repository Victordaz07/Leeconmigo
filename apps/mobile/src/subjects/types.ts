import type { ComponentType } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { FocusSupports } from '@lee-conmigo/contracts';
import type { MathLang, SubjectId } from '@lee-conmigo/ui-core';
import type { ChildProfile } from '../app-state';
import type { SubjectKey } from '../persist/store';

/** Lo que recibe la pantalla de una materia al abrirla desde Inicio. */
export interface SubjectScreenProps {
  profile: ChildProfile;
  lang: MathLang;
  /** Minutos de la misión de hoy. */
  minutes: number;
  /** Apoyos del Modo Enfoque que rigen ahora (D4): se leen apoyos concretos, nunca "el modo". */
  focus: FocusSupports;
  /** Volver a Inicio. */
  onExit: () => void;
}

/** La portada de la materia en la estantería de Inicio. */
export interface SubjectHomeCard {
  subtitle: string;
  /** 0–3 (`progressSegments` de ui-core). */
  segments: 0 | 1 | 2 | 3;
  image?: ImageSourcePropType;
}

/**
 * Una materia nueva se enchufa a la app con un módulo propio (`apps/mobile/src/subjects/<materia>/index.tsx`) y se
 * registra UNA vez en `registry.ts`. La materia maneja su propia navegación interna dentro de `Screen` (estado local),
 * así que no toca `App.tsx` ni `home-screen.tsx`.
 */
export interface SubjectModule {
  id: SubjectKey & SubjectId;
  /** `false` = en la estantería se ve como "Pronto" y no se puede abrir (no se inventa contenido). */
  available: boolean;
  homeCard: (profile: ChildProfile, lang: MathLang) => SubjectHomeCard;
  Screen: ComponentType<SubjectScreenProps>;
}

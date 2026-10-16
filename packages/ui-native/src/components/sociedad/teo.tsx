import { Image, type ImageSourcePropType } from 'react-native';

export type TeoPose = 'saluda' | 'piensa' | 'apunta' | 'celebra';

/**
 * Teo, la guía de Sociedad (como Mila en Matemáticas): mismo niño de "El mapa de la puerta desaparecida"
 * (docs/design/sociedad/UNIDAD-PILOTO-S3-U03.md). Decorativo (el lector de pantalla no lo anuncia: el mensaje va
 * en texto). Se oculta con `decor` apagado (Modo Enfoque, K7).
 */
export function Teo({ pose, height, art }: { pose: TeoPose; height: number; art: Record<TeoPose, { source: ImageSourcePropType; aspect: number }> }) {
  const t = art[pose];
  return <Image source={t.source} style={{ height, width: Math.round(height * t.aspect) }} resizeMode="contain" accessible={false} />;
}

/** Qué pose acompaña cada momento de la investigación: nunca triste ni regañando (docs/06). */
export function teoPoseFor(moment: 'intro' | 'thinking' | 'pointing' | 'done'): TeoPose {
  if (moment === 'done') return 'celebra';
  if (moment === 'pointing') return 'apunta';
  if (moment === 'thinking') return 'piensa';
  return 'saluda';
}

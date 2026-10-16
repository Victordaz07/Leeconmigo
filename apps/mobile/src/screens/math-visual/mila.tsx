import { Image } from 'react-native';
import { MILA, type MilaPose } from '../../math-art';

/**
 * Mila en una pose, decorativa (el lector de pantalla no la anuncia: el mensaje va en texto). Se oculta con `decor`
 * apagado (Modo Enfoque, K7).
 */
export function Mila({ pose, height }: { pose: MilaPose; height: number }) {
  const m = MILA[pose];
  return <Image source={m.source} style={{ height, width: Math.round(height * m.aspect) }} resizeMode="contain" accessible={false} />;
}

/** Qué pose acompaña cada momento del ejercicio: nunca triste ni regañando. */
export function guidePose(phase: 'working' | 'reviewing' | 'solved' | 'revealed', hintLevel: number, checked: boolean): MilaPose {
  if (phase === 'solved') return 'celebra';
  if (phase === 'revealed') return 'apunta';
  if (phase === 'reviewing') return 'animo';
  if (hintLevel > 0) return 'piensa';
  return checked ? 'apunta' : 'saluda';
}

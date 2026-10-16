import type { RefObject } from 'react';
import type { GestureResponderEvent, View } from 'react-native';

/**
 * Dónde tocó el niño DENTRO de un elemento (x, y en píxeles desde su esquina). `locationX/Y` no existe en un toque de la
 * versión web, así que se calcula con la posición de la página del toque menos la del elemento (funciona igual en el
 * teléfono, la tableta y el navegador).
 */
export function tapPosition(ref: RefObject<View | null>, e: GestureResponderEvent, done: (x: number, y: number) => void): void {
  const { pageX, pageY, locationX, locationY } = e.nativeEvent;
  const node = ref.current;
  if (!node || typeof pageX !== 'number' || typeof pageY !== 'number') {
    if (typeof locationX === 'number' && typeof locationY === 'number') done(locationX, locationY);
    return;
  }
  node.measure((_x, _y, _w, _h, px, py) => done(pageX - px, pageY - py));
}

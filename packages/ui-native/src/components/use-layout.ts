import { useWindowDimensions } from 'react-native';
import { layoutFor, type Layout } from '@lee-conmigo/ui-core';

/** El acomodo de la pantalla actual; se recalcula al girar el equipo o cambiar el tamaño de la ventana. */
export function useLayout(): Layout {
  const { width, height } = useWindowDimensions();
  return layoutFor(width, height);
}

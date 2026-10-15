/**
 * Iconos del prototipo aprobado para React Native (mismos trazos que `packages/ui/src/icons.tsx`, con react-native-svg).
 * Se agregan a medida que se migran pantallas.
 */
import Svg, { Path, Rect } from 'react-native-svg';

/** Micrófono blanco (sobre el círculo del mic). */
export function MicIcon({ size = 24, big }: { size?: number; big?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={big ? 2.3 : 2.4}>
      <Rect x={big ? 8.8 : 9} y={big ? 2.8 : 3} width={big ? 6.4 : 6} height={big ? 11.4 : 11} rx={big ? 3.2 : 3} fill="#fff" />
      <Path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M9 21h6" />
    </Svg>
  );
}

/** Flecha "volver". */
export function ChevronLeftIcon({ size = 24, color = '#1b2a6b' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.2}>
      <Path d="M15 5l-7 7 7 7" />
    </Svg>
  );
}

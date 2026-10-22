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

/** Flecha «siguiente» (la de «volver» al revés). */
export function ChevronRightIcon({ size = 24, color = '#1E6FE8' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.2}>
      <Path d="M9 5l7 7-7 7" />
    </Svg>
  );
}

/** Casa (Inicio). */
export function HomeIcon({ size = 26, active }: { size?: number; active?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 11.2L12 4l9 7.2V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" fill={active ? '#1E6FE8' : '#8c95b2'} />
      <Path d="M9 21v-6h6v6" fill={active ? '#9CC4FF' : '#c3cadb'} />
    </Svg>
  );
}

/** Copa (Logros). */
export function TrophyIcon({ size = 26, active }: { size?: number; active?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M7 3h10v5a5 5 0 01-10 0z" fill={active ? '#F5B301' : '#e8a61a'} />
      <Path d="M10.5 13h3v4h-3z" fill="#d4900f" />
      <Path d="M7.5 19h9v2h-9z" fill="#b97a0b" />
    </Svg>
  );
}

/** Engrane (Padres). */
export function GearIcon({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 8.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm8.5 2.2l-2-.4a6.8 6.8 0 00-.7-1.7l1.2-1.7-1.9-1.9-1.7 1.2a6.8 6.8 0 00-1.7-.7l-.4-2h-2.6l-.4 2a6.8 6.8 0 00-1.7.7L6.9 5l-1.9 1.9 1.2 1.7a6.8 6.8 0 00-.7 1.7l-2 .4v2.6l2 .4c.2.6.4 1.2.7 1.7L5 17.1 6.9 19l1.7-1.2c.5.3 1.1.5 1.7.7l.4 2h2.6l.4-2c.6-.2 1.2-.4 1.7-.7l1.7 1.2 1.9-1.9-1.2-1.7c.3-.5.5-1.1.7-1.7l2-.4z"
        fill="#7c83a0"
      />
    </Svg>
  );
}

/** Papalote: el logo de Kitewise (placeholder hasta que exista el logo final). */
export function KiteIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2l7 8-7 9-7-9z" fill="#FFE45C" />
      <Path d="M12 2v17M5 10h14" stroke="#E8C630" strokeWidth={1.2} />
      <Path d="M12 19c-1 1.5 1 2 0 3.5" stroke="#ffffff" strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/** Altavoz (escuchar). */
export function SpeakerIcon({ size = 24, color = '#E8662B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3}>
      <Path d="M3.5 9.5h3.8L12 5.3v13.4l-4.7-4.2H3.5z" fill={color} />
      <Path d="M15.5 9a4 4 0 010 6M18.3 6.3a7.6 7.6 0 010 11.4" />
    </Svg>
  );
}

/** Signo de pregunta en círculo (ayuda). */
export function HelpIcon({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2a10 10 0 110 20 10 10 0 010-20z" fill="#1E6FE8" />
      <Path d="M9.4 9.3a2.7 2.7 0 015.2.9c0 1.8-2.6 2.2-2.6 3.8" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <Path d="M12 16.6v.4" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" />
    </Svg>
  );
}

/** Micrófono tachado (sin permiso). */
export function MicOffIcon({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}>
      <Rect x={9} y={3} width={6} height={11} rx={3} fill="#fff" />
      <Path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M9 21h6" />
      <Path d="M4 20L20 4" strokeWidth={2.4} />
    </Svg>
  );
}

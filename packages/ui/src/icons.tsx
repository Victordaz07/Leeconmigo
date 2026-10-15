/**
 * Iconos SVG del prototipo aprobado, como componentes. El color se hereda de `currentColor` cuando el icono
 * es de un solo tono; los iconos multicolor traen sus colores (son parte del diseño).
 */
import type { SVGProps } from 'react';

type P = Omit<SVGProps<SVGSVGElement>, 'viewBox'> & { size?: number };

const Svg = ({ size = 24, children, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...rest}>
    {children}
  </svg>
);
const stroke = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const ChevronLeft = ({ strokeWidth = 3.2, ...p }: P) => (
  <Svg {...stroke} stroke="currentColor" strokeWidth={strokeWidth} {...p}><path d="M15 5l-7 7 7 7" /></Svg>
);
export const ChevronRight = ({ strokeWidth = 3.4, ...p }: P) => (
  <Svg {...stroke} stroke="currentColor" strokeWidth={strokeWidth} {...p}><path d="M9 5l7 7-7 7" /></Svg>
);
export const Close = ({ strokeWidth = 3, ...p }: P) => (
  <Svg {...stroke} stroke="currentColor" strokeWidth={strokeWidth} {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>
);
export const Check = ({ strokeWidth = 3.4, ...p }: P) => (
  <Svg {...stroke} stroke="currentColor" strokeWidth={strokeWidth} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>
);
/** Ocultar (`hide`) o mostrar (`show`) el panel lateral. */
export const PanelToggle = ({ mode, strokeWidth = 2.6, ...p }: P & { mode: 'hide' | 'show' }) => (
  <Svg {...stroke} stroke="currentColor" strokeWidth={strokeWidth} {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
    <path d="M9.5 4.5v15" />
    <path d={mode === 'hide' ? 'M16 10l-2 2 2 2' : 'M14 10l2 2-2 2'} />
  </Svg>
);
/** Micrófono blanco (sobre el círculo del mic). */
export const Mic = ({ big, ...p }: P & { big?: boolean }) => (
  <Svg {...stroke} stroke="#fff" strokeWidth={big ? 2.3 : 2.4} {...p}>
    <rect x={big ? 8.8 : 9} y={big ? 2.8 : 3} width={big ? 6.4 : 6} height={big ? 11.4 : 11} rx={big ? 3.2 : 3} fill="#fff" />
    <path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M9 21h6" />
  </Svg>
);
export const Speaker = ({ color = 'currentColor', arcs = 2, ...p }: P & { color?: string; arcs?: 1 | 2 }) => (
  <Svg {...stroke} stroke={color} strokeWidth={2.3} {...p}>
    <path d="M3.5 9.5h3.8L12 5.3v13.4l-4.7-4.2H3.5z" fill={color} />
    <path d={arcs === 2 ? 'M15.5 9a4 4 0 010 6M18.3 6.3a7.6 7.6 0 010 11.4' : 'M15.5 9a4 4 0 010 6'} />
  </Svg>
);
export const Home = (p: P) => (
  <Svg {...p}>
    <path d="M3 11.2L12 4l9 7.2V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" fill="#1E6FE8" />
    <path d="M9 21v-6h6v6" fill="#9CC4FF" />
  </Svg>
);
/** Libro. `outline` añade el contorno de la ficha de historia. */
export const Book = ({ left = '#8B78F0', right = '#6A52D9', outline, leftOpacity, rightOpacity, ...p }: P & { left?: string; right?: string; outline?: string; leftOpacity?: number; rightOpacity?: number }) => (
  <Svg {...p}>
    <path d="M12 6.5C10 5 7 4.4 3 5v13.2c4-.5 7 0 9 1.5z" fill={left} opacity={leftOpacity} />
    <path d="M12 6.5c2-1.5 5-2.1 9-1.5v13.2c-4-.5-7 0-9 1.5z" fill={right} opacity={rightOpacity} />
    {outline && <path d="M12 6.5C10 5 7 4.4 3 5v13.2c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.6-7 0-9 1.5zM12 6.5v13.2" fill="none" stroke={outline} strokeWidth="1.9" strokeLinejoin="round" />}
  </Svg>
);
export const Trophy = (p: P) => (
  <Svg {...p}>
    <path d="M7 3h10v5a5 5 0 01-10 0z" fill="#F5A623" />
    <path d="M7 5H4v1.5A3.5 3.5 0 007.5 10M17 5h3v1.5A3.5 3.5 0 0116.5 10" fill="none" stroke="#F5A623" strokeWidth="2" />
    <path d="M10 13h4v4h-4z" fill="#E08A00" />
    <rect x="7" y="17" width="10" height="4" rx="1.5" fill="#F5A623" />
  </Svg>
);
export const Gear = (p: P) => (
  <Svg {...p}>
    <path d="M12 2l2 2.6 3.2-.6.8 3.2 3 1.4-1.4 3 1.4 3-3 1.4-.8 3.2-3.2-.6L12 22l-2-2.6-3.2.6-.8-3.2-3-1.4 1.4-3-1.4-3 3-1.4.8-3.2 3.2.6z" fill="#8A93AD" />
    <circle cx="12" cy="12" r="3.6" fill="#fff" />
  </Svg>
);
export const Flame = ({ outer = '#FF7A2F', inner = '#FFC658', ...p }: P & { outer?: string; inner?: string }) => (
  <Svg {...p}>
    <path d="M12 2c1 4 5 5.5 5 11a5 5 0 01-10 0c0-2.5 1.2-4 2.5-5 0 2 1 3 2 3-1-3 0-6 .5-9z" fill={outer} />
    <path d="M12 12c.5 2 2.5 2.5 2.5 5a2.5 2.5 0 01-5 0c0-1.4.8-2.2 1.6-2.8.2 1 .6 1.3.9 1.3-.3-1.3-.2-2.4 0-3.5z" fill={inner} />
  </Svg>
);
export const Star = ({ fill = '#F5B301', ...p }: P & { fill?: string }) => (
  <Svg {...p}><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" fill={fill} /></Svg>
);
export const Clock = ({ color = '#fff', filled, strokeWidth = 2.4, ...p }: P & { color?: string; filled?: boolean }) => (
  <Svg {...stroke} stroke={color} strokeWidth={strokeWidth} {...p}>
    <circle cx="12" cy="12" r="8.5" fill={filled ? color : 'none'} fillOpacity={filled ? 0.18 : undefined} />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const Target = (p: P) => (
  <Svg fill="none" stroke="#fff" strokeWidth="2.4" {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="#fff" />
  </Svg>
);
export const Leaf = (p: P) => (
  <Svg {...p}>
    <path d="M5 19C5 10 10 4 20 4c0 10-6 15-15 15z" fill="#fff" />
    <path d="M5 19L14 10" stroke="#27A75E" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);
export const Sun = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="5" fill="#fff" />
    <g stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></g>
  </Svg>
);
export const Mountain = (p: P) => (
  <Svg {...p}>
    <path d="M2 20l7.5-13 4 6.5 2.5-3.5L22 20z" fill="#fff" />
    <path d="M9.5 7l2 3.4-2-1-2 1z" fill="#C9B8FF" />
  </Svg>
);
export const Crown = (p: P) => (
  <Svg {...p}><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="#fff" /></Svg>
);
/** "Aventura": montañas con sol, para la ficha de la historia. */
export const Adventure = (p: P) => (
  <Svg {...p}>
    <path d="M3 20l6.5-11 3.5 5.5 2.5-3.5L21 20z" fill="#E8662B" />
    <circle cx="17" cy="6" r="2.2" fill="#F5A623" />
  </Svg>
);
export const ImagePlaceholder = ({ size = 32, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8A93AD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5" />
  </svg>
);
/** Flecha "leer desde aquí" del botón "Léeme el comienzo". */
export const ReadFrom = (p: P) => (
  <Svg {...stroke} stroke="#6A52D9" strokeWidth={2.4} {...p}>
    <path d="M5 12h9M10 7l5 5-5 5" />
    <path d="M19 5v14" />
  </Svg>
);
/** Lupa de buscar (Biblioteca). */
export const Search = ({ strokeWidth = 2.4, ...p }: P) => (
  <Svg {...stroke} stroke="currentColor" strokeWidth={strokeWidth} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.3-4.3" />
  </Svg>
);
/** Deslizadores de filtro (Biblioteca). */
export const Filter = ({ strokeWidth = 2.4, ...p }: P) => (
  <Svg {...stroke} stroke="currentColor" strokeWidth={strokeWidth} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
    <circle cx="9" cy="7" r="2" fill="var(--icon-bg,#fff)" />
    <circle cx="16" cy="12" r="2" fill="var(--icon-bg,#fff)" />
    <circle cx="10" cy="17" r="2" fill="var(--icon-bg,#fff)" />
  </Svg>
);

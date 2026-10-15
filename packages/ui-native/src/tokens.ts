/**
 * Tokens de diseño de Lee Conmigo para React Native (docs/05). Mismos valores que `packages/ui/src/styles/tokens.css`
 * (la app web), con los mismos nombres en camelCase: `--color-ink-soft` → `colors.inkSoft`.
 *
 * Archivo puro (sin importar React Native) para poder probarlo en Node: `tests/tokens.test.ts` falla si un color o
 * degradado de `tokens.css` no está aquí con el mismo valor. Si se cambia un color, se cambia en los dos.
 */

export const colors = {
  ink: '#1e2340', // texto principal (INK)
  inkSoft: '#3a4062',
  inkMute: '#4a5070',
  muted: '#7c83a0',
  muted2: '#8c95b2',
  navy: '#1b2a6b', // titulares
  app: '#f6f8fe', // fondo de la app
  appAlt: '#f6f7fb',
  cream: '#fffdf8', // tarjetas de lectura
  creamDeep: '#fff9ee', // pantalla de pregunta
  bubble: '#fffdf6', // globos de texto sobre el cómic
  line: '#e3e8f4',
  track: '#e3e7f0',
  track2: '#e2e7f2',
  chip: '#eef1f8',
  slate300: '#c3cadb',
  slate400: '#a7b0c8',
  slate500: '#98a1b8',
  outline: '#dde1ec',
  stage: '#14161c', // ---- Marca / acento primario (azul) ----
  brand: '#1e6fe8',
  brandLight: '#4b97ff',
  brandDark: '#1760e0',
  brandDeep: '#1452b0', // "borde" inferior de botones físicos
  brandLedge: '#1249a8',
  brandStrong: '#1e5bc6',
  brand50: '#eaf4ff',
  brand100: '#dcebff',
  brand200: '#cfe3ff',
  brandLedgeSoft: '#b2d0fa', // ---- Éxito / lectura correcta (verde) ----
  ok: '#22a95c',
  okMid: '#2db36a',
  okLight: '#6be39e',
  okDark: '#27a75e',
  okTint: '#d6f3e1', // ---- Alerta suave, pausa larga, ayuda (ámbar / naranja) — nunca rojo de error ----
  warn: '#f0a020',
  warn2: '#f5a623',
  warnLight: '#ffc658',
  warnTint: '#fff1c2',
  orange: '#e8662b',
  orangeDeep: '#c4531f',
  focus: '#ffe45c', // palabra en foco / ayuda abierta
  focusTint: '#fff1b8',
  focusLedge: '#e8c630',
  gold: '#f5b301', // ---- Violeta (biblioteca, repaso, eco) ----
  violet: '#6a52d9',
  violetDeep: '#5a45c8',
  violetMid: '#7b5ce6',
  violetLight: '#b79bff',
  violet50: '#ede8ff',
  violet100: '#f2efff',
  violetLedge: '#c3b6f2',
  echo: '#e6eeff',
  echoLine: '#7faeff', // ---- Decorativos (avatar, racha, insignias) ----
  coral: '#ff5e7e',
  coralDeep: '#f0445a',
  sun: '#ff9f43', // ---- Panel de desarrollo (nunca forma parte de la experiencia del niño) ----
  dev: '#262d40',
  dev2: '#323a50',
  dev3: '#1c2233',
  dev4: '#171b27',
  devLine: '#3c4560',
  devInk: '#e7eaf3', // ---- Radios (docs/05: tarjetas 16–30px, pastillas 999px) ----
} as const;

export type ColorName = keyof typeof colors;

/** Degradado lineal: ángulo CSS (180 = de arriba hacia abajo) y colores con su posición opcional (0–1). */
export interface Gradient {
  angle: number;
  colors: readonly string[];
  locations?: readonly number[];
}

/** Los degradados lineales de `tokens.css` (los radiales de fondo, `*-glow`, se resuelven en cada pantalla). */
export const gradients = {
  green: { angle: 180, colors: ['#6be39e', '#22a95c'] },
  greenDiag: { angle: 160, colors: ['#6be39e', '#22a95c'] },
  greenChip: { angle: 180, colors: ['#5fd68f', '#27a75e'] },
  violet: { angle: 180, colors: ['#b79bff', '#7b5ce6'] },
  violetDiag: { angle: 160, colors: ['#b79bff', '#7b5ce6'] },
  brand: { angle: 180, colors: ['#4b97ff', '#1e6fe8'] },
  brandCta: { angle: 180, colors: ['#4b97ff', '#1e6fe8', '#1760e0'], locations: [0, 0.55, 1] },
  brandDot: { angle: 180, colors: ['#4b97ff', '#1760e0'] },
  blueDiag: { angle: 160, colors: ['#6fc0ff', '#1e80e8'] },
  coralDiag: { angle: 160, colors: ['#ff8a3d', '#ff5e7e'] },
  sunDiag: { angle: 160, colors: ['#ffd66b', '#ff9f43'] },
  amberDiag: { angle: 160, colors: ['#ffc658', '#f08a10'] },
  redDiag: { angle: 160, colors: ['#ff8a8a', '#f0445a'] },
  goldDiag: { angle: 160, colors: ['#ffd66b', '#f5a623'] },
  sky: { angle: 180, colors: ['#eaf4ff', '#d4e6ff'] },
  skyAction: { angle: 180, colors: ['#eaf4ff', '#cfe3ff'] },
  peach: { angle: 180, colors: ['#fff1e6', '#ffd9c2'] },
  lilac: { angle: 180, colors: ['#f1eeff', '#dcd3fa'] },
  lilacBtn: { angle: 180, colors: ['#ede8ff', '#d9cffb'] },
  lemon: { angle: 180, colors: ['#fff6cf', '#ffe88a'] },
  cta: { angle: 180, colors: ['#ffe36b', '#ffc21a'] },
  tileLilac: { angle: 180, colors: ['#eae5ff', '#d8cffb'] },
  tileBlue: { angle: 180, colors: ['#e1eeff', '#c9deff'] },
  tilePeach: { angle: 180, colors: ['#ffebdd', '#ffd6bd'] },
  micOk: { angle: 180, colors: ['#5edc95', '#1fa85a'] },
  micIdle: { angle: 180, colors: ['#c3cadb', '#98a1b8'] },
  micWarn: { angle: 180, colors: ['#ffc658', '#f09a10'] },
  barLow: { angle: 180, colors: ['#9cc8ff', '#4b97ff'] },
  nav: { angle: 180, colors: ['#ffffff', '#eef2fc'] },
  rail: { angle: 180, colors: ['#ffffff', '#e9eefb'] },
  panel: { angle: 180, colors: ['#ffffff', '#f3f6ff', '#e9eefb'], locations: [0, 0.45, 1] },
  panelSelect: { angle: 180, colors: ['#ffffff', '#f2f6ff', '#e8effd'], locations: [0, 0.55, 1] },
} as const satisfies Record<string, Gradient>;

export type GradientName = keyof typeof gradients;

/** Radios (docs/05: tarjetas 16–30 px, pastillas 999). */
export const radius = {
  tile: 20,
  card: 24,
  panel: 30,
  pill: 999,
} as const;

/**
 * Sombras para la propiedad `boxShadow` de React Native (mismos valores que `--shadow-*`, con `rgba()` porque React Native
 * no entiende `rgb(r g b / a)`). Solo las que usan los componentes nativos; se agregan a medida que se migran pantallas.
 */
export const shadows = {
  card: '0px 1px 0px #e3e8f4, 0px 10px 26px rgba(30, 35, 64, 0.08)',
  chip: '0px 4px 12px rgba(30, 35, 64, 0.08)',
  round: '0px 4px 10px rgba(30, 35, 64, 0.12)',
  soft: '0px 2px 6px rgba(30, 35, 64, 0.08)',
  brandGlow: '0px 14px 26px rgba(30, 111, 232, 0.35)',
} as const;

/**
 * Tipografías (docs/05): Andika para LEER, Nunito para la interfaz. En React Native cada peso es una familia distinta
 * (Android no inventa negritas de una fuente cargada a mano), así que se elige la familia por peso, nunca `fontWeight`.
 * Los nombres son los que registra `@expo-google-fonts` (ver `fonts.ts` de la app).
 */
export const fontFamily = {
  read: { regular: 'Andika_400Regular', bold: 'Andika_700Bold' },
  ui: {
    regular: 'Nunito_400Regular',
    semibold: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
    extrabold: 'Nunito_800ExtraBold',
    black: 'Nunito_900Black',
  },
} as const;

/** Duraciones de animación en ms (docs/05: 0.2–0.9 s; nunca parpadeos agresivos). */
export const durations = {
  fast: 200,
  base: 300,
  slow: 500,
  page: 550,
  ring: 1600,
} as const;

/** Altura mínima de cualquier cosa que se toca (docs/06: controles grandes). */
export const minTouch = 56;

/**
 * Banderas de comportamiento para los puntos de docs/09-OPEN-DECISIONS.md que afectan a la UI del niño.
 * Cada una implementa lo que hace el prototipo aprobado y queda TEMPORAL hasta que se decida.
 * Cambiarlas no requiere tocar componentes.
 */
export const FLAGS = {
  /**
   * docs/09 #4: el prototipo muestra "Precisión %" al niño en Progreso y en el fin de la historia.
   * false = no se muestra en ningún lado (solo quedaría para el panel de padres con PIN).
   */
  showAccuracyToChild: true,
  /**
   * TEMPORAL: mientras no haya biblioteca real, Inicio completa la cuadrícula "Mis historias" con las portadas
   * de relleno del prototipo (no se pueden abrir). false = solo las historias reales.
   */
  showDemoStories: true,
} as const;

/**
 * Herramientas de desarrollo: panel `DEV` (simula la lectura, salta de pantalla), saltos por URL (`?screen=`) e historias de
 * prueba. Siempre activas en `npm run dev`. En una compilación solo si se construye con `VITE_DEV_TOOLS=1` (despliegues de
 * PRUEBA para revisar el flujo en la tablet mientras no hay voz real). La versión para niños se construye SIN esa variable.
 */
export const DEV_TOOLS: boolean = import.meta.env.DEV || import.meta.env.VITE_DEV_TOOLS === '1';

/**
 * docs/09 #6/#7: usar `RealReadingEngine` (Whisper 100% local, ver `packages/speech-engine/
 * whisper-speech-engine.ts`) en vez de `FakeReadingEngine`. Primera integración, sin probar en
 * tablet real todavía — por eso empieza detrás de un flag y no reemplaza `FakeReadingEngine` por
 * defecto. Se activa con `VITE_REAL_VOICE=1` al compilar.
 */
export const REAL_VOICE: boolean = import.meta.env.VITE_REAL_VOICE === '1';

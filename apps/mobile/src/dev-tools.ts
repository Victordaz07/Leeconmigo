/**
 * ¿Mostrar las herramientas de desarrollo (panel de simulación de voz, lista DEV)?
 *
 * Siempre en desarrollo. En un APK de prueba solo si se compila con `EXPO_PUBLIC_DEMO=1` (`npm run apk:demo`): mientras
 * la voz real no exista (RN-07), la lectura se maneja con el panel de simulación. Un build para la tienda nunca lleva
 * esta variable, así que los niños nunca ven el panel (docs/04).
 */
export const SHOW_DEV_TOOLS: boolean = __DEV__ || process.env.EXPO_PUBLIC_DEMO === '1';

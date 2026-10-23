# VZ-08 · cierre al iniciar Leer juntos · 2026-10-23

Victor informa: entrar en un cuento → Leer juntos → unos dos segundos escuchando → la aplicación se cierra. No hay acceso al Fold, a su logcat ni a un emulador Android en este entorno. No se ha identificado con certeza la excepción de ese dispositivo. No atribuir este cierre a Whisper ni a la prueba del audio del taller: el recorrido indicado es el lector, cuyo proveedor inicial es Android.

## Cambios 0.2.1 / código 5

El plugin reproducible de `expo-speech-recognition@57.0.0` ahora protege la consulta de capacidades publicada en el hilo principal: los errores de creación/consulta rechazan la promesa para permitir la recuperación de la interfaz. Sus callbacks usan el ejecutor principal, sin crear un ejecutor privado por consulta. La limpieza previa al inicio también entra en el bloque de error del servicio.

La captura publica sus indicadores entre hilos (`@Volatile`), separa el objeto antes de detenerlo, libera un grabador aunque `stop` falle por no estar inicializado, y contiene `IllegalStateException` en una lectura interrumpida. El código anterior dejaba escapar esos errores. Son defectos de contención comprobados con dobles de ciclo de vida; **no una reproducción física del fallo del Fold**.

La primera hipótesis sobre `SpeechRecognizer.destroy` desde un hilo secundario no se considera causa demostrada. La implementación AOSP consultada (`SpeechRecognizerImpl.destroy`) encola su trabajo. Usar el hilo principal sigue siendo una mejora de coherencia, no evidencia de la excepción del usuario.

Se incorpora un informe local del último cierre Java no controlado, visible únicamente en la prueba de voz de Ajustes (Modo padres). Guarda como máximo 2.400 caracteres: versión, clases, métodos y números de línea, incluyendo hasta tres causas. Omite expresamente mensajes de excepciones, pila JavaScript, voz, texto reconocido, identidad del niño y datos del cuento. Delega exactamente una vez al manejador original de Android; no oculta el cierre ni envía datos. Los cierres por falta de memoria, señales nativas o decisión del sistema pueden no generar informe. Se conserva un único registro, sustituido por el siguiente fallo; borrar datos de la app lo elimina.

Se mantienen la guarda on-device, el requisito de idioma instalado, la alternativa Whisper explícita, la ausencia de INTERNET y de archivos de audio, las dos herramientas de Ajustes, lectura manual, pronunciación por palabra y zoom.

## Verificación

- Harness JVM que compila y ejecuta **el archivo Kotlin real parcheado**, con dobles de Android, en `scripts/check-native-speech.py`. Una lectura bloqueada se interrumpe con una excepción, se espera el fin del hilo mediante `join`, se comprueba la liberación y se repite la parada. También falla la inicialización del grabador. La variante anterior sin contención de lectura falla; la corregida pasa. Es inyección de fallos determinista, no una medición del comportamiento del micrófono físico.
- El mismo harness verifica que el informe no incluya mensajes privados de una excepción ni su causa y que se delegue exactamente una vez, incluso tras instalar dos veces.
- Regresión JS de compatibilidad con módulo antiguo, error al consultar diagnóstico y plataforma web; prueba de idempotencia del plugin ampliada.
- Compilación Kotlin release aprobada; 1.991 pruebas/135 archivos, TypeScript y lint correctos. Ambos accesos de pruebas de Ajustes ES/EN conservados en cuatro tamaños por idioma. La descarga y verificación final se registrarán al publicar.

## Prueba física pendiente

Instalar 0.2.1 encima de 0.2.0. Abrir un cuento y Leer juntos, leer durante 30 segundos y hacer una pausa; probar Detener/Reanudar, ayuda por palabra y salir/volver. Repetir en la prueba del micrófono, primero Android y después Whisper si se desea. Si vuelve a cerrarse, reabrir → Padres → Ajustes → Probar el micrófono y compartir la sección «Último cierre inesperado» si aparece. No se solicita grabar ni subir voz. El informe nuevo no puede recuperar retroactivamente el cierre ocurrido con 0.2.0.

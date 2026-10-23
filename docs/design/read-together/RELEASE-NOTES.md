Kitewise 0.2.1 · estabilidad al iniciar Leer juntos.

Se protegen errores nativos de inicio y parada del reconocedor Android y del micrófono. Los fallos de consulta de idiomas vuelven a la interfaz en vez de escapar del hilo principal. Un micrófono que no se inicializa ya no aparenta haber arrancado: se devuelve el error y se libera. También se contienen errores de lectura durante la parada.

La prueba del micrófono de Ajustes conserva Android/Whisper y añade, si existe, un informe técnico local del último cierre inesperado. Incluye únicamente versión, clases, métodos y líneas del programa: nunca mensajes de excepción, transcripciones ni audio. No se envía automáticamente. Puede compartirse una captura para identificar el fallo si persiste. No detecta todos los tipos de cierre del sistema.

Se mantienen todas las ilustraciones, zoom, lectura manual, pronunciación al tocar palabras y ambas herramientas de pruebas en Ajustes. Reconocimiento exclusivamente local, sin permiso INTERNET ni audio guardado.

Verificación: pruebas del código Kotlin de captura con fallos de ciclo de vida inyectados y comprobación de privacidad del informe; compilación Android release, suite completa y TypeScript. No hay acceso al Fold ni a su logcat: la causa exacta del cierre informado y su resolución requieren confirmación en el teléfono.

Instala Kitewise-lectura.apk encima de la versión anterior para conservar tus datos. Versión 0.2.1 / código 5, mismo paquete y llave de pruebas de Expo. Android 7 o posterior; Android 13+ e idioma instalado para el reconocedor local del sistema. Incluye Whisper sin servidor de desarrollo. SHA-256 adjunto. Prueba familiar; no publicación en Google Play.

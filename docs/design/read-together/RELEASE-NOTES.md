Kitewise 0.2.2 · permiso del micrófono y reporte accesible.

Prueba de voz muestra siempre el estado del permiso, Conceder permiso, Abrir ajustes de Android, Ver reporte y Compartir reporte. Si Android bloqueó nuevas solicitudes, permite concederlo desde sus ajustes. Al volver se actualiza el estado.

Las solicitudes del wrapper se ejecutan en el hilo de interfaz. Android y Whisper comparten el permiso: primero comprueban si ya está concedido. Una solicitud sin respuesta deja de bloquear la interfaz; los reintentos no abren diálogos duplicados y una concesión tardía no reactiva una captura cancelada.

El reporte local ya no depende de que se haya registrado una excepción Java. Incluye versión, códigos de las últimas etapas y salidas que Android haya registrado (motivo/estado/fecha). No incluye voz, transcripciones, mensajes de excepciones ni trazas del sistema. Solo se comparte si el adulto pulsa Compartir reporte y lo envía desde el menú de Android.

Se conservan lectura manual, pronunciación por palabra, ilustraciones/zoom y ambas herramientas de Ajustes. Sin permiso INTERNET, audio guardado ni reconocimiento en la nube.

Verificación: 2.004 pruebas/137 archivos, TypeScript/lint, módulo Kotlin release, harness del código nativo con fallos inyectados y metadata Android, controles/reporte ES/EN en cuatro tamaños por idioma. Sin acceso al Fold: aún hay que confirmar el diálogo y si esta actualización resuelve su cierre específico.

Instala el APK encima del anterior para conservar datos. Versión 0.2.2 / código 6, mismo paquete y certificado de pruebas. Android 7+; Android 13+ e idioma instalado para reconocimiento del sistema. Whisper incluido. Descarga con SHA-256 adjunto. Prueba familiar, no publicación en Google Play.

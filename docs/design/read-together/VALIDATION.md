# Validación de código · 23 de octubre de 2026

- `npm test`: **1.987 pruebas / 134 archivos**, correctas. Incluye comparador conservador, controlador, puente Android inyectado, exclusión global de micrófono, parche nativo idempotente, carga/cancelación Whisper y regresión del consumidor antiguo. La prueba de Whisper usa PCM sintético y un reconocedor simulado; no es un benchmark acústico.
- `npm run typecheck`: todos los workspaces correctos. Lint de los archivos modificados: cero errores y avisos.
- Expo prebuild Android correcto. `:expo-speech-recognition:compileReleaseKotlin` correcto con el endurecimiento de privacidad aplicado.
- Puente ES/EN completos: 10+10 fragmentos; mapa ES/EN completos: 47+44 fragmentos; cuatro ventanas por historia, palabras/TTS simulado, reanudación, tres preguntas por recorrido, repaso y cierre guardado.
- `scripts/read-together-smoke.mjs`: ES/EN × dos preferencias de perfil × cinco tamaños (360×800, 720×800, 800×720, 844×390, 1280×800), fallo cerrado de voz web, alternativa local, recuperación manual, controles ≤60 dp visibles, pronunciación simulada conservada y **cero invocaciones de SpeechRecognition de navegador**; cero errores JavaScript. La prueba no simula disponibilidad Android real.
- `scripts/voice-tools-smoke.mjs`: ambos accesos reales de Ajustes conservados, Android/Whisper y modelos ES/EN comprobados; ocho tamaños/idiomas del laboratorio sin desbordamiento. No se mide audio físico.
- `scripts/illustration-zoom-smoke.mjs`: doce casos táctiles ES/EN con pellizco/arrastre/ajuste/cambio de orientación.
- `npm run test:native-layout`: 168 portadas con Yoga nativo en doce tamaños.

APK 0.2.0/código 4 publicado y descargado completo: HTTPS 200, checksum/digest de GitHub coincidentes, certificado igual a 0.1.2, sin permiso INTERNET, cuatro ABIs, 169 recursos, 25 ediciones, lector nuevo y guarda nativa comprobados. CI 39918040689 aprobado desde d407328 en 31m27s. `APK-VERIFICATION.json` registra la evidencia y la descarga definitiva r3.

**No probado aún en dispositivo:** permiso/micrófono/servicio e idiomas instalados del Fold, TTS audible, velocidad/precisión con Noah, ruido/TV/otros lectores, batería/calor y continuidad al plegar durante captura real. La compilación y los mocks no sustituyen esas pruebas. Prueba de voz de Ajustes se conserva precisamente para comprobarlas y seguir depurando.


## Actualización VZ-08 · 0.2.1 / código 5

1.991 pruebas/135 archivos, TypeScript y lint correctos. Compilación Kotlin release aprobada y regresión JVM del archivo Kotlin real: parada interrumpida, repetida, rechazo de grabador no inicializado, liberación y redacción/delegación del informe local. Fuente limpia del registro produce exactamente el mismo parche. Ambos accesos de Ajustes ES/EN conservados en cuatro tamaños por idioma. CI 40015852789 aprobado desde 0a34584; APK descargado/verificado con mismo certificado/paquete, SHA-256/digest GitHub, 169 recursos, 25 ediciones y diagnóstico local presente. Detalles en `CRASH-FIX.md` y `CRASH-FIX-VERIFICATION.json`. Sin dispositivo/logcat: no se afirma que el cierre específico del Fold esté resuelto ni que la inyección JVM reproduzca su causa.


## VZ-09 · 0.2.2 / código 6

2.004 pruebas/137 archivos, TypeScript/lint, Kotlin release/harness correctos. Puerta de permisos, concurrencia/bloqueo/plazos/concesión tardía, etapas locales y proyección de metadata Android; no diálogo físico. Controles y reporte sin excepción Java, intento previo y ambos accesos de Ajustes ES/EN/4 tamaños, sin desbordamiento. CI 40023754028 aprobado desde 2232ad5. APK descargado HTTP 200 y verificado: mismo certificado/paquete, checksum/digest GitHub, 169 recursos/25 ediciones, nuevas funciones y UI dentro del APK. Evidencias `PERMISSION-VERIFICATION.json` y `PERMISSION-TOOLS.json`. 0.2.1 no resolvió el caso; confirmación de diálogo/causa/resolución física pendiente.

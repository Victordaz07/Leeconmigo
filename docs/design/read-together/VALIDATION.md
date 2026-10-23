# Validación de código · 23 de octubre de 2026

- `npm test`: **1.987 pruebas / 134 archivos**, correctas. Incluye comparador conservador, controlador, puente Android inyectado, exclusión global de micrófono, parche nativo idempotente, carga/cancelación Whisper y regresión del consumidor antiguo. La prueba de Whisper usa PCM sintético y un reconocedor simulado; no es un benchmark acústico.
- `npm run typecheck`: todos los workspaces correctos. Lint de los archivos modificados: cero errores y avisos.
- Expo prebuild Android correcto. `:expo-speech-recognition:compileReleaseKotlin` correcto con el endurecimiento de privacidad aplicado.
- Puente ES/EN completos: 10+10 fragmentos; mapa ES/EN completos: 47+44 fragmentos; cuatro ventanas por historia, palabras/TTS simulado, reanudación, tres preguntas por recorrido, repaso y cierre guardado.
- `scripts/read-together-smoke.mjs`: ES/EN × dos preferencias de perfil × cinco tamaños (360×800, 720×800, 800×720, 844×390, 1280×800), fallo cerrado de voz web, alternativa local, recuperación manual, controles ≤60 dp visibles, pronunciación simulada conservada y **cero invocaciones de SpeechRecognition de navegador**; cero errores JavaScript. La prueba no simula disponibilidad Android real.
- `scripts/illustration-zoom-smoke.mjs`: doce casos táctiles ES/EN con pellizco/arrastre/ajuste/cambio de orientación.
- `npm run test:native-layout`: 168 portadas con Yoga nativo en doce tamaños.

APK: preparación/publicación en curso. Se verificará descarga, checksum, certificado igual a 0.1.2, permisos, cuatro ABIs y los 169 recursos originales antes de compartir enlace.

**No probado aún en dispositivo:** permiso/micrófono/servicio e idiomas instalados del Fold, TTS audible, velocidad/precisión con Noah, ruido/TV/otros lectores, batería/calor y continuidad al plegar durante captura real. La compilación y los mocks no sustituyen esas pruebas. Prueba de voz de Ajustes se conserva precisamente para comprobarlas y seguir depurando.

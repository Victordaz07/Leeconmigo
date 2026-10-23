# Leer juntos · primera versión de prueba familiar

Victor autorizó implementar el motor tras VZ-01 y pidió conservar la **Prueba de voz de Ajustes** para futuras comparaciones. El objetivo es acompañar la lectura y mantener la ayuda por palabra, sin convertir el reconocimiento en examen de pronunciación.

## Qué incorpora

- Todas las ediciones preparadas usan el lector nuevo, también si el padre desactivó la lectura libre; el valor del perfil se conserva y la escucha sigue requiriendo una elección explícita. En cada cuento: **Leer juntos** o el comienzo manual de siempre. Micrófono opcional; pausa/reanudación de 48 dp en el pie existente. Arte, zoom, letra, preguntas, repaso y anclas conservados. El niño decide cuándo pasar: reconocer texto no cambia la página automáticamente.
- Android local con resultados provisionales y finales, mediante `expo-speech-recognition` **57.0.0**, fijado al SDK auditado. Se exige Android API 33+, fábrica `createOnDeviceSpeechRecognizer` e idioma instalado en ese servicio. Nunca se recurre al reconocedor genérico ni a la nube. Android/iOS anteriores pueden usar Whisper local; el navegador falla cerrado.
- Si esa escucha no está disponible, **Probar otra escucha local** activa Whisper Base ya incluido en el APK; **Seguir sin micrófono** conserva la navegación. No se descargan modelos ni se sube audio. La disponibilidad/idiomas del servicio del Fold se comprobarán físicamente.
- **Ajustes → Probar el micrófono → Prueba de voz** sigue existiendo. **Probar el audio del taller** también se conserva para pruebas de sonido; es una herramienta distinta y no usa micrófono. Selector Android/Whisper, ES/EN, Whisper Rápido/Preciso, frases intercambiables, hipótesis provisionales Android y resultados finales temporales. Conserva nivel/cola/tiempo de inferencia Whisper; los tiempos de inferencia Android se indican como no disponibles. No se persisten transcripciones ni audio. No confundir los porcentajes de cobertura del laboratorio adulto con precisión acústica o calificación infantil.

## Motor y seguridad de estado

`ReadingFollower` es lógica pura, independiente del proveedor. Compara en una ventana próxima al cursor; un resultado provisional reemplaza al anterior y no confirma cobertura. Solo los índices alineados del final se confirman: una omisión sigue sin confirmar. Una palabra final aislada y distante no acredita toda una frase. Se conservan repeticiones intencionales y se toleran tartamudeos, relectura próxima y una omisión interna; la tolerancia fonética/numérica más amplia sigue pendiente de calibración. Las revisiones pueden retroceder sin borrar cobertura confirmada. No se muestra rojo, porcentaje ni error del niño.

`ReadTogetherController` coordina página, intención, bloqueo, generación y tiempo; `useReadTogether` añade ciclo de vida. La UI importa la sesión, no SDKs. El proveedor sigue `SpeechEngine`/`ReadingVoice`. Se arregla además el consumidor `RealReadingEngine` experimental para que no rellene huecos ni acepte resultados mientras muestra ayuda; el lector preparado usa el controlador nuevo, no ese prototipo antiguo.

Una exclusión global del micrófono abarca lector y laboratorio, incluso permiso/carga/parada pendientes. Detener invalida resultados sincrónicamente; el siguiente inicio espera el cierre anterior. Android espera `abort`/`end`; si falta confirmación, impide nuevas capturas hasta reiniciar la app. Los errores quedan retenidos hasta un reintento explícito o un cambio de proveedor: volver del fondo/cambiar de fragmento no repite solicitudes de permiso. Una identidad de ejecución reinicia cobertura incluso al repetir un cuento de un solo fragmento. Las generaciones cancelan permisos/modelos/transcripciones Whisper atrasados. Whisper carga ambos modelos antes de abrir captura, cancela trabajos y espera la cola activa al detener. Su VAD ya no aprende la voz inmediata como ruido inicial.

La ayuda cierra la puerta de aceptación y espera la parada antes del TTS; al cerrar espera `Speech.stop()` y 250 ms de cola acústica. Se detiene también para ilustración ampliada, preguntas, repaso, descanso, salida y segundo plano. Girar/plegar conserva la cobertura si sigue el mismo fragmento.

## Tiempo y persistencia

Mientras **Leer juntos** está seleccionado, incluso en carga, pausa o error, no se acredita el reloj libre por tener la pantalla abierta. Los finales que aportan palabras nuevas pueden acreditar duración de voz del proveedor; Whisper usa intervalos Silero (centisegundos convertidos a ms), Android solicita tiempos de palabras en API 34+. Sin tiempos, solo intervalos cortos entre hipótesis consecutivas alineadas. Tope de dos segundos por palabra nueva y diez segundos por resultado; repeticiones ya confirmadas, silencio, ayuda y errores no suman. Es evidencia temporal conservadora, no medición clínica de fluidez. El manual conserva su estimación anterior con límites; ayudas/zoom la suspenden. El resumen diferencia `voice`, `mixed`, `free`, `simulated` cuando corresponde. Completar manualmente un fragmento sigue siendo confirmación del lector, no prueba de cobertura ASR.

**D1:** muestras solo en memoria. El APK continúa sin permiso INTERNET y sin SDK de analítica. Un plugin reproducible de Expo endurece el wrapper fijado: guarda nativa adicional de fábrica local, elimina el log de transcripciones/opciones y evita incluso crear el archivo PCM temporal cuando no se solicita persistencia. Se aplica a la dependencia en prebuild, nunca editando los directorios Android generados. Cambiar versión/patrones de upstream bloquea la compilación hasta revisar el parche.

## Validación y límites

Pruebas del comparador, controlador, puente Android inyectado, exclusión de micrófono, endurecimiento idempotente y ciclo Whisper (incluido trabajo cancelado con PCM sintético). Estas pruebas verifican flujo/seguridad; **no miden la precisión de un reconocedor con una voz real**. TypeScript/lint, regresión de ambos cuentos completos ES/EN, veinte casos de tamaño/idioma/perfil de recuperación manual sin usar ASR de navegador, zoom táctil y compilación Kotlin release. Resultados exactos de la entrega en `VALIDATION.md` y `APK-VERIFICATION.json` al terminar.

Pendiente: Fold físico, habla infantil real, acentos, ruido/TV/hermanos, latencia y batería; comparación Moonshine/otros; dictado de números y contracciones separadas por ASR; asistencia fonética. Los umbrales son conservadores y aún no calibrados con Noah. No se reconoce quién habla: un adulto leyendo el mismo texto también puede coincidir. El servicio Android puede cerrar una sesión durante una pausa: se muestra **En pausa** y se reanuda con el botón, sin bucle automático de reinicios. La app no bloquea al niño por reconocimiento incierto.

## Prueba de mañana (sin grabar voz)

1. Actualizar instalando el APK sobre la app actual; conservar datos. No desinstalar.
2. Padres → Ajustes → **Probar el micrófono** (pantalla Prueba de voz). Android, Español: Empezar, leer una frase, repetirla, hacer una pausa y Detener. Probar English. Si no está disponible, elegir Whisper y Preciso; esperar **Escuchando** antes de leer. Las frases aparecen completas y el laboratorio muestra lo entendido.
3. Entrar al puente y elegir **Leer juntos**. Probar lectura natural, repetir una frase, omitir una palabra, tocar una palabra para escucharla y cerrar la ayuda. La pronunciación de la app no debe colorear palabras nuevas. Pasar voluntariamente con ›.
4. Pausar/reanudar, ampliar ilustración, cambiar de fragmento, girar, abrir/cerrar el Fold y mandar la app al fondo. La escucha debe respetar cada pausa y nunca trasladar una frase antigua al fragmento nuevo.
5. Si Android no está disponible, **Probar otra escucha local**; o continuar sin micrófono. En el laboratorio, comparar también Whisper Rápido/Preciso. No es necesario habilitar red para Whisper.
6. Anotar solo motor, idioma, fragmento, demora aproximada y comportamiento observado. No grabar/subir la voz de Noah. Estos resultados decidirán el siguiente ajuste; no se promete precisión perfecta por haber pasado las pruebas de código.

## Atribución de la dependencia nueva

`expo-speech-recognition` 57.0.0, Copyright (c) 2024 jamsch, licencia MIT. Se conserva el aviso íntegro en [SPEECH-RECOGNITION-LICENSE.txt](SPEECH-RECOGNITION-LICENSE.txt). Los cambios locales del wrapper se describen arriba y en `apps/mobile/plugins/local-speech.js`.

## Actualización de estabilidad · 0.2.1 / código 5

[Descargar Kitewise 0.2.1 para Android](https://github.com/Victordaz07/Leeconmigo/releases/download/apk-lectura-2026-10-23-voz-estable-r2/Kitewise-lectura.apk) · 335,567,138 bytes. Instalar encima de la versión anterior sin desinstalar para conservar datos.

Contiene protección de errores de inicio/parada nativos, rechazo inmediato del micrófono no inicializado y un diagnóstico técnico local mínimo en Ajustes → Probar el micrófono. No guarda voz, transcripciones ni mensajes de excepción. Detalles y prueba física pendiente: [CRASH-FIX.md](CRASH-FIX.md).

CI 40015852789 aprobado desde 0a34584; descarga HTTP 200, checksum/digest GitHub, mismo certificado/paquete, alineación de 16 KB, cuatro arquitecturas, 169 recursos y 25 ediciones comprobados. Diagnóstico nativo y su interfaz incluidos en el APK. SHA-256: `0e3daa28b5a3d9830d0517800312822bd68bc11e72c169c6a623ff4dd3fb3b99`. Evidencia: [CRASH-FIX-VERIFICATION.json](CRASH-FIX-VERIFICATION.json). El primer intento `voz-estable` fue cancelado antes de publicar; usar la etiqueta final `apk-lectura-2026-10-23-voz-estable-r2`. La causa exacta y la resolución del cierre informado requieren confirmación en el Fold.

## Descarga anterior · 0.2.0 · histórica

[Descargar Kitewise 0.2.0 para Android](https://github.com/Victordaz07/Leeconmigo/releases/download/apk-lectura-2026-10-23-motor-lectura-r3/Kitewise-lectura.apk) · código 4 · 335.565.866 bytes. Instalar sobre 0.1.2 sin desinstalar para conservar datos.

CI 39918040689 aprobado en 31m27s desde d407328; descarga HTTPS 200 completa, SHA-256/digest de GitHub, firma idéntica, alineación 16 KB, cuatro arquitecturas, 169 recursos, 25 ediciones, lector nuevo y guarda nativa verificados. Sin permiso INTERNET. Evidencia íntegra: `APK-VERIFICATION.json`. Las etiquetas anteriores de este motor se cancelaron antes de publicar; r3 identifica esa entrega histórica; la actualización actual es 0.2.1 enlazada arriba.

SHA-256: `429466c4f956b2deb7661023e372ed78ccba58797529f6eb91c6ba6fa79457b8`. Falta la prueba física de reconocimiento/latencia/TTS/plegado con captura real. La revisión de campo se hace desde los dos laboratorios preservados y el protocolo anterior.

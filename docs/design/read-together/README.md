# Leer juntos · primera versión de prueba familiar

Victor autorizó implementar el motor tras VZ-01 y pidió conservar la **Prueba de voz de Ajustes** para futuras comparaciones. El objetivo es acompañar la lectura y mantener la ayuda por palabra, sin convertir el reconocimiento en examen de pronunciación.

## Qué incorpora

- En cada cuento: **Leer juntos** o el comienzo manual de siempre. Micrófono opcional; pausa/reanudación de 48 dp en el pie existente. Arte, zoom, letra, preguntas, repaso y anclas conservados. El niño decide cuándo pasar: reconocer texto no cambia la página automáticamente.
- Android local con resultados provisionales y finales, mediante `expo-speech-recognition` **57.0.0**, fijado al SDK auditado. Se exige Android API 33+, fábrica `createOnDeviceSpeechRecognizer` e idioma instalado en ese servicio. Nunca se recurre al reconocedor genérico ni a la nube. Android/iOS anteriores pueden usar Whisper local; el navegador falla cerrado.
- Si esa escucha no está disponible, **Probar otra escucha local** activa Whisper Base ya incluido en el APK; **Seguir sin micrófono** conserva la navegación. No se descargan modelos ni se sube audio. La disponibilidad/idiomas del servicio del Fold se comprobarán físicamente.
- **Ajustes → Prueba de voz** sigue existiendo. Selector Android/Whisper, ES/EN, Whisper Rápido/Preciso, frases intercambiables, hipótesis provisionales Android y resultados finales temporales. Conserva nivel/cola/tiempo de inferencia Whisper; los tiempos de inferencia Android se indican como no disponibles. No se persisten transcripciones ni audio. No confundir los porcentajes de cobertura del laboratorio adulto con precisión acústica o calificación infantil.

## Motor y seguridad de estado

`ReadingFollower` es lógica pura, independiente del proveedor. Compara en una ventana próxima al cursor; un resultado provisional reemplaza al anterior y no confirma cobertura. Solo los índices alineados del final se confirman: una omisión sigue sin confirmar. Una palabra final aislada y distante no acredita toda una frase. Se conservan repeticiones intencionales y se toleran tartamudeos, relectura próxima y una omisión interna; la tolerancia fonética/numérica más amplia sigue pendiente de calibración. Las revisiones pueden retroceder sin borrar cobertura confirmada. No se muestra rojo, porcentaje ni error del niño.

`ReadTogetherController` coordina página, intención, bloqueo, generación y tiempo; `useReadTogether` añade ciclo de vida. La UI importa la sesión, no SDKs. El proveedor sigue `SpeechEngine`/`ReadingVoice`. Se arregla además el consumidor `RealReadingEngine` experimental para que no rellene huecos ni acepte resultados mientras muestra ayuda; el lector preparado usa el controlador nuevo, no ese prototipo antiguo.

Una exclusión global del micrófono abarca lector y laboratorio, incluso permiso/carga/parada pendientes. Detener invalida resultados sincrónicamente; el siguiente inicio espera el cierre anterior. Android espera `abort`/`end`; si falta confirmación, impide nuevas capturas hasta reiniciar la app. Las generaciones cancelan permisos/modelos/transcripciones Whisper atrasados. Whisper carga ambos modelos antes de abrir captura, cancela trabajos y espera la cola activa al detener. Su VAD ya no aprende la voz inmediata como ruido inicial.

La ayuda cierra la puerta de aceptación y espera la parada antes del TTS; al cerrar espera `Speech.stop()` y 250 ms de cola acústica. Se detiene también para ilustración ampliada, preguntas, repaso, descanso, salida y segundo plano. Girar/plegar conserva la cobertura si sigue el mismo fragmento.

## Tiempo y persistencia

Mientras **Leer juntos** está seleccionado, incluso en carga, pausa o error, no se acredita el reloj libre por tener la pantalla abierta. Los finales que aportan palabras nuevas pueden acreditar duración de voz del proveedor; Whisper usa intervalos Silero (centisegundos convertidos a ms), Android solicita tiempos de palabras en API 34+. Sin tiempos, solo intervalos cortos entre hipótesis consecutivas alineadas. Tope de dos segundos por palabra nueva y diez segundos por resultado; repeticiones ya confirmadas, silencio, ayuda y errores no suman. Es evidencia temporal conservadora, no medición clínica de fluidez. El manual conserva su estimación anterior con límites; ayudas/zoom la suspenden. El resumen diferencia `voice`, `mixed`, `free`, `simulated` cuando corresponde. Completar manualmente un fragmento sigue siendo confirmación del lector, no prueba de cobertura ASR.

**D1:** muestras solo en memoria. El APK continúa sin permiso INTERNET y sin SDK de analítica. Un plugin reproducible de Expo endurece el wrapper fijado: guarda nativa adicional de fábrica local, elimina el log de transcripciones/opciones y evita incluso crear el archivo PCM temporal cuando no se solicita persistencia. Se aplica a la dependencia en prebuild, nunca editando los directorios Android generados. Cambiar versión/patrones de upstream bloquea la compilación hasta revisar el parche.

## Validación y límites

Pruebas del comparador, controlador, puente Android inyectado, exclusión de micrófono, endurecimiento idempotente y ciclo Whisper (incluido trabajo cancelado con PCM sintético). Estas pruebas verifican flujo/seguridad; **no miden la precisión de un reconocedor con una voz real**. TypeScript/lint, regresión de ambos cuentos completos ES/EN, diez tamaños/idiomas de recuperación manual sin usar ASR de navegador, zoom táctil y compilación Kotlin release. Resultados exactos de la entrega en `VALIDATION.md` y `APK-VERIFICATION.json` al terminar.

Pendiente: Fold físico, habla infantil real, acentos, ruido/TV/hermanos, latencia y batería; comparación Moonshine/otros; dictado de números y contracciones separadas por ASR; asistencia fonética. Los umbrales son conservadores y aún no calibrados con Noah. No se reconoce quién habla: un adulto leyendo el mismo texto también puede coincidir. El servicio Android puede cerrar una sesión durante una pausa: se muestra **En pausa** y se reanuda con el botón, sin bucle automático de reinicios. La app no bloquea al niño por reconocimiento incierto.

## Prueba de mañana (sin grabar voz)

1. Actualizar instalando el APK sobre la app actual; conservar datos. No desinstalar.
2. Padres → Ajustes → **Prueba de voz**. Android, Español: Empezar, leer una frase, repetirla, hacer una pausa y Detener. Probar English. Si no está disponible, elegir Whisper y Preciso; esperar **Escuchando** antes de leer. Las frases aparecen completas y el laboratorio muestra lo entendido.
3. Entrar al puente y elegir **Leer juntos**. Probar lectura natural, repetir una frase, omitir una palabra, tocar una palabra para escucharla y cerrar la ayuda. La pronunciación de la app no debe colorear palabras nuevas. Pasar voluntariamente con ›.
4. Pausar/reanudar, ampliar ilustración, cambiar de fragmento, girar, abrir/cerrar el Fold y mandar la app al fondo. La escucha debe respetar cada pausa y nunca trasladar una frase antigua al fragmento nuevo.
5. Si Android no está disponible, **Probar otra escucha local**; o continuar sin micrófono. En el laboratorio, comparar también Whisper Rápido/Preciso. No es necesario habilitar red para Whisper.
6. Anotar solo motor, idioma, fragmento, demora aproximada y comportamiento observado. No grabar/subir la voz de Noah. Estos resultados decidirán el siguiente ajuste; no se promete precisión perfecta por haber pasado las pruebas de código.

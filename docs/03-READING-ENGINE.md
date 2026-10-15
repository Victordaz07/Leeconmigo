# 03 — Reading Engine (constitución técnica)

Este documento es el contrato central de Lee Conmigo. El motor responde
continuamente a una sola pregunta: **¿el niño está intentando leer el texto
esperado?** No: ¿está haciendo sonido? No: ¿pronunció todo perfectamente?

## Componentes del motor

1. **Voice Activity Detection (VAD)** — solo responde "hay voz / no hay
   voz". Alimenta pausas y reduce procesamiento innecesario. No decide si
   la lectura es correcta.
2. **Speech Recognition** — convierte audio en fragmentos de texto
   temporales. Preferiblemente on-device, en streaming, con resultados
   parciales, baja latencia. Nunca almacena audio.
3. **Reading Alignment Engine (matcher)** — compara el texto reconocido
   contra el texto esperado (que ya conocemos de antemano — esto no es
   dictado libre). Debe tolerar omisiones, repeticiones, tartamudeos,
   autocorrecciones, pronunciación imperfecta, reinicios de frase. Ubica
   aproximadamente al niño dentro del texto actual. No exige igualdad
   exacta.
4. **Reading Confidence** — puntuación interna 0.00–1.00 por fragmento
   (0 = no corresponde, 0.6 ≈ probablemente leyendo, 1.0 = coincidencia
   fuerte). El umbral real se calibra en el Prototipo 00/01 con datos
   reales de Noah. **Nunca se muestra como porcentaje al niño.**

## Máquina de estados del temporizador

```
IDLE → READY → READING ⇄ GRACE_PERIOD → PAUSED → RESUMING → READING
                                                              ↓
                                                          COMPLETED
```

- **IDLE**: no hay sesión activa.
- **READY**: historia cargada, micrófono preparado, esperando inicio.
- **READING**: lectura válida en curso; el tiempo válido avanza.
- **GRACE_PERIOD** (0–10 s sin lectura válida): el niño puede respirar,
  mirar una ilustración, prepararse. UI discreta ("Escuchando…"), no
  agresiva. El reloj puede seguir corriendo según política, pero no se
  interrumpe al niño.
- **PAUSED** (~10 s sin lectura válida): el tiempo válido se detiene. La
  sesión sigue abierta; la historia no se cierra. UI: "Tiempo de lectura en
  pausa" (discreto, no alarma).
- **RESUMING**: se detectó actividad; requiere **~3 segundos consecutivos
  de lectura válida** (voz + correspondencia razonable con el texto, no
  solo ruido) antes de volver a `READING`.
- **COMPLETED**: sesión/meta terminada; se guardan estadísticas; el audio
  ya fue descartado.

Regla de 10 s y regla de 3 s son aproximadas, no exactas al milisegundo; el
umbral real se calibra con el Prototipo 00 (ver `08-ROADMAP.md`).

## Tolerancia (no es examen de pronunciación)

Aceptar: pronunciación imperfecta, repeticiones, tartamudeos,
autocorrecciones, palabras parcialmente pronunciadas, reinicio de una
oración, pequeñas omisiones, pausas naturales, acentos distintos,
velocidad variable. **No** hacer: detener el reloj por cada error, marcar
palabras en rojo, exigir pronunciación nativa, castigar acentos
regionales, convertir la lectura en examen.

## Prevención de trampas (anti-cheat)

Señales combinadas, ninguna por sí sola decide: existencia de voz +
correspondencia aproximada con el texto + avance real por el texto +
continuidad razonable + posición aproximada en la página + app en
primer plano (si pasa a segundo plano, el tiempo se pausa de inmediato) +
no permitir pasar de página sin haber leído + velocidad anormal de cambio
de página. No se promete un sistema imposible de engañar; sí uno donde las
trampas obvias (ruido, TV, hablar de otra cosa, pasar páginas rápido) no
produzcan fácilmente tiempo válido. Un bloqueo total de salida de la app
(pinning de pantalla en Android) no es requisito de v1.

## Contrato de eventos (`ReadingEvent`)

Este es el contrato entre el motor y la UI. La UI nunca sabe cómo se
detectó un evento (VAD → matcher → reglas), solo reacciona a él.

```ts
type ReadingEvent =
  | { type: "session.started" }
  | { type: "speech.started" }
  | { type: "speech.stopped" }
  | { type: "word.current"; wordIndex: number }
  | { type: "word.correct"; wordIndex: number }
  | { type: "word.uncertain"; wordIndex: number }
  | { type: "word.incorrect"; wordIndex: number }
  | { type: "word.repeated"; wordIndex: number }
  | { type: "word.skipped"; wordIndex: number }
  | { type: "pause.detected"; duration: number }
  | { type: "help.requested"; wordIndex: number }
  | { type: "page.completed" }
  | { type: "story.completed" };
```

El prototipo de Reading Session (ver `04-READING-SESSION.md`) ya usa
exactamente este set de eventos y añade uno adicional de forma consistente
con el patrón: `help.requested { type: "read-start" }` (el niño pide que la
app le "lea el comienzo" de la línea actual). Es válido extender el enum
así, siempre como variante del mismo contrato, nunca como acoplamiento
directo a un proveedor.

## Tipos base

```ts
interface ReadingWord { id: string; text: string; index: number; normalized: string }
interface ReadingState { currentWordIndex: number; status: "idle" | "listening" | "paused" | "helping" | "complete" }
```

## Ayuda de pronunciación

Niveles progresivos (no todos en cada intervención):

1. Resaltar palabra. 2. Pista visual pequeña. 3. Pronunciación en audio.
4. Dividir en sílabas. 5. Leer la frase completa.

Intervenir solo cuando: el niño se atasca, repite varias veces, pide
ayuda explícitamente, hay pausa prolongada sobre una palabra, la palabra
es un objetivo de aprendizaje, o el sistema pierde por completo el punto
de lectura. **No** interrumpir automáticamente cada error si el niño sigue
comprendiendo y avanzando.

## Vocabulario personal

Cuando una palabra genera dificultad, guardar solo: palabra, idioma,
historia, fecha, número de ayudas, estado de dominio. Nunca la grabación.
Cuando una palabra antes difícil se lee bien varias veces: "¡Dominaste una
palabra nueva!".

```json
{ "word": "through", "language": "en", "helpCount": 2, "successfulLaterReads": 3, "status": "mastered" }
```

## Módulo de corrección de palabras (opcional, ver `01-PRODUCT-RULES.md`)

Diseñado para no violar "nunca mostrar correcto/incorrecto": no bloqueante,
solo ante señal repetida, preferentemente a fin de página, con umbral de
confianza alto. Pendiente decidir si va en v1 como modo práctica opcional o
se pospone — ver `09-OPEN-DECISIONS.md`.

## Comprensión lectora — checkpoints

Se colocan en límites narrativos naturales (fin de página/escena), nunca
"cada N minutos". Tipos: literal, secuencia, causa/efecto, inferencia,
predicción, vocabulario en contexto, personaje, evidencia, tema, punto de
vista. Regla de temporizador pendiente de decidir: si la pausa por
pregunta cuenta como lectura válida, no cuenta pero tampoco corta racha, o
cuenta en categoría "comprensión" aparte (ver `09-OPEN-DECISIONS.md`).

## Respuestas abiertas por voz

A partir de ~3.º grado: "Cuéntame qué acaba de pasar." El audio se procesa
temporalmente para verificar elementos esenciales de comprensión y se
descarta — nunca se conserva la grabación.

## Datos permitidos de sesión (ejemplo)

```json
{
  "storyId": "story_07",
  "grade": 3,
  "language": "en",
  "validReadingSeconds": 842,
  "sessionSeconds": 1021,
  "comprehensionCorrect": 5,
  "comprehensionTotal": 6,
  "wordsHelped": ["through", "enormous"],
  "completion": 0.82
}
```

## Definition of Done — Reading Engine v1

Detecta lectura real razonablemente · ignora conversación no relacionada ·
tolera errores · pausa tras ~10 s · reanuda tras ~3 s válidos · continúa
posición · no almacena audio · pausa al salir de la app · recupera sesión ·
funciona con texto real · registra tiempo válido.

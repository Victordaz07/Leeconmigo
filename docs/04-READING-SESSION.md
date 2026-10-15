# 04 — Reading Session (experiencia aprobada)

Esta es la primera vertical slice del producto. Ya existe un prototipo
interactivo aprobado (Claude Design canvas, `design/prototypes/`) que sirve
como referencia de comportamiento e interacción — **no rediseñar desde
cero; conectar sus estados a los eventos reales del Reading Engine.**

## Los 20 estados diseñados en el prototipo

```
01 Selección          08 Palabra incorrecta   15 Pregunta
02 Preparación         09 Palabra repetida     16 Fin de historia
03 Esperando voz       10 Palabra saltada      17 Inicio (Home)
04 Leyendo             11 Palabra difícil      18 Progreso (padres/niño)
05 Pausa corta         12 Pronunciación        19 Te leo el comienzo (echo)
06 Pausa larga         13 ¡Muy bien!           20 Repaso rápido (sílabas)
07 Palabra dudosa      14 Fin de página
```

Este set cubre y extiende el de `02-ARCHITECTURE.md`/guía de diseño (que
pedía 16 estados mínimos); los estados 17–20 (Home, Progreso, Echo, Repaso)
son adiciones válidas del mismo patrón.

## Pantallas

- **Home**: saludo, racha, puntos/logros, "Continuar leyendo" (historia en
  curso con barra de progreso), grid "Mis historias", accesos a Biblioteca,
  Logros, Progreso, Ajustes.
- **Select (ficha de historia)**: portada, nivel, descripción, cuántos
  "cuadros" tiene, duración estimada, categoría, botón "Comenzar". Panel
  lateral colapsable.
- **Prep**: "¿Listo para leer?" con 4 tips (leer en voz alta, la app
  escucha, tocar palabra = ayuda, repaso al final).
- **Reading**: panel lateral con el texto de la escena actual (o comic
  completo con burbujas superpuestas a la ilustración, según modo), mic
  central con estados de color (verde = escuchando, gris = pausa/ayuda,
  ámbar = pausa larga), feedback textual corto, "cámara" que centra la
  escena/burbuja activa con transición suave, indicador de progreso por
  "cuadros" (segments).
- **Help modal**: palabra dividida en sílabas, reproducción de audio,
  definición corta, sinónimo (en modo "Lector"/9–12 años).
- **PageDone**: mensaje de cierre de página, transición a pregunta.
- **Question**: pregunta de comprensión con 2–3 opciones (imagen+texto en
  modo niño pequeño; solo texto en modo mayor), feedback no punitivo,
  botón "Continuar" habilitado solo con respuesta correcta.
- **Review**: mini-juego de armar la palabra por sílabas (tiles
  arrastrables/tocables), usando las palabras que necesitaron ayuda durante
  la sesión + palabras base.
- **End**: estrellas (1–3 según precisión calculada, nunca mostrado como
  "examen"), estadísticas (tiempo, palabras/min o precisión según
  audiencia), palabras practicadas, botón reiniciar/volver.
- **Progress**: tabs Resumen/Historias/Logros/Estadísticas, minutos por
  día de la semana, palabras practicadas, logros/badges.

## Dos audiencias (`etapa`)

El prototipo implementa **Explorador (6–8 años)** vs **Lector (9–12
años)**, no las 3 bandas de grado (1-2/3-4/5-6) de `05-DESIGN-SYSTEM.md`.
Cambia: tono de los mensajes de feedback, tamaño de tipografía, formato de
la pregunta de comprensión (imágenes vs. texto), si se muestra
"Precisión %" o "Palabras/min". **Esto es una simplificación del modelo de
6 niveles/3 familias y debe reconciliarse antes de escalar** — ver
`09-OPEN-DECISIONS.md`.

## Contrato de eventos usado (coincide con `03-READING-ENGINE.md`)

`session.started` · `speech.started` · `word.correct{wordIndex}` ·
`word.uncertain{wordIndex}` · `word.incorrect{wordIndex}` ·
`word.repeated{wordIndex}` · `word.skipped{wordIndex}` ·
`pause.detected{duration}` (short/long) · `help.requested{wordIndex}` ·
`help.requested{type:"read-start"}` (echo) · `page.completed` ·
`story.completed`.

## FakeReadingEngine / panel de desarrollo

El prototipo ya incluye el panel de simulación pedido en el roadmap:
botones para disparar cada evento (Palabra correcta, Pausa corta, Pausa
larga, Palabra dudosa, Palabra incorrecta, Palabra repetida, Palabra
saltada, Pide ayuda, Léeme el comienzo, Terminar página, Reiniciar) más un
selector para saltar directo a cualquiera de los 20 estados, y un modo
"lectura automática" que dispara `word.correct` cada ~520 ms para demos.
Claude Code debe extraer esta lógica a un `FakeReadingEngine` real
(paquete `packages/reading-engine`) reutilizable por tests, no dejarla
embebida en el componente de UI.

## Reglas de experiencia infantil (ya validadas en el prototipo)

- Nunca "ERROR: dejaste de leer". La palabra actual pulsa suavemente; la
  ayuda es opcional.
- Feedback varía por estado pero siempre es de acompañamiento: "Sin
  prisa", "¿Necesitas una pista?", "Casi. Escuchemos «palabra»", "Bien,
  continúa", nunca "Incorrecto".
- El resaltado de la palabra actual usa una marca discreta (subrayado o
  fondo), configurable vía prop (`highlight`). **Ver el punto abierto sobre
  resaltado por palabra vs. por frase en `09-OPEN-DECISIONS.md`** — la
  visión original pedía frase, el prototipo implementa palabra.
- Tocar cualquier palabra abre ayuda (no solo la palabra "difícil"
  detectada automáticamente).

## Story data usada en el prototipo (referencia, no historia final)

Una sola historia piloto en español, "La luna y la puerta azul": 10
"cuadros" (paneles/burbujas), ~46 palabras totales, con diccionario de
sílabas, definiciones, sinónimos y coordenadas de ilustración por palabra
clave (para el modal de ayuda). Sirve de plantilla de esquema de datos por
historia — ver `story schema` en `02-ARCHITECTURE.md` / Content System.

## Checkpoint de validación (no avanzar a Fase B sin esto)

En navegador, con `FakeReadingEngine`: abrir historia → iniciar lectura →
seguir palabra actual → simular pausa corta y larga → UI responde →
simular error/dudosa/repetida/saltada → UI responde → pedir ayuda → UI
ayuda con sílabas y audio → terminar página → pregunta de comprensión →
repaso de sílabas → fin de historia con estadísticas. El prototipo ya
demuestra este flujo completo para una página/historia única.

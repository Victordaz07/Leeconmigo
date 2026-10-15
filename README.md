# Lee Conmigo

Tutor de lectura en voz alta, bilingüe (español/inglés), para niños de 1.º a 6.º grado. Pensado primero para
tablet Android. El niño lee una historia en voz alta; la app escucha localmente, mide cuánto tiempo estuvo
**leyendo de verdad** (no solo con el libro abierto), ayuda con palabras difíciles, hace preguntas de
comprensión y nunca convierte la lectura en examen.

Construido para Noah (9 años), hijo de [Victor](https://github.com/Victordaz07). Uso familiar; ver
[`docs/00-PROJECT-MASTER.md`](docs/00-PROJECT-MASTER.md) para la visión completa del producto.

## Por qué existe

Los sistemas de lectura típicos miden "¿cuánto tiempo estuvo abierto el libro?". Un niño puede abrir la app,
dejar correr un temporizador y no leer una palabra. Lee Conmigo mide en cambio **cuánto tiempo estuvo
realmente participando en la lectura** — ese es el principio que gobierna cada decisión de producto.

## Lo que ya funciona

- **Lectura guiada bilingüe** con reconocimiento de voz real 100 % local (Whisper vía Transformers.js,
  WebAssembly) — el modelo va empaquetado en la app, no depende de red ni de servicios en la nube.
  Reconocimiento tolerante (pausas, repeticiones, autocorrecciones, acentos), nunca examina pronunciación.
- **24 historias reales** (algunas en varios capítulos), en niveles 1, 3, 5 y 6 — cómic e "illustrated
  reader" — cada una en inglés y español, con preguntas de comprensión, vocabulario con sílabas y audio de
  pronunciación real (`speechSynthesis`).
- **Modo lectura libre**: el padre lee en voz alta (o el niño lee solo) y avanza de página con un botón, sin
  depender del micrófono — para cuando no hace falta que la app escuche.
- **Modo padres** con PIN: idioma, nivel de lectura (el padre elige libremente, no depende del grado
  escolar), meta diaria, nombre del niño.
- **Progreso y logros reales**, calculados solo de lo que ya se guarda (nunca inventados): historias
  terminadas, minutos válidos, racha, comprensión, palabras dominadas, categorías leídas.
- **Privacidad como regla no negociable**: la voz del niño nunca se guarda ni sale del dispositivo — ver
  [Privacidad](#privacidad) más abajo.
- **Empaquetado como app Android real** (Capacitor), probada en tablet física.

Lo que falta y por qué está documentado abajo en [Qué sigue](#qué-sigue).

## Stack

| Capa | Tecnología |
|---|---|
| UI / lógica | React 19 + TypeScript, Vite, Tailwind v4 |
| Reconocimiento de voz | Whisper (`onnx-community/whisper-tiny`) vía Transformers.js, ONNX Runtime Web (WASM), VAD Silero |
| Audio de pronunciación | `speechSynthesis` del navegador (sin red, sin reconocimiento) |
| App móvil | Capacitor + capa nativa Android (Kotlin/Java) |
| Estado / progreso | Local-first, `localStorage` (sin backend, sin cuentas) |
| Pruebas | Vitest + Testing Library, 1000+ pruebas |
| Monorepo | npm workspaces |

## Estructura

Monorepo de paquetes puros (sin UI) + una app que los conecta:

| Paquete | Qué hace |
|---|---|
| [`packages/contracts`](packages/contracts) | Los únicos tipos compartidos: `Story`, `ReadingEvent`, `SessionSummary`, `SpeechEngine`, `ReadingEngine`. Nada más depende de nada más. |
| [`packages/reading-engine`](packages/reading-engine) | Temporizador, comparador de lectura, `FakeReadingEngine` (simulador) y `RealReadingEngine` (motor real). |
| [`packages/speech-engine`](packages/speech-engine) | `FakeSpeechEngine` y `WhisperSpeechEngine` (mic → VAD → Whisper, en un Web Worker). |
| [`packages/story-engine`](packages/story-engine) | Tokenización, validación de contenido, catálogo, `StoryRepository`, las historias reales. |
| [`packages/session-engine`](packages/session-engine) | Flujo de pantallas, repaso por sílabas, estadísticas de progreso y logros — lógica pura. |
| [`packages/ui`](packages/ui) | Componentes de la experiencia (niño y padres). Solo presentación: nunca importa el motor. |
| [`apps/reader`](apps/reader) | La app: une motor + flujo + UI, Capacitor/Android, panel de desarrollo. |

Regla de arquitectura no negociable: **la UI nunca depende directamente de un proveedor de voz concreto**
(ni Whisper, ni Google, ni Android `SpeechRecognizer`) — todo pasa por la interfaz `SpeechEngine`. Cambiar de
motor de voz nunca debería exigir tocar una sola pantalla.

## Cómo correrlo

```bash
npm install
npm run dev            # http://localhost:5173 — modo desarrollo, con panel DEV
npm test                # toda la suite (motor, flujo, contenido, UI, lectura completa de cada historia)
npm run stories:check   # valida el contenido: esquema, reglas del niño, imágenes que existan y midan lo declarado
npm run typecheck       # TypeScript estricto en todos los paquetes
npm run build           # build de producción (apps/reader/dist)
```

El panel de desarrollo (`DEV ⚙`, solo con `VITE_DEV_TOOLS=1`, activo en `npm run dev`) simula cualquier
evento de lectura, salta a cualquier estado de pantalla y abre un probador de micrófono en vivo — nunca forma
parte de la build que llega al niño.

### Android

```bash
cd apps/reader
VITE_REAL_VOICE=1 npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

Genera `apps/reader/android/app/build/outputs/apk/debug/app-debug.apk`. `VITE_REAL_VOICE=1` activa el motor
de voz real (Whisper); sin esa variable, la app usa el simulador (`FakeReadingEngine`) para poder probar todo
el flujo de UI sin voz.

## Privacidad

**La voz del niño no se guarda ni sale del dispositivo. Nunca.** El audio vive solo en memoria mientras dura
el reconocimiento; al terminar la sesión, lo único que se guarda es el resumen derivado (minutos leídos,
historia, comprensión, palabras que costaron) — nunca audio, nunca texto reconocido palabra por palabra.
Detalle completo y qué campos exactos se permiten guardar en
[`docs/07-PRIVACY-AUDIO.md`](docs/07-PRIVACY-AUDIO.md).

## Contenido: cómo se agregan historias

Una historia es una **familia de variantes** (idioma × nivel): el motor define el formato (plantillas de
cómic, cajas de texto, esquema de preguntas/vocabulario) y el contenido se adapta a él — nunca al revés. Guía
completa, con los prompts usados para generar texto e ilustraciones, en
[`content/GUIA-DE-CONTENIDO.md`](content/GUIA-DE-CONTENIDO.md).

## Documentación

- [`docs/00`–`09`](docs/) — la fuente de verdad del producto: visión, reglas de contenido, arquitectura,
  motor de lectura, diseño, reglas de UX infantil, privacidad, roadmap y decisiones abiertas. `CLAUDE.md` le
  pide a Claude Code leer esto antes de tocar código.
- [`docs/DEVLOG.md`](docs/DEVLOG.md) — bitácora sesión por sesión de cómo se construyó todo esto: qué se
  pidió, qué se encontró, qué se decidió y por qué. Útil para retomar el proyecto o entender un bug ya
  resuelto una vez.

## Qué sigue

- Vertical de tablet y teléfono (hoy solo hay diseño horizontal).
- Contenido de nivel 4 (nivel 5 ya tiene su primera historia, *La octava linterna*).
- Probar el motor de voz con más condiciones reales (ruido, susurro, distintos acentos).
- Biblioteca con buscador/filtros (hoy es una cuadrícula simple — suficiente mientras el catálogo es chico).
- Concepto real de "serie" para historias en varios capítulos (hoy se resuelve numerando el título a mano).
- Traducir la interfaz al inglés (hoy los textos de botones/mensajes están solo en español).

Detalle completo, con el razonamiento de cada punto, en
[`docs/DEVLOG.md`](docs/DEVLOG.md#no-está-hecho) y [`docs/09-OPEN-DECISIONS.md`](docs/09-OPEN-DECISIONS.md).

## Estado

Proyecto personal/familiar, en desarrollo activo. No es un producto público ni tiene cuentas ni backend.
Construido de forma colaborativa con [Claude Code](https://claude.com/claude-code).

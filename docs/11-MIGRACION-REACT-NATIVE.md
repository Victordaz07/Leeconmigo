# 11 — Migración a React Native (Expo)

**DECISIÓN (Victor, 2026-10-15, `docs/DECISIONS.md` D7):** Lee Conmigo pasa de Capacitor (web dentro de un
WebView) a **React Native con Expo**: pantallas nativas, Android primero, iOS después desde el mismo código.
Motivo: la app se va a publicar (D8) y se quiere una app nativa de verdad, multiplataforma, sin reescribir la
lógica que ya funciona.

Esto reemplaza la plataforma de `docs/02-ARCHITECTURE.md` (Capacitor + Kotlin) y cierra `docs/09` #6. **No
cambia** ninguna regla de producto: privacidad de voz (`docs/07`), desacoplamiento UI ↔ `SpeechEngine`,
arte y texto separados, `Fake*Engine` para todo lo nativo.

## Regla de oro de la migración

**La app actual (Capacitor) sigue funcionando para Noah hasta que la nativa la iguale.** No se borra
`apps/reader` ni `packages/ui` durante la migración. Se construye la nueva al lado (`apps/mobile`,
`packages/ui-native`) y se cambia cuando haya paridad (checkpoint RN-CP2).

## Qué se reutiliza y qué se rehace

Verificado en el repo (2026-10-15): los paquetes de lógica no dependen del navegador.

| Pieza | Líneas aprox. | Destino |
|---|---|---|
| `packages/contracts` | ~480 | **Se reutiliza tal cual** |
| `packages/reading-engine` | ~1.600 | **Se reutiliza tal cual** (temporizador, comparador, Fake/Real engine) |
| `packages/session-engine` | ~600 | **Se reutiliza**; el almacenamiento ya está detrás de una interfaz (`progress-store.ts`) → implementación nueva para el teléfono |
| `packages/story-engine` | ~860 + historias JSON | **Se reutiliza** (historias, validación, tokenización) |
| `packages/speech-engine` | ~1.230 | `FakeSpeechEngine` se reutiliza. `WhisperSpeechEngine` es solo web (Transformers.js + AudioWorklet) → nuevo `WhisperNativeSpeechEngine` |
| `packages/ui` | ~4.400 | **Se rehace** como `packages/ui-native` (React Native no usa HTML/CSS). La lógica de vista pura (textos `copy`, `ReaderPrefs`, `deriveReadingView`, `wordMark`) ya se movió a `packages/ui-core`, compartida por las dos apps |
| `apps/reader` | ~1.500 | **Se rehace** como `apps/mobile` (Expo) |
| Pruebas | 1068 | Las de los paquetes de lógica siguen valiendo sin cambios; las de UI se rehacen |

## Piezas técnicas (a confirmar con una prueba cada una, no asumir)

- **Expo** con la última SDK estable al crear el proyecto; **development build** (no Expo Go), porque la voz
  necesita código nativo. Monorepo con npm workspaces (Expo los soporta).
- **Voz:** `whisper.rn` (whisper.cpp nativo en el dispositivo, Android e iOS). Mismo principio que hoy: el
  modelo va dentro de la app, sin red, el audio vive solo en memoria. Prueba técnica RN-03 antes de
  construir encima. Alternativa si falla: reconocimiento on-device del sistema (`SpeechRecognizer` de Android /
  `SFSpeechRecognizer` de iOS con `requiresOnDeviceRecognition`), siempre fallando cerrado (D1).
- **Pronunciación (TTS):** `expo-speech`.
- **Almacenamiento local:** `expo-sqlite` o MMKV detrás de la interfaz que ya existe.
- **Estilos:** tokens de `packages/ui/src/styles/tokens.css` pasan a un archivo de tokens TS compartido
  (y NativeWind si se quiere seguir escribiendo clases tipo Tailwind — a decidir en RN-02).
- **Fuentes:** Andika + Nunito con `expo-font` (mientras C2 no cambie).
- **Lo más delicado de rehacer:** el acomodo del texto en los globos del cómic (`fit-text`, `comic-fit`,
  `fit-layout`) hoy mide el DOM; en nativo se mide con `onLayout`/`onTextLayout`. Se migra con las mismas
  pruebas de casos que ya existen.
- **Arte:** las ilustraciones (`apps/reader/public/stories`) se empaquetan como assets; a futuro, paquetes
  de contenido descargables (`docs/02` "Descarga de contenido").

## Fases (IDs en `docs/ROADMAP.md`)

| ID | Qué | Termina cuando |
|---|---|---|
| RN-01 | Crear `apps/mobile` (Expo + TS) en el monorepo, importando `contracts`/`reading-engine`/`story-engine` | La app abre en el Android de Victor y muestra el título de una historia leído del paquete |
| RN-02 | Tokens de diseño en TS + fuentes + componentes base (botón, tarjeta, mic) en `packages/ui-native` | Pantalla de muestra con los componentes |
| RN-03 | **Prueba técnica de voz** con `whisper.rn` en la tablet de Noah (latencia, precisión, batería, memoria) | Datos en `docs/log/` y decisión: seguir con whisper.rn o alternativa |
| RN-04 | Pantalla de lectura con `FakeReadingEngine` (texto, palabra actual, mic, ayuda) | Flujo de lectura completo en simulador, sin voz |
| RN-05 | Cómic: globos sobre la ilustración + acomodo del texto | Las 24 historias se ven bien (comparación visual con la app actual) |
| RN-06 | Resto del flujo: Inicio, Biblioteca, Ficha, Preparación, Pregunta, Repaso, Fin, Progreso, Modo padres con PIN | **RN-CP1**: paridad con la app actual usando `FakeReadingEngine` |
| RN-07 | `WhisperNativeSpeechEngine` conectado a `RealReadingEngine` | Lectura real con voz en la tablet |
| RN-08 | Almacenamiento local, migración del progreso de Noah desde la app vieja (si se puede; si no, empezar limpio avisando) | **RN-CP2**: Noah usa la nueva a diario; la vieja se archiva |
| RN-09 | iOS: build en iPad/iPhone (requiere Mac o EAS Build + cuenta Apple Developer) | App corriendo en iPad |

Cada fase en tareas de ~30–45 min según el protocolo de relevo.

## Qué NO hacer durante la migración

- No agregar funciones nuevas (Modo Enfoque, matemáticas) a la app vieja: van directo a la nueva.
  Excepción: arreglos que Noah necesite para seguir leyendo.
- No mandar audio a ningún servicio para "probar rápido". Nunca (D1).
- No meter SDKs de analítica, anuncios o reporte de errores de terceros (ver `docs/12`).

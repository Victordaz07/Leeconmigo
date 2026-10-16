# 02 — Architecture

## Decisión de plataforma

> **Actualizado 2026-10-15 (D7, `docs/DECISIONS.md`):** la plataforma pasa a **React Native + Expo**
> (Android primero, iOS después). Lo de abajo describe la arquitectura original (Capacitor) que sigue en uso
> en `apps/reader` hasta completar la migración — ver `docs/11-MIGRACION-REACT-NATIVE.md`. La regla de
> desacoplamiento y los contratos de este documento NO cambian.

**No** PWA pura. **No** Android 100% nativo. Arquitectura híbrida:

```
React + Vite + TypeScript   (UI, historias, comics, perfiles, recompensas)
        ↓  Capacitor bridge
Kotlin Native Engine        (micrófono, audio, speech recognition, TTS,
                              almacenamiento local, permisos, offline)
        ↓
Reading Engine              (audio → voz → palabras → alineación con texto
                              esperado → posición → fluidez/pausas/errores
                              → sesión de lectura)
```

Razón: React/Vite/TypeScript es donde ya hay experiencia y permite iterar
rápido en toda la interfaz (que es ~90% del producto). El reconocimiento de
voz continuo y confiable durante 15–20 minutos es la única parte donde
depender solo del navegador (`SpeechRecognition()` web, o Whisper en
WebAssembly) es un riesgo real: cortes, dependencia de conexión, variación
entre navegadores/tablets. Capacitor permite envolver la misma base web y
bajar a Kotlin solo donde hace falta (audio, reconocimiento, TTS,
almacenamiento, offline), sin reescribir la interfaz. La misma base React
también sirve para desarrollo, testing, panel de padres y una futura
versión iPad/iOS (Capacitor + capa Swift), reemplazando solo la pieza
nativa.

> **Nota de tensión a resolver** (ver `09-OPEN-DECISIONS.md`): hay una
> preferencia registrada por construir esto como PWA pura, evitando app
> nativa. La arquitectura aquí documentada (Capacitor + Kotlin) es la
> decisión escrita en los documentos base, justificada por la fiabilidad
> del reconocimiento de voz continuo. El Prototipo 00 (prueba de Whisper
> en el navegador de la tablet de Noah) es exactamente el experimento que
> debe confirmar o tumbar esa decisión con datos reales antes de invertir
> en la capa Kotlin. **No se construye la capa nativa de audio hasta tener
> ese resultado.**

## Regla de desacoplamiento (no negociable)

La UI nunca depende directamente de: Google Speech, Android
`SpeechRecognizer`, Whisper, o cualquier proveedor de voz concreto. Todo
pasa por abstracciones:

```
UI → ReadingEngine → SpeechEngine → SpeechProvider
                                       ├── FakeSpeechEngine (dev/browser)
                                       ├── AndroidSpeechProvider
                                       ├── WhisperProvider (on-device)
                                       └── CloudSpeechProvider (solo si se
                                           decide explícitamente; nunca en
                                           silencio)
```

El `ReadingTimer` no conoce la implementación del speech engine. El
`ReadingMatcher` no guarda datos. Cambiar de proveedor de voz nunca debe
requerir reconstruir la aplicación.

## Capas conceptuales

```
UI
 ├── Child Experience   ├── Parent Experience   ├── Reader
 ├── Library            └── Rewards

APPLICATION
 ├── Session Manager     ├── Reading State Machine
 ├── Progress Manager    ├── Story Controller
 └── Download Manager

DOMAIN
 ├── Reading Alignment  ├── Vocabulary  ├── Comprehension
 ├── Goals              └── Rewards

DEVICE SERVICES
 ├── Microphone  ├── Speech Recognition  ├── Audio Playback
 ├── Storage     ├── Network             └── App Lifecycle

DATA
 ├── Local DB (SQLite/filesystem)  ├── Content Cache  └── Cloud Sync (fuera de v1)
```

## Estructura de repositorio objetivo

No es obligatorio crear todo desde el día 1; es la meta.

```
LEE-CONMIGO/
├── CLAUDE.md
├── docs/                     (este directorio)
├── apps/
│   └── reader/
│       ├── src/
│       ├── public/
│       ├── android/
│       └── capacitor.config.ts
├── packages/
│   ├── reading-engine/
│   ├── speech-engine/
│   ├── story-engine/
│   ├── session-engine/
│   ├── contracts/
│   └── ui/
├── native/
│   └── android/
│       └── reading-audio/
├── design/
│   ├── screens/
│   ├── prototypes/            (incluye el prototipo Reading Session actual)
│   ├── assets/
│   └── handoffs/
└── tests/
```

## Interfaces técnicas críticas (contratos)

```ts
interface SpeechRecognizer {
  start(language: string): Promise<void>
  stop(): Promise<void>
  onPartialResult(callback): void
  onFinalResult(callback): void
  isOnDeviceAvailable(language: string): Promise<boolean>
}

interface ReadingMatcher {
  align(expectedText: string, recognizedText: string): MatchResult
}
// MatchResult: { confidence, currentTokenIndex, matchedTokens, suspectedDifficultWord? }

interface ReadingTimer {
  state: ReadingState
  validSeconds: number
  sessionSeconds: number
  onVoiceActivity(): void
  onValidReading(): void
  onSilence(): void
}
```

Ver `03-READING-ENGINE.md` para la máquina de estados y el contrato de
eventos completo (`ReadingEvent`).

## Reglas para Claude Code

1. Leer `/docs` antes de implementar.
2. Preservar separación arte/texto.
3. Separar motor de lectura de UI.
4. Diseñar servicios modulares e intercambiables.
5. Evitar dependencias que exijan guardar audio.
6. Tratar privacidad como requisito, no como feature (`07-PRIVACY-AUDIO.md`).
7. Implementar soporte offline cuando sea viable.
8. Diseñar datos multi-idioma desde el inicio (aunque el contenido inicial
   sea solo en un idioma).
9. No hardcodear historias, idiomas ni grados.
10. Crear interfaces reemplazables para speech recognition.
11. Separar analytics de audio (analytics nunca contiene audio).
12. Permitir futuras plataformas (iOS) sin reescribir el core.
13. Cada capacidad nativa debe tener un mock/simulador utilizable en
    navegador antes de conectarse a Android real.

## Formato de imágenes

WebP como formato general; AVIF donde sea compatible; PNG solo para
transparencias necesarias. Versión full + thumbnail + placeholder. Lazy
loading, caché local, descarga bajo demanda.

## Descarga de contenido

La app base no incluye la biblioteca completa. Modelo `APP CORE` (UI +
Reading Engine + perfiles + historias iniciales) + `CONTENT PACK`
descargable por historia (datos + assets + metadata de pronunciación y
comprensión). Una historia descargada debe poder leerse offline (texto,
arte, seguimiento, temporizador, progreso, pronunciación, reconocimiento
local si el dispositivo lo soporta).

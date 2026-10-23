# Auditoría del motor existente

22 de octubre de 2026 · Código de aplicación inspeccionado: `63a8dde` (el APK 0.1.2 fue compilado desde `a7f3942`; los cambios posteriores previos a esta investigación eran documentación).

Esta auditoría es estática, con una reproducción textual del matcher. No es una medición acústica, no activa el micrófono y no modifica el lector.

## Inventario

| Archivo | Función observada |
|---|---|
| [`speech.ts`](../../../packages/contracts/src/speech.ts) | Contrato `SpeechEngine`, resultado con texto/final/confianza opcional/atMs |
| [`whisper-native-speech-engine.ts`](../../../apps/mobile/src/speech/whisper-native-speech-engine.ts) | Captura PCM y transcripción nativa local por frases |
| [`voice-types.ts`](../../../apps/mobile/src/speech/voice-types.ts) | Estado y diagnóstico de la prueba de voz |
| [`read-along.ts`](../../../apps/mobile/src/speech/read-along.ts) | Seguimiento de la frase de prueba usando el tracker compartido |
| [`matcher.ts`](../../../packages/reading-engine/src/matcher.ts) | Smith-Waterman textual, similitud y cobertura |
| [`normalize.ts`](../../../packages/reading-engine/src/normalize.ts) | Normalización y colapso de repeticiones |
| [`real-reading-engine.ts`](../../../packages/reading-engine/src/real-reading-engine.ts) | Traducción de finales/VAD a eventos del lector |
| [`timer.ts`](../../../packages/reading-engine/src/timer.ts) | Ventanas de evidencia y máquina del tiempo válido |
| [`use-reading-session.ts`](../../../apps/mobile/src/session/use-reading-session.ts) | Sesión nativa que actualmente construye `FakeReadingEngine` |
| [`segmenter.ts`](../../../packages/speech-engine/src/whisper/segmenter.ts) | Segmentador con mínimo 300 ms y máximo 8.000 ms por defecto |

## Hallazgos priorizados

| ID | Prioridad para activar voz | Evidencia | Cambio recomendado |
|---|---|---|---|
| A01 | Bloqueante | `RealReadingEngine.onRecognized` emite `word.correct` de posición actual a `m.endIdx`, no solo `matchedIdx` | Separar cobertura confirmada de ubicación probable y omisiones |
| A02 | Bloqueante | Por defecto basta una palabra alineada y score 0,4; el tracker busca en todo el texto con hint solo para desempatar | Evidencia contextual, límites de salto, manejo de ambigüedad |
| A03 | Bloqueante de experiencia en vivo | Proveedor nativo no emite parciales; motor real solo consume finales | Adaptador incremental y política de revisiones |
| A04 | Bloqueante de continuidad | Cola máxima dos; elimina segmento más antiguo cuando hay sobrecarga; descarta durante carga | Preparar antes de empezar y tratar pérdida/backpressure explícitamente |
| A05 | Bloqueante de ciclo de vida | `running` distingue parado/activo, no una generación de otra; inferencia asíncrona puede terminar tras reiniciar | Session/generation ID, invalidación por página y cancelación segura |
| A06 | Alta | Temporizador respalda 800 ms recientes por evidencia recibida; no consume intervalos completos del audio transcrito | Separar tiempos acústicos y de recepción; política de evidencia tardía |
| A07 | Alta | `isOnDeviceAvailable` valida plataforma, no preparación/modelo/idioma efectivo | Contrato de capacidades y listo por idioma |
| A08 | Alta | Errores de voz del motor real solo van a consola | Estado visible y recuperación/manual sin castigar al niño |
| A09 | Alta | Normalización elimina diacríticos y convierte ñ en n; contracciones/números pendientes en comentarios | Tokens originales enlazados a una normalización de seguimiento, separada de fonética |
| A10 | Alta | Se eliminan repeticiones de 1–4 tokens antes de alinear | Diferenciar repetición del niño, del ASR y del cuento |
| A11 | Alta | Pausas del motor 1,8/5,2 s frente a criterios de producto aproximados 10/3 s | Reconciliar política y retraso de proveedor antes de calibrar |
| A12 | Alta, al integrar | TTS y aceptación de voz necesitan coordinación explícita | No aceptar la pronunciación de la app como evidencia del niño |
| A13 | Integración | El constructor nativo usa siempre el simulador | Inyección de `ReadingEngine`/proveedor sin acoplar UI a SDK |

«Bloqueante» significa que esa condición debe resolverse antes de anunciar acompañamiento por voz correcto; no que el lector libre actual esté fallando por ella.

## Reproducción del caso de falso avance

Desde la raíz, sin micrófono, red ni archivos de audio:

```sh
node --input-type=module - <<'JS'
import { ReadingProgressTracker } from './packages/reading-engine/src/matcher.ts';
const tracker = new ReadingProgressTracker('La niña abrió la puerta azul y entró al jardín.');
const match = tracker.match('jardín');
console.log(match);
console.log({ acceptsWithRealEngineDefaults: match.matched >= 1 && match.score >= 0.4 });
JS
```

Resultado observado: `matchedIdx: [9]`, `startIdx: 9`, `endIdx: 9`, `score: 1`, aceptación `true`. Los índices son cero-based. El bucle consumidor inspeccionado emite eventos para los índices desde el cursor actual hasta ese 9; no pregunta si cada índice aparece en `matchedIdx`.

También se comprobó «El gato mira al gato junto al río.» → «río»: coincidencia solo en índice 7, score 1. El problema no requiere un proveedor de voz que alucine: basta una entrada aislada que coincide con una palabra final.

La reproducción se conserva en [REPRODUCCION-MATCHER.json](REPRODUCCION-MATCHER.json). No constituye una prueba end-to-end de audio; demuestra la entrada/salida del matcher y documenta la consecuencia del código consumidor.

## Qué se puede reutilizar

La abstracción de voz, los modelos preparados, la captura en memoria, la separación de paquetes, parte de la normalización, la alineación de secuencias, la máquina de sesión, las anclas estables de fragmentos y la ayuda TTS tienen valor. La recomendación no es reescribir toda la app.

La integración debe conservar el lector manual y su progreso, introducir capacidades y revisiones donde faltan y usar pruebas que ataquen los falsos avances. Un transcriptor mejor no compensa un consumidor que interpreta de forma incorrecta sus resultados.

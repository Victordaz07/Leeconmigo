/**
 * Piezas PURAS del reconocimiento (sin navegador ni módulos nativos): las usa la app nativa (`apps/mobile`, whisper.rn)
 * sin arrastrar las dependencias web de `WhisperSpeechEngine`. Importar con `@lee-conmigo/speech-engine/core`.
 */
export { AudioRingBuffer } from './whisper/audio-ring.ts';
export { FRAME_MS, FRAME_SAMPLES, SAMPLE_RATE } from './whisper/config.ts';
export { EnergyVad } from './whisper/energy-vad.ts';
export { base64ToBytes, int16BytesToFloat32, pcm16Base64ToFloat32 } from './whisper/pcm.ts';
export { DEFAULT_SEGMENTER, UtteranceSegmenter, type SegmenterEvent, type SegmenterOptions } from './whisper/segmenter.ts';
export { DEFAULT_TIMELINE, SpeechTimeline, type TimelineOptions } from './whisper/speech-timeline.ts';
export { cleanTranscript } from './whisper/transcript.ts';

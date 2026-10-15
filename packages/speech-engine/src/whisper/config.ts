/**
 * Constantes y parámetros por defecto de la prueba.
 * Los valores marcados como "ajustable" se pueden cambiar desde el panel "Parámetros"
 * de la página (se guardan en localStorage del navegador, nunca salen del dispositivo).
 */

export const SAMPLE_RATE = 16000;

/** Tamaño de cada frame que sale del AudioWorklet y entra al VAD (32 ms a 16 kHz). */
export const FRAME_SAMPLES = 512;
export const FRAME_MS = (FRAME_SAMPLES / SAMPLE_RATE) * 1000; // 32 ms

/** Ventanas que se envían a Whisper: ~5 s con solape de ~1 s (=> una ventana nueva cada ~4 s). */
export const WINDOW_S = 5;
export const OVERLAP_S = 1;
export const WINDOW_FRAMES = Math.round((WINDOW_S * SAMPLE_RATE) / FRAME_SAMPLES); // 156
export const STRIDE_FRAMES = Math.round(((WINDOW_S - OVERLAP_S) * SAMPLE_RATE) / FRAME_SAMPLES); // 125

/** Audio que se conserva en memoria (anillo). Lo más viejo se sobrescribe = se descarta. */
export const RING_SECONDS = 20;

export type Language = 'es' | 'en';
export type BackendChoice = 'auto' | 'webgpu' | 'wasm';
export type Backend = 'webgpu' | 'wasm';
export type VadKind = 'silero' | 'energy';
export type ModelKey = 'tiny' | 'base';

export const LANGUAGES: Record<Language, { label: string; whisperName: string }> = {
  es: { label: 'Español', whisperName: 'spanish' },
  en: { label: 'English', whisperName: 'english' },
};

/**
 * Modelos Whisper MULTILINGÜES (no ".en") convertidos a ONNX por la comunidad de Hugging Face.
 * approxMB = tamaño de descarga aproximado según el backend (encoder + decoder), medido en el Hub.
 */
export const MODELS: Record<ModelKey, { id: string; label: string; approxMB: Record<Backend, number> }> = {
  tiny: { id: 'onnx-community/whisper-tiny', label: 'whisper-tiny (multilingüe)', approxMB: { webgpu: 120, wasm: 41 } },
  base: { id: 'onnx-community/whisper-base', label: 'whisper-base (multilingüe)', approxMB: { webgpu: 206, wasm: 77 } },
};

/**
 * Precisión (dtype) de cada módulo ONNX según el backend:
 *  - WebGPU: encoder fp32 + decoder q4 (la combinación que usa el demo oficial de Whisper WebGPU).
 *  - WASM:   todo cuantizado a 8 bits (q8) => descarga y CPU mínimas.
 */
export const DTYPES: Record<Backend, string | Record<string, string>> = {
  webgpu: { encoder_model: 'fp32', decoder_model_merged: 'q4' },
  wasm: 'q8',
};

/** Tamaño aproximado de los archivos del runtime (ONNX Runtime WASM + modelo Silero VAD), en MB. */
export const RUNTIME_APPROX_MB = { ortWhisper: 27, ortVad: 14, silero: 2.3 };

/** Parámetros ajustables desde la UI. */
export interface Params {
  /** Probabilidad Silero a partir de la cual un frame cuenta como voz. */
  vadOnThreshold: number;
  /** Probabilidad por debajo de la cual el frame deja de contar como voz (histéresis). */
  vadOffThreshold: number;
  /** ms de voz mínimos dentro de una ventana para enviarla a Whisper; si hay menos => "bloqueado por VAD". */
  minWindowSpeechMs: number;
  /** Puntaje mínimo (0-1) de coincidencia con el texto para que una ventana cuente como lectura válida. */
  minScore: number;
  /** Palabras coincidentes mínimas en la ventana. */
  minMatchedWords: number;
  /** Similitud mínima (0-1) entre dos palabras para considerarlas la misma (tolera pronunciación imperfecta). */
  wordSimilarity: number;
  /** ms sin lectura válida tras los cuales el temporizador se pausa. */
  pauseAfterMs: number;
  /** ms consecutivos de lectura válida necesarios para reanudar. */
  resumeNeedMs: number;
  /** Silencio máximo dentro de la lectura que aún se acredita como lectura (respiros entre palabras). */
  holdMs: number;
  /** Ventanas de Whisper que pueden esperar en cola; si hay más se descarta la más vieja. */
  maxPendingWindows: number;
  /** Hilos de WASM (0 = automático). Solo aplican con aislamiento COOP/COEP. */
  wasmThreads: number;
}

export const DEFAULT_PARAMS: Params = {
  vadOnThreshold: 0.5,
  vadOffThreshold: 0.35,
  minWindowSpeechMs: 500,
  minScore: 0.5,
  minMatchedWords: 2,
  wordSimilarity: 0.7,
  pauseAfterMs: 10_000,
  resumeNeedMs: 3_000,
  holdMs: 1_500,
  maxPendingWindows: 1,
  wasmThreads: 0,
};

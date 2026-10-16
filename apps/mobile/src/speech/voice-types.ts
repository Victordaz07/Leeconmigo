/** Tipos compartidos del motor de voz nativo (y de su versión web, que no tiene voz). */
import type { SpeechEngine, Unsubscribe } from '@lee-conmigo/contracts';

export type VoiceModel = 'tiny' | 'base';

/** Estado grueso, solo para la prueba de voz (el contrato `SpeechEngine` no lo pide). */
export type VoiceStatus = 'idle' | 'requesting-mic' | 'loading-model' | 'ready' | 'stopped' | 'error';

/** Una frase detectada: para medir en la prueba de voz (RN-03). Nunca contiene audio. */
export interface VoiceUtterance {
  /** Duración del audio de la frase (ms). */
  audioMs: number;
  /** Cuánto tardó Whisper en transcribirla (ms). */
  transcribeMs: number;
  text: string;
  /** El detector de voz (Silero) dijo que no era voz: no se envió a Whisper. */
  skipped: boolean;
}

/** Contadores de diagnóstico de la prueba de voz: dicen en qué paso se queda la voz si no aparece texto. */
export interface VoiceDiagnostics {
  /** Segundos de audio que han llegado del micrófono (si no sube, el micrófono no entrega nada). */
  audioSeconds: number;
  /** Nivel del último trozo de audio, 0–1 (para un medidor). */
  level: number;
  /** Frases que el detector cortó. */
  detected: number;
  /** Frases que Silero descartó por no ser voz. */
  skipped: number;
  /** Frases que se perdieron (el modelo aún cargaba, o la cola estaba llena). */
  dropped: number;
  /** Frases transcritas. */
  transcribed: number;
  /** ¿Está Whisper trabajando ahora mismo? */
  transcribing: boolean;
  /** Frases esperando a Whisper. */
  queued: number;
  errors: number;
}

export interface NativeVoiceEngine extends SpeechEngine {
  onDiagnostics(cb: (d: VoiceDiagnostics) => void): Unsubscribe;
  getStatus(): VoiceStatus;
  onStatus(cb: (s: VoiceStatus) => void): Unsubscribe;
  onUtterance(cb: (u: VoiceUtterance) => void): Unsubscribe;
}

export interface NativeVoiceOptions {
  model?: VoiceModel;
}

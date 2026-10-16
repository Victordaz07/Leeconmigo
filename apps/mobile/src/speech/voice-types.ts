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

export interface NativeVoiceEngine extends SpeechEngine {
  getStatus(): VoiceStatus;
  onStatus(cb: (s: VoiceStatus) => void): Unsubscribe;
  onUtterance(cb: (u: VoiceUtterance) => void): Unsubscribe;
}

export interface NativeVoiceOptions {
  model?: VoiceModel;
}

/**
 * Contrato del motor de voz (docs/02-ARCHITECTURE.md). Regla no negociable: la UI y el ReadingEngine
 * NUNCA dependen de Google Speech, Android SpeechRecognizer, Whisper ni ningún proveedor concreto:
 * solo de esta interfaz. Cambiar de proveedor no debe requerir reconstruir la app.
 *
 * NOTA de nombres: los docs usan `SpeechRecognizer` (02), `SpeechEngine` (CLAUDE.md, 08) y
 * `SpeechProvider`. Aquí `SpeechEngine` es la interfaz que implementan todos los proveedores
 * (FakeSpeechEngine, AndroidSpeechProvider, WhisperProvider...). Pendiente de confirmar la nomenclatura.
 *
 * PRIVACIDAD (docs/07): el audio no se persiste ni sale del dispositivo. Esta interfaz solo entrega
 * TEXTO temporal; nunca audio.
 */

export type Unsubscribe = () => void;

export interface SpeechResult {
  text: string;
  isFinal: boolean;
  /** 0–1 si el proveedor la entrega. */
  confidence?: number;
  /** Instante (ms desde `start`) al que corresponde el resultado. */
  atMs: number;
}

export type SpeechErrorCode = 'permission-denied' | 'not-available' | 'network-required' | 'unknown';

export interface SpeechError {
  code: SpeechErrorCode;
  message: string;
}

export interface SpeechEngine {
  start(language: string): Promise<void>;
  stop(): Promise<void>;
  onPartialResult(cb: (r: SpeechResult) => void): Unsubscribe;
  onFinalResult(cb: (r: SpeechResult) => void): Unsubscribe;
  /** El VAD detecta voz (true) o silencio (false). No dice si es lectura. */
  onVoiceActivity(cb: (active: boolean) => void): Unsubscribe;
  onError(cb: (e: SpeechError) => void): Unsubscribe;
  /** Si el reconocimiento puede hacerse en el dispositivo (sin enviar audio fuera) para ese idioma. */
  isOnDeviceAvailable(language: string): Promise<boolean>;
}

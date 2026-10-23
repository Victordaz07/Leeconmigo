import type { SpeechEngine, Unsubscribe } from '@lee-conmigo/contracts';
import type { VoiceStatus } from './voice-types';

/** The session layer sees only this contract; it does not import a native SDK. */
export interface ReadingVoice extends SpeechEngine {
  onStatus(cb: (status: VoiceStatus) => void): Unsubscribe;
  getStatus(): VoiceStatus;
  /** False when native shutdown was not acknowledged; no other provider may acquire capture. */
  isMicrophoneReleased?(): boolean;
}
export type ReadingVoiceProvider = 'android' | 'whisper';

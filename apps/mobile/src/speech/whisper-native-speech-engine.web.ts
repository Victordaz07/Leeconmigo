/**
 * En el navegador (vista web de desarrollo) no hay voz nativa: whisper.rn y el micrófono nativo solo existen en Android/iOS.
 * Mismo API que la versión nativa; `start` avisa que no está disponible (falla cerrado, D1) y nunca usa la nube.
 */
import type { SpeechError, SpeechResult, Unsubscribe } from '@lee-conmigo/contracts';
import type { NativeVoiceEngine, NativeVoiceOptions, VoiceDiagnostics, VoiceStatus, VoiceUtterance } from './voice-types';

export function isNativeVoiceSupported(): boolean {
  return false;
}

export class WhisperNativeSpeechEngine implements NativeVoiceEngine {
  private errorCbs: ((e: SpeechError) => void)[] = [];
  private statusCbs: ((s: VoiceStatus) => void)[] = [];
  private status: VoiceStatus = 'idle';

  constructor(_opts: NativeVoiceOptions = {}) {}

  async start(): Promise<void> {
    this.status = 'error';
    this.statusCbs.forEach((cb) => cb('error'));
    this.errorCbs.forEach((cb) => cb({ code: 'not-available', message: 'La voz solo funciona en la app instalada (Android o iPad).' }));
  }
  async stop(): Promise<void> {}
  onPartialResult(_cb: (r: SpeechResult) => void): Unsubscribe {
    return () => {};
  }
  onFinalResult(_cb: (r: SpeechResult) => void): Unsubscribe {
    return () => {};
  }
  onVoiceActivity(_cb: (active: boolean) => void): Unsubscribe {
    return () => {};
  }
  onError(cb: (e: SpeechError) => void): Unsubscribe {
    this.errorCbs.push(cb);
    return () => (this.errorCbs = this.errorCbs.filter((c) => c !== cb));
  }
  onStatus(cb: (s: VoiceStatus) => void): Unsubscribe {
    this.statusCbs.push(cb);
    return () => (this.statusCbs = this.statusCbs.filter((c) => c !== cb));
  }
  onUtterance(_cb: (u: VoiceUtterance) => void): Unsubscribe {
    return () => {};
  }
  onDiagnostics(_cb: (d: VoiceDiagnostics) => void): Unsubscribe {
    return () => {};
  }
  getStatus(): VoiceStatus {
    return this.status;
  }
  async isOnDeviceAvailable(): Promise<boolean> {
    return false;
  }
}

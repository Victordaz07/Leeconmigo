import type { SpeechError, SpeechResult, Unsubscribe } from '@lee-conmigo/contracts';
import type { ExpoSpeechRecognitionNativeEventMap, ExpoSpeechRecognitionModule } from 'expo-speech-recognition';
import type { ReadingVoice } from './reading-voice';
import type { VoiceStatus } from './voice-types';

/** Injected bridge makes privacy, cancellation and late native events testable without a microphone. */
export type AndroidRecognitionBridge = Pick<typeof ExpoSpeechRecognitionModule,
  'supportsOnDeviceRecognition' | 'getSupportedLocales' | 'requestPermissionsAsync' | 'start' | 'abort' | 'addListener'>;

export class AndroidLocalRecognition implements ReadingVoice {
  private status: VoiceStatus = 'idle';
  private generation = 0;
  private opened = false;
  private unsafe = false;
  private stopping: Promise<void> = Promise.resolve();
  private subscriptions: { remove(): void }[] = [];
  private startedAt = 0;
  private lastFinalKey: string | null = null;
  private statusCbs = new Set<(s: VoiceStatus) => void>();
  private finalCbs = new Set<(r: SpeechResult) => void>();
  private partialCbs = new Set<(r: SpeechResult) => void>();
  private voiceCbs = new Set<(active: boolean) => void>();
  private errorCbs = new Set<(e: SpeechError) => void>();

  constructor(private readonly bridge: AndroidRecognitionBridge, private readonly apiLevel: number, private readonly now = Date.now) {}

  async isOnDeviceAvailable(language: string): Promise<boolean> {
    if (this.apiLevel < 33 || !this.bridge.supportsOnDeviceRecognition()) return false;
    const { installedLocales } = await this.bridge.getSupportedLocales({});
    return installedLocales.some(locale => locale.toLowerCase().split(/[-_]/)[0] === language.split(/[-_]/)[0]);
  }

  async start(language: string): Promise<void> {
    if (this.opened) return;
    const languageCode = language.toLowerCase().split(/[-_]/)[0];
    const generation = ++this.generation;
    await this.stopping;
    if (generation !== this.generation) return;
    if (this.unsafe) { this.fail('not-available'); return; }
    this.setStatus('loading-model');
    try {
      if (this.apiLevel < 33 || !this.bridge.supportsOnDeviceRecognition()) { this.fail('not-available'); return; }
      // Probe the actual on-device service, never the generic/default network recognizer.
      const { installedLocales } = await this.bridge.getSupportedLocales({});
      if (generation !== this.generation) return;
      const locales = installedLocales.filter(locale => locale.toLowerCase().split(/[-_]/)[0] === languageCode);
      const locale = locales.find(value => value.toLowerCase() === `${languageCode}-us`) ?? locales[0];
      if (!locale) { this.fail('not-available'); return; }
      this.setStatus('requesting-mic');
      const permission = await this.bridge.requestPermissionsAsync();
      if (generation !== this.generation) return;
      if (!permission.granted) { this.fail('permission-denied'); return; }
      this.startedAt = this.now();
      this.lastFinalKey = null;
      const listen = <K extends keyof ExpoSpeechRecognitionNativeEventMap>(event: K, callback: (value: ExpoSpeechRecognitionNativeEventMap[K]) => void) => {
        const listener = ((value: ExpoSpeechRecognitionNativeEventMap[K]) => {
          if (generation === this.generation) callback(value);
        }) as { [E in keyof ExpoSpeechRecognitionNativeEventMap]: (value: ExpoSpeechRecognitionNativeEventMap[E]) => void }[K];
        this.subscriptions.push(this.bridge.addListener(event, listener));
      };
      listen('start', () => this.setStatus('ready'));
      listen('speechstart', () => this.voiceCbs.forEach(cb => cb(true)));
      listen('speechend', () => this.voiceCbs.forEach(cb => cb(false)));
      listen('result', event => {
        const best = event.results[0];
        if (!best?.transcript || !this.opened) return;
        const spans = best.segments.filter(s => s.endTimeMillis > s.startTimeMillis);
        if (event.isFinal && spans.length) {
          const key = `${best.transcript}:${spans[0].startTimeMillis}:${spans.at(-1)!.endTimeMillis}`;
          if (key === this.lastFinalKey) return;
          this.lastFinalKey = key;
        }
        const duration = spans.reduce((sum, span) => sum + span.endTimeMillis - span.startTimeMillis, 0);
        const result: SpeechResult = { text: best.transcript, ...(duration > 0 ? { audioDurationMs: duration } : {}), isFinal: event.isFinal, atMs: this.now() - this.startedAt, ...(best.confidence >= 0 ? { confidence: best.confidence } : {}) };
        (event.isFinal ? this.finalCbs : this.partialCbs).forEach(cb => cb(result));
      });
      listen('end', () => { this.opened = false; if (this.status !== 'error') this.setStatus('stopped'); });
      listen('error', event => {
        if (event.error === 'no-speech' || event.error === 'speech-timeout' || event.error === 'aborted') return;
        this.fail(event.error === 'not-allowed' ? 'permission-denied' : 'not-available');
      });
      this.opened = true;
      this.bridge.start({ lang: locale, interimResults: true, continuous: true, maxAlternatives: 1,
        requiresOnDeviceRecognition: true, addsPunctuation: false, recordingOptions: { persist: false },
        ...(this.apiLevel >= 34 ? { androidIntentOptions: { EXTRA_REQUEST_WORD_TIMING: true, EXTRA_REQUEST_WORD_CONFIDENCE: true } } : {}) });
    } catch {
      if (generation === this.generation) this.fail('not-available');
    }
  }

  stop(): Promise<void> {
    ++this.generation; // Reject late hypotheses synchronously, including while a permission dialog is open.
    this.subscriptions.splice(0).forEach(sub => sub.remove());
    this.voiceCbs.forEach(cb => cb(false));
    if (!this.opened) return this.stopping;
    this.opened = false;
    this.stopping = new Promise<void>(resolve => {
      // Keep the native ownership barrier through abort/end; never accept old results in a new page.
      const end = this.bridge.addListener('end', () => { clearTimeout(timeout); end.remove(); this.unsafe = false; resolve(); });
      const timeout = setTimeout(() => { end.remove(); this.unsafe = true; this.fail('not-available'); resolve(); }, 1800);
      try { this.bridge.abort(); } catch { clearTimeout(timeout); end.remove(); this.unsafe = true; this.fail('not-available'); resolve(); }
    }).then(() => { if (!this.unsafe) this.setStatus('stopped'); });
    return this.stopping;
  }

  isMicrophoneReleased(): boolean { return !this.opened && !this.unsafe; }
  getStatus(): VoiceStatus { return this.status; }
  onStatus(cb: (s: VoiceStatus) => void): Unsubscribe { this.statusCbs.add(cb); return () => { this.statusCbs.delete(cb); }; }
  onFinalResult(cb: (r: SpeechResult) => void): Unsubscribe { this.finalCbs.add(cb); return () => { this.finalCbs.delete(cb); }; }
  onPartialResult(cb: (r: SpeechResult) => void): Unsubscribe { this.partialCbs.add(cb); return () => { this.partialCbs.delete(cb); }; }
  onVoiceActivity(cb: (active: boolean) => void): Unsubscribe { this.voiceCbs.add(cb); return () => { this.voiceCbs.delete(cb); }; }
  onError(cb: (e: SpeechError) => void): Unsubscribe { this.errorCbs.add(cb); return () => { this.errorCbs.delete(cb); }; }
  private setStatus(status: VoiceStatus): void { this.status = status; this.statusCbs.forEach(cb => cb(status)); }
  private fail(code: SpeechError['code']): void {
    this.setStatus('error');
    this.errorCbs.forEach(cb => cb({ code, message: code === 'permission-denied' ? 'Microphone permission denied' : 'Strict local recognition unavailable' }));
  }
}

/** Session orchestration, independent of React and every speech SDK. Transcript strings never enter persistence. */
import type { SpeechError, SpeechResult, Unsubscribe } from '@lee-conmigo/contracts';
import { ReadingFollower, type FollowSnapshot } from '@lee-conmigo/reading-engine';
import type { ReadingVoice } from '../speech/reading-voice';
import type { VoiceStatus } from '../speech/voice-types';

export interface TogetherState extends FollowSnapshot {
  status: VoiceStatus;
  error: SpeechError['code'] | null;
}
export class ReadTogetherController {
  private follower = new ReadingFollower([]);
  private generation = 0;
  private accepting = false;
  private active = false;
  private disposed = false;
  private status: VoiceStatus = 'idle';
  private error: SpeechError['code'] | null = null;
  private pageKey: string | null = null;
  private retryTicket = 0;
  private lastPartialAt: number | null = null;
  private pendingMs = 0;
  private listeners = new Set<(state: TogetherState) => void>();
  private readonly unsubs: Unsubscribe[];

  constructor(private readonly voice: ReadingVoice, private readonly credit: (ms: number) => void, private readonly now = Date.now) {
    this.unsubs = [
      voice.onPartialResult(result => this.hear(result)),
      voice.onFinalResult(result => this.hear(result)),
      voice.onError(error => {
        if (!this.active) return;
        this.error = error.code;
        this.accepting = false;
        this.status = 'error';
        this.emit();
        void this.voice.stop();
      }),
      voice.onStatus(status => {
        if (!this.active || this.error) return;
        this.status = status;
        if (status === 'stopped' || status === 'error') this.accepting = false;
        this.emit();
      }),
    ];
  }

  snapshot(): TogetherState { return { ...this.follower.snapshot(), status: this.status, error: this.error }; }
  subscribe(callback: (state: TogetherState) => void): Unsubscribe {
    this.listeners.add(callback);
    callback(this.snapshot());
    return () => { this.listeners.delete(callback); };
  }

  /** Call for a page, lifecycle or user-intent change. Stop invalidates native callbacks synchronously. */
  async configure(pageKey: string, words: readonly string[], language: string, active: boolean, retryTicket = 0): Promise<void> {
    const generation = ++this.generation;
    this.active = false;
    this.accepting = false;
    this.lastPartialAt = null;
    this.pendingMs = 0;
    if (this.pageKey !== pageKey) {
      this.pageKey = pageKey;
      this.follower = new ReadingFollower(words);
    } else this.follower.discardHypothesis();
    if (retryTicket !== this.retryTicket) { this.error = null; this.retryTicket = retryTicket; }
    this.status = this.error ? 'error' : active ? 'loading-model' : 'stopped';
    this.emit();
    await this.voice.stop();
    if (this.disposed || generation !== this.generation || !active || this.error) return;
    this.active = true;
    this.accepting = true;
    await this.voice.start(language).catch(() => {
      if (generation !== this.generation) return;
      this.error = 'not-available'; this.status = 'error'; this.accepting = false; this.emit();
      void this.voice.stop();
    });
  }

  /** A synchronous gate plus an asynchronous hardware barrier, used BEFORE any TTS. */
  async pause(): Promise<void> {
    ++this.generation;
    this.active = false;
    this.accepting = false;
    this.pendingMs = 0;
    this.lastPartialAt = null;
    this.follower.discardHypothesis();
    this.status = 'stopped'; this.emit();
    await this.voice.stop();
  }

  dispose(): void {
    this.disposed = true;
    void this.pause();
    this.unsubs.forEach(off => off());
    this.listeners.clear();
  }

  private hear(result: SpeechResult): void {
    if (!this.accepting || !this.active || this.disposed) return;
    const state = this.follower.accept(result.text, result.isFinal, result.atMs);
    const t = this.now();
    const aligned = state.preview.length > 0 || state.newlyConfirmed.length > 0;
    // Consecutive matching hypotheses provide bounded timing evidence, never the elapsed idle time.
    if (aligned && this.lastPartialAt !== null) {
      const dt = t - this.lastPartialAt;
      if (dt >= 0 && dt <= 1500) this.pendingMs += dt;
    }
    this.lastPartialAt = !result.isFinal && aligned ? t : null;
    if (!aligned) this.pendingMs = 0;
    if (result.isFinal) {
      if (state.newlyConfirmed.length) {
        const duration = result.audioDurationMs ?? this.pendingMs;
        const ms = Math.max(0, Math.min(Number.isFinite(duration) ? duration : 0, state.newlyConfirmed.length * 2000, 10000));
        if (ms) this.credit(ms);
      }
      this.pendingMs = 0;
    }
    this.emit(state);
  }
  private emit(state: FollowSnapshot = this.follower.snapshot()): void {
    const value = { ...state, status: this.status, error: this.error };
    this.listeners.forEach(callback => callback(value));
  }
}

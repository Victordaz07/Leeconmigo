import type { KV } from '../persist/store';
export const VOICE_PHASES = ['start', 'checking-permission', 'requesting-permission', 'permission-granted', 'permission-denied', 'permission-blocked', 'permission-unavailable', 'loading', 'capturing', 'result', 'stopped', 'error'] as const;
export type VoicePhase = typeof VOICE_PHASES[number];
export interface VoiceAttempt { version: string; provider: 'android' | 'whisper' | null; steps: VoicePhase[] }
export const VOICE_JOURNAL_KEY = 'kitewise.v1.voice-diagnostics';
/** One bounded list of program stages. No API accepts audio, language, names, story IDs or recognized words. */
export class VoiceJournal {
  readonly previous: VoiceAttempt | null;
  private attempt: VoiceAttempt;
  private generation = 0;
  constructor(private readonly kv: KV, private readonly version: string) {
    this.previous = this.read();
    this.attempt = { version, provider: null, steps: [] };
  }
  begin(provider: 'android' | 'whisper'): number {
    ++this.generation;
    this.attempt = { version: this.version, provider, steps: [] };
    this.record('start');
    return this.generation;
  }
  record(phase: VoicePhase, generation = this.generation): void {
    if (generation !== this.generation || !VOICE_PHASES.includes(phase)) return;
    if (this.attempt.steps.at(-1) === phase) return;
    this.attempt.steps = [...this.attempt.steps, phase].slice(-12);
    try { this.kv.set(VOICE_JOURNAL_KEY, JSON.stringify(this.attempt)); } catch { /* Diagnostics cannot break reading. */ }
  }
  current(): VoiceAttempt | null { return this.attempt.steps.length ? { ...this.attempt, steps: [...this.attempt.steps] } : null; }
  private read(): VoiceAttempt | null {
    try {
      const raw = JSON.parse(this.kv.get(VOICE_JOURNAL_KEY) ?? 'null') as Partial<VoiceAttempt> | null;
      if (!raw || typeof raw.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(raw.version) || !Array.isArray(raw.steps)) return null;
      const steps = raw.steps.filter((phase): phase is VoicePhase => VOICE_PHASES.includes(phase)).slice(-12);
      if (!steps.length) return null;
      return { version: raw.version, provider: raw.provider === 'android' || raw.provider === 'whisper' ? raw.provider : null, steps };
    } catch { return null; }
  }
}

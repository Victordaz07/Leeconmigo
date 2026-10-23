import { describe, expect, it } from 'vitest';
import type { SpeechError, SpeechResult, Unsubscribe } from '@lee-conmigo/contracts';
import { ReadTogetherController } from '../src/session/read-together-controller';
import type { ReadingVoice } from '../src/speech/reading-voice';
import type { VoiceStatus } from '../src/speech/voice-types';

class FakeVoice implements ReadingVoice {
  finals = new Set<(r: SpeechResult) => void>(); partials = new Set<(r: SpeechResult) => void>();
  statuses = new Set<(status: VoiceStatus) => void>(); errors = new Set<(e: SpeechError) => void>();
  starts = 0; stops = 0;
  pendingStop: Promise<void> = Promise.resolve();
  async start() { this.starts++; this.statuses.forEach(cb => cb('ready')); }
  stop() { this.stops++; return this.pendingStop; }
  getStatus(): VoiceStatus { return 'ready'; }
  async isOnDeviceAvailable() { return true; }
  onFinalResult(cb: (r: SpeechResult) => void): Unsubscribe { this.finals.add(cb); return () => { this.finals.delete(cb); }; }
  onPartialResult(cb: (r: SpeechResult) => void): Unsubscribe { this.partials.add(cb); return () => { this.partials.delete(cb); }; }
  onStatus(cb: (s: VoiceStatus) => void): Unsubscribe { this.statuses.add(cb); return () => { this.statuses.delete(cb); }; }
  onError(cb: (e: SpeechError) => void): Unsubscribe { this.errors.add(cb); return () => { this.errors.delete(cb); }; }
  onVoiceActivity(): Unsubscribe { return () => {}; }
  hear(text: string, atMs = 1000, isFinal = true, audioDurationMs?: number) {
    (isFinal ? this.finals : this.partials).forEach(cb => cb({ text, atMs, isFinal, audioDurationMs }));
  }
}
const setup = () => {
  let now = 0;
  const credits: number[] = [];
  const voice = new FakeVoice();
  const controller = new ReadTogetherController(voice, ms => credits.push(ms), () => now);
  return { voice, controller, credits, clock: (t: number) => { now = t; } };
};
const words = ['la', 'cometa', 'roja', 'volaba', 'alto'];

describe('read together: evidence and microphone lifecycle', () => {
  it('only final matches credit time, bounded by matched words', async () => {
    const { voice, controller, credits } = setup();
    await controller.configure('a', words, 'es', true);
    voice.hear('la cometa', 1, false, 999999);
    expect(credits).toEqual([]);
    voice.hear('la cometa', 2, true, 999999);
    expect(credits).toEqual([4000]);
    voice.hear('la cometa', 2, true, 999999);
    expect(credits).toEqual([4000]);
  });
  it('does not credit noise, idle time, skipped words or an app speaking during help', async () => {
    const { voice, controller, credits } = setup();
    await controller.configure('a', words, 'es', true);
    voice.hear('alto', 1, true, 8000);
    expect(credits).toEqual([]);
    await controller.pause();
    voice.hear('la cometa roja volaba alto', 2, true, 8000);
    expect(controller.snapshot().confirmed).toEqual([]);
    expect(credits).toEqual([]);
  });
  it('waits for the hardware stop barrier before opening a new page', async () => {
    const { voice, controller } = setup();
    await controller.configure('a', words, 'es', true);
    let stopped!: () => void;
    voice.pendingStop = new Promise(resolve => { stopped = resolve; });
    const next = controller.configure('b', ['otra', 'historia'], 'es', true);
    voice.hear('otra historia');
    expect(controller.snapshot().confirmed).toEqual([]);
    expect(voice.starts).toBe(1);
    stopped(); await next;
    expect(voice.starts).toBe(2);
    voice.hear('otra historia');
    expect(controller.snapshot().complete).toBe(true);
  });
  it('a pause during pending start prevents that start', async () => {
    const { voice, controller } = setup();
    let stopped!: () => void;
    voice.pendingStop = new Promise(resolve => { stopped = resolve; });
    const start = controller.configure('a', words, 'es', true);
    const pause = controller.pause();
    stopped(); await Promise.all([start, pause]);
    expect(voice.starts).toBe(0);
  });
  it('retains confirmed words across help and clears a partial hypothesis', async () => {
    const { voice, controller } = setup();
    await controller.configure('a', words, 'es', true);
    voice.hear('la cometa', 1);
    voice.hear('roja volaba', 2, false);
    await controller.pause();
    expect(controller.snapshot().confirmed).toEqual([0, 1]);
    expect(controller.snapshot().preview).toEqual([]);
    await controller.configure('a', words, 'es', true);
    voice.hear('roja volaba alto', 3);
    expect(controller.snapshot().complete).toBe(true);
  });
  it('permission/service errors close the gate and can be retried explicitly', async () => {
    const { voice, controller } = setup();
    await controller.configure('a', words, 'es', true);
    voice.errors.forEach(cb => cb({ code: 'permission-denied', message: 'denied' }));
    voice.hear('la cometa roja');
    expect(controller.snapshot().error).toBe('permission-denied');
    expect(controller.snapshot().confirmed).toEqual([]);
    await controller.configure('a', words, 'es', true);
    voice.hear('la cometa roja');
    expect(controller.snapshot().error).toBe(null);
    expect(controller.snapshot().confirmed).toEqual([0, 1, 2]);
  });
  it('bounds fallback timing to consecutive matching hypotheses, never a long silence', async () => {
    const { voice, controller, credits, clock } = setup();
    await controller.configure('a', words, 'es', true);
    clock(10); voice.hear('la', 10, false);
    clock(610); voice.hear('la cometa', 610, false);
    clock(20000); voice.hear('la cometa', 20000, true);
    expect(credits).toEqual([600]);
  });
  it('unmount detaches listeners and rejects pending recognition', async () => {
    const { voice, controller, credits } = setup();
    await controller.configure('a', words, 'es', true);
    controller.dispose();
    voice.hear('la cometa roja', 1, true, 3000);
    expect(voice.finals.size).toBe(0);
    expect(credits).toEqual([]);
  });
});

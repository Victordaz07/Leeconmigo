import { describe, expect, it, vi } from 'vitest';
import { withMicrophoneLease } from '../src/speech/microphone-lease';
import type { ReadingVoice } from '../src/speech/reading-voice';
const make = () => {
  const engine = {
    start: vi.fn(async (_language: string) => {}), stop: vi.fn(async () => {}),
    onStatus: () => () => {}, getStatus: () => 'idle', isOnDeviceAvailable: async () => true,
    onFinalResult: () => () => {}, onPartialResult: () => () => {}, onVoiceActivity: () => () => {}, onError: () => () => {},
  } satisfies ReadingVoice;
  const start = engine.start; const stop = engine.stop;
  return { engine: withMicrophoneLease(engine), start, stop };
};
describe('one microphone for reader and parent laboratory', () => {
  it('a new provider waits for the previous provider to release hardware', async () => {
    const a = make(); const b = make();
    await a.engine.start('es');
    let release!: () => void;
    a.stop.mockImplementation(() => new Promise(resolve => { release = resolve; }));
    const next = b.engine.start('en');
    await vi.waitFor(() => expect(a.stop).toHaveBeenCalled());
    expect(b.start).not.toHaveBeenCalled();
    release(); await next;
    expect(b.start).toHaveBeenCalled();
    await b.engine.stop();
  });
  it('simultaneous starts still acquire ownership in order', async () => {
    const a = make(); const b = make();
    await Promise.all([a.engine.start('es'), b.engine.start('en')]);
    expect(a.stop).toHaveBeenCalled();
    expect(b.start).toHaveBeenCalled();
    await b.engine.stop();
  });
  it('an unmounted screen cannot open the microphone after a pending lease', async () => {
    const a = make(); const b = make();
    await a.engine.start('es');
    let release!: () => void;
    a.stop.mockImplementation(() => new Promise(resolve => { release = resolve; }));
    const startB = b.engine.start('en');
    await vi.waitFor(() => expect(a.stop).toHaveBeenCalled());
    const stopB = b.engine.stop();
    release(); await Promise.all([startB, stopB]);
    expect(b.start).not.toHaveBeenCalled();
  });
});

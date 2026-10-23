import { afterEach, describe, expect, it, vi } from 'vitest';
import { AndroidLocalRecognition, type AndroidRecognitionBridge } from '../src/speech/android-local-recognition';
import type { ExpoSpeechRecognitionNativeEventMap } from 'expo-speech-recognition';
function setup(api = 36) {
  const events = new Map<string, Set<(event: never) => void>>();
  const emit = <K extends keyof ExpoSpeechRecognitionNativeEventMap>(name: K, event: ExpoSpeechRecognitionNativeEventMap[K]) => events.get(name)?.forEach(cb => cb(event as never));
  const bridge = {
    supportsOnDeviceRecognition: vi.fn(() => true),
    getSupportedLocales: vi.fn(async () => ({ locales: ['es-US', 'en-US'], installedLocales: ['es-US', 'en-US'] })),
    requestPermissionsAsync: vi.fn(async () => ({ granted: true })),
    start: vi.fn(), abort: vi.fn(() => { emit('end', null); }),
    addListener: (name: string, cb: (value: never) => void) => {
      if (!events.has(name)) events.set(name, new Set());
      events.get(name)!.add(cb);
      return { remove: () => events.get(name)!.delete(cb) };
    },
  };
  const engine = new AndroidLocalRecognition(bridge as unknown as AndroidRecognitionBridge, api, () => 1000);
  const results: string[] = []; const errors: string[] = [];
  engine.onFinalResult(result => results.push(result.text));
  engine.onError(error => errors.push(error.code));
  return { engine, bridge, emit, results, errors };
}
const result = (transcript: string, isFinal = true) => ({ isFinal, results: [{ transcript, confidence: .8, segments: [] }] });
afterEach(() => vi.useRealTimers());
describe('strict Android local speech', () => {
  it('never opens a generic recognizer on older Android versions', async () => {
    for (const api of [24, 30, 31, 32]) {
      const { engine, bridge, errors } = setup(api);
      await engine.start('es');
      expect(bridge.start).not.toHaveBeenCalled();
      expect(bridge.requestPermissionsAsync).not.toHaveBeenCalled();
      expect(errors).toEqual(['not-available']);
    }
  });
  it('requires an installed language, not just an online-supported language', async () => {
    const { engine, bridge } = setup();
    bridge.getSupportedLocales.mockResolvedValue({ locales: ['es-US'], installedLocales: ['en-US'] });
    await engine.start('es');
    expect(bridge.start).not.toHaveBeenCalled();
  });
  it('forces the native factory to local mode and disables persistence', async () => {
    const { engine, bridge } = setup();
    await engine.start('es');
    expect(bridge.start).toHaveBeenCalledWith(expect.objectContaining({ lang: 'es-US', requiresOnDeviceRecognition: true, recordingOptions: { persist: false }, continuous: true, interimResults: true }));
  });
  it('permission denial never opens capture', async () => {
    const { engine, bridge, errors } = setup();
    bridge.requestPermissionsAsync.mockResolvedValue({ granted: false });
    await engine.start('en');
    expect(bridge.start).not.toHaveBeenCalled(); expect(errors).toEqual(['permission-denied']);
  });
  it('cancels a pending permission request without opening capture later', async () => {
    const { engine, bridge } = setup();
    let grant!: (value: { granted: boolean }) => void;
    bridge.requestPermissionsAsync.mockImplementation(() => new Promise(resolve => { grant = resolve; }));
    const start = engine.start('es');
    await vi.waitFor(() => expect(bridge.requestPermissionsAsync).toHaveBeenCalled());
    await engine.stop(); grant({ granted: true }); await start;
    expect(bridge.start).not.toHaveBeenCalled();
  });
  it('keeps partial revisions distinct and ignores late callbacks after stop', async () => {
    const { engine, emit, results } = setup();
    const partials: string[] = [];
    engine.onPartialResult(r => partials.push(r.text));
    await engine.start('es'); emit('start', null);
    emit('result', result('la cometa roja', false));
    emit('result', result('la cometa', false));
    emit('result', result('la cometa'));
    await engine.stop(); emit('result', result('otra página'));
    expect(partials).toEqual(['la cometa roja', 'la cometa']);
    expect(results).toEqual(['la cometa']);
  });
  it('waits for native end on abort before restarting', async () => {
    const { engine, bridge, emit } = setup();
    await engine.start('es');
    bridge.abort.mockImplementation(() => {});
    const stop = engine.stop();
    const start = engine.start('en');
    await Promise.resolve(); expect(bridge.start).toHaveBeenCalledTimes(1);
    emit('end', null); await stop; await start;
    expect(bridge.start).toHaveBeenCalledTimes(2);
  });
  it('fails closed if native stop never acknowledges end', async () => {
    vi.useFakeTimers();
    const { engine, bridge } = setup();
    await engine.start('es'); bridge.abort.mockImplementation(() => {});
    const stop = engine.stop(); await vi.advanceTimersByTimeAsync(1800); await stop;
    await engine.start('en');
    expect(bridge.start).toHaveBeenCalledTimes(1);
    expect(engine.getStatus()).toBe('error');
  });
  it('does not call a cloud provider when local service support fails', async () => {
    const { engine, bridge, errors } = setup();
    bridge.getSupportedLocales.mockRejectedValue(new Error('unsupported'));
    await engine.start('es');
    expect(errors).toEqual(['not-available']); expect(bridge.start).not.toHaveBeenCalled();
  });
});

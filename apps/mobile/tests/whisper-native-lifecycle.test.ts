import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error -- Node-only test; the native application intentionally excludes Node globals.
import { Buffer } from 'node:buffer';
// @ts-expect-error -- Node-only test; the native application intentionally excludes Node globals.
import { createRequire } from 'node:module';
const nativeRequire = createRequire(import.meta.url);
const originalBinaryLoader = nativeRequire.extensions['.bin'];
beforeAll(() => { nativeRequire.extensions['.bin'] = (module: { exports: unknown }) => { module.exports = 1; }; });
afterAll(() => { if (originalBinaryLoader) nativeRequire.extensions['.bin'] = originalBinaryLoader; else delete nativeRequire.extensions['.bin']; });
const mocks = vi.hoisted(() => ({
  permission: vi.fn(async () => 'granted'),
  init: vi.fn(), start: vi.fn(), stop: vi.fn(async () => {}), remove: vi.fn(), on: vi.fn(),
  initWhisper: vi.fn(async () => ({})), initVad: vi.fn(async () => ({})),
}));
vi.mock('react-native', () => ({ Platform: { OS: 'android' }, PermissionsAndroid: { request: mocks.permission, PERMISSIONS: { RECORD_AUDIO: 'record' }, RESULTS: { GRANTED: 'granted' } } }));
vi.mock('../src/speech/microphone-access', () => ({ requestMicrophonePermission: async () => ({ granted: (await mocks.permission()) === 'granted' }) }));
vi.mock('@fugood/react-native-audio-pcm-stream', () => ({ default: { init: mocks.init, start: mocks.start, stop: mocks.stop, on: mocks.on } }));
vi.mock('whisper.rn/index', () => ({ initWhisper: mocks.initWhisper, initWhisperVad: mocks.initVad }));
beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); mocks.on.mockImplementation(() => ({ remove: mocks.remove })); });

describe('Whisper microphone startup cancellation', () => {
  it('does not open capture until both models are ready', async () => {
    let ready!: (value: object) => void;
    mocks.initWhisper.mockImplementationOnce(() => new Promise(resolve => { ready = resolve; }));
    const { WhisperNativeSpeechEngine } = await import('../src/speech/whisper-native-speech-engine');
    const engine = new WhisperNativeSpeechEngine();
    const start = engine.start('es');
    await vi.waitFor(() => expect(mocks.initWhisper).toHaveBeenCalled());
    expect(mocks.start).not.toHaveBeenCalled();
    ready({}); await start;
    expect(mocks.start).toHaveBeenCalledTimes(1);
    await engine.stop();
  });
  it('does not reopen capture when a cancelled model load finishes', async () => {
    let ready!: (value: object) => void;
    mocks.initWhisper.mockImplementationOnce(() => new Promise(resolve => { ready = resolve; }));
    const { WhisperNativeSpeechEngine } = await import('../src/speech/whisper-native-speech-engine');
    const engine = new WhisperNativeSpeechEngine();
    const start = engine.start('es');
    await vi.waitFor(() => expect(mocks.initWhisper).toHaveBeenCalled());
    await engine.stop(); ready({}); await start;
    expect(mocks.start).not.toHaveBeenCalled();
  });
  it('does not open capture if the child left during the permission dialog', async () => {
    let grant!: (value: string) => void;
    mocks.permission.mockImplementationOnce(() => new Promise(resolve => { grant = resolve; }));
    const { WhisperNativeSpeechEngine } = await import('../src/speech/whisper-native-speech-engine');
    const engine = new WhisperNativeSpeechEngine();
    const start = engine.start('en');
    await vi.waitFor(() => expect(mocks.permission).toHaveBeenCalled());
    await engine.stop(); grant('granted'); await start;
    expect(mocks.initWhisper).not.toHaveBeenCalled();
    expect(mocks.start).not.toHaveBeenCalled();
  });
});

it('cancels an in-flight Whisper job and never emits its old result into a new capture', async () => {
  let finish!: (value: { result: string }) => void;
  let onData!: (base64: string) => void;
  const stopJob = vi.fn(async () => { finish({ result: 'la cometa roja' }); });
  const transcribe = vi.fn(() => ({ stop: stopJob, promise: new Promise<{ result: string }>(resolve => { finish = resolve; }) }));
  mocks.initWhisper.mockResolvedValueOnce({ transcribeData: transcribe });
  mocks.initVad.mockResolvedValueOnce({ detectSpeechData: async () => [{ t0: 0, t1: 100 }] });
  mocks.on.mockImplementation((_event: string, callback: (data: string) => void) => { onData = callback; return { remove: mocks.remove }; });
  const { WhisperNativeSpeechEngine } = await import('../src/speech/whisper-native-speech-engine');
  const engine = new WhisperNativeSpeechEngine();
  const finals: string[] = [];
  engine.onFinalResult(result => finals.push(result.text));
  await engine.start('es');
  // Synthetic PCM is a pipeline stimulus, not a test of Whisper's acoustic accuracy.
  const pcm = Buffer.alloc(16000 * 2);
  for (let i = 0; i < 16000; i++) pcm.writeInt16LE(Math.round(8000 * Math.sin(i / 3)), i * 2);
  onData(pcm.toString('base64'));
  onData(Buffer.alloc(16000 * 2).toString('base64'));
  await vi.waitFor(() => expect(transcribe).toHaveBeenCalled());
  await engine.stop();
  expect(stopJob).toHaveBeenCalledTimes(1);
  expect(finals).toEqual([]);
  await engine.start('en');
  expect(finals).toEqual([]);
  await engine.stop();
});

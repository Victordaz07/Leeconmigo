import { afterEach, describe, expect, it, vi } from 'vitest';
const bridge = vi.hoisted(() => ({} as { getLastSpeechFailure?: () => string | null; getLastAppExitInfo?: () => unknown }));
vi.mock('expo-speech-recognition', () => ({ ExpoSpeechRecognitionModule: bridge }));
import { getLastAppExits, getVoiceFailureSummary } from '../src/speech/voice-failure-summary';
import { getVoiceFailureSummary as webSummary } from '../src/speech/voice-failure-summary.web';
afterEach(() => { delete bridge.getLastSpeechFailure; delete bridge.getLastAppExitInfo; });
describe('local failure summary compatibility', () => {
  it('works with an older native module without the optional diagnostic', () => {
    expect(getVoiceFailureSummary()).toBeNull();
  });
  it('does not propagate a diagnostic read error into settings', () => {
    bridge.getLastSpeechFailure = () => { throw new Error('storage unavailable'); };
    expect(getVoiceFailureSummary()).toBeNull();
  });
  it('exposes the local code supplied by the native module', () => {
    bridge.getLastSpeechFailure = () => 'java.lang.IllegalStateException\nRecorder.stop:123';
    expect(getVoiceFailureSummary()).toBe('java.lang.IllegalStateException\nRecorder.stop:123');
  });
  it('does not access native diagnostics on the web', () => {
    expect(webSummary()).toBeNull();
  });
});

it('keeps only numeric OS exit metadata, never private descriptions or traces', () => {
  bridge.getLastAppExitInfo = () => [{ reason: 5, status: 11, timestamp: 1000, description: 'PRIVATE', trace: 'PRIVATE' }, { reason: 'PRIVATE' }];
  expect(getLastAppExits()).toEqual([{ reason: 5, status: 11, timestamp: 1000 }]);
});

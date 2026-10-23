import { afterEach, describe, expect, it, vi } from 'vitest';
const bridge = vi.hoisted(() => ({} as { getLastSpeechFailure?: () => string | null }));
vi.mock('expo-speech-recognition', () => ({ ExpoSpeechRecognitionModule: bridge }));
import { getVoiceFailureSummary } from '../src/speech/voice-failure-summary';
import { getVoiceFailureSummary as webSummary } from '../src/speech/voice-failure-summary.web';
afterEach(() => { delete bridge.getLastSpeechFailure; });
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

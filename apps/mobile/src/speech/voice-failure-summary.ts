import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';

/** Optional extension of our pinned native wrapper; old builds safely return no report. */
export function getVoiceFailureSummary(): string | null {
  const bridge = ExpoSpeechRecognitionModule as typeof ExpoSpeechRecognitionModule & { getLastSpeechFailure?: () => string | null };
  try { return bridge.getLastSpeechFailure?.() ?? null; } catch { return null; }
}

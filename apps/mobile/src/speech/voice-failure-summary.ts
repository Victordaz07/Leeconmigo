import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';

/** Optional extension of our pinned native wrapper; old builds safely return no report. */
export function getVoiceFailureSummary(): string | null {
  const bridge = ExpoSpeechRecognitionModule as typeof ExpoSpeechRecognitionModule & { getLastSpeechFailure?: () => string | null };
  try { return bridge.getLastSpeechFailure?.() ?? null; } catch { return null; }
}

export interface AppExitInfo { reason: number; status: number; timestamp: number }
/** Read only OS reason/status/time, never tombstones, traces or descriptions. */
export function getLastAppExits(): AppExitInfo[] {
  const bridge = ExpoSpeechRecognitionModule as typeof ExpoSpeechRecognitionModule & { getLastAppExitInfo?: () => unknown };
  try {
    const rows = bridge.getLastAppExitInfo?.();
    if (!Array.isArray(rows)) return [];
    return rows.slice(0, 5).filter((row): row is AppExitInfo => row && Number.isInteger(row.reason) && Number.isInteger(row.status) && Number.isFinite(row.timestamp))
      .map(row => ({ reason: row.reason, status: row.status, timestamp: row.timestamp }));
  } catch { return []; }
}

import { Share } from 'react-native';
import { getLastAppExits, getVoiceFailureSummary } from './voice-failure-summary';
import { voiceAppVersion, voiceJournal } from './voice-journal-device';
import type { PermissionState } from './permission-gate';
/** Fixed program stages and OS codes only. Read locally; share only on an adult's explicit button press. */
export function buildVoiceSupportReport(permission: PermissionState): string {
  const lines = [`Kitewise ${voiceAppVersion}`, `microphone: ${permission}`];
  const previous = voiceJournal.previous;
  const current = voiceJournal.current();
  for (const [label, attempt] of [['previous', previous], ['current', current]] as const) {
    lines.push(attempt ? `${label}: ${attempt.version} / ${attempt.provider ?? '-'} / ${attempt.steps.join(' > ')}` : `${label}: -`);
  }
  const failure = getVoiceFailureSummary();
  lines.push(`java_failure: ${failure ?? '-'}`);
  for (const exit of getLastAppExits()) lines.push(`android_exit: reason=${exit.reason} status=${exit.status} time=${exit.timestamp}`);
  return lines.join('\n');
}
export async function shareVoiceSupportReport(report: string): Promise<void> {
  await Share.share({ message: report });
}

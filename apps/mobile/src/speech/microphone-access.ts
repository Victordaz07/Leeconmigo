import { Linking, Platform } from 'react-native';
import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';
import { MicrophonePermissionGate } from './permission-gate';
import { voiceJournal } from './voice-journal-device';
export const canManageMicrophonePermission = Platform.OS === 'android';
const gate = new MicrophonePermissionGate({
  check: () => ExpoSpeechRecognitionModule.getMicrophonePermissionsAsync(),
  request: () => ExpoSpeechRecognitionModule.requestMicrophonePermissionsAsync(),
});
gate.subscribe(state => {
  if (state === 'unknown') return;
  const phases = { checking: 'checking-permission', requesting: 'requesting-permission', granted: 'permission-granted', denied: 'permission-denied', blocked: 'permission-blocked', unavailable: 'permission-unavailable' } as const;
  voiceJournal.record(phases[state]);
});
export const subscribeMicrophonePermission = gate.subscribe.bind(gate);
export const checkMicrophonePermission = gate.check.bind(gate);
export const requestMicrophonePermission = gate.request.bind(gate);
export async function openMicrophoneSettings(): Promise<void> {
  if (Platform.OS !== 'web') await Linking.openSettings();
}

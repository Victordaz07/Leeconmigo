import { withMicrophoneLease } from './microphone-lease';
import { Platform } from 'react-native';
import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';
import { requestMicrophonePermission } from './microphone-access';
import { withDeadline } from './permission-gate';
import { voiceJournal } from './voice-journal-device';
import { AndroidLocalRecognition } from './android-local-recognition';
import { WhisperNativeSpeechEngine } from './whisper-native-speech-engine';
import type { ReadingVoice, ReadingVoiceProvider } from './reading-voice';

export function createReadingVoice(provider: ReadingVoiceProvider, model: import('./voice-types').VoiceModel = 'base'): ReadingVoice {
  const voice = withMicrophoneLease(provider === 'android' && Platform.OS === 'android'
    ? new AndroidLocalRecognition({
      supportsOnDeviceRecognition: () => ExpoSpeechRecognitionModule.supportsOnDeviceRecognition(),
      getSupportedLocales: options => withDeadline(ExpoSpeechRecognitionModule.getSupportedLocales(options), 5000),
      requestPermissionsAsync: requestMicrophonePermission,
      start: options => ExpoSpeechRecognitionModule.start(options),
      abort: () => ExpoSpeechRecognitionModule.abort(),
      addListener: ExpoSpeechRecognitionModule.addListener.bind(ExpoSpeechRecognitionModule),
    }, Number(Platform.Version))
    : new WhisperNativeSpeechEngine({ model }));
  let attempt: number | null = null;
  let sawResult = false;
  const start = voice.start.bind(voice);
  voice.start = language => { attempt = voiceJournal.begin(provider); sawResult = false; return start(language); };
  voice.onStatus(status => {
    if (attempt === null) return;
    const phase = { idle: 'stopped', 'requesting-mic': 'requesting-permission', 'loading-model': 'loading', ready: 'capturing', stopped: 'stopped', error: 'error' } as const;
    voiceJournal.record(phase[status], attempt);
  });
  const result = () => { if (!sawResult && attempt !== null) { sawResult = true; voiceJournal.record('result', attempt); } };
  voice.onPartialResult(result); voice.onFinalResult(result);
  voice.onError(() => { if (attempt !== null) voiceJournal.record('error', attempt); });
  return voice;
}

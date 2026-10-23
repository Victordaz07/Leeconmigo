import { withMicrophoneLease } from './microphone-lease';
import { Platform } from 'react-native';
import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';
import { AndroidLocalRecognition } from './android-local-recognition';
import { WhisperNativeSpeechEngine } from './whisper-native-speech-engine';
import type { ReadingVoice, ReadingVoiceProvider } from './reading-voice';

export function createReadingVoice(provider: ReadingVoiceProvider, model: import('./voice-types').VoiceModel = 'base'): ReadingVoice {
  return withMicrophoneLease(provider === 'android' && Platform.OS === 'android'
    ? new AndroidLocalRecognition(ExpoSpeechRecognitionModule, Number(Platform.Version))
    : new WhisperNativeSpeechEngine({ model }));
}

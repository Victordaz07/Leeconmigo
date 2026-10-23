import { withMicrophoneLease } from './microphone-lease';
import { WhisperNativeSpeechEngine } from './whisper-native-speech-engine';
import type { ReadingVoice, ReadingVoiceProvider } from './reading-voice';
/** Never invoke browser SpeechRecognition: its network behavior does not satisfy D1. */
export function createReadingVoice(_provider: ReadingVoiceProvider, _model: import('./voice-types').VoiceModel = 'base'): ReadingVoice {
  return withMicrophoneLease(new WhisperNativeSpeechEngine());
}

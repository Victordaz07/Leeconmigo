import config from '../../app.json';
import { deviceKV } from '../persist/kv';
import { VoiceJournal } from './voice-journal';
export const voiceJournal = new VoiceJournal(deviceKV, config.expo.version);
export const voiceAppVersion = config.expo.version;

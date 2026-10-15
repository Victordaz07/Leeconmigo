/**
 * Pronunciación en voz alta (ayuda de palabra, docs/04). Es la app HABLANDO hacia afuera con la voz del sistema
 * (`expo-speech`): no graba ni escucha nada, así que docs/07 no aplica. Mismo papel que `apps/reader/src/tts.ts`.
 */
import * as Speech from 'expo-speech';
import type { LanguageCode } from '@lee-conmigo/contracts';

const VOICE_LANGUAGE: Record<LanguageCode, string> = { es: 'es-US', en: 'en-US' };

export function speak(text: string, language: LanguageCode, rate = 0.8): void {
  Speech.stop();
  Speech.speak(text, { language: VOICE_LANGUAGE[language] ?? language, rate });
}

export function stopSpeaking(): void {
  Speech.stop();
}

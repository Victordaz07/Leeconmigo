/**
 * Pronunciación en voz alta (docs/04: "reproducción de audio" en la ayuda de palabra difícil). No es un motor de
 * reconocimiento ni graba nada — la app HABLA hacia afuera, no escucha — así que docs/07 (privacidad de la voz del
 * niño) no aplica aquí.
 *
 * En Android, el `speechSynthesis` del WebView no es fiable: en muchos dispositivos no tiene ninguna voz cargada y
 * se queda mudo sin avisar (lo que notó Victor probando en la tableta de Noah). `@capacitor-community/text-to-speech`
 * usa el motor TTS nativo de Android (`android.speech.tts.TextToSpeech`, el mismo que usa el sistema) cuando corre
 * empaquetada; en el navegador (desarrollo, panel DEV) cae sola al `speechSynthesis` del navegador. Un solo punto de
 * entrada para los dos casos, sin lógica de plataforma aquí.
 */
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import type { LanguageCode } from '@lee-conmigo/contracts';

const VOICE_LANG: Record<LanguageCode, string> = { es: 'es-ES', en: 'en-US' };

/** Dice `text` en el idioma de la historia. Nunca rompe la lectura si el dispositivo no tiene TTS disponible. */
export function speak(text: string, language: LanguageCode, rate = 0.85): void {
  if (!text.trim()) return;
  void TextToSpeech.speak({ text, lang: VOICE_LANG[language], rate, category: 'ambient' }).catch(() => {
    // Sin TTS disponible (dispositivo sin motor instalado, navegador sin voces): la ayuda sigue funcionando por
    // sílabas y texto, solo sin audio — nunca debe tumbar la sesión de lectura.
  });
}

export function stopSpeaking(): void {
  void TextToSpeech.stop().catch(() => {});
}

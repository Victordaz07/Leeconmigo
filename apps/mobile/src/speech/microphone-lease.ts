import type { ReadingVoice } from './reading-voice';

/** One microphone across reader and parent diagnostics, including model/permission startup and asynchronous shutdown. */
let owner: ReadingVoice | null = null;
let barrier: Promise<void> = Promise.resolve();
let shutdownUncertain = false;

export function withMicrophoneLease<T extends ReadingVoice>(voice: T): T {
  const start = voice.start.bind(voice);
  const stop = voice.stop.bind(voice);
  let intent = 0;
  voice.start = async language => {
    const request = ++intent;
    for (;;) {
      await barrier;
      if (request !== intent) return;
      if (shutdownUncertain) throw new Error('Microphone shutdown was not acknowledged; restart the app before listening');
      if (owner && owner !== voice) { await owner.stop(); continue; }
      owner = voice; // Claim synchronously; a competing start must cancel us before it can proceed.
      break;
    }
    await start(language);
  };
  voice.stop = () => {
    ++intent;
    const hardware = stop(); // Invalidate recognition immediately, not after an awaited queue.
    const previous = barrier;
    const release = Promise.all([previous, hardware]).then(() => {
      if (voice.isMicrophoneReleased?.() === false) shutdownUncertain = true;
      if (owner === voice) owner = null;
    });
    barrier = release;
    return release;
  };
  return voice;
}

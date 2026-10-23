import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { createReadingVoice } from '../speech/create-reading-voice';
import type { ReadingVoiceProvider } from '../speech/reading-voice';
import { ReadTogetherController } from './read-together-controller';

export function useReadTogether(options: {
  pageKey: string; words: readonly string[]; language: string; enabled: boolean; blocked: boolean;
  provider: ReadingVoiceProvider; credit: (ms: number) => void;
}) {
  const credit = useRef(options.credit); credit.current = options.credit;
  const [controller, setController] = useState<ReadTogetherController | null>(null);
  const [state, setState] = useState(() => ({ cursor: 0, confirmed: [] as readonly number[], preview: [] as readonly number[], newlyConfirmed: [] as readonly number[], complete: false, status: 'idle' as import('../speech/voice-types').VoiceStatus, error: null as import('@lee-conmigo/contracts').SpeechError['code'] | null }));
  const [foreground, setForeground] = useState(AppState.currentState === 'active');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const next = new ReadTogetherController(createReadingVoice(options.provider), ms => credit.current(ms));
    const off = next.subscribe(setState);
    setController(next);
    return () => { off(); next.dispose(); };
  }, [options.provider]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', value => {
      if (value !== 'active') void controller?.pause(); // Close the acceptance gate before React rerenders.
      setForeground(value === 'active');
    });
    return () => listener.remove();
  }, [controller]);
  useEffect(() => {
    if (!controller) return;
    void controller.configure(options.pageKey, options.words, options.language, options.enabled && !options.blocked && foreground);
    return () => { void controller.pause(); };
  }, [controller, options.pageKey, options.words, options.language, options.enabled, options.blocked, foreground, retry]);
  return { ...state, pause: () => controller?.pause() ?? Promise.resolve(), retry: () => setRetry(n => n + 1) };
}

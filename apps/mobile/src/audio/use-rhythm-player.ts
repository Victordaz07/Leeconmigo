import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { Sequencer, type Kit, type Pattern, type SoundId } from '@lee-conmigo/music-engine';
import { DEFAULT_VOLUME, NativeAudioOutput } from './native-audio-output';

const PUMP_MS = 25;

/**
 * Reproduce un ritmo de ocho pulsos con el audio real (`NativeAudioOutput`) y lo mantiene al día con lo que el niño edita (patrón, sonidos, tempo).
 * Sigue las mismas reglas que la prueba AR-T1: el planificador se llama cada ~25 ms, los golpes se programan en el reloj de audio, el cursor se
 * lee de ese mismo reloj. El audio se abre la primera vez que se toca (no al abrir la pantalla) y se cierra al salir. Si la app pasa a segundo
 * plano, el ritmo se detiene. No usa micrófono, archivos ni red.
 */
export function useRhythmPlayer(pattern: Pattern, kit: Kit, bpm: number, volume = DEFAULT_VOLUME) {
  const [playing, setPlaying] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const out = useRef<NativeAudioOutput | null>(null);
  const seq = useRef<Sequencer | null>(null);

  const ensure = useCallback((): Sequencer | null => {
    if (seq.current) return seq.current;
    try {
      const o = new NativeAudioOutput();
      out.current = o;
      o.setVolume(volume);
      seq.current = new Sequencer(o, { bpm, pattern, kit });
      return seq.current;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lo que el niño cambia llega al secuenciador al momento (vale para los golpes que aún no se programaron).
  useEffect(() => seq.current?.setPattern(pattern), [pattern]);
  useEffect(() => seq.current?.setKit(kit), [kit]);
  useEffect(() => seq.current?.setTempo(bpm), [bpm]);
  useEffect(() => out.current?.setVolume(volume), [volume]);

  const stop = useCallback(() => {
    seq.current?.stop();
    setPlaying(false);
    setCursor(null);
  }, []);

  const play = useCallback(async () => {
    const s = ensure();
    const o = out.current;
    if (!s || !o) return;
    setError(null);
    try {
      await o.resume();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return;
    }
    s.setPattern(pattern);
    s.setKit(kit);
    s.setTempo(bpm);
    s.start();
    setPlaying(true);
  }, [ensure, pattern, kit, bpm]);

  /** Se oye un sonido ahora mismo (al elegirlo), aunque el ritmo no esté sonando. */
  const preview = useCallback(
    async (sound: SoundId) => {
      if (!ensure()) return;
      const o = out.current!;
      try {
        await o.resume();
        o.setVolume(volume);
        o.preview(sound);
      } catch {
        // sin audio no se oye la muestra, pero la elección queda
      }
    },
    [ensure, volume],
  );

  // Mientras suena: planificador cada ~25 ms y cursor en cada cuadro de pantalla.
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => seq.current?.pump(), PUMP_MS);
    let raf = 0;
    const frame = () => {
      const s = seq.current;
      const o = out.current;
      if (s && o) setCursor(s.stepAt(o.now()));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(raf);
    };
  }, [playing]);

  // La app a segundo plano: el sonido se detiene de inmediato.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => {
      if (st !== 'active') stop();
    });
    return () => {
      sub.remove();
      seq.current?.stop();
      void out.current?.dispose();
      seq.current = null;
      out.current = null;
    };
  }, [stop]);

  return { playing, cursor, error, play, stop, preview };
}

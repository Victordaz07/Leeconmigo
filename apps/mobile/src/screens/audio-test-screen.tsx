import { useEffect, useRef, useState } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { LAYERS, PumpMonitor, Sequencer, STEPS, emptyPattern, toggleCell, type Layer, type MonitorReport, type Pattern } from '@lee-conmigo/music-engine';
import { DEFAULT_VOLUME, NativeAudioOutput } from '../audio/native-audio-output';

const TEMPOS = [60, 90, 120, 140];
const PUMP_MS = 25;
const LONG_TEST_SECONDS = 300;
const LAYER_NAME: Record<Layer, string> = { grave: 'Grave', palmas: 'Palmas', sonaja: 'Sonaja', voz: 'Voz' };

/** Un ritmo de partida para no empezar con la rejilla vacía. */
const starter = (): Pattern => {
  let p = emptyPattern();
  for (const s of [0, 4]) p = toggleCell(p, 'grave', s);
  for (const s of [2, 6]) p = toggleCell(p, 'palmas', s);
  for (let s = 0; s < STEPS; s++) p = toggleCell(p, 'sonaja', s);
  return toggleCell(p, 'voz', 7);
};

interface Result {
  id: number;
  bpm: number;
  seconds: number;
  report: MonitorReport;
  cycles: number;
  skipped: number;
  backgrounded: number;
  verdict: string;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/**
 * Prueba de audio (AR-T1, docs/design/artes/ESPECIFICACION.md §6): para que un adulto compruebe en la tableta o el teléfono que el
 * secuenciador de ocho pulsos suena PAREJO (sin huecos ni arrastres) a 60, 90 y 140 BPM durante 5 minutos. Los timbres se sintetizan por
 * código; no usa micrófono, ni cámara, ni archivos de audio, ni internet. Está en Modo padres (tras el PIN).
 */
export function AudioTestScreen({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [pattern, setPattern] = useState<Pattern>(starter);
  const [bpm, setBpm] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [long, setLong] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [report, setReport] = useState<MonitorReport | null>(null);
  const [stats, setStats] = useState({ cycles: 0, skipped: 0, scheduled: 0 });
  const [pendingBpm, setPendingBpm] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [ctxState, setCtxState] = useState('—');
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [awaiting, setAwaiting] = useState<Omit<Result, 'verdict'> | null>(null);
  const out = useRef<NativeAudioOutput | null>(null);
  const seq = useRef<Sequencer | null>(null);
  const monitor = useRef(new PumpMonitor(100));
  const startedAt = useRef(0);
  const backgrounded = useRef(0);
  const nextId = useRef(1);
  const longRef = useRef(false);

  const ensure = (): Sequencer | null => {
    if (seq.current) return seq.current;
    try {
      const o = new NativeAudioOutput();
      out.current = o;
      seq.current = new Sequencer(o, { bpm, pattern });
      setRate(o.sampleRate);
      return seq.current;
    } catch (e) {
      setError(`No se pudo abrir el audio en este dispositivo: ${e instanceof Error ? e.message : String(e)}`);
      return null;
    }
  };

  const finish = (wasLong: boolean) => {
    const s = seq.current;
    if (!s) return;
    const seconds = (Date.now() - startedAt.current) / 1000;
    const r: Omit<Result, 'verdict'> = { id: nextId.current++, bpm: s.tempo, seconds: Math.round(seconds), report: monitor.current.report(), cycles: s.stats.cycles, skipped: s.stats.skippedSteps, backgrounded: backgrounded.current };
    s.stop();
    setPlaying(false);
    setLong(false);
    longRef.current = false;
    setCursor(null);
    setReport(r.report);
    if (wasLong) setAwaiting(r);
  };

  const start = async (isLong: boolean) => {
    const s = ensure();
    const o = out.current;
    if (!s || !o) return;
    setError(null);
    try {
      await o.resume();
    } catch (e) {
      setError(`El audio no quiso arrancar: ${e instanceof Error ? e.message : String(e)}`);
      return;
    }
    o.setVolume(volume);
    s.setPattern(pattern);
    s.setTempo(bpm);
    monitor.current.reset();
    backgrounded.current = 0;
    startedAt.current = Date.now();
    s.start();
    setPlaying(true);
    setLong(isLong);
    longRef.current = isLong;
    setAwaiting(null);
  };

  const stop = () => finish(false);

  // Planificador (cada ~25 ms) y cursor (cada cuadro de pantalla) mientras suena.
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      const s = seq.current;
      if (!s) return;
      monitor.current.record(Date.now());
      s.pump();
      const secs = (Date.now() - startedAt.current) / 1000;
      if (longRef.current && secs >= LONG_TEST_SECONDS) finish(true);
    }, PUMP_MS);
    let raf = 0;
    const frame = () => {
      const s = seq.current;
      const o = out.current;
      if (s && o) {
        setCursor(s.stepAt(o.now()));
        setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
        setPendingBpm(s.pendingTempo);
        setStats({ cycles: s.stats.cycles, skipped: s.stats.skippedSteps, scheduled: s.stats.scheduled });
        setCtxState(o.state);
        setReport(monitor.current.report());
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(raf);
    };
  }, [playing]);

  // La app en segundo plano: se detiene el sonido de inmediato (el audio no debe seguir con la pantalla apagada).
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => {
      if (st !== 'active' && seq.current?.playing) {
        backgrounded.current++;
        finish(longRef.current);
      }
    });
    return () => {
      sub.remove();
      seq.current?.stop();
      void out.current?.dispose();
    };
  }, []);

  const toggle = (layer: Layer, step: number) => {
    const next = toggleCell(pattern, layer, step);
    setPattern(next);
    seq.current?.setPattern(next);
  };
  const pickBpm = (v: number) => {
    setBpm(v);
    seq.current?.setTempo(v);
  };
  const pickVolume = (v: number) => {
    setVolume(v);
    out.current?.setVolume(v);
  };
  const verdict = (text: string) => {
    if (!awaiting) return;
    setResults((r) => [...r, { ...awaiting, verdict: text }]);
    setAwaiting(null);
  };

  const summary = results
    .map((r) => `#${r.id} · ${r.bpm} BPM · ${clock(r.seconds)} · congelamientos ${r.report.stalls} (hueco máx. ${r.report.maxGapMs} ms, media ${r.report.meanGapMs} ms) · pasos saltados ${r.skipped} · segundo plano ${r.backgrounded} · se oyó: ${r.verdict}`)
    .join('\n');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label="Volver">
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]}>Prueba de audio</Text>
      </View>
      <Text style={styles.note}>
        Para Arte y música. Comprueba que el ritmo de ocho pulsos suene parejo. Los sonidos se generan en el equipo: no usa micrófono, cámara, archivos ni internet. Usa audífonos o el altavoz con volumen bajo.
      </Text>
      {error && <Text style={styles.warn}>{error}</Text>}

      <View style={styles.card}>
        <Text style={styles.h3}>Ritmo de ocho pulsos</Text>
        <View style={styles.grid}>
          {LAYERS.map((layer) => (
            <View key={layer} style={styles.gridRow}>
              <Text style={styles.layerName}>{LAYER_NAME[layer]}</Text>
              {pattern[layer].map((on, step) => (
                <Pressable key={step} onPress={() => toggle(layer, step)} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={`${LAYER_NAME[layer]}, pulso ${step + 1}: ${on ? 'suena' : 'silencio'}`} style={[styles.cell, on && styles.cellOn, cursor === step && styles.cellCursor, step === 4 && styles.cellGroup]}>
                  <Text style={[styles.cellText, on && styles.cellTextOn]}>{on ? '●' : ''}</Text>
                </Pressable>
              ))}
            </View>
          ))}
          <View style={styles.gridRow}>
            <Text style={styles.layerName} />
            {Array.from({ length: STEPS }, (_, i) => (
              <Text key={i} style={[styles.stepNum, cursor === i && styles.stepNumOn]}>
                {i + 1}
              </Text>
            ))}
          </View>
        </View>

        <Text style={styles.h3}>Tempo</Text>
        <View style={styles.segmented}>
          {TEMPOS.map((t) => (
            <Pressable key={t} onPress={() => pickBpm(t)} accessibilityRole="button" accessibilityState={{ selected: bpm === t }} style={[styles.segment, bpm === t && styles.segmentOn]}>
              <Text style={[styles.segmentText, bpm === t && styles.segmentTextOn]}>{t} BPM</Text>
            </Pressable>
          ))}
        </View>
        {pendingBpm !== null && <Text style={styles.small}>El tempo cambia a {pendingBpm} BPM al empezar el siguiente ciclo.</Text>}

        <Text style={styles.h3}>Volumen</Text>
        <View style={styles.segmented}>
          {[0.3, 0.6, 0.9].map((v) => (
            <Pressable key={v} onPress={() => pickVolume(v)} accessibilityRole="button" accessibilityState={{ selected: volume === v }} style={[styles.segment, volume === v && styles.segmentOn]}>
              <Text style={[styles.segmentText, volume === v && styles.segmentTextOn]}>{v === 0.3 ? 'Bajo' : v === 0.6 ? 'Medio' : 'Alto'}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.actions}>
          {!playing ? <Button label="Tocar" onPress={() => void start(false)} /> : <Button label="Detener" variant="secondary" onPress={stop} />}
          {!playing && <Button label="Prueba de 5 minutos" variant="secondary" onPress={() => void start(true)} />}
        </View>
        {playing && long && <Text style={styles.small}>Prueba larga en curso: {clock(elapsed)} de {clock(LONG_TEST_SECONDS)}. Escucha con atención y no cambies de aplicación.</Text>}
      </View>

      {awaiting && (
        <View style={styles.card}>
          <Text style={styles.h3}>Terminó la prueba de {clock(awaiting.seconds)} a {awaiting.bpm} BPM</Text>
          <Text style={styles.note}>¿Cómo se oyó?</Text>
          <View style={styles.actions}>
            <Button label="Parejo" onPress={() => verdict('parejo')} />
            <Button label="Hubo huecos" variant="secondary" onPress={() => verdict('huecos')} />
            <Button label="Se arrastró" variant="secondary" onPress={() => verdict('se arrastró')} />
            <Button label="Sonó desfasado del cursor" variant="secondary" onPress={() => verdict('desfasado del cursor')} />
          </View>
        </View>
      )}

      <View style={styles.diag}>
        <Text style={styles.h3}>Lo que mide</Text>
        <Text style={styles.small}>Audio: {ctxState} · {rate ? `${rate} Hz` : 'sin abrir'}</Text>
        <Text style={styles.small}>Ciclos: {stats.cycles} · golpes programados: {stats.scheduled} · pasos saltados: {stats.skipped}</Text>
        {report && (
          <Text style={styles.small}>
            Planificador: {report.pumps} llamadas · media {report.meanGapMs} ms · hueco máx. {report.maxGapMs} ms · congelamientos (&gt; 100 ms): {report.stalls}
          </Text>
        )}
        <Text style={styles.small}>Un congelamiento es un momento en que la aplicación tardó más de 100 ms en responder: es lo que provoca un hueco en el sonido.</Text>
      </View>

      {results.length > 0 && (
        <View style={styles.diag}>
          <Text style={styles.h3}>Resultados (para pasárselos a Claude)</Text>
          <Text selectable style={styles.mono}>
            {summary}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  titleSmall: { fontSize: 26 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 15, lineHeight: 21, color: colors.inkSoft },
  warn: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.orangeDeep, backgroundColor: colors.warnTint, borderRadius: radius.tile, padding: 12, overflow: 'hidden' },
  card: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, gap: 12, boxShadow: shadows.card },
  grid: { gap: 6 },
  gridRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  layerName: { width: 64, fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.ink },
  cell: { flex: 1, height: 44, minWidth: 28, borderRadius: 10, borderWidth: 2, borderColor: colors.line, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  cellGroup: { marginLeft: 6 },
  cellOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  cellCursor: { borderColor: colors.orangeDeep },
  cellText: { color: '#ffffff', fontSize: 14 },
  cellTextOn: { color: '#ffffff' },
  stepNum: { flex: 1, textAlign: 'center', fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted },
  stepNumOn: { color: colors.orangeDeep, fontFamily: fontFamily.ui.black },
  segmented: { flexDirection: 'row', gap: 6, backgroundColor: colors.chip, borderRadius: 14, padding: 4 },
  segment: { flex: 1, height: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segmentOn: { backgroundColor: colors.brand },
  segmentText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.inkSoft },
  segmentTextOn: { color: '#ffffff' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 18, color: colors.muted },
  diag: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 12, gap: 6, boxShadow: shadows.soft },
  mono: { fontFamily: 'monospace', fontSize: 12, lineHeight: 17, color: colors.ink },
});

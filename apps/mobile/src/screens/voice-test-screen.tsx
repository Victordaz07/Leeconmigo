import { useTranslation } from '@lee-conmigo/ui-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ChevronLeftIcon, colors, fontFamily, MicBadge, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { createReadingVoice } from '../speech/create-reading-voice';
import type { ReadingVoice, ReadingVoiceProvider } from '../speech/reading-voice';
import { ReadAlong, type HeardResult } from '../speech/read-along';
import type { VoiceDiagnostics, VoiceModel, VoiceStatus, VoiceUtterance } from '../speech/voice-types';
import { isNativeVoiceSupported } from '../speech/whisper-native-speech-engine';

/** Frases para leer en la prueba (de historias que ya existen). */
const SAMPLES: Record<'es' | 'en', string[]> = {
  es: [
    'La cometa roja se quedó enredada en la rama del roble. Lía miró hacia arriba y abrió mucho los ojos.',
    'Mila paseaba con su pequeño dragón Pipo cuando el jardín empezaba a oscurecer.',
    'Un erizo esperaba en la orilla y miraba el camino del otro lado.',
  ],
  en: [
    'The red kite got stuck in the branch of the old oak tree. Lia looked up and opened her eyes wide.',
    'Mila was walking with her little dragon Pipo when the garden began to get dark.',
    'A hedgehog was waiting on the bank and looking at the path on the other side.',
  ],
};

const STATUS_TEXT: Record<VoiceStatus, string> = {
  idle: 'Sin empezar',
  'requesting-mic': 'Pidiendo permiso del micrófono…',
  'loading-model': 'Cargando el reconocimiento (la primera vez tarda unos segundos)…',
  ready: 'Escuchando',
  stopped: 'Detenido',
  error: 'No disponible',
};

interface Row extends VoiceUtterance {
  id: number;
  heard?: HeardResult;
}

/**
 * Prueba de voz (RN-03, docs/11): para que un adulto compruebe en la tablet o el teléfono que el reconocimiento ENTIENDE
 * lo que se lee. Escribe lo que entendió, pinta de verde las palabras de la frase que reconoció (con el mismo comparador
 * que usa la lectura) y muestra contadores para saber en qué paso se queda si no aparece texto. Nunca guarda audio (D1) y
 * no usa internet. Está en Modo padres (tras el PIN).
 */
export function VoiceTestScreen({ language: initialLanguage, onBack }: { language: 'es' | 'en'; onBack: () => void }) {
  const { t: ui } = useTranslation();
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [provider, setProvider] = useState<ReadingVoiceProvider>('android');
  const [partial, setPartial] = useState('');
  const runId = useRef(0);
  const [model, setModel] = useState<VoiceModel>('tiny');
  const [language, setLanguage] = useState<'es' | 'en'>(initialLanguage);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [voice, setVoice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [diag, setDiag] = useState<VoiceDiagnostics | null>(null);
  const [, setTick] = useState(0);
  const engine = useRef<ReadingVoice | null>(null);
  const nextId = useRef(0);
  const sample = SAMPLES[language][sampleIdx % SAMPLES[language].length];
  const readAlong = useMemo(() => new ReadAlong(sample), [sample]);
  const readAlongRef = useRef(readAlong);
  readAlongRef.current = readAlong;
  const listening = status === 'requesting-mic' || status === 'loading-model' || status === 'ready';

  const stop = async () => {
    ++runId.current;
    const previous = engine.current;
    engine.current = null;
    setVoice(false);
    setPartial('');
    setStatus('stopped');
    await previous?.stop();
  };

  const start = async () => {
    const stopping = stop();
    const id = runId.current;
    await stopping;
    if (id !== runId.current) return;
    setError(null);
    setDiag(null);
    const e = createReadingVoice(provider, model);
    engine.current = e;
    const live = () => id === runId.current;
    e.onStatus(status => { if (live()) setStatus(status); });
    e.onVoiceActivity(active => { if (live()) setVoice(active); });
    e.onError(err => { if (live()) setError(err.code === 'permission-denied'
      ? ui('El micrófono no tiene permiso. Puedes volver a intentarlo.')
      : ui('Escucha local no disponible para este idioma. Prueba Whisper o comprueba los idiomas sin conexión del sistema.')); });
    if ('onDiagnostics' in e) {
      const native = e as import('../speech/voice-types').NativeVoiceEngine;
      native.onDiagnostics(d => { if (live()) setDiag(d); });
      native.onUtterance(u => {
        if (!live()) return;
        const heard = !u.skipped && u.text ? readAlongRef.current.hear(u.text) : undefined;
        setRows(rows => [{ ...u, heard, id: nextId.current++ }, ...rows].slice(0, 30));
      });
    } else {
      e.onPartialResult(result => { if (live()) setPartial(result.text); });
      e.onFinalResult(result => {
        if (!live()) return;
        setPartial('');
        const heard = readAlongRef.current.hear(result.text);
        setRows(rows => [{ text: result.text, audioMs: result.audioDurationMs ?? 0, transcribeMs: 0, skipped: false, heard, id: nextId.current++ }, ...rows].slice(0, 30));
      });
    }
    try { await e.start(language); } catch { if (live()) { setStatus('error'); setError(ui('Escucha local no disponible para este idioma. Prueba Whisper o comprueba los idiomas sin conexión del sistema.')); } }
  };

  const resetReading = () => {
    void stop();
    readAlong.reset();
    setRows([]);
    setTick((t) => t + 1);
  };

  // El micrófono se apaga al salir de la pantalla o al pasar la app a segundo plano (docs/06).
  useEffect(() => {
    const s = AppState.addEventListener('change', (st) => {
      if (st !== 'active') void stop();
    });
    return () => {
      s.remove();
      void stop();
    };
  }, []);

  const heardWords = readAlong.heardWords();
  const coverage = Math.round(readAlong.coverage() * 100);
  const transcripts = rows.filter((r) => !r.skipped && r.text);
  const avgMs = transcripts.length ? Math.round(transcripts.reduce((a, r) => a + r.transcribeMs, 0) / transcripts.length) : null;
  const supported = isNativeVoiceSupported();
  const tone = status === 'ready' ? 'ok' : status === 'error' ? 'idle' : listening ? 'warn' : 'idle';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={ui("Volver")}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]}>{ui("Prueba de voz")}</Text>
      </View>
      <Text style={styles.note}>
        {ui("Toca Empezar y lee la frase en voz alta. Las palabras que el reconocimiento entienda se pintan de verde, y abajo ves exactamente lo que escribió. Todo pasa en este equipo: nada se graba ni se envía.")}</Text>
      {!supported && <Text style={styles.warn}>{ui("En la vista web no hay micrófono: esta prueba funciona en la app instalada.")}</Text>}

      <Segmented label={ui('Motor local')} options={[{ id: 'android', label: 'Android' }, { id: 'whisper', label: 'Whisper' }]} value={provider}
        onChange={value => { void stop(); setProvider(value as ReadingVoiceProvider); resetReading(); }} />
      {provider === 'android' && <Text style={styles.note}>{ui('Android 13 o posterior, con el idioma instalado para reconocimiento local. Si no está disponible, no se usa la nube. Los parciales pueden cambiar antes del resultado final.')}</Text>}
      <View style={[styles.row, layout.narrow && styles.rowWrap]}>
        {provider === 'whisper' && <Segmented
          label={ui("Modelo")}
          options={[
            { id: 'tiny', label: ui('Rápido') },
            { id: 'base', label: ui('Preciso') },
          ]}
          value={model}
          onChange={(m) => {
            void stop();
            setModel(m as VoiceModel);
            resetReading();
          }}
        />}
        <Segmented
          label={ui("Idioma")}
          options={[
            { id: 'es', label: 'Español' },
            { id: 'en', label: 'English' },
          ]}
          value={language}
          onChange={(l) => {
            setLanguage(l as 'es' | 'en');
            setRows([]);
            void stop();
          }}
        />
      </View>

      {/* La frase: lo reconocido en verde */}
      <View style={styles.card}>
        <Text style={styles.sample} accessibilityLabel={sample}>
          {readAlong.words.map((w, i) => (
            <Text key={i} style={heardWords.has(i) ? styles.heard : undefined}>
              {w.text}{' '}
            </Text>
          ))}
        </Text>
        <View style={styles.coverageRow}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${coverage}%` }]} />
          </View>
          <Text style={styles.coverageText}>{coverage} {" " + ui("% de la frase reconocida")}</Text>
        </View>
        <View style={styles.cardActions}>
          <Button
            label={ui("Otra frase")}
            variant="secondary"
            onPress={() => {
              void stop();
              setSampleIdx((i) => i + 1);
              setRows([]);
            }}
          />
          <Button label={ui("Volver a empezar")} variant="secondary" onPress={resetReading} />
        </View>
      </View>

      <View style={styles.statusRow}>
        <MicBadge tone={tone} pulsing={status === 'ready' && voice} size={56} />
        <View style={styles.flex}>
          <Text style={styles.status}>{ui(STATUS_TEXT[status])}</Text>
          {status === 'ready' && <Text style={styles.small}>{diag?.transcribing ? ui("Escribiendo lo que oyó…") : voice ? ui("Oigo voz…") : ui("Esperando voz")}</Text>}
        </View>
        {listening ? <Button label={ui("Detener")} variant="secondary" onPress={() => void stop()} /> : <Button label={ui("Empezar")} onPress={() => void start()} disabled={!supported} />}
      </View>
      {!!partial && <Text accessibilityLiveRegion="polite" style={styles.transcript}>{ui("Hipótesis provisional")}: {partial}</Text>}
      {error && <Text style={styles.warn}>{error}</Text>}

      {/* Diagnóstico: en qué paso va la voz */}
      {diag && (
        <View style={styles.diag}>
          <View style={styles.levelRow}>
            <Text style={styles.small}>{ui("Micrófono")}</Text>
            <View style={styles.levelTrack}>
              <View style={[styles.levelFill, { width: `${Math.round(diag.level * 100)}%` }]} />
            </View>
            <Text style={styles.small}>{Math.round(diag.audioSeconds)} {" " + ui("s de audio")}</Text>
          </View>
          <Text style={styles.small}>
            {ui("Frases detectadas")}{diag.detected} {" " + ui("· escritas") + " "}{diag.transcribed} {" " + ui("· no eran voz") + " "}{diag.skipped} {" " + ui("· perdidas") + " "}{diag.dropped}
            {diag.queued ? ui(" · en espera {0}", diag.queued) : ''}
            {diag.errors ? ` · errores ${diag.errors}` : ''}
          </Text>
          {diag.dropped > 0 && status === 'loading-model' && <Text style={styles.small}>{ui("(Mientras carga el reconocimiento, lo que se lee no se escribe.)")}</Text>}
        </View>
      )}

      {/* Lo que escribió */}
      <View style={styles.card}>
        <Text style={styles.h3}>{ui("Lo que entendió")}</Text>
        {transcripts.length ? (
          <Text style={styles.transcript}>{[...transcripts].reverse().map((r) => r.text).join(' ')}</Text>
        ) : (
          <Text style={styles.small}>{listening ? ui("Todavía nada. Lee la frase en voz alta y haz una pausa corta al final.") : ui("Toca Empezar.")}</Text>
        )}
        {avgMs !== null && <Text style={styles.summary}>{ui("Tarda en promedio") + " "}{(avgMs / 1000).toFixed(1)} {" " + ui("s por frase.")}</Text>}
      </View>

      {rows.map((r) => (
        <View key={r.id} style={styles.result}>
          <Text style={[styles.resultText, r.skipped && styles.skipped]}>{r.skipped ? ui("(no era voz: no se envió al reconocimiento)") : r.text || ui("(no entendió nada)")}</Text>
          <Text style={styles.small}>
            {provider === 'android' ? ui("Resultado local final · tiempos de inferencia no disponibles") : null}
            {provider === 'whisper' && <>{ui("frase de")}{(r.audioMs / 1000).toFixed(1)} {" " + ui("s · tardó") + " "}{(r.transcribeMs / 1000).toFixed(1)} s</>}
            {r.heard ? ui(" · coinciden {0} de {1} palabras con el texto", r.heard.matched, r.heard.recognized) : ''}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function Segmented({ label, options, value, onChange }: { label: string; options: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.segWrap}>
      <Text style={styles.small}>{label}</Text>
      <View style={styles.segmented}>
        {options.map((o) => {
          const on = o.id === value;
          return (
            <Pressable key={o.id} onPress={() => onChange(o.id)} accessibilityRole="radio" accessibilityState={{ selected: on }} style={[styles.segment, on && styles.segmentOn]}>
              <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  titleSmall: { fontSize: 26 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 15, lineHeight: 21, color: colors.inkSoft },
  warn: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.orangeDeep, backgroundColor: colors.warnTint, borderRadius: radius.tile, padding: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', gap: 16 },
  rowWrap: { flexDirection: 'column', gap: 10 },
  segWrap: { flex: 1, gap: 6 },
  segmented: { flexDirection: 'row', gap: 6, backgroundColor: colors.chip, borderRadius: 14, padding: 4 },
  segment: { flex: 1, height: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segmentOn: { backgroundColor: colors.brand },
  segmentText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.inkSoft },
  segmentTextOn: { color: '#ffffff' },
  card: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, gap: 12, boxShadow: shadows.card },
  sample: { fontFamily: fontFamily.read.regular, fontSize: 24, lineHeight: 38, color: colors.ink },
  heard: { color: colors.okDark, fontFamily: fontFamily.read.bold, backgroundColor: colors.okTint },
  coverageRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.track, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5, backgroundColor: colors.ok },
  coverageText: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.inkSoft },
  cardActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  status: { fontFamily: fontFamily.ui.extrabold, fontSize: 17, color: colors.ink },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted },
  diag: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 12, gap: 6, boxShadow: shadows.soft },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  levelTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.track, overflow: 'hidden' },
  levelFill: { height: '100%', backgroundColor: colors.brand },
  transcript: { fontFamily: fontFamily.read.regular, fontSize: 20, lineHeight: 30, color: colors.ink },
  summary: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.okDark },
  result: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, gap: 4, boxShadow: shadows.soft },
  resultText: { fontFamily: fontFamily.read.regular, fontSize: 18, color: colors.ink },
  skipped: { color: colors.muted, fontSize: 15 },
});

import { useEffect, useRef, useState } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ChevronLeftIcon, colors, fontFamily, MicBadge, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import type { VoiceModel, VoiceStatus, VoiceUtterance } from '../speech/voice-types';
import { isNativeVoiceSupported, WhisperNativeSpeechEngine } from '../speech/whisper-native-speech-engine';

/** Frases para leer en la prueba (de historias que ya existen). */
const SAMPLE: Record<'es' | 'en', string> = {
  es: 'La cometa roja se quedó enredada en la rama del roble. Lía miró hacia arriba y abrió mucho los ojos.',
  en: 'The red kite got stuck in the branch of the old oak tree. Lia looked up and opened her eyes wide.',
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
}

/**
 * Prueba de voz (RN-03, docs/11): para que un adulto compruebe en la tablet o el teléfono que el reconocimiento funciona y
 * mida cuánto tarda, ANTES de usarlo en la lectura. Muestra el texto que entendió y el tiempo; nunca guarda audio (D1) y
 * no usa internet. Está en Modo padres (tras el PIN).
 */
export function VoiceTestScreen({ language: initialLanguage, onBack }: { language: 'es' | 'en'; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [model, setModel] = useState<VoiceModel>('tiny');
  const [language, setLanguage] = useState<'es' | 'en'>(initialLanguage);
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [voice, setVoice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const engine = useRef<WhisperNativeSpeechEngine | null>(null);
  const nextId = useRef(0);
  const listening = status === 'requesting-mic' || status === 'loading-model' || status === 'ready';

  const stop = async () => {
    await engine.current?.stop();
    engine.current = null;
    setVoice(false);
  };

  const start = async () => {
    await stop();
    setError(null);
    const e = new WhisperNativeSpeechEngine({ model });
    engine.current = e;
    e.onStatus(setStatus);
    e.onVoiceActivity(setVoice);
    e.onError((err) => setError(err.message));
    e.onUtterance((u) => setRows((r) => [{ ...u, id: nextId.current++ }, ...r].slice(0, 30)));
    await e.start(language);
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

  const heard = rows.filter((r) => !r.skipped);
  const avgMs = heard.length ? Math.round(heard.reduce((a, r) => a + r.transcribeMs, 0) / heard.length) : null;
  const ratio = heard.length ? heard.reduce((a, r) => a + r.transcribeMs, 0) / Math.max(1, heard.reduce((a, r) => a + r.audioMs, 0)) : null;
  const supported = isNativeVoiceSupported();
  const tone = status === 'ready' ? 'ok' : status === 'error' ? 'idle' : listening ? 'warn' : 'idle';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label="Volver">
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]}>Prueba de voz</Text>
      </View>
      <Text style={styles.note}>
        Lee en voz alta la frase de abajo. Aquí ves lo que entendió el reconocimiento y cuánto tardó. Todo pasa en este equipo: nada se graba
        ni se envía.
      </Text>
      {!supported && <Text style={styles.warn}>En la vista web no hay micrófono: esta prueba funciona en la app instalada.</Text>}

      <View style={[styles.row, layout.narrow && styles.rowWrap]}>
        <Segmented
          label="Modelo"
          options={[
            { id: 'tiny', label: 'Rápido' },
            { id: 'base', label: 'Preciso' },
          ]}
          value={model}
          onChange={(m) => {
            setModel(m as VoiceModel);
            void stop();
          }}
        />
        <Segmented
          label="Idioma"
          options={[
            { id: 'es', label: 'Español' },
            { id: 'en', label: 'English' },
          ]}
          value={language}
          onChange={(l) => {
            setLanguage(l as 'es' | 'en');
            void stop();
          }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sample}>{SAMPLE[language]}</Text>
      </View>

      <View style={styles.statusRow}>
        <MicBadge tone={tone} pulsing={status === 'ready' && voice} size={56} />
        <View style={styles.flex}>
          <Text style={styles.status}>{STATUS_TEXT[status]}</Text>
          {status === 'ready' && <Text style={styles.small}>{voice ? 'Oigo voz…' : 'Esperando voz'}</Text>}
        </View>
        {listening ? <Button label="Detener" variant="secondary" onPress={() => void stop()} /> : <Button label="Empezar" onPress={() => void start()} disabled={!supported} />}
      </View>
      {error && <Text style={styles.warn}>{error}</Text>}

      {avgMs !== null && (
        <Text style={styles.summary}>
          {heard.length} {heard.length === 1 ? 'frase' : 'frases'} · tarda en promedio {(avgMs / 1000).toFixed(1)} s ·{' '}
          {ratio !== null && ratio <= 1 ? 'más rápido que lo que dura la voz ✓' : 'más lento que lo que dura la voz'}
        </Text>
      )}

      {rows.map((r) => (
        <View key={r.id} style={styles.result}>
          <Text style={[styles.resultText, r.skipped && styles.skipped]}>{r.skipped ? '(no era voz: no se envió al reconocimiento)' : r.text || '(no entendió nada)'}</Text>
          <Text style={styles.small}>
            frase de {(r.audioMs / 1000).toFixed(1)} s · tardó {(r.transcribeMs / 1000).toFixed(1)} s
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
  card: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, boxShadow: shadows.card },
  sample: { fontFamily: fontFamily.read.regular, fontSize: 22, lineHeight: 34, color: colors.ink },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  status: { fontFamily: fontFamily.ui.extrabold, fontSize: 17, color: colors.ink },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted },
  summary: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.okDark },
  result: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, gap: 4, boxShadow: shadows.soft },
  resultText: { fontFamily: fontFamily.read.regular, fontSize: 18, color: colors.ink },
  skipped: { color: colors.muted, fontSize: 15 },
});

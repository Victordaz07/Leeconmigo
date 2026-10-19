import { useEffect, useRef, useState } from 'react';
import { AppState, type GestureResponderEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { PumpMonitor, type MonitorReport } from '@lee-conmigo/music-engine';
import {
  BRUSH_COLORS, BRUSH_WIDTHS, ERASER_WIDTH, beginStroke, brush, cancelStroke, canRedo, canUndo, clearDrawing, emptyDrawing, endStroke, extendStroke, redo, totalPoints, undo,
  visibleStrokes, type Brush, type Drawing,
} from '@lee-conmigo/art-content';
import { StrokeLayer } from './canvas-surface';

const TEST_SECONDS = 60;
const CANVAS_HEIGHT = 380;
/** Un cuadro de más de 50 ms (menos de 20 por segundo) se nota como tirón al dibujar. */
const JANK_MS = 50;

interface Counts {
  /** Trazos que empezaron (dedo puesto). */
  started: number;
  /** Trazos que terminaron y se guardaron. */
  ended: number;
  /** Trazos cancelados a propósito (segundo dedo, el sistema quitó el toque, segundo plano). */
  cancelled: number;
}

interface Result {
  id: number;
  seconds: number;
  counts: Counts;
  strokes: number;
  points: number;
  frames: MonitorReport;
  hung: number;
  verdict: string;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** Presión del toque: 0–1 si el dispositivo la da (lápiz); 0.5 con el dedo, que no la informa. */
const pressureOf = (e: GestureResponderEvent): number => {
  const f = e.nativeEvent.force;
  return typeof f === 'number' && f > 0 && f <= 1 ? f : 0.5;
};

/**
 * Prueba del lienzo (AR-T2, docs/design/artes/ESPECIFICACION.md §6): para que un adulto compruebe en la tableta que dibujar con el dedo o el
 * lápiz es fluido, que no se pierden trazos, que cancelar un trazo no lo deja colgado y que deshacer funciona. Pinta con Skia. No usa
 * micrófono, cámara, archivos ni internet. Está en Modo padres (tras el PIN).
 */
export function CanvasTestScreen({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [drawing, setDrawing] = useState<Drawing>(emptyDrawing);
  const [bru, setBru] = useState<Brush>(brush());
  const [testing, setTesting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [counts, setCounts] = useState<Counts>({ started: 0, ended: 0, cancelled: 0 });
  const [frames, setFrames] = useState<MonitorReport | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [awaiting, setAwaiting] = useState<Omit<Result, 'verdict'> | null>(null);
  /** Verdad actual del dibujo para los manejadores de toque (el estado de React llega un cuadro tarde). */
  const live = useRef<Drawing>(drawing);
  const countsRef = useRef<Counts>(counts);
  /** true mientras hay más de un dedo: no se dibuja hasta soltarlos todos (evita la palma sobre el lienzo). */
  const multi = useRef(false);
  const monitor = useRef(new PumpMonitor(JANK_MS));
  const startedAt = useRef(0);
  const nextId = useRef(1);
  const testingRef = useRef(false);
  const bruRef = useRef(bru);
  bruRef.current = bru;

  const apply = (next: Drawing) => {
    live.current = next;
    setDrawing(next);
  };
  const bump = (k: keyof Counts) => {
    countsRef.current = { ...countsRef.current, [k]: countsRef.current[k] + 1 };
    setCounts(countsRef.current);
  };

  const onStart = (e: GestureResponderEvent) => {
    if (e.nativeEvent.touches.length > 1) {
      // segundo dedo: el trazo en curso se cancela y no se dibuja hasta soltar todo
      multi.current = true;
      if (live.current.active) {
        apply(cancelStroke(live.current));
        bump('cancelled');
      }
      return;
    }
    multi.current = false;
    apply(beginStroke(live.current, e.nativeEvent.locationX, e.nativeEvent.locationY, pressureOf(e), bruRef.current));
    bump('started');
  };
  const onMove = (e: GestureResponderEvent) => {
    if (multi.current) return;
    if (e.nativeEvent.touches.length > 1) {
      multi.current = true;
      if (live.current.active) {
        apply(cancelStroke(live.current));
        bump('cancelled');
      }
      return;
    }
    if (!live.current.active) return;
    const next = extendStroke(live.current, e.nativeEvent.locationX, e.nativeEvent.locationY, pressureOf(e));
    if (next !== live.current) apply(next);
  };
  const onEnd = (e: GestureResponderEvent) => {
    if (e.nativeEvent.touches.length === 0) {
      const wasMulti = multi.current;
      multi.current = false;
      if (wasMulti) return;
    } else if (multi.current) return;
    if (live.current.active) {
      apply(endStroke(live.current));
      bump('ended');
    }
  };
  /** El sistema le quitó el toque a la pantalla (llamada, gesto de borde, etc.). */
  const onCancel = () => {
    multi.current = false;
    if (live.current.active) {
      apply(cancelStroke(live.current));
      bump('cancelled');
    }
  };

  // Midiendo los cuadros mientras dura la prueba: un cuadro lento es un tirón al dibujar.
  useEffect(() => {
    if (!testing) return;
    let raf = 0;
    const frame = () => {
      monitor.current.record(Date.now());
      const secs = (Date.now() - startedAt.current) / 1000;
      setElapsed(Math.floor(secs));
      setFrames(monitor.current.report());
      if (secs >= TEST_SECONDS) {
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [testing]);

  // La app a segundo plano: el trazo en curso se cancela (no queda colgado) y la prueba se detiene.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') return;
      onCancel();
      if (testingRef.current) finish();
    });
    return () => sub.remove();
  }, []);

  function finish() {
    if (!testingRef.current) return;
    testingRef.current = false;
    setTesting(false);
    const d = live.current;
    setAwaiting({
      id: nextId.current++,
      seconds: Math.min(TEST_SECONDS, Math.round((Date.now() - startedAt.current) / 1000)),
      counts: countsRef.current,
      strokes: d.strokes.length,
      points: totalPoints(d),
      frames: monitor.current.report(),
      // colgado = trazo activo cuando ya no hay dedo puesto
      hung: d.active ? 1 : 0,
    });
  }

  const startTest = () => {
    apply(emptyDrawing());
    countsRef.current = { started: 0, ended: 0, cancelled: 0 };
    setCounts(countsRef.current);
    monitor.current.reset();
    startedAt.current = Date.now();
    testingRef.current = true;
    setAwaiting(null);
    setElapsed(0);
    setTesting(true);
  };

  const doUndo = () => apply(undo(live.current));
  const doRedo = () => apply(redo(live.current));
  const doClear = () => apply(clearDrawing(live.current));
  const verdict = (text: string) => {
    if (!awaiting) return;
    setResults((r) => [...r, { ...awaiting, verdict: text }]);
    setAwaiting(null);
  };

  const summary = results
    .map(
      (r) =>
        `#${r.id} · ${clock(r.seconds)} · trazos empezados ${r.counts.started} / guardados ${r.counts.ended} / cancelados ${r.counts.cancelled} · en pantalla ${r.strokes} (${r.points} puntos) · colgados ${r.hung} · cuadros lentos (> ${JANK_MS} ms) ${r.frames.stalls} (máx. ${r.frames.maxGapMs} ms, media ${r.frames.meanGapMs} ms) · se vio: ${r.verdict}`,
    )
    .join('\n');
  const active = drawing.active !== null;

  return (
    <ScrollView scrollEnabled={!active} style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label="Volver">
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]}>Prueba del lienzo</Text>
      </View>
      <Text style={styles.note}>
        Para Arte y música. Comprueba que dibujar con el dedo o el lápiz sea fluido y que no se pierdan trazos. No usa micrófono, cámara, archivos ni internet; el dibujo no sale del equipo.
      </Text>

      <View style={styles.card}>
        <Text style={styles.h3}>Color</Text>
        <View style={styles.chips}>
          {BRUSH_COLORS.map((c) => {
            const on = !bru.eraser && bru.color === c;
            return (
              <Pressable key={c} onPress={() => setBru(brush(c, bru.eraser ? BRUSH_WIDTHS[1] : bru.width))} accessibilityRole="button" accessibilityLabel={`Color ${c}`} accessibilityState={{ selected: on }} style={[styles.swatch, { backgroundColor: c }, on && styles.swatchOn]} />
            );
          })}
          <Pressable onPress={() => setBru(brush('#FFFFFF', ERASER_WIDTH, true))} accessibilityRole="button" accessibilityLabel="Goma" accessibilityState={{ selected: bru.eraser }} style={[styles.chip, bru.eraser && styles.chipOn]}>
            <Text style={[styles.chipText, bru.eraser && styles.chipTextOn]}>Goma</Text>
          </Pressable>
        </View>
        <Text style={styles.h3}>Grosor</Text>
        <View style={styles.segmented}>
          {BRUSH_WIDTHS.map((w, i) => {
            const on = !bru.eraser && bru.width === w;
            return (
              <Pressable key={w} onPress={() => setBru(brush(bru.eraser ? BRUSH_COLORS[0] : bru.color, w))} accessibilityRole="button" accessibilityState={{ selected: on }} style={[styles.segment, on && styles.segmentOn]}>
                <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{['Fino', 'Medio', 'Grueso'][i]}</Text>
              </Pressable>
            );
          })}
        </View>

        <View
          style={styles.canvas}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
          onResponderGrant={onStart}
          onResponderMove={onMove}
          onResponderRelease={onEnd}
          onResponderTerminate={onCancel}
          // un segundo dedo que se suma llega por aquí (el primero ya entró por onResponderGrant)
          onResponderStart={(e) => {
            if (e.nativeEvent.touches.length > 1) onStart(e);
          }}
          accessible
          accessibilityLabel="Lienzo de dibujo"
        >
          <StrokeLayer strokes={visibleStrokes(drawing)} />
        </View>

        <View style={styles.actions}>
          <Button label="Deshacer" variant="secondary" onPress={doUndo} disabled={!canUndo(drawing)} />
          <Button label="Rehacer" variant="secondary" onPress={doRedo} disabled={!canRedo(drawing)} />
          <Button label="Borrar todo" variant="secondary" onPress={doClear} />
          {!testing && <Button label={`Prueba de ${TEST_SECONDS} segundos`} onPress={startTest} />}
          {testing && <Button label="Terminar ya" variant="secondary" onPress={finish} />}
        </View>
        {testing && <Text style={styles.small}>Prueba en curso: {clock(elapsed)} de {clock(TEST_SECONDS)}. Dibuja sin parar: líneas largas, círculos, garabatos. Prueba también con dos dedos a la vez y apoyando la palma.</Text>}
      </View>

      {awaiting && (
        <View style={styles.card}>
          <Text style={styles.h3}>Terminó la prueba de {clock(awaiting.seconds)}</Text>
          <Text style={styles.note}>¿Cómo se vio y se sintió?</Text>
          <View style={styles.actions}>
            <Button label="Todo bien" onPress={() => verdict('todo bien')} />
            <Button label="Perdió trazos" variant="secondary" onPress={() => verdict('perdió trazos')} />
            <Button label="Quedó un trazo colgado" variant="secondary" onPress={() => verdict('trazo colgado')} />
            <Button label="Con tirones" variant="secondary" onPress={() => verdict('con tirones')} />
            <Button label="La pantalla se movió al dibujar" variant="secondary" onPress={() => verdict('la pantalla se movió al dibujar')} />
            <Button label="El trazo iba detrás del dedo" variant="secondary" onPress={() => verdict('el trazo iba detrás del dedo')} />
          </View>
        </View>
      )}

      <View style={styles.diag}>
        <Text style={styles.h3}>Lo que mide</Text>
        <Text style={styles.small}>Trazos: empezados {counts.started} · guardados {counts.ended} · cancelados {counts.cancelled}</Text>
        <Text style={styles.small}>En pantalla: {drawing.strokes.length} trazos · {totalPoints(drawing)} puntos · {active ? 'dedo puesto' : 'sin trazo en curso'}</Text>
        {frames && (
          <Text style={styles.small}>
            Cuadros: {frames.pumps} · media {frames.meanGapMs} ms · cuadro más lento {frames.maxGapMs} ms · lentos (&gt; {JANK_MS} ms): {frames.stalls}
          </Text>
        )}
        <Text style={styles.small}>
          Empezados = guardados + cancelados (+1 si aún tienes el dedo puesto). Si no cuadra, se perdió un trazo. Un cuadro lento es un tirón al dibujar.
        </Text>
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
  card: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, gap: 12, boxShadow: shadows.card },
  canvas: { height: CANVAS_HEIGHT, borderRadius: radius.tile, overflow: 'hidden', borderWidth: 2, borderColor: colors.line },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  swatch: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, borderColor: 'transparent' },
  swatchOn: { borderColor: colors.brand },
  chip: { minHeight: 44, paddingHorizontal: 14, borderRadius: 12, justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  chipOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.ink },
  chipTextOn: { color: '#ffffff' },
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

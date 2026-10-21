import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Image, type GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ARTE_COPY, PAPER, PAPER_H, PAPER_W, beginStroke, brush, cancelStroke, canRedo, canUndo, clearDrawing, colorOf, drawingOf, endStroke, extendStroke, recipeText, redo, undo, visibleStrokes,
  withDrawing, type ArtLang, type Drawing, type PaintScene, type PaletteColor,
} from '@lee-conmigo/art-content';
import { Button, colors, fontFamily, radius } from '@lee-conmigo/ui-native';
import { SvgStrokeLayer } from '../../screens/svg-stroke-layer';
import { MAT_ART, PAINT_ART } from './art';

/** Grosores del pincel en unidades del lienzo lógico (1000 de ancho), y de la goma. */
const SIZES = [4, 10, 22] as const;
const ERASER_SIZE = 40;
const BRUSH_IMG = [PAINT_ART.pincelFino, PAINT_ART.pincelMedio, PAINT_ART.pincelGrueso] as const;
export const VIEW_BOX = `0 0 ${PAPER_W} ${PAPER_H}`;

/** ¿Es un color oscuro? (para elegir blanco o azul oscuro en la marca de «elegido» encima). */
export function luminanceDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

/** El color elegido, o el primero si el elegido ya no está entre los que se ofrecen. */
export const pickColor = (palette: readonly PaletteColor[], selected: string): PaletteColor => palette.find((c) => c.id === selected) ?? palette[0]!;

interface Props {
  lang: ArtLang;
  /** El cuadro que se pinta (guarda su dibujo; el área solo cambia el dibujo). */
  scene: PaintScene;
  /** Los colores que se ofrecen (toda la paleta, o solo los cuatro de la unidad). */
  palette: readonly PaletteColor[];
  selected: string;
  onSelect: (id: string) => void;
  /** Guardado automático: al terminar cada trazo, al deshacer/rehacer/borrar. */
  onScene: (scene: PaintScene) => void;
  /** Se avisa cuando se está dibujando (para que la pantalla no se desplace con el dedo). */
  onDrawing?: (active: boolean) => void;
  /** Botones propios de la pantalla que se suman a «Deshacer / Rehacer». */
  extraActions?: ReactNode;
  /** Si es falso, no se muestra el texto «Empieza a pintar…» cuando el lienzo está vacío. */
  showHint?: boolean;
}

/**
 * Lienzo + paleta + pincel + deshacer/rehacer/borrar todo, para un cuadro. Lo usan el Taller de pintura y la unidad A2-U02 (que ofrece solo cuatro
 * colores). Los trazos se dibujan con SVG; un segundo dedo (o la palma) cancela el trazo en curso.
 */
export function PaintArea({ lang, scene, palette, selected, onSelect, onScene, onDrawing, extraActions, showHint = true }: Props) {
  const t = ARTE_COPY[lang];
  const sceneRef = useRef(scene);
  sceneRef.current = scene;
  const [d, setD] = useState<Drawing>(() => drawingOf(scene));
  const live = useRef(d);
  const [eraser, setEraser] = useState(false);
  const [size, setSize] = useState(1);
  const [confirmClear, setConfirmClear] = useState(false);
  const [width, setWidth] = useState(PAPER_W);
  const multi = useRef(false);

  const current = pickColor(palette, selected);
  useEffect(() => {
    if (current.id !== selected) onSelect(current.id);
  }, [current.id, selected, onSelect]);
  useEffect(() => {
    onDrawing?.(!!d.active);
  }, [d.active, onDrawing]);

  const apply = (next: Drawing, save: boolean) => {
    live.current = next;
    setD(next);
    if (save) onScene(withDrawing(sceneRef.current, next));
  };
  const toLogical = (e: GestureResponderEvent) => {
    const k = PAPER_W / Math.max(1, width);
    return { x: e.nativeEvent.locationX * k, y: e.nativeEvent.locationY * k };
  };
  const pressure = (e: GestureResponderEvent) => {
    const f = e.nativeEvent.force;
    return typeof f === 'number' && f > 0 && f <= 1 ? f : 0.5;
  };
  const currentBrush = () => (eraser ? brush(PAPER, ERASER_SIZE, true) : brush(colorOf(current), SIZES[size]));

  const onStart = (e: GestureResponderEvent) => {
    if (e.nativeEvent.touches.length > 1) {
      // un segundo dedo (o la palma) cancela el trazo en curso y no se pinta hasta soltar todo
      multi.current = true;
      if (live.current.active) apply(cancelStroke(live.current), false);
      return;
    }
    multi.current = false;
    const p = toLogical(e);
    apply(beginStroke(live.current, p.x, p.y, pressure(e), currentBrush()), false);
  };
  const onMove = (e: GestureResponderEvent) => {
    if (multi.current) return;
    if (e.nativeEvent.touches.length > 1) {
      multi.current = true;
      if (live.current.active) apply(cancelStroke(live.current), false);
      return;
    }
    if (!live.current.active) return;
    const p = toLogical(e);
    const next = extendStroke(live.current, p.x, p.y, pressure(e));
    if (next !== live.current) apply(next, false);
  };
  const onEnd = (e: GestureResponderEvent) => {
    if (e.nativeEvent.touches.length > 0 && multi.current) return;
    multi.current = false;
    if (live.current.active) apply(endStroke(live.current), true);
  };
  const onCancel = () => {
    multi.current = false;
    if (live.current.active) apply(cancelStroke(live.current), false);
  };

  const strokeCount = d.strokes.length + (d.active ? 1 : 0);

  return (
    <View style={styles.wrap}>
      <View
        style={styles.canvas}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={onStart}
        onResponderStart={(e) => {
          if (e.nativeEvent.touches.length > 1) onStart(e);
        }}
        onResponderMove={onMove}
        onResponderRelease={onEnd}
        onResponderTerminate={onCancel}
        accessible
        accessibilityLabel={t.canvasLabel}
      >
        <SvgStrokeLayer strokes={visibleStrokes(d)} viewBox={VIEW_BOX} />
        {/* el grano del papel va ENCIMA y muy suave: así la goma (que pinta del color del papel) no deja huella lisa */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Image source={MAT_ART.paperFibers} resizeMode="cover" accessible={false} style={styles.grain} />
        </View>
      </View>
      {showHint && strokeCount === 0 && <Text style={styles.hint}>{t.paintEmpty}</Text>}

      <View style={styles.titleRow}>
        <Image source={PAINT_ART.paleta} resizeMode="contain" accessible={false} style={styles.titleImg} />
        <Text style={styles.h3}>{t.colorsLabel}</Text>
      </View>
      <View style={styles.chips}>
        {palette.map((c) => {
          const on = !eraser && c.id === current.id;
          return (
            <Pressable key={c.id} onPress={() => { onSelect(c.id); setEraser(false); }} accessibilityRole="button" accessibilityLabel={t.colorLabel(recipeText(c.recipe, lang))} accessibilityState={{ selected: on }} style={[styles.swatch, { backgroundColor: colorOf(c) }, on && styles.swatchOn]}>
              {on && <Text style={[styles.swatchCheck, { color: luminanceDark(colorOf(c)) ? '#ffffff' : '#1E2340' }]}>✓</Text>}
            </Pressable>
          );
        })}
        <Pressable onPress={() => setEraser(true)} accessibilityRole="button" accessibilityState={{ selected: eraser }} style={[styles.chip, eraser && styles.chipOn]}>
          <View style={styles.chipRow}>
            <Image source={PAINT_ART.goma} resizeMode="contain" accessible={false} style={styles.chipImg} />
            <Text style={[styles.chipText, eraser && styles.chipTextOn]}>{eraser ? '✓ ' : ''}{t.eraser}</Text>
          </View>
        </Pressable>
      </View>

      <Text style={styles.h3}>{t.sizeLabel}</Text>
      <View style={styles.segmented}>
        {SIZES.map((_, i) => (
          <Pressable key={i} onPress={() => setSize(i)} accessibilityRole="button" accessibilityLabel={t.sizes[i]} accessibilityState={{ selected: size === i }} style={[styles.segment, size === i && styles.segmentOn]}>
            <Image source={BRUSH_IMG[i]} resizeMode="contain" accessible={false} style={styles.brushImg} />
            <Text style={[styles.segmentText, size === i && styles.segmentTextOn]}>{size === i ? '✓ ' : ''}{t.sizes[i]}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.actions}>
        <Button label={t.undo} variant="secondary" onPress={() => apply(undo(live.current), true)} disabled={!canUndo(d)} />
        <Button label={t.redo} variant="secondary" onPress={() => apply(redo(live.current), true)} disabled={!canRedo(d)} />
        {extraActions}
      </View>

      {confirmClear ? (
        <>
          <Text style={styles.h3}>{t.clearAsk}</Text>
          <View style={styles.actions}>
            <Button label={t.clearYes} variant="secondary" onPress={() => { apply(clearDrawing(live.current), true); setConfirmClear(false); }} />
            <Button label={t.removeNo} onPress={() => setConfirmClear(false)} />
          </View>
        </>
      ) : (
        <View style={styles.actions}>
          <Button label={t.clearAll} variant="secondary" onPress={() => setConfirmClear(true)} disabled={d.strokes.length === 0} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  hint: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.brand },
  canvas: { width: '100%', maxWidth: 1100, aspectRatio: PAPER_W / PAPER_H, alignSelf: 'center', borderRadius: radius.tile, overflow: 'hidden', borderWidth: 2, borderColor: colors.line, backgroundColor: PAPER },
  grain: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.22 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  swatch: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  swatchOn: { borderColor: colors.brand, borderWidth: 4 },
  swatchCheck: { fontFamily: fontFamily.ui.black, fontSize: 20 },
  chip: { minHeight: 56, paddingHorizontal: 14, borderRadius: 12, justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  chipOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.ink },
  chipTextOn: { color: '#ffffff' },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chipImg: { width: 40, height: 40 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titleImg: { width: 44, height: 44 },
  brushImg: { width: 44, height: 44 },
  segmented: { flexDirection: 'row', gap: 6, backgroundColor: colors.chip, borderRadius: 14, padding: 4 },
  segment: { flex: 1, minHeight: 64, borderRadius: 10, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  segmentOn: { backgroundColor: colors.brand },
  segmentText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.inkSoft },
  segmentTextOn: { color: '#ffffff' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
});

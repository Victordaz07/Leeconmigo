import { useEffect, useRef, useState } from 'react';
import { type GestureResponderEvent, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ARTE_COPY, MAX_DROPS, MAX_TITLE, PAPER, PAPER_H, PAPER_W, PIGMENTS, PIGMENT_NAME, addDrop, addToPalette, beginStroke, brush, cancelStroke, canRedo, canUndo, clearDrawing, colorOf, drawingOf, dropsOf,
  emptyRecipe, endStroke, extendStroke, hexOf, paintOf, recipeText, redo, removeDrop, removeFromPalette, undo, visibleStrokes, withDrawing, type ArtLang, type ArtProject, type Drawing, type PaintScene,
  type Pigment, type Recipe,
} from '@lee-conmigo/art-content';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { SvgStrokeLayer } from '../../screens/svg-stroke-layer';
import { ArtBackdrop } from './art-backdrop';

/** Grosores del pincel en unidades del lienzo lógico (1000 de ancho), y de la goma. */
const SIZES = [4, 10, 22] as const;
const ERASER_SIZE = 40;
const VIEW_BOX = `0 0 ${PAPER_W} ${PAPER_H}`;
const PIGMENT_LABEL_COLOR: Record<Pigment, string> = { red: '#FF0000', yellow: '#FFFF00', blue: '#2A5F99', white: '#FFFFFF', black: '#000000' };

interface Props {
  lang: ArtLang;
  project: ArtProject;
  /** Guardado automático: al terminar cada trazo, al deshacer/rehacer/borrar y al cambiar la paleta. */
  onScene: (scene: PaintScene) => void;
  onRename: (title: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBack: () => void;
}

/**
 * Taller de pintura (Taller libre, AR-05): un lienzo para pintar con el dedo o el lápiz y una paleta de colores que el niño mezcla con gotas
 * de pintura (modelo didáctico de `mixing.ts`). Se guarda solo; sin nota ni «terminar». Los trazos se dibujan con SVG (el motor que se probó en la tableta).
 */
export function PaintWorkshop({ lang, project, onScene, onRename, onDuplicate, onDelete, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = ARTE_COPY[lang];
  const scene = paintOf(project)!;
  const sceneRef = useRef(scene);
  sceneRef.current = scene;

  const [d, setD] = useState<Drawing>(() => drawingOf(scene));
  const live = useRef(d);
  const [name, setName] = useState(project.title);
  const [selected, setSelected] = useState(scene.palette[0]!.id);
  const [eraser, setEraser] = useState(false);
  const [size, setSize] = useState(1);
  const [mixing, setMixing] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>(emptyRecipe());
  const [mixSaved, setMixSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [width, setWidth] = useState(PAPER_W);
  const multi = useRef(false);

  // si el color elegido se quitó de la paleta, se elige el primero
  const current = scene.palette.find((c) => c.id === selected) ?? scene.palette[0]!;
  useEffect(() => {
    if (current.id !== selected) setSelected(current.id);
  }, [current.id, selected]);

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
  const rName = (p: Pigment) => PIGMENT_NAME[p][lang];
  const total = dropsOf(recipe);
  const mixHex = total > 0 ? hexOf(recipe) : null;

  const savePalette = (palette: PaintScene['palette']) => onScene({ ...sceneRef.current, palette });
  const saveMix = () => {
    if (total === 0) return;
    const r = addToPalette(sceneRef.current.palette, recipe);
    if (r.id === null) return;
    savePalette(r.palette);
    setSelected(r.id);
    setEraser(false);
    setMixSaved(true);
  };

  return (
    <View style={styles.root}>
      <ArtBackdrop kind="pintura" />
    <ScrollView scrollEnabled={!d.active} style={styles.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={t.back}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]} numberOfLines={1}>
          {t.paintTitle}
        </Text>
        <Text style={styles.saved} accessibilityLiveRegion="polite" accessibilityLabel={t.saved}>
          {layout.phone ? '✓' : `✓ ${t.saved}`}
        </Text>
      </View>

      <View style={styles.card}>
        <TextInput value={name} onChangeText={setName} onEndEditing={() => onRename(name)} onBlur={() => onRename(name)} maxLength={MAX_TITLE} accessibilityLabel={t.nameLabel} style={styles.input} />
        <Text style={styles.note}>{t.paintHint}</Text>

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
        </View>
        {strokeCount === 0 && <Text style={styles.hint}>{t.paintEmpty}</Text>}

        <Text style={styles.h3}>{t.colorsLabel}</Text>
        <View style={styles.chips}>
          {scene.palette.map((c) => {
            const on = !eraser && c.id === current.id;
            return (
              <Pressable key={c.id} onPress={() => { setSelected(c.id); setEraser(false); }} accessibilityRole="button" accessibilityLabel={t.colorLabel(recipeText(c.recipe, lang))} accessibilityState={{ selected: on }} style={[styles.swatch, { backgroundColor: colorOf(c) }, on && styles.swatchOn]}>
                {on && <Text style={[styles.swatchCheck, { color: luminanceDark(colorOf(c)) ? '#ffffff' : '#1E2340' }]}>✓</Text>}
              </Pressable>
            );
          })}
          <Pressable onPress={() => setEraser(true)} accessibilityRole="button" accessibilityState={{ selected: eraser }} style={[styles.chip, eraser && styles.chipOn]}>
            <Text style={[styles.chipText, eraser && styles.chipTextOn]}>{eraser ? '✓ ' : ''}{t.eraser}</Text>
          </Pressable>
        </View>

        <Text style={styles.h3}>{t.sizeLabel}</Text>
        <View style={styles.segmented}>
          {SIZES.map((_, i) => (
            <Pressable key={i} onPress={() => setSize(i)} accessibilityRole="button" accessibilityState={{ selected: size === i }} style={[styles.segment, size === i && styles.segmentOn]}>
              <Text style={[styles.segmentText, size === i && styles.segmentTextOn]}>{t.sizes[i]}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.actions}>
          <Button label={t.undo} variant="secondary" onPress={() => apply(undo(live.current), true)} disabled={!canUndo(d)} />
          <Button label={t.redo} variant="secondary" onPress={() => apply(redo(live.current), true)} disabled={!canRedo(d)} />
          <Button label={mixing ? t.mixClose : t.mixOpen} onPress={() => { setMixing(!mixing); setMixSaved(false); }} />
        </View>
      </View>

      {mixing && (
        <View style={styles.card}>
          <Text style={styles.h3}>{t.mixTitle}</Text>
          <Text style={styles.note}>{t.mixHint}</Text>
          <View style={styles.pots}>
            {PIGMENTS.map((p) => (
              <View key={p} style={styles.pot}>
                <Pressable onPress={() => { setRecipe(addDrop(recipe, p)); setMixSaved(false); }} accessibilityRole="button" accessibilityLabel={`${t.mixAdd(rName(p))}. ${recipe[p]}`} style={[styles.potDot, { backgroundColor: PIGMENT_LABEL_COLOR[p] }, p === 'white' && styles.potWhite]}>
                  <Text style={[styles.potCount, { color: p === 'yellow' || p === 'white' ? '#1E2340' : '#ffffff' }]}>{recipe[p] > 0 ? recipe[p] : '+'}</Text>
                </Pressable>
                <Text style={styles.potName}>{rName(p)}</Text>
                <Pressable onPress={() => { setRecipe(removeDrop(recipe, p)); setMixSaved(false); }} disabled={recipe[p] === 0} accessibilityRole="button" accessibilityLabel={t.mixRemove(rName(p))} style={[styles.potMinus, recipe[p] === 0 && styles.potMinusOff]}>
                  <Text style={styles.potMinusText}>−</Text>
                </Pressable>
              </View>
            ))}
          </View>
          <Text style={styles.h3}>{t.mixResult}</Text>
          <View style={styles.mixRow}>
            <View style={[styles.mixSwatch, mixHex ? { backgroundColor: mixHex } : styles.mixSwatchEmpty]} accessibilityLabel={total > 0 ? recipeText(recipe, lang) : t.mixEmpty} />
            <Text style={styles.line}>{total > 0 ? recipeText(recipe, lang) : t.mixEmpty}</Text>
          </View>
          {total >= MAX_DROPS && <Text style={styles.small}>{t.mixFull}</Text>}
          <View style={styles.actions}>
            <Button label={t.mixSave} onPress={saveMix} disabled={total === 0} />
            <Button label={t.mixClear} variant="secondary" onPress={() => { setRecipe(emptyRecipe()); setMixSaved(false); }} disabled={total === 0} />
          </View>
          {mixSaved && <Text style={styles.ok}>✓ {t.mixSaved}</Text>}
          <Text style={styles.small}>{t.mixNote}</Text>
        </View>
      )}

      <View style={styles.card}>
        {scene.palette.length > 1 && (
          <View style={styles.actions}>
            <Button label={t.removeColor} variant="secondary" onPress={() => savePalette(removeFromPalette(scene.palette, current.id))} disabled={eraser} />
          </View>
        )}
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

      <View style={styles.card}>
        <View style={styles.actions}>
          <Button label={t.duplicate} variant="secondary" onPress={onDuplicate} />
          {confirmDelete ? (
            <>
              <Text style={styles.h3}>{t.removeAsk(project.title)}</Text>
              <Button label={t.removeYes} variant="secondary" onPress={onDelete} />
              <Button label={t.removeNo} onPress={() => setConfirmDelete(false)} />
            </>
          ) : (
            <Button label={t.remove} variant="secondary" onPress={() => setConfirmDelete(true)} />
          )}
        </View>
      </View>
      <Text style={styles.small}>{t.privacy}</Text>
    </ScrollView>
    </View>
  );
}

/** ¿Es un color oscuro? (para elegir blanco o azul oscuro en la marca de «elegido» encima). */
function luminanceDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.app },
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,248,236,0.88)', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 8 },
  title: { flex: 1, fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  titleSmall: { fontSize: 26 },
  saved: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 15, lineHeight: 21, color: colors.inkSoft },
  line: { flex: 1, fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 18, color: colors.muted },
  hint: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.brand },
  ok: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.ok },
  card: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, gap: 12, boxShadow: shadows.card },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 2, borderColor: colors.line, backgroundColor: '#ffffff', paddingHorizontal: 14, fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.ink },
  canvas: { width: '100%', maxWidth: 1100, aspectRatio: PAPER_W / PAPER_H, alignSelf: 'center', borderRadius: radius.tile, overflow: 'hidden', borderWidth: 2, borderColor: colors.line, backgroundColor: PAPER },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  swatch: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  swatchOn: { borderColor: colors.brand, borderWidth: 4 },
  swatchCheck: { fontFamily: fontFamily.ui.black, fontSize: 20 },
  chip: { minHeight: 48, paddingHorizontal: 14, borderRadius: 12, justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  chipOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.ink },
  chipTextOn: { color: '#ffffff' },
  segmented: { flexDirection: 'row', gap: 6, backgroundColor: colors.chip, borderRadius: 14, padding: 4 },
  segment: { flex: 1, height: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segmentOn: { backgroundColor: colors.brand },
  segmentText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.inkSoft },
  segmentTextOn: { color: '#ffffff' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  pots: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'flex-start' },
  pot: { alignItems: 'center', gap: 6, width: 84 },
  potDot: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(0,0,0,0.12)' },
  potWhite: { borderColor: colors.line },
  potCount: { fontFamily: fontFamily.ui.black, fontSize: 24 },
  potName: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.ink },
  potMinus: { minWidth: 48, minHeight: 40, borderRadius: 12, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  potMinusOff: { opacity: 0.4 },
  potMinusText: { fontFamily: fontFamily.ui.black, fontSize: 22, color: colors.inkSoft },
  mixRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  mixSwatch: { width: 96, height: 96, borderRadius: 20, borderWidth: 3, borderColor: colors.line },
  mixSwatchEmpty: { backgroundColor: '#ffffff', borderStyle: 'dashed' },
});

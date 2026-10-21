import { useEffect, useId, useRef, useState } from 'react';
import { Image, type GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Image as SvgImage, Path, Rect } from 'react-native-svg';
import {
  BACKGROUNDS, BACKGROUND_IDS, COLLAGE_COPY, PAPER_COLORS, PAPER_COLOR_IDS, PAPER_H, PAPER_W, ROTATE_STEP, SCALE_STEP, SHAPES, addPiece, canRedoPieces, canUndoPieces, clearPieces, deletePiece, duplicatePiece,
  extents, hitTest, historyOf, movePiece, pushHistory, recolorPiece, redoPieces, reorderPiece, rotatePiece, scalePiece, setBackground, shapePath, undoPieces, type ArtLang, type CollageHistory, type CollageScene,
  type Layer, type PaperColor, type Piece, type Shape,

} from '@lee-conmigo/art-content';
import { Button, colors, fontFamily, radius } from '@lee-conmigo/ui-native';
import { BOARD_TEXTURE, PIECE_TEXTURE } from './art';

const VIEW_BOX = `0 0 ${PAPER_W} ${PAPER_H}`;
const LAYERS: Layer[] = ['front', 'back', 'up', 'down'];

/** Caja del contorno de selección: un poco más grande que la pieza, y nunca menor que la zona donde cabe un dedo. */
function selBox(p: Piece) {
  const e = extents(p.shape, p.size);
  const hw = Math.max(e.hw, 24) + 8;
  const hh = Math.max(e.hh, 24) + 8;
  return { x: -hw, y: -hh, width: 2 * hw, height: 2 * hh };
}

/** Dibuja las piezas de un collage (sin tocar): lo usan el taller y las miniaturas. */
export function CollageSvg({ scene, selectedId }: { scene: CollageScene; selectedId?: string | null }) {
  // Los identificadores de recorte deben ser únicos en toda la pantalla (varias miniaturas a la vez): se les pone un prefijo propio.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const sel = selectedId ? scene.pieces.find((p) => p.id === selectedId) : undefined;
  const board = BOARD_TEXTURE[scene.background];
  return (
    <Svg width="100%" height="100%" viewBox={VIEW_BOX}>
      <Rect x={0} y={0} width={PAPER_W} height={PAPER_H} fill={BACKGROUNDS[scene.background]} />
      {board && <SvgImage href={board} x={0} y={0} width={PAPER_W} height={PAPER_H} preserveAspectRatio="xMidYMid slice" />}
      {scene.pieces.map((p) => {
        const tex = PIECE_TEXTURE[p.color];
        const clip = `clip${uid}${p.id}`;
        const e = extents(p.shape, p.size);
        const d = shapePath(p.shape, p.size);
        const seeThrough = p.color === 'tissue';
        return (
          <G key={p.id} transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`}>
            {/* el color liso va siempre debajo: si la textura no carga, la pieza se ve igual */}
            <Path d={d} fill={PAPER_COLORS[p.color]} fillOpacity={seeThrough ? 0.85 : 1} stroke="rgba(0,0,0,0.18)" strokeWidth={2} strokeLinejoin="round" />
            {tex && (
              <>
                <Defs>
                  <ClipPath id={clip}>
                    <Path d={d} />
                  </ClipPath>
                </Defs>
                <G clipPath={`url(#${clip})`} opacity={seeThrough ? 0.8 : 1}>
                  <SvgImage href={tex} x={-e.hw} y={-e.hh} width={2 * e.hw} height={2 * e.hh} preserveAspectRatio="xMidYMid slice" />
                </G>
              </>
            )}
          </G>
        );
      })}
      {sel && (
        <G transform={`translate(${sel.x} ${sel.y}) rotate(${sel.rot})`}>
          <Rect {...selBox(sel)} rx={8} fill="none" stroke="#ffffff" strokeWidth={10} />
          <Rect {...selBox(sel)} rx={8} fill="none" stroke="#1E6FE8" strokeWidth={5} strokeDasharray="14 9" />
        </G>
      )}
    </Svg>
  );
}

/** Un botón-forma de la bandeja: la forma dibujada con el color de papel actual. */
function ShapeButton({ shape, color, label, onPress }: { shape: Shape; color: PaperColor; label: string; onPress: () => void }) {
  const size = shape === 'strip' ? 26 : 38;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.shapeBtn}>
      <Svg width={56} height={56} viewBox="-30 -30 60 60">
        <Path d={shapePath(shape, size)} fill={PAPER_COLORS[color]} stroke="rgba(0,0,0,0.25)" strokeWidth={1.5} strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

interface Props {
  lang: ArtLang;
  scene: CollageScene;
  /** Guardado automático: al terminar de arrastrar y en cada cambio. */
  onScene: (scene: CollageScene) => void;
  /** Se avisa mientras se arrastra (para que la pantalla no se desplace con el dedo). */
  onDrawing?: (active: boolean) => void;
}

/**
 * Cartón de collage + formas + colores de papel + herramientas de la pieza elegida + deshacer/rehacer. Un dedo basta: tocar elige, arrastrar mueve; lo demás
 * son botones (así funciona también con lápiz y con ayudas de accesibilidad). Lo usan el Taller de collage y la unidad A1-U06.
 */
export function CollageArea({ lang, scene, onScene, onDrawing }: Props) {
  const t = COLLAGE_COPY[lang];
  const [cur, setCur] = useState(scene);
  const live = useRef(scene);
  live.current = cur;
  const [hist, setHist] = useState<CollageHistory>(() => historyOf(scene));
  const [sel, setSel] = useState<string | null>(null);
  const [color, setColor] = useState<PaperColor>('red');
  const [confirmClear, setConfirmClear] = useState(false);
  const [full, setFull] = useState(false);
  const [width, setWidth] = useState(PAPER_W);
  const drag = useRef<{ id: string; ox: number; oy: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const draft = useRef<CollageScene | null>(null);

  useEffect(() => {
    onDrawing?.(dragging);
  }, [dragging, onDrawing]);

  const selected = sel ? cur.pieces.find((p) => p.id === sel) : undefined;
  const apply = (next: CollageScene) => {
    if (next === live.current) return;
    live.current = next;
    setCur(next);
    setHist((h) => pushHistory(h, next));
    onScene(next);
  };
  const jump = (h: CollageHistory) => {
    setHist(h);
    live.current = h.present;
    setCur(h.present);
    onScene(h.present);
  };

  const toLogical = (e: GestureResponderEvent) => {
    const k = PAPER_W / Math.max(1, width);
    return { x: e.nativeEvent.locationX * k, y: e.nativeEvent.locationY * k };
  };
  const onStart = (e: GestureResponderEvent) => {
    if (e.nativeEvent.touches.length > 1) {
      // un segundo dedo cancela el arrastre en curso (la pieza vuelve adonde estaba)
      if (drag.current) {
        draft.current = null;
        drag.current = null;
        setCur(live.current);
        setDragging(false);
      }
      return;
    }
    const p = toLogical(e);
    const hit = hitTest(live.current, p.x, p.y);
    if (!hit) {
      setSel(null);
      return;
    }
    setSel(hit.id);
    setColor(hit.color);
    drag.current = { id: hit.id, ox: p.x - hit.x, oy: p.y - hit.y, moved: false };
    draft.current = live.current;
    setDragging(true);
  };
  const onMove = (e: GestureResponderEvent) => {
    const d = drag.current;
    if (!d || e.nativeEvent.touches.length > 1) return;
    const p = toLogical(e);
    const next = movePiece(live.current, d.id, p.x - d.ox, p.y - d.oy);
    if (next !== draft.current) {
      draft.current = next;
      d.moved = true;
      setCur(next);
    }
  };
  const onEnd = () => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (d && d.moved && draft.current) {
      const next = draft.current;
      draft.current = null;
      // `live` ya apunta al arrastre; se compara contra la escena guardada antes de arrastrar
      live.current = next;
      setHist((h) => pushHistory(h, next));
      onScene(next);
    }
  };
  const onCancel = () => {
    if (drag.current) {
      drag.current = null;
      draft.current = null;
      setCur(hist.present);
      live.current = hist.present;
      setDragging(false);
    }
  };

  const add = (shape: Shape) => {
    const r = addPiece(live.current, shape, color);
    setFull(r.id === null);
    if (r.id) {
      apply(r.scene);
      setSel(r.id);
    }
  };
  const chooseColor = (c: PaperColor) => {
    setColor(c);
    if (selected) apply(recolorPiece(live.current, selected.id, c));
  };
  const pickNext = () => {
    if (cur.pieces.length === 0) return;
    const i = sel ? cur.pieces.findIndex((p) => p.id === sel) : cur.pieces.length;
    setSel(cur.pieces[(i - 1 + cur.pieces.length) % cur.pieces.length]!.id);
  };
  const shownColor = selected?.color ?? color;

  return (
    <View style={styles.wrap}>
      <View
        style={[styles.board, { backgroundColor: BACKGROUNDS[cur.background] }]}
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
        <View style={styles.fill} pointerEvents="none">
          <CollageSvg scene={cur} selectedId={selected?.id} />
        </View>
      </View>
      {cur.pieces.length === 0 && <Text style={styles.hint}>{t.empty}</Text>}
      {full && <Text style={styles.hint}>{t.full}</Text>}

      <Text style={styles.h3}>{t.selectedTitle}</Text>
      {selected ? (
        <View style={styles.row}>
          <Button label={t.bigger} variant="secondary" onPress={() => apply(scalePiece(live.current, selected.id, SCALE_STEP))} />
          <Button label={t.smaller} variant="secondary" onPress={() => apply(scalePiece(live.current, selected.id, 1 / SCALE_STEP))} />
          <Button label={t.turnLeft} variant="secondary" onPress={() => apply(rotatePiece(live.current, selected.id, -ROTATE_STEP))} />
          <Button label={t.turnRight} variant="secondary" onPress={() => apply(rotatePiece(live.current, selected.id, ROTATE_STEP))} />
          {LAYERS.map((l) => (
            <Button key={l} label={t.layers[l]} variant="secondary" onPress={() => apply(reorderPiece(live.current, selected.id, l))} />
          ))}
          <Button
            label={t.copy}
            variant="secondary"
            onPress={() => {
              const r = duplicatePiece(live.current, selected.id);
              setFull(r.id === null);
              if (r.id) {
                apply(r.scene);
                setSel(r.id);
              }
            }}
          />
          <Button label={t.remove} variant="secondary" onPress={() => { apply(deletePiece(live.current, selected.id)); setSel(null); }} />
        </View>
      ) : (
        <Text style={styles.note}>{t.selectedNone}</Text>
      )}
      {cur.pieces.length > 1 && (
        <View style={styles.row}>
          <Button label={t.pickNext} variant="secondary" onPress={pickNext} />
        </View>
      )}

      <Text style={styles.h3}>{t.piecesTitle}</Text>
      <View style={styles.row}>
        {SHAPES.map((s) => (
          <ShapeButton key={s} shape={s} color={shownColor} label={t.addShape(t.shapes[s])} onPress={() => add(s)} />
        ))}
      </View>

      <Text style={styles.h3}>{t.colorsTitle}</Text>
      <View style={styles.row}>
        {PAPER_COLOR_IDS.map((c) => {
          const on = c === shownColor;
          return (
            <Pressable key={c} onPress={() => chooseColor(c)} accessibilityRole="button" accessibilityLabel={t.colorLabel(t.colors[c])} accessibilityState={{ selected: on }} style={[styles.swatch, { backgroundColor: PAPER_COLORS[c] }, on && styles.swatchOn]}>
              {PIECE_TEXTURE[c] && <Image source={PIECE_TEXTURE[c]} resizeMode="cover" accessible={false} style={styles.swatchTex} />}
              {on && <Text style={[styles.check, { color: c === 'yellow' || c === 'pink' || c === 'orange' || c === 'fibers' || c === 'tissue' || c === 'kraft' ? '#1E2340' : '#ffffff' }]}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.h3}>{t.backgroundTitle}</Text>
      <View style={styles.row}>
        {BACKGROUND_IDS.map((b) => {
          const on = cur.background === b;
          return (
            <Pressable key={b} onPress={() => apply(setBackground(live.current, b))} accessibilityRole="button" accessibilityLabel={t.backgrounds[b]} accessibilityState={{ selected: on }} style={[styles.bgChip, { backgroundColor: BACKGROUNDS[b] }, on && styles.swatchOn]}>
              <Text style={[styles.bgText, { color: b === 'night' ? '#ffffff' : '#1E2340' }]}>{on ? '✓ ' : ''}{t.backgrounds[b]}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.row}>
        <Button label={t.undo} variant="secondary" onPress={() => jump(undoPieces(hist))} disabled={!canUndoPieces(hist)} />
        <Button label={t.redo} variant="secondary" onPress={() => jump(redoPieces(hist))} disabled={!canRedoPieces(hist)} />
      </View>
      {confirmClear ? (
        <>
          <Text style={styles.h3}>{t.clearAsk}</Text>
          <View style={styles.row}>
            <Button label={t.clearYes} variant="secondary" onPress={() => { apply(clearPieces(live.current)); setSel(null); setConfirmClear(false); }} />
            <Button label={t.clearNo} onPress={() => setConfirmClear(false)} />
          </View>
        </>
      ) : (
        <View style={styles.row}>
          <Button label={t.clearAll} variant="secondary" onPress={() => setConfirmClear(true)} disabled={cur.pieces.length === 0} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 15, lineHeight: 21, color: colors.inkSoft },
  hint: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.brand },
  board: { width: '100%', maxWidth: 1100, aspectRatio: PAPER_W / PAPER_H, alignSelf: 'center', borderRadius: radius.tile, overflow: 'hidden', borderWidth: 2, borderColor: colors.line },
  fill: { flex: 1 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  shapeBtn: { width: 68, height: 68, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: colors.line },
  swatch: { width: 48, height: 48, borderRadius: 24, borderWidth: 3, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  swatchTex: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 24 },
  swatchOn: { borderColor: colors.brand, borderWidth: 4 },
  check: { fontFamily: fontFamily.ui.black, fontSize: 20 },
  bgChip: { minHeight: 48, paddingHorizontal: 14, borderRadius: 14, justifyContent: 'center', borderWidth: 2, borderColor: colors.line },
  bgText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14 },
});

/**
 * Escenas manipulables de la fase 1 (docs/design/math-visual §10): bandeja de 10/20, huerto de grupos iguales y reparto.
 * Solo dibujan y avisan lo que el niño tocó; la regla matemática está en `@lee-conmigo/math-content` (estas piezas no la
 * conocen). Todo se puede hacer TOCANDO (toca la galleta y luego el plato, WCAG 2.5.7); el reparto además se puede arrastrar. Zonas de 44 px o más.
 */
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View, type PanResponderGestureState } from 'react-native';
import { fontFamily, radius } from '../../tokens.ts';
import { ContainerArt, ItemIcon, manip, SeedIcon, useContainerArt, type CountContainer, type CountItem } from './objects.tsx';

const TOUCH = 44;

// ------------------------------------------------------------------ bandeja de 10 / 20

interface TenFrameBoardProps {
  capacity: 10 | 20;
  cells: boolean[];
  /** Las primeras `fixed` fichas vienen del enunciado (no se quitan). */
  fixed: number;
  width: number;
  disabled?: boolean;
  onToggle: (index: number) => void;
  cellLabel: (index: number, filled: boolean) => string;
}

export function TenFrameBoard({ capacity, cells, fixed, width, disabled, onToggle, cellLabel }: TenFrameBoardProps) {
  const gap = 8;
  const cell = Math.max(TOUCH, Math.min(76, Math.floor((width - 24 - gap * 4) / 5)));
  const frames = capacity / 10;
  return (
    <View style={styles.frames}>
      {Array.from({ length: frames }, (_, f) => (
        <View key={f} style={[styles.frame, { padding: 10, gap }]}>
          {[0, 1].map((row) => (
            <View key={row} style={[styles.row, { gap }]}>
              {Array.from({ length: 5 }, (_, c) => {
                const i = f * 10 + row * 5 + c;
                const on = cells[i];
                const locked = i < fixed;
                return (
                  <Pressable
                    key={c}
                    disabled={disabled || locked}
                    onPress={() => onToggle(i)}
                    accessibilityRole="button"
                    accessibilityLabel={cellLabel(i, on)}
                    accessibilityState={{ disabled: disabled || locked, checked: on }}
                    style={({ pressed }) => [styles.cell, { width: cell, height: cell }, pressed && styles.pressed]}
                  >
                    {on ? <View style={!locked && styles.addedRing}><SeedIcon size={Math.round(cell * 0.62)} /></View> : null}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

// ------------------------------------------------------------------ huerto (grupos iguales)

interface GardenPlotsProps {
  counts: number[];
  /** Tamaño máximo de un grupo (para acomodar los objetos dentro del recipiente). */
  capacity: number;
  width: number;
  editable: boolean;
  disabled?: boolean;
  /** Qué se cuenta y dónde (por defecto, plantas en parcelas). */
  item?: CountItem;
  container?: 'plot' | 'basket' | 'jar';
  onAdd: (group: number) => void;
  onRemove: (group: number) => void;
  plotLabel: (group: number, count: number) => string;
  addLabel: string;
  removeLabel: string;
}

/** Hueco útil dentro de cada dibujo de recipiente (fracción del lado): ahí se acomodan los objetos sin salirse. */
const INSETS: Record<'plot' | 'basket' | 'jar', { top: number; left: number; right: number; bottom: number }> = {
  plot: { top: 0.11, left: 0.11, right: 0.11, bottom: 0.11 },
  basket: { top: 0.36, left: 0.12, right: 0.12, bottom: 0.1 },
  // La tapa está abajo a la derecha: el vidrio ocupa la parte izquierda del dibujo.
  jar: { top: 0.24, left: 0.08, right: 0.34, bottom: 0.1 },
};

export function GardenPlots({ counts, capacity, width, editable, disabled, item = 'plant', container = 'plot', onAdd, onRemove, plotLabel, addLabel, removeLabel }: GardenPlotsProps) {
  const art = useContainerArt(container);
  const gap = 12;
  const perRow = Math.min(counts.length, width < 420 ? 2 : width < 700 ? 3 : counts.length);
  const plot = Math.max(110, Math.min(170, Math.floor((width - gap * (perRow - 1)) / perRow)));
  // Los objetos caben DENTRO del recipiente: se mide el hueco interior y se reparte en columnas y filas.
  const inset = art ? INSETS[container] : { top: 0.1, left: 0.1, right: 0.1, bottom: 0.1 };
  const pad = { paddingTop: Math.round(plot * inset.top), paddingLeft: Math.round(plot * inset.left), paddingRight: Math.round(plot * inset.right), paddingBottom: Math.round(plot * inset.bottom) };
  const innerW = plot - pad.paddingLeft - pad.paddingRight - (art ? 0 : 8);
  const innerH = plot - pad.paddingTop - pad.paddingBottom - (art ? 0 : 8);
  const most = Math.max(capacity, ...counts, 1);
  const cols = Math.max(3, Math.ceil(Math.sqrt(most * (innerW / innerH))));
  const rows = Math.ceil(most / cols);
  const cell = Math.floor(Math.min(innerW / cols, innerH / rows));
  const icon = Math.min(36, cell - 2);
  return (
    <View style={[styles.wrapRow, { gap, maxWidth: perRow * plot + gap * (perRow - 1) }]}>
      {counts.map((n, g) => (
        <View key={g} style={{ width: plot, gap: 6, alignItems: 'center' }}>
          <View style={[styles.plot, art ? styles.plotArt : null, { width: plot, height: plot }, pad]} accessibilityLabel={plotLabel(g, n)}>
            {art ? <ContainerArt source={art} mode={container === 'plot' ? 'stretch' : 'contain'} /> : null}
            <View style={[styles.plantGrid, { width: cols * cell }]}>
              {Array.from({ length: n }, (_, i) => (
                <View key={i} style={{ width: cell, height: cell, alignItems: 'center', justifyContent: 'center' }}>
                  <ItemIcon item={item} size={icon} />
                </View>
              ))}
            </View>
          </View>
          {editable && (
            <View style={styles.row}>
              <Pressable disabled={disabled || n === 0} onPress={() => onRemove(g)} accessibilityRole="button" accessibilityLabel={`${removeLabel} · ${plotLabel(g, n)}`} style={({ pressed }) => [styles.step, (disabled || n === 0) && styles.stepOff, pressed && styles.pressed]}>
                <Text style={styles.stepText}>−</Text>
              </Pressable>
              <Pressable disabled={disabled} onPress={() => onAdd(g)} accessibilityRole="button" accessibilityLabel={`${addLabel} · ${plotLabel(g, n)}`} style={({ pressed }) => [styles.step, styles.stepAdd, disabled && styles.stepOff, pressed && styles.pressed]}>
                <Text style={[styles.stepText, styles.stepAddText]}>+</Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

// ------------------------------------------------------------------ reparto

export interface SharingToken {
  id: string;
  /** Recipiente donde está, o null = bandeja. */
  where: string | null;
}

interface SharingBoardProps {
  tokens: SharingToken[];
  containers: { id: string; label: string }[];
  /** Recipiente y objeto del contexto (galletas en platos o bolsas, lápices en cajas…). */
  kind: Exclude<CountContainer, 'plot'>;
  item?: CountItem;
  selected: string | null;
  width: number;
  disabled?: boolean;
  trayLabel: string;
  tokenLabel: (index: number, where: string) => string;
  onToken: (id: string) => void;
  /** Destino tocado (null = bandeja). Solo se llama si hay una galleta elegida (los recipientes no se desactivan: dentro
   * tienen galletas que se pueden volver a tocar). */
  onTarget: (to: string | null) => void;
  /** Arrastrar y soltar (además de tocar, WCAG 2.5.7): ficha soltada en un recipiente o en la bandeja (null). */
  onDrop?: (token: string, to: string | null) => void;
}

/** Rectángulo de un lugar donde se puede soltar, en coordenadas de la ventana. */
interface Zone {
  key: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Ficha que se puede arrastrar. Un toque sigue siendo un toque (la elige); solo si el dedo se mueve más de unos píxeles
 * empieza a arrastrarse. Al soltar, cae en el lugar que esté debajo del dedo; fuera de todo, vuelve a su sitio.
 */
function DragToken({ id, from, disabled, measure, onDrop, onDragging, children }: { id: string; from: string | null; disabled?: boolean; measure: () => Promise<Zone[]>; onDrop?: (token: string, to: string | null) => void; onDragging: (from: string | null | undefined) => void; children: ReactNode }) {
  const pos = useRef(new Animated.ValueXY()).current;
  const zones = useRef<Zone[]>([]);
  const latest = useRef({ disabled, onDrop, from });
  latest.current = { disabled, onDrop, from };
  const responder = useMemo(() => {
    const moved = (_: unknown, g: PanResponderGestureState) => !latest.current.disabled && !!latest.current.onDrop && Math.abs(g.dx) + Math.abs(g.dy) > 8;
    const reset = () => {
      pos.setValue({ x: 0, y: 0 });
      onDragging(undefined);
    };
    return PanResponder.create({
      onMoveShouldSetPanResponder: moved,
      onMoveShouldSetPanResponderCapture: moved,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        onDragging(latest.current.from);
        void measure().then((z) => (zones.current = z));
      },
      onPanResponderMove: Animated.event([null, { dx: pos.x, dy: pos.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        const hit = zones.current.find((z) => g.moveX >= z.x && g.moveX <= z.x + z.w && g.moveY >= z.y && g.moveY <= z.y + z.h);
        reset();
        // La ficha cambia de lugar (se vuelve a montar en otro recipiente): se hace DESPUÉS de que el sistema de toques
        // termine con este gesto; si no, en la web el siguiente arrastre no arranca.
        if (hit && hit.key !== latest.current.from) {
          const drop = latest.current.onDrop;
          setTimeout(() => drop?.(id, hit.key), 0);
        }
      },
      onPanResponderTerminate: reset,
    });
  }, [id, measure, onDragging, pos]);
  return (
    <Animated.View {...responder.panHandlers} style={{ transform: pos.getTranslateTransform() }}>
      {children}
    </Animated.View>
  );
}

export function SharingBoard({ tokens, containers, kind, item = 'cookie', selected, width, disabled, trayLabel, tokenLabel, onToken, onTarget, onDrop }: SharingBoardProps) {
  const containerArt = useContainerArt(kind);
  // Lugares donde soltar (bandeja = 'tray'); se miden al empezar a arrastrar.
  const zoneRefs = useRef(new Map<string, View | null>()).current;
  const measure = useCallback(
    () =>
      Promise.all(
        [...zoneRefs.entries()].map(
          ([key, v]) =>
            new Promise<Zone | null>((resolve) => (v ? v.measureInWindow((x, y, w, h) => resolve({ key: key === 'tray' ? null : key, x, y, w, h })) : resolve(null))),
        ),
      ).then((z) => z.filter((r): r is Zone => r !== null)),
    [zoneRefs],
  );
  // De dónde sale la ficha que se arrastra: ese lugar se dibuja encima de los demás para que la ficha no pase por debajo.
  const [dragFrom, setDragFrom] = useState<string | null | undefined>(undefined);
  const gap = 12;
  const perRow = Math.min(containers.length, width < 420 ? 2 : width < 700 ? 3 : 5);
  const box = Math.max(120, Math.min(180, Math.floor((width - gap * (perRow - 1)) / perRow)));
  const armed = selected !== null && !disabled;
  const labelOf = (where: string | null) => (where === null ? trayLabel : (containers.find((c) => c.id === where)?.label ?? ''));

  const token = (t: SharingToken) => {
    const i = tokens.indexOf(t);
    const on = t.id === selected;
    return (
      <DragToken key={t.id} id={t.id} from={t.where} disabled={disabled} measure={measure} onDrop={onDrop} onDragging={setDragFrom}>
        <Pressable
          disabled={disabled}
          onPress={() => {
            // Con una galleta elegida, tocar otra que está en OTRO lugar es soltarla ahí (el plato está lleno de galletas
            // y es fácil tocar una); en el mismo lugar, cambia la elección.
            const from = tokens.find((x) => x.id === selected);
            if (armed && from && t.id !== selected && from.where !== t.where) onTarget(t.where);
            else onToken(t.id);
          }}
          accessibilityRole="button"
          accessibilityLabel={tokenLabel(i + 1, labelOf(t.where))}
          accessibilityState={{ selected: on }}
          style={({ pressed }) => [styles.token, on && styles.tokenOn, pressed && styles.pressed]}
        >
          {/* El lápiz es largo y delgado: se dibuja más grande para que se vea igual que los demás. */}
          <ItemIcon item={item} size={item === 'pencil' ? 40 : 30} />
        </Pressable>
      </DragToken>
    );
  };

  const inTray = tokens.filter((t) => t.where === null);
  return (
    <View style={{ gap: 14, alignItems: 'center', width: '100%' }}>
      <Pressable
        ref={(v) => void zoneRefs.set('tray', v as View | null)}
        onPress={() => armed && onTarget(null)}
        accessibilityRole="button"
        accessibilityLabel={trayLabel}
        style={[styles.tray, armed && styles.target, { width: Math.min(width, 640) }, dragFrom === null && styles.lifted]}
      >
        <Text style={styles.trayTitle}>
          {trayLabel} · {inTray.length}
        </Text>
        <View style={styles.tokenWrap}>{inTray.map(token)}</View>
      </Pressable>
      <View style={[styles.wrapRow, { gap, maxWidth: perRow * box + gap * (perRow - 1) }, typeof dragFrom === 'string' && styles.lifted]}>
        {containers.map((c) => {
          const inside = tokens.filter((t) => t.where === c.id);
          return (
            <Pressable
              key={c.id}
              ref={(v) => void zoneRefs.set(c.id, v as View | null)}
              onPress={() => armed && onTarget(c.id)}
              accessibilityRole="button"
              accessibilityLabel={`${c.label} · ${inside.length}`}
              style={[kind === 'plate' ? styles.plate : styles.bag, containerArt ? [styles.containerArt, kind !== 'plate' && kind !== 'bag' && styles.containerDeep] : null, { width: box, minHeight: kind === 'plate' ? box : box * 0.9 }, armed && styles.target, dragFrom === c.id && styles.lifted]}
            >
              {containerArt ? <ContainerArt source={containerArt} /> : null}
              <View style={styles.tokenWrap}>{inside.map(token)}</View>
              <Text style={styles.containerLabel}>{c.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { transform: [{ scale: 0.96 }] },
  lifted: { zIndex: 10 },
  row: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignSelf: 'center' },
  frames: { gap: 14, alignItems: 'center' },
  frame: { backgroundColor: manip.creamDeep, borderRadius: 18 },
  cell: { backgroundColor: manip.cream, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#e9dfc9' },
  addedRing: { borderRadius: 999, borderWidth: 3, borderColor: manip.blue, padding: 1 },
  plot: { overflow: 'hidden', backgroundColor: manip.soilSoft, borderRadius: 18, borderWidth: 4, borderColor: manip.soil, padding: 10, alignItems: 'center', justifyContent: 'center' },
  plotArt: { backgroundColor: 'transparent', borderWidth: 0, borderRadius: 0 },
  containerArt: { backgroundColor: 'transparent', borderColor: 'transparent', paddingTop: 28 },
  /** Caja, frasco y canasta: los objetos van más abajo, dentro de la boca del recipiente. */
  containerDeep: { paddingTop: 44, justifyContent: 'flex-end' },
  plantGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', rowGap: 4 },
  step: { width: 52, height: TOUCH + 4, borderRadius: radius.pill, backgroundColor: '#ffffff', borderWidth: 2, borderColor: manip.blueSoft, alignItems: 'center', justifyContent: 'center' },
  stepAdd: { backgroundColor: manip.blue, borderColor: manip.blue },
  stepOff: { opacity: 0.4 },
  stepText: { fontFamily: fontFamily.ui.black, fontSize: 24, color: manip.ink },
  stepAddText: { color: '#ffffff' },
  tray: { backgroundColor: manip.cream, borderRadius: 20, padding: 12, gap: 8, borderWidth: 3, borderColor: 'transparent', minHeight: 90 },
  trayTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: manip.blue },
  target: { borderColor: manip.yellow, borderStyle: 'dashed' },
  tokenWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 2 },
  token: { width: TOUCH, height: TOUCH, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'transparent' },
  tokenOn: { borderColor: manip.blue, backgroundColor: manip.blueSoft, transform: [{ translateY: -3 }] },
  plate: { backgroundColor: manip.blueSoft, borderRadius: 999, padding: 14, alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 3, borderColor: 'transparent' },
  bag: { backgroundColor: '#efe2c8', borderRadius: 16, borderTopLeftRadius: 6, borderTopRightRadius: 6, padding: 12, alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 3, borderColor: '#d9c39a' },
  containerLabel: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: manip.ink, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 999, paddingHorizontal: 8, overflow: 'hidden' },
});

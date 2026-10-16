/**
 * Escenas manipulables de la fase 1 (docs/design/math-visual §10): bandeja de 10/20, huerto de grupos iguales y reparto.
 * Solo dibujan y avisan lo que el niño tocó; la regla matemática está en `@lee-conmigo/math-content` (estas piezas no la
 * conocen). Todo se hace TOCANDO (sin arrastrar): toca la galleta y luego el plato (WCAG 2.5.7). Zonas de 44 px o más.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
}

export function SharingBoard({ tokens, containers, kind, item = 'cookie', selected, width, disabled, trayLabel, tokenLabel, onToken, onTarget }: SharingBoardProps) {
  const containerArt = useContainerArt(kind);
  const gap = 12;
  const perRow = Math.min(containers.length, width < 420 ? 2 : width < 700 ? 3 : 5);
  const box = Math.max(120, Math.min(180, Math.floor((width - gap * (perRow - 1)) / perRow)));
  const armed = selected !== null && !disabled;
  const labelOf = (where: string | null) => (where === null ? trayLabel : (containers.find((c) => c.id === where)?.label ?? ''));

  const token = (t: SharingToken) => {
    const i = tokens.indexOf(t);
    const on = t.id === selected;
    return (
      <Pressable
        key={t.id}
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
    );
  };

  const inTray = tokens.filter((t) => t.where === null);
  return (
    <View style={{ gap: 14, alignItems: 'center', width: '100%' }}>
      <Pressable
        onPress={() => armed && onTarget(null)}
        accessibilityRole="button"
        accessibilityLabel={trayLabel}
        style={[styles.tray, armed && styles.target, { width: Math.min(width, 640) }]}
      >
        <Text style={styles.trayTitle}>
          {trayLabel} · {inTray.length}
        </Text>
        <View style={styles.tokenWrap}>{inTray.map(token)}</View>
      </Pressable>
      <View style={[styles.wrapRow, { gap, maxWidth: perRow * box + gap * (perRow - 1) }]}>
        {containers.map((c) => {
          const inside = tokens.filter((t) => t.where === c.id);
          return (
            <Pressable
              key={c.id}
              onPress={() => armed && onTarget(c.id)}
              accessibilityRole="button"
              accessibilityLabel={`${c.label} · ${inside.length}`}
              style={[kind === 'plate' ? styles.plate : styles.bag, containerArt ? [styles.containerArt, kind !== 'plate' && kind !== 'bag' && styles.containerDeep] : null, { width: box, minHeight: kind === 'plate' ? box : box * 0.9 }, armed && styles.target]}
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

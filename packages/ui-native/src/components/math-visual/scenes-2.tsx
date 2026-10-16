/**
 * Escenas de la fase 2–3 (docs/design/math-visual §10): valor posicional, recta numérica, fracciones, barras, área,
 * reloj, gráficas, plano y razones. Igual que la fase 1: dibujan con números exactos y avisan qué se tocó; las reglas
 * viven en `@lee-conmigo/math-content`. Las formas que deciden una respuesta (partes iguales, marcas, agujas, escala)
 * las calcula el código; el arte (pizza, pastel, reloj, ranita, mapa) va DETRÁS y nunca define una medida.
 */
import type { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fontFamily, radius } from '../../tokens.ts';
import { ArtImage, manip, useMathArt } from './objects.tsx';

const TOUCH = 44;
const OVER = { position: 'absolute', top: 0, left: 0 } as const;

function Step({ label, onPress, disabled, primary, a11y }: { label: string; onPress: () => void; disabled?: boolean; primary?: boolean; a11y?: string }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} accessibilityRole="button" accessibilityLabel={a11y ?? label} style={({ pressed }) => [styles.step, primary && styles.stepPrimary, disabled && styles.off, pressed && styles.pressed]}>
      <Text style={[styles.stepText, primary && styles.stepTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

function Panel({ children, width }: { children: ReactNode; width?: number }) {
  return <View style={[styles.panel, width ? { width } : null]}>{children}</View>;
}

// ------------------------------------------------------------------ B. valor posicional

/** Una decena: 10 cubitos exactos. */
function TenRod({ cube }: { cube: number }) {
  return (
    <Svg width={cube + 2} height={cube * 10 + 2}>
      {Array.from({ length: 10 }, (_, i) => (
        <Rect key={i} x={1} y={1 + i * cube} width={cube} height={cube} rx={2} fill={manip.blue} stroke="#ffffff" strokeWidth={1} />
      ))}
    </Svg>
  );
}

/** Una centena: 10 × 10 cubitos exactos. */
function HundredFlat({ cube }: { cube: number }) {
  return (
    <Svg width={cube * 10 + 2} height={cube * 10 + 2}>
      {Array.from({ length: 100 }, (_, i) => (
        <Rect key={i} x={1 + (i % 10) * cube} y={1 + Math.floor(i / 10) * cube} width={cube} height={cube} fill={manip.violet} stroke="#ffffff" strokeWidth={0.6} />
      ))}
    </Svg>
  );
}

function Unit({ cube }: { cube: number }) {
  return (
    <Svg width={cube + 2} height={cube + 2}>
      <Rect x={1} y={1} width={cube} height={cube} rx={2} fill={manip.coral} stroke="#ffffff" strokeWidth={1} />
    </Svg>
  );
}

export interface PlaceValueLabels {
  h: string;
  t: string;
  o: string;
  add: string;
  remove: string;
  bundle: string;
  unbundle: string;
}

interface PlaceValueBoardProps {
  pieces: { h: number; t: number; o: number };
  showHundreds: boolean;
  editable: boolean;
  disabled?: boolean;
  width: number;
  labels: PlaceValueLabels;
  onAdd: (place: 'h' | 't' | 'o') => void;
  onRemove: (place: 'h' | 't' | 'o') => void;
  onBundle: (place: 'o' | 't') => void;
  onUnbundle: (place: 't' | 'h') => void;
}

export function PlaceValueBoard({ pieces, showHundreds, editable, disabled, width, labels, onAdd, onRemove, onBundle, onUnbundle }: PlaceValueBoardProps) {
  const places = (showHundreds ? ['h', 't', 'o'] : ['t', 'o']) as ('h' | 't' | 'o')[];
  const colW = Math.floor((width - 16 * (places.length - 1)) / places.length);
  const cube = Math.max(6, Math.min(12, Math.floor(colW / 14)));
  return (
    <View style={[styles.row, { gap: 16, alignItems: 'stretch' }]}>
      {places.map((p) => (
        <Panel key={p} width={colW}>
          <Text style={styles.colTitle}>
            {labels[p]} · {pieces[p]}
          </Text>
          <View style={[styles.wrap, { minHeight: cube * 10 + 4 }]} accessibilityLabel={`${labels[p]}: ${pieces[p]}`}>
            {Array.from({ length: pieces[p] }, (_, i) => (p === 'h' ? <HundredFlat key={i} cube={Math.max(3, Math.floor(cube * 0.5))} /> : p === 't' ? <TenRod key={i} cube={cube} /> : <Unit key={i} cube={cube} />))}
          </View>
          {editable && (
            <View style={styles.controls}>
              <Step label="−" a11y={`${labels.remove} · ${labels[p]}`} onPress={() => onRemove(p)} disabled={disabled || pieces[p] === 0} />
              <Step label="+" a11y={`${labels.add} · ${labels[p]}`} onPress={() => onAdd(p)} disabled={disabled} primary />
            </View>
          )}
          {editable && p !== 'h' && <Step label={labels.bundle} onPress={() => onBundle(p as 'o' | 't')} disabled={disabled || pieces[p] < 10} />}
          {editable && p !== 'o' && <Step label={labels.unbundle} onPress={() => onUnbundle(p as 't' | 'h')} disabled={disabled || pieces[p] < 1} />}
        </Panel>
      ))}
    </View>
  );
}

// ------------------------------------------------------------------ C. recta numérica

interface NumberLineBoardProps {
  min: number;
  max: number;
  denominator: number;
  labelEvery: number;
  pos: number;
  path: number[];
  width: number;
  disabled?: boolean;
  /** Botones de salto (con signo) y su texto. */
  jumps: { size: number; label: string }[];
  onJump: (size: number) => void;
  /** Tocar la recta (null = no se puede tocar en esta tarea). */
  onTap: ((pos: number) => void) | null;
  frogLabel: string;
  /** Nombre de cada marca para el lector de pantalla ("3/4", "27"). */
  tickLabel: (v: number) => string;
}

export function NumberLineBoard({ min, max, denominator, labelEvery, pos, path, width, disabled, jumps, onJump, onTap, frogLabel, tickLabel }: NumberLineBoardProps) {
  const art = useMathArt();
  const pad = 24;
  const w = Math.max(280, width);
  const h = 150;
  const y = 112;
  const step = (w - pad * 2) / (max - min);
  const x = (v: number) => pad + (v - min) * step;
  const label = (v: number) => (denominator === 1 ? String(v) : String(v / denominator));
  const frog = 46;
  // Un arco por cada salto: el camino queda dibujado (estrategia visible).
  const arcs = path.slice(1).map((to, i) => {
    const from = path[i];
    const x1 = x(from);
    const x2 = x(to);
    const lift = Math.min(46, 12 + Math.abs(x2 - x1) * 0.35);
    return <Path key={i} d={`M ${x1} ${y - 4} Q ${(x1 + x2) / 2} ${y - 4 - lift * 2} ${x2} ${y - 4}`} stroke={to > from ? manip.blue : manip.coral} strokeWidth={3} fill="none" />;
  });
  return (
    <View style={{ alignItems: 'center', gap: 10 }}>
      <Panel>
        <View accessibilityLabel={frogLabel} style={{ width: w, height: h }}>
          <Svg width={w} height={h}>
            <Line x1={pad} y1={y} x2={w - pad} y2={y} stroke={manip.ink} strokeWidth={3} strokeLinecap="round" />
            {Array.from({ length: max - min + 1 }, (_, i) => {
              const v = min + i;
              const big = (v - min) % labelEvery === 0;
              return (
                <G key={v}>
                  <Line x1={x(v)} y1={y - (big ? 10 : 6)} x2={x(v)} y2={y + (big ? 10 : 6)} stroke={manip.ink} strokeWidth={big ? 2.5 : 1.5} />
                  {big ? (
                    <SvgText x={x(v)} y={y + 30} fontSize={16} fontWeight="700" fill={manip.ink} textAnchor="middle">
                      {label(v)}
                    </SvgText>
                  ) : null}
                </G>
              );
            })}
            {arcs}
            {!art.frog && <Circle cx={x(pos)} cy={y - 18} r={12} fill={manip.green} />}
          </Svg>
          {art.frog ? <Image source={art.frog} style={{ position: 'absolute', left: x(pos) - frog / 2, top: y - frog - 4, width: frog, height: frog }} resizeMode="contain" accessible={false} /> : null}
          {/* Una zona tocable por marca (sin medir coordenadas del toque: funciona igual en la web y en el teléfono). */}
          {onTap && !disabled
            ? Array.from({ length: max - min + 1 }, (_, i) => (
                <Pressable key={i} onPress={() => onTap(min + i)} accessibilityRole="button" accessibilityLabel={tickLabel(min + i)} style={{ position: 'absolute', left: x(min + i) - step / 2, top: y - 40, width: step, height: 80 }} />
              ))
            : null}
        </View>
      </Panel>
      <View style={styles.controls}>
        {jumps.map((j) => (
          <Step key={j.size} label={j.label} onPress={() => onJump(j.size)} disabled={disabled || pos + j.size < min || pos + j.size > max} primary={j.size > 0} />
        ))}
      </View>
    </View>
  );
}

// ------------------------------------------------------------------ F. fracciones

interface FractionBoardProps {
  shape: 'bar' | 'pizza' | 'cake';
  denominator: number;
  shaded: boolean[];
  editable: boolean;
  disabled?: boolean;
  width: number;
  onToggle: (index: number) => void;
  partLabel: (index: number, on: boolean) => string;
}

const SHADE = manip.violet;

export function FractionBoard({ shape, denominator: d, shaded, editable, disabled, width, onToggle, partLabel }: FractionBoardProps) {
  const art = useMathArt();
  const can = editable && !disabled;
  if (shape === 'pizza') {
    const S = Math.min(320, width);
    const c = S / 2;
    const r = (S / 2) * (121 / 128);
    const inner = r * 0.84;
    const sector = (i: number) => {
      const a0 = (i / d) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
      const large = 1 / d > 0.5 ? 1 : 0;
      return `M ${c} ${c} L ${c + inner * Math.cos(a0)} ${c + inner * Math.sin(a0)} A ${inner} ${inner} 0 ${large} 1 ${c + inner * Math.cos(a1)} ${c + inner * Math.sin(a1)} Z`;
    };
    return (
      <View style={{ width: S, height: S }}>
        {art.pizza ? <Image source={art.pizza} style={{ position: 'absolute', width: S, height: S }} resizeMode="contain" accessible={false} /> : null}
        {/* Encima del arte: en la web un elemento con posición absoluta tapa a los que no la tienen. */}
        <Svg width={S} height={S} style={OVER}>
          {!art.pizza && <Circle cx={c} cy={c} r={r} fill={manip.yellow} />}
          {Array.from({ length: d }, (_, i) => (
            <Path key={i} d={sector(i)} fill={shaded[i] ? SHADE : 'rgba(255,255,255,0.01)'} fillOpacity={shaded[i] ? 0.72 : 1} stroke={manip.ink} strokeWidth={2.5} onPress={can ? () => onToggle(i) : undefined} accessibilityLabel={partLabel(i, shaded[i])} />
          ))}
        </Svg>
      </View>
    );
  }
  if (shape === 'cake') {
    const S = Math.min(360, width);
    const H = S * (154 / 256);
    const x0 = S * (36 / 256);
    const x1 = S * (220 / 256);
    const y0 = S * (26 / 256);
    const y1 = S * (128 / 256);
    const pw = (x1 - x0) / d;
    return (
      <View style={{ width: S, height: H, overflow: 'hidden' }}>
        {art.cake ? <Image source={art.cake} style={{ position: 'absolute', top: -S * (51 / 256), width: S, height: S }} resizeMode="contain" accessible={false} /> : <View style={{ position: 'absolute', left: x0 - 8, top: y0 - 8, width: x1 - x0 + 16, height: y1 - y0 + 16, backgroundColor: manip.cream, borderRadius: 10, borderWidth: 4, borderColor: manip.coral }} />}
        {Array.from({ length: d }, (_, i) => (
          <Pressable
            key={i}
            disabled={!can}
            onPress={() => onToggle(i)}
            accessibilityRole="button"
            accessibilityLabel={partLabel(i, shaded[i])}
            style={{ position: 'absolute', left: x0 + i * pw, top: y0, width: pw, height: y1 - y0, borderLeftWidth: i === 0 ? 0 : 2.5, borderColor: manip.ink, backgroundColor: shaded[i] ? 'rgba(154,125,171,0.75)' : 'transparent' }}
          />
        ))}
      </View>
    );
  }
  const W = Math.min(560, width);
  const pw = W / d;
  return (
    <View style={[styles.fracBar, { width: W }]}>
      {Array.from({ length: d }, (_, i) => (
        <Pressable
          key={i}
          disabled={!can}
          onPress={() => onToggle(i)}
          accessibilityRole="button"
          accessibilityLabel={partLabel(i, shaded[i])}
          style={{ width: pw, height: 84, borderLeftWidth: i === 0 ? 0 : 2.5, borderColor: manip.ink, backgroundColor: shaded[i] ? SHADE : manip.cream }}
        />
      ))}
    </View>
  );
}

// ------------------------------------------------------------------ G. modelo de barras

export interface BarRow {
  name: string;
  /** Segmentos de la barra: longitud (en las unidades del problema) y su etiqueta ("8", "?" o lo escrito). */
  segments: { length: number; label: string; unknown?: boolean }[];
}

interface BarModelBoardProps {
  rows: BarRow[];
  /** Llave del total sobre la primera fila (null = sin llave). */
  totalLabel: string | null;
  /** Llave de la diferencia (desde la longitud `from` hasta `to` de la fila 0), para comparar. */
  difference: { from: number; to: number; label: string } | null;
  width: number;
  onPressUnknown: () => void;
}

export function BarModelBoard({ rows, totalLabel, difference, width, onPressUnknown }: BarModelBoardProps) {
  const nameW = 70;
  const avail = Math.max(200, width - nameW - 12);
  const longest = Math.max(...rows.map((r) => r.segments.reduce((a, s) => a + s.length, 0)));
  const k = avail / longest;
  const firstLen = rows[0].segments.reduce((a, s) => a + s.length, 0);
  return (
    <Panel>
      <View style={{ gap: 14, paddingVertical: 4 }}>
        {totalLabel !== null && (
          <View style={{ marginLeft: nameW + 12, width: firstLen * k, alignItems: 'center' }}>
            <Text style={styles.braceText}>{totalLabel}</Text>
            <View style={styles.brace} />
          </View>
        )}
        {rows.map((r, ri) => (
          <View key={ri} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={[styles.barName, { width: nameW }]} numberOfLines={1}>
              {r.name}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {r.segments.map((s, si) => (
                <Pressable
                  key={si}
                  onPress={s.unknown ? onPressUnknown : undefined}
                  disabled={!s.unknown}
                  accessibilityRole={s.unknown ? 'button' : undefined}
                  style={[styles.barSeg, { width: Math.max(36, s.length * k) }, s.unknown ? styles.barUnknown : ri === 0 ? styles.barA : styles.barB]}
                >
                  <Text style={[styles.barSegText, s.unknown && styles.barUnknownText]} numberOfLines={1}>
                    {s.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        {difference && (
          <View style={{ marginLeft: nameW + 12 + difference.from * k, width: Math.max(36, (difference.to - difference.from) * k), alignItems: 'center' }}>
            <View style={[styles.brace, styles.braceDown]} />
            <Text style={styles.braceText}>{difference.label}</Text>
          </View>
        )}
      </View>
    </Panel>
  );
}

// ------------------------------------------------------------------ H. área y perímetro

interface AreaBoardProps {
  rows: number;
  cols: number;
  task: 'cover' | 'perimeter' | 'missingSide';
  tiles: boolean[];
  width: number;
  disabled?: boolean;
  onToggle: (index: number) => void;
  /** Rótulos de los lados ("5 m", "? m") y del área dentro (missingSide). */
  topLabel: string;
  sideLabel: string;
  centerLabel: string | null;
  cellLabel: (index: number, on: boolean) => string;
}

export function AreaBoard({ rows, cols, task, tiles, width, disabled, onToggle, topLabel, sideLabel, centerLabel, cellLabel }: AreaBoardProps) {
  const side = 46;
  const cell = Math.max(30, Math.min(56, Math.floor((width - side - 16) / cols)));
  const showGrid = task !== 'missingSide';
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <Text style={[styles.sideLabel, { marginLeft: side }]}>{topLabel}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.sideLabel, { width: side }]}>{sideLabel}</Text>
        <View style={[styles.garden, { width: cell * cols + 6, height: cell * rows + 6 }]}>
          {showGrid ? (
            Array.from({ length: rows }, (_, r) => (
              <View key={r} style={{ flexDirection: 'row' }}>
                {Array.from({ length: cols }, (_, c) => {
                  const i = r * cols + c;
                  const on = tiles[i];
                  return task === 'cover' ? (
                    <Pressable key={c} disabled={disabled} onPress={() => onToggle(i)} accessibilityRole="button" accessibilityLabel={cellLabel(i, on)} style={[styles.gcell, { width: cell, height: cell }, on && styles.gcellOn]} />
                  ) : (
                    <View key={c} style={[styles.gcell, { width: cell, height: cell }]} />
                  );
                })}
              </View>
            ))
          ) : (
            <View style={styles.center}>
              <Text style={styles.areaText}>{centerLabel}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// ------------------------------------------------------------------ I. reloj

interface ClockBoardProps {
  hourAngle: number;
  minuteAngle: number;
  size: number;
  controls: { label: string; minutes: number }[] | null;
  disabled?: boolean;
  onShift: (minutes: number) => void;
  a11y: string;
}

export function ClockBoard({ hourAngle, minuteAngle, size, controls, disabled, onShift, a11y }: ClockBoardProps) {
  const art = useMathArt();
  const S = Math.min(300, size);
  const c = S / 2;
  const R = (S / 2) * (121 / 128);
  const face = R * 0.8;
  const pt = (deg: number, r: number) => ({ x: c + r * Math.sin((deg * Math.PI) / 180), y: c - r * Math.cos((deg * Math.PI) / 180) });
  const hand = (deg: number, len: number) => pt(deg, len);
  const hh = hand(hourAngle, face * 0.52);
  const mh = hand(minuteAngle, face * 0.8);
  return (
    <View style={{ alignItems: 'center', gap: 12 }}>
      <View style={{ width: S, height: S }} accessibilityLabel={a11y}>
        {art.clockFace ? <Image source={art.clockFace} style={{ position: 'absolute', width: S, height: S }} resizeMode="contain" accessible={false} /> : null}
        {/* Encima del arte: en la web un elemento con posición absoluta tapa a los que no la tienen. */}
        <Svg width={S} height={S} style={OVER}>
          {!art.clockFace && <Circle cx={c} cy={c} r={R} fill={manip.cream} stroke={manip.blue} strokeWidth={R * 0.16} />}
          {Array.from({ length: 60 }, (_, i) => {
            const a = pt(i * 6, face * 0.97);
            const b = pt(i * 6, face * (i % 5 === 0 ? 0.86 : 0.92));
            return <Line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={manip.ink} strokeWidth={i % 5 === 0 ? 2.5 : 1} />;
          })}
          {Array.from({ length: 12 }, (_, i) => {
            const p = pt((i + 1) * 30, face * 0.7);
            return (
              <SvgText key={i} x={p.x} y={p.y + 6} fontSize={S * 0.065} fontWeight="700" fill={manip.ink} textAnchor="middle">
                {String(i + 1)}
              </SvgText>
            );
          })}
          <Line x1={c} y1={c} x2={mh.x} y2={mh.y} stroke={manip.blue} strokeWidth={5} strokeLinecap="round" />
          <Line x1={c} y1={c} x2={hh.x} y2={hh.y} stroke={manip.coral} strokeWidth={8} strokeLinecap="round" />
          <Circle cx={c} cy={c} r={7} fill={manip.ink} />
        </Svg>
      </View>
      {controls && (
        <View style={styles.controls}>
          {controls.map((k) => (
            <Step key={k.label} label={k.label} onPress={() => onShift(k.minutes)} disabled={disabled} primary={k.minutes > 0} />
          ))}
        </View>
      )}
    </View>
  );
}

// ------------------------------------------------------------------ J. gráficas

interface BarChartBoardProps {
  categories: { id: 'mango' | 'pera' | 'uva' | 'manzana'; name: string }[];
  bars: number[];
  scale: number;
  editable: boolean;
  disabled?: boolean;
  width: number;
  /** Tabla de datos (para construir la gráfica). */
  table: number[] | null;
  tableTitle: string;
  onDelta: (index: number, delta: number) => void;
}

export function BarChartBoard({ categories, bars, scale, editable, disabled, width, table, tableTitle, onDelta }: BarChartBoardProps) {
  const art = useMathArt();
  const steps = 10;
  const unit = 22;
  const chartH = unit * steps;
  const axisW = 34;
  const colW = Math.max(56, Math.min(96, Math.floor((width - axisW - 16) / categories.length)));
  return (
    <View style={{ alignItems: 'center', gap: 12 }}>
      {table && (
        <Panel>
          <Text style={styles.colTitle}>{tableTitle}</Text>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            {categories.map((c, i) => (
              <View key={c.id} style={{ alignItems: 'center', gap: 2 }}>
                {art.fruits?.[c.id] ? <ArtImage source={art.fruits[c.id]!} size={30} /> : null}
                <Text style={styles.tableName}>{c.name}</Text>
                <Text style={styles.tableValue}>{table[i]}</Text>
              </View>
            ))}
          </View>
        </Panel>
      )}
      <Panel>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: axisW, height: chartH }}>
            {Array.from({ length: steps + 1 }, (_, i) => (
              <Text key={i} style={[styles.axis, { position: 'absolute', right: 0, bottom: i * unit - 7, height: 14 }]}>
                {i * scale}
              </Text>
            ))}
          </View>
          <View style={{ height: chartH, flexDirection: 'row', alignItems: 'flex-end', borderLeftWidth: 2, borderBottomWidth: 2, borderColor: manip.ink }}>
            {Array.from({ length: steps }, (_, i) => (
              <View key={i} style={[styles.gridLine, { bottom: (i + 1) * unit }]} />
            ))}
            {categories.map((c, i) => (
              <View key={c.id} style={{ width: colW, alignItems: 'center' }} accessibilityLabel={`${c.name}: ${bars[i]}`}>
                <View style={[styles.chartBar, { height: (bars[i] / scale) * unit, width: colW * 0.6 }]} />
              </View>
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: axisW + 2 }}>
          {categories.map((c, i) => (
            <View key={c.id} style={{ width: colW, alignItems: 'center', gap: 4, paddingTop: 6 }}>
              {art.fruits?.[c.id] ? <ArtImage source={art.fruits[c.id]!} size={28} /> : null}
              <Text style={styles.tableName} numberOfLines={1}>
                {c.name}
              </Text>
              {editable && (
                <View style={styles.controlsTight}>
                  <Step label="−" a11y={`− ${c.name}`} onPress={() => onDelta(i, -1)} disabled={disabled || bars[i] === 0} />
                  <Step label="+" a11y={`+ ${c.name}`} onPress={() => onDelta(i, 1)} disabled={disabled} primary />
                </View>
              )}
            </View>
          ))}
        </View>
      </Panel>
    </View>
  );
}

// ------------------------------------------------------------------ K. plano

interface CoordBoardProps {
  max: number;
  point: [number, number] | null;
  width: number;
  disabled?: boolean;
  onTap: ((x: number, y: number) => void) | null;
  a11y: string;
}

export function CoordBoard({ max, point, width, disabled, onTap, a11y }: CoordBoardProps) {
  const art = useMathArt();
  const pad = 30;
  const S = Math.min(380, Math.max(260, width));
  const g = (S - pad * 2) / max;
  const X = (x: number) => pad + x * g;
  const Y = (y: number) => S - pad - y * g;
  const t = 34;
  return (
    <Panel>
      <View accessibilityLabel={a11y} style={{ width: S, height: S }}>
        {/* Encima del arte: en la web un elemento con posición absoluta tapa a los que no la tienen. */}
        <Svg width={S} height={S} style={OVER}>
          {Array.from({ length: max + 1 }, (_, i) => (
            <G key={i}>
              <Line x1={X(i)} y1={Y(0)} x2={X(i)} y2={Y(max)} stroke={colors.outline} strokeWidth={1} />
              <Line x1={X(0)} y1={Y(i)} x2={X(max)} y2={Y(i)} stroke={colors.outline} strokeWidth={1} />
              <SvgText x={X(i)} y={Y(0) + 18} fontSize={13} fill={manip.ink} textAnchor="middle">
                {String(i)}
              </SvgText>
              {i > 0 && (
                <SvgText x={X(0) - 12} y={Y(i) + 4} fontSize={13} fill={manip.ink} textAnchor="middle">
                  {String(i)}
                </SvgText>
              )}
            </G>
          ))}
          <Line x1={X(0)} y1={Y(0)} x2={X(max) + 8} y2={Y(0)} stroke={manip.ink} strokeWidth={3} />
          <Line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(max) - 8} stroke={manip.ink} strokeWidth={3} />
          <SvgText x={X(max) + 14} y={Y(0) + 5} fontSize={15} fontWeight="700" fill={manip.ink}>
            x
          </SvgText>
          <SvgText x={X(0) - 4} y={Y(max) - 12} fontSize={15} fontWeight="700" fill={manip.ink}>
            y
          </SvgText>
          {point && !art.treasure && <Circle cx={X(point[0])} cy={Y(point[1])} r={11} fill={manip.coral} />}
        </Svg>
        {point && art.treasure ? <Image source={art.treasure} style={{ position: 'absolute', left: X(point[0]) - t / 2, top: Y(point[1]) - t / 2, width: t, height: t }} resizeMode="contain" accessible={false} /> : null}
        {/* Una zona tocable por cruce, con su par ordenado como nombre. */}
        {onTap && !disabled
          ? Array.from({ length: (max + 1) * (max + 1) }, (_, i) => {
              const px = i % (max + 1);
              const py = Math.floor(i / (max + 1));
              return <Pressable key={i} onPress={() => onTap(px, py)} accessibilityRole="button" accessibilityLabel={`(${px}, ${py})`} style={{ position: 'absolute', left: X(px) - g / 2, top: Y(py) - g / 2, width: g, height: g }} />;
            })
          : null}
      </View>
    </Panel>
  );
}

// ------------------------------------------------------------------ L. razones

interface RatioBoardProps {
  a: number;
  b: number;
  lots: number;
  disabled?: boolean;
  labels: { add: string; remove: string; lot: (n: number) => string; totals: (blue: number, orange: number) => string };
  onAdd: () => void;
  onRemove: () => void;
}

export function RatioBoard({ a, b, lots, disabled, labels, onAdd, onRemove }: RatioBoardProps) {
  const dot = 22;
  return (
    <View style={{ alignItems: 'center', gap: 12 }}>
      <View style={[styles.row, { gap: 10, flexWrap: 'wrap', justifyContent: 'center' }]}>
        {Array.from({ length: lots }, (_, l) => (
          <View key={l} style={styles.lot} accessibilityLabel={labels.lot(l + 1)}>
            <View style={styles.lotDots}>
              {Array.from({ length: a }, (_, i) => (
                <View key={`a${i}`} style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: manip.blue }} />
              ))}
            </View>
            <View style={styles.lotDots}>
              {Array.from({ length: b }, (_, i) => (
                <View key={`b${i}`} style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: manip.coral }} />
              ))}
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.totals}>{labels.totals(a * lots, b * lots)}</Text>
      <View style={styles.controls}>
        <Step label={labels.remove} onPress={onRemove} disabled={disabled || lots <= 1} />
        <Step label={labels.add} onPress={onAdd} disabled={disabled} primary />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'flex-end', justifyContent: 'center' },
  panel: { backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 18, padding: 12, gap: 10, alignItems: 'center' },
  colTitle: { fontFamily: fontFamily.ui.black, fontSize: 15, color: manip.ink },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  controlsTight: { flexDirection: 'row', gap: 4 },
  step: { minWidth: TOUCH + 4, height: TOUCH + 4, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: '#ffffff', borderWidth: 2, borderColor: manip.blueSoft, alignItems: 'center', justifyContent: 'center' },
  stepPrimary: { backgroundColor: manip.blue, borderColor: manip.blue },
  stepText: { fontFamily: fontFamily.ui.black, fontSize: 17, color: manip.ink },
  stepTextPrimary: { color: '#ffffff' },
  off: { opacity: 0.4 },
  pressed: { transform: [{ scale: 0.96 }] },
  fracBar: { flexDirection: 'row', borderWidth: 3, borderColor: manip.ink, borderRadius: 8, overflow: 'hidden' },
  barName: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: manip.ink, textAlign: 'right' },
  barSeg: { height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ffffff', borderRadius: 6 },
  barA: { backgroundColor: manip.blue },
  barB: { backgroundColor: manip.green },
  barUnknown: { backgroundColor: manip.cream, borderColor: manip.ink, borderStyle: 'dashed' },
  barSegText: { fontFamily: fontFamily.ui.black, fontSize: 20, color: '#ffffff' },
  barUnknownText: { color: manip.ink },
  brace: { alignSelf: 'stretch', height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: manip.ink, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  braceDown: { borderTopWidth: 0, borderBottomWidth: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  braceText: { fontFamily: fontFamily.ui.black, fontSize: 17, color: manip.ink },
  sideLabel: { fontFamily: fontFamily.ui.black, fontSize: 17, color: manip.ink, textAlign: 'center' },
  garden: { borderWidth: 3, borderColor: '#7a5a3a', backgroundColor: '#a8c98f', borderRadius: 4 },
  gcell: { borderWidth: 0.5, borderColor: 'rgba(35,52,71,0.25)' },
  gcellOn: { backgroundColor: '#e8c38f', borderColor: '#b48a56', borderWidth: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  areaText: { fontFamily: fontFamily.ui.black, fontSize: 24, color: manip.ink, backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 12, borderRadius: 10, overflow: 'hidden' },
  tableName: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: manip.ink },
  tableValue: { fontFamily: fontFamily.ui.black, fontSize: 20, color: manip.ink },
  axis: { fontFamily: fontFamily.ui.bold, fontSize: 11, color: manip.ink, textAlign: 'right', paddingRight: 4, lineHeight: 14 },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(35,52,71,0.15)' },
  chartBar: { backgroundColor: manip.blue, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  lot: { backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 14, padding: 8, gap: 6, borderWidth: 2, borderColor: manip.blueSoft },
  lotDots: { flexDirection: 'row', gap: 4, justifyContent: 'center' },
  totals: { fontFamily: fontFamily.ui.black, fontSize: 18, color: manip.ink, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
});

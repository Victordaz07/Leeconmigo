import type { Dispatch, ReactNode } from 'react';
import { barUnknownValue, clockAngles, type ExerciseAction, type ExerciseState, type VisualModel, type WorkAction } from '@lee-conmigo/math-content';
import { fruitName, type MathLang } from '@lee-conmigo/ui-core';
import { AreaBoard, BarChartBoard, BarModelBoard, ClockBoard, CoordBoard, FractionBoard, NumberLineBoard, PlaceValueBoard, RatioBoard, type BarRow } from '@lee-conmigo/ui-native';

const L = (lang: MathLang, es: string, en: string) => (lang === 'es' ? es : en);

/** ¿El niño mueve algo en esta tarea? (si no, no hay "Deshacer" ni "Empezar de nuevo"). */
export function canManipulate(m: VisualModel): boolean {
  switch (m.kind) {
    case 'equalGroups':
      return m.task === 'build';
    case 'placeValue':
      return m.task !== 'read';
    case 'fraction':
      return m.task !== 'name';
    case 'barModel':
      return false;
    case 'area':
      return m.task === 'cover';
    case 'clock':
      return m.task !== 'read';
    case 'data':
      return m.task === 'build';
    case 'coord':
      return m.task === 'plot';
    default:
      return true;
  }
}

interface Scene2Props {
  m: VisualModel;
  s: ExerciseState;
  dispatch: Dispatch<ExerciseAction>;
  lang: MathLang;
  width: number;
  done: boolean;
  /** Toca la parte "?" de la barra: activa la casilla de respuesta. */
  focusAnswer: () => void;
}

/** La escena de las familias de la fase 2–3. Devuelve null para las de la fase 1 (las arma `VisualExercise`). */
export function scene2({ m, s, dispatch, lang, width, done, focusAnswer }: Scene2Props): ReactNode {
  const work = (action: WorkAction) => dispatch({ type: 'work', action });
  const w = s.work;

  if (m.kind === 'placeValue' && w.kind === 'placeValue') {
    return (
      <PlaceValueBoard
        pieces={w.pieces}
        showHundreds={m.target >= 100}
        editable={m.task !== 'read'}
        disabled={done}
        width={width}
        labels={{
          h: L(lang, 'Centenas', 'Hundreds'),
          t: L(lang, 'Decenas', 'Tens'),
          o: L(lang, 'Unidades', 'Ones'),
          add: L(lang, 'Poner', 'Add'),
          remove: L(lang, 'Quitar', 'Remove'),
          bundle: L(lang, 'Juntar 10', 'Trade 10'),
          unbundle: L(lang, 'Desarmar 1', 'Break 1'),
        }}
        onAdd={(place) => work({ type: 'addPiece', place })}
        onRemove={(place) => work({ type: 'removePiece', place })}
        onBundle={(place) => work({ type: 'bundle', place })}
        onUnbundle={(place) => work({ type: 'unbundle', place })}
      />
    );
  }

  if (m.kind === 'numberLine' && w.kind === 'numberLine') {
    const jumps = m.task === 'locate' ? [-1, 1] : m.jumps;
    const sign = (n: number) => (n > 0 ? `+${n}` : `−${-n}`);
    return (
      <NumberLineBoard
        min={m.min}
        max={m.max}
        denominator={m.denominator}
        labelEvery={m.labelEvery}
        pos={w.pos}
        path={m.task === 'locate' ? [w.pos] : w.path}
        width={width}
        disabled={done}
        jumps={[...jumps].sort((a, b) => a - b).map((size) => ({ size, label: m.task === 'locate' ? (size < 0 ? '◀' : '▶') : sign(size) }))}
        onJump={(size) => work(m.task === 'locate' ? { type: 'setPos', pos: w.pos + size } : { type: 'jump', size })}
        onTap={m.task === 'locate' ? (pos) => work({ type: 'setPos', pos }) : null}
        tickLabel={(v) => (m.denominator === 1 ? String(v) : `${v}/${m.denominator}`)}
        frogLabel={L(lang, `Ranita en ${m.denominator === 1 ? w.pos : `${w.pos}/${m.denominator}`}`, `Frog on ${m.denominator === 1 ? w.pos : `${w.pos}/${m.denominator}`}`)}
      />
    );
  }

  if (m.kind === 'fraction' && w.kind === 'fraction') {
    return (
      <FractionBoard
        shape={m.shape}
        denominator={m.denominator}
        shaded={w.shaded}
        editable={m.task !== 'name'}
        disabled={done}
        width={width}
        onToggle={(index) => work({ type: 'togglePart', index })}
        partLabel={(i, on) => L(lang, `Parte ${i + 1}${on ? ', coloreada' : ''}`, `Part ${i + 1}${on ? ', colored' : ''}`)}
      />
    );
  }

  if (m.kind === 'barModel' && w.kind === 'barModel') {
    const typed = w.values.answer;
    const unknownLabel = done ? String(barUnknownValue(m)) : typed ? typed : '?';
    const [A, B] = m.names;
    const f = m.factor ?? 1;
    let rows: BarRow[];
    let total: string | null = null;
    let difference: { from: number; to: number; label: string } | null = null;
    if (m.structure === 'partWhole') {
      rows = [{ name: '', segments: [{ length: m.a, label: `${A}: ${m.a}` }, { length: m.b, label: m.unknown === 'part' ? `${B}: ${unknownLabel}` : `${B}: ${m.b}`, unknown: m.unknown === 'part' }] }];
      total = m.unknown === 'whole' ? unknownLabel : String(m.a + m.b);
    } else if (m.structure === 'compare') {
      const d = m.a - m.b;
      rows = [
        { name: A, segments: [{ length: m.a, label: m.unknown === 'larger' ? unknownLabel : String(m.a), unknown: m.unknown === 'larger' }] },
        { name: B, segments: [{ length: m.b, label: m.unknown === 'smaller' ? unknownLabel : String(m.b), unknown: m.unknown === 'smaller' }] },
      ];
      difference = { from: m.b, to: m.a, label: m.unknown === 'difference' ? unknownLabel : String(d) };
    } else {
      rows = [
        { name: A, segments: Array.from({ length: f }, () => ({ length: m.b, label: m.unknown === 'smaller' ? unknownLabel : String(m.b), unknown: m.unknown === 'smaller' })) },
        { name: B, segments: [{ length: m.b, label: m.unknown === 'smaller' ? unknownLabel : String(m.b), unknown: m.unknown === 'smaller' }] },
      ];
      total = m.unknown === 'larger' ? unknownLabel : String(m.a);
      if (m.unknown === 'larger') rows[0].segments = rows[0].segments.map((sg) => ({ ...sg, unknown: false }));
    }
    // En "falta el total", la llave de arriba es la incógnita; se puede tocar la barra para escribir.
    return <BarModelBoard rows={rows} totalLabel={total} difference={difference} width={width} onPressUnknown={focusAnswer} />;
  }

  if (m.kind === 'area' && w.kind === 'area') {
    return (
      <AreaBoard
        rows={m.rows}
        cols={m.cols}
        task={m.task}
        tiles={w.tiles}
        width={width}
        disabled={done}
        onToggle={(index) => work({ type: 'toggleCell', index })}
        topLabel={`${m.cols} m`}
        sideLabel={m.task === 'missingSide' ? (done ? `${m.rows} m` : '? m') : `${m.rows} m`}
        centerLabel={m.task === 'missingSide' ? `${m.rows * m.cols} m²` : null}
        cellLabel={(i, on) => L(lang, `Cuadro ${i + 1}${on ? ', con loseta' : ''}`, `Square ${i + 1}${on ? ', tiled' : ''}`)}
      />
    );
  }

  if (m.kind === 'clock' && w.kind === 'clock') {
    const a = clockAngles(w.minutes);
    const small = m.step;
    return (
      <ClockBoard
        hourAngle={a.hour}
        minuteAngle={a.minute}
        size={width}
        disabled={done}
        controls={
          m.task === 'read'
            ? null
            : [
                { label: L(lang, '−1 hora', '−1 hour'), minutes: -60 },
                { label: `−${small} min`, minutes: -small },
                { label: `+${small} min`, minutes: small },
                { label: L(lang, '+1 hora', '+1 hour'), minutes: 60 },
              ]
        }
        onShift={(minutes) => work({ type: 'shiftTime', minutes })}
        a11y={L(lang, 'Reloj', 'Clock')}
      />
    );
  }

  if (m.kind === 'data' && w.kind === 'data') {
    return (
      <BarChartBoard
        categories={m.categories.map((id) => ({ id, name: fruitName(id, lang) }))}
        bars={w.bars}
        scale={m.scale}
        editable={m.task === 'build'}
        disabled={done}
        width={width}
        table={m.task === 'build' ? m.values : null}
        tableTitle={L(lang, 'Votos', 'Votes')}
        onDelta={(index, delta) => work({ type: 'setBar', index, delta })}
      />
    );
  }

  if (m.kind === 'coord' && w.kind === 'coord') {
    return (
      <CoordBoard
        max={m.max}
        point={w.point}
        width={width}
        disabled={done}
        onTap={m.task === 'plot' ? (x, y) => work({ type: 'placePoint', x, y }) : null}
        a11y={w.point ? L(lang, `Tesoro en (${w.point[0]}, ${w.point[1]})`, `Treasure at (${w.point[0]}, ${w.point[1]})`) : L(lang, 'Plano vacío', 'Empty grid')}
      />
    );
  }

  if (m.kind === 'ratio' && w.kind === 'ratio') {
    return (
      <RatioBoard
        a={m.a}
        b={m.b}
        lots={w.lots}
        disabled={done}
        labels={{
          add: L(lang, '+ Lote', '+ Batch'),
          remove: L(lang, '− Lote', '− Batch'),
          lot: (n) => L(lang, `Lote ${n}`, `Batch ${n}`),
          totals: (blue, orange) => L(lang, `${blue} azul · ${orange} naranja`, `${blue} blue · ${orange} orange`),
        }}
        onAdd={() => work({ type: 'addLot' })}
        onRemove={() => work({ type: 'removeLot' })}
      />
    );
  }
  return null;
}

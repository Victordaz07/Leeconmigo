import { Text, View } from 'react-native';
import { CART_MOVE_TEXT, SWING_TEXT, TABLE_PAIRS, MAX_PUSHES, cartMove, swingSide, travelCm, type CartMove } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, CartBench, PendulumBench, ResultTable } from '@lee-conmigo/ui-native';
import { CIENCIA_FUERZAS } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: empujones elegidos, si se soltó, combinaciones probadas, lo anotado y los latidos vistos. */
interface Bag {
  left?: number;
  right?: number;
  released?: boolean;
  tested?: string[];
  cells?: Record<string, CartMove>;
  pick?: number | null;
  missed?: boolean;
  tick?: number;
  seen?: number[];
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const MOVES: CartMove[] = ['derecha', 'izquierda', 'quieto'];

/** El carrito con empujones y el péndulo (C3-U05). */
export const forcesFamily: Family = {
  id: 'forces',
  owns: (step) => !!step.forces,
  initial: (step) => {
    const f = step.forces;
    return { bag: { left: f?.left ?? 0, right: f?.right ?? 0, released: !!f?.static && f.view === 'cart' && f.left !== undefined, tested: [], cells: {}, pick: null, tick: 0, seen: [0] } satisfies Bag };
  },
  skippable: (step) => step.kind === 'probar' || step.kind === 'registrar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const f = step.forces;
    const bag = bagOf(ctx);
    if (!f) return true;
    if (step.kind === 'probar') return (f.view === 'cart' ? (bag.tested ?? []).length : (bag.seen ?? []).length) >= (f.trials ?? 1) || local.skipped;
    if (step.kind === 'registrar') return TABLE_PAIRS.every((_, i) => bag.cells?.[`${i}`] !== undefined) || local.skipped;
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, local, patch } = ctx;
    const f = step.forces;
    if (!f) return null;
    const c = CIENCIA_COPY.forces;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });

    // ---- el péndulo
    if (f.view === 'swing') {
      const seen = bag.seen ?? [0];
      const ticks = f.static ? (f.ticks ?? 6) : f.ticks && step.kind !== 'probar' ? f.ticks : seen.length;
      const current = f.static ? ticks - 1 : seen[seen.length - 1];
      const trials = f.trials ?? 1;
      const rows = Array.from({ length: f.static ? ticks : seen.length }, (_, i) => i);
      const showTable = f.static || step.kind === 'probar';
      return (
        <View style={fstyles.stack}>
          <PendulumBench
            art={CIENCIA_FUERZAS}
            width={visualWidth}
            side={step.kind === 'probar' || f.static ? swingSide(current) : swingSide(0)}
            tickText={step.kind === 'probar' || f.static ? c.beat(current)[lang] : c.beat(0)[lang]}
            label={c.swingLabel(step.kind === 'probar' || f.static ? current : null)[lang]}
          />
          {step.kind === 'probar' ? (
            <View style={fstyles.buttonsRow}>
              <Button label={c.next[lang]} large disabled={seen.length >= trials} onPress={() => set({ seen: [...seen, seen.length] })} />
            </View>
          ) : null}
          {showTable ? (
            <ResultTable
              title={c.swingTableTitle[lang]}
              headers={[c.where[lang]]}
              emptyLabel={CIENCIA_COPY.table.empty[lang]}
              rows={rows.map((t) => ({ id: `${t}`, label: c.beat(t)[lang], cells: [{ text: SWING_TEXT[swingSide(t)][lang] }] }))}
            />
          ) : (
            <Text style={fstyles.helper}>{c.startHint[lang]}</Text>
          )}
          {step.kind === 'probar' ? <Text style={fstyles.helper}>{(seen.length >= trials ? c.seenAll : seen.length === 1 ? c.tapNext : c.seen(seen.length, trials))[lang]}</Text> : null}
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    // ---- el carrito
    const cartAt = (l: number, r: number, released: boolean) => {
      const move = cartMove(l, r);
      const cm = travelCm(l, r);
      return (
        <CartBench
          art={CIENCIA_FUERZAS}
          width={visualWidth}
          left={l}
          right={r}
          released={released}
          dir={move}
          travelCm={cm}
          resultText={released ? `${CART_MOVE_TEXT[move][lang]}${cm ? ` · ${c.traveled(cm)[lang]}` : ''}` : undefined}
          label={c.cartLabel(l, r)[lang]}
        />
      );
    };
    const rowCells = (cells?: Record<string, CartMove>) =>
      TABLE_PAIRS.map(([l, r], i) => {
        const v = cells ? cells[`${i}`] : cartMove(l, r);
        return { id: `${i}`, label: c.rowLabel(l, r)[lang], cells: [{ text: v === undefined ? null : CART_MOVE_TEXT[v][lang] }] };
      });

    if (step.kind === 'probar') {
      const left = bag.left ?? 0;
      const right = bag.right ?? 0;
      const released = !!bag.released;
      const tested = bag.tested ?? [];
      const trials = f.trials ?? 1;
      const stepper = (value: number, dir: 'right' | 'left') => {
        const setValue = (n: number) => set(dir === 'right' ? { right: n, released: false } : { left: n, released: false });
        return (
          <View style={fstyles.weighRow}>
            <Button label={c.remove[lang]} variant="secondary" disabled={value <= 0} onPress={() => setValue(value - 1)} />
            <Text style={fstyles.helper}>{`${(dir === 'right' ? c.toRight : c.toLeft)[lang]}: ${value}`}</Text>
            <Button label={c.add[lang]} variant="secondary" disabled={value >= MAX_PUSHES} onPress={() => setValue(value + 1)} />
          </View>
        );
      };
      return (
        <View style={fstyles.stack}>
          {cartAt(left, right, released)}
          {stepper(right, 'right')}
          {stepper(left, 'left')}
          <View style={fstyles.buttonsRow}>
            <Button
              label={(released ? c.releaseAgain : c.release)[lang]}
              large
              onPress={() => {
                const key = `${left}:${right}`;
                set({ released: true, tested: tested.includes(key) ? tested : [...tested, key] });
              }}
            />
          </View>
          <Text style={fstyles.helper}>{(tested.length === 0 ? c.pickPushes : tested.length >= trials ? c.testedAll : c.tested(tested.length, trials))[lang]}</Text>
        </View>
      );
    }

    if (step.kind === 'registrar') {
      const cells = bag.cells ?? {};
      const pick = bag.pick ?? null;
      const [pl, pr] = pick !== null ? TABLE_PAIRS[pick] : [0, 0];
      const correct = cartMove(pl, pr);
      const answer = (m: CartMove) => {
        if (pick === null) return;
        if (m === correct) set({ cells: { ...cells, [`${pick}`]: m }, pick: null, missed: false });
        else set({ missed: true });
      };
      const all = TABLE_PAIRS.every((_, i) => cells[`${i}`] !== undefined);
      return (
        <View style={fstyles.stack}>
          {cartAt(pl, pr, pick !== null)}
          <ResultTable
            title={c.tableTitle[lang]}
            headers={[c.result[lang]]}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={rowCells(cells)}
            onCellPress={(rowId) => set({ pick: Number(rowId), missed: false })}
            active={pick !== null ? { rowId: `${pick}`, col: 0 } : undefined}
          />
          <Text style={fstyles.helper}>{(pick !== null ? c.askAbout(c.rowLabel(pl, pr)[lang]) : all ? c.tableComplete : c.pickCell)[lang]}</Text>
          {pick !== null ? (
            <View style={fstyles.buttonsRow}>
              {MOVES.map((m) => (
                <Button key={m} label={CART_MOVE_TEXT[m][lang]} variant="secondary" onPress={() => answer(m)} />
              ))}
            </View>
          ) : null}
          {bag.missed ? (
            <View style={fstyles.reveal}>
              <Text style={fstyles.revealText}>{c.lookAgain[lang]}</Text>
            </View>
          ) : null}
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    if (f.static && f.left !== undefined && f.right !== undefined) return cartAt(f.left, f.right, true);
    if (f.static) {
      return (
        <View style={fstyles.stack}>
          <ResultTable title={c.tableTitle[lang]} headers={[c.result[lang]]} emptyLabel={CIENCIA_COPY.table.empty[lang]} rows={rowCells()} />
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }
    return cartAt(f.left ?? 0, f.right ?? 0, false);
  },
};

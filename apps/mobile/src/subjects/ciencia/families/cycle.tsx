import { Text, View } from 'react-native';
import { DRIVER_NAME, FLOWS, PIECES, PIECE_NAME, checkModel, flowBetween, flowById, whyNotFlow, type Piece } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, CycleBoard, ResultTable } from '@lee-conmigo/ui-native';
import { CIENCIA_AGUA } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: flechas agregadas y quitadas, la pieza de origen elegida y el último aviso. */
interface Bag {
  added?: string[];
  removed?: string[];
  from?: Piece | null;
  msg?: string | null;
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const SUN_FLOWS = FLOWS.filter((f) => f.driver === 'sol').map((f) => f.id);

/** Las flechas que tiene el modelo ahora: las de partida, más las agregadas, menos las quitadas. */
const currentFlows = (start: string[] | undefined, bag: Bag): string[] => {
  const removed = bag.removed ?? [];
  return [...new Set([...(start ?? []), ...(bag.added ?? [])])].filter((id) => !removed.includes(id));
};

/** El constructor del ciclo del agua (C6-U05): armar o analizar un modelo de flechas entre piezas, con el Sol y la gravedad como motores. */
export const cycleFamily: Family = {
  id: 'cycle',
  owns: (step) => !!step.cycle,
  initial: () => ({ bag: { added: [], removed: [], from: null, msg: null } satisfies Bag }),
  skippable: (step) => step.cycle?.view === 'build',
  ready: (ctx) => {
    const { step, local } = ctx;
    const c = step.cycle;
    const bag = bagOf(ctx);
    if (!c || c.view !== 'build') return true;
    const flows = currentFlows(c.flows, bag);
    const okTrials = c.trials === undefined || (c.removable ? (bag.removed ?? []).length : (bag.added ?? []).length) >= c.trials;
    const okGoal = c.goal === undefined || (c.goal === 'closed' ? checkModel(flows).ok : SUN_FLOWS.every((id) => flows.includes(id)));
    return (okTrials && okGoal) || local.skipped;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, patch } = ctx;
    const c = step.cycle;
    if (!c) return null;
    const t = CIENCIA_COPY.cycle;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });
    const driverTag = (d: 'sol' | 'gravedad') => (d === 'sol' ? t.sunTag : t.gravityTag)[lang];

    if (c.view === 'table') {
      return (
        <View style={fstyles.stack}>
          <ResultTable
            title={t.tableTitle[lang]}
            headers={[t.colPath[lang], t.colDriver[lang]]}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={FLOWS.map((f) => ({ id: f.id, label: f.name[lang], cells: [{ text: `${cap(PIECE_NAME[f.from][lang])} → ${PIECE_NAME[f.to][lang]}` }, { text: driverTag(f.driver) }] }))}
          />
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    const flows = currentFlows(c.flows, bag);
    const check = checkModel(flows);
    const arrows = flows.map((id) => flowById(id)!).map((f) => ({ id: f.id, from: f.from, to: f.to, driver: f.driver }));
    const board = (
      <CycleBoard
        art={{ sol: CIENCIA_AGUA.sol, piezas: { mar: CIENCIA_AGUA.mar, nube: CIENCIA_AGUA.nube, montana: CIENCIA_AGUA.montana, rio: CIENCIA_AGUA.rio, arbol: CIENCIA_AGUA.arbol, suelo: CIENCIA_AGUA.suelo } }}
        width={visualWidth}
        pieces={PIECES.map((p) => ({ id: p, label: cap(PIECE_NAME[p][lang]) }))}
        arrows={arrows}
        selected={bag.from ?? null}
        onPiece={c.view === 'build' ? (id) => tapPiece(id as Piece) : undefined}
        sunLabel={DRIVER_NAME.sol[lang]}
        label={t.boardLabel(arrows.length)[lang]}
      />
    );
    const tapPiece = (id: Piece) => {
      const from = bag.from ?? null;
      if (from === null) return set({ from: id, msg: null });
      if (from === id) return set({ from: null });
      const f = flowBetween(from, id);
      if (!f) return set({ from: null, msg: whyNotFlow(from, id)[lang] });
      if (flows.includes(f.id)) return set({ from: null, msg: t.already[lang] });
      set({ added: [...(bag.added ?? []), f.id], removed: (bag.removed ?? []).filter((x) => x !== f.id), from: null, msg: t.added(f.name[lang], DRIVER_NAME[f.driver][lang])[lang] });
    };
    const chips = (
      <View style={fstyles.buttonsRow}>
        <Badge text={`${check.closed ? '✓' : '○'} ${(check.closed ? t.chipClosed : t.chipOpen)[lang]}`} />
        <Badge text={`${check.hasSun ? '✓' : '○'} ${t.chipSun[lang]}`} />
        <Badge text={`${check.hasGravity ? '✓' : '○'} ${t.chipGravity[lang]}`} />
      </View>
    );
    const legend = (
      <View style={fstyles.stack}>
        <Text style={fstyles.helper}>{t.legendTitle[lang]}</Text>
        {flows.length === 0 ? <Text style={fstyles.helper}>{t.empty[lang]}</Text> : null}
        {flows.map((id) => {
          const f = flowById(id)!;
          return (
            <View key={id} style={fstyles.weighRow}>
              <Text style={[fstyles.helper, fstyles.flex]}>{`${f.name[lang]}: ${cap(PIECE_NAME[f.from][lang])} → ${PIECE_NAME[f.to][lang]} (${driverTag(f.driver)})`}</Text>
              {c.view === 'build' && c.removable ? <Button label={t.remove[lang]} variant="secondary" onPress={() => set({ removed: [...(bag.removed ?? []), id] })} /> : null}
            </View>
          );
        })}
      </View>
    );

    if (c.view === 'show') {
      return (
        <View style={fstyles.stack}>
          {board}
          {chips}
          {flows.length ? legend : null}
        </View>
      );
    }

    const from = bag.from ?? null;
    const trials = c.trials;
    const count = c.removable ? (bag.removed ?? []).length : (bag.added ?? []).length;
    return (
      <View style={fstyles.stack}>
        {board}
        {chips}
        <Text style={fstyles.helper}>{bag.msg ?? (from ? t.tapTo(cap(PIECE_NAME[from][lang]))[lang] : c.goal === 'closed' ? t.goalClosed[lang] : t.tapFrom[lang])}</Text>
        {trials !== undefined ? <Text style={fstyles.helper}>{(count >= trials ? t.done : c.removable ? t.removedCount(count, trials) : t.counted(count, trials))[lang]}</Text> : null}
        {legend}
      </View>
    );
  },
};

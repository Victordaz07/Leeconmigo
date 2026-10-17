import { Text, View } from 'react-native';
import { MAGNET_MARKS, magnetMoves, MOVE_TEXT, OBJECT_NAME, type MagnetObject } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, MagnetBench, ResultTable } from '@lee-conmigo/ui-native';
import { CIENCIA_IMANES } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: objeto y marca elegidos, lo ya probado, lo que se vio y lo anotado. */
interface Bag {
  object?: MagnetObject;
  mark?: number | null;
  /** Combinaciones (objeto:marca) ya probadas. */
  tested?: string[];
  moved?: boolean | null;
  cells?: Record<string, boolean>;
  look?: string;
  missed?: boolean;
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const ART = { iman: CIENCIA_IMANES.iman, objetos: { ...CIENCIA_IMANES.objetos } };
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const marksList = [...MAGNET_MARKS] as number[];

/** El imán grande y los objetos (C3-U06): cambiar la distancia o el objeto de uno en uno, observar si se movió y anotarlo. */
export const magnetsFamily: Family = {
  id: 'magnets',
  owns: (step) => !!step.magnet,
  initial: (step) => {
    const m = step.magnet;
    const object = m?.object ?? m?.objects?.[0] ?? 'clavo';
    const mark = m?.position ?? null;
    const moved = m?.static && m.position !== undefined && m.object ? magnetMoves(m.object, m.position) : null;
    return { bag: { object, mark, tested: [], moved, cells: {} } satisfies Bag };
  },
  skippable: (step) => step.kind === 'probar' || step.kind === 'registrar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const setup = step.magnet;
    const bag = bagOf(ctx);
    if (!setup) return true;
    if (step.kind === 'probar') {
      // Se cuentan las marcas distintas (un objeto) u objetos distintos (marca fija).
      const distinct = new Set((bag.tested ?? []).map((k) => (setup.objects ? k.split(':')[0] : k.split(':')[1]))).size;
      return distinct >= (setup.trials ?? 1) || local.skipped;
    }
    if (step.kind === 'registrar') return marksList.every((m) => bag.cells?.[`${m}`] !== undefined) || local.skipped;
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, local, patch } = ctx;
    const setup = step.magnet;
    if (!setup) return null;
    const c = CIENCIA_COPY;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });
    const objects = setup.objects ?? (setup.object ? [setup.object] : []);
    const object = bag.object ?? objects[0];
    const mark = bag.mark ?? null;
    const tested = bag.tested ?? [];
    const cells = bag.cells ?? {};
    const name = (o: MagnetObject) => OBJECT_NAME[o][lang];
    const word = (moved: boolean) => MOVE_TEXT[moved ? 'si' : 'no'][lang];
    const tiles = setup.objects ? objects.map((o) => ({ id: o, label: cap(name(o)), tried: tested.some((k) => k.startsWith(`${o}:`)) })) : undefined;
    const bench = (obj: MagnetObject, m: number | null, moved: boolean | null, onMark?: (n: number) => void, onObject?: (id: string) => void) => (
      <MagnetBench art={ART} width={visualWidth} object={obj} mark={m} marks={marksList} onMark={onMark} markLabel={(n) => c.magnet.mark(n)[lang]} tiles={tiles} onObject={onObject} moved={moved} resultText={moved === null ? undefined : word(moved)} label={c.magnet.benchLabel(name(obj), m)[lang]} />
    );

    if (step.kind === 'probar') {
      const trials = setup.trials ?? 1;
      const byObject = !!setup.objects;
      const bring = () => {
        if (mark === null) return;
        const key = `${object}:${mark}`;
        set({ moved: magnetMoves(object, mark), tested: tested.includes(key) ? tested : [...tested, key] });
      };
      const distinct = new Set(tested.map((k) => (byObject ? k.split(':')[0] : k.split(':')[1]))).size;
      return (
        <View style={fstyles.stack}>
          {bench(object, mark, bag.moved ?? null, setup.position === undefined ? (n) => set({ mark: n, moved: null }) : undefined, byObject ? (id) => set({ object: id as MagnetObject, moved: null }) : undefined)}
          <View style={fstyles.buttonsRow}>
            <Button label={(bag.moved != null ? c.magnet.bringAgain : c.magnet.bring)[lang]} large disabled={mark === null} onPress={bring} />
          </View>
          <Text style={fstyles.helper}>{mark === null ? c.magnet.pickMark[lang] : distinct === 0 ? (byObject ? c.magnet.pickObject : c.magnet.nearHint)[lang] : distinct >= trials ? c.magnet.testedAll[lang] : c.magnet.tested(distinct, trials)[lang]}</Text>
        </View>
      );
    }

    if (step.kind === 'registrar') {
      const look = bag.look;
      const lookMark = look ? Number(look) : null;
      const answer = (said: boolean) => {
        if (lookMark === null) return;
        if (said === magnetMoves(object, lookMark)) set({ cells: { ...cells, [`${lookMark}`]: said }, look: undefined, missed: false });
        else set({ missed: true });
      };
      const all = marksList.every((m) => cells[`${m}`] !== undefined);
      return (
        <View style={fstyles.stack}>
          {bench(object, lookMark, lookMark === null ? null : magnetMoves(object, lookMark))}
          <ResultTable
            title={c.magnet.tableTitle[lang]}
            headers={[c.magnet.column[lang]]}
            emptyLabel={c.table.empty[lang]}
            rows={marksList.map((m) => ({ id: `${m}`, label: c.magnet.mark(m)[lang], cells: [{ text: cells[`${m}`] === undefined ? null : word(cells[`${m}`]) }] }))}
            onCellPress={(rowId) => set({ look: rowId, missed: false })}
            active={look ? { rowId: look, col: 0 } : undefined}
          />
          <Text style={fstyles.helper}>{lookMark !== null ? c.magnet.askAbout(c.magnet.mark(lookMark)[lang].toLowerCase())[lang] : all ? c.magnet.tableComplete[lang] : c.magnet.pickCell[lang]}</Text>
          {lookMark !== null ? (
            <View style={fstyles.buttonsRow}>
              <Button label={word(true)} onPress={() => answer(true)} />
              <Button label={word(false)} variant="secondary" onPress={() => answer(false)} />
            </View>
          ) : null}
          {bag.missed ? (
            <View style={fstyles.reveal}>
              <Text style={fstyles.revealText}>{c.magnet.lookAgain[lang]}</Text>
            </View>
          ) : null}
          <Badge text={c.badge.practiceData[lang]} />
        </View>
      );
    }

    if (setup.static) {
      // Varios objetos con el imán en una marca: una fila por objeto. Un objeto: una fila por marca (o el banco en una marca).
      if (setup.objects && setup.position !== undefined) {
        const at = setup.position;
        return (
          <View style={fstyles.stack}>
            {bench(object, at, magnetMoves(object, at), undefined, (id) => set({ object: id as MagnetObject }))}
            <ResultTable title={c.magnet.tableTitle[lang]} headers={[`${c.magnet.column[lang]} (${c.magnet.mark(at)[lang].toLowerCase()})`]} emptyLabel={c.table.empty[lang]} rows={objects.map((o) => ({ id: o, label: cap(name(o)), cells: [{ text: word(magnetMoves(o, at)) }] }))} />
            <Badge text={c.badge.practiceData[lang]} />
          </View>
        );
      }
      if (setup.position !== undefined) return bench(object, setup.position, magnetMoves(object, setup.position));
      return (
        <View style={fstyles.stack}>
          <ResultTable title={c.magnet.tableTitle[lang]} headers={[c.magnet.column[lang]]} emptyLabel={c.table.empty[lang]} rows={marksList.map((m) => ({ id: `${m}`, label: c.magnet.mark(m)[lang], cells: [{ text: word(magnetMoves(object, m)) }] }))} />
          <Badge text={c.badge.practiceData[lang]} />
        </View>
      );
    }
    return bench(object, mark, null, undefined, undefined);
  },
};

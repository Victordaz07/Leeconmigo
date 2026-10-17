import { Text, View } from 'react-native';
import { RELEASE_MARKS, SOUND_WORD, isMark, slideCm, slides, type ReleaseMark } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, RampBench, ResultTable } from '@lee-conmigo/ui-native';
import { CIENCIA_MOVIMIENTO } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: marca elegida, si ya se soltó, marcas probadas y lo anotado. */
interface Bag {
  mark?: number | null;
  released?: boolean;
  tested?: number[];
  cells?: Record<string, number>;
  pick?: number | null;
  missed?: boolean;
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const marksList = [...RELEASE_MARKS] as number[];
const RULER_MAX = 25;

/** La rampa y el bloque (C4-U02): soltar la bola desde una marca, leer cuánto se desliza el bloque y anotarlo. */
export const rampFamily: Family = {
  id: 'ramp',
  owns: (step) => !!step.ramp,
  initial: (step) => ({ bag: { mark: step.ramp?.mark ?? null, released: !!step.ramp?.static && step.ramp.mark !== undefined, tested: [], cells: {}, pick: null } satisfies Bag }),
  skippable: (step) => step.kind === 'probar' || step.kind === 'registrar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const bag = bagOf(ctx);
    if (!step.ramp) return true;
    if (step.kind === 'probar') return (bag.tested ?? []).length >= (step.ramp.trials ?? 1) || local.skipped;
    if (step.kind === 'registrar') return marksList.every((m) => bag.cells?.[`${m}`] !== undefined) || local.skipped;
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, local, patch } = ctx;
    const setup = step.ramp;
    if (!setup) return null;
    const c = CIENCIA_COPY.ramp;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });
    const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
    const bench = (mark: number | null, released: boolean, onMark?: (n: number) => void) => {
      const cm = mark !== null && isMark(mark) ? slideCm(mark) : null;
      return (
        <RampBench
          art={CIENCIA_MOVIMIENTO}
          width={visualWidth}
          mark={mark}
          marks={marksList}
          onMark={onMark}
          markLabel={(n) => c.mark(n)[lang]}
          released={released && cm !== null}
          slideCm={released ? cm : null}
          rulerMax={RULER_MAX}
          resultText={released && mark !== null && isMark(mark) ? `${c.slid(slideCm(mark))[lang]} · ${SOUND_WORD[mark][lang]}` : undefined}
          label={c.benchLabel(mark, released, cm)[lang]}
        />
      );
    };
    const tableRows = (cells?: Record<string, number>, withSound = false) =>
      marksList.map((m) => ({
        id: `${m}`,
        label: c.mark(m)[lang],
        cells: [{ text: (cells ? cells[`${m}`] : slideCm(m as ReleaseMark)) === undefined ? null : c.cm((cells ? cells[`${m}`] : slideCm(m as ReleaseMark)) as number)[lang] }, ...(withSound ? [{ text: SOUND_WORD[m as ReleaseMark][lang] }] : [])],
      }));

    if (step.kind === 'probar') {
      const mark = bag.mark ?? null;
      const released = !!bag.released;
      const tested = bag.tested ?? [];
      const trials = setup.trials ?? 1;
      const release = () => {
        if (mark === null) return;
        set({ released: true, tested: tested.includes(mark) ? tested : [...tested, mark] });
      };
      return (
        <View style={fstyles.stack}>
          {bench(mark, released, setup.mark === undefined ? (n) => set({ mark: n, released: false }) : undefined)}
          <View style={fstyles.buttonsRow}>
            <Button label={(released ? c.releaseAgain : c.release)[lang]} large disabled={mark === null} onPress={release} />
          </View>
          <Text style={fstyles.helper}>{mark === null ? c.pickMark[lang] : tested.length >= trials ? c.testedAll[lang] : tested.length === 0 ? c.pickMark[lang] : c.tested(tested.length, trials)[lang]}</Text>
        </View>
      );
    }

    if (step.kind === 'registrar') {
      const cells = bag.cells ?? {};
      const pick = bag.pick ?? null;
      const correct = pick !== null && isMark(pick) ? slideCm(pick) : 0;
      const choices = [correct - 3, correct, correct + 3];
      const answer = (cm: number) => {
        if (pick === null) return;
        if (cm === correct) set({ cells: { ...cells, [`${pick}`]: cm }, pick: null, missed: false });
        else set({ missed: true });
      };
      const all = marksList.every((m) => cells[`${m}`] !== undefined);
      return (
        <View style={fstyles.stack}>
          {bench(pick ?? marksList[0], true)}
          <ResultTable
            title={c.tableTitle[lang]}
            headers={[c.distance[lang]]}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={tableRows(Object.fromEntries(marksList.map((m) => [`${m}`, cells[`${m}`]])) as Record<string, number>)}
            onCellPress={(rowId) => set({ pick: Number(rowId), missed: false })}
            active={pick !== null ? { rowId: `${pick}`, col: 0 } : undefined}
          />
          <Text style={fstyles.helper}>{(pick !== null ? c.askAbout(c.mark(pick)[lang].toLowerCase()) : all ? c.tableComplete : c.pickCell)[lang]}</Text>
          {pick !== null ? (
            <View style={fstyles.buttonsRow}>
              {choices.map((cm) => (
                <Button key={cm} label={c.cm(cm)[lang]} variant="secondary" onPress={() => answer(cm)} />
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

    // Resultados ya hechos
    if (setup.static) {
      if (setup.mark !== undefined) return bench(setup.mark, true);
      return (
        <View style={fstyles.stack}>
          <ResultTable title={c.tableTitle[lang]} headers={[c.distance[lang], c.sound[lang]]} emptyLabel={CIENCIA_COPY.table.empty[lang]} rows={tableRows(undefined, true)} />
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }
    // Vista previa (predecir): la bola lista en su marca, sin soltarla
    return bench(setup.mark ?? null, false);
  },
};

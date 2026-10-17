import { Text, View } from 'react-native';
import {
  KNOWN_SAMPLES,
  PROP_NAME,
  SAMPLE_NAME,
  SUBSTANCE_CHANGE,
  SUBSTANCE_G,
  SUBSTANCE_NAME,
  JAR_WITH_WATER_G,
  WEIGH_STEPS,
  observed,
  scaleReading,
  totalAfter,
  totalBefore,
  type Prop,
  type Sample,
  type Substance,
} from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { BalanceBench, Button, ResultTable, SampleStrip } from '@lee-conmigo/ui-native';
import { CIENCIA_SISTEMAS } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: sustancia elegida, acciones de la pesada, sustancias ya pesadas, lo anotado y las pruebas a la muestra X. */
interface Bag {
  substance?: Substance;
  done?: number;
  finished?: Substance[];
  cells?: Record<string, number>;
  pick?: string;
  missed?: boolean;
  testedX?: Prop[];
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const COLUMNS = ['antes', 'despues'] as const;

/** La balanza con el frasco cerrado y la tabla de propiedades de las muestras (C5-U02). */
export const matterFamily: Family = {
  id: 'matter',
  owns: (step) => !!step.matter,
  initial: (step) => {
    const m = step.matter;
    const substance = m?.substance ?? m?.substances?.[0] ?? 'sal';
    return { bag: { substance, done: m?.done ?? 0, finished: [], cells: {}, testedX: [] } satisfies Bag };
  },
  skippable: (step) => step.kind === 'probar' || step.kind === 'registrar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const m = step.matter;
    const bag = bagOf(ctx);
    if (!m) return true;
    if (step.kind === 'probar') {
      const n = m.view === 'jar' ? (bag.finished ?? []).length : (bag.testedX ?? []).length;
      return n >= (m.trials ?? 1) || local.skipped;
    }
    if (step.kind === 'registrar') {
      const subs = m.substances ?? (m.substance ? [m.substance] : []);
      return subs.every((s) => COLUMNS.every((col) => bag.cells?.[`${s}:${col}`] !== undefined)) || local.skipped;
    }
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, local, patch } = ctx;
    const m = step.matter;
    if (!m) return null;
    const c = CIENCIA_COPY.matter;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });
    const subs = m.substances ?? (m.substance ? [m.substance] : []);
    const name = (s: Substance) => SUBSTANCE_NAME[s][lang];

    if (m.view === 'props') {
      const samples: Sample[] = m.samples ?? [...KNOWN_SAMPLES];
      const tests: Prop[] = m.tests ?? ['color', 'granitos', 'agua'];
      const testedX = bag.testedX ?? [];
      const hasX = samples.includes('X');
      const cell = (s: Sample, p: Prop): string | null => {
        if (s !== 'X') return observed(s, p)[lang];
        return m.revealX || testedX.includes(p) ? observed('X', p)[lang] : null;
      };
      const test = (rowId: string, col: number) => {
        if (rowId !== 'X' || m.static) return;
        const p = tests[col];
        if (!testedX.includes(p)) set({ testedX: [...testedX, p] });
      };
      const trials = m.trials ?? 1;
      return (
        <View style={fstyles.stack}>
          <SampleStrip art={CIENCIA_SISTEMAS} samples={samples.map((s) => ({ id: s, label: SAMPLE_NAME[s][lang] }))} mysteryId={hasX ? 'X' : undefined} />
          <ResultTable
            title={c.propsTitle[lang]}
            headers={tests.map((p) => PROP_NAME[p][lang])}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={samples.map((s) => ({ id: s, label: cap(SAMPLE_NAME[s][lang]), cells: tests.map((p) => ({ text: cell(s, p) })) }))}
            onCellPress={m.static ? undefined : test}
          />
          {step.kind === 'probar' ? <Text style={fstyles.helper}>{(testedX.length === 0 ? c.propsPickX : testedX.length >= trials ? c.propsTestedAll : c.propsTestedX(testedX.length, trials))[lang]}</Text> : null}
          <Text style={fstyles.helper}>{c.propsNever[lang]}</Text>
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    // ---- el frasco cerrado en la balanza
    const substance = bag.substance ?? subs[0] ?? 'sal';
    const done = m.static ? (m.done ?? 4) : (bag.done ?? 0);
    const reading = m.qualitative ? null : scaleReading(substance, done);
    const where = done === 0 ? c.whereNothing : done === 1 ? c.whereJar : done === 2 ? c.whereSubstance(name(substance)) : c.whereMixed(name(substance));
    const bench = (sub: Substance, d: number, qualitative = m.qualitative) => (
      <BalanceBench art={CIENCIA_SISTEMAS} width={visualWidth} done={d} substance={sub} reading={qualitative ? null : scaleReading(sub, d)} label={c.benchLabel(qualitative ? null : scaleReading(sub, d), (d === 0 ? c.whereNothing : d === 1 ? c.whereJar : d === 2 ? c.whereSubstance(name(sub)) : c.whereMixed(name(sub)))[lang])[lang]} />
    );
    const chips = (sub: Substance, d: number) =>
      m.qualitative ? null : (
        <View style={fstyles.buttonsRow}>
          {d >= 1 ? <Badge text={c.chipJar(JAR_WITH_WATER_G)[lang]} /> : null}
          {d >= 2 ? <Badge text={c.chipSubstance(cap(name(sub)), SUBSTANCE_G[sub])[lang]} /> : null}
        </View>
      );

    // Tabla antes / después que el niño anota
    if (step.kind === 'registrar') {
      const cells = bag.cells ?? {};
      const [pickSub, pickCol] = bag.pick ? (bag.pick.split(':') as [Substance, (typeof COLUMNS)[number]]) : [null, null];
      const correct = pickSub ? (pickCol === 'antes' ? totalBefore(pickSub) : totalAfter(pickSub)) : 0;
      const choices = [correct - 10, correct, correct + 10];
      const answer = (g: number) => {
        if (!pickSub || !pickCol) return;
        if (g === correct) set({ cells: { ...cells, [`${pickSub}:${pickCol}`]: g }, pick: undefined, missed: false });
        else set({ missed: true });
      };
      const all = subs.every((s) => COLUMNS.every((col) => cells[`${s}:${col}`] !== undefined));
      return (
        <View style={fstyles.stack}>
          {bench(pickSub ?? substance, 4, false)}
          <ResultTable
            title={c.tableTitle[lang]}
            headers={[c.before[lang], c.after[lang]]}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={subs.map((s) => ({ id: s, label: cap(name(s)), cells: COLUMNS.map((col) => ({ text: cells[`${s}:${col}`] === undefined ? null : c.grams(cells[`${s}:${col}`])[lang] })) }))}
            onCellPress={(rowId, col) => set({ pick: `${rowId}:${COLUMNS[col]}`, missed: false })}
            active={bag.pick ? { rowId: bag.pick.split(':')[0], col: COLUMNS.indexOf(bag.pick.split(':')[1] as (typeof COLUMNS)[number]) } : undefined}
          />
          <Text style={fstyles.helper}>{(pickSub && pickCol ? (pickCol === 'antes' ? c.askBefore(name(pickSub)) : c.askAfter(name(pickSub))) : all ? c.tableComplete : c.pickCell)[lang]}</Text>
          {pickSub ? (
            <View style={fstyles.buttonsRow}>
              {choices.map((g) => (
                <Button key={g} label={c.grams(g)[lang]} variant="secondary" onPress={() => answer(g)} />
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

    // Tabla ya hecha (para analizarla)
    if (m.static && subs.length > 1) {
      return (
        <View style={fstyles.stack}>
          {bench(substance, 4, false)}
          <ResultTable
            title={c.tableTitle[lang]}
            headers={[c.before[lang], c.after[lang]]}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={subs.map((s) => ({ id: s, label: cap(name(s)), cells: [{ text: c.grams(totalBefore(s))[lang] }, { text: c.grams(totalAfter(s))[lang] }] }))}
          />
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }
    if (m.static) {
      return (
        <View style={fstyles.stack}>
          {bench(substance, done)}
          {chips(substance, done)}
        </View>
      );
    }

    // Interactivo: las acciones de la pesada, en orden
    const next = (m.qualitative ? (done === 0 ? 'echar' : 'esperar') : WEIGH_STEPS[done]) as (typeof WEIGH_STEPS)[number] | undefined;
    const finished = bag.finished ?? [];
    const trials = m.trials ?? 1;
    const change = SUBSTANCE_CHANGE[substance];
    // Con la balanza en blanco (primera mirada) solo se echa y se espera.
    const advance = () => {
      const nextDone = m.qualitative && done === 0 ? 3 : done + 1;
      const fin = nextDone >= 4 && !finished.includes(substance) ? [...finished, substance] : finished;
      set({ done: nextDone, finished: fin });
    };
    const label = next === 'frasco' ? c.weighJar : next === 'sustancia' ? c.weighSubstance(name(substance)) : next === 'echar' ? c.pour : change === 'derrite' ? c.waitMelt : c.waitDissolve;
    const hint = m.qualitative ? (done >= 4 ? c.finished : done >= 3 ? c.hints[3] : c.hints[2]) : done >= 4 ? c.finished : c.hints[done];
    return (
      <View style={fstyles.stack}>
        {subs.length > 1 ? (
          <View style={fstyles.toggles}>
            {subs.map((s) => (
              <Button key={s} label={`${finished.includes(s) ? '✓ ' : ''}${cap(name(s))}`} variant={s === substance ? 'primary' : 'secondary'} onPress={() => set({ substance: s, done: 0 })} />
            ))}
          </View>
        ) : null}
        {bench(substance, done)}
        {chips(substance, done)}
        <View style={fstyles.buttonsRow}>
          {done < 4 ? <Button label={label[lang]} large onPress={advance} /> : <Button label={c.again[lang]} variant="secondary" onPress={() => set({ done: 0 })} />}
        </View>
        <Text style={fstyles.helper}>{step.kind === 'probar' && finished.length > 0 && done >= 4 ? (finished.length >= trials ? c.testedAll : c.tested(finished.length, trials))[lang] : hint[lang]}</Text>
      </View>
    );
  },
};

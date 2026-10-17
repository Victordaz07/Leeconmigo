import { Text, View } from 'react-native';
import { OUTCOME_TEXT, PATH_MATERIALS, PATH_NAME, outcomeOf, type PathMaterial, type PathOutcome } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, LightPathBench, ResultTable } from '@lee-conmigo/ui-native';
import { CIENCIA_CAMINOS } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: material elegido, si está encendida, materiales probados y lo anotado. */
interface Bag {
  material?: PathMaterial | null;
  lit?: boolean;
  tested?: string[];
  cells?: Record<string, PathOutcome>;
  pick?: string | null;
  missed?: boolean;
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const OUTCOMES: PathOutcome[] = ['toda', 'poca', 'nada', 'rebota'];

/** La linterna, el marco con un material y la pared (C1-U03): elegir un material, encender, mirar qué pasa con la luz y anotarlo. */
export const pathFamily: Family = {
  id: 'path',
  owns: (step) => !!step.path,
  initial: (step) => ({ bag: { material: step.path?.material ?? null, lit: !!step.path?.static && step.path.material !== undefined, tested: [], cells: {}, pick: null } satisfies Bag }),
  skippable: (step) => step.kind === 'probar' || step.kind === 'registrar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const bag = bagOf(ctx);
    if (!step.path) return true;
    if (step.kind === 'probar') return (bag.tested ?? []).length >= (step.path.trials ?? 1) || local.skipped;
    if (step.kind === 'registrar') return PATH_MATERIALS.every((m) => bag.cells?.[m] !== undefined) || local.skipped;
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, local, patch } = ctx;
    const setup = step.path;
    if (!setup) return null;
    const c = CIENCIA_COPY.path;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });
    const name = (m: PathMaterial) => PATH_NAME[m][lang];
    const bench = (material: PathMaterial | null, lit: boolean, tiles?: PathMaterial[], onMaterial?: (id: string) => void) => {
      const out = material ? outcomeOf(material) : null;
      return (
        <LightPathBench
          art={CIENCIA_CAMINOS}
          width={visualWidth}
          material={material}
          lit={lit}
          outcome={lit ? out : null}
          tiles={tiles?.map((m) => ({ id: m, label: cap(name(m)), tried: (bag.tested ?? []).includes(m) }))}
          onMaterial={onMaterial}
          resultText={lit && out ? OUTCOME_TEXT[out][lang] : undefined}
          label={material ? c.benchLabel(name(material), lit)[lang] : c.nothing[lang]}
        />
      );
    };
    const rows = (cells?: Record<string, PathOutcome>) =>
      PATH_MATERIALS.map((m) => {
        const v = cells ? cells[m] : outcomeOf(m);
        return { id: m, label: cap(name(m)), cells: [{ text: v === undefined ? null : OUTCOME_TEXT[v][lang] }] };
      });

    if (step.kind === 'probar') {
      const material = bag.material ?? null;
      const lit = !!bag.lit;
      const tested = bag.tested ?? [];
      const trials = setup.trials ?? 1;
      const tiles = setup.material === undefined ? [...PATH_MATERIALS] : undefined;
      return (
        <View style={fstyles.stack}>
          {bench(material, lit, tiles, tiles ? (id) => set({ material: id as PathMaterial, lit: false }) : undefined)}
          <View style={fstyles.buttonsRow}>
            <Button
              label={(lit ? c.onAgain : c.on)[lang]}
              large
              disabled={material === null}
              onPress={() => material && set({ lit: true, tested: tested.includes(material) ? tested : [...tested, material] })}
            />
          </View>
          <Text style={fstyles.helper}>{(material === null ? c.pickMaterial : tested.length >= trials ? c.testedAll : tested.length === 0 ? c.pickMaterial : c.tested(tested.length, trials))[lang]}</Text>
        </View>
      );
    }

    if (step.kind === 'registrar') {
      const cells = bag.cells ?? {};
      const pick = (bag.pick as PathMaterial | null | undefined) ?? null;
      const answer = (o: PathOutcome) => {
        if (!pick) return;
        if (o === outcomeOf(pick)) set({ cells: { ...cells, [pick]: o }, pick: null, missed: false });
        else set({ missed: true });
      };
      const all = PATH_MATERIALS.every((m) => cells[m] !== undefined);
      return (
        <View style={fstyles.stack}>
          {bench(pick ?? 'transparente', !!pick)}
          <ResultTable
            title={c.tableTitle[lang]}
            headers={[c.column[lang]]}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={rows(cells)}
            onCellPress={(rowId) => set({ pick: rowId, missed: false })}
            active={pick ? { rowId: pick, col: 0 } : undefined}
          />
          <Text style={fstyles.helper}>{(pick ? c.askAbout(name(pick)) : all ? c.tableComplete : c.pickCell)[lang]}</Text>
          {pick ? (
            <View style={fstyles.buttonsRow}>
              {OUTCOMES.map((o) => (
                <Button key={o} label={OUTCOME_TEXT[o][lang]} variant="secondary" onPress={() => answer(o)} />
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

    if (setup.static) {
      if (setup.material !== undefined) return bench(setup.material, true);
      return (
        <View style={fstyles.stack}>
          <ResultTable title={c.tableTitle[lang]} headers={[c.column[lang]]} emptyLabel={CIENCIA_COPY.table.empty[lang]} rows={rows()} />
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }
    return bench(setup.material ?? null, false);
  },
};

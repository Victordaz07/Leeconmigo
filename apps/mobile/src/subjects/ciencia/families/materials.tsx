import { Text, View } from 'react-native';
import { LEVEL_TEXT, MATERIAL_NAME, MATERIALS, materialResult, type Level, type Material, type MaterialTest } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, MaterialTester, ResultTable } from '@lee-conmigo/ui-native';
import { CIENCIA_MATERIALES, CIENCIA_PROPS } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: qué pieza se eligió, lo que se vio al regar, lo ya probado y lo anotado. */
interface Bag {
  selected?: Material | null;
  level?: Level | null;
  tested?: Material[];
  pouring?: boolean;
  cells?: Partial<Record<Material, Level>>;
  look?: Material;
  missed?: boolean;
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const FILL: Record<Level, number> = { nada: 0, poco: 0.5, mucho: 1 };
const LEVELS: Level[] = ['nada', 'poco', 'mucho'];
const ART = { muneco: CIENCIA_MATERIALES.muneco, bandeja: CIENCIA_MATERIALES.bandeja, regadera: CIENCIA_PROPS.regadera, materiales: CIENCIA_MATERIALES.materiales };
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** El probador de materiales (C2-U02): probar cada pieza con la misma prueba, anotar lo que pasó y comparar. */
export const materialsFamily: Family = {
  id: 'materials',
  owns: (step) => !!step.material,
  initial: () => ({ bag: { selected: null, level: null, tested: [], cells: {} } satisfies Bag }),
  skippable: (step) => step.kind === 'probar' || step.kind === 'registrar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const bag = bagOf(ctx);
    if (step.kind === 'probar') return (bag.tested?.length ?? 0) >= (step.material?.trials ?? 1) || local.skipped;
    if (step.kind === 'registrar') return MATERIALS.every((m) => bag.cells?.[m]) || local.skipped;
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, local, patch, calm, timer } = ctx;
    const setup = step.material;
    if (!setup) return null;
    const c = CIENCIA_COPY;
    const test: MaterialTest = setup.test;
    const bag = bagOf(ctx);
    const tested = bag.tested ?? [];
    const cells = bag.cells ?? {};
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });
    const name = (m: Material) => MATERIAL_NAME[m][lang];
    const levelWord = (l: Level) => LEVEL_TEXT[test][l][lang];
    const heading = test === 'techo' ? c.materials.columnRoof : c.materials.columnSpill;
    const gaugeLabel = (test === 'techo' ? c.materials.gaugeRoof : c.materials.gaugeSpill)[lang];
    const tiles = MATERIALS.map((m) => ({ id: m, label: cap(name(m)), tried: tested.includes(m) }));
    const station = (selected: Material | null, level: Level | null, pouring: boolean, onSelect?: (m: string) => void) => (
      <MaterialTester
        art={ART}
        width={visualWidth}
        test={test}
        tiles={tiles}
        selected={selected}
        onSelect={onSelect}
        pouring={pouring}
        level={level === null ? null : FILL[level]}
        gaugeLabel={gaugeLabel}
        resultText={level === null ? undefined : levelWord(level)}
        label={selected ? (test === 'techo' ? c.materials.stationRoof(name(selected)) : c.materials.stationSpill(name(selected)))[lang] : c.materials.stationNone[lang]}
        calm={calm}
      />
    );

    if (step.kind === 'probar') {
      const trials = setup.trials ?? 1;
      const selected = bag.selected ?? null;
      const pour = () => {
        if (!selected || bag.pouring) return;
        const done = () => set({ pouring: false, level: materialResult(selected, test), tested: tested.includes(selected) ? tested : [...tested, selected] });
        if (calm) return done();
        set({ pouring: true, level: null });
        timer.current = setTimeout(done, 1200);
      };
      return (
        <View style={fstyles.stack}>
          {station(selected, bag.level ?? null, !!bag.pouring, (m) => set({ selected: m as Material, level: null }))}
          <View style={fstyles.buttonsRow}>
            <Button label={(bag.level != null ? c.materials.pourAgain : c.materials.pour)[lang]} large disabled={!selected || !!bag.pouring} onPress={pour} />
          </View>
          <Text style={fstyles.helper}>{!selected ? c.materials.pick[lang] : tested.length >= trials ? c.materials.triedAll[lang] : c.materials.tried(tested.length, trials)[lang]}</Text>
        </View>
      );
    }

    if (step.kind === 'registrar') {
      const look = bag.look;
      const answer = (said: Level) => {
        if (!look) return;
        if (said === materialResult(look, test)) set({ cells: { ...cells, [look]: said }, look: undefined, missed: false });
        else set({ missed: true });
      };
      return (
        <View style={fstyles.stack}>
          {station(look ?? null, look ? materialResult(look, test) : null, false)}
          <ResultTable
            title={c.materials.tableTitle[lang]}
            headers={[heading[lang]]}
            emptyLabel={c.table.empty[lang]}
            rows={MATERIALS.map((m) => ({ id: m, label: cap(name(m)), cells: [{ text: cells[m] ? levelWord(cells[m] as Level) : null }] }))}
            onCellPress={(rowId) => set({ look: rowId as Material, missed: false })}
            active={look ? { rowId: look, col: 0 } : undefined}
          />
          <Text style={fstyles.helper}>{look ? c.materials.askAbout(name(look))[lang] : MATERIALS.every((m) => cells[m]) ? c.materials.tableComplete[lang] : c.materials.pickCell[lang]}</Text>
          {look ? (
            <View style={fstyles.buttonsRow}>
              {LEVELS.map((l) => (
                <Button key={l} label={levelWord(l)} variant={l === 'nada' ? 'primary' : 'secondary'} onPress={() => answer(l)} />
              ))}
            </View>
          ) : null}
          {bag.missed ? (
            <View style={fstyles.reveal}>
              <Text style={fstyles.revealText}>{c.materials.lookAgain[lang]}</Text>
            </View>
          ) : null}
          <Badge text={c.badge.practiceData[lang]} />
        </View>
      );
    }

    if (setup.static) {
      return (
        <View style={fstyles.stack}>
          <ResultTable title={c.materials.tableTitle[lang]} headers={[heading[lang]]} emptyLabel={c.table.empty[lang]} rows={MATERIALS.map((m) => ({ id: m, label: cap(name(m)), cells: [{ text: levelWord(materialResult(m, test)) }] }))} />
          <Badge text={c.badge.practiceData[lang]} />
        </View>
      );
    }
    return station(null, null, false);
  },
};

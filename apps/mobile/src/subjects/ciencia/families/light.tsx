import { Text, View } from 'react-native';
import { LIGHT_ROWS, sighting, sightingsFor, type LightState, type Sighting } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, LightBox, ResultTable } from '@lee-conmigo/ui-native';
import { CIENCIA_LUZ } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: la luz de ahora, las casillas anotadas y la que se está mirando. */
interface Bag {
  on?: boolean;
  cells?: Record<string, Sighting>;
  look?: { row: LightState; col: number };
  missed?: boolean;
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const key = (row: LightState, col: number) => `${row}:${col}`;

/** La caja de observación con luz (C1-U02): encender y apagar, repetir y anotar lo que se distingue. */
export const lightFamily: Family = {
  id: 'light',
  owns: (step) => !!step.light,
  initial: (step) => ({ bag: { on: step.light?.light === 'on', cells: {} } satisfies Bag }),
  skippable: (step) => step.kind === 'probar' || step.kind === 'registrar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const repeats = step.light?.repeats ?? 3;
    if (step.kind === 'probar') return local.trial >= (step.light?.trials ?? 1) || local.skipped;
    if (step.kind === 'registrar') return LIGHT_ROWS.every((row) => Array.from({ length: repeats }, (_, i) => i).every((i) => bagOf(ctx).cells?.[key(row, i)])) || local.skipped;
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, local, patch } = ctx;
    const setup = step.light;
    if (!setup) return null;
    const c = CIENCIA_COPY;
    const bag = bagOf(ctx);
    const cells = bag.cells ?? {};
    const on = !!bag.on;
    const repeats = setup.repeats ?? 3;
    const objectName = c.light.object[setup.object][lang];
    const headers = Array.from({ length: repeats }, (_, i) => c.light.time(i + 1)[lang]);
    const rowLabel = (row: LightState) => (row === 'on' ? c.light.stateOn : c.light.stateOff)[lang];
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });
    const box = (
      <View style={fstyles.stack}>
        <LightBox art={CIENCIA_LUZ} object={setup.object} on={on} width={visualWidth} label={c.light.boxLabel(objectName, on)[lang]} />
        <View style={fstyles.buttonsRow}>
          <View style={[fstyles.badge, { backgroundColor: on ? '#fff1b8' : '#e3e7f0' }]}>
            <Text style={fstyles.badgeText}>{(on ? c.light.stateOn : c.light.stateOff)[lang]}</Text>
          </View>
          <Text style={fstyles.helper}>{(on ? c.light.clear : c.light.silhouette)[lang]}</Text>
        </View>
      </View>
    );

    if (step.kind === 'probar') {
      const trials = setup.trials ?? 1;
      return (
        <View style={fstyles.stack}>
          {box}
          <View style={fstyles.buttonsRow}>
            <Button label={(on ? c.light.switchOff : c.light.switchOn)[lang]} large onPress={() => patch({ trial: local.trial + 1, bag: { ...bag, on: !on } })} />
          </View>
          <Text style={fstyles.helper}>{local.trial === 0 ? c.light.flipPrompt[lang] : local.trial >= trials ? c.light.flippedDone[lang] : c.light.flipped(local.trial, trials)[lang]}</Text>
        </View>
      );
    }

    if (step.kind === 'registrar') {
      const look = bag.look;
      const all = LIGHT_ROWS.every((row) => Array.from({ length: repeats }, (_, i) => i).every((i) => cells[key(row, i)]));
      const answer = (said: Sighting) => {
        if (!look) return;
        if (said === sighting(look.row)) set({ cells: { ...cells, [key(look.row, look.col)]: said }, look: undefined, missed: false });
        else set({ missed: true });
      };
      return (
        <View style={fstyles.stack}>
          {box}
          <ResultTable
            title={c.light.tableTitle[lang]}
            headers={headers}
            emptyLabel={c.table.empty[lang]}
            rows={LIGHT_ROWS.map((row) => ({ id: row, label: rowLabel(row), cells: headers.map((_, i) => ({ text: cells[key(row, i)] ? (cells[key(row, i)] === 'distingo' ? c.light.sees : c.light.cannot)[lang] : null })) }))}
            onCellPress={(rowId, col) => set({ look: { row: rowId as LightState, col }, on: rowId === 'on', missed: false })}
            active={look ? { rowId: look.row, col: look.col } : undefined}
          />
          <Text style={fstyles.helper}>{look ? c.light.nowLooking(rowLabel(look.row), look.col + 1)[lang] : all ? c.light.tableComplete[lang] : c.light.pick[lang]}</Text>
          {look ? (
            <View style={fstyles.buttonsRow}>
              <Button label={c.light.sees[lang]} onPress={() => answer('distingo')} />
              <Button label={c.light.cannot[lang]} variant="secondary" onPress={() => answer('noDistingo')} />
            </View>
          ) : null}
          {bag.missed ? (
            <View style={fstyles.reveal}>
              <Text style={fstyles.revealText}>{c.light.lookAgain[lang]}</Text>
            </View>
          ) : null}
          <Badge text={c.badge.practiceData[lang]} />
        </View>
      );
    }

    if (setup.static) {
      return (
        <View style={fstyles.stack}>
          {box}
          <ResultTable
            title={c.light.tableTitle[lang]}
            headers={headers}
            emptyLabel={c.table.empty[lang]}
            rows={LIGHT_ROWS.map((row) => ({ id: row, label: rowLabel(row), cells: sightingsFor(row, repeats).map((s) => ({ text: (s === 'distingo' ? c.light.sees : c.light.cannot)[lang] })) }))}
          />
          <Badge text={c.badge.practiceData[lang]} />
        </View>
      );
    }
    return box;
  },
};

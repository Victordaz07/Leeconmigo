import { Text, View } from 'react-native';
import { LADERA_DATASETS, type LabSetup } from '@lee-conmigo/science-content';
import { CIENCIA_COPY, chartDescription } from '@lee-conmigo/ui-core';
import { BarChart, Button, DataTable, LabBoard, Scale, type Bar } from '@lee-conmigo/ui-native';
import { CIENCIA_PROPS } from '../art';
import { gramsFor, MAX_GRAMS, trayViews, trialsFor, type Side } from '../lab-model';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

const SIDES: Side[] = ['a', 'b'];
const BAR_COLOR: Record<Side, string> = { a: '#c9824f', b: '#5aa66b' };
const ART = { bandeja: CIENCIA_PROPS.bandeja, tierra: CIENCIA_PROPS.tierra, cobertura: CIENCIA_PROPS.cobertura, regadera: CIENCIA_PROPS.regadera };

type Table = Record<Side, (number | null)[]>;
type Bars = Record<string, number | null>;
const EMPTY_TABLE: Table = { a: [null, null, null], b: [null, null, null] };
const barKeys = SIDES.flatMap((s) => [0, 1, 2].map((i) => `${s}${i}`));

/** El laboratorio de erosión (bandejas A y B). La tabla de pesadas y la gráfica cruzan de un paso al siguiente. */
function parts(ctx: StepCtx) {
  const { unit, step, task, done, fix, local, shared } = ctx;
  const table = (shared.erosionTable as Table | undefined) ?? EMPTY_TABLE;
  const bars = (shared.erosionBars as Bars | undefined) ?? {};
  const fixedLabs = unit.sessions.flatMap((s) => s.steps).find((s) => s.labFixed)?.labFixed;
  const fixedLab: LabSetup | undefined = fixedLabs ? fixedLabs[fix ?? 'pendiente'] ?? fixedLabs.pendiente : undefined;
  // En la evidencia final se ve la prueba justa que el niño arregló.
  const lab: LabSetup | undefined = step.kind === 'arreglar' ? (task && done[task.id] === 'ok' && fixedLab ? fixedLab : step.lab) : step.choiceByFix && fixedLab ? fixedLab : step.lab;
  const trials = lab?.trials ?? 1;
  const staticLab = !!lab?.static;
  const effTable = (side: Side, col: number): number | null => table[side][col] ?? (lab && (staticLab || step.kind === 'graficar') ? gramsFor(lab, side, col) : null);
  const flagged = lab && step.kind === 'graficar' ? barKeys.filter((k) => bars[k] != null && Math.abs((bars[k] as number) - (effTable(k[0] as Side, Number(k[1])) ?? 0)) > 1) : [];
  return { table, bars, lab, trials, staticLab, effTable, flagged, local };
}

export const erosionFamily: Family = {
  id: 'erosion',
  owns: (step) => !!step.lab || !!step.labFixed,
  skippable: (step) => step.kind === 'probar' || step.kind === 'registrar' || step.kind === 'graficar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const { table, bars, trials, flagged } = parts(ctx);
    if (step.kind === 'probar') return local.trial >= trials || local.skipped;
    if (step.kind === 'registrar') return SIDES.every((s) => table[s].every((v) => v !== null)) || local.skipped;
    if (step.kind === 'graficar') return (barKeys.every((k) => bars[k] != null) && flagged.length === 0) || local.skipped;
    return true;
  },
  visual: (ctx) => {
    const { step, task, lang, calm, visualWidth, done, local, patch, setShared, markTriedAgain, timer } = ctx;
    const c = CIENCIA_COPY;
    const { table, bars, lab, trials, staticLab, effTable, flagged } = parts(ctx);
    if (!lab) return null;
    const unitLabel = LADERA_DATASETS.base.unit[lang];
    const headers = [1, 2, 3].map((n) => c.trial(n)[lang]);
    const rowsFor = (l: LabSetup, own: boolean) =>
      SIDES.map((side) => ({
        id: side,
        label: `${c.tray[side === 'a' ? 'A' : 'B'][lang]}: ${c.cover[l[side].cover][lang]}, ${c.slope[l[side].slope][lang].toLowerCase()}`,
        cells: [0, 1, 2].map((col) => (own ? table[side][col] : trialsFor(l, side)[col])),
      }));
    const weigh = (side: string, col: number) => patch({ weighing: { side: side as Side, col } });
    const labPiece = (l: LabSetup, shown: number) => (
      <View style={fstyles.stack}>
        <LabBoard trays={trayViews(l, shown, lang)} art={ART} width={visualWidth} watering={local.watering} calm={calm} />
        {l.static ? (
          <>
            <DataTable title={c.table.title[lang]} headers={headers} rows={rowsFor(l, false)} unit={unitLabel} emptyLabel={c.table.empty[lang]} />
            <Badge text={c.badge.practiceData[lang]} />
          </>
        ) : null}
      </View>
    );

    if (step.kind === 'probar') {
      const water = () => {
        if (local.watering) return;
        const again = local.trial >= trials;
        if (again) markTriedAgain();
        const next = again ? 1 : local.trial + 1;
        if (calm) return patch({ trial: next });
        patch({ watering: true });
        timer.current = setTimeout(() => patch({ watering: false, trial: next }), 1200);
      };
      return (
        <View style={fstyles.stack}>
          {labPiece(lab, local.trial)}
          <View style={fstyles.buttonsRow}>
            <Button label={(local.trial === 0 ? c.button.water : c.button.waterAgain)[lang]} onPress={water} disabled={local.watering} />
            <Text style={fstyles.helper}>{local.trial === 0 ? c.screen.rainPrompt[lang] : local.trial >= trials ? c.screen.trialsDone[lang] : c.trialOf(local.trial, trials)[lang]}</Text>
          </View>
        </View>
      );
    }
    if (step.kind === 'registrar') {
      const w = local.weighing;
      const allWeighed = SIDES.every((s) => table[s].every((v) => v !== null));
      const writeDown = () => {
        if (!w) return;
        setShared('erosionTable', { ...table, [w.side]: table[w.side].map((v, i) => (i === w.col ? gramsFor(lab, w.side, w.col) : v)) });
        patch({ weighing: undefined });
      };
      return (
        <View style={fstyles.stack}>
          <LabBoard trays={trayViews(lab, 3, lang)} art={ART} width={visualWidth} calm={calm} />
          <View style={fstyles.weighRow}>
            <Scale title={c.scale.title[lang]} grams={w ? gramsFor(lab, w.side, w.col) : null} unit="g" />
            <View style={fstyles.flex}>
              <Text style={fstyles.helper}>{w ? c.screen.weighing(c.tray[w.side === 'a' ? 'A' : 'B'][lang], w.col + 1)[lang] : allWeighed ? c.screen.tableDone[lang] : c.screen.weighPrompt[lang]}</Text>
              {w ? (
                <View style={fstyles.alignStart}>
                  <Button label={c.button.writeDown[lang]} onPress={writeDown} />
                </View>
              ) : null}
            </View>
          </View>
          <DataTable title={c.table.title[lang]} headers={headers} rows={rowsFor(lab, true)} unit={unitLabel} emptyLabel={c.table.empty[lang]} onCellPress={weigh} active={w ? { rowId: w.side, col: w.col } : undefined} />
          <Badge text={c.badge.practiceData[lang]} />
        </View>
      );
    }
    if (step.kind === 'graficar') {
      const barList: Bar[] = barKeys.map((k) => ({ id: k, label: `${k[0].toUpperCase()}${Number(k[1]) + 1}`, color: BAR_COLOR[k[0] as Side], value: bars[k] ?? null }));
      const rows = rowsFor(lab, false).map((r) => ({ label: r.label, values: r.cells.map((v, i) => v ?? effTable(r.id as Side, i) ?? 0) }));
      const allSet = barKeys.every((k) => bars[k] != null);
      return (
        <View style={fstyles.stack}>
          <DataTable title={c.table.title[lang]} headers={headers} rows={rowsFor(lab, false).map((r) => ({ ...r, cells: r.cells.map((v, i) => effTable(r.id as Side, i) ?? v) }))} unit="g" emptyLabel={c.table.empty[lang]} />
          <BarChart title={c.chart.title[lang]} axisLabel={c.chart.axis[lang]} bars={barList} max={MAX_GRAMS} width={visualWidth} onSet={(id, g) => setShared('erosionBars', { ...bars, [id]: g })} description={chartDescription(rows, lang)} flagged={flagged} />
          <Text style={fstyles.helper}>{allSet ? (flagged.length ? c.chart.differs[lang] : c.chart.matches[lang]) : `${c.screen.chartPrompt[lang]} ${c.screen.chartHelp[lang]}`}</Text>
          <Badge text={c.badge.practiceData[lang]} />
        </View>
      );
    }
    return (
      <View style={fstyles.stack}>
        {step.kind === 'arreglar' && task && done[task.id] === 'ok' ? <Text style={fstyles.helper}>{c.screen.fixedPrompt[lang]}</Text> : null}
        {labPiece(lab, staticLab ? 3 : local.trial)}
      </View>
    );
  },
};

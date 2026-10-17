import { Text, View } from 'react-native';
import { designLabel, LAYER_IDS, LAYER_NAME, MAX_LAYERS, meetsCriterion, MINUTES, riseAt10, temperatures, type Layer } from '@lee-conmigo/science-content';
import { CIENCIA_COPY, type CienciaLang } from '@lee-conmigo/ui-core';
import { Button, DataTable, LineChart, ThermalBench, type LineSeries } from '@lee-conmigo/ui-native';
import { CIENCIA_TERMICO } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: la funda que se está armando, los diseños ya probados y el avance de la medición. */
interface Bag {
  layers?: Layer[];
  /** Diseños probados (cada uno como sus capas); el del final es el último que se midió. */
  tested?: Layer[][];
  /** Minuto que se está leyendo ahora (0, 1, 2 = 0, 5, 10 min); `null` = sin medir. */
  reading?: number | null;
  running?: boolean;
  /** Puntos que trazó el niño para el vaso sin funda. */
  plot?: (number | null)[];
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const COLORS = ['#7c83a0', '#1e80e8', '#22a95c', '#e8662b', '#6a52d9', '#f0a020'];
const keyOf = (layers: readonly Layer[]) => (layers.length ? layers.join('+') : 'control');
const unique = (designs: Layer[][]) => designs.filter((d, i) => designs.findIndex((x) => keyOf(x) === keyOf(d)) === i);

/** La funda aislante (C6-U04): armar una funda, medir 10 minutos, graficar y comparar con un criterio. */
export const thermalFamily: Family = {
  id: 'thermal',
  owns: (step) => !!step.thermal,
  initial: () => ({ bag: { layers: [], tested: [], reading: null, running: false, plot: [null, null, null] } satisfies Bag }),
  skippable: (step) => !!step.thermal?.build || !!step.thermal?.plot,
  ready: (ctx) => {
    const { step, local } = ctx;
    const t = step.thermal;
    const bag = bagOf(ctx);
    if (!t) return true;
    if (t.build) {
      const tested = unique(bag.tested ?? []);
      const enough = tested.length >= (t.build.trials ?? 1);
      const meets = !t.build.criterion || tested.some((d) => meetsCriterion(d));
      return (enough && meets) || local.skipped;
    }
    if (t.plot) {
      const want = temperatures([]);
      return (bag.plot ?? []).every((v, i) => v !== null && Math.abs((v as number) - want[i]) <= 1) || local.skipped;
    }
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, local, patch, calm, timer } = ctx;
    const t = step.thermal;
    if (!t) return null;
    const c = CIENCIA_COPY;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });
    const layers = bag.layers ?? [];
    const tested = unique(bag.tested ?? []);
    const options = LAYER_IDS.map((id) => ({ id, label: LAYER_NAME[id][lang] }));
    const columns = MINUTES.map(String);
    const seriesOf = (designs: Layer[][], lang2: CienciaLang): LineSeries[] => designs.map((d, i) => ({ id: keyOf(d), label: designLabel(d, lang2), color: COLORS[i % COLORS.length], points: temperatures(d) }));
    const tableFor = (designs: Layer[][]) => (
      <DataTable
        title={c.thermal.tableTitle[lang]}
        headers={MINUTES.map((m) => c.thermal.minute(m)[lang])}
        rows={designs.map((d) => ({ id: keyOf(d), label: designLabel(d, lang), cells: temperatures(d) }))}
        unit="°C"
        emptyLabel={c.table.empty[lang]}
      />
    );
    const describe = (designs: Layer[][]) => designs.map((d) => `${designLabel(d, lang)}: ${temperatures(d).join(', ')} °C.`).join(' ');

    // ---- constructor: armar, probar y comparar
    if (t.build) {
      const last = tested[tested.length - 1];
      const reading = bag.reading;
      const temps = last ? temperatures(last) : null;
      const shown = bag.running && reading !== null && reading !== undefined ? temps?.[reading] : last && !bag.running ? temps?.[2] : undefined;
      const measure = () => {
        if (bag.running) return;
        const design = [...layers];
        const done = () => set({ running: false, reading: 2, tested: [...(bag.tested ?? []), design] });
        if (calm) return done();
        set({ running: true, reading: 0, tested: [...(bag.tested ?? []), design] });
        timer.current = setTimeout(() => set({ running: true, reading: 1, tested: [...(bag.tested ?? []), design] }), 600);
        setTimeout(() => done(), 1200);
      };
      const trials = t.build.trials ?? 1;
      const series = seriesOf(unique([[], ...tested]), lang);
      const meets = last ? meetsCriterion(last) : false;
      return (
        <View style={fstyles.stack}>
          <ThermalBench
            art={CIENCIA_TERMICO}
            width={visualWidth}
            options={options}
            layers={layers}
            maxLayers={MAX_LAYERS}
            editable={!bag.running}
            onAdd={(id) => set({ layers: [...layers, id as Layer].slice(0, MAX_LAYERS) })}
            onRemove={(i) => set({ layers: layers.filter((_, k) => k !== i) })}
            reading={shown === undefined ? null : `${shown} °C`}
            readingLabel={reading !== null && reading !== undefined && bag.running ? c.thermal.minute(MINUTES[reading])[lang] : c.thermal.thermometer[lang]}
            addLabel={(n) => c.thermal.addLayer(n)[lang]}
            removeLabel={(n) => c.thermal.removeLayer(n)[lang]}
            emptyLabel={c.thermal.emptySlot[lang]}
            label={c.thermal.benchLabel(designLabel(layers, lang))[lang]}
          />
          <View style={fstyles.buttonsRow}>
            <Button label={(bag.running ? c.thermal.testing : c.thermal.test)[lang]} large disabled={!!bag.running} onPress={measure} />
            {layers.length ? <Button label={c.thermal.clear[lang]} variant="secondary" onPress={() => set({ layers: [] })} /> : null}
          </View>
          <Text style={fstyles.helper}>
            {!tested.length ? c.thermal.build[lang] : tested.length >= trials ? c.thermal.testedAll[lang] : c.thermal.tested(tested.length, trials)[lang]}
          </Text>
          {last && !bag.running && t.build.criterion ? (
            <View style={fstyles.reveal}>
              <Text style={fstyles.revealText}>{(meets ? c.thermal.meets(riseAt10(last)) : c.thermal.notYet(riseAt10(last)))[lang]}</Text>
            </View>
          ) : null}
          {t.build.criterion && tested.length >= trials && !tested.some((d) => meetsCriterion(d)) ? <Text style={fstyles.helper}>{c.thermal.needMeet[lang]}</Text> : null}
          <LineChart title={c.thermal.chartTitle[lang]} xLabel={c.thermal.xLabel[lang]} yLabel={c.thermal.yLabel[lang]} columns={columns} yMin={8} yMax={20} series={series} width={visualWidth} description={describe(unique([[], ...tested]))} />
          <Badge text={c.badge.practiceData[lang]} />
        </View>
      );
    }

    const designs = unique(t.show ?? []);

    // ---- graficar: el niño traza la curva del vaso sin funda con los datos de su tabla
    if (t.plot) {
      const want = temperatures([]);
      const plot = bag.plot ?? [null, null, null];
      const flagged = plot.map((v, i) => (v !== null && Math.abs((v as number) - want[i]) > 1 ? i : -1)).filter((i) => i >= 0);
      const all = plot.every((v) => v !== null);
      const ok = all && flagged.length === 0;
      const mine: LineSeries = { id: 'mine', label: c.thermal.plotSeries[lang], color: COLORS[0], points: plot };
      const others = ok ? seriesOf(designs.filter((d) => d.length > 0), lang).map((s, i) => ({ ...s, color: COLORS[i + 1] })) : [];
      return (
        <View style={fstyles.stack}>
          {tableFor(designs)}
          <LineChart
            title={c.thermal.chartTitle[lang]}
            xLabel={c.thermal.xLabel[lang]}
            yLabel={c.thermal.yLabel[lang]}
            columns={columns}
            yMin={8}
            yMax={20}
            series={[mine, ...others]}
            width={visualWidth}
            editableId="mine"
            onSet={(_, col, v) => set({ plot: plot.map((x, i) => (i === col ? v : x)) })}
            flagged={flagged}
            description={describe([[]])}
          />
          <Text style={fstyles.helper}>{all ? (ok ? c.thermal.plotMatches[lang] : c.thermal.plotDiffers[lang]) : c.thermal.plotPrompt[lang]}</Text>
          <Badge text={c.badge.practiceData[lang]} />
        </View>
      );
    }

    // ---- solo mostrar los diseños (tabla + gráfica)
    return (
      <View style={fstyles.stack}>
        {tableFor(designs)}
        <LineChart title={c.thermal.chartTitle[lang]} xLabel={c.thermal.xLabel[lang]} yLabel={c.thermal.yLabel[lang]} columns={columns} yMin={8} yMax={20} series={seriesOf(designs, lang)} width={visualWidth} description={describe(designs)} />
        <Badge text={c.badge.practiceData[lang]} />
      </View>
    );
  },
};

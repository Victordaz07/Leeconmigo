import { Image, Text, View } from 'react-native';
import { MECHANISM, SERIES_AXIS, SERIES_IDS, SERIES_NAME, SERIES_UNIT, SERIES_VALUES, TREND_TEXT, YEARS, trendOfSeries, type SeriesId } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, LineChart } from '@lee-conmigo/ui-native';
import { CIENCIA_CLIMA } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: las series que el estudiante agregó a la gráfica. */
interface Bag {
  added?: SeriesId[];
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const COLOR: Record<SeriesId, string> = { temp: '#e8662b', co2: '#6a52d9', sol: '#e8a317', volcanes: '#7c83a0' };
const COLUMNS = YEARS.map(String);

/** Las series de datos del clima (C6-U07): una gráfica por serie, con el eje propio de cada una, y la cadena del mecanismo del CO2. */
export const trendFamily: Family = {
  id: 'trend',
  owns: (step) => !!step.trend,
  initial: () => ({ bag: { added: [] } satisfies Bag }),
  skippable: (step) => step.kind === 'probar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const k = step.trend;
    const bag = bagOf(ctx);
    if (!k || step.kind !== 'probar' || k.view !== 'compare') return true;
    return (bag.added ?? []).length >= (k.trials ?? 1) || local.skipped;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, patch } = ctx;
    const k = step.trend;
    if (!k) return null;
    const t = CIENCIA_COPY.trend;
    const bag = bagOf(ctx);

    if (k.view === 'mechanism') {
      return (
        <View style={fstyles.stack}>
          <Image source={CIENCIA_CLIMA.glaciar} style={{ width: Math.min(140, visualWidth), height: Math.min(140, visualWidth), alignSelf: 'center' }} resizeMode="contain" accessible={false} />
          <Text style={fstyles.helper}>{t.mechanismTitle[lang]}</Text>
          {MECHANISM.map((m, i) => (
            <View key={i} style={fstyles.reveal}>
              <Text style={fstyles.revealText}>{`${i + 1}. ${m[lang]}`}</Text>
            </View>
          ))}
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    const base = k.series ?? [];
    const added = bag.added ?? [];
    const shown: SeriesId[] = k.view === 'compare' ? [...base, ...added.filter((id) => !base.includes(id))] : base;
    const options = SERIES_IDS.filter((id) => !base.includes(id));
    const trials = k.trials ?? 1;
    return (
      <View style={fstyles.stack}>
        {k.view === 'compare' ? (
          <View style={fstyles.buttonsRow}>
            {options.map((id) => (
              <Button key={id} label={SERIES_NAME[id][lang]} variant={added.includes(id) ? 'primary' : 'secondary'} onPress={() => patch({ bag: { ...bag, added: added.includes(id) ? added : [...added, id] } })} />
            ))}
          </View>
        ) : null}
        {shown.map((id) => {
          const axis = SERIES_AXIS[id];
          return (
            <LineChart
              key={id}
              title={SERIES_NAME[id][lang]}
              xLabel={t.xLabel[lang]}
              yLabel={SERIES_UNIT[id][lang]}
              columns={COLUMNS}
              yMin={axis.min}
              yMax={axis.max}
              tick={axis.tick}
              series={[{ id, label: SERIES_NAME[id][lang], color: COLOR[id], points: [...SERIES_VALUES[id]] }]}
              width={visualWidth}
              height={170}
              description={t.description(SERIES_NAME[id][lang], TREND_TEXT[trendOfSeries(id)][lang])[lang]}
            />
          );
        })}
        {k.view === 'compare' ? <Text style={fstyles.helper}>{(added.length === 0 ? t.addPick : added.length >= trials ? t.done : t.added(added.length, trials))[lang]}</Text> : null}
        {k.view === 'compare' ? added.map((id) => <Text key={id} style={fstyles.helper}>{t.look(SERIES_NAME[id][lang], TREND_TEXT[trendOfSeries(id)][lang])[lang]}</Text>) : null}
        <Text style={fstyles.helper}>{t.practiceNote[lang]}</Text>
      </View>
    );
  },
};

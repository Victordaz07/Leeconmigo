import { Text, View } from 'react-native';
import {
  AFTERNOON_C,
  MAX_RAIN_DAYS,
  MEASURE_NAME,
  MEASURES,
  RAIN_DAYS,
  RAIN_TICK,
  SEASONS,
  SEASON_NAME,
  TOWNS,
  TOWN_NAME,
  barsComplete,
  barsOff,
  valueOf,
  type Measure,
  type Season,
  type Town,
} from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { BarChart, ResultTable, type Bar } from '@lee-conmigo/ui-native';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: las barras que dibujó el niño y las casillas que descubrió. */
interface Bag {
  bars?: Partial<Record<Season, number>>;
  revealed?: string[];
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const BAR_COLOR: Record<Town, string> = { azul: '#3a78c2', seco: '#d9822b', alto: '#6a8f5b' };

/** La mesa de datos del tiempo y el clima (C3-U07): tabla del registro, barras de lluvia y comparación de tres pueblos. */
export const climateFamily: Family = {
  id: 'climate',
  owns: (step) => !!step.climate,
  initial: () => ({ bag: { bars: {}, revealed: [] } satisfies Bag }),
  skippable: (step) => step.kind === 'probar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const k = step.climate;
    const bag = bagOf(ctx);
    if (!k || step.kind !== 'probar') return true;
    if (k.view === 'reveal') return (bag.revealed ?? []).length >= (k.trials ?? 1) || local.skipped;
    if (k.view === 'bars' && !k.static && k.town) return (barsComplete(bag.bars ?? {}) && barsOff(k.town, bag.bars ?? {}).length === 0) || local.skipped;
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, patch } = ctx;
    const k = step.climate;
    if (!k) return null;
    const t = CIENCIA_COPY.climate;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });
    const cell = (town: Town, season: Season, m: Measure) => (m === 'lluvia' ? t.days(RAIN_DAYS[town][season]) : t.degrees(AFTERNOON_C[town][season]))[lang];

    const townTable = (town: Town, hidden: boolean) => {
      const revealed = bag.revealed ?? [];
      // Tapada solo la temperatura (la columna 1): los días con lluvia se ven siempre.
      const show = (season: Season, col: number) => !hidden || col === 0 || revealed.includes(`${season}:${col}`);
      return (
        <ResultTable
          title={t.tableTitle(TOWN_NAME[town][lang])[lang]}
          headers={[t.colRain[lang], t.colTemp[lang]]}
          emptyLabel={CIENCIA_COPY.table.empty[lang]}
          rows={SEASONS.map((s) => ({ id: s, label: SEASON_NAME[s][lang], cells: MEASURES.map((m, col) => ({ text: show(s, col) ? cell(town, s, m) : null })) }))}
          onCellPress={hidden ? (rowId, col) => (revealed.includes(`${rowId}:${col}`) ? undefined : set({ revealed: [...revealed, `${rowId}:${col}`] })) : undefined}
        />
      );
    };

    if (k.view === 'compare') {
      const measures = k.measure ? [k.measure] : [...MEASURES];
      return (
        <View style={fstyles.stack}>
          {measures.map((m) => (
            <ResultTable
              key={m}
              title={MEASURE_NAME[m][lang]}
              headers={SEASONS.map((s) => SEASON_NAME[s][lang])}
              emptyLabel={CIENCIA_COPY.table.empty[lang]}
              rows={TOWNS.map((town) => ({ id: town, label: TOWN_NAME[town][lang], cells: SEASONS.map((s) => ({ text: String(valueOf(town, s, m)) })) }))}
            />
          ))}
          <Text style={fstyles.helper}>{t.perMonth[lang]}</Text>
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    const town = k.town as Town;
    if (k.view === 'table' || k.view === 'reveal') {
      const revealed = bag.revealed ?? [];
      const trials = k.trials ?? 1;
      return (
        <View style={fstyles.stack}>
          {townTable(town, k.view === 'reveal')}
          {k.view === 'reveal' ? <Text style={fstyles.helper}>{revealed.length === 0 ? t.revealPick[lang] : revealed.length >= trials ? t.revealDone[lang] : t.revealCount(revealed.length, trials)[lang]}</Text> : null}
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    // barras de días con lluvia: ya hechas (static) o las dibuja el niño
    const interactive = !k.static;
    const values: Partial<Record<Season, number>> = interactive ? (bag.bars ?? {}) : RAIN_DAYS[town];
    const bars: Bar[] = SEASONS.map((s) => ({ id: s, label: SEASON_NAME[s][lang], color: BAR_COLOR[town], value: values[s] ?? null }));
    const off = interactive ? barsOff(town, values) : [];
    const done = interactive && barsComplete(values);
    const description = t.chartDescription(
      TOWN_NAME[town][lang],
      SEASONS.map((s) => `${SEASON_NAME[s][lang]} ${values[s] ?? '—'}`).join(', '),
    )[lang];
    return (
      <View style={fstyles.stack}>
        {interactive ? (
          <View style={fstyles.buttonsRow}>
            {SEASONS.map((s) => (
              <Badge key={s} text={`${SEASON_NAME[s][lang]}: ${t.days(RAIN_DAYS[town][s])[lang]}`} />
            ))}
          </View>
        ) : null}
        <BarChart
          title={t.chartTitle(TOWN_NAME[town][lang])[lang]}
          axisLabel={t.chartAxis[lang]}
          bars={bars}
          max={MAX_RAIN_DAYS}
          step={RAIN_TICK}
          width={visualWidth}
          onSet={interactive ? (id, n) => set({ bars: { ...(bag.bars ?? {}), [id]: n } }) : undefined}
          description={description}
          flagged={off}
        />
        {interactive ? <Text style={fstyles.helper}>{done ? (off.length ? t.chartDiffers[lang] : t.chartMatches[lang]) : t.chartPrompt[lang]}</Text> : null}
        <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
      </View>
    );
  },
};

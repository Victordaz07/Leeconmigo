import { View, Text } from 'react-native';
import {
  AIR_COUNT,
  DOTS_TEXT,
  DYE_COUNT,
  DYE_STEPS,
  FACT_TEXT,
  PHENOMENA,
  PHENOMENON_NAME,
  SYRINGE_GAP,
  SYRINGE_POSITIONS,
  airDots,
  soluteDots,
  waterDots,
  type DyeStep,
  type SyringePos,
} from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, ParticleBench, ResultTable, type ParticleGroup } from '@lee-conmigo/ui-native';
import { CIENCIA_COMUN, CIENCIA_INVISIBLE } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: el tiempo que va y cuántas veces lo dejó pasar, o la posición del émbolo y las que ya probó. */
interface Bag {
  t?: DyeStep;
  advances?: number;
  pos?: SyringePos;
  seen?: SyringePos[];
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;

const WATER = '#9cc3ea';
const DYE = '#1f5fd0';
const SALT = '#d9822b';
const AIR = '#6c7a99';

/** El modelo de puntitos (C5-U01): colorante y sal que se reparten en el agua, aire que se aprieta en una jeringa. */
export const particlesFamily: Family = {
  id: 'particles',
  owns: (step) => !!step.particle,
  initial: () => ({ bag: { t: 0, advances: 0, pos: 3, seen: [] } satisfies Bag }),
  skippable: (step) => step.kind === 'probar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const k = step.particle;
    const bag = bagOf(ctx);
    if (!k || step.kind !== 'probar' || k.static) return true;
    const n = k.view === 'syringe' ? (bag.seen ?? []).length : (bag.advances ?? 0);
    return n >= (k.trials ?? 1) || local.skipped;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, patch } = ctx;
    const k = step.particle;
    if (!k) return null;
    const t = CIENCIA_COPY.particle;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });

    if (k.view === 'table') {
      return (
        <View style={fstyles.stack}>
          <ResultTable
            title={t.tableTitle[lang]}
            headers={[t.colSeen[lang], t.colDots[lang]]}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={PHENOMENA.map((f) => ({ id: f, label: PHENOMENON_NAME[f][lang], cells: [{ text: FACT_TEXT[f][lang] }, { text: DOTS_TEXT[f][lang] }] }))}
          />
          <Text style={fstyles.helper}>{t.drawing[lang]}</Text>
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    const showDots = k.dots !== false;
    const interactive = !k.static;

    if (k.view === 'syringe') {
      const pos: SyringePos = interactive ? (bag.pos ?? 3) : (k.pos ?? 3);
      const gap = SYRINGE_GAP[pos];
      const groups: ParticleGroup[] = [{ id: 'aire', dots: airDots(pos), color: AIR, radius: 5, label: t.air[lang] }];
      const label = { 3: t.loose, 2: t.little, 1: t.full } as const;
      const seen = bag.seen ?? [];
      const trials = k.trials ?? 1;
      return (
        <View style={fstyles.stack}>
          <ParticleBench image={CIENCIA_INVISIBLE.jeringa} width={visualWidth} showDots={showDots} groups={groups} plunger={0.06 + 0.88 * gap + 0.05} panelTitle={t.panelTitle[lang]} label={t.boardLabel(t.air[lang].toLowerCase())[lang]} />
          {interactive ? (
            <View style={fstyles.buttonsRow}>
              {SYRINGE_POSITIONS.map((p) => (
                <Button key={p} label={label[p][lang]} variant={p === pos ? 'primary' : 'secondary'} onPress={() => set({ pos: p, seen: p === 3 || seen.includes(p) ? seen : [...seen, p] })} />
              ))}
            </View>
          ) : null}
          {interactive && step.kind === 'probar' ? <Text style={fstyles.helper}>{(seen.length >= trials ? t.done : t.posCounted(seen.length, trials))[lang]}</Text> : null}
          {showDots ? <Text style={fstyles.helper}>{t.sameDots(AIR_COUNT)[lang]}</Text> : null}
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    // dye / salt: puntitos de colorante o de sal entre los del agua, y el tiempo que pasa
    const step4 = (interactive ? (bag.t ?? 0) : (k.step ?? 0)) as DyeStep;
    const salt = k.view === 'salt';
    const groups: ParticleGroup[] = [
      { id: 'agua', dots: waterDots(), color: WATER, radius: 4, label: t.water[lang] },
      { id: 'soluto', dots: soluteDots(step4), color: salt ? SALT : DYE, radius: 5.5, label: (salt ? t.salt : t.dye)[lang] },
    ];
    // El dibujo del colorante en el vaso solo tiene la nube a medio repartir: al final se usa el vaso de agua con un tinte parejo.
    const spread = !salt && step4 >= 3;
    const image = salt || step4 === 0 || spread ? CIENCIA_COMUN.vasoAgua : CIENCIA_INVISIBLE.vasoColorante;
    const tint = spread ? { color: DYE, opacity: step4 === 3 ? 0.16 : 0.26 } : undefined;
    const last = DYE_STEPS[DYE_STEPS.length - 1];
    const advances = bag.advances ?? 0;
    const trials = k.trials ?? 1;
    return (
      <View style={fstyles.stack}>
        <ParticleBench image={image} width={visualWidth} showDots={showDots} groups={groups} tint={tint} panelTitle={t.panelTitle[lang]} label={t.boardLabel((salt ? t.salt : t.dye)[lang].toLowerCase())[lang]} />
        {interactive ? (
          <View style={fstyles.buttonsRow}>
            <Button label={t.passTime[lang]} disabled={step4 >= last} onPress={() => set({ t: Math.min(last, step4 + 1) as DyeStep, advances: advances + 1 })} />
            <Button label={t.startOver[lang]} variant="secondary" onPress={() => set({ t: 0 })} />
          </View>
        ) : null}
        {interactive ? <Text style={fstyles.helper}>{`${t.timeStep(step4, last)[lang]} · ${(advances >= trials ? t.done : t.timeCounted(advances, trials))[lang]}`}</Text> : null}
        {showDots ? <Text style={fstyles.helper}>{t.sameDots(DYE_COUNT)[lang]}</Text> : null}
        <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
      </View>
    );
  },
};

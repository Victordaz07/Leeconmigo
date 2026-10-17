import { Text, View } from 'react-native';
import { VIB_ACTION_NAME, VIB_OBJECTS, VIB_OBJECT_NAME, stateOf, stateText, type VibAction, type VibObject } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { Button, ResultTable, VibrationBench } from '@lee-conmigo/ui-native';
import { CIENCIA_VIBRACION } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: el objeto, lo último que se hizo con él y las acciones distintas ya probadas. */
interface Bag {
  object?: VibObject;
  action?: VibAction;
  tried?: string[];
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const ACTIONS: VibAction[] = ['golpear', 'sujetar', 'voz'];

/** La mesa de vibraciones (C1-U01): golpear, sujetar o hablar cerca de un objeto, y la tabla de lo que pasó con cada uno. */
export const vibrationFamily: Family = {
  id: 'vibration',
  owns: (step) => !!step.vibration,
  initial: (step) => ({ bag: { object: step.vibration?.object ?? step.vibration?.objects?.[0] ?? 'regla', action: step.vibration?.action ?? 'quieta', tried: [] } satisfies Bag }),
  skippable: (step) => step.kind === 'probar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const k = step.vibration;
    const bag = bagOf(ctx);
    if (!k || step.kind !== 'probar' || k.static || k.view !== 'bench') return true;
    return (bag.tried ?? []).length >= (k.trials ?? 1) || local.skipped;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, calm, patch } = ctx;
    const k = step.vibration;
    if (!k) return null;
    const c = CIENCIA_COPY.vibration;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });

    if (k.view === 'table') {
      return (
        <View style={fstyles.stack}>
          <ResultTable
            title={c.tableTitle[lang]}
            headers={ACTIONS.map((a) => VIB_ACTION_NAME[a][lang])}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={VIB_OBJECTS.map((o) => ({ id: o, label: VIB_OBJECT_NAME[o][lang], cells: ACTIONS.map((a) => ({ text: stateText(o, a)[lang] })) }))}
          />
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    const interactive = !k.static;
    const object = (interactive ? bag.object : k.object) ?? 'regla';
    const action = (interactive ? bag.action : k.action) ?? 'quieta';
    const s = stateOf(object, action);
    const choices = k.objects && k.objects.length > 1 ? k.objects : [];
    const tried = bag.tried ?? [];
    const trials = k.trials ?? 1;
    const act = (a: VibAction) => set({ action: a, tried: tried.includes(`${object}:${a}`) ? tried : [...tried, `${object}:${a}`] });
    return (
      <View style={fstyles.stack}>
        <VibrationBench
          image={CIENCIA_VIBRACION[object]}
          width={visualWidth}
          moves={s.moves}
          sound={s.sound}
          voice={action === 'voz'}
          rice={object === 'tambor'}
          jumps={s.riceJumps}
          calm={calm}
          caption={stateText(object, action)[lang]}
          label={c.benchLabel(VIB_OBJECT_NAME[object][lang].toLowerCase())[lang]}
        />
        {interactive && choices.length ? (
          <View style={fstyles.buttonsRow}>
            {choices.map((o) => (
              <Button key={o} label={VIB_OBJECT_NAME[o][lang]} variant={o === object ? 'primary' : 'secondary'} onPress={() => set({ object: o, action: 'quieta' })} />
            ))}
          </View>
        ) : null}
        {interactive ? (
          <View style={fstyles.buttonsRow}>
            {ACTIONS.map((a) => (
              <Button key={a} label={VIB_ACTION_NAME[a][lang]} variant={a === action ? 'primary' : 'secondary'} onPress={() => act(a)} />
            ))}
          </View>
        ) : null}
        {interactive && step.kind === 'probar' ? <Text style={fstyles.helper}>{(tried.length === 0 ? c.pickAction : tried.length >= trials ? c.done : c.counted(tried.length, trials))[lang]}</Text> : null}
        <Text style={fstyles.helper}>{c.safe[lang]}</Text>
      </View>
    );
  },
};

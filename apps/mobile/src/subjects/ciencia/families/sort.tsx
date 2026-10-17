import { Text, View } from 'react-native';
import { MATERIAL_OF, SORT_OBJECT_NAME, SORT_PROP_NAME, PROP_VALUES, SORT_OBJECTS, SORT_PROPS, VALUE_TEXT, propertyOf, type SortObject, type SortProp } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { ResultTable, SortBench } from '@lee-conmigo/ui-native';
import { CIENCIA_CLASIFICAR } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: objeto elegido y en qué grupo puso cada objeto. */
interface Bag {
  selected?: SortObject | null;
  placed?: Record<string, string>;
  missed?: boolean;
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Mirar con la lupa y agrupar por una propiedad (C2-U01). */
export const sortFamily: Family = {
  id: 'sort',
  owns: (step) => !!step.sort,
  initial: (step) => ({ bag: { selected: step.sort?.object ?? null, placed: step.sort?.static && step.sort.view === 'sort' ? Object.fromEntries(SORT_OBJECTS.map((o) => [o, propertyOf(o, step.sort!.prop!)])) : {}, missed: false } satisfies Bag }),
  skippable: (step) => step.kind === 'probar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const bag = bagOf(ctx);
    if (!step.sort) return true;
    if (step.kind === 'probar' && step.sort.view === 'sort') return SORT_OBJECTS.every((o) => bag.placed?.[o] !== undefined) || local.skipped;
    return true;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, local, patch } = ctx;
    const k = step.sort;
    if (!k) return null;
    const c = CIENCIA_COPY.sort;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });
    const name = (o: SortObject) => cap(SORT_OBJECT_NAME[o][lang]);
    const lensOf = (o: SortObject) => {
      const same = MATERIAL_OF[o][lang] === SORT_OBJECT_NAME[o][lang];
      return `${c.lens(same ? SORT_OBJECT_NAME[o][lang] : `${SORT_OBJECT_NAME[o][lang]} ${c.made(MATERIAL_OF[o][lang])[lang]}`)[lang]} — ${SORT_PROPS.map((p) => VALUE_TEXT[propertyOf(o, p)][lang]).join(' · ')}`;
    };
    const allTiles = SORT_OBJECTS.map((o) => ({ id: o, label: name(o) }));

    // ---- una tabla de propiedades
    if (k.view === 'table') {
      const props: SortProp[] = k.props ?? [...SORT_PROPS];
      return (
        <View style={fstyles.stack}>
          <ResultTable
            title={c.tableTitle[lang]}
            headers={props.map((p) => SORT_PROP_NAME[p][lang])}
            emptyLabel={CIENCIA_COPY.table.empty[lang]}
            rows={SORT_OBJECTS.map((o) => ({ id: o, label: `${name(o)} (${MATERIAL_OF[o][lang]})`, cells: props.map((p) => ({ text: cap(VALUE_TEXT[propertyOf(o, p)][lang]) })) }))}
          />
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    // ---- mirar un objeto con la lupa
    if (k.view === 'look') {
      const selected = bag.selected ?? null;
      const visible = !k.hidden && selected !== null;
      return (
        <View style={fstyles.stack}>
          <SortBench
            art={CIENCIA_CLASIFICAR}
            width={visualWidth}
            tiles={allTiles}
            selected={selected}
            onSelect={k.static || k.hidden ? undefined : (id) => set({ selected: id as SortObject })}
            lensText={visible ? lensOf(selected as SortObject) : undefined}
            label={selected ? name(selected) : c.pickObject[lang]}
          />
          <Text style={fstyles.helper}>{(k.hidden ? c.hidden : selected ? c.pickObject : c.pickObject)[lang]}</Text>
        </View>
      );
    }

    // ---- agrupar por una propiedad
    const prop = k.prop as SortProp;
    const placed = bag.placed ?? {};
    const selected = bag.selected ?? null;
    const interactive = step.kind === 'probar' && !k.static;
    const preview = !interactive && !k.static;
    const bins = PROP_VALUES[prop].map((v) => ({
      id: v,
      label: cap(VALUE_TEXT[v][lang]),
      items: SORT_OBJECTS.filter((o) => (k.static ? propertyOf(o, prop) === v : placed[o] === v)).map((o) => ({ id: o, label: name(o), placed: true })),
    }));
    const place = (v: string) => {
      if (!selected) return;
      if (propertyOf(selected, prop) === v) set({ placed: { ...placed, [selected]: v }, selected: null, missed: false });
      else set({ missed: true });
    };
    const done = SORT_OBJECTS.filter((o) => placed[o] !== undefined).length;
    return (
      <View style={fstyles.stack}>
        <SortBench
          art={CIENCIA_CLASIFICAR}
          width={visualWidth}
          tiles={allTiles.map((t) => ({ ...t, placed: k.static || placed[t.id] !== undefined }))}
          selected={selected}
          onSelect={interactive ? (id) => set({ selected: id as SortObject, missed: false }) : undefined}
          lensText={interactive && selected ? lensOf(selected) : undefined}
          bins={bins}
          onBin={interactive ? place : undefined}
          binsTitle={c.groupTitle(SORT_PROP_NAME[prop][lang])[lang]}
          label={c.groupTitle(SORT_PROP_NAME[prop][lang])[lang]}
        />
        {interactive ? <Text style={fstyles.helper}>{(selected ? c.pickBin : done === SORT_OBJECTS.length ? c.placedAll : done === 0 ? c.pickObject : c.placed(done, SORT_OBJECTS.length))[lang]}</Text> : null}
        {interactive && bag.missed ? (
          <View style={fstyles.reveal}>
            <Text style={fstyles.revealText}>{c.lookAgain[lang]}</Text>
          </View>
        ) : null}
        {preview ? <Text style={fstyles.helper}>{c.hidden[lang]}</Text> : null}
      </View>
    );
  },
};

import { Image, Text, View } from 'react-native';
import { EARTH_EVENTS, EVENT_CLUES, EVENT_NAME, SPEEDS, SPEED_NAME, speedOf, type EarthEvent, type Speed } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { EventBoard } from '@lee-conmigo/ui-native';
import { CIENCIA_TIERRA } from '../art';
import { Badge, fstyles } from './shared';
import type { Family, StepCtx } from './types';

/** Lo que guarda este paso: el suceso elegido y en qué grupo puso cada uno. */
interface Bag {
  selected?: EarthEvent | null;
  placed?: Record<string, Speed>;
  missed?: boolean;
}
const bagOf = (ctx: StepCtx): Bag => ctx.local.bag as Bag;
const IMAGE: Partial<Record<EarthEvent, (typeof CIENCIA_TIERRA)[keyof typeof CIENCIA_TIERRA]>> = { volcan: CIENCIA_TIERRA.volcan, canon: CIENCIA_TIERRA.canon, duna: CIENCIA_TIERRA.duna };

/** Los cambios de la Tierra (C2-U08): fotos, clasificar sucesos en rápido y lento con dos pistas cada uno, y las pistas de un suceso. */
export const earthFamily: Family = {
  id: 'earth',
  owns: (step) => !!step.earth,
  initial: (step) => ({ bag: { selected: null, placed: step.earth?.static ? Object.fromEntries(EARTH_EVENTS.map((e) => [e, speedOf(e)])) : {}, missed: false } satisfies Bag }),
  skippable: (step) => step.kind === 'probar',
  ready: (ctx) => {
    const { step, local } = ctx;
    const bag = bagOf(ctx);
    if (!step.earth || step.kind !== 'probar' || step.earth.view !== 'sort') return true;
    return EARTH_EVENTS.every((e) => bag.placed?.[e] !== undefined) || local.skipped;
  },
  visual: (ctx) => {
    const { step, lang, visualWidth, patch } = ctx;
    const k = step.earth;
    if (!k) return null;
    const c = CIENCIA_COPY.earth;
    const bag = bagOf(ctx);
    const set = (next: Partial<Bag>) => patch({ bag: { ...bag, ...next } });

    if (k.view === 'photos') {
      const items = [
        { id: 'volcan', source: CIENCIA_TIERRA.volcan, caption: c.photoVolcan },
        { id: 'canon', source: CIENCIA_TIERRA.canon, caption: c.photoCanon },
        { id: 'duna', source: CIENCIA_TIERRA.duna, caption: c.photoDuna },
      ];
      const side = Math.floor((visualWidth - 24) / 3);
      return (
        <View style={fstyles.stack}>
          <View style={[fstyles.buttonsRow, { justifyContent: 'center', alignItems: 'flex-start', width: visualWidth }]}>
            {items.map((it) => (
              <View key={it.id} style={{ width: side, alignItems: 'center', gap: 4 }}>
                <Image source={it.source} style={{ width: side, height: side }} resizeMode="contain" accessible accessibilityLabel={it.caption[lang]} />
                <Text style={fstyles.helper}>{it.caption[lang]}</Text>
              </View>
            ))}
          </View>
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    if (k.view === 'clues') {
      const e = k.event as EarthEvent;
      return (
        <View style={fstyles.stack}>
          {IMAGE[e] ? <Image source={IMAGE[e]} style={{ width: Math.min(160, visualWidth), height: Math.min(160, visualWidth), alignSelf: 'center' }} resizeMode="contain" accessible accessibilityLabel={EVENT_NAME[e][lang]} /> : null}
          <Text style={fstyles.helper}>{EVENT_NAME[e][lang]}</Text>
          {EVENT_CLUES[e].map((clue, i) => (
            <View key={i} style={fstyles.reveal}>
              <Text style={fstyles.revealText}>{`${c.source(i + 1)[lang]}: ${clue[lang]}`}</Text>
            </View>
          ))}
          <Text style={fstyles.helper}>{c.twoSources[lang]}</Text>
          <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
        </View>
      );
    }

    // ---- clasificar sucesos en rápido y lento
    const placed = bag.placed ?? {};
    const selected = bag.selected ?? null;
    const interactive = !k.static;
    const bins = SPEEDS.map((sp) => ({
      id: sp,
      label: SPEED_NAME[sp][lang],
      items: EARTH_EVENTS.filter((e) => placed[e] === sp).map((e) => ({ id: e, label: EVENT_NAME[e][lang], image: IMAGE[e], placed: true })),
    }));
    const place = (sp: string) => {
      if (!selected) return;
      if (speedOf(selected) === sp) set({ placed: { ...placed, [selected]: sp as Speed }, selected: null, missed: false });
      else set({ missed: true });
    };
    const done = EARTH_EVENTS.filter((e) => placed[e] !== undefined).length;
    return (
      <View style={fstyles.stack}>
        <EventBoard
          width={visualWidth}
          tiles={EARTH_EVENTS.map((e) => ({ id: e, label: EVENT_NAME[e][lang], image: IMAGE[e], placed: placed[e] !== undefined }))}
          selected={selected}
          onSelect={interactive ? (id) => set({ selected: id as EarthEvent, missed: false }) : undefined}
          cluesTitle={c.cluesTitle[lang]}
          clues={interactive && selected ? EVENT_CLUES[selected].map((x) => x[lang]) : undefined}
          bins={bins}
          onBin={interactive ? place : undefined}
          binsTitle={c.binsTitle[lang]}
          label={c.binsTitle[lang]}
        />
        {interactive ? <Text style={fstyles.helper}>{(selected ? c.pickBin : done === EARTH_EVENTS.length ? c.placedAll : done === 0 ? c.pickEvent : c.placed(done, EARTH_EVENTS.length))[lang]}</Text> : null}
        {interactive && bag.missed ? (
          <View style={fstyles.reveal}>
            <Text style={fstyles.revealText}>{c.lookAgain[lang]}</Text>
          </View>
        ) : null}
        <Badge text={CIENCIA_COPY.badge.practiceData[lang]} />
      </View>
    );
  },
};

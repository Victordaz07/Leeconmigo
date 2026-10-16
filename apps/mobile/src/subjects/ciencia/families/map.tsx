import { Text, View } from 'react-native';
import { bandCount, PRACTICE_MAPS, quakesByZone } from '@lee-conmigo/science-content';
import { CIENCIA_COPY } from '@lee-conmigo/ui-core';
import { LayerToggle, PracticeMap, type MapLayers } from '@lee-conmigo/ui-native';
import { mapView } from '../lab-model';
import { fstyles } from './shared';
import type { Family } from './types';

/** Mapa de práctica: capas que se encienden, franja, sismos que se cuentan o se predicen y luego se revelan. */
export const mapFamily: Family = {
  id: 'map',
  owns: (step) => !!step.map,
  initial: (step) => {
    const m = step.map;
    const observing = step.kind === 'mapa' && !m?.tool && !m?.hideQuakes;
    return { layers: { relief: !!m && !observing, volcanoes: !!m && !observing, quakes: !!m && !observing && !m.hideQuakes } };
  },
  visual: ({ step, task, lang, visualWidth, done, choice, choiceGood, local, patch }) => {
    const m = step.map;
    if (!m) return null;
    const c = CIENCIA_COPY;
    const map = PRACTICE_MAPS[m.id];
    const { inside, total } = bandCount(map);
    const view = mapView(map, m.tool === 'band');
    const toggle = (k: keyof MapLayers) => patch({ layers: { ...local.layers, [k]: !local.layers[k] } });
    const hidden = m.hideQuakes && !(task && done[task.id]);
    const layers = hidden ? { ...local.layers, quakes: false } : m.hideQuakes ? { ...local.layers, quakes: true } : local.layers;
    const zone = quakesByZone(map);
    const observing = step.kind === 'mapa' && !m.tool && !m.hideQuakes;
    return (
      <View style={fstyles.stack}>
        <PracticeMap
          map={m.hideQuakes && !hidden ? { ...view, band: mapView(map, true).band } : view}
          layers={layers}
          width={visualWidth - 24}
          marks={local.marks}
          description={c.screen.mapDescription[lang]}
          disclaimer={map.disclaimer[lang]}
          onCell={
            step.kind === 'mapa' && m.tool === 'band' && choice
              ? (cell) => {
                  if (!map.earthquakes.some((q) => q.col === cell.col && q.row === cell.row)) return;
                  const on = local.marks.some((x) => x.col === cell.col && x.row === cell.row);
                  patch({ marks: on ? local.marks.filter((x) => !(x.col === cell.col && x.row === cell.row)) : [...local.marks, cell] });
                }
              : undefined
          }
        />
        {observing ? (
          <View style={fstyles.toggles}>
            <LayerToggle label={c.map.relief[lang]} glyph="relief" on={local.layers.relief} onPress={() => toggle('relief')} />
            <LayerToggle label={c.map.volcanoes[lang]} glyph="volcano" on={local.layers.volcanoes} onPress={() => toggle('volcanoes')} />
            <LayerToggle label={c.map.quakes[lang]} glyph="quake" on={local.layers.quakes} onPress={() => toggle('quakes')} />
          </View>
        ) : null}
        {m.tool === 'band' && choice ? <Text style={fstyles.helper}>{`${c.map.bandHint[lang]} ${c.screen.countPrompt[lang]} ${c.screen.counted(local.marks.length)[lang]}`}</Text> : null}
        {m.hideQuakes && !hidden ? (
          <View style={fstyles.reveal}>
            <Text style={fstyles.revealText}>{`${c.screen.revealNow[lang]} ${c.map.revealed(zone.cerca, zone.llanura + zone.mar)[lang]}`}</Text>
          </View>
        ) : null}
        {step.kind === 'mapa' && choice && local.checked && choiceGood ? <Text style={fstyles.helper}>{c.map.quakesIn(inside, total)[lang]}</Text> : null}
      </View>
    );
  },
};

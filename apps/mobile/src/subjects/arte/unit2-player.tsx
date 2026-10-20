import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ARTE_COPY, CHANGES, DECISIONS, ENCOUNTERS2, EXAMPLE_PALETTES, INTENTIONS2, PALETTE_SIZE, RELATIONS, SEEN, UNIT2_COPY, answerLook, chosenColors, colorOf, completeEncounter2, isDone2, isMixedColor, missingFor2, paintingAt,
  patchUnit2, projectById, recipeText, unit2Of, unit2Stars, updateScene, type ArtLang, type ArtLibrary, type ArtProject, type Encounter2Id, type ExampleChoice, type PaintScene,
} from '@lee-conmigo/art-content';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { ArtBackdrop } from './art-backdrop';
import { MiniPaint } from './mini-paint';
import { PaintArea } from './paint-area';
import { PaintMixer } from './paint-mixer';

interface Props {
  lang: ArtLang;
  library: ArtLibrary;
  /** Recibe la biblioteca nueva; el módulo la guarda. */
  onChange: (lib: ArtLibrary) => void;
  onBack: () => void;
}

const EXAMPLES: readonly ExampleChoice[] = ['A', 'B'];

/** Una opción para elegir (sin respuesta «correcta»): se ve cuál está elegida con texto y forma, no solo con color. */
function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={[styles.choice, selected && styles.choiceOn]}>
      <Text style={[styles.choiceText, selected && styles.choiceTextOn]}>{selected ? '✓ ' : ''}{label}</Text>
    </Pressable>
  );
}

function Swatches({ colorsList }: { colorsList: readonly string[] }) {
  return (
    <View style={styles.swatchRow}>
      {colorsList.map((hex, i) => (
        <View key={`${hex}-${i}`} style={[styles.miniSwatch, { backgroundColor: hex }]} />
      ))}
    </View>
  );
}

/**
 * Unidad guiada A2-U02 «Colores que se relacionan» (2.º). Seis encuentros que se abren en cualquier orden, sobre un proyecto de pintura con dos cuadros.
 * Sin notas: el feedback dice qué mirar o qué se puede cambiar. Estrellas por esfuerzo (D11).
 */
export function Unit2Player({ lang, library, onChange, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const c = UNIT2_COPY[lang];
  const t = ARTE_COPY[lang];
  const u = unit2Of(library);
  const project: ArtProject | undefined = u.projectId ? projectById(library, u.projectId) : undefined;
  const [current, setCurrent] = useState<Encounter2Id>(() => ENCOUNTERS2.find((e) => !unit2Of(library).done.includes(e)) ?? 'compare');
  const [lookFeedback, setLookFeedback] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [sel1, setSel1] = useState('');
  const [sel2, setSel2] = useState('');
  const now = () => Date.now();

  const first = paintingAt(project, 0);
  const second = paintingAt(project, 1);
  const chosen = chosenColors(project, u);
  const hasFour = chosen.length === PALETTE_SIZE;
  const missing = useMemo(() => missingFor2(current, u, project), [current, u, project]);
  const done = u.done.includes(current);
  const stars = unit2Stars(u, project);
  const finished = isDone2(u);
  const wide = layout.width >= 720;

  const saveScene = (index: 0 | 1, scene: PaintScene) => {
    if (project) onChange(updateScene(library, project.id, index, scene, now()));
  };
  const patch = (p: Parameters<typeof patchUnit2>[1]) => onChange(patchUnit2(library, p, now()));
  const select1 = useCallback((id: string) => setSel1(id), []);
  const select2 = useCallback((id: string) => setSel2(id), []);

  const togglePalette = (id: string) => {
    const has = u.paletteIds.includes(id);
    if (!has && u.paletteIds.length >= PALETTE_SIZE) return;
    patch({ paletteIds: has ? u.paletteIds.filter((x) => x !== id) : [...u.paletteIds, id] });
  };

  const finish = () => onChange(completeEncounter2(library, current, now()));
  const goNext = () => setCurrent(ENCOUNTERS2[Math.min(ENCOUNTERS2.length - 1, ENCOUNTERS2.indexOf(current) + 1)]!);

  const needFour = (
    <View style={styles.missing}>
      <Text style={styles.small}>{c.missing.four}</Text>
      <View style={styles.actions}>
        <Button label={c.encounters.palette.title} variant="secondary" onPress={() => setCurrent('palette')} />
      </View>
    </View>
  );

  const body = () => {
    switch (current) {
      case 'look':
        return (
          <>
            <Text style={styles.note}>{c.lookIntro}</Text>
            <View style={[styles.examples, wide && styles.examplesWide]}>
              {EXAMPLES.map((e) => (
                <Pressable
                  key={e}
                  onPress={() => {
                    const r = answerLook(library, e, now());
                    onChange(r.lib);
                    setLookFeedback(!r.ok);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={c.paletteDescription(e)}
                  style={[styles.example, e === 'A' && u.lookOk && styles.exampleOn]}
                >
                  <Text style={styles.h3}>{c.paletteName(e)}</Text>
                  <Swatches colorsList={EXAMPLE_PALETTES[e]} />
                </Pressable>
              ))}
            </View>
            <Text style={styles.h3}>{c.lookQ}</Text>
            {lookFeedback && !u.lookOk && <Text style={styles.hint}>{c.lookHint}</Text>}
            {u.lookOk && <Text style={styles.ok}>{c.lookOk}</Text>}
          </>
        );
      case 'mix': {
        const palette = first?.palette ?? [];
        const mixedCount = palette.filter(isMixedColor).length;
        return (
          <>
            <Text style={styles.note}>{c.mixIntro}</Text>
            {first && <PaintMixer lang={lang} palette={first.palette} onSaved={(p) => saveScene(0, { ...first, palette: p })} />}
            <Text style={mixedCount > 0 ? styles.ok : styles.hint}>{mixedCount > 0 ? c.mixedYes(mixedCount) : c.mixedNo}</Text>
          </>
        );
      }
      case 'palette': {
        const palette = first?.palette ?? [];
        return (
          <>
            <Text style={styles.note}>{c.paletteIntro}</Text>
            <View style={styles.swatchGrid}>
              {palette.map((col) => {
                const on = u.paletteIds.includes(col.id);
                return (
                  <Pressable key={col.id} onPress={() => togglePalette(col.id)} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={t.colorLabel(recipeText(col.recipe, lang))} style={[styles.bigSwatch, { backgroundColor: colorOf(col) }, on && styles.bigSwatchOn]}>
                    {on && <Text style={[styles.check, { color: lum(colorOf(col)) ? '#ffffff' : '#1E2340' }]}>✓</Text>}
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.line}>{c.paletteCount(u.paletteIds.length)}</Text>
            {u.paletteIds.length >= PALETTE_SIZE && <Text style={styles.small}>{c.paletteFull}</Text>}
            <Text style={styles.h3}>{c.relationQ}</Text>
            <View style={styles.actions}>
              {RELATIONS.map((r) => (
                <Choice key={r} label={c.relations[r]} selected={u.relation === r} onPress={() => patch({ relation: r })} />
              ))}
            </View>
          </>
        );
      }
      case 'first':
        return (
          <>
            <Text style={styles.note}>{c.firstIntro}</Text>
            {hasFour && first ? <PaintArea key="p1" lang={lang} scene={first} palette={chosen} selected={sel1} onSelect={select1} onScene={(s) => saveScene(0, s)} onDrawing={setDrawing} /> : needFour}
            <Text style={styles.h3}>{c.intentionQ}</Text>
            <View style={styles.actions}>
              {INTENTIONS2.map((i) => (
                <Choice key={i} label={c.intentions[i]} selected={u.intention === i} onPress={() => patch({ intention: i })} />
              ))}
            </View>
          </>
        );
      case 'second':
        return (
          <>
            <Text style={styles.note}>{c.secondIntro}</Text>
            <View style={styles.thumb}>
              <Text style={styles.small}>{c.firstThumb}</Text>
              <MiniPaint scene={first} label={c.firstThumb} />
            </View>
            {hasFour && second ? <PaintArea key="p2" lang={lang} scene={second} palette={chosen} selected={sel2} onSelect={select2} onScene={(s) => saveScene(1, s)} onDrawing={setDrawing} /> : needFour}
            <Text style={styles.h3}>{c.changedQ}</Text>
            <View style={styles.actions}>
              {CHANGES.map((ch) => (
                <Choice key={ch} label={c.changes[ch]} selected={u.changed === ch} onPress={() => patch({ changed: ch })} />
              ))}
            </View>
          </>
        );
      case 'compare':
        return (
          <>
            <Text style={styles.note}>{c.compareIntro}</Text>
            <View style={[styles.pair, wide && styles.pairWide]}>
              <View style={styles.pairItem}>
                <Text style={styles.h3}>{c.firstLabel}</Text>
                <MiniPaint scene={first} label={c.firstLabel} />
              </View>
              <View style={styles.pairItem}>
                <Text style={styles.h3}>{c.secondLabel}</Text>
                <MiniPaint scene={second} label={c.secondLabel} />
              </View>
            </View>
            <Text style={styles.h3}>{c.seenQ}</Text>
            <View style={styles.actions}>
              {SEEN.map((s) => (
                <Choice key={s} label={c.seen[s]} selected={u.seen === s} onPress={() => patch({ seen: s })} />
              ))}
            </View>
            <Text style={styles.h3}>{c.decisionQ}</Text>
            <View style={styles.actions}>
              {DECISIONS.map((d) => (
                <Choice key={d} label={c.decisions[d]} selected={u.decision === d} onPress={() => patch({ decision: d })} />
              ))}
            </View>
            <View style={styles.folder}>
              <Text style={styles.h3}>{c.folder}</Text>
              {hasFour && (
                <>
                  <Text style={styles.line}>{c.folderPalette}</Text>
                  <Swatches colorsList={chosen.map(colorOf)} />
                </>
              )}
              {u.relation && <Text style={styles.line}>{c.folderRelation(c.relations[u.relation])}</Text>}
              {u.intention && <Text style={styles.line}>{c.folderIntention(c.intentions[u.intention])}</Text>}
              {u.changed && <Text style={styles.line}>{c.folderChanged(c.changes[u.changed])}</Text>}
            </View>
            <View style={styles.capsule}>
              <Text style={styles.small}>{c.capsuleNote}</Text>
            </View>
          </>
        );
    }
  };

  return (
    <View style={styles.root}>
      <ArtBackdrop kind="pintura" />
      <ScrollView scrollEnabled={!drawing} style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
        <View style={styles.header}>
          <RoundButton onPress={onBack} label={c.back}>
            <ChevronLeftIcon />
          </RoundButton>
          <Text style={[styles.title, layout.phone && styles.titleSmall]} numberOfLines={2}>
            {c.title}
          </Text>
        </View>

        <View style={styles.pills}>
          {ENCOUNTERS2.map((e, i) => (
            <Pressable key={e} onPress={() => setCurrent(e)} accessibilityRole="button" accessibilityLabel={`${c.encounter(i + 1)}: ${c.encounters[e].title}${u.done.includes(e) ? ' ✓' : ''}`} accessibilityState={{ selected: current === e }} style={[styles.pill, current === e && styles.pillOn]}>
              <Text style={[styles.pillText, current === e && styles.pillTextOn]}>{u.done.includes(e) ? '✓' : i + 1}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.card, layout.phone && styles.cardPhone]}>
          <Text style={styles.kicker}>{c.encounter(ENCOUNTERS2.indexOf(current) + 1)}</Text>
          <Text style={styles.h2}>{c.encounters[current].title}</Text>
          <Text style={styles.note}>{c.encounters[current].goal}</Text>
          {body()}

          {missing.length > 0 && !done && (
            <View style={styles.missing}>
              <Text style={styles.small}>{c.missingTitle}</Text>
              {missing.map((m) => (
                <Text key={m} style={styles.small}>
                  • {c.missing[m]}
                </Text>
              ))}
            </View>
          )}
          <View style={styles.actions}>
            <Button label={done ? c.readyDone : current === 'compare' ? c.finish : c.ready} onPress={finish} disabled={done || missing.length > 0} />
            {current !== 'compare' && <Button label={c.next} variant="secondary" onPress={goNext} />}
          </View>
        </View>

        {finished && (
          <View style={[styles.card, layout.phone && styles.cardPhone]}>
            <Text style={styles.h2}>{c.doneTitle}</Text>
            <Text style={styles.note}>{c.doneText}</Text>
            <Text style={styles.h3}>{c.starsTitle}</Text>
            <Text style={styles.line}>{stars.explored ? '★' : '☆'} {c.starExplored}</Text>
            <Text style={styles.line}>{stars.compared ? '★' : '☆'} {c.starCompared}</Text>
            <Text style={styles.line}>{stars.explained ? '★' : '☆'} {c.starExplained}</Text>
            <Button label={c.back} onPress={onBack} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/** ¿Es un color oscuro? (para la marca ✓ encima). */
function lum(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) < 140;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.app },
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,248,236,0.88)', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 8 },
  title: { flex: 1, fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.navy },
  titleSmall: { fontSize: 22 },
  pills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  pillOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  pillText: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.inkSoft },
  pillTextOn: { color: '#ffffff' },
  cardPhone: { padding: 14 },
  card: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 20, gap: 12, boxShadow: shadows.card },
  kicker: { fontFamily: fontFamily.ui.extrabold, fontSize: 13, color: colors.muted },
  h2: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.navy },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  line: { fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 18, color: colors.muted },
  hint: { fontFamily: fontFamily.ui.bold, fontSize: 15, lineHeight: 21, color: colors.orangeDeep },
  ok: { fontFamily: fontFamily.ui.bold, fontSize: 15, lineHeight: 21, color: colors.ok },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  choice: { maxWidth: '100%', minHeight: 48, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14, justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  choiceOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  choiceText: { flexShrink: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink },
  choiceTextOn: { color: '#ffffff' },
  missing: { gap: 4, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 12 },
  folder: { gap: 6, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14 },
  capsule: { gap: 6, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, borderWidth: 2, borderColor: colors.line, borderStyle: 'dashed' },
  examples: { gap: 12 },
  examplesWide: { flexDirection: 'row' },
  example: { flex: 1, gap: 10, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, borderWidth: 3, borderColor: colors.line },
  exampleOn: { borderColor: colors.ok },
  swatchRow: { flexDirection: 'row', gap: 8 },
  miniSwatch: { flex: 1, height: 56, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(0,0,0,0.12)', maxWidth: 96 },
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bigSwatch: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  bigSwatchOn: { borderColor: colors.brand, borderWidth: 5 },
  check: { fontFamily: fontFamily.ui.black, fontSize: 22 },
  thumb: { gap: 4, maxWidth: 320 },
  pair: { gap: 12 },
  pairWide: { flexDirection: 'row' },
  pairItem: { flex: 1, gap: 6 },
});

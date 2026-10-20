import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BACKGROUNDS, ENCOUNTERS3, EXAMPLE_DISPLAY, IDEAS, MOMENTS, PLANS, PLAYGROUND_INDEX, UNIT3_COPY, answerOrder, collageAt, completeEncounter3, copyScene, detectedChanges, exampleScene, isDone3, missingFor3,
  patchUnit3, projectById, storyScenes, unit3Of, unit3Stars, updateScene, type ArtLang, type ArtLibrary, type ArtProject, type CollageScene, type Encounter3Id, type ExampleId,
} from '@lee-conmigo/art-content';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { ArtBackdrop } from './art-backdrop';
import { CollageArea, CollageSvg } from './collage-area';

interface Props {
  lang: ArtLang;
  library: ArtLibrary;
  /** Recibe la biblioteca nueva; el módulo la guarda. */
  onChange: (lib: ArtLibrary) => void;
  onBack: () => void;
}

/** Una opción para elegir (sin respuesta «correcta»): se ve cuál está elegida con texto y forma, no solo con color. */
function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={[styles.choice, selected && styles.choiceOn]}>
      <Text style={[styles.choiceText, selected && styles.choiceTextOn]}>{selected ? '✓ ' : ''}{label}</Text>
    </Pressable>
  );
}

/** Miniatura de solo lectura de un cartón de collage. */
function MiniCollage({ scene, label }: { scene: CollageScene; label: string }) {
  return (
    <View style={[styles.mini, { backgroundColor: BACKGROUNDS[scene.background] }]} accessible accessibilityLabel={label}>
      <CollageSvg scene={scene} />
    </View>
  );
}

/**
 * Unidad guiada A1-U06 «Una historia de recortes» (1.º). Seis encuentros que se abren en cualquier orden, sobre un collage de tres cartones (principio, lo que
 * pasa, final) y uno para probar piezas. Sin notas: el feedback dice qué mirar o qué se puede cambiar. Estrellas por esfuerzo (D11).
 */
export function Unit3Player({ lang, library, onChange, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const c = UNIT3_COPY[lang];
  const u = unit3Of(library);
  const project: ArtProject | undefined = u.projectId ? projectById(library, u.projectId) : undefined;
  const [current, setCurrent] = useState<Encounter3Id>(() => ENCOUNTERS3.find((e) => !unit3Of(library).done.includes(e)) ?? 'tell');
  const [taps, setTaps] = useState<ExampleId[]>([]);
  const [lookHint, setLookHint] = useState(false);
  const [sceneIdx, setSceneIdx] = useState<1 | 2>(1);
  const [rev, setRev] = useState(0); // sube al copiar una escena, para volver a armar el área de collage con las piezas nuevas
  const [dragging, setDragging] = useState(false);
  const drag = useCallback((a: boolean) => setDragging(a), []);
  const now = () => Date.now();

  const scenes = storyScenes(project);
  const missing = useMemo(() => missingFor3(current, u, project), [current, u, project]);
  const done = u.done.includes(current);
  const stars = unit3Stars(u, project);
  const finished = isDone3(u);
  const wide = layout.width >= 720;
  const seen = detectedChanges(project);

  const saveScene = (index: number, scene: CollageScene) => {
    if (project) onChange(updateScene(library, project.id, index, scene, now()));
  };
  const patch = (p: Parameters<typeof patchUnit3>[1]) => onChange(patchUnit3(library, p, now()));
  const finish = () => onChange(completeEncounter3(library, current, now()));
  const goNext = () => setCurrent(ENCOUNTERS3[Math.min(ENCOUNTERS3.length - 1, ENCOUNTERS3.indexOf(current) + 1)]!);
  const area = (index: number) => {
    const s = collageAt(project, index);
    return s ? <CollageArea key={`${index}-${rev}`} lang={lang} scene={s} onScene={(sc) => saveScene(index, sc)} onDrawing={drag} /> : null;
  };

  const tapExample = (id: ExampleId) => {
    if (taps.includes(id) || u.lookOk) return;
    const next = [...taps, id];
    setTaps(next);
    if (next.length === EXAMPLE_DISPLAY.length) {
      const r = answerOrder(library, next, now());
      onChange(r.lib);
      setLookHint(!r.ok);
      if (!r.ok) setTaps([]);
    }
  };

  const body = () => {
    switch (current) {
      case 'look':
        return (
          <>
            <Text style={styles.note}>{c.lookIntro}</Text>
            <View style={[styles.examples, wide && styles.examplesWide]}>
              {EXAMPLE_DISPLAY.map((id) => {
                const n = taps.indexOf(id);
                return (
                  <Pressable key={id} onPress={() => tapExample(id)} accessibilityRole="button" accessibilityLabel={c.exampleLabel(id)} style={[styles.example, (n >= 0 || u.lookOk) && styles.exampleOn]}>
                    <Text style={styles.h3}>{c.exampleLabel(id)}{n >= 0 ? `  ${c.exampleOrderBadge(n + 1)}` : ''}</Text>
                    <MiniCollage scene={exampleScene(id)} label={c.exampleLabel(id)} />
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.h3}>{c.lookQ}</Text>
            {!u.lookOk && taps.length > 0 && (
              <View style={styles.actions}>
                <Text style={styles.line}>{c.lookPicked(taps.length)}</Text>
                <Button label={c.lookReset} variant="secondary" onPress={() => { setTaps([]); setLookHint(false); }} />
              </View>
            )}
            {lookHint && !u.lookOk && <Text style={styles.hint}>{c.lookHint}</Text>}
            {u.lookOk && <Text style={styles.ok}>{c.lookOk}</Text>}
          </>
        );
      case 'explore':
        return (
          <>
            <Text style={styles.note}>{c.exploreIntro}</Text>
            {area(PLAYGROUND_INDEX)}
            <Text style={styles.small}>{c.exploreCount(collageAt(project, PLAYGROUND_INDEX)?.pieces.length ?? 0)}</Text>
          </>
        );
      case 'idea':
        return (
          <>
            <Text style={styles.note}>{c.ideaIntro}</Text>
            <Text style={styles.h3}>{c.ideaQ}</Text>
            <View style={styles.actions}>
              {IDEAS.map((i) => (
                <Choice key={i} label={c.ideas[i]} selected={u.idea === i} onPress={() => patch({ idea: i })} />
              ))}
            </View>
            <Text style={styles.h3}>{c.planQ}</Text>
            <View style={styles.actions}>
              {PLANS.map((p) => (
                <Choice key={p} label={c.plans[p]} selected={u.plan === p} onPress={() => patch({ plan: p })} />
              ))}
            </View>
          </>
        );
      case 'first':
        return (
          <>
            <Text style={styles.note}>{c.firstIntro}</Text>
            <Text style={styles.h3}>{c.sceneName(1)}</Text>
            {area(0)}
            <Text style={styles.small}>{c.piecesCount(scenes[0]!.pieces.length)}</Text>
          </>
        );
      case 'next': {
        const prev = scenes[sceneIdx - 1]!;
        const cur = scenes[sceneIdx]!;
        const changed = missingFor3('next', u, project).includes(sceneIdx === 1 ? 'scene2' : 'scene3') === false;
        return (
          <>
            <Text style={styles.note}>{c.nextIntro}</Text>
            <View style={styles.actions}>
              {([1, 2] as const).map((i) => (
                <Choice key={i} label={`${i + 1}. ${c.sceneName(i + 1)}`} selected={sceneIdx === i} onPress={() => setSceneIdx(i)} />
              ))}
            </View>
            <View style={styles.thumb}>
              <Text style={styles.small}>{c.before}</Text>
              <MiniCollage scene={prev} label={c.before} />
            </View>
            {cur.pieces.length === 0 && prev.pieces.length > 0 && (
              <View style={styles.missing}>
                <Text style={styles.small}>{c.startFromBeforeHint}</Text>
                <View style={styles.actions}>
                  <Button label={c.startFromBefore} variant="secondary" onPress={() => { if (project) { onChange(copyScene(library, project.id, sceneIdx - 1, sceneIdx, now())); setRev((r) => r + 1); } }} />
                </View>
              </View>
            )}
            {area(sceneIdx)}
            <Text style={changed ? styles.ok : styles.small}>{changed ? c.sceneChanged : c.sceneSame}</Text>
            <Text style={styles.small}>{c.piecesCount(cur.pieces.length)}</Text>
          </>
        );
      }
      case 'tell': {
        const toldSeen = u.told ? seen.includes(u.told) : true;
        return (
          <>
            <Text style={styles.note}>{c.tellIntro}</Text>
            <View style={[styles.pair, wide && styles.pairWide]}>
              {scenes.map((s, i) => (
                <View key={i} style={styles.pairItem}>
                  <Text style={styles.h3}>{`${i + 1}. ${c.sceneName(i + 1)}`}</Text>
                  <MiniCollage scene={s} label={c.sceneName(i + 1)} />
                </View>
              ))}
            </View>
            <Text style={styles.h3}>{c.tellQ}</Text>
            <View style={styles.actions}>
              {PLANS.map((p) => (
                <Choice key={p} label={c.plans[p]} selected={u.told === p} onPress={() => patch({ told: p })} />
              ))}
            </View>
            {u.told && (toldSeen ? <Text style={styles.ok}>{c.tellSeen(c.plans[u.told])}</Text> : <Text style={styles.hint}>{c.tellNotSeen}</Text>)}
            <Text style={styles.h3}>{c.momentQ}</Text>
            <View style={styles.actions}>
              {MOMENTS.map((m) => (
                <Choice key={m} label={c.moments[m]} selected={u.moment === m} onPress={() => patch({ moment: m })} />
              ))}
            </View>
            <View style={styles.folder}>
              <Text style={styles.h3}>{c.folder}</Text>
              {u.idea && <Text style={styles.line}>{c.folderIdea(c.ideas[u.idea])}</Text>}
              {u.plan && <Text style={styles.line}>{c.folderPlan(c.plans[u.plan])}</Text>}
              {u.told && <Text style={styles.line}>{c.folderTold(c.plans[u.told])}</Text>}
              {u.moment && <Text style={styles.line}>{c.folderMoment(c.moments[u.moment])}</Text>}
            </View>
            <View style={styles.capsule}>
              <Text style={styles.small}>{c.capsuleNote}</Text>
            </View>
          </>
        );
      }
    }
  };

  return (
    <View style={styles.root}>
      <ArtBackdrop kind="pintura" />
      <ScrollView scrollEnabled={!dragging} style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
        <View style={styles.header}>
          <RoundButton onPress={onBack} label={c.back}>
            <ChevronLeftIcon />
          </RoundButton>
          <Text style={[styles.title, layout.phone && styles.titleSmall]} numberOfLines={2}>
            {c.title}
          </Text>
        </View>

        <View style={styles.pills}>
          {ENCOUNTERS3.map((e, i) => (
            <Pressable key={e} onPress={() => setCurrent(e)} accessibilityRole="button" accessibilityLabel={`${c.encounter(i + 1)}: ${c.encounters[e].title}${u.done.includes(e) ? ' ✓' : ''}`} accessibilityState={{ selected: current === e }} style={[styles.pill, current === e && styles.pillOn]}>
              <Text style={[styles.pillText, current === e && styles.pillTextOn]}>{u.done.includes(e) ? '✓' : i + 1}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.card, layout.phone && styles.cardPhone]}>
          <Text style={styles.kicker}>{c.encounter(ENCOUNTERS3.indexOf(current) + 1)}</Text>
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
            <Button label={done ? c.readyDone : current === 'tell' ? c.finish : c.ready} onPress={finish} disabled={done || missing.length > 0} />
            {current !== 'tell' && <Button label={c.next} variant="secondary" onPress={goNext} />}
          </View>
        </View>

        {finished && (
          <View style={[styles.card, layout.phone && styles.cardPhone]}>
            <Text style={styles.h2}>{c.doneTitle}</Text>
            <Text style={styles.note}>{c.doneText}</Text>
            <Text style={styles.h3}>{c.starsTitle}</Text>
            <Text style={styles.line}>{stars.explored ? '★' : '☆'} {c.starExplored}</Text>
            <Text style={styles.line}>{stars.sequenced ? '★' : '☆'} {c.starSequenced}</Text>
            <Text style={styles.line}>{stars.explained ? '★' : '☆'} {c.starExplained}</Text>
            <Button label={c.back} onPress={onBack} />
          </View>
        )}
      </ScrollView>
    </View>
  );
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
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  choice: { maxWidth: '100%', minHeight: 48, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14, justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  choiceOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  choiceText: { flexShrink: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink },
  choiceTextOn: { color: '#ffffff' },
  missing: { gap: 4, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 12 },
  folder: { gap: 6, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14 },
  capsule: { gap: 6, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, borderWidth: 2, borderColor: colors.line, borderStyle: 'dashed' },
  examples: { gap: 12 },
  examplesWide: { flexDirection: 'row' },
  example: { flex: 1, gap: 8, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 12, borderWidth: 3, borderColor: colors.line },
  exampleOn: { borderColor: colors.brand },
  mini: { width: '100%', aspectRatio: 1000 / 700, borderRadius: radius.tile, overflow: 'hidden', borderWidth: 2, borderColor: colors.line },
  thumb: { gap: 4, maxWidth: 320 },
  pair: { gap: 12 },
  pairWide: { flexDirection: 'row' },
  pairItem: { flex: 1, gap: 6 },
});

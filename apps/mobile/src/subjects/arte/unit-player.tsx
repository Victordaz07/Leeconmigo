import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ARTE_COPY, DEMO_LAYERS, ENCOUNTERS, INTENTIONS, LAYER_NOTES, PRESENT_NOTES, UNIT_COPY, VERSION_REASONS, activeRows, answerReturn, rhythmOf, completeEncounter, demoPattern, isDone, markHeard, markSilence, missingFor,
  patchUnit, projectById, saveVersion, unitOf, unitStars, updateScene, type ArtLang, type ArtLibrary, type ArtProject, type EncounterId, type RhythmScene,
} from '@lee-conmigo/art-content';
import { DEFAULT_BPM, DEFAULT_KIT, silentSteps, toggleCell, type SoundId, type Track } from '@lee-conmigo/music-engine';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { ArtBackdrop } from './art-backdrop';
import { useRhythmPlayer } from '../../audio/use-rhythm-player';
import { RhythmGrid } from './rhythm-grid';

interface Props {
  lang: ArtLang;
  library: ArtLibrary;
  /** Recibe la biblioteca nueva; el módulo la guarda. */
  onChange: (lib: ArtLibrary) => void;
  onBack: () => void;
}

const LETTER: Record<Track, string> = { a: 'A', b: 'B', c: 'C', d: 'D' };
const DEMO_SCENE: RhythmScene = { kind: 'rhythm', pattern: demoPattern(), kit: { ...DEFAULT_KIT }, bpm: DEFAULT_BPM };

/** Una opción para elegir (sin respuesta «correcta»): se ve cuál está elegida con texto y forma, no solo con color. */
function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={[styles.choice, selected && styles.choiceOn]}>
      <Text style={[styles.choiceText, selected && styles.choiceTextOn]}>{selected ? '✓ ' : ''}{label}</Text>
    </Pressable>
  );
}

/**
 * Unidad guiada A1-U04 «Mi banda deja respirar al silencio». Seis encuentros que se abren en cualquier orden, sobre un mismo proyecto de ritmo.
 * Sin notas: el feedback dice qué escuchar o qué se puede cambiar. Estrellas por esfuerzo (D11).
 */
export function UnitPlayer({ lang, library, onChange, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const c = UNIT_COPY[lang];
  const t = ARTE_COPY[lang];
  const u = unitOf(library);
  const project: ArtProject | undefined = u.projectId ? projectById(library, u.projectId) : undefined;
  const [current, setCurrent] = useState<EncounterId>(() => ENCOUNTERS.find((e) => !unitOf(library).done.includes(e)) ?? 'present');
  const [solo, setSolo] = useState<Track | null>(null);
  const [listenTo, setListenTo] = useState<string | null>(null); // id de versión que se está escuchando
  const [feedback, setFeedback] = useState<'hint' | 'ok' | 'busy' | null>(null);
  const [savedLabel, setSavedLabel] = useState<string | null>(null);
  const now = () => Date.now();

  const myScene = project ? rhythmOf(project) : undefined;
  const version = listenTo ? project?.versions.find((v) => v.id === listenTo) : undefined;
  // Lo que suena: el ejemplo (encuentro 1), una versión guardada (encuentro 5, si se está escuchando una) o lo que el niño tiene ahora.
  const versionScene = version?.scenes[0]?.kind === 'rhythm' ? version.scenes[0] : undefined;
  const scene: RhythmScene = current === 'listen' ? DEMO_SCENE : (versionScene ?? myScene ?? DEMO_SCENE);
  const player = useRhythmPlayer(scene.pattern, scene.kit, scene.bpm, undefined, solo);

  // Al cambiar de encuentro, el sonido para y se quitan los apoyos del anterior.
  useEffect(() => {
    player.stop();
    setSolo(null);
    setListenTo(null);
    setFeedback(null);
    setSavedLabel(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const missing = useMemo(() => missingFor(current, u, project), [current, u, project]);
  const done = u.done.includes(current);
  const stars = unitStars(u, project);
  const finished = isDone(u);

  const setScene = (patch: Partial<RhythmScene>) => {
    if (!project || !myScene) return;
    onChange(updateScene(library, project.id, 0, { ...myScene, ...patch }, now()));
  };
  const toggle = (track: Track, step: number) => myScene && setScene({ pattern: toggleCell(myScene.pattern, track, step) });
  const changeSound = (track: Track, sound: SoundId) => myScene && setScene({ kit: { ...myScene.kit, [track]: sound } });
  const patch = (p: Parameters<typeof patchUnit>[1]) => onChange(patchUnit(library, p, now()));

  const listenSolo = (track: Track | null) => {
    setSolo(track);
    if (current === 'listen' && track) onChange(markHeard(library, track, now()));
    if (!player.playing) void player.play();
  };
  const soloBar = (tracks: readonly Track[]) => (
    <View style={styles.actions}>
      {tracks.map((tr) => (
        <Button key={tr} label={c.soloBtn(LETTER[tr])} variant="secondary" onPress={() => listenSolo(tr)} />
      ))}
      <Button label={c.allTogether} variant="secondary" onPress={() => listenSolo(null)} />
      {player.playing && <Button label={c.stop} variant="secondary" onPress={player.stop} />}
    </View>
  );
  const playBar = () => (
    <View style={styles.actions}>{player.playing ? <Button label={c.stop} variant="secondary" onPress={player.stop} /> : <Button label={t.play} onPress={() => void player.play()} />}</View>
  );

  const finish = () => onChange(completeEncounter(library, current, now()));
  const goNext = () => {
    const i = ENCOUNTERS.indexOf(current);
    setCurrent(ENCOUNTERS[Math.min(ENCOUNTERS.length - 1, i + 1)]!);
  };

  const rowsAll = ['a', 'b', 'c', 'd'] as const;
  const layerRows = myScene ? activeRows(myScene.pattern) : [];

  const body = () => {
    switch (current) {
      case 'listen':
        return (
          <>
            <Text style={styles.note}>{c.listenIntro}</Text>
            {soloBar(DEMO_LAYERS)}
            <RhythmGrid lang={lang} scene={DEMO_SCENE} cursor={player.cursor} rows={DEMO_LAYERS} soloRow={solo} onStepPress={(step) => {
              const r = answerReturn(library, step, now());
              onChange(r.lib);
              setFeedback(r.ok ? 'ok' : 'hint');
            }} />
            <Text style={styles.h3}>{c.returnQ}</Text>
            {(feedback === 'hint' && !u.returnOk) && <Text style={styles.hint}>{c.returnHint}</Text>}
            {u.returnOk && <Text style={styles.ok}>{c.returnOk}</Text>}
          </>
        );
      case 'build':
        return (
          <>
            <Text style={styles.h3}>{c.intentionQ}</Text>
            <View style={styles.actions}>
              {INTENTIONS.map((i) => (
                <Choice key={i} label={c.intentions[i]} selected={u.intention === i} onPress={() => patch({ intention: i })} />
              ))}
            </View>
            <Text style={styles.note}>{c.buildTip}</Text>
            {myScene && <RhythmGrid lang={lang} scene={myScene} cursor={player.cursor} rows={['a']} onToggle={toggle} onChangeSound={changeSound} onPreview={(id) => void player.preview(id)} />}
            {playBar()}
          </>
        );
      case 'silence':
        return (
          <>
            <Text style={styles.note}>{c.silenceIntro}</Text>
            {myScene && (
              <RhythmGrid lang={lang} scene={myScene} cursor={player.cursor} rows={['a']} onToggle={toggle} onChangeSound={changeSound} onPreview={(id) => void player.preview(id)} markStep={u.silenceStep !== null && silentSteps(myScene.pattern).includes(u.silenceStep) ? u.silenceStep : null}
                onStepPress={(step) => {
                  const r = markSilence(library, step, now());
                  onChange(r.lib);
                  setFeedback(r.ok ? 'ok' : 'busy');
                }} />
            )}
            <Text style={styles.h3}>{c.silencePick}</Text>
            {feedback === 'busy' && <Text style={styles.hint}>{c.silenceBusy}</Text>}
            {u.silenceStep !== null && myScene && silentSteps(myScene.pattern).includes(u.silenceStep) && <Text style={styles.ok}>{c.silenceSet(u.silenceStep + 1)}</Text>}
            {playBar()}
          </>
        );
      case 'layer':
        return (
          <>
            <Text style={styles.note}>{c.layerIntro}</Text>
            {myScene && <RhythmGrid lang={lang} scene={myScene} cursor={player.cursor} rows={rowsAll} soloRow={solo} onToggle={toggle} onChangeSound={changeSound} onPreview={(id) => void player.preview(id)} />}
            {soloBar(layerRows)}
            <Text style={styles.hint}>{c.layerFeedback}</Text>
            <Text style={styles.h3}>{c.layerQ}</Text>
            <View style={styles.actions}>
              {LAYER_NOTES.map((n) => (
                <Choice key={n} label={c.layerNotes[n]} selected={u.layerNote === n} onPress={() => patch({ layerNote: n })} />
              ))}
            </View>
          </>
        );
      case 'versions':
        return (
          <>
            <Text style={styles.note}>{c.versionsIntro}</Text>
            {myScene && <RhythmGrid lang={lang} scene={myScene} cursor={player.cursor} rows={rowsAll} onToggle={toggle} onChangeSound={changeSound} onPreview={(id) => void player.preview(id)} />}
            <View style={styles.actions}>
              <Button label={t.saveVersion} variant="secondary" onPress={() => {
                if (!project) return;
                const r = saveVersion(library, project.id, now());
                onChange(r.lib);
                const label = projectById(r.lib, project.id)?.versions.find((v) => v.id === r.versionId)?.label;
                setSavedLabel(label ?? null);
              }} />
            </View>
            {savedLabel && <Text style={styles.ok}>{c.versionSaved(savedLabel)}</Text>}
            {project && project.versions.length > 0 && (
              <View style={styles.actions}>
                {project.versions.map((v) => (
                  <Button key={v.id} label={c.listenVersion(v.label)} variant="secondary" onPress={() => { setListenTo(v.id); if (!player.playing) void player.play(); }} />
                ))}
                <Button label={c.listenNow} variant="secondary" onPress={() => { setListenTo(null); if (!player.playing) void player.play(); }} />
                {player.playing && <Button label={c.stop} variant="secondary" onPress={player.stop} />}
              </View>
            )}
            <Text style={styles.h3}>{c.reasonQ}</Text>
            <View style={styles.actions}>
              {VERSION_REASONS.map((r) => (
                <Choice key={r} label={c.reasons[r]} selected={u.versionReason === r} onPress={() => patch({ versionReason: r })} />
              ))}
            </View>
          </>
        );
      case 'present':
        return (
          <>
            <Text style={styles.note}>{c.presentIntro}</Text>
            <View style={styles.folder}>
              <Text style={styles.h3}>{c.folder}</Text>
              {u.intention && <Text style={styles.line}>{c.folderIntention(c.intentions[u.intention])}</Text>}
              {u.silenceStep !== null && <Text style={styles.line}>{c.folderSilence(u.silenceStep + 1)}</Text>}
              {myScene && <Text style={styles.line}>{c.folderLayers(layerRows.length)}</Text>}
              {project && project.versions.length > 0 && <Text style={styles.line}>{c.folderVersions(project.versions.length)}</Text>}
              {u.versionReason && <Text style={styles.line}>{c.folderReason(c.reasons[u.versionReason])}</Text>}
            </View>
            {myScene && <RhythmGrid lang={lang} scene={myScene} cursor={player.cursor} rows={rowsAll} />}
            {playBar()}
            <View style={styles.capsule}>
              <Text style={styles.capsuleTag}>{c.capsuleTag}</Text>
              <Text style={styles.h3}>{c.capsuleTitle}</Text>
              <Text style={styles.note}>{c.capsuleText}</Text>
            </View>
            <Text style={styles.h3}>{c.presentQ}</Text>
            <View style={styles.actions}>
              {PRESENT_NOTES.map((n) => (
                <Choice key={n} label={c.presentNotes[n]} selected={u.presentNote === n} onPress={() => patch({ presentNote: n })} />
              ))}
            </View>
          </>
        );
    }
  };

  return (
    <View style={styles.root}>
      <ArtBackdrop kind="ritmo" />
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: layout.gutter }]}>
      <View style={styles.header}>
        <RoundButton onPress={() => { player.stop(); onBack(); }} label={c.back}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]} numberOfLines={2}>
          {c.title}
        </Text>
      </View>

      <View style={styles.pills}>
        {ENCOUNTERS.map((e, i) => (
          <Pressable key={e} onPress={() => setCurrent(e)} accessibilityRole="button" accessibilityLabel={`${c.encounter(i + 1)}: ${c.encounters[e].title}${u.done.includes(e) ? ' ✓' : ''}`} accessibilityState={{ selected: current === e }} style={[styles.pill, current === e && styles.pillOn]}>
            <Text style={[styles.pillText, current === e && styles.pillTextOn]}>{u.done.includes(e) ? '✓' : i + 1}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.card, layout.phone && styles.cardPhone]}>
        <Text style={styles.kicker}>{c.encounter(ENCOUNTERS.indexOf(current) + 1)}</Text>
        <Text style={styles.h2}>{c.encounters[current].title}</Text>
        <Text style={styles.note}>{c.encounters[current].goal}</Text>
        {body()}
        {player.error && <Text style={styles.warn}>{t.audioError}</Text>}

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
          <Button label={done ? c.readyDone : current === 'present' ? c.finish : c.ready} onPress={finish} disabled={done || missing.length > 0} />
          {current !== 'present' && <Button label={c.next} variant="secondary" onPress={goNext} />}
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
          <Button label={c.back} onPress={() => { player.stop(); onBack(); }} />
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
  warn: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.orangeDeep, backgroundColor: colors.warnTint, borderRadius: radius.tile, padding: 12, overflow: 'hidden' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  choice: { minHeight: 48, paddingHorizontal: 16, borderRadius: 14, justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  choiceOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  choiceText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink },
  choiceTextOn: { color: '#ffffff' },
  missing: { gap: 2, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 12 },
  folder: { gap: 4, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14 },
  capsule: { gap: 6, backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, borderWidth: 2, borderColor: colors.line, borderStyle: 'dashed' },
  capsuleTag: { fontFamily: fontFamily.ui.extrabold, fontSize: 12, color: colors.orangeDeep },
});

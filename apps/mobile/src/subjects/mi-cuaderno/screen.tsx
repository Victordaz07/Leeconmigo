import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isArtLibrary, emptyLibrary } from '@lee-conmigo/art-content';
import type { MathLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { progressStoreFor, subjectStorageFor, type ChildProfile } from '../../app-state';
import { CreationThumb, hasThumb } from '../arte/creation-thumb';
import { NOTEBOOK_COPY } from './copy';
import { wordsOf } from './vocabulary';
import { MAX_NOTES, MAX_TEXT, NOTE_SUBJECTS, addNote, deleteNote, emptyNotebook, isNotebookData, notesLeftToday, type NoteSubject, type NotebookData } from './model';

type Tab = 'all' | 'words' | 'ideas' | 'drawings';
const TABS: Tab[] = ['all', 'words', 'ideas', 'drawings'];
const EMPTY_ART = emptyLibrary();
const MAX_DRAWINGS = 12;

interface Props {
  profile: ChildProfile;
  lang: MathLang;
  onExit: () => void;
}

/** Las filas del espiral del borde izquierdo (adorno; luego se puede cambiar por la imagen `mat_notebook_page`). */
function Spiral({ rows }: { rows: number }) {
  return (
    <View style={styles.spiral} pointerEvents="none">
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={styles.hole} />
      ))}
    </View>
  );
}

/**
 * Mi cuaderno (B14): palabras que le costaron al leer, ideas que escribe con sus palabras y sus dibujos de Arte y música. Todo en el dispositivo.
 * Solo guarda las ideas; las palabras salen del progreso de Lectura y los dibujos de Arte (no se copian).
 */
export function MiCuadernoScreen({ profile, lang, onExit }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const c = NOTEBOOK_COPY[lang];
  const storage = useMemo(() => subjectStorageFor('mi-cuaderno', profile.id, emptyNotebook(), isNotebookData), [profile.id]);
  const [data, setData] = useState<NotebookData>(() => storage.load());
  const [tab, setTab] = useState<Tab>('all');
  const [adding, setAdding] = useState(false);
  const [subject, setSubject] = useState<NoteSubject>('otra');
  const [text, setText] = useState('');
  const [problem, setProblem] = useState<'daily' | 'full' | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const words = useMemo(() => wordsOf(progressStoreFor(profile.id).summaries()), [profile.id]);
  const drawings = useMemo(() => subjectStorageFor('arte', profile.id, EMPTY_ART, isArtLibrary).load().projects.filter(hasThumb).slice(0, MAX_DRAWINGS), [profile.id]);
  const now = Date.now();
  const left = notesLeftToday(data, now);
  const wide = layout.width >= 720;

  const save = () => {
    const r = addNote(data, subject, text, now);
    if (!r.ok) {
      if (r.reason !== 'empty') setProblem(r.reason);
      return;
    }
    storage.save(r.data);
    setData(r.data);
    setText('');
    setAdding(false);
    setProblem(null);
  };
  const remove = (id: string) => {
    const next = deleteNote(data, id);
    storage.save(next);
    setData(next);
    setRemoving(null);
  };

  const showWords = tab === 'all' || tab === 'words';
  const showIdeas = tab === 'all' || tab === 'ideas';
  const showDrawings = tab === 'all' || tab === 'drawings';
  const thumbW = layout.phone ? 132 : 176;

  const wordsSection = (
    <View style={styles.section} key="words">
      <Text style={[styles.kicker, { color: colors.subjLectura }]}>{c.wordsTitle.toUpperCase()}</Text>
      {words.length === 0 ? (
        <Text style={styles.note}>{c.wordsEmpty}</Text>
      ) : (
        <>
          {words.map((w) => (
            <View key={w.word} style={styles.wordCard}>
              <Text style={styles.word}>{w.word}</Text>
              {(w.syllables.length > 1 || w.definition) && (
                <Text style={styles.wordMeta}>
                  {w.syllables.length > 1 ? w.syllables.join('-') : ''}
                  {w.syllables.length > 1 && w.definition ? ' · ' : ''}
                  {w.definition ?? ''}
                </Text>
              )}
              {w.example && <Text style={styles.wordExample}>“{w.example}”</Text>}
            </View>
          ))}
          <Text style={styles.small}>{c.wordsNote}</Text>
        </>
      )}
    </View>
  );

  const ideasSection = (
    <View style={styles.section} key="ideas">
      <Text style={[styles.kicker, { color: colors.ok }]}>{c.ideasTitle.toUpperCase()}</Text>
      {data.notes.length === 0 && !adding && <Text style={styles.note}>{c.ideasEmpty}</Text>}
      {adding ? (
        <View style={styles.form}>
          <Text style={styles.h3}>{c.ideaPrompt}</Text>
          <Text style={styles.small}>{c.subjectLabel}</Text>
          <View style={styles.chips}>
            {NOTE_SUBJECTS.map((s) => (
              <Pressable key={s} onPress={() => setSubject(s)} accessibilityRole="button" accessibilityState={{ selected: subject === s }} style={[styles.chip, subject === s && styles.chipOn]}>
                <Text style={[styles.chipText, subject === s && styles.chipTextOn]}>{subject === s ? '✓ ' : ''}{c.subjects[s]}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput value={text} onChangeText={(t) => { setText(t); setProblem(null); }} multiline maxLength={MAX_TEXT} placeholder={c.ideaPlaceholder} placeholderTextColor={colors.muted} accessibilityLabel={c.ideaPrompt} style={styles.input} />
          <Text style={styles.small}>{c.charsLeft(MAX_TEXT - text.length)}</Text>
          {problem === 'daily' && <Text style={styles.hint}>{c.dailyDone}</Text>}
          {problem === 'full' && <Text style={styles.hint}>{c.full}</Text>}
          <View style={styles.actions}>
            <Button label={c.save} onPress={save} disabled={text.trim().length === 0} />
            <Button label={c.cancel} variant="secondary" onPress={() => { setAdding(false); setText(''); setProblem(null); }} />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.actions}>
            <Button
              label={c.newIdea}
              onPress={() => {
                if (left === 0) setProblem('daily');
                else if (data.notes.length >= MAX_NOTES) setProblem('full');
                else setAdding(true);
              }}
            />
          </View>
          {problem === 'daily' && <Text style={styles.hint}>{c.dailyDone}</Text>}
          {problem === 'full' && <Text style={styles.hint}>{c.full}</Text>}
        </>
      )}
      {data.notes.map((n) => (
        <View key={n.id} style={styles.noteCard}>
          <Text style={styles.noteSubject}>{c.subjects[n.subject]}</Text>
          <Text style={styles.noteText}>{n.text}</Text>
          {removing === n.id ? (
            <View style={styles.actions}>
              <Text style={styles.small}>{c.removeAsk}</Text>
              <Button label={c.removeYes} variant="secondary" onPress={() => remove(n.id)} />
              <Button label={c.removeNo} onPress={() => setRemoving(null)} />
            </View>
          ) : (
            <Pressable onPress={() => setRemoving(n.id)} accessibilityRole="button" accessibilityLabel={`${c.remove}: ${n.text}`} style={styles.removeBtn}>
              <Text style={styles.removeText}>{c.remove}</Text>
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );

  const drawingsSection = (
    <View style={styles.section} key="drawings">
      <Text style={[styles.kicker, { color: colors.orangeDeep }]}>{c.drawingsTitle.toUpperCase()}</Text>
      {drawings.length === 0 ? (
        <Text style={styles.note}>{c.drawingsEmpty}</Text>
      ) : (
        <>
          <View style={styles.polaroids}>
            {drawings.map((p, i) => (
              <View key={p.id} style={[styles.polaroid, { transform: [{ rotate: `${(i % 3) - 1}deg` }] }]}>
                <CreationThumb project={p} width={thumbW} />
                <Text style={styles.caption} numberOfLines={2}>
                  {p.title}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.small}>{c.drawingsNote}</Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.root}>
      <Spiral rows={wide ? 22 : 14} />
      <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingLeft: 44 + (layout.gutter - 16), paddingRight: layout.gutter }]}>
        <View style={styles.header}>
          <RoundButton onPress={onExit} label={c.back}>
            <ChevronLeftIcon />
          </RoundButton>
          <Text style={[styles.title, layout.phone && styles.titleSmall]} numberOfLines={1}>
            {c.title}
          </Text>
        </View>
        <View style={styles.tabs} accessibilityRole="tablist">
          {TABS.map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} accessibilityRole="tab" accessibilityState={{ selected: tab === t }} style={[styles.tab, tab === t && styles.tabOn]}>
              <Text style={[styles.tabText, tab === t && styles.tabTextOn]}>{c.tabs[t]}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'all' && wide ? (
          <View style={styles.twoCols}>
            <View style={styles.col}>{wordsSection}</View>
            <View style={styles.col}>
              {ideasSection}
              {drawingsSection}
            </View>
          </View>
        ) : (
          <>
            {showWords && wordsSection}
            {showIdeas && ideasSection}
            {showDrawings && drawingsSection}
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerStar}>★</Text>
          <Text style={styles.footerText}>{left === 0 ? c.dailyDone : c.leftToday(left)}</Text>
        </View>
        <Text style={styles.small}>{c.privacy}</Text>
      </ScrollView>
    </View>
  );
}

const PAPER_LINE = '#EAF0FA';
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF8EC' },
  spiral: { position: 'absolute', left: 6, top: 0, bottom: 0, width: 28, justifyContent: 'space-evenly', alignItems: 'center', zIndex: 2 },
  hole: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#3B3F58', borderWidth: 2, borderColor: '#2A2D42' },
  screen: { flex: 1 },
  content: { gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  title: { flex: 1, fontFamily: fontFamily.ui.black, fontSize: 36, color: colors.navy },
  titleSmall: { fontSize: 28 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, backgroundColor: colors.chip, borderRadius: 999, padding: 4, alignSelf: 'flex-start' },
  tab: { minHeight: 44, paddingHorizontal: 16, borderRadius: 999, justifyContent: 'center' },
  tabOn: { backgroundColor: colors.brand },
  tabText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.inkSoft },
  tabTextOn: { color: '#ffffff' },
  twoCols: { flexDirection: 'row', gap: 22, alignItems: 'flex-start' },
  col: { flex: 1, gap: 16 },
  section: { gap: 10 },
  kicker: { fontFamily: fontFamily.ui.black, fontSize: 13, letterSpacing: 1 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 22, color: colors.inkSoft },
  small: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 18, color: colors.muted },
  hint: { fontFamily: fontFamily.ui.bold, fontSize: 15, lineHeight: 21, color: colors.orangeDeep },
  wordCard: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, gap: 2, boxShadow: shadows.soft, borderBottomWidth: 2, borderBottomColor: PAPER_LINE },
  word: { fontFamily: fontFamily.read.bold, fontSize: 24, color: colors.ink },
  wordMeta: { fontFamily: fontFamily.ui.semibold, fontSize: 14, lineHeight: 20, color: colors.inkSoft },
  wordExample: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 18, color: colors.muted, fontStyle: 'italic' },
  noteCard: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, gap: 6, boxShadow: shadows.soft },
  noteSubject: { fontFamily: fontFamily.ui.black, fontSize: 12, letterSpacing: 0.5, color: colors.brand },
  noteText: { fontFamily: fontFamily.read.regular, fontSize: 18, lineHeight: 26, color: colors.ink },
  removeBtn: { alignSelf: 'flex-end', minHeight: 44, paddingHorizontal: 12, justifyContent: 'center' },
  removeText: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.muted },
  form: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, gap: 10, boxShadow: shadows.soft },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 44, paddingHorizontal: 14, borderRadius: 14, justifyContent: 'center', backgroundColor: colors.chip, borderWidth: 2, borderColor: colors.chip },
  chipOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.ink },
  chipTextOn: { color: '#ffffff' },
  input: { minHeight: 96, borderRadius: 12, borderWidth: 2, borderColor: colors.line, backgroundColor: '#ffffff', padding: 12, fontFamily: fontFamily.read.regular, fontSize: 18, lineHeight: 26, color: colors.ink, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  polaroids: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  polaroid: { backgroundColor: '#ffffff', padding: 8, paddingBottom: 6, borderRadius: 6, gap: 6, boxShadow: shadows.card },
  caption: { fontFamily: fontFamily.read.bold, fontSize: 14, color: colors.ink, maxWidth: 176 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: 12 },
  footerStar: { fontSize: 26, color: '#F5B400' },
  footerText: { flex: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink },
});

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { defaultPrefs, type WordMark } from '@lee-conmigo/ui-core';
import { vocabularyKey } from '@lee-conmigo/reading-engine';
import { isWordComplete, tilesOf } from '@lee-conmigo/session-engine';
import { lookupVocabulary, tokenizePage, type PreparedReading, type StoryWord } from '@lee-conmigo/story-engine';
import { Button, ChevronLeftIcon, ClosingCard, colors, fontFamily, HelpSheet, ReadingText, RoundButton, useLayout } from '@lee-conmigo/ui-native';
import { progressStoreFor } from '../app-state';
import { STAR_IMAGES } from '../kitewise-art';
import { notebookSaverFor } from '../notebook-save';
import { useMovementBreak } from '../movement';
import { useReadingSession, type ReadingSession } from '../session/use-reading-session';
import { speak, stopSpeaking } from '../tts';
import { editionProgressStore } from '../reading/progress';
import { READER_COPY } from '../reading/copy';
import { loadReaderFont, MAX_READER_FONT, MIN_READER_FONT, saveReaderFont } from '../reading/preferences';
import { SceneArt } from '../reading/scene-art';
import { MovementBreakScreen } from './movement-break-screen';
import type { ReadingScreenProps } from './reading-screen';

const normalWord = (): WordMark => ({ dotted: false, echoText: false, pulse: false });

/** The prepared reader reuses the session domain; its only audio capability is word pronunciation. */
export function SceneReadingScreen({ prepared, profile, energy, goalMinutes, focusReading = false, movementBreaks = false, onExit, story: original }: ReadingScreenProps & { prepared: PreparedReading }) {
  const layout = useLayout();
  const insets = useSafeAreaInsets();
  const c = READER_COPY[original.language];
  const [fontSize, setFontSize] = useState(() => loadReaderFont(profile.id, original.level));
  const [helpWord, setHelpWord] = useState<string | null>(null);
  const [resting, setResting] = useState(false);
  const store = useMemo(() => editionProgressStore(progressStoreFor(profile.id), prepared), [profile.id, prepared]);
  const prefs = useMemo(() => ({ ...defaultPrefs, audience: original.level <= 2 ? 'explorador' as const : 'lector' as const, textSize: fontSize }), [original.level, fontSize]);
  const session = useReadingSession(prepared.story, { store, prefs, freeReading: true, enablePractice: true, energy: energy ?? undefined, dailyGoalMinutes: goalMinutes, holdAtPageEnd: resting });
  const { flow, page, pageIndex, actions } = session;
  const actionsRef = useRef(actions);
  actionsRef.current = actions;
  const anchor = prepared.anchors[pageIndex];
  const sourcePage = original.pages[anchor.pageIndex];
  const movement = useMovementBreak(movementBreaks, profile.id, flow.screen === 'reading');
  const sourcePageDone = prepared.anchors[pageIndex + 1]?.pageIndex !== anchor.pageIndex;
  const sideBySide = !layout.portrait;
  const artHeight = Math.max(80, layout.height - insets.top - insets.bottom - 128);


  useEffect(() => saveReaderFont(profile.id, fontSize), [profile.id, fontSize]);
  useEffect(() => {
    if (movement.due && flow.screen === 'pageDone' && sourcePageDone && pageIndex < prepared.story.pages.length - 1) setResting(true);
  }, [movement.due, flow.screen, sourcePageDone, pageIndex, prepared.story.pages.length]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => { if (state !== 'active') stopSpeaking(); });
    return () => { listener.remove(); stopSpeaking(); };
  }, []);

  const closeHelp = () => { stopSpeaking(); setHelpWord(null); };
  const openWord = useCallback((word: StoryWord) => {
    const clean = word.text.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    if (!clean) return;
    actionsRef.current.rememberWord(vocabularyKey(clean));
    setHelpWord(clean);
    speak(clean, original.language);
  }, [original.language]);
  const openFragmentWord = useCallback((index: number) => openWord(session.words[index]), [openWord, session.words]);
  const exit = () => { stopSpeaking(); actions.leave(); onExit(); };
  const exitRef = useRef<() => boolean>(() => false);
  exitRef.current = () => {
    if (resting) return true;
    if (helpWord) closeHelp();
    else if (session.closing) { actions.finish(); onExit(); }
    else exit();
    return true;
  };
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => exitRef.current());
    return () => sub.remove();
  }, []);

  const illustration = <SceneArt illustration={page.illustration} crop={anchor.crop} maxHeight={focusReading ? Math.min(160, artHeight) : sideBySide ? artHeight : Math.min(300, layout.height * 0.30)} />;
  const passage = <><ReadingText page={page} words={session.words} markOf={normalWord} onWordPress={openFragmentWord} fontSize={fontSize} /><Text style={styles.hint}>{c.hint}</Text></>;

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }]}>
      <View style={[styles.header, layout.phone && styles.headerSmall]}>
        <RoundButton label={c.back} onPress={exit}><ChevronLeftIcon /></RoundButton>
        <View style={styles.heading}>
          <Text style={styles.bookTitle} numberOfLines={1} accessibilityLabel={original.title}>{original.title}</Text>
          <Text style={styles.part}>{c.part(pageIndex + 1, prepared.story.pages.length)} · {c.free}</Text>
        </View>
        <View style={styles.fontTools}>
          <FontButton label={c.smaller} glyph="A−" disabled={fontSize <= MIN_READER_FONT} onPress={() => setFontSize(n => Math.max(MIN_READER_FONT, n - 2))} />
          <FontButton label={c.larger} glyph="A+" disabled={fontSize >= MAX_READER_FONT} onPress={() => setFontSize(n => Math.min(MAX_READER_FONT, n + 2))} />
        </View>
      </View>

      {flow.screen === 'question' && session.checkpoint ? (
        <ReadingQuestion key={page.id} session={session} sourcePage={sourcePage} fontSize={fontSize} openWord={openWord} />
      ) : flow.screen === 'review' && flow.review ? (
        <SyllableReview session={session} language={original.language} />
      ) : (
        sideBySide ? (
          <View style={styles.landscapeBody}>
            <View style={styles.artSide}>{illustration}</View>
            <ScrollView key={page.id} style={styles.textScroll} contentContainerStyle={styles.landscapeText}>
              {passage}
            </ScrollView>
          </View>
        ) : (
          <ScrollView key={page.id} style={styles.flex} contentContainerStyle={styles.portraitBody}>
            <View style={styles.artColumn}>{illustration}</View>
            <View style={styles.textColumn}>{passage}</View>
          </ScrollView>
        )
      )}

      {(flow.screen === 'reading' || flow.screen === 'pageDone') && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 4 }]}>
          <FontButton label={c.previous} glyph="‹" disabled={!session.canGoBack || flow.screen !== 'reading'} onPress={actions.freeBack} />
          <View style={styles.progress} accessible accessibilityLabel={c.part(pageIndex + 1, prepared.story.pages.length)}>
            <View style={styles.track}><View style={[styles.fill, { width: `${100 * (pageIndex + 1) / prepared.story.pages.length}%` }]} /></View>
            <Text style={styles.part}>{pageIndex + 1}/{prepared.story.pages.length}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={pageIndex === prepared.story.pages.length - 1 ? c.finish : c.next} accessibilityState={{ disabled: flow.screen !== 'reading' }} disabled={flow.screen !== 'reading'} onPress={actions.freeAdvance} style={styles.nextButton}>
            <Text style={styles.nextGlyph}>{pageIndex === prepared.story.pages.length - 1 ? '✓' : '›'}</Text>
          </Pressable>
        </View>
      )}

      {flow.screen === 'prep' && (
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.prepCenter}>
            <View style={styles.prepCard}>
              <Text style={styles.prepTitle}>{c.welcome}</Text>
              <Text style={styles.prepText}>{c.welcomeHint}</Text>
              <Button label={c.start} onPress={actions.begin} />
            </View>
          </ScrollView>
        </View>
      )}
      {session.closing && (
        <ClosingCard name={profile.name} stars={session.closing.stars} reason={session.closing.reason} starImages={STAR_IMAGES} notebook={notebookSaverFor(profile.id, 'lectura', original.language)} stats={[{ label: c.practice, value: session.elapsed }, { label: c.words, value: String(session.closing.returning) }]} onAgain={() => { actions.finish(); actions.restart(); }} onDone={focus => { actions.finish(focus); onExit(); }} />
      )}
      {resting && <MovementBreakScreen n={movement.count} lang={original.language} onDone={() => { movement.taken(); setResting(false); }} />}
      <HelpSheet word={helpWord} entry={helpWord ? lookupVocabulary(original, helpWord) : undefined} audience={prefs.audience} onListen={() => { if (helpWord) speak(helpWord, original.language); }} onClose={closeHelp} />
    </View>
  );
}

function FontButton({ label, glyph, disabled, onPress }: { label: string; glyph: string; disabled?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} style={[styles.fontButton, disabled && styles.disabled]}><Text style={styles.fontGlyph}>{glyph}</Text></Pressable>;
}

function ReadingQuestion({ session, sourcePage, fontSize, openWord }: { session: ReadingSession; sourcePage: ReadingSession['page']; fontSize: number; openWord: (word: StoryWord) => void }) {
  const [reread, setReread] = useState(false);
  const c = READER_COPY[session.story.language];
  const q = session.checkpoint!;
  const answer = session.flow.answer;
  const correct = answer === q.correctIndex;
  const words = useMemo(() => tokenizePage(sourcePage), [sourcePage]);
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.practiceBody}>
      <View style={styles.practiceColumn}>
        <Text style={styles.eyebrow}>{c.question}</Text>
        <Text style={[styles.question, { fontSize: Math.max(24, fontSize), lineHeight: Math.round(Math.max(24, fontSize) * 1.5) }]}>{q.prompt}</Text>
        {q.options.map((option, i) => <Pressable key={i} accessibilityRole="button" accessibilityLabel={option.text} accessibilityState={{ selected: answer === i }} onPress={() => session.actions.answerQuestion(i)} style={[styles.option, answer === i && styles.optionSelected]}><Text style={[styles.optionText, { fontSize, lineHeight: Math.round(fontSize * 1.6) }]}>{option.text}</Text></Pressable>)}
        {answer !== null && <Text accessibilityLiveRegion="polite" style={styles.feedback}>{correct ? q.correctFeedback : q.retryFeedback}</Text>}
        <Button label={reread ? c.hideText : c.reread} variant="secondary" onPress={() => setReread(v => !v)} />
        {reread && <View style={styles.excerpt}><ReadingText page={sourcePage} words={words} markOf={normalWord} onWordPress={i => openWord(words[i])} fontSize={fontSize} /></View>}
        <Button label={c.continue} disabled={!correct} onPress={session.actions.continueQuestion} />
      </View>
    </ScrollView>
  );
}

function SyllableReview({ session, language }: { session: ReadingSession; language: 'es' | 'en' }) {
  const c = READER_COPY[language];
  const review = session.flow.review!;
  const word = review.words[review.index];
  const tiles = tilesOf(word);
  const complete = isWordComplete(review);
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.practiceBody}>
      <View style={styles.practiceColumn}>
        <Text style={styles.eyebrow}>{c.review}</Text><Text style={styles.prepText}>{c.reviewHint}</Text>
        <Text style={styles.builtWord} accessibilityLiveRegion="polite">{review.built.length ? review.built.map(i => tiles[i]).join(' · ') : '· · ·'}</Text>
        <View style={styles.tiles}>{tiles.map((tile, i) => <Pressable key={i} accessibilityRole="button" accessibilityLabel={`${tile}, ${i + 1}`} accessibilityState={{ disabled: review.built.includes(i) }} disabled={review.built.includes(i)} onPress={() => session.actions.reviewTap(i)} style={[styles.tile, review.built.includes(i) && styles.disabled]}><Text style={styles.tileText}>{tile}</Text></Pressable>)}</View>
        <Button label={c.listen} variant="secondary" onPress={() => speak(word.key, language)} />
        <Text style={styles.feedback} accessibilityLiveRegion="polite">{complete ? c.built : review.wrong !== null ? c.tryTile : ' '}</Text>
        <Button label={review.index === review.words.length - 1 ? c.doneReview : c.nextWord} disabled={!complete} onPress={session.actions.reviewNext} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper }, flex: { flex: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  headerSmall: { paddingHorizontal: 12, paddingVertical: 4, gap: 8 }, heading: { flex: 1, minWidth: 0, gap: 4 },
  bookTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.navy }, part: { fontFamily: fontFamily.ui.semibold, fontSize: 12, color: colors.inkSoft },
  fontTools: { flexDirection: 'row', gap: 6 }, fontButton: { minWidth: 44, minHeight: 48, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 14, backgroundColor: '#fff' },
  fontGlyph: { fontFamily: fontFamily.ui.extrabold, fontSize: 21, color: colors.navy }, disabled: { opacity: 0.35 },
  portraitBody: { padding: 16, gap: 18, alignItems: 'center' },
  landscapeBody: { flex: 1, minHeight: 0, flexDirection: 'row', gap: 12, padding: 12 },
  artColumn: { width: '100%', maxWidth: 740 }, artSide: { width: '38%', justifyContent: 'center' },
  textColumn: { width: '100%', maxWidth: 740 }, textScroll: { flex: 1, minWidth: 0 }, landscapeText: { paddingHorizontal: 12, paddingVertical: 8 },
  hint: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 20, color: colors.inkSoft, marginTop: 16 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 4, backgroundColor: colors.paper },
  progress: { flex: 1, gap: 3 }, track: { height: 3, backgroundColor: colors.line, borderRadius: 2 }, fill: { height: 3, backgroundColor: colors.gold, borderRadius: 2 },
  nextButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gold, boxShadow: '0px 3px 8px rgba(40,30,0,0.15)' }, nextGlyph: { fontFamily: fontFamily.ui.black, fontSize: 32, lineHeight: 38, color: colors.navy },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(20,22,28,.4)' }, prepCenter: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  prepCard: { width: '100%', maxWidth: 540, borderRadius: 24, padding: 28, gap: 24, backgroundColor: colors.paper }, prepTitle: { fontFamily: fontFamily.ui.black, fontSize: 28, color: colors.navy }, prepText: { fontFamily: fontFamily.read.regular, fontSize: 21, lineHeight: 34, color: colors.ink },
  practiceBody: { padding: 24, alignItems: 'center', flexGrow: 1, justifyContent: 'center' }, practiceColumn: { width: '100%', maxWidth: 740, gap: 20 }, eyebrow: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.navy },
  question: { fontFamily: fontFamily.read.bold, color: colors.ink, lineHeight: 40 }, option: { borderRadius: 18, padding: 20, borderWidth: 2, borderColor: colors.line, backgroundColor: '#fff' }, optionSelected: { borderColor: colors.brand, backgroundColor: colors.brand50 }, optionText: { fontFamily: fontFamily.read.regular, color: colors.ink, lineHeight: 38 },
  feedback: { fontFamily: fontFamily.read.regular, fontSize: 21, lineHeight: 32, color: colors.navy }, excerpt: { paddingVertical: 20, borderTopWidth: 1, borderTopColor: colors.line },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 }, tile: { minWidth: 64, minHeight: 64, borderRadius: 16, padding: 16, backgroundColor: colors.brand50, borderWidth: 2, borderColor: colors.brand100, alignItems: 'center', justifyContent: 'center' }, tileText: { fontFamily: fontFamily.read.bold, fontSize: 27, color: colors.navy }, builtWord: { fontFamily: fontFamily.read.bold, fontSize: 34, lineHeight: 50, color: colors.navy, minHeight: 64 },
});

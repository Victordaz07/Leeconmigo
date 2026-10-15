import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Story } from '@lee-conmigo/contracts';
import { copy, isBalloonPage, subjectById, wordMark, type WordMark } from '@lee-conmigo/ui-core';
import { Button, Card, CoachBubble, colors, ComicPage, DialogCard, fontFamily, gradients, GradientView, HelpSheet, MicBadge, MicOffIcon, radius, readSize, ReadingRail, ReadingText, SubjectTab } from '@lee-conmigo/ui-native';
import { progressStore } from '../app-state';
import { useReadingSession, type ReadingSession } from '../session/use-reading-session';
import { storyImage } from '../story-assets';

const lectura = subjectById('lectura');

/** Letra de lectura por banda de nivel (Kitewise `--read-size-*`: 1–2, 3–4, 5–6). */
const readFontFor = (level: number) => (level <= 2 ? readSize.g12 : level <= 4 ? readSize.g34 : readSize.g56);

/**
 * Lectura dentro del cuaderno (Kitewise B9, G7, G8; docs/13 K2). Riel izquierdo con las páginas, el micrófono, la ayuda y
 * escuchar; la página según su tipo (cómic con globos, o ilustración grande con el texto en una hoja de papel); el coach
 * como estrella con globo. Estados: pausa ámbar (B11), sin micrófono (G11), ayuda de palabra (G13).
 * Con `FakeReadingEngine` la lectura se simula con el panel DEV (solo en desarrollo) hasta la voz real (RN-07).
 */
export function ReadingScreen({ story, onExit }: { story: Story; onExit: () => void }) {
  const session = useReadingSession(story, { store: progressStore });
  const { flow, reading, view, actions, prefs } = session;
  const insets = useSafeAreaInsets();

  const markOf = useCallback((i: number) => wordMark(i, reading, flow.screen, prefs), [reading, flow.screen, prefs]);
  const exit = () => {
    actions.leave();
    onExit();
  };

  // El indicador del micrófono nunca miente (docs/06): antes de empezar no escucha; sin permiso o en modo libre no hay micrófono.
  const mic = session.freeReading || session.voiceProblem ? null : { tone: flow.screen === 'prep' ? ('idle' as const) : view.micTone, listening: flow.screen === 'reading' && view.listening };
  const inReading = flow.screen === 'reading';

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left }]}>
      <ReadingRail
        page={session.pageIndex + 1}
        pageCount={story.pages.length}
        onBack={exit}
        mic={mic}
        onHelp={inReading && !session.freeReading ? actions.askHelp : undefined}
        onListen={inReading && !session.freeReading ? actions.readStart : undefined}
        onNextPage={inReading && session.freeReading ? actions.freeAdvance : undefined}
      />
      <View style={[styles.main, { paddingRight: insets.right }]}>
        <PageView session={session} markOf={markOf} />

        {inReading && !session.showPauseCard && (
          <View style={styles.coach} pointerEvents="none">
            <CoachBubble message={session.freeReading ? copy.states.freeHint : view.feedback} />
          </View>
        )}

        {__DEV__ && <DevPanel session={session} />}

        {flow.screen === 'prep' && <PrepOverlay session={session} />}
        {flow.screen === 'pageDone' && (
          <View style={styles.toast} pointerEvents="none">
            <Text style={styles.toastText}>{copy.pageDone.title}</Text>
          </View>
        )}
        {flow.screen === 'end' && <EndOverlay session={session} onExit={exit} />}

        {session.showPauseCard && (
          <DialogCard icon={<MicBadge tone="warn" size={96} />} title={copy.states.pauseTitle} message={copy.states.pauseMessage}>
            <Button label={copy.states.pauseStop} variant="secondary" onPress={exit} />
            <Button label={copy.states.pauseContinue} onPress={actions.dismissPause} />
          </DialogCard>
        )}

        {session.voiceProblem && (
          <DialogCard
            icon={
              <GradientView gradient={gradients.micIdle} style={styles.micOff}>
                <MicOffIcon size={52} />
              </GradientView>
            }
            title={copy.states.voiceTitle}
            message={session.voiceProblem === 'permission-denied' ? copy.states.voiceMessage : copy.states.voiceUnavailableMessage}
          >
            {session.voiceProblem === 'permission-denied' && <Button label={copy.states.voiceAskAdult} onPress={actions.requestVoicePermission} />}
            <Button label={copy.states.voiceFreeReading} variant="secondary" onPress={actions.startFreeReading} />
          </DialogCard>
        )}
      </View>

      <HelpSheet word={session.help?.word ?? null} entry={session.help?.entry} audience={prefs.audience} onListen={actions.pronounce} onClose={actions.closeHelp} />
    </View>
  );
}

/** La página según su tipo, a lo más grande que quepa en el espacio disponible. */
function PageView({ session, markOf }: { session: ReadingSession; markOf: (i: number) => WordMark }) {
  const { story, page, words, actions, view, flow, reading } = session;
  const [area, setArea] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setArea((a) => (a.width === width && a.height === height ? a : { width, height }));
  };
  const image = storyImage(page.illustration.src);
  const ratio = page.illustration.width / page.illustration.height;

  if (isBalloonPage(page)) {
    // Cómic con globos dibujados (G7): la ilustración completa, lo más grande que quepa.
    const width = Math.floor(Math.min(area.width - 32, (area.height - 32) * ratio));
    const height = Math.floor(width / ratio);
    return (
      <View style={styles.comicArea} onLayout={onLayout}>
        {width > 0 && (
          <View style={styles.comicFrame}>
            <ComicPage
              page={page}
              words={words}
              image={image}
              width={width}
              height={height}
              currentBlock={view.currentBlock}
              highlightActive={flow.screen === 'reading' && reading.hasHeardVoice}
              markOf={markOf}
              onWordPress={actions.tapWord}
            />
          </View>
        )}
      </View>
    );
  }

  // Página de texto (B9): la ilustración de fondo y el texto en una hoja de papel a la derecha. El texto manda (docs/05).
  const progress = words.length ? Math.min(1, (reading.hasHeardVoice ? reading.currentWordIndex : 0) / words.length) : 0;
  return (
    <View style={styles.textArea} onLayout={onLayout}>
      {image && <Image source={image} style={FILL} resizeMode="cover" accessibilityLabel={page.illustration.alt ?? ''} />}
      <View style={styles.sheet}>
        <View style={styles.sheetHead}>
          <Text style={styles.sheetTitle} numberOfLines={1}>
            {story.title}
          </Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
          <Text style={styles.elapsed}>{copy.reading.elapsed(session.elapsed)}</Text>
        </View>
        <ScrollView style={styles.flex} contentContainerStyle={styles.sheetBody}>
          <ReadingText page={page} words={words} markOf={markOf} onWordPress={actions.tapWord} fontSize={readFontFor(story.level)} currentParagraph={session.currentParagraph} />
        </ScrollView>
      </View>
      <View style={styles.tab}>
        <SubjectTab label={lectura.tab} gradient={gradients[lectura.gradientToken]} active />
      </View>
    </View>
  );
}

function PrepOverlay({ session }: { session: ReadingSession }) {
  const audience = session.prefs.audience;
  return (
    <View style={styles.overlay}>
      <Card style={styles.overlayCard}>
        <Text style={styles.overlayTitle}>{copy.prep.title[audience]}</Text>
        {copy.prep.tips[audience].map((tip) => (
          <View key={tip.text} style={styles.tip}>
            <View style={[styles.tipIcon, { backgroundColor: tip.color }]}>
              <Text style={styles.tipIconText}>{tip.icon}</Text>
            </View>
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}
        <Button label={copy.prep.start} large onPress={session.actions.begin} />
      </Card>
    </View>
  );
}

/** Fin de la historia. TODO(K3): pantalla de cierre de Kitewise (B13: estrellas por esfuerzo, papalote, carita de enfoque). */
function EndOverlay({ session, onExit }: { session: ReadingSession; onExit: () => void }) {
  return (
    <View style={styles.overlay}>
      <Card style={styles.overlayCard}>
        <Text style={styles.overlayTitle}>{copy.end.title}</Text>
        <Text style={styles.endStat}>
          {copy.end.time}: {session.elapsed}
        </Text>
        <View style={styles.row}>
          <Button label={copy.end.again} onPress={session.actions.restart} />
          <Button label={copy.nav.home} variant="secondary" onPress={onExit} />
        </View>
      </Card>
    </View>
  );
}

/** Panel de simulación (docs/04): dispara los mismos eventos que el motor real. Nunca llega a la app de los niños. */
function DevPanel({ session }: { session: ReadingSession }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.dev}>
      <Pressable onPress={() => setOpen((o) => !o)}>
        <Text style={styles.devTitle}>DEV ⚙ {open ? '▾' : '▸'}</Text>
      </Pressable>
      {open && (
        <View style={styles.devButtons}>
          <DevChip label={session.dev.auto ? '■ Parar lectura automática' : '▶ Lectura automática'} onPress={session.dev.toggleAuto} />
          {session.dev.simulations.map((s) => (
            <DevChip key={s.label} label={s.label} onPress={s.run} />
          ))}
        </View>
      )}
    </View>
  );
}

const DevChip = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.devChip, pressed && { opacity: 0.6 }]}>
    <Text style={styles.devChipText}>{label}</Text>
  </Pressable>
);

/** Llenar el contenedor con ancho/alto explícitos (en React Native Web `absoluteFill` solo no basta para una imagen). */
const FILL = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } as const;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, flexDirection: 'row', backgroundColor: colors.app },
  main: { flex: 1 },
  comicArea: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  comicFrame: { borderRadius: radius.tile, overflow: 'hidden', boxShadow: '0px 10px 26px rgba(30, 35, 64, 0.18)' },
  textArea: { flex: 1, overflow: 'hidden', backgroundColor: colors.paper },
  sheet: { position: 'absolute', top: 36, bottom: 36, right: 56, width: '38%', minWidth: 340, backgroundColor: colors.paper, borderRadius: radius.panel, borderWidth: 2, borderColor: '#dfe3d8', boxShadow: '0px 18px 40px rgba(30, 35, 64, 0.22)', overflow: 'hidden' },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 26, paddingTop: 22, paddingBottom: 8 },
  sheetTitle: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.inkSoft, maxWidth: '40%' },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.track, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5, backgroundColor: colors.ok },
  elapsed: { fontFamily: fontFamily.ui.bold, fontSize: 12, color: colors.muted },
  sheetBody: { paddingHorizontal: 28, paddingTop: 30, paddingBottom: 40 },
  tab: { position: 'absolute', right: 0, top: 90 },
  coach: { position: 'absolute', left: 24, bottom: 24 },
  micOff: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 8, borderColor: '#e6e9f1' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(20, 22, 28, 0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  overlayCard: { width: '100%', maxWidth: 560, gap: 16, padding: 28, borderRadius: radius.panel },
  overlayTitle: { fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.navy, textAlign: 'center' },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  tipIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  tipIconText: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  tipText: { flex: 1, fontFamily: fontFamily.ui.bold, fontSize: 18, color: colors.inkSoft },
  endStat: { fontFamily: fontFamily.ui.extrabold, fontSize: 22, color: colors.inkSoft, textAlign: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  toast: { position: 'absolute', alignSelf: 'center', top: '40%', backgroundColor: colors.ok, borderRadius: radius.pill, paddingHorizontal: 28, paddingVertical: 14, boxShadow: '0px 12px 28px rgba(34, 169, 92, 0.35)' },
  toastText: { fontFamily: fontFamily.ui.black, fontSize: 24, color: '#ffffff' },
  dev: { position: 'absolute', top: 12, left: 12, maxWidth: 560, backgroundColor: colors.dev, borderRadius: 16, padding: 10, gap: 8, opacity: 0.95 },
  devTitle: { fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.devInk },
  devButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  devChip: { backgroundColor: colors.dev2, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  devChipText: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.devInk },
});

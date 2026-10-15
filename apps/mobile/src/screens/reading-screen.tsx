import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Story } from '@lee-conmigo/contracts';
import { copy, wordMark } from '@lee-conmigo/ui-core';
import { Button, Card, ChevronLeftIcon, CoachBar, colors, fontFamily, HelpSheet, radius, ReadingText, RoundButton } from '@lee-conmigo/ui-native';
import { useReadingSession, type ReadingSession } from '../session/use-reading-session';

/**
 * Pantalla de lectura nativa (RN-04, docs/11). Con `FakeReadingEngine`: la lectura se simula con el panel de desarrollo
 * (abajo, solo en `__DEV__`) hasta conectar la voz real (RN-07). Modo "illustrated reader" (texto); el cómic con globos
 * sobre la ilustración llega en RN-05.
 */
export function ReadingScreen({ story, onExit }: { story: Story; onExit: () => void }) {
  const session = useReadingSession(story);
  const { flow, reading, view, words, page, pageIndex, actions, prefs } = session;
  const insets = useSafeAreaInsets();

  const markOf = useCallback((i: number) => wordMark(i, reading, flow.screen, prefs), [reading, flow.screen, prefs]);
  const exit = () => {
    actions.leave();
    onExit();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12, paddingLeft: insets.left + 20, paddingRight: insets.right + 20 }]}>
      <View style={styles.top}>
        <RoundButton onPress={exit} label="Volver">
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={styles.title} numberOfLines={1}>
          {story.title}
        </Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{copy.reading.pageOf(pageIndex + 1, story.pages.length)}</Text>
        </View>
      </View>

      <ScrollView style={styles.card} contentContainerStyle={styles.cardContent}>
        <ReadingText page={page} words={words} markOf={markOf} onWordPress={actions.tapWord} fontSize={prefs.textSize} />
      </ScrollView>

      {/* Antes de empezar el micrófono NO escucha: el indicador nunca debe decir lo contrario (docs/06). */}
      <CoachBar
        tone={flow.screen === 'prep' ? 'idle' : view.micTone}
        listening={view.listening}
        micLabel={flow.screen === 'prep' ? copy.mic.waiting : view.micLabel}
        feedback={view.feedback}
        elapsed={copy.reading.elapsed(session.elapsed)}
      />

      {__DEV__ && <DevPanel session={session} />}

      {flow.screen === 'prep' && <PrepOverlay session={session} />}
      {flow.screen === 'pageDone' && (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{copy.pageDone.title}</Text>
        </View>
      )}
      {flow.screen === 'end' && <EndOverlay session={session} onExit={exit} />}

      <HelpSheet word={session.help?.word ?? null} entry={session.help?.entry} audience={prefs.audience} onListen={actions.pronounce} onClose={actions.closeHelp} />
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app, gap: 14 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  title: { flex: 1, fontFamily: fontFamily.ui.black, fontSize: 24, color: colors.navy },
  chip: { backgroundColor: '#ffffff', borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  chipText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.inkSoft },
  card: { flex: 1, backgroundColor: colors.cream, borderRadius: radius.panel, boxShadow: '0px 1px 0px #e3e8f4, 0px 10px 26px rgba(30, 35, 64, 0.08)' },
  cardContent: { padding: 32 },
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
  dev: { backgroundColor: colors.dev, borderRadius: 16, padding: 10, gap: 8 },
  devTitle: { fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.devInk },
  devButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  devChip: { backgroundColor: colors.dev2, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  devChipText: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.devInk },
});

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Story } from '@lee-conmigo/contracts';
import { copy, isBalloonPage, subjectById, wordMark, type WordMark } from '@lee-conmigo/ui-core';
import { Button, Card, ChevronLeftIcon, ClosingCard, CoachBubble, colors, ComicPage, DialogCard, FocusReadingBar, fontFamily, gradients, GradientView, HelpSheet, MicBadge, MicOffIcon, radius, readSize, ReadingRail, ReadingText, RoundButton, SubjectTab, useLayout } from '@lee-conmigo/ui-native';
import type { Energy } from '@lee-conmigo/ui-core';
import { progressStoreFor, type ChildProfile } from '../app-state';
import { useReadingSession, type ReadingSession } from '../session/use-reading-session';
import { SHOW_DEV_TOOLS } from '../dev-tools';
import { useMovementBreak } from '../movement';
import { MovementBreakScreen } from './movement-break-screen';
import { storyImage } from '../story-assets';

const lectura = subjectById('lectura');

/** Letra de lectura por banda de nivel (Kitewise `--read-size-*`: 1–2, 3–4, 5–6). */
const readFontFor = (level: number, phone: boolean) => {
  const base = level <= 2 ? readSize.g12 : level <= 4 ? readSize.g34 : readSize.g56;
  // En teléfono, un poco más chica (nunca menos de 18 px: docs/06 legibilidad).
  return phone ? Math.max(18, Math.round(base * 0.8)) : base;
};

/**
 * Por debajo de esta escala los globos del cómic quedan con letra muy chica: el cómic se muestra como ilustración arriba (o
 * a un lado) y el texto en la hoja de lectura. Arte y texto son capas separadas (docs/05), así que se puede.
 */
const MIN_COMIC_SCALE = 0.42;

/** Cómo se acomoda la página: `side` (hoja a la derecha sobre la ilustración), `stack` (ilustración arriba, texto abajo), `split` (ilustración a la izquierda, texto a la derecha). */
type PageMode = 'side' | 'stack' | 'split';

/**
 * Lectura dentro del cuaderno (Kitewise B9, G7, G8; docs/13 K2). Riel izquierdo con las páginas, el micrófono, la ayuda y
 * escuchar; la página según su tipo (cómic con globos, o ilustración grande con el texto en una hoja de papel); el coach
 * como estrella con globo. Estados: pausa ámbar (B11), sin micrófono (G11), ayuda de palabra (G13).
 * Con `FakeReadingEngine` la lectura se simula con el panel DEV (solo en desarrollo) hasta la voz real (RN-07).
 */
interface ReadingScreenProps {
  story: Story;
  profile: ChildProfile;
  /** Lo que eligió en "¿Cómo llegas hoy?" (B2), si se preguntó. */
  energy: Energy | null;
  /** Minutos de la misión de hoy (los de la energía elegida, o la meta del padre). */
  goalMinutes: number;
  /** Modo Enfoque (B10): una línea a la vez, ilustración desenfocada de fondo y tres botones. */
  focusReading?: boolean;
  /** Modo Enfoque: pausa de movimiento al terminar una página, si ya toca (B12). */
  movementBreaks?: boolean;
  onExit: () => void;
}

export function ReadingScreen({ story, profile, energy, goalMinutes, focusReading = false, movementBreaks = false, onExit }: ReadingScreenProps) {
  const [resting, setResting] = useState(false);
  const session = useReadingSession(story, { store: progressStoreFor(profile.id), energy: energy ?? undefined, dailyGoalMinutes: goalMinutes, freeReading: profile.freeReading, holdAtPageEnd: resting });
  // Pausa de movimiento (B12): el reloj cuenta mientras lee; si ya toca, se ofrece al terminar una página (no la última,
  // que lleva al cierre) y la página siguiente espera.
  const movement = useMovementBreak(movementBreaks, profile.id, session.flow.screen === 'reading');
  const lastPage = session.pageIndex === story.pages.length - 1;
  useEffect(() => {
    if (movement.due && session.flow.screen === 'pageDone' && !lastPage) setResting(true);
  }, [movement.due, session.flow.screen, lastPage]);
  const { flow, reading, view, actions, prefs } = session;
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  // Vertical: barra abajo (G5). Acostado: riel a la izquierda, compacto en teléfono.
  const horizontalBar = layout.portrait;
  const pageMode: PageMode = layout.portrait ? 'stack' : layout.short || layout.narrow ? 'split' : 'side';

  const markOf = useCallback((i: number) => wordMark(i, reading, flow.screen, prefs), [reading, flow.screen, prefs]);
  const exit = () => {
    actions.leave();
    onExit();
  };

  // El indicador del micrófono nunca miente (docs/06): antes de empezar no escucha; sin permiso o en modo libre no hay micrófono.
  const mic = session.freeReading || session.voiceProblem ? null : { tone: flow.screen === 'reading' ? view.micTone : ('idle' as const), listening: flow.screen === 'reading' && view.listening };
  const inReading = flow.screen === 'reading';
  const rail = (
    <ReadingRail
      page={session.pageIndex + 1}
      pageCount={story.pages.length}
      onBack={exit}
      mic={mic}
      onHelp={inReading && !session.freeReading ? actions.askHelp : undefined}
      onListen={inReading && !session.freeReading ? actions.readStart : undefined}
      onNextPage={inReading && session.freeReading ? actions.freeAdvance : undefined}
      horizontal={horizontalBar}
      compact={layout.phone}
      bottomInset={insets.bottom}
    />
  );

  const focusBar = (
    <FocusReadingBar
      mic={mic}
      onHelp={inReading && !session.freeReading ? actions.askHelp : undefined}
      onListen={inReading && !session.freeReading ? actions.readStart : undefined}
      onNextPage={inReading && session.freeReading ? actions.freeAdvance : undefined}
      compact={layout.phone}
    />
  );

  return (
    <View style={[styles.screen, horizontalBar && styles.screenColumn, { paddingTop: insets.top, paddingBottom: horizontalBar || focusReading ? 0 : insets.bottom, paddingLeft: insets.left }]}>
      {!horizontalBar && !focusReading && rail}
      <View style={[styles.main, { paddingRight: insets.right }]}>
        {focusReading ? (
          <FocusPage session={session} markOf={markOf} phone={layout.phone} onBack={exit} bar={focusBar} bottomInset={insets.bottom} />
        ) : (
          <PageView session={session} markOf={markOf} mode={pageMode} phone={layout.phone} />
        )}

        {/* En Modo Enfoque no hay globo del coach: la línea resaltada y el micrófono bastan (menos cosas en pantalla). */}
        {inReading && !session.showPauseCard && !focusReading && (
          <View style={[styles.coach, layout.phone && styles.coachSmall]} pointerEvents="none">
            <CoachBubble message={session.freeReading ? copy.states.freeHint : view.feedback} compact={layout.phone} />
          </View>
        )}

        {SHOW_DEV_TOOLS && <DevPanel session={session} />}

        {flow.screen === 'prep' && <PrepOverlay session={session} />}
        {flow.screen === 'pageDone' && (
          <View style={styles.toast} pointerEvents="none">
            <Text style={styles.toastText}>{copy.pageDone.title}</Text>
          </View>
        )}
        {session.closing && (
          <ClosingCard
            name={profile.name}
            stars={session.closing.stars}
            reason={session.closing.reason}
            stats={[
              { label: 'Tiempo', value: `${session.closing.minutes} min` },
              { label: 'Papalote', value: `+${session.closing.kiteMeters} m ↑` },
              { label: 'Sello del día', value: session.closing.dailyStamp ? '★' : '–' },
              { label: 'Vuelven', value: `${session.closing.returning} ${session.closing.returning === 1 ? 'palabra' : 'palabras'}` },
            ]}
            onAgain={() => {
              actions.finish();
              actions.restart();
            }}
            onDone={(focus) => {
              actions.finish(focus);
              onExit();
            }}
          />
        )}

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
      {horizontalBar && !focusReading && rail}

      {resting && (
        <MovementBreakScreen
          n={movement.count}
          lang={profile.language === 'en' ? 'en' : 'es'}
          onDone={() => {
            movement.taken();
            setResting(false);
          }}
        />
      )}
      <HelpSheet word={session.help?.word ?? null} entry={session.help?.entry} audience={prefs.audience} onListen={actions.pronounce} onClose={actions.closeHelp} />
    </View>
  );
}

/** La página según su tipo, a lo más grande que quepa en el espacio disponible. */
function PageView({ session, markOf, mode, phone }: { session: ReadingSession; markOf: (i: number) => WordMark; mode: PageMode; phone: boolean }) {
  const { story, page, words, actions, view, flow, reading } = session;
  const [area, setArea] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setArea((a) => (a.width === width && a.height === height ? a : { width, height }));
  };
  const image = storyImage(page.illustration.src);
  const ratio = page.illustration.width / page.illustration.height;

  const balloon = isBalloonPage(page);
  // Cómic con globos dibujados (G7): la ilustración completa, lo más grande que quepa — si así los globos se leen bien.
  const width = Math.floor(Math.min(area.width - 32, (area.height - 32) * ratio));
  const height = Math.floor(width / ratio);
  // En vertical siempre ilustración arriba y texto abajo (G5); acostado, el cómic completo si los globos se leen bien.
  const comicReadable = balloon && mode !== 'stack' && (area.width === 0 || width / page.illustration.width >= MIN_COMIC_SCALE);
  if (balloon && comicReadable) {
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

  // Página de texto (B9): la ilustración y el texto en una hoja de papel. El texto manda (docs/05). En pantallas chicas,
  // ilustración arriba y texto abajo (G5) o lado a lado. Un cómic con globos ilegibles a este tamaño se lee igual aquí.
  const progress = words.length ? Math.min(1, (reading.hasHeardVoice ? reading.currentWordIndex : 0) / words.length) : 0;
  const pageMode: PageMode = balloon && mode === 'side' ? 'split' : mode;
  const artBox =
    pageMode === 'stack'
      ? { width: area.width, height: Math.round(Math.min(area.height * 0.42, area.width / ratio)) }
      : pageMode === 'split'
        ? { width: Math.round(area.width * 0.42), height: area.height }
        : null;
  return (
    <View style={[styles.textArea, pageMode === 'split' && styles.textAreaRow]} onLayout={onLayout}>
      {image && artBox && <Image source={image} style={artBox} resizeMode="cover" accessibilityLabel={page.illustration.alt ?? ''} />}
      {image && !artBox && <Image source={image} style={FILL} resizeMode="cover" accessibilityLabel={page.illustration.alt ?? ''} />}
      <View style={pageMode === 'side' ? styles.sheet : styles.sheetInline}>
        <View style={[styles.sheetHead, pageMode !== 'side' && styles.sheetHeadSmall]}>
          <Text style={styles.sheetTitle} numberOfLines={1}>
            {story.title}
          </Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
          <Text style={styles.elapsed}>{copy.reading.elapsed(session.elapsed)}</Text>
        </View>
        <ScrollView style={styles.flex} contentContainerStyle={[styles.sheetBody, pageMode !== 'side' && styles.sheetBodySmall]}>
          <ReadingText page={page} words={words} markOf={markOf} onWordPress={actions.tapWord} fontSize={readFontFor(story.level, phone)} currentParagraph={session.currentParagraph} />
        </ScrollView>
      </View>
      {pageMode === 'side' && (
        <View style={styles.tab}>
          <SubjectTab label={lectura.tab} gradient={gradients[lectura.gradientToken]} active />
        </View>
      )}
    </View>
  );
}

/**
 * Lectura en Modo Enfoque (Kitewise B10): la ilustración queda desenfocada y tenue de fondo (no se quita, SPEC §1), el
 * texto en una sola columna con solo la línea actual oscura, y abajo tres botones. Sirve para páginas de texto y de cómic
 * (arte y texto son capas separadas, docs/05).
 */
function FocusPage({ session, markOf, phone, onBack, bar, bottomInset }: { session: ReadingSession; markOf: (i: number) => WordMark; phone: boolean; onBack: () => void; bar: ReactNode; bottomInset: number }) {
  const { story, page, words, actions, reading } = session;
  const image = storyImage(page.illustration.src);
  const progress = words.length ? Math.min(1, (reading.hasHeardVoice ? reading.currentWordIndex : 0) / words.length) : 0;
  // La hoja sigue a la línea que se lee: queda en el primer tercio de la vista, con la anterior todavía visible.
  const scroll = useRef<ScrollView>(null);
  const lineY = useRef(new Map<string, number>()).current;
  const [viewH, setViewH] = useState(0);
  const cur = session.currentParagraph;
  const at = (k: string) => lineY.get(k) ?? 0;
  const curY = cur && lineY.has(`${cur.block}:${cur.line}`) ? at('top') + at(`${cur.block}:-1`) + at(`${cur.block}:${cur.line}`) : undefined;
  useEffect(() => {
    if (curY !== undefined) scroll.current?.scrollTo({ y: Math.max(0, curY - viewH / 3), animated: true });
  }, [curY, viewH]);
  useEffect(() => lineY.clear(), [page, lineY]);
  return (
    <View style={[styles.textArea, styles.focusArea]}>
      {image && <Image source={image} style={[FILL, styles.focusArt]} blurRadius={14} resizeMode="cover" accessibilityLabel={page.illustration.alt ?? ''} />}
      <View style={[styles.focusTop, phone && styles.focusTopSmall]}>
        <RoundButton onPress={onBack} label="Volver">
          <ChevronLeftIcon />
        </RoundButton>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <Text style={styles.focusCount} accessibilityLabel={`Página ${session.pageIndex + 1} de ${story.pages.length}`}>
          {session.pageIndex + 1} / {story.pages.length}
        </Text>
      </View>
      <ScrollView ref={scroll} style={styles.flex} onLayout={(e) => setViewH(e.nativeEvent.layout.height)} contentContainerStyle={[styles.focusBody, phone && styles.focusBodySmall]}>
        <View style={styles.focusColumn} onLayout={(e) => lineY.set('top', e.nativeEvent.layout.y)}>
          <ReadingText
            page={page}
            words={words}
            markOf={markOf}
            onWordPress={actions.tapWord}
            fontSize={readFontFor(story.level, phone) + 2}
            currentParagraph={session.currentParagraph}
            dimRead
            onParagraphLayout={(b, l, y) => lineY.set(`${b}:${l}`, y)}
          />
        </View>
      </ScrollView>
      <View style={[styles.focusBottom, phone && styles.focusTopSmall, { paddingBottom: (phone ? 12 : 24) + bottomInset }]}>{bar}</View>
    </View>
  );
}

function PrepOverlay({ session }: { session: ReadingSession }) {
  const audience = session.prefs.audience;
  const { narrow, short } = useLayout();
  const small = narrow || short;
  return (
    <View style={styles.overlay}>
      <ScrollView style={styles.flex} contentContainerStyle={[styles.overlayCenter, small && styles.overlayCenterSmall]}>
      <Card style={[styles.overlayCard, small && styles.overlayCardSmall]}>
        <Text style={[styles.overlayTitle, small && styles.overlayTitleSmall]}>{copy.prep.title[audience]}</Text>
        {copy.prep.tips[audience].map((t) => (session.freeReading && t.icon === '2' ? { ...t, text: copy.prep.freeTip } : t)).map((tip) => (
          <View key={tip.text} style={styles.tip}>
            <View style={[styles.tipIcon, { backgroundColor: tip.color }]}>
              <Text style={styles.tipIconText}>{tip.icon}</Text>
            </View>
            <Text style={[styles.tipText, small && styles.tipTextSmall]}>{tip.text}</Text>
          </View>
        ))}
        <Button label={copy.prep.start} large={!small} onPress={session.actions.begin} />
      </Card>
      </ScrollView>
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
  screenColumn: { flexDirection: 'column' },
  textAreaRow: { flexDirection: 'row' },
  sheetInline: { flex: 1, backgroundColor: colors.paper },
  sheetHeadSmall: { paddingHorizontal: 18, paddingTop: 14 },
  sheetBodySmall: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 72 },
  coachSmall: { left: 12, bottom: 12 },
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
  focusArea: { backgroundColor: colors.paper },
  focusArt: { opacity: 0.22 },
  focusTop: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 36, paddingTop: 24 },
  focusTopSmall: { paddingHorizontal: 16, paddingTop: 12 },
  focusCount: { fontFamily: fontFamily.ui.black, fontSize: 15, color: colors.navy },
  focusBody: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingVertical: 24 },
  focusBodySmall: { paddingHorizontal: 20, paddingVertical: 16 },
  focusColumn: { width: '100%', maxWidth: 720 },
  focusBottom: { paddingHorizontal: 36 },
  micOff: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 8, borderColor: '#e6e9f1' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(20, 22, 28, 0.45)' },
  overlayCenter: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  overlayCenterSmall: { padding: 12 },
  overlayCardSmall: { padding: 18, gap: 10 },
  overlayTitleSmall: { fontSize: 24 },
  tipTextSmall: { fontSize: 16 },
  overlayCard: { width: '100%', maxWidth: 560, gap: 16, padding: 28, borderRadius: radius.panel },
  overlayTitle: { fontFamily: fontFamily.ui.black, fontSize: 30, color: colors.navy, textAlign: 'center' },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  tipIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  tipIconText: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  tipText: { flex: 1, fontFamily: fontFamily.ui.bold, fontSize: 18, color: colors.inkSoft },
  toast: { position: 'absolute', alignSelf: 'center', top: '40%', backgroundColor: colors.ok, borderRadius: radius.pill, paddingHorizontal: 28, paddingVertical: 14, boxShadow: '0px 12px 28px rgba(34, 169, 92, 0.35)' },
  toastText: { fontFamily: fontFamily.ui.black, fontSize: 24, color: '#ffffff' },
  dev: { position: 'absolute', top: 12, left: 12, maxWidth: 560, backgroundColor: colors.dev, borderRadius: 16, padding: 10, gap: 8, opacity: 0.95 },
  devTitle: { fontFamily: fontFamily.ui.black, fontSize: 13, color: colors.devInk },
  devButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  devChip: { backgroundColor: colors.dev2, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  devChipText: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.devInk },
});

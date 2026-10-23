import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Modal, PanResponder, Platform, Pressable, StyleSheet, Text, View, type GestureResponderEvent, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { IllustrationRef, PixelRect } from '@lee-conmigo/contracts';
import { constrainArt, fitArt, INITIAL_ART_POSE, MAX_ART_ZOOM, pinchArt, type ArtPose } from '@lee-conmigo/ui-core';
import { fontFamily, useLayout } from '@lee-conmigo/ui-native';
import { storyImage } from '../story-assets';

// RN Web needs an explicit browser gesture policy; native gestures use the responder system.
const browserTouchStyle: ViewStyle & { touchAction?: 'none' } = Platform.OS === 'web' ? { touchAction: 'none' } : {};

export const ART_COPY = {
  es: { open: 'Ampliar ilustración', close: 'Volver a leer', more: 'Acercar imagen', less: 'Alejar imagen', reset: 'Ajustar', hint: 'Separa dos dedos para acercar. Arrastra para explorar.', title: 'La ilustración' },
  en: { open: 'Enlarge illustration', close: 'Back to reading', more: 'Zoom in', less: 'Zoom out', reset: 'Fit', hint: 'Spread two fingers to zoom in. Drag to explore.', title: 'The illustration' },
} as const;

/** Separate modal: artwork gestures never compete with word pronunciation or page scrolling. */
export function IllustrationViewer({ illustration, crop, language, onClose }: { illustration: IllustrationRef; crop?: PixelRect; language: 'es' | 'en'; onClose: () => void }) {
  const layout = useLayout();
  const insets = useSafeAreaInsets();
  const c = ART_COPY[language];
  const region = crop ?? { x: 0, y: 0, width: illustration.width, height: illustration.height };
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [pose, setPose] = useState<ArtPose>(INITIAL_ART_POSE);
  const fitted = fitArt(region, viewport);
  const frame = useRef<View>(null);
  const origin = useRef({ x: 0, y: 0 });
  const current = useRef({ pose, fitted, viewport });
  current.current = { pose, fitted, viewport };
  const gesture = useRef<{ count: number; x: number; y: number; distance: number; pose: ArtPose } | null>(null);
  const responder = useMemo(() => {
    const sample = (event: GestureResponderEvent) => {
      const touches = event.nativeEvent.touches;
      if (!touches.length) return null;
      const a = touches[0];
      const b = touches[1] ?? a;
      return { count: touches.length, x: (a.pageX + b.pageX) / 2 - origin.current.x - current.current.viewport.width / 2, y: (a.pageY + b.pageY) / 2 - origin.current.y - current.current.viewport.height / 2, distance: Math.hypot(b.pageX - a.pageX, b.pageY - a.pageY) };
    };
    const begin = (event: GestureResponderEvent) => {
      const point = sample(event);
      gesture.current = point ? { ...point, pose: current.current.pose } : null;
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: begin,
      onPanResponderMove: event => {
        const point = sample(event);
        const start = gesture.current;
        if (!point || !start || start.count !== point.count) { begin(event); return; }
        const ratio = start.distance > 0 ? point.distance / start.distance : 1;
        const next = constrainArt(pinchArt(start.pose, start, point, ratio), current.current.fitted, current.current.viewport);
        current.current.pose = next;
        setPose(next);
      },
      onPanResponderRelease: () => { gesture.current = null; },
      onPanResponderTerminate: () => { gesture.current = null; },
    });
  }, []);
  useEffect(() => {
    setPose(INITIAL_ART_POSE);
    gesture.current = null;
  }, [viewport.width, viewport.height]);
  const changeZoom = (delta: number) => setPose(previous => constrainArt({ ...previous, zoom: previous.zoom + delta }, fitted, viewport));
  const scale = region.width > 0 ? fitted.width / region.width * pose.zoom : 0;
  return (
    <Modal visible animationType="none" onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']} presentationStyle="fullScreen">
      <View accessibilityViewIsModal style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }]}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{c.title}</Text>
          <Control label={c.close} onPress={onClose}><Text style={styles.label}>{c.close} ×</Text></Control>
        </View>
        <View ref={frame} testID="illustration-viewport" style={[styles.viewport, browserTouchStyle]} onLayout={event => {
          const { width, height } = event.nativeEvent.layout;
          setViewport({ width, height });
          frame.current?.measureInWindow((x, y) => { origin.current = { x, y }; });
        }} {...responder.panHandlers}>
          <View pointerEvents="none" style={{ position: 'absolute', overflow: 'hidden', width: region.width * scale, height: region.height * scale, left: (viewport.width - region.width * scale) / 2 + pose.x, top: (viewport.height - region.height * scale) / 2 + pose.y }}>
            <Image source={storyImage(illustration.src)} accessibilityLabel={illustration.alt} resizeMode="stretch" style={{ position: 'absolute', width: illustration.width * scale, height: illustration.height * scale, left: -region.x * scale, top: -region.y * scale }} />
          </View>
        </View>
        <View style={[styles.tools, { gap: layout.phone ? 8 : 16 }]}>
          <Control label={c.less} disabled={pose.zoom <= 1} onPress={() => changeZoom(-0.5)}><Text style={styles.glyph}>−</Text></Control>
          <Text style={styles.percentage} accessibilityLiveRegion="polite">{Math.round(pose.zoom * 100)}%</Text>
          <Control label={c.more} disabled={pose.zoom >= MAX_ART_ZOOM} onPress={() => changeZoom(0.5)}><Text style={styles.glyph}>+</Text></Control>
          <Control label={c.reset} onPress={() => setPose(INITIAL_ART_POSE)}><Text style={styles.label}>{c.reset}</Text></Control>
        </View>
        <Text style={styles.hint}>{c.hint}</Text>
      </View>
    </Modal>
  );
}
function Control({ label, onPress, disabled = false, children }: { label: string; onPress: () => void; disabled?: boolean; children: React.ReactNode }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={[styles.control, disabled && styles.disabled]}>{children}</Pressable>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#101727' }, header: { flexDirection: 'row', alignItems: 'center', padding: 8, gap: 8 },
  title: { flex: 1, minWidth: 0, color: '#fff', fontFamily: fontFamily.ui.extrabold, fontSize: 16, paddingLeft: 8 },
  viewport: { flex: 1, minHeight: 0, overflow: 'hidden' }, tools: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8 },
  control: { minHeight: 48, minWidth: 48, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#28344d' },
  label: { color: '#fff', fontFamily: fontFamily.ui.extrabold, fontSize: 15 }, glyph: { color: '#fff', fontSize: 28 },
  percentage: { color: '#fff', fontFamily: fontFamily.ui.semibold, minWidth: 48, textAlign: 'center' }, disabled: { opacity: 0.4 },
  hint: { color: '#dce5f5', textAlign: 'center', fontFamily: fontFamily.ui.semibold, fontSize: 12, paddingHorizontal: 12, paddingBottom: 8 },
});

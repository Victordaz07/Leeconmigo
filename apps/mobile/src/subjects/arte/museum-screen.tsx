import { useState } from 'react';
import { ImageBackground, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FRAME_IDS, MUSEUM_COPY, MUSEUM_FILTERS, PAPER_H, PAPER_W, frameOf, kindOf, museumWorks, type ArtLang, type ArtLibrary, type ArtProject, type FrameId, type MuseumFilter } from '@lee-conmigo/art-content';
import { ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { MUSEO_ART } from './art';
import { CreationThumb, hasThumb } from './creation-thumb';

/** Los marcos miden 3:2 (1024×683). */
const FRAME_ASPECT = 1024 / 683;
/** Color de cada marco para su botón (el mismo tono que el marco dibujado). */
const FRAME_DOT: Record<FrameId, string> = { coral: '#F2705A', turquoise: '#25B3A5', violet: '#8C63D8', yellow: '#F5B820' };

interface Props {
  lang: ArtLang;
  library: ArtLibrary;
  onBack: () => void;
  onOpen: (id: string) => void;
  onFrame: (id: string, frame: FrameId) => void;
}

/** Una obra enmarcada: la miniatura se coloca ENTERA en el hueco del marco (medido en el manifiesto): nunca se recorta el dibujo del niño. Un ritmo no tiene dibujo: lleva su ♪. */
function Framed({ project, width }: { project: ArtProject; width: number }) {
  const frame = MUSEO_ART.frames[frameOf(project)];
  const height = Math.round(width / FRAME_ASPECT);
  const [hx, hy, hw, hh] = frame.hole;
  const boxW = Math.round(hw * width);
  const boxH = Math.round(hh * height);
  const ratio = PAPER_W / PAPER_H;
  const thumbW = Math.min(boxW, Math.round(boxH * ratio));
  return (
    <View style={{ width, height }}>
      <View style={{ position: 'absolute', left: Math.round(hx * width), top: Math.round(hy * height), width: boxW, height: boxH, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8EC' }}>
        {hasThumb(project) ? <CreationThumb project={project} width={thumbW} bare /> : <Text style={[styles.note, { fontSize: Math.round(boxH * 0.5) }]}>♪</Text>}
      </View>
      <Image source={frame.source} resizeMode="stretch" accessible={false} style={{ position: 'absolute', left: 0, top: 0, width, height }} />
    </View>
  );
}

/** «Mi museo» (AR-M2): las creaciones colgadas en una pared, con marcos de colores. Solo se mira y se sigue creando; no sale del dispositivo (DA-12). */
export function MuseumScreen({ lang, library, onBack, onOpen, onFrame }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = MUSEUM_COPY[lang];
  const [filter, setFilter] = useState<MuseumFilter>('all');
  const works = museumWorks(library, filter);
  const innerW = layout.width - 2 * layout.gutter;
  const cols = layout.width >= 900 ? 3 : layout.width >= 560 ? 2 : 1;
  const gap = 18;
  const cardW = Math.min(520, Math.floor((innerW - gap * (cols - 1)) / cols));
  return (
    <ImageBackground source={MUSEO_ART.wall} resizeMode="cover" style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 112, paddingBottom: insets.bottom + 28, paddingHorizontal: layout.gutter }]}>
        <View style={styles.header}>
          <RoundButton onPress={onBack} label={t.back}>
            <ChevronLeftIcon />
          </RoundButton>
          <Text style={[styles.title, layout.phone && styles.titleSmall]}>{t.title}</Text>
        </View>
        <Text style={styles.intro}>{t.intro}</Text>

        <View style={styles.filters} accessibilityRole="tablist">
          {MUSEUM_FILTERS.map((f) => {
            const on = f === filter;
            return (
              <Pressable key={f} onPress={() => setFilter(f)} accessibilityRole="tab" accessibilityState={{ selected: on }} style={[styles.filter, on && styles.filterOn]}>
                {f === 'painting' && <Image source={MUSEO_ART.folderCoral} accessible={false} style={styles.folder} />}
                {f === 'collage' && <Image source={MUSEO_ART.folderTurquoise} accessible={false} style={styles.folder} />}
                <Text style={[styles.filterText, on && styles.filterTextOn]}>{t.filters[f]}</Text>
              </Pressable>
            );
          })}
        </View>

        {works.length === 0 ? (
          <Text style={styles.empty}>{t.empty}</Text>
        ) : (
          <View style={[styles.wall, { gap }]}>
            {works.map((p) => (
              <View key={p.id} style={{ width: cardW, gap: 8 }}>
                <Pressable onPress={() => onOpen(p.id)} accessibilityRole="button" accessibilityLabel={t.open(p.title)}>
                  <Framed project={p} width={cardW} />
                </Pressable>
                <View style={styles.plaque}>
                  <Text style={styles.plaqueTitle} numberOfLines={1}>
                    {p.title}
                  </Text>
                  <View style={styles.dots} accessibilityLabel={t.framesTitle}>
                    {FRAME_IDS.map((f) => (
                      <Pressable
                        key={f}
                        onPress={() => onFrame(p.id, f)}
                        accessibilityRole="button"
                        accessibilityLabel={t.frameLabel(t.frames[f])}
                        accessibilityState={{ selected: frameOf(p) === f }}
                        hitSlop={6}
                        style={[styles.dot, { backgroundColor: FRAME_DOT[f] }, frameOf(p) === f && styles.dotOn]}
                      />
                    ))}
                  </View>
                </View>
                {kindOf(p) === 'rhythm' && <Text style={styles.kindNote}>{t.rhythmPlaque}</Text>}
              </View>
            ))}
          </View>
        )}
        <Text style={styles.privacy}>{t.privacy}</Text>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  title: { fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  titleSmall: { fontSize: 26 },
  intro: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 22, color: colors.navy },
  note: { fontFamily: fontFamily.ui.black, color: colors.brand },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filter: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 14, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 2, borderColor: 'transparent' },
  filterOn: { backgroundColor: '#ffffff', borderColor: colors.brand },
  folder: { width: 26, height: 26 },
  filterText: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.inkSoft },
  filterTextOn: { color: colors.brand },
  wall: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  plaque: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: radius.tile, paddingVertical: 8, paddingHorizontal: 12, boxShadow: shadows.soft },
  plaqueTitle: { flex: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.ink },
  dots: { flexDirection: 'row', gap: 10 },
  dot: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#ffffff' },
  dotOn: { borderColor: colors.navy, transform: [{ scale: 1.15 }] },
  kindNote: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.navy, textAlign: 'center' },
  empty: { fontFamily: fontFamily.ui.bold, fontSize: 17, lineHeight: 24, color: colors.navy, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: radius.card, padding: 20 },
  privacy: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.navy, marginTop: 6 },
});

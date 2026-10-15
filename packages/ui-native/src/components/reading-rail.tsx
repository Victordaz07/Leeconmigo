import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MicTone } from '@lee-conmigo/ui-core';
import { colors, fontFamily, radius, shadows } from '../tokens.ts';
import { ChevronLeftIcon, HelpIcon, SpeakerIcon } from './icons.tsx';
import { MicBadge } from './mic-badge.tsx';
import { RoundButton } from './round-button.tsx';

interface ReadingRailProps {
  page: number;
  pageCount: number;
  onBack: () => void;
  /** Micrófono: tono y si escucha. `null` = no hay micrófono en uso (modo libre): no se muestra (nunca miente, docs/06). */
  mic: { tone: MicTone; listening: boolean } | null;
  onHelp?: () => void;
  onListen?: () => void;
  /** Modo libre: botón para pasar de página a mano. */
  onNextPage?: () => void;
}

/**
 * Riel izquierdo de la lectura (Kitewise B9/G8): volver, "2 / 6", puntos de las páginas (hechas en verde, la actual
 * alargada en azul), y abajo el micrófono, la ayuda y escuchar. Botones de ≥ 64 px (docs/06).
 */
export function ReadingRail({ page, pageCount, onBack, mic, onHelp, onListen, onNextPage }: ReadingRailProps) {
  return (
    <View style={styles.rail}>
      <RoundButton onPress={onBack} label="Volver">
        <ChevronLeftIcon />
      </RoundButton>
      <Text style={styles.count} accessibilityLabel={`Página ${page} de ${pageCount}`}>
        {page} / {pageCount}
      </Text>
      <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {Array.from({ length: pageCount }, (_, i) => (
          <View key={i} style={[styles.dot, i < page - 1 && styles.dotDone, i === page - 1 && styles.dotCurrent]} />
        ))}
      </View>
      <View style={styles.spacer} />
      {mic && <MicBadge tone={mic.tone} pulsing={mic.listening} size={58} />}
      {onNextPage && <RailButton label="Siguiente página" onPress={onNextPage} tint={colors.brand50} ledge={colors.brandLedgeSoft}><Text style={styles.next}>›</Text></RailButton>}
      {onHelp && <RailButton label="Ayuda" onPress={onHelp} tint={colors.brand50} ledge={colors.brandLedgeSoft}><HelpIcon /></RailButton>}
      {onListen && <RailButton label="Léeme el comienzo" onPress={onListen} tint="#fff1e6" ledge="#f7be9c"><SpeakerIcon /></RailButton>}
    </View>
  );
}

function RailButton({ label, onPress, tint, ledge, children }: { label: string; onPress: () => void; tint: string; ledge: string; children: ReactNode }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [styles.btn, { backgroundColor: tint, boxShadow: pressed ? undefined : `inset 0px -4px 0px ${ledge}, ${shadows.soft}` }, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rail: { width: 96, alignItems: 'center', paddingVertical: 20, gap: 14, backgroundColor: '#ffffff', boxShadow: shadows.soft },
  count: { fontFamily: fontFamily.ui.black, fontSize: 15, color: colors.navy },
  dots: { marginTop: 40, gap: 6, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.track },
  dotDone: { backgroundColor: colors.ok },
  dotCurrent: { height: 26, backgroundColor: colors.brand },
  spacer: { flex: 1 },
  btn: { width: 64, height: 64, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center' },
  pressed: { transform: [{ translateY: 2 }] },
  next: { fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.brand, marginTop: -4 },
});

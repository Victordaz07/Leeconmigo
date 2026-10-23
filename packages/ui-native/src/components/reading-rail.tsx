import { useTranslation } from '../interface-language.tsx';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MicTone } from '@lee-conmigo/ui-core';
import { colors, fontFamily, radius, shadows } from '../tokens.ts';
import { ChevronLeftIcon, ChevronRightIcon, HelpIcon, SpeakerIcon } from './icons.tsx';
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
  /** Modo libre: volver a la página anterior. `prevDisabled` en la primera página. */
  onPrevPage?: () => void;
  prevDisabled?: boolean;
  /** `horizontal`: barra de abajo (vertical, Kitewise G5). `compact`: botones más chicos (teléfono). */
  horizontal?: boolean;
  compact?: boolean;
  /** Barra de abajo: espacio del sistema que hay que dejar libre. */
  bottomInset?: number;
}

/**
 * Riel izquierdo de la lectura (Kitewise B9/G8): volver, "2 / 6", puntos de las páginas (hechas en verde, la actual
 * alargada en azul), y abajo el micrófono, la ayuda y escuchar. Botones de ≥ 64 px (docs/06).
 */
export function ReadingRail({ page, pageCount, onBack, mic, onHelp, onListen, onNextPage, onPrevPage, prevDisabled, horizontal, compact, bottomInset = 0 }: ReadingRailProps) {
  const { t: ui } = useTranslation();
  const size = compact ? 52 : 64;
  const btn = { width: size, height: size };
  if (horizontal) {
    return (
      <View style={[styles.bar, { paddingBottom: 8 + bottomInset }]}>
        <RoundButton onPress={onBack} label={ui("Volver")}>
          <ChevronLeftIcon />
        </RoundButton>
        <View style={styles.barMiddle}>
          <Text style={styles.count} accessibilityLabel={ui("Página {0} de {1}", page, pageCount)}>
            {page} / {pageCount}
          </Text>
          <View style={styles.dotsRow} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {Array.from({ length: pageCount }, (_, i) => (
              <View key={i} style={[styles.dot, styles.dotSmall, i < page - 1 && styles.dotDone, i === page - 1 && styles.dotCurrentRow]} />
            ))}
          </View>
        </View>
        {onPrevPage && <RailButton style={btn} label={ui("Página anterior")} onPress={onPrevPage} tint={colors.brand50} ledge={colors.brandLedgeSoft} disabled={prevDisabled}><ChevronLeftIcon size={30} color={colors.brand} /></RailButton>}
        {onNextPage && <RailButton style={btn} label={ui("Siguiente página")} onPress={onNextPage} tint={colors.brand50} ledge={colors.brandLedgeSoft}><ChevronRightIcon size={30} /></RailButton>}
        {onHelp && <RailButton style={btn} label={ui("Ayuda")} onPress={onHelp} tint={colors.brand50} ledge={colors.brandLedgeSoft}><HelpIcon /></RailButton>}
        {onListen && <RailButton style={btn} label={ui("Léeme el comienzo")} onPress={onListen} tint="#fff1e6" ledge="#f7be9c"><SpeakerIcon /></RailButton>}
        {mic && <MicBadge tone={mic.tone} pulsing={mic.listening} size={48} />}
      </View>
    );
  }
  return (
    <View style={[styles.rail, compact && styles.railCompact]}>
      <RoundButton onPress={onBack} label={ui("Volver")}>
        <ChevronLeftIcon />
      </RoundButton>
      <Text style={styles.count} accessibilityLabel={ui("Página {0} de {1}", page, pageCount)}>
        {page} / {pageCount}
      </Text>
      <View style={[styles.dots, compact && styles.dotsCompact]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {Array.from({ length: pageCount }, (_, i) => (
          <View key={i} style={[styles.dot, i < page - 1 && styles.dotDone, i === page - 1 && styles.dotCurrent]} />
        ))}
      </View>
      <View style={styles.spacer} />
      {mic && <MicBadge tone={mic.tone} pulsing={mic.listening} size={compact ? 46 : 58} />}
      {onNextPage && onPrevPage && <RailButton style={btn} label={ui("Página anterior")} onPress={onPrevPage} tint={colors.brand50} ledge={colors.brandLedgeSoft} disabled={prevDisabled}><ChevronLeftIcon size={30} color={colors.brand} /></RailButton>}
      {onNextPage && <RailButton style={btn} label={ui("Siguiente página")} onPress={onNextPage} tint={colors.brand50} ledge={colors.brandLedgeSoft}><ChevronRightIcon size={30} /></RailButton>}
      {onHelp && <RailButton style={btn} label={ui("Ayuda")} onPress={onHelp} tint={colors.brand50} ledge={colors.brandLedgeSoft}><HelpIcon /></RailButton>}
      {onListen && <RailButton style={btn} label={ui("Léeme el comienzo")} onPress={onListen} tint="#fff1e6" ledge="#f7be9c"><SpeakerIcon /></RailButton>}
    </View>
  );
}

/**
 * Barra de la lectura en Modo Enfoque (Kitewise B10): solo tres botones, grandes y separados — ayuda a la izquierda,
 * el micrófono (o "Siguiente" en lectura libre) al centro y escuchar a la derecha.
 */
export function FocusReadingBar({ mic, onHelp, onListen, onNextPage, onPrevPage, prevDisabled, compact }: Pick<ReadingRailProps, 'mic' | 'onHelp' | 'onListen' | 'onNextPage' | 'onPrevPage' | 'prevDisabled' | 'compact'>) {
  const { t: ui } = useTranslation();
  const size = compact ? 56 : 64;
  const btn = { width: size, height: size };
  return (
    <View style={styles.focusBar}>
      <View style={styles.focusSide}>
        {onPrevPage ? (
          <RailButton style={btn} label={ui("Página anterior")} onPress={onPrevPage} tint={colors.brand50} ledge={colors.brandLedgeSoft} disabled={prevDisabled}>
            <ChevronLeftIcon size={30} color={colors.brand} />
          </RailButton>
        ) : (
          onHelp && <RailButton style={btn} label={ui("Ayuda")} onPress={onHelp} tint={colors.brand50} ledge={colors.brandLedgeSoft}><HelpIcon /></RailButton>
        )}
      </View>
      {onNextPage ? (
        <Pressable onPress={onNextPage} accessibilityRole="button" accessibilityLabel={ui("Siguiente página")} style={({ pressed }) => [styles.focusNext, pressed && styles.pressed]}>
          <Text style={styles.focusNextText}>Siguiente ›</Text>
        </Pressable>
      ) : mic ? (
        <MicBadge tone={mic.tone} pulsing={mic.listening} size={compact ? 56 : 68} />
      ) : null}
      <View style={[styles.focusSide, styles.focusRight]}>{onListen && <RailButton style={btn} label={ui("Léeme el comienzo")} onPress={onListen} tint="#fff1e6" ledge="#f7be9c"><SpeakerIcon /></RailButton>}</View>
    </View>
  );
}

function RailButton({ label, onPress, tint, ledge, style, disabled, children }: { label: string; onPress: () => void; tint: string; ledge: string; style?: { width: number; height: number }; disabled?: boolean; children: ReactNode }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }} style={({ pressed }) => [styles.btn, style, { backgroundColor: tint, boxShadow: pressed || disabled ? undefined : `inset 0px -4px 0px ${ledge}, ${shadows.soft}` }, pressed && styles.pressed, disabled && styles.disabled]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rail: { width: 96, alignItems: 'center', paddingVertical: 20, gap: 14, backgroundColor: '#ffffff', boxShadow: shadows.soft },
  railCompact: { width: 76, paddingVertical: 10, gap: 8 },
  dotsCompact: { marginTop: 4, gap: 4 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 8, paddingHorizontal: 12, backgroundColor: '#ffffff', boxShadow: '0px -2px 10px rgba(30, 35, 64, 0.08)' },
  barMiddle: { flex: 1, gap: 6, alignItems: 'flex-start' },
  dotsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'center' },
  dotSmall: { width: 8, height: 8, borderRadius: 4 },
  dotCurrentRow: { width: 20, backgroundColor: colors.brand },
  count: { fontFamily: fontFamily.ui.black, fontSize: 15, color: colors.navy },
  dots: { marginTop: 40, gap: 6, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.track },
  dotDone: { backgroundColor: colors.ok },
  dotCurrent: { height: 26, backgroundColor: colors.brand },
  spacer: { flex: 1 },
  btn: { width: 64, height: 64, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center' },
  pressed: { transform: [{ translateY: 2 }] },
  disabled: { opacity: 0.35 },
  next: { fontFamily: fontFamily.ui.black, fontSize: 44, lineHeight: 48, color: colors.brand, marginTop: -6 },
  focusBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  focusSide: { width: 72 },
  focusRight: { alignItems: 'flex-end' },
  focusNext: { minWidth: 220, height: 64, borderRadius: radius.pill, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, boxShadow: `inset 0px -5px 0px ${colors.brandLedge}, ${shadows.soft}` },
  focusNextText: { fontFamily: fontFamily.ui.black, fontSize: 20, color: '#ffffff' },
});

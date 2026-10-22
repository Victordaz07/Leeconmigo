/**
 * Piezas visuales de «Para la vida» 02–08, dibujadas en código (arte provisional hasta que lleguen las imágenes de `docs/design/vida/PEDIDO-IMAGENES-MEGA.md`).
 * Siempre texto real de la app. El estado se dice con palabra o forma, no solo con color (docs/06). El color de acento es el del cuaderno.
 */
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, minTouch, radius, shadows } from '@lee-conmigo/ui-native';

export function Card({ children, tone = 'plain', accent }: { children: ReactNode; tone?: 'plain' | 'soft' | 'warm'; accent?: string }) {
  return <View style={[styles.card, tone === 'soft' && { backgroundColor: `${accent ?? colors.brand}18` }, tone === 'warm' && styles.cardWarm]}>{children}</View>;
}

export function SectionTitle({ children, accent }: { children: string; accent: string }) {
  return <Text style={[styles.sectionTitle, { color: accent }]}>{children}</Text>;
}

/** Una línea de acompañamiento: afirma o invita a mirar de nuevo. Nunca roja (docs/06). */
export function Hint({ kind, children }: { kind: 'affirm' | 'gentle' | 'info'; children: string }) {
  return (
    <View style={[styles.hint, kind === 'affirm' && styles.hintAffirm, kind === 'gentle' && styles.hintGentle]} accessibilityLiveRegion="polite">
      <Text style={styles.hintText}>{kind === 'affirm' ? '✓ ' : kind === 'gentle' ? '↻ ' : ''}{children}</Text>
    </View>
  );
}

/** Opciones de una sola elección. La elegida lleva ✓ además del color. */
export function Choices({ items, selectedId, onSelect, accent }: { items: { id: string; text: string }[]; selectedId?: string; onSelect: (id: string) => void; accent: string }) {
  return (
    <View style={styles.choices}>
      {items.map((c) => {
        const on = c.id === selectedId;
        return (
          <Pressable key={c.id} onPress={() => onSelect(c.id)} accessibilityRole="radio" accessibilityLabel={c.text} accessibilityState={{ selected: on }} style={[styles.choice, on && { backgroundColor: accent }]}>
            <Text style={[styles.choiceText, on && styles.choiceTextOn]}>{on ? '✓ ' : ''}{c.text}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Una tarjeta tocable (un camino, una tarjeta a ordenar, algo para marcar). */
export function Tile({ label, state, onPress, accent, role = 'button', badge }: { label: string; state?: 'on' | 'seen'; onPress: () => void; accent: string; role?: 'button' | 'checkbox'; badge?: string }) {
  const on = state === 'on';
  const seen = state === 'seen';
  return (
    <Pressable onPress={onPress} accessibilityRole={role} accessibilityLabel={label} accessibilityState={role === 'checkbox' ? { checked: on } : { selected: on }} style={[styles.tile, seen && { backgroundColor: `${accent}22` }, on && { backgroundColor: accent }]}>
      {badge !== undefined && (
        <View style={[styles.badge, on && styles.badgeOn]}>
          <Text style={[styles.badgeText, on && { color: accent }]}>{badge}</Text>
        </View>
      )}
      <Text style={[styles.tileText, on && styles.tileTextOn]}>{(on && role === 'checkbox' ? '✓ ' : seen ? '• ' : '') + label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 16, gap: 10, boxShadow: shadows.card },
  cardWarm: { backgroundColor: '#fff6df' },
  sectionTitle: { fontFamily: fontFamily.ui.black, fontSize: 15, letterSpacing: 0.4, textTransform: 'uppercase' },
  hint: { borderRadius: radius.tile, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.brand50 },
  hintAffirm: { backgroundColor: '#e4f7ea' },
  hintGentle: { backgroundColor: '#fff1c2' },
  hintText: { fontFamily: fontFamily.ui.bold, fontSize: 15, lineHeight: 21, color: colors.ink },
  choices: { gap: 10, alignSelf: 'stretch' },
  choice: { minHeight: minTouch, borderRadius: radius.tile, backgroundColor: '#ffffff', paddingHorizontal: 18, paddingVertical: 14, justifyContent: 'center', boxShadow: shadows.soft },
  choiceText: { fontFamily: fontFamily.ui.bold, fontSize: 16, color: colors.ink },
  choiceTextOn: { color: '#ffffff', fontFamily: fontFamily.ui.extrabold },
  tile: { minHeight: minTouch, borderRadius: radius.tile, backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12, boxShadow: shadows.soft },
  tileText: { flex: 1, fontFamily: fontFamily.ui.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  tileTextOn: { color: '#ffffff', fontFamily: fontFamily.ui.extrabold },
  badge: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  badgeOn: { backgroundColor: '#ffffff' },
  badgeText: { fontFamily: fontFamily.ui.black, fontSize: 14, color: colors.ink },
});

/**
 * Piezas visuales de Finanzas, dibujadas en código (arte provisional hasta que lleguen las imágenes de `docs/design/finanzas/PEDIDO-IMAGENES.md`).
 * Siempre texto real de la app, nunca texto dentro de una imagen. El estado se dice con palabra o forma, no solo con color (docs/06).
 */
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { FinanzasEnvelopeKind, FinanzasLang } from '@lee-conmigo/ui-core';
import { FINANZAS_COPY } from '@lee-conmigo/ui-core';
import { colors, fontFamily, minTouch, radius, shadows } from '@lee-conmigo/ui-native';

export const TEAL = colors.subjFinanzas;
export const TEAL_SOFT = '#e3f7f4';
export const GOLD = '#f2b632';

/** Moneda de mentira: una cantidad de UM con su disco dorado. */
export function Um({ amount, size = 'md' }: { amount: number; size?: 'sm' | 'md' | 'lg' }) {
  const d = size === 'lg' ? 34 : size === 'sm' ? 22 : 28;
  return (
    <View style={styles.umRow} accessible accessibilityLabel={`${amount} UM`}>
      <View style={[styles.coin, { width: d, height: d, borderRadius: d / 2 }]}>
        <Text style={[styles.coinText, { fontSize: d * 0.36 }]}>UM</Text>
      </View>
      <Text style={[styles.umAmount, size === 'lg' && styles.umAmountLg, size === 'sm' && styles.umAmountSm]}>{amount}</Text>
    </View>
  );
}

export function Card({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'teal' | 'warm' }) {
  return <View style={[styles.card, tone === 'teal' && styles.cardTeal, tone === 'warm' && styles.cardWarm]}>{children}</View>;
}

export function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

/** Una línea de acompañamiento: afirma o invita a mirar de nuevo. Nunca roja (docs/06). */
export function Hint({ kind, children }: { kind: 'affirm' | 'gentle' | 'info'; children: string }) {
  return (
    <View style={[styles.hint, kind === 'affirm' && styles.hintAffirm, kind === 'gentle' && styles.hintGentle]} accessibilityLiveRegion="polite">
      <Text style={styles.hintText}>{kind === 'affirm' ? '✓ ' : kind === 'gentle' ? '↻ ' : ''}{children}</Text>
    </View>
  );
}

export interface PickItem {
  id: string;
  text: string;
  /** Línea chica debajo (p. ej. el costo). */
  note?: ReactNode;
}

/** Opciones de una sola elección, en verde-azulado. La elegida lleva ✓ además del color. */
export function Choices({ items, selectedId, onSelect }: { items: PickItem[]; selectedId?: string; onSelect: (id: string) => void }) {
  return (
    <View style={styles.choices}>
      {items.map((c) => {
        const on = c.id === selectedId;
        return (
          <Pressable key={c.id} onPress={() => onSelect(c.id)} accessibilityRole="radio" accessibilityLabel={c.text} accessibilityState={{ selected: on }} style={[styles.choice, on && styles.choiceOn]}>
            <Text style={[styles.choiceText, on && styles.choiceTextOn]}>{on ? '✓ ' : ''}{c.text}</Text>
            {c.note}
          </Pressable>
        );
      })}
    </View>
  );
}

/** Interruptor corto de dos posiciones (una condición de la situación). */
export function Toggle({ offLabel, onLabel, value, onChange }: { offLabel: string; onLabel: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggle}>
      {[{ v: false, l: offLabel }, { v: true, l: onLabel }].map((o) => (
        <Pressable key={String(o.v)} onPress={() => onChange(o.v)} accessibilityRole="radio" accessibilityLabel={o.l} accessibilityState={{ selected: value === o.v }} style={[styles.toggleSide, value === o.v && styles.toggleSideOn]}>
          <Text style={[styles.toggleText, value === o.v && styles.toggleTextOn]}>{value === o.v ? '✓ ' : ''}{o.l}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const KIND_ICON: Record<FinanzasEnvelopeKind, string> = { essential: '■', optional: '◆', reserve: '▲', free: '●' };

/** Un sobre del plan: nombre, tipo en palabras, cuánto lleva y (si tiene costo) cuánto le falta o le sobra. */
export function EnvelopeCard({ lang, label, kind, amount, cost, selected, onPress, disabled }: { lang: FinanzasLang; label: string; kind: FinanzasEnvelopeKind; amount: number; cost?: number; selected?: boolean; onPress?: () => void; disabled?: boolean }) {
  const t = FINANZAS_COPY;
  const covered = cost === undefined || amount >= cost;
  const fill = cost ? Math.max(0, Math.min(1, amount / cost)) : undefined;
  const body = (
    <View style={[styles.envelope, selected && styles.envelopeSel, disabled && styles.envelopeDisabled]}>
      <View style={styles.envelopeTop}>
        <Text style={styles.envelopeIcon}>{KIND_ICON[kind]}</Text>
        <View style={styles.envelopeNames}>
          <Text style={styles.envelopeName}>{label}</Text>
          <Text style={styles.envelopeKind}>{t.envelopeKind[kind][lang]}</Text>
        </View>
        <Um amount={amount} />
      </View>
      {cost !== undefined && (
        <View style={styles.envelopeBottom}>
          <View style={styles.bar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={[styles.barFill, { width: `${(fill ?? 0) * 100}%` }, !covered && styles.barPartial]} />
          </View>
          <Text style={[styles.envelopeCover, covered && styles.envelopeCoverOk]}>{covered ? '✓ ' : ''}{t.project.cover[lang](amount, cost)}</Text>
        </View>
      )}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}, ${amount} UM${cost !== undefined ? `, ${t.project.cover[lang](amount, cost)}` : ''}`} accessibilityState={{ selected: !!selected }}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  umRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coin: { backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#d99a00' },
  coinText: { fontFamily: fontFamily.ui.black, color: '#7a5200' },
  umAmount: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.ink },
  umAmountLg: { fontSize: 28 },
  umAmountSm: { fontSize: 15 },
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 16, gap: 10, boxShadow: shadows.card },
  cardTeal: { backgroundColor: TEAL_SOFT },
  cardWarm: { backgroundColor: '#fff6df' },
  sectionTitle: { fontFamily: fontFamily.ui.black, fontSize: 15, letterSpacing: 0.4, color: TEAL, textTransform: 'uppercase' },
  hint: { borderRadius: radius.tile, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.brand50 },
  hintAffirm: { backgroundColor: '#e4f7ea' },
  hintGentle: { backgroundColor: '#fff1c2' },
  hintText: { fontFamily: fontFamily.ui.bold, fontSize: 15, lineHeight: 21, color: colors.ink },
  choices: { gap: 10, alignSelf: 'stretch' },
  choice: { minHeight: minTouch, borderRadius: radius.tile, backgroundColor: '#ffffff', paddingHorizontal: 18, paddingVertical: 14, justifyContent: 'center', gap: 4, boxShadow: shadows.soft },
  choiceOn: { backgroundColor: TEAL },
  choiceText: { fontFamily: fontFamily.ui.bold, fontSize: 16, color: colors.ink },
  choiceTextOn: { color: '#ffffff', fontFamily: fontFamily.ui.extrabold },
  toggle: { flexDirection: 'row', borderRadius: radius.pill, backgroundColor: colors.chip, padding: 4, alignSelf: 'stretch' },
  toggleSide: { flex: 1, minHeight: minTouch - 8, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  toggleSideOn: { backgroundColor: TEAL },
  toggleText: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.ink, textAlign: 'center' },
  toggleTextOn: { color: '#ffffff', fontFamily: fontFamily.ui.extrabold },
  envelope: { backgroundColor: '#ffffff', borderRadius: radius.tile, padding: 14, gap: 10, borderWidth: 2, borderColor: 'transparent', boxShadow: shadows.soft },
  envelopeSel: { borderColor: TEAL, backgroundColor: TEAL_SOFT },
  envelopeDisabled: { opacity: 0.6 },
  envelopeTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  envelopeIcon: { fontSize: 18, color: TEAL, width: 22, textAlign: 'center' },
  envelopeNames: { flex: 1 },
  envelopeName: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.ink },
  envelopeKind: { fontFamily: fontFamily.ui.bold, fontSize: 12, color: colors.muted },
  envelopeBottom: { gap: 6 },
  bar: { height: 10, borderRadius: 5, backgroundColor: colors.track, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: TEAL },
  barPartial: { backgroundColor: colors.warn },
  envelopeCover: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: colors.inkSoft },
  envelopeCoverOk: { color: colors.okDark },
});

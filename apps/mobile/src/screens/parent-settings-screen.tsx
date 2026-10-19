import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FocusMode, FocusSettings, LanguageCode } from '@lee-conmigo/contracts';
import { DAILY_GOAL_PRESETS, PARENT_SETTINGS_COPY as t, WEEKDAY_LETTERS, WEEKDAY_NAMES, type ParentLang } from '@lee-conmigo/ui-core';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import type { ChildProfile } from '../app-state';

interface ParentSettingsScreenProps {
  /** El perfil a editar, o uno nuevo ("Agregar niño"). */
  initial: ChildProfile;
  isNew: boolean;
  /** Idioma de la INTERFAZ de esta pantalla (el del perfil que se edita, o el del primero que exista si es nuevo). */
  lang: ParentLang;
  onSave: (profile: ChildProfile) => void;
  onCancel: () => void;
  /** Solo perfiles existentes. */
  onResetProgress?: () => void;
  /** Solo si hay más de un niño (nunca se queda la app sin perfiles). */
  onRemove?: () => void;
  onChangePin?: () => void;
  /** Abre la prueba de voz (RN-03). */
  onVoiceTest?: () => void;
  onAudioTest?: () => void;
}

const LEVELS = [1, 2, 3, 4, 5, 6];
// Los nombres de idioma se muestran en su propio idioma (convención estándar), no se traducen.
const LANGUAGES: { id: LanguageCode; label: string }[] = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
];

/**
 * Ajustes de un niño (Kitewise P4), detrás del PIN. Solo lo que ya funciona: perfil, tiempo diario, "¿Cómo llegas?",
 * lectura libre, Modo Enfoque y privacidad. El nivel es de la app, NO el grado escolar (docs/01). En Modo Enfoque solo
 * aparecen los apoyos que ya cambian algo (no se pone un interruptor que no haga nada).
 */
export function ParentSettingsScreen({ initial, isNew, lang, onSave, onCancel, onResetProgress, onRemove, onChangePin, onVoiceTest, onAudioTest }: ParentSettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const one = layout.narrow || layout.portrait;
  const [p, setP] = useState(initial);
  const [confirm, setConfirm] = useState<'reset' | 'remove' | null>(null);
  const set = <K extends keyof ChildProfile>(key: K, value: ChildProfile[K]) => setP((prev) => ({ ...prev, [key]: value }));
  const name = p.name.trim();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + (layout.phone ? 10 : 20), paddingHorizontal: layout.gutter }]}>
        <RoundButton onPress={onCancel} label={t.backNoSave[lang]}>
          <ChevronLeftIcon />
        </RoundButton>
        <Text style={[styles.title, layout.phone && styles.titleSmall]} numberOfLines={2}>{isNew ? t.addChildTitle[lang] : t.settingsOf[lang](initial.name)}</Text>
        <Button label={isNew ? t.add[lang] : t.save[lang]} onPress={() => onSave({ ...p, name })} disabled={!name || !scheduleOk(p.focus)} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, one && styles.contentOne, { paddingHorizontal: layout.gutter, paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.column}>
          <Section title={t.sectionProfile[lang]}>
            <TextInput value={p.name} onChangeText={(v) => set('name', v)} placeholder={t.namePlaceholder[lang]} placeholderTextColor={colors.muted} style={styles.input} maxLength={24} accessibilityLabel={t.nameA11y[lang]} />
            <Text style={styles.label}>{t.levelLabel[lang]}</Text>
            <Segmented options={LEVELS.map((l) => ({ id: l, label: String(l) }))} value={p.level} onChange={(v) => set('level', v)} />
            <Text style={styles.note}>{t.levelNote[lang]}</Text>
            <Segmented options={LANGUAGES} value={p.language} onChange={(v) => set('language', v)} />
          </Section>

          <Section title={t.sectionDailyTime[lang]}>
            <Segmented options={DAILY_GOAL_PRESETS.map((m) => ({ id: m, label: `${m} min` }))} value={p.dailyGoalMinutes} onChange={(v) => set('dailyGoalMinutes', v)} />
            <Toggle label={t.askEnergyToggle[lang]} value={p.askEnergy} onChange={(v) => set('askEnergy', v)} />
            <Text style={styles.note}>{t.askEnergyNote[lang]}</Text>
          </Section>

        </View>

        <View style={styles.column}>
          <Section title={t.sectionReading[lang]}>
            <Toggle label={t.freeReadingToggle[lang]} value={p.freeReading} onChange={(v) => set('freeReading', v)} />
            <Text style={styles.note}>{t.freeReadingNote[lang]}</Text>
            {onVoiceTest && <Button label={t.testMic[lang]} variant="secondary" onPress={onVoiceTest} />}
          </Section>

          <FocusSection value={p.focus} onChange={(v) => set('focus', v)} lang={lang} />

          {onAudioTest && (
            <Section title="Arte y música">
              <Text style={styles.note}>Comprueba que el ritmo de ocho pulsos suene parejo en este equipo. No usa micrófono ni cámara.</Text>
              <Button label="Probar el audio del taller" variant="secondary" onPress={onAudioTest} />
            </Section>
          )}

          <Section title={t.sectionPrivacy[lang]}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{t.saveAudio[lang]}</Text>
              <Text style={styles.never}>{t.never[lang]}</Text>
            </View>
            <Text style={styles.note}>{t.privacyNote[lang]}</Text>
          </Section>
          {!isNew && (
            <Section title={t.sectionData[lang]}>
              {onChangePin && <Button label={t.changePin[lang]} variant="secondary" onPress={onChangePin} />}
              {confirm === 'reset' ? (
                <Confirm text={t.confirmReset[lang](initial.name)} yes={t.yesDelete[lang]} cancel={t.cancel[lang]} onYes={() => onResetProgress?.()} onNo={() => setConfirm(null)} />
              ) : (
                <Button label={t.resetProgress[lang](initial.name)} variant="secondary" onPress={() => setConfirm('reset')} />
              )}
              {onRemove &&
                (confirm === 'remove' ? (
                  <Confirm text={t.confirmRemove[lang](initial.name)} yes={t.yesRemove[lang]} cancel={t.cancel[lang]} onYes={onRemove} onNo={() => setConfirm(null)} />
                ) : (
                  <Button label={t.removeChild[lang](initial.name)} variant="secondary" onPress={() => setConfirm('remove')} />
                ))}
            </Section>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const TIME = /^([01]?\d|2[0-3]):[0-5]\d$/;
/** El horario, si lo hay, debe tener días y horas válidas y distintas (si no, no se deja guardar). */
const scheduleOk = (f: FocusSettings) => !f.schedule || (f.schedule.days.length > 0 && TIME.test(f.schedule.from) && TIME.test(f.schedule.to) && f.schedule.from !== f.schedule.to);

/**
 * Modo Enfoque (docs/10 §1, D4): Apagado / Encendido / Personalizado, y si se quiere, solo en un horario. Para el niño
 * no hay ningún aviso ni etiqueta: solo ve menos cosas alrededor del ejercicio y rondas más cortas.
 */
function FocusSection({ value, onChange, lang }: { value: FocusSettings; onChange: (v: FocusSettings) => void; lang: ParentLang }) {
  const set = (patch: Partial<FocusSettings>) => onChange({ ...value, ...patch });
  const s = value.schedule;
  const focusModes: { id: FocusMode; label: string }[] = [
    { id: 'off', label: t.focusModes.off[lang] },
    { id: 'on', label: t.focusModes.on[lang] },
    { id: 'custom', label: t.focusModes.custom[lang] },
  ];
  const days = WEEKDAY_LETTERS[lang];
  const dayNames = WEEKDAY_NAMES[lang];
  return (
    <Section title={t.sectionFocusMode[lang]}>
      <Segmented options={focusModes} value={value.mode} onChange={(mode) => set({ mode })} />
      <Text style={styles.note}>{value.mode === 'off' ? t.focusNoteOff[lang] : value.mode === 'on' ? t.focusNoteOn[lang] : t.focusNoteCustom[lang]}</Text>
      {value.mode === 'custom' && (
        <>
          <Toggle label={t.focusReadingToggle[lang]} value={value.custom.focusReading} onChange={(v) => set({ custom: { ...value.custom, focusReading: v } })} />
          <Toggle label={t.reducedMotionToggle[lang]} value={value.custom.reducedMotion} onChange={(v) => set({ custom: { ...value.custom, reducedMotion: v } })} />
          <Toggle label={t.movementBreaksToggle[lang]} value={value.custom.movementBreaks} onChange={(v) => set({ custom: { ...value.custom, movementBreaks: v } })} />
          <Text style={styles.label}>{t.roundSizeLabel[lang]}</Text>
          <Segmented options={[3, 4, 5, 6].map((n) => ({ id: n, label: String(n) }))} value={value.custom.roundSize} onChange={(roundSize) => set({ custom: { ...value.custom, roundSize } })} />
        </>
      )}
      {value.mode !== 'off' && (
        <>
          <Toggle label={t.scheduleOnlyToggle[lang]} value={!!s} onChange={(v) => set({ schedule: v ? { days: [1, 2, 3, 4, 5], from: '15:00', to: '19:00' } : undefined })} />
          {s && (
            <>
              <View style={styles.days}>
                {days.map((d, i) => {
                  const on = s.days.includes(i);
                  return (
                    <Pressable
                      key={i}
                      onPress={() => set({ schedule: { ...s, days: on ? s.days.filter((x) => x !== i) : [...s.days, i].sort() } })}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: on }}
                      accessibilityLabel={dayNames[i]}
                      style={[styles.day, on && styles.segmentOn]}
                    >
                      <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{d}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.label}>{t.from[lang]}</Text>
                <TextInput value={s.from} onChangeText={(from) => set({ schedule: { ...s, from } })} style={[styles.input, styles.time]} maxLength={5} keyboardType="numbers-and-punctuation" accessibilityLabel={t.startTimeA11y[lang]} />
                <Text style={styles.label}>{t.to[lang]}</Text>
                <TextInput value={s.to} onChangeText={(to) => set({ schedule: { ...s, to } })} style={[styles.input, styles.time]} maxLength={5} keyboardType="numbers-and-punctuation" accessibilityLabel={t.endTimeA11y[lang]} />
              </View>
              <Text style={styles.note}>{scheduleOk(value) ? t.outsideScheduleNote[lang] : t.fixScheduleNote[lang]}</Text>
            </>
          )}
        </>
      )}
    </Section>
  );
}

function Section({ title, soon, soonLabel, children }: { title: string; soon?: boolean; soonLabel?: string; children: ReactNode }) {
  return (
    <View style={[styles.card, soon && styles.cardSoon]}>
      <View style={styles.sectionHead}>
        <Text style={styles.h3}>{title}</Text>
        {soon && <Text style={styles.soon}>{soonLabel}</Text>}
      </View>
      {children}
    </View>
  );
}

function Segmented<T extends string | number>({ options, value, onChange }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable key={String(o.id)} onPress={() => onChange(o.id)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={o.label} style={[styles.segment, on && styles.segmentOn]}>
            <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={label} trackColor={{ false: colors.slate300, true: colors.ok }} thumbColor="#ffffff" />
    </View>
  );
}

function Confirm({ text, yes, cancel, onYes, onNo }: { text: string; yes: string; cancel: string; onYes: () => void; onNo: () => void }) {
  return (
    <View style={styles.confirm}>
      <Text style={styles.confirmText}>{text}</Text>
      <View style={styles.confirmRow}>
        <Button label={cancel} variant="secondary" onPress={onNo} />
        <Button label={yes} onPress={onYes} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.app },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 12 },
  titleSmall: { fontSize: 24 },
  contentOne: { flexDirection: 'column', alignItems: 'stretch' },
  title: { flex: 1, fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  content: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  column: { flex: 1, flexBasis: 'auto', gap: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: radius.card, padding: 22, gap: 12, boxShadow: shadows.card },
  cardSoon: { opacity: 0.7 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 20, color: colors.navy },
  soon: { fontFamily: fontFamily.ui.black, fontSize: 12, color: colors.muted, backgroundColor: colors.chip, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, overflow: 'hidden' },
  label: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.inkSoft },
  note: { fontFamily: fontFamily.ui.semibold, fontSize: 14, lineHeight: 20, color: colors.muted },
  input: { fontFamily: fontFamily.ui.extrabold, fontSize: 18, color: colors.ink, backgroundColor: colors.chip, borderRadius: 14, paddingHorizontal: 16, height: 52 },
  segmented: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, backgroundColor: colors.chip, borderRadius: 16, padding: 5 },
  segment: { flexGrow: 1, minWidth: 56, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  segmentOn: { backgroundColor: colors.brand, boxShadow: shadows.brandGlow },
  segmentText: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.inkSoft },
  segmentTextOn: { color: '#ffffff' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 44 },
  toggleLabel: { flex: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.ink },
  never: { fontFamily: fontFamily.ui.black, fontSize: 15, color: colors.okDark },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  day: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.chip },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  time: { width: 96, textAlign: 'center' },
  confirm: { gap: 10, backgroundColor: colors.warnTint, borderRadius: radius.tile, padding: 14 },
  confirmText: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: colors.ink },
  confirmRow: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
});

import { useTranslation } from '@lee-conmigo/ui-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { loadReminderSettings, saveReminderSettings, type ChildProfile } from '../app-state';
import { REMINDER_COPY } from '../reminders/copy';
import { anyReminderOn, childReminderOf, setChildReminder, setParentReminder, timeLabel, type ReminderSettings } from '../reminders/model';
import { askPermission, permissionState, sendTestReminder, type PermissionState } from '../reminders/scheduler';
import { syncReminders } from '../reminders/sync';

interface Props {
  profiles: ChildProfile[];
  onBack: () => void;
}

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const DAY_NAMES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const MINUTE_STEP = 5;

/**
 * Modo padres · Recordatorios. Todo se guarda y se programa en este equipo: no hay servidor ni cuenta. El aviso del niño es una invitación amable
 * (sin racha ni culpa); si hoy ya leyó, no se manda; y si pasa una semana sin abrir la app, los avisos se acaban solos.
 */
export function ParentRemindersScreen({ profiles, onBack }: Props) {

  const { language, t: ui } = useTranslation();
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [settings, setSettings] = useState<ReminderSettings>(loadReminderSettings);
  const [perm, setPerm] = useState<PermissionState>('undetermined');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    void permissionState().then(setPerm);
  }, []);

  const apply = async (next: ReminderSettings) => {
    setSettings(next);
    saveReminderSettings(next);
    let p = perm;
    if (anyReminderOn(next) && p !== 'granted') {
      p = await askPermission();
      setPerm(p);
    }
    setNotice(anyReminderOn(next) && p === 'denied' ? ui("Los avisos están bloqueados para Kitewise. Actívalos en los Ajustes del teléfono (Aplicaciones → Kitewise → Notificaciones).") : anyReminderOn(next) && p === 'unavailable' ? ui("Este dispositivo no puede mostrar avisos (en el navegador no funcionan).") : '');
    await syncReminders(profiles, next);
  };

  const test = async () => {
    const copy = REMINDER_COPY[language];
    const ok = await sendTestReminder(copy.childTitle, copy.childBodies[0]!);
    setNotice(ok ? ui("Te llegará un aviso de prueba en unos 5 segundos.") : ui("Para probar, primero activa algún aviso y permite las notificaciones."));
  };

  const par = settings.parent;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingTop: insets.top + (layout.phone ? 12 : 24), paddingBottom: insets.bottom + 28 }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={ui("Volver al panel de padres")}>
          <ChevronLeftIcon />
        </RoundButton>
        <View style={styles.flex}>
          <Text style={styles.kicker}>{ui("Modo padres")}</Text>
          <Text style={[styles.title, layout.phone && styles.titleSmall]}>{ui("Recordatorios")}</Text>
        </View>
      </View>
      <Text style={styles.body}>{ui("Avisos amables para que leer sea un hábito, sin presión. Se programan solo en este dispositivo: no se envía nada a ningún servidor.")}</Text>

      {profiles.map((p) => {
        const c = childReminderOf(settings, p.id);
        return (
          <View key={p.id} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.flex}>
                <Text style={styles.h3}>{ui("Lectura de") + " "}{p.name}</Text>
                <Text style={styles.muted}>{ui("Una invitación a leer, los días que elijas.")}</Text>
              </View>
              <Switch value={c.enabled} onValueChange={(enabled) => void apply(setChildReminder(settings, p.id, { enabled }))} accessibilityLabel={ui("Recordatorio de lectura de {0}", p.name)} />
            </View>
            {c.enabled && (
              <>
                <TimeStepper hour={c.hour} minute={c.minute} onChange={(hour, minute) => void apply(setChildReminder(settings, p.id, { hour, minute }))} label={ui("Hora del aviso de {0}", p.name)} />
                <View style={styles.days}>
                  {DAYS.map((d, i) => (
                    <Pressable
                      key={d}
                      onPress={() => void apply(setChildReminder(settings, p.id, { days: c.days.map((v, j) => (j === i ? !v : v)) }))}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: c.days[i] }}
                      accessibilityLabel={ui(DAY_NAMES[i])}
                      style={[styles.day, c.days[i] && styles.dayOn]}
                    >
                      <Text style={[styles.dayText, c.days[i] && styles.dayTextOn]}>{ui(DAY_NAMES[i]).slice(0, 1).toUpperCase()}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.muted}>{ui("Si hoy ya leyó, no se avisa. Si pasa una semana sin abrir la app, los avisos se detienen solos.")}</Text>
              </>
            )}
          </View>
        );
      })}

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.h3}>{ui("Resumen semanal para ti")}</Text>
            <Text style={styles.muted}>{ui("Te avisa que el informe de la semana está listo.")}</Text>
          </View>
          <Switch value={par.enabled} onValueChange={(enabled) => void apply(setParentReminder(settings, { enabled }))} accessibilityLabel={ui("Aviso del resumen semanal")} />
        </View>
        {par.enabled && (
          <>
            <View style={styles.days}>
              {DAYS.map((d, i) => (
                <Pressable key={d} onPress={() => void apply(setParentReminder(settings, { weekday: i }))} accessibilityRole="radio" accessibilityState={{ checked: par.weekday === i }} accessibilityLabel={ui(DAY_NAMES[i])} style={[styles.day, par.weekday === i && styles.dayOn]}>
                  <Text style={[styles.dayText, par.weekday === i && styles.dayTextOn]}>{ui(DAY_NAMES[i]).slice(0, 1).toUpperCase()}</Text>
                </Pressable>
              ))}
            </View>
            <TimeStepper hour={par.hour} minute={par.minute} onChange={(hour, minute) => void apply(setParentReminder(settings, { hour, minute }))} label={ui("Hora del resumen semanal")} />
          </>
        )}
      </View>

      <View style={styles.actions}>
        <Button label={ui("Enviarme un aviso de prueba")} variant="secondary" onPress={test} />
        {notice !== '' && (
          <Text style={styles.notice} accessibilityLiveRegion="polite">
            {notice}
          </Text>
        )}
        <Text style={styles.muted}>{ui("Los avisos nunca llevan el nombre del niño cuando hay un solo perfil, ni hablan de rachas perdidas.")}</Text>
      </View>
    </ScrollView>
  );
}

function TimeStepper({ hour, minute, onChange, label }: { hour: number; minute: number; onChange: (hour: number, minute: number) => void; label: string }) {
  const { t: ui } = useTranslation();

  const total = hour * 60 + minute;
  const shift = (delta: number) => {
    const t = (total + delta + 1440) % 1440;
    onChange(Math.floor(t / 60), t % 60);
  };
  return (
    <View style={styles.stepper} accessibilityRole="adjustable" accessibilityLabel={`${label}: ${timeLabel(hour, minute)}`}>
      <Step label={ui("Una hora antes")} glyph="−" onPress={() => shift(-60)} />
      <Step label={ui("Cinco minutos antes")} glyph="‹" onPress={() => shift(-MINUTE_STEP)} />
      <Text style={styles.time}>{timeLabel(hour, minute)}</Text>
      <Step label={ui("Cinco minutos después")} glyph="›" onPress={() => shift(MINUTE_STEP)} />
      <Step label={ui("Una hora después")} glyph="+" onPress={() => shift(60)} />
    </View>
  );
}

function Step({ label, glyph, onPress }: { label: string; glyph: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={4} style={styles.step}>
      <Text style={styles.stepGlyph}>{glyph}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.app },
  content: { gap: 16, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, alignSelf: 'center', maxWidth: 720, width: '100%' },
  kicker: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  title: { fontFamily: fontFamily.ui.black, fontSize: 34, color: colors.navy },
  titleSmall: { fontSize: 26 },
  body: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 23, color: colors.inkSoft, maxWidth: 720, width: '100%' },
  card: { maxWidth: 720, width: '100%', backgroundColor: '#ffffff', borderRadius: radius.card, padding: 20, gap: 14, boxShadow: shadows.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  muted: { fontFamily: fontFamily.ui.semibold, fontSize: 14, lineHeight: 20, color: colors.muted },
  days: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  day: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.appAlt, borderWidth: 2, borderColor: 'transparent' },
  dayOn: { backgroundColor: colors.brand },
  dayText: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.inkSoft },
  dayTextOn: { color: '#ffffff' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  step: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.appAlt },
  stepGlyph: { fontFamily: fontFamily.ui.black, fontSize: 22, color: colors.navy },
  time: { fontFamily: fontFamily.ui.black, fontSize: 28, color: colors.navy, minWidth: 90, textAlign: 'center' },
  actions: { maxWidth: 720, width: '100%', gap: 10, alignItems: 'flex-start' },
  notice: { fontFamily: fontFamily.ui.bold, fontSize: 15, lineHeight: 21, color: '#b25e00' },
});

import { useTranslation } from '../interface-language.tsx';
import { useState } from 'react';
import { Image, type ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FOCUS_FACES, type FocusSelfReport } from '@lee-conmigo/ui-core';
import { colors, fontFamily, radius } from '../tokens.ts';
import { Button } from './button.tsx';
import { useLayout } from './use-layout.ts';

export interface ClosingStat {
  label: string;
  value: string;
}

/** «Guardar en mi cuaderno»: lo da la app (los textos y dónde se guarda); la tarjeta solo pide la frase y muestra el resultado. */
export interface NotebookSave {
  label: string;
  prompt: string;
  placeholder: string;
  saveLabel: string;
  cancelLabel: string;
  savedLabel: string;
  dailyLabel: string;
  fullLabel: string;
  maxLength: number;
  onSave: (text: string) => 'ok' | 'empty' | 'daily' | 'full';
}

interface ClosingCardProps {
  name: string;
  stars: 0 | 1 | 2 | 3;
  /** Frase del esfuerzo que ganó las estrellas ("por volver a intentarlo"). */
  reason: string;
  stats: ClosingStat[];
  /** Las estrellas dibujadas (ganada, grande, dormida). Sin ellas se usa el texto `★` (la app las da desde `kitewise-art.ts`). */
  /** Con esto aparece «Guardar en mi cuaderno» (Kitewise B13). Sin ello, la tarjeta es la de siempre. */
  notebook?: NotebookSave;
  starImages?: { full: ImageSourcePropType; big: ImageSourcePropType; sleep: ImageSourcePropType };
  onAgain: () => void;
  onDone: (focus?: FocusSelfReport) => void;
}

/**
 * Cierre de sesión de Kitewise (B13): estrellas POR ESFUERZO (D11), tiempo, papalote, sello del día, palabras que vuelven y
 * "¿Cómo estuvo tu enfoque?" con 3 caritas (autoevaluación, nunca nota). "Guardar en mi cuaderno" llega con Mi cuaderno (K8).
 */
export function ClosingCard({ name, stars, reason, stats, starImages, notebook, onAgain, onDone }: ClosingCardProps) {
  const { t: ui } = useTranslation();

  const [focus, setFocus] = useState<FocusSelfReport | undefined>();
  const [writing, setWriting] = useState(false);
  const [idea, setIdea] = useState('');
  const [saved, setSaved] = useState<'none' | 'ok' | 'daily' | 'full'>('none');
  // el aviso de «guardado» se recuerda aquí: si la app deja de ofrecer el botón (ya guardó las de hoy), el aviso se queda
  const [savedLabel, setSavedLabel] = useState<string | null>(null);
  const { narrow, short } = useLayout();
  const small = narrow || short;
  return (
    <View style={styles.scrim} accessibilityViewIsModal>
      <ScrollView style={styles.flex} contentContainerStyle={[styles.center, small && styles.centerSmall]}>
      <View style={[styles.card, small && styles.cardSmall]}>
        <Text style={[styles.title, small && styles.titleSmall]}>{ui("¡Buen trabajo,") + " "}{name}!</Text>
        <View style={styles.stars} accessible accessibilityLabel={ui("{0} de 3 estrellas {1}", stars, reason)}>
          {[0, 1, 2].map((i) =>
            starImages ? (
              <Image key={i} source={i < stars ? (i === 1 ? starImages.big : starImages.full) : starImages.sleep} resizeMode="contain" accessible={false} style={[styles.starImg, i === 1 && styles.starImgBig, small && styles.starImgSmall, small && i === 1 && styles.starImgBigSmall]} />
            ) : (
              <Text key={i} style={[styles.star, i === 1 && styles.starBig, small && styles.starSmall, small && i === 1 && styles.starBigSmall, { color: i < stars ? colors.gold : colors.track }]}>
                ★
              </Text>
            ),
          )}
        </View>
        <Text style={styles.reason}>
          {'★'.repeat(stars)} {ui(reason)}
        </Text>
        <View style={styles.stats}>
          {stats.map((s) => (
            <View key={s.label} style={[styles.stat, small && styles.statSmall]}>
              <Text style={styles.statLabel}>{ui(s.label)}</Text>
              <Text style={[styles.statValue, small && styles.statValueSmall]}>{s.value}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.focus, small && styles.focusSmall]}>
          <Text style={[styles.focusText, small && styles.focusTextSmall]}>{ui("¿Cómo estuvo tu enfoque?")}</Text>
          {FOCUS_FACES.map((f) => (
            <Pressable key={f.value} onPress={() => setFocus(f.value)} accessibilityRole="radio" accessibilityLabel={ui(f.label)} accessibilityState={{ selected: focus === f.value }} style={[styles.face, focus === f.value && styles.faceOn]}>
              <Text style={styles.faceGlyph}>{f.glyph}</Text>
            </Pressable>
          ))}
        </View>
        {notebook && !savedLabel && (
          <View style={styles.notebook}>
            {writing ? (
              <>
                <Text style={styles.notebookPrompt}>{notebook.prompt}</Text>
                <TextInput value={idea} onChangeText={(t) => { setIdea(t); setSaved('none'); }} multiline maxLength={notebook.maxLength} placeholder={notebook.placeholder} placeholderTextColor={colors.muted} accessibilityLabel={notebook.prompt} style={styles.notebookInput} />
                {saved === 'daily' && <Text style={styles.notebookHint}>{notebook.dailyLabel}</Text>}
                {saved === 'full' && <Text style={styles.notebookHint}>{notebook.fullLabel}</Text>}
                <View style={styles.notebookActions}>
                  <View style={styles.flex}>
                    <Button label={notebook.saveLabel} onPress={() => { const r = notebook.onSave(idea); setSaved(r === 'ok' ? 'ok' : r === 'daily' || r === 'full' ? r : 'none'); if (r === 'ok') { setSavedLabel(notebook.savedLabel); setWriting(false); } }} disabled={idea.trim().length === 0} />
                  </View>
                  <View style={styles.flex}>
                    <Button label={notebook.cancelLabel} variant="secondary" onPress={() => { setWriting(false); setIdea(''); setSaved('none'); }} />
                  </View>
                </View>
              </>
            ) : (
              <Button label={notebook.label} variant="secondary" onPress={() => setWriting(true)} />
            )}
          </View>
        )}
        {savedLabel && <Text style={styles.notebookSaved} accessibilityLiveRegion="polite">{savedLabel}</Text>}
        <View style={[styles.actions, narrow && styles.actionsNarrow]}>
          <View style={styles.flex}>
            <Button label={ui("Leer de nuevo")} variant="secondary" onPress={onAgain} />
          </View>
          <View style={styles.flex}>
            <Button label={ui("Listo")} onPress={() => onDone(focus)} />
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  notebook: { gap: 8, alignSelf: 'stretch' },
  notebookPrompt: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: colors.ink },
  notebookInput: { minHeight: 72, borderRadius: 12, borderWidth: 2, borderColor: colors.track, backgroundColor: '#ffffff', padding: 12, fontFamily: fontFamily.read.regular, fontSize: 17, lineHeight: 24, color: colors.ink, textAlignVertical: 'top' },
  notebookHint: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: '#b25e00' },
  notebookActions: { flexDirection: 'row', gap: 10 },
  notebookSaved: { fontFamily: fontFamily.ui.extrabold, fontSize: 15, color: '#1a8f4a', textAlign: 'center' },
  starImg: { width: 76, height: 76 },
  starImgBig: { width: 104, height: 104 },
  starImgSmall: { width: 58, height: 58 },
  starImgBigSmall: { width: 78, height: 78 },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(20, 22, 28, 0.5)' },
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  centerSmall: { padding: 12 },
  cardSmall: { paddingHorizontal: 18, paddingVertical: 18, gap: 10 },
  titleSmall: { fontSize: 26 },
  starSmall: { fontSize: 44, lineHeight: 52 },
  starBigSmall: { fontSize: 60, lineHeight: 68 },
  statSmall: { minWidth: '40%', paddingVertical: 8 },
  statValueSmall: { fontSize: 20 },
  focusSmall: { flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 12 },
  focusTextSmall: { flexBasis: '100%', textAlign: 'center', fontSize: 16 },
  actionsNarrow: { flexDirection: 'column-reverse', gap: 10 },
  card: { width: '100%', maxWidth: 900, backgroundColor: '#ffffff', borderRadius: radius.panel + 6, paddingHorizontal: 40, paddingVertical: 30, alignItems: 'center', gap: 14, boxShadow: '0px 30px 70px rgba(0, 0, 0, 0.35)' },
  title: { fontFamily: fontFamily.ui.black, fontSize: 40, color: colors.ink, textAlign: 'center' },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  star: { fontSize: 72, lineHeight: 84 },
  starBig: { fontSize: 96, lineHeight: 108 },
  reason: { fontFamily: fontFamily.ui.extrabold, fontSize: 17, color: '#b26a00' },
  stats: { alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flex: 1, minWidth: 150, backgroundColor: colors.chip, borderRadius: radius.tile, paddingVertical: 12, alignItems: 'center', gap: 2 },
  statLabel: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  statValue: { fontFamily: fontFamily.ui.black, fontSize: 26, color: colors.ink },
  focus: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.warnTint, borderRadius: radius.tile, paddingHorizontal: 18, paddingVertical: 10 },
  focusText: { flex: 1, fontFamily: fontFamily.ui.extrabold, fontSize: 19, color: colors.ink },
  face: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0px -3px 0px ${colors.focusLedge}` },
  faceOn: { backgroundColor: colors.focus, borderWidth: 3, borderColor: colors.gold },
  faceGlyph: { fontSize: 26, color: colors.ink },
  actions: { alignSelf: 'stretch', flexDirection: 'row', gap: 14, marginTop: 4 },
});

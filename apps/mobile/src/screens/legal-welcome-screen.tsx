import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, colors, fontFamily, KiteIcon, radius, shadows, useLayout } from '@lee-conmigo/ui-native';
import { LEGAL_CONFIG, legalReady } from '../legal/config';
import { adultQuestion } from '../legal/consent';
import { LEGAL_UI, legalDocs, type LegalLang } from '../legal/copy';
import { LegalDocView } from './legal-doc-view';

interface Props {
  version: string;
  initialLang: LegalLang;
  onAccept: (lang: LegalLang) => void;
}

type View_ = 'main' | 'notice' | 'privacy' | 'terms';

/**
 * Primera pantalla de la app (y cada vez que cambian los textos legales): el adulto lee el resumen, puede abrir los textos completos, resuelve una
 * pregunta de adultos (para que un niño no la pase solo) y acepta en su nombre y en el del menor. Sin esto no se entra a la app (docs/12 §2).
 */
export function LegalWelcomeScreen({ version, initialLang, onAccept }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const [lang, setLang] = useState<LegalLang>(initialLang);
  const [view, setView] = useState<View_>('main');
  const [checked, setChecked] = useState(false);
  const [answer, setAnswer] = useState('');
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);
  const q = useMemo(() => adultQuestion(), []);
  const t = LEGAL_UI[lang];
  const docs = legalDocs(lang, LEGAL_CONFIG);

  if (view !== 'main') return <LegalDocView doc={docs[view]} backLabel={t.back} onBack={() => setView('main')} />;

  const check = (text: string) => {
    setAnswer(text);
    const ok = Number(text.trim()) === q.answer;
    setSolved(ok);
    setWrong(!ok && text.trim().length >= String(q.answer).length);
  };
  const ready = solved && checked;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingTop: insets.top + (layout.phone ? 12 : 28), paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.top}>
          <KiteIcon size={44} />
          <View style={styles.flex}>
            <Text style={styles.kicker}>{t.welcomeKicker}</Text>
            <Text style={[styles.title, layout.phone && styles.titleSmall]} accessibilityRole="header">
              {t.welcomeTitle}
            </Text>
          </View>
          <Pressable onPress={() => setLang(lang === 'es' ? 'en' : 'es')} accessibilityRole="button" accessibilityLabel={t.langButton} style={styles.lang}>
            <Text style={styles.langText}>{t.langButton}</Text>
          </Pressable>
        </View>
        <Text style={styles.body}>{t.welcomeIntro}</Text>
        <View style={styles.bullets}>
          {t.bullets.map((b) => (
            <View key={b} style={styles.bulletRow}>
              <Text style={styles.dot}>•</Text>
              <Text style={[styles.body, styles.flex]}>{b}</Text>
            </View>
          ))}
        </View>
        <View style={styles.links}>
          {(['notice', 'privacy', 'terms'] as const).map((k) => (
            <Pressable key={k} onPress={() => setView(k)} accessibilityRole="link" style={styles.link}>
              <Text style={styles.linkText}>{t.read[k]} ›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.gate}>
          <Text style={styles.gateTitle}>{t.gateTitle}</Text>
          <Text style={styles.gateQ}>{t.gateHint(q.a, q.b)}</Text>
          <TextInput value={answer} onChangeText={check} keyboardType="number-pad" maxLength={4} accessibilityLabel={t.gateHint(q.a, q.b)} style={[styles.input, solved && styles.inputOk]} />
          {wrong && <Text style={styles.warn}>{t.gateWrong}</Text>}
        </View>

        <Pressable onPress={() => setChecked(!checked)} accessibilityRole="checkbox" accessibilityState={{ checked }} style={styles.checkRow}>
          <View style={[styles.box, checked && styles.boxOn]}>{checked && <Text style={styles.tick}>✓</Text>}</View>
          <Text style={[styles.body, styles.flex]}>{t.checkbox}</Text>
        </Pressable>

        {!legalReady() && <Text style={styles.draft}>{t.draftBanner}</Text>}
        <Button label={t.accept} onPress={() => onAccept(lang)} disabled={!ready} />
        {!ready && <Text style={styles.hint}>{t.needGate}</Text>}
        <Text style={styles.version}>{t.version(version)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.app },
  content: { alignItems: 'center' },
  card: { maxWidth: 680, width: '100%', backgroundColor: '#ffffff', borderRadius: radius.card, padding: 24, gap: 16, boxShadow: shadows.card },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  kicker: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: colors.muted },
  title: { fontFamily: fontFamily.ui.black, fontSize: 32, color: colors.navy },
  titleSmall: { fontSize: 26 },
  lang: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 999, backgroundColor: colors.appAlt },
  langText: { fontFamily: fontFamily.ui.extrabold, fontSize: 14, color: colors.brand },
  body: { fontFamily: fontFamily.ui.semibold, fontSize: 16, lineHeight: 23, color: colors.inkSoft },
  bullets: { gap: 8 },
  bulletRow: { flexDirection: 'row', gap: 8 },
  dot: { fontFamily: fontFamily.ui.black, fontSize: 16, color: colors.brand },
  links: { gap: 4 },
  link: { minHeight: 44, justifyContent: 'center' },
  linkText: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.brand },
  gate: { gap: 8, backgroundColor: colors.appAlt, borderRadius: radius.tile, padding: 16 },
  gateTitle: { fontFamily: fontFamily.ui.black, fontSize: 15, color: colors.navy },
  gateQ: { fontFamily: fontFamily.ui.extrabold, fontSize: 22, color: colors.ink },
  input: { height: 52, borderRadius: 12, borderWidth: 2, borderColor: colors.track, backgroundColor: '#ffffff', paddingHorizontal: 14, fontFamily: fontFamily.ui.black, fontSize: 22, color: colors.ink, maxWidth: 160 },
  inputOk: { borderColor: '#22A95C' },
  warn: { fontFamily: fontFamily.ui.bold, fontSize: 14, color: '#b25e00' },
  checkRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', minHeight: 44 },
  box: { width: 30, height: 30, borderRadius: 8, borderWidth: 2, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', marginTop: 2 },
  boxOn: { backgroundColor: colors.brand },
  tick: { color: '#ffffff', fontFamily: fontFamily.ui.black, fontSize: 18 },
  draft: { fontFamily: fontFamily.ui.bold, fontSize: 13, color: '#b25e00', backgroundColor: '#FFF1C2', borderRadius: 10, padding: 10 },
  hint: { fontFamily: fontFamily.ui.semibold, fontSize: 13, color: colors.muted },
  version: { fontFamily: fontFamily.ui.semibold, fontSize: 12, color: colors.muted },
});

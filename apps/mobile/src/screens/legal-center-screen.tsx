import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ChevronLeftIcon, colors, fontFamily, radius, RoundButton, shadows, useLayout } from '@lee-conmigo/ui-native';
import { LEGAL_CONFIG } from '../legal/config';
import type { LegalConsent } from '../legal/consent';
import { LEGAL_UI, legalDocs, PENDING, type LegalLang } from '../legal/copy';
import { LegalDocView } from './legal-doc-view';

interface Props {
  lang: LegalLang;
  consent: LegalConsent | null;
  onErase: () => void;
  onBack: () => void;
}

/** Modo padres · Legal y privacidad: los textos aceptados, el contacto y «Borrar todos los datos» (docs/12 §6). */
export function LegalCenterScreen({ lang, consent, onErase, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const t = LEGAL_UI[lang];
  const docs = legalDocs(lang, LEGAL_CONFIG);
  const [view, setView] = useState<'main' | 'notice' | 'privacy' | 'terms'>('main');
  const [confirming, setConfirming] = useState(false);
  if (view !== 'main') return <LegalDocView doc={docs[view]} backLabel={t.back} onBack={() => setView('main')} />;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingHorizontal: layout.gutter, paddingTop: insets.top + (layout.phone ? 12 : 24), paddingBottom: insets.bottom + 28 }]}>
      <View style={styles.header}>
        <RoundButton onPress={onBack} label={t.back}>
          <ChevronLeftIcon />
        </RoundButton>
        <View style={styles.flex}>
          <Text style={styles.kicker}>{lang === 'es' ? 'Modo padres' : 'Parent mode'}</Text>
          <Text style={[styles.title, layout.phone && styles.titleSmall]} accessibilityRole="header">
            {t.legalTitle}
          </Text>
        </View>
      </View>
      <Text style={styles.body}>{t.legalIntro}</Text>

      <View style={styles.card}>
        {(['notice', 'privacy', 'terms'] as const).map((k) => (
          <Pressable key={k} onPress={() => setView(k)} accessibilityRole="link" style={styles.link}>
            <Text style={styles.linkText}>{t.read[k]} ›</Text>
          </Pressable>
        ))}
        {consent && <Text style={styles.muted}>{t.version(consent.version)} · {consent.acceptedAt.slice(0, 10)}</Text>}
        <Text style={styles.muted}>
          {t.contact}: {LEGAL_CONFIG.publisherName ?? PENDING[lang]} · {LEGAL_CONFIG.contactEmail ?? PENDING[lang]}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h3}>{t.eraseTitle}</Text>
        <Text style={styles.body}>{t.eraseBody}</Text>
        {confirming ? (
          <View style={styles.confirm}>
            <Text style={styles.warn} accessibilityLiveRegion="polite">
              {t.eraseConfirm}
            </Text>
            <View style={styles.row}>
              <Button label={t.eraseYes} onPress={onErase} />
              <Button label={t.eraseNo} variant="secondary" onPress={() => setConfirming(false)} />
            </View>
          </View>
        ) : (
          <View style={styles.row}>
            <Button label={t.eraseButton} variant="secondary" onPress={() => setConfirming(true)} />
          </View>
        )}
      </View>
    </ScrollView>
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
  card: { maxWidth: 720, width: '100%', backgroundColor: '#ffffff', borderRadius: radius.card, padding: 20, gap: 10, boxShadow: shadows.card },
  link: { minHeight: 44, justifyContent: 'center' },
  linkText: { fontFamily: fontFamily.ui.extrabold, fontSize: 16, color: colors.brand },
  muted: { fontFamily: fontFamily.ui.semibold, fontSize: 13, lineHeight: 19, color: colors.muted },
  h3: { fontFamily: fontFamily.ui.black, fontSize: 18, color: colors.navy },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  confirm: { gap: 10 },
  warn: { fontFamily: fontFamily.ui.bold, fontSize: 15, color: '#b25e00' },
});

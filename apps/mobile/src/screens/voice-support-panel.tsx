import { useEffect, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import { Button, colors, fontFamily, radius } from '@lee-conmigo/ui-native';
import { canManageMicrophonePermission, checkMicrophonePermission, openMicrophoneSettings, requestMicrophonePermission, subscribeMicrophonePermission } from '../speech/microphone-access';
import { buildVoiceSupportReport, shareVoiceSupportReport } from '../speech/voice-support-report';
import { voiceAppVersion } from '../speech/voice-journal-device';
import type { PermissionState } from '../speech/permission-gate';
import type { VoiceStatus } from '../speech/voice-types';

/** Always discoverable, including when Java did not record the process exit. Parent tool only. */
export function VoiceSupportPanel({ language, voiceStatus }: { language: 'es' | 'en'; voiceStatus: VoiceStatus }) {
  const en = language === 'en';
  const [permission, setPermission] = useState<PermissionState>('unknown');
  const [expanded, setExpanded] = useState(false);
  const [report, setReport] = useState('');
  const [message, setMessage] = useState('');
  const refresh = () => { void checkMicrophonePermission().catch(() => {}); };
  useEffect(() => {
    const off = subscribeMicrophonePermission(setPermission);
    refresh();
    const app = AppState.addEventListener('change', value => { if (value === 'active') refresh(); });
    return () => { off(); app.remove(); };
  }, []);
  useEffect(() => { setReport(buildVoiceSupportReport(permission)); }, [permission, voiceStatus]);
  const labels: Record<PermissionState, string> = en ? {
    unknown: 'Not checked', checking: 'Checking permission…', requesting: 'Waiting for Android. If no dialog appears, open app settings.',
    granted: 'Microphone allowed', denied: 'Microphone permission has not been granted', blocked: 'Allow the microphone in Android app settings', unavailable: 'Android did not respond. Open app settings to check permission.',
  } : {
    unknown: 'Sin comprobar', checking: 'Comprobando permiso…', requesting: 'Esperando a Android. Si no aparece el diálogo, abre los ajustes de la app.',
    granted: 'Micrófono permitido', denied: 'Falta conceder el permiso del micrófono', blocked: 'Permite el micrófono desde los ajustes de Android', unavailable: 'Android no respondió. Abre los ajustes para comprobar el permiso.',
  };
  const ask = async () => {
    setMessage('');
    try { await requestMicrophonePermission(); }
    catch { setMessage(en ? 'Permission could not be requested. Use Open Android settings.' : 'No se pudo solicitar el permiso. Usa Abrir ajustes de Android.'); }
  };
  const settings = async () => {
    setMessage('');
    try { await openMicrophoneSettings(); }
    catch { setMessage(en ? 'Open Android Settings → Apps → Kitewise → Permissions → Microphone.' : 'Abre Ajustes de Android → Aplicaciones → Kitewise → Permisos → Micrófono.'); }
  };
  const share = async () => {
    const text = buildVoiceSupportReport(permission);
    setReport(text); setExpanded(true);
    try { await shareVoiceSupportReport(text); }
    catch { setMessage(en ? 'Touch and hold the report to copy it.' : 'Mantén pulsado el reporte para copiarlo.'); }
  };
  return <View style={styles.card}>
    <Text style={styles.title}>{en ? 'Microphone permission' : 'Permiso del micrófono'}</Text>
    <Text accessibilityLiveRegion="polite" style={styles.text}>{labels[permission]}</Text>
    <View style={styles.actions}>
      {permission !== 'granted' && permission !== 'blocked' && <Button compact label={en ? 'Grant microphone permission' : 'Conceder permiso'} onPress={() => void ask()} disabled={!canManageMicrophonePermission || permission === 'checking' || permission === 'requesting'} />}
      <Button compact label={en ? 'Open Android settings' : 'Abrir ajustes de Android'} variant="secondary" disabled={!canManageMicrophonePermission} onPress={() => void settings()} />
    </View>
    <Text style={styles.text}>{en ? 'In Android settings: Permissions → Microphone → Allow while using the app. Then return and tap Start.' : 'En los ajustes: Permisos → Micrófono → Permitir mientras se usa la app. Después vuelve y toca Empezar.'}</Text>
    <Text style={styles.title}>{en ? 'Voice report' : 'Reporte de voz'} · {voiceAppVersion}</Text>
    <Text style={styles.text}>{en ? 'Available even if no Java crash was recorded. Only technical steps and Android exit codes; no voice or recognized text.' : 'Disponible aunque no se haya registrado un cierre Java. Solo pasos técnicos y códigos de salida de Android; sin voz ni texto reconocido.'}</Text>
    <View style={styles.actions}>
      <Button compact label={expanded ? (en ? 'Hide report' : 'Ocultar reporte') : (en ? 'View report' : 'Ver reporte')} variant="secondary" onPress={() => { setReport(buildVoiceSupportReport(permission)); setExpanded(value => !value); }} />
      <Button compact label={en ? 'Share report' : 'Compartir reporte'} variant="secondary" onPress={() => void share()} />
    </View>
    {expanded && <Text selectable style={styles.report}>{report}</Text>}
    {!!message && <Text accessibilityLiveRegion="polite" style={styles.text}>{message}</Text>}
  </View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: colors.cream, borderRadius: radius.card, padding: 18, gap: 12 },
  title: { color: colors.navy, fontFamily: fontFamily.ui.bold, fontSize: 18 },
  text: { color: colors.navy, fontFamily: fontFamily.ui.regular, fontSize: 14, lineHeight: 21 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  report: { color: colors.navy, fontSize: 12, lineHeight: 19 },
});

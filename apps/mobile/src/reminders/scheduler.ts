/**
 * Avisos locales del sistema (`expo-notifications`). TODO es local: se programan en el equipo y no hay servidor, token de envío ni cuenta.
 * El envío remoto (push) está desactivado a propósito (`plugins/no-push.js`). En la web (desarrollo) no hace nada.
 */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { REMINDER_PREFIX, type PlannedReminder } from './plan';

export type PermissionState = 'granted' | 'denied' | 'undetermined' | 'unavailable';

const CHANNEL = 'recordatorios';
let channelReady = false;

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android' || channelReady) return;
  await Notifications.setNotificationChannelAsync(CHANNEL, { name: 'Recordatorios', importance: Notifications.AndroidImportance.DEFAULT, vibrationPattern: [0], enableVibrate: false, showBadge: false });
  channelReady = true;
}

export async function permissionState(): Promise<PermissionState> {
  if (Platform.OS === 'web') return 'unavailable';
  try {
    const p = await Notifications.getPermissionsAsync();
    return p.granted ? 'granted' : p.canAskAgain === false ? 'denied' : 'undetermined';
  } catch {
    return 'unavailable';
  }
}

/** Pide el permiso (en Android 13+ muestra el cuadro del sistema). Se llama solo cuando el adulto activa un aviso. */
export async function askPermission(): Promise<PermissionState> {
  if (Platform.OS === 'web') return 'unavailable';
  try {
    await ensureChannel();
    const p = await Notifications.requestPermissionsAsync();
    return p.granted ? 'granted' : p.canAskAgain === false ? 'denied' : 'undetermined';
  } catch {
    return 'unavailable';
  }
}

/** Deja programado exactamente `planned` (y quita lo que Kitewise había programado antes). Si no hay permiso, solo limpia. */
export async function syncScheduled(planned: PlannedReminder[]): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const current = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(current.filter((n) => n.identifier.startsWith(REMINDER_PREFIX)).map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)));
    if (planned.length === 0 || (await permissionState()) !== 'granted') return;
    await ensureChannel();
    for (const r of planned) {
      await Notifications.scheduleNotificationAsync({
        identifier: r.id,
        content: { title: r.title, body: r.body },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: r.at, channelId: CHANNEL },
      });
    }
  } catch {
    // un aviso que no se pudo programar nunca debe romper la app
  }
}

/** Un aviso de prueba en 5 segundos (para que el adulto vea cómo se ve). Devuelve false si no hay permiso. */
export async function sendTestReminder(title: string, body: string): Promise<boolean> {
  if (Platform.OS === 'web' || (await permissionState()) !== 'granted') return false;
  try {
    await ensureChannel();
    await Notifications.scheduleNotificationAsync({
      identifier: `${REMINDER_PREFIX}test`,
      content: { title, body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5, channelId: CHANNEL },
    });
    return true;
  } catch {
    return false;
  }
}

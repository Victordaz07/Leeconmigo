import { deviceKV } from '../persist/kv';
import { KEYS, readJSON, writeJSON } from '../persist/store';

export const MIN_READER_FONT = 22;
export const MAX_READER_FONT = 36;
export const readerFontSize = (value: unknown, level: number): number => typeof value === 'number' && Number.isFinite(value)
  ? Math.max(MIN_READER_FONT, Math.min(MAX_READER_FONT, Math.round(value)))
  : level <= 2 ? 30 : level <= 4 ? 27 : 25;

export function loadReaderFont(profileId: string, level: number): number {
  return readerFontSize(readJSON<{ size?: number }>(deviceKV, KEYS.readerPrefs(profileId), {}).size, level);
}

export function saveReaderFont(profileId: string, size: number): void {
  writeJSON(deviceKV, KEYS.readerPrefs(profileId), { size: readerFontSize(size, 3) });
}

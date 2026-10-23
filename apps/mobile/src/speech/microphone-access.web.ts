export const canManageMicrophonePermission = false;
import type { PermissionState } from './permission-gate';
const unavailable = async () => ({ granted: false, canAskAgain: false });
export const checkMicrophonePermission = unavailable;
export const requestMicrophonePermission = unavailable;
export const subscribeMicrophonePermission = (callback: (state: PermissionState) => void): (() => void) => { callback('unavailable'); return () => {}; };
export async function openMicrophoneSettings(): Promise<void> {}

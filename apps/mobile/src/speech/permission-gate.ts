/** A timed-out OS dialog still owns its pending request. Never launch a duplicate. */
export interface MicrophonePermission { granted: boolean; canAskAgain: boolean }
export type PermissionState = 'unknown' | 'checking' | 'requesting' | 'granted' | 'denied' | 'blocked' | 'unavailable';
export function withDeadline<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('microphone_operation_timeout')), ms);
    promise.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}
export class MicrophonePermissionGate<T extends MicrophonePermission> {
  private pending: Promise<T> | null = null;
  private state: PermissionState = 'unknown';
  private listeners = new Set<(state: PermissionState) => void>();
  constructor(private readonly bridge: { check(): Promise<T>; request(): Promise<T> }, private readonly timeoutMs = 20000) {}
  subscribe(callback: (state: PermissionState) => void): () => void {
    this.listeners.add(callback); callback(this.state);
    return () => { this.listeners.delete(callback); };
  }
  async check(): Promise<T> {
    this.update('checking');
    try {
      const result = await withDeadline(Promise.resolve().then(() => this.bridge.check()), 3000);
      this.update(result.granted ? 'granted' : this.pending ? 'requesting' : result.canAskAgain ? 'denied' : 'blocked');
      return result;
    } catch (error) { this.update('unavailable'); throw error; }
  }
  async request(): Promise<T> {
    const current = await this.check();
    if (current.granted || !current.canAskAgain) return current;
    this.update('requesting');
    if (!this.pending) {
      this.pending = Promise.resolve().then(() => this.bridge.request()).finally(() => { this.pending = null; });
    }
    try {
      const result = await withDeadline(this.pending, this.timeoutMs);
      this.update(result.granted ? 'granted' : result.canAskAgain ? 'denied' : 'blocked');
      return result;
    } catch (error) { this.update('unavailable'); throw error; }
  }
  private update(state: PermissionState): void {
    this.state = state;
    this.listeners.forEach(callback => callback(state));
  }
}

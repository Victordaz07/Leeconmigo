import { afterEach, describe, expect, it, vi } from 'vitest';
import { MicrophonePermissionGate, type MicrophonePermission, type PermissionState } from '../src/speech/permission-gate';
const allowed = { granted: true, canAskAgain: true };
const denied = { granted: false, canAskAgain: true };
const blocked = { granted: false, canAskAgain: false };
function setup() {
  const bridge = { check: vi.fn(async () => denied), request: vi.fn(async () => allowed) };
  const gate = new MicrophonePermissionGate(bridge);
  const states: PermissionState[] = [];
  gate.subscribe(state => states.push(state));
  return { gate, bridge, states };
}
afterEach(() => vi.useRealTimers());
describe('microphone permission recovery', () => {
  it('does not open a dialog when permission is already granted', async () => {
    const { gate, bridge, states } = setup(); bridge.check.mockResolvedValue(allowed);
    expect(await gate.request()).toEqual(allowed);
    expect(bridge.request).not.toHaveBeenCalled(); expect(states.at(-1)).toBe('granted');
  });
  it('requests the permission and exposes the resulting state', async () => {
    const { gate, bridge, states } = setup();
    expect(await gate.request()).toEqual(allowed);
    expect(bridge.request).toHaveBeenCalledTimes(1);
    expect(states).toContain('requesting'); expect(states.at(-1)).toBe('granted');
  });
  it('sends blocked permission to settings instead of pretending to show a dialog', async () => {
    const { gate, bridge, states } = setup(); bridge.check.mockResolvedValue(blocked);
    expect(await gate.request()).toEqual(blocked);
    expect(bridge.request).not.toHaveBeenCalled(); expect(states.at(-1)).toBe('blocked');
  });
  it('shares one native request between two simultaneous consumers', async () => {
    const { gate, bridge } = setup(); let grant!: (p: MicrophonePermission) => void;
    bridge.request.mockImplementation(() => new Promise(resolve => { grant = resolve; }));
    const a = gate.request(); const b = gate.request();
    await vi.waitFor(() => expect(bridge.request).toHaveBeenCalledTimes(1));
    grant(allowed); expect(await a).toEqual(allowed); expect(await b).toEqual(allowed);
  });
  it('does not wait indefinitely for a permission check', async () => {
    vi.useFakeTimers(); const { gate, bridge, states } = setup();
    bridge.check.mockImplementation(() => new Promise(() => {}));
    const checked = gate.check().catch(() => 'timeout');
    await vi.advanceTimersByTimeAsync(3000);
    expect(await checked).toBe('timeout'); expect(states.at(-1)).toBe('unavailable');
  });
  it('retains ownership of a timed-out OS dialog and never opens a duplicate', async () => {
    vi.useFakeTimers(); const { gate, bridge, states } = setup(); let grant!: (p: MicrophonePermission) => void;
    bridge.request.mockImplementation(() => new Promise(resolve => { grant = resolve; }));
    let continued = false;
    const first = gate.request().then(() => { continued = true; }, () => 'timeout');
    await vi.advanceTimersByTimeAsync(20000); expect(await first).toBe('timeout');
    expect(states.at(-1)).toBe('unavailable');
    const retry = gate.request().catch(() => 'timeout');
    await vi.advanceTimersByTimeAsync(20000); expect(await retry).toBe('timeout');
    expect(bridge.request).toHaveBeenCalledTimes(1);
    grant(allowed); await Promise.resolve(); await Promise.resolve();
    expect(continued).toBe(false); // Late permission cannot resume a cancelled start.
    bridge.check.mockResolvedValue(allowed); expect(await gate.request()).toEqual(allowed);
    expect(bridge.request).toHaveBeenCalledTimes(1);
  });
  it('refreshes the permission after an adult changes it in Android settings', async () => {
    const { gate, bridge, states } = setup(); bridge.check.mockResolvedValueOnce(blocked).mockResolvedValueOnce(allowed);
    await gate.check(); expect(states.at(-1)).toBe('blocked');
    await gate.check(); expect(states.at(-1)).toBe('granted');
  });
  it('contains synchronous bridge errors and allows a later retry', async () => {
    const { gate, bridge, states } = setup(); bridge.request.mockImplementationOnce(() => { throw new Error('invalid activity'); });
    await expect(gate.request()).rejects.toThrow('invalid activity'); expect(states.at(-1)).toBe('unavailable');
    expect(await gate.request()).toEqual(allowed);
  });
});

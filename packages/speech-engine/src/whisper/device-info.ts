/** Mínimo necesario del spike original: solo si el dispositivo tiene WebGPU disponible. */

let webGpuCache: Promise<boolean> | null = null;

export async function hasWebGpu(): Promise<boolean> {
  webGpuCache ??= (async (): Promise<boolean> => {
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu;
    if (!gpu) return false;
    try {
      return (await gpu.requestAdapter()) !== null;
    } catch {
      return false;
    }
  })();
  return webGpuCache;
}

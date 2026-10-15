/**
 * Detector de actividad de voz (VAD) que corre ANTES de Whisper.
 *
 * Por qué existe: Whisper "alucina" texto en silencio o ruido ("gracias por ver el video"...).
 * Si una ventana no contiene voz, ni siquiera se envía al modelo y se registra como
 * "bloqueado por VAD".
 *
 * Dos implementaciones intercambiables (interfaz `VoiceActivityDetector`):
 *  - SileroVad:  modelo Silero VAD (ONNX, ~2 MB) del paquete @ricky0123/vad-web. Recomendado.
 *  - EnergyVad:  respaldo sin modelo: energía (RMS) contra un piso de ruido adaptativo.
 *
 * Trabaja con frames de 512 muestras (32 ms a 16 kHz). La conversión de probabilidades a
 * marcas de voz/no-voz (histéresis) está en speech-timeline.ts.
 */
import * as ort from 'onnxruntime-web/wasm';
import { Silero } from '@ricky0123/vad-web/dist/models';
import type { VadKind } from './config.ts';

export interface VoiceActivityDetector {
  readonly kind: VadKind;
  /** Probabilidad (0-1) de que este frame de 512 muestras contenga voz. */
  process(frame: Float32Array): Promise<number>;
  reset(): void;
  dispose(): Promise<void>;
}

// ---------------------------------------------------------------------------
// Silero
// ---------------------------------------------------------------------------

export class SileroVad implements VoiceActivityDetector {
  readonly kind = 'silero' as const;
  private model: Awaited<ReturnType<typeof Silero.new>> | null = null;

  /** `base` = ruta base de la app (import.meta.env.BASE_URL). Los archivos los copia scripts/copy-assets.mjs. */
  static async create(base: string): Promise<SileroVad> {
    // El runtime de ONNX se sirve desde nuestro propio origen (nada de CDN) => funciona sin internet.
    ort.env.wasm.wasmPaths = `${new URL(base, location.href).href}ort/`;
    ort.env.wasm.numThreads = 1; // el VAD es diminuto; los hilos se reservan para Whisper
    ort.env.wasm.proxy = false;
    const vad = new SileroVad();
    const fetcher = async () => {
      const res = await fetch(`${base}vad/silero_vad_v5.onnx`);
      if (!res.ok) throw new Error(`No se pudo cargar silero_vad_v5.onnx (${res.status})`);
      return res.arrayBuffer();
    };
    vad.model = await Silero.new(ort, fetcher);
    return vad;
  }

  async process(frame: Float32Array): Promise<number> {
    const p = await this.model!.process(frame);
    return p.isSpeech;
  }
  reset(): void {
    this.model?.reset_state();
  }
  async dispose(): Promise<void> {
    await this.model?.release();
    this.model = null;
  }
}

// ---------------------------------------------------------------------------
// VAD por energía (respaldo)
// ---------------------------------------------------------------------------

/**
 * Compara el nivel de cada frame (dBFS) con un piso de ruido que se aprende solo:
 *  - el piso baja rápido cuando el ambiente se calla y sube muy despacio, así la voz sostenida
 *    no se "aprende" como ruido;
 *  - hay voz cuando el frame supera el piso por ~9 dB y un mínimo absoluto.
 * Devuelve una pseudo-probabilidad para poder usar la misma histéresis que Silero.
 */
export class EnergyVad implements VoiceActivityDetector {
  readonly kind = 'energy' as const;
  private floorDb = -60;
  private frames = 0;

  async process(frame: Float32Array): Promise<number> {
    let sum = 0;
    for (let i = 0; i < frame.length; i++) sum += frame[i] * frame[i];
    const db = 10 * Math.log10(sum / frame.length + 1e-10);
    this.frames++;
    if (this.frames < 10) this.floorDb = Math.max(this.floorDb, db); // arranque: primeros ~0.3 s
    else if (db < this.floorDb) this.floorDb = this.floorDb * 0.9 + db * 0.1; // baja rápido
    else this.floorDb += 0.002 * (db - this.floorDb); // sube muy lento
    const margin = db - Math.max(this.floorDb, -70);
    if (db < -55) return 0; // demasiado bajo para ser voz aunque el piso sea minúsculo
    return Math.min(1, Math.max(0, (margin - 3) / 12)); // 3 dB => 0, 15 dB => 1
  }
  reset(): void {
    this.floorDb = -60;
    this.frames = 0;
  }
  async dispose(): Promise<void> {}
}

/** Crea el VAD pedido; si Silero falla (WASM bloqueado, archivos ausentes...) cae al de energía. */
export async function createVad(kind: VadKind, base: string): Promise<{ vad: VoiceActivityDetector; note?: string }> {
  if (kind === 'silero') {
    try {
      return { vad: await SileroVad.create(base) };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { vad: new EnergyVad(), note: `Silero VAD no cargó (${msg}); se usa el VAD por energía.` };
    }
  }
  return { vad: new EnergyVad() };
}

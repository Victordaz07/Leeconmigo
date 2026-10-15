/**
 * Captura de micrófono a 16 kHz con AudioWorklet + memoria temporal del audio.
 *
 * PRIVACIDAD: el audio vive solo en memoria RAM, en un anillo de RING_SECONDS segundos que se
 * sobrescribe continuamente. No hay archivos, ni Blob persistente, ni IndexedDB, ni red.
 */
import { FRAME_SAMPLES, SAMPLE_RATE } from './config.ts';
import { AudioRingBuffer } from './audio-ring.ts';
// Vite empaqueta el worklet como archivo aparte y nos da su URL.
import workletUrl from './capture.worklet.ts?worker&url';

export { AudioRingBuffer };

export interface CaptureOptions {
  /** Filtros del navegador (control automático de ganancia + supresión de ruido + eco). */
  browserFilters: boolean;
  /** Se llama con cada frame de 512 muestras (32 ms) a 16 kHz. */
  onFrame: (frame: Float32Array) => void;
  /** El micrófono se desconectó o el navegador cortó la captura. */
  onEnded?: () => void;
}

export class AudioCapture {
  private stream: MediaStream | null = null;
  private ctx: AudioContext | null = null;
  private node: AudioWorkletNode | null = null;
  private keepAlive: ConstantSourceNode | null = null;
  private wakeLock: WakeLockSentinel | null = null;
  actualSampleRate = 0;

  get running(): boolean {
    return this.ctx !== null;
  }

  async start(opts: CaptureOptions): Promise<void> {
    if (!window.isSecureContext) throw new Error('El micrófono requiere HTTPS (contexto seguro).');
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: opts.browserFilters,
        noiseSuppression: opts.browserFilters,
        autoGainControl: opts.browserFilters,
      },
    });
    const track = this.stream.getAudioTracks()[0];
    track.addEventListener('ended', () => opts.onEnded?.());

    this.ctx = new AudioContext({ sampleRate: SAMPLE_RATE, latencyHint: 'interactive' });
    this.actualSampleRate = this.ctx.sampleRate;
    await this.ctx.audioWorklet.addModule(workletUrl);
    await this.ctx.resume();

    const source = this.ctx.createMediaStreamSource(this.stream);
    this.node = new AudioWorkletNode(this.ctx, 'capture-processor');
    this.node.port.onmessage = (e: MessageEvent<Float32Array>) => {
      if (e.data.length === FRAME_SAMPLES) opts.onFrame(e.data);
    };
    // Se conecta a una ganancia 0 => el nodo se procesa, pero el micrófono NUNCA suena por los parlantes.
    const mute = this.ctx.createGain();
    mute.gain.value = 0;
    source.connect(this.node);
    this.node.connect(mute).connect(this.ctx.destination);

    // Mantiene vivo el hilo de audio. En pruebas, Chrome atrasaba el reloj de un AudioContext
    // cuya salida era silencio digital (~3-5 s perdidos hacia los 30 s de sesión) y no lo hacía si
    // la salida no era silencio. Una constante de 1e-4 (-80 dBFS) es inaudible pero no es "silencio".
    this.keepAlive = this.ctx.createConstantSource();
    this.keepAlive.offset.value = 1e-4;
    this.keepAlive.connect(this.ctx.destination);
    this.keepAlive.start();

    // Mantener la pantalla encendida durante la sesión larga (si el navegador lo permite).
    try {
      this.wakeLock = (await navigator.wakeLock?.request('screen')) ?? null;
    } catch {
      this.wakeLock = null;
    }
  }

  async stop(): Promise<void> {
    this.node?.port.close();
    this.node?.disconnect();
    this.keepAlive?.stop();
    this.keepAlive?.disconnect();
    this.keepAlive = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    await this.ctx?.close().catch(() => undefined);
    await this.wakeLock?.release().catch(() => undefined);
    this.node = null;
    this.stream = null;
    this.ctx = null;
    this.wakeLock = null;
  }
}

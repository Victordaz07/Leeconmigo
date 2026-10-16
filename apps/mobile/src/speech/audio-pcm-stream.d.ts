// Tipos del módulo de captura (el paquete los declara con su nombre viejo, `react-native-live-audio-stream`).
declare module '@fugood/react-native-audio-pcm-stream' {
  interface Options {
    sampleRate: number;
    channels: number;
    bitsPerSample: number;
    /** Android: `MediaRecorder.AudioSource` (6 = VOICE_RECOGNITION). */
    audioSource?: number;
    bufferSize?: number;
    wavFile?: string;
  }
  interface Subscription {
    remove(): void;
  }
  const AudioRecord: {
    init(options: Options): void;
    start(): void;
    stop(): Promise<string>;
    /** Trozos de PCM en base64, solo en memoria (el módulo nunca escribe archivos). */
    on(event: 'data', callback: (data: string) => void): Subscription;
  };
  export default AudioRecord;
}

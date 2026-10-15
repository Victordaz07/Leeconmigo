/** Mensajes entre el hilo principal (whisper-client.ts) y el Web Worker (whisper-worker.ts). */

export type WorkerRequest =
  | {
      type: 'init';
      modelId: string;
      backend: 'webgpu' | 'wasm';
      /** dtype de Transformers.js: 'q8' o un objeto por módulo ONNX. */
      dtype: string | Record<string, string>;
      language: string;
      /** URL absoluta (con "/" final) de la carpeta con los archivos de ONNX Runtime. */
      wasmBase: string;
      /** URL absoluta (con "/" final) de la carpeta con los modelos empaquetados en la app (sin red). */
      modelsBase: string;
      threads: number;
      /** true => no se permite ninguna descarga: todo tiene que estar ya en caché. */
      offlineOnly: boolean;
    }
  | { type: 'transcribe'; id: number; audio: Float32Array; language: string }
  | { type: 'dispose' };

export type WorkerResponse =
  | { type: 'progress'; info: Record<string, unknown> }
  | { type: 'ready'; backend: 'webgpu' | 'wasm'; loadMs: number; warmupMs: number; threads: number; crossOriginIsolated: boolean }
  | { type: 'result'; id: number; text: string; inferenceMs: number }
  | { type: 'error'; id?: number; message: string };

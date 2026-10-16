/**
 * VAD por energía, sin modelo ni dependencias (módulo puro: sirve en la web y en la app nativa).
 * Compara el nivel de cada frame (dBFS) con un piso de ruido que se aprende solo:
 *  - el piso baja rápido cuando el ambiente se calla y sube muy despacio, así la voz sostenida
 *    no se "aprende" como ruido;
 *  - hay voz cuando el frame supera el piso por ~9 dB y un mínimo absoluto.
 * Devuelve una pseudo-probabilidad para poder usar la misma histéresis que Silero.
 */
export class EnergyVad {
  readonly kind = 'energy' as const;
  private floorDb = -60;
  private frames = 0;

  async process(frame: Float32Array): Promise<number> {
    return this.probability(frame);
  }

  /** Igual que `process`, pero síncrono (la app nativa lo llama por cada frame de 32 ms). */
  probability(frame: Float32Array): number {
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


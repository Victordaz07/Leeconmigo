import { describe, expect, it } from 'vitest';
import { base64ToBytes, EnergyVad, FRAME_SAMPLES, int16BytesToFloat32, pcm16Base64ToFloat32, UtteranceSegmenter, type SegmenterEvent } from '../src/core.ts';

const toB64 = (bytes: number[]) => Buffer.from(Uint8Array.from(bytes)).toString('base64');

describe('PCM en memoria', () => {
  it('decodifica base64 igual que Node, con y sin relleno', () => {
    for (const bytes of [[1], [1, 2], [1, 2, 3], [0, 255, 128, 7, 9], Array.from({ length: 300 }, (_, i) => i % 256)]) {
      expect([...base64ToBytes(toB64(bytes))]).toEqual(bytes);
    }
  });

  it('PCM16 little-endian con signo → −1…1', () => {
    const f = int16BytesToFloat32(Uint8Array.from([0x00, 0x00, 0xff, 0x7f, 0x00, 0x80, 0x00, 0x40]));
    expect([...f].map((v) => Math.round(v * 1000) / 1000)).toEqual([0, 1, -1, 0.5]);
    expect(pcm16Base64ToFloat32(toB64([0x00, 0x40])).length).toBe(1);
  });
});

/** Silencio y "voz" sintética: frames de 512 muestras con la probabilidad dada. */
const frames = (n: number, prob: number) => Array.from({ length: n }, () => ({ samples: new Float32Array(FRAME_SAMPLES).fill(prob), prob }));
const run = (seg: UtteranceSegmenter, parts: { samples: Float32Array; prob: number }[]) => parts.flatMap((p) => seg.push(p.samples, (fr) => fr[0]));

describe('frases (UtteranceSegmenter)', () => {
  it('silencio → voz → silencio entrega UNA frase con su audio, y avisa de la voz', () => {
    const seg = new UtteranceSegmenter();
    const ev = run(seg, [...frames(20, 0), ...frames(40, 0.9), ...frames(30, 0)]);
    expect(ev.filter((e) => e.type === 'voice').map((e) => (e as { active: boolean }).active)).toEqual([true, false]);
    const utts = ev.filter((e): e is Extract<SegmenterEvent, { type: 'utterance' }> => e.type === 'utterance');
    expect(utts).toHaveLength(1);
    // ~40 frames de voz (32 ms c/u) + un poco antes para no cortar la primera sílaba.
    expect(utts[0].endMs - utts[0].startMs).toBeGreaterThan(40 * 32 - 1);
    expect(utts[0].audio.length).toBe(((utts[0].endMs - utts[0].startMs) / 32) * FRAME_SAMPLES);
  });

  it('un ruido breve no es frase', () => {
    const ev = run(new UtteranceSegmenter(), [...frames(10, 0), ...frames(4, 0.9), ...frames(30, 0)]);
    expect(ev.some((e) => e.type === 'utterance')).toBe(false);
  });

  it('una frase muy larga se corta en trozos sin dejar de escuchar', () => {
    const ev = run(new UtteranceSegmenter({ maxUtteranceMs: 2000 }), [...frames(5, 0), ...frames(200, 0.9)]);
    expect(ev.filter((e) => e.type === 'utterance').length).toBeGreaterThanOrEqual(2);
    expect(ev.filter((e) => e.type === 'voice')).toHaveLength(1);
  });

  it('acepta trozos de cualquier tamaño y `flush` cierra la frase en curso', () => {
    const seg = new UtteranceSegmenter();
    const voice = new Float32Array(FRAME_SAMPLES * 30).fill(0.9);
    const ev = [...seg.push(new Float32Array(FRAME_SAMPLES * 5), (f) => f[0]), ...seg.push(voice.subarray(0, 1000), (f) => f[0]), ...seg.push(voice.subarray(1000), (f) => f[0]), ...seg.flush()];
    expect(ev.filter((e) => e.type === 'utterance')).toHaveLength(1);
  });

  it('el VAD por energía distingue silencio de voz fuerte', () => {
    const vad = new EnergyVad();
    for (let i = 0; i < 20; i++) vad.probability(new Float32Array(FRAME_SAMPLES).fill(0.0005));
    const loud = Float32Array.from({ length: FRAME_SAMPLES }, (_, i) => 0.3 * Math.sin(i / 3));
    expect(vad.probability(loud)).toBeGreaterThan(0.8);
    expect(vad.probability(new Float32Array(FRAME_SAMPLES).fill(0.0005))).toBe(0);
  });
});

describe('texto de Whisper', () => {
  it('quita marcas de sonido y espacios', async () => {
    const { cleanTranscript } = await import('../src/core.ts');
    expect(cleanTranscript(' [BLANK_AUDIO] ')).toBe('');
    expect(cleanTranscript('La cometa (risas) roja  [música] se quedó *tos*')).toBe('La cometa roja se quedó');
  });
});

import { describe, expect, it } from 'vitest';
import { constrainArt, fitArt, INITIAL_ART_POSE, pinchArt } from '../src/illustration-zoom.ts';

describe('illustration zoom', () => {
  it('fits complete art in tall, wide and unfolded viewports without distortion', () => {
    for (const viewport of [{ width: 390, height: 700 }, { width: 844, height: 260 }, { width: 800, height: 700 }]) {
      const fitted = fitArt({ width: 1536, height: 1024 }, viewport);
      expect(fitted.width / fitted.height).toBeCloseTo(1.5);
      expect(fitted.width).toBeLessThanOrEqual(viewport.width);
      expect(fitted.height).toBeLessThanOrEqual(viewport.height);
    }
  });
  it('anchors a pinch to the illustration point beneath the fingers', () => {
    expect(pinchArt(INITIAL_ART_POSE, { x: 50, y: 30 }, { x: 70, y: 40 }, 2)).toEqual({ zoom: 2, x: -30, y: -20 });
  });
  it('bounds zoom and panning, and recenters axes that fit after rotation or reset', () => {
    expect(constrainArt({ zoom: 9, x: 999, y: -999 }, { width: 300, height: 200 }, { width: 300, height: 600 })).toEqual({ zoom: 4, x: 450, y: -100 });
    expect(constrainArt({ zoom: 0.5, x: 100, y: 100 }, { width: 300, height: 200 }, { width: 300, height: 600 })).toEqual(INITIAL_ART_POSE);
    expect(constrainArt({ zoom: 2, x: 100, y: 100 }, { width: 300, height: 200 }, { width: 900, height: 400 })).toEqual({ zoom: 2, x: 0, y: 0 });
  });
});

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import type { Story } from '@lee-conmigo/contracts';
import { originalReadingResume, prepareReading, readingIndexForResume, validateReadingEdition, type ReadingEdition } from '../src/reading-edition.ts';

const root = join(import.meta.dirname, '../../..');
const editions = readdirSync(join(root, 'packages/story-engine/reading-editions')).map(f => JSON.parse(readFileSync(join(root, 'packages/story-engine/reading-editions', f), 'utf8')) as ReadingEdition);
const variants = ['es', 'en'].flatMap(lang => readdirSync(join(root, 'packages/story-engine/stories', lang)).map(file => JSON.parse(readFileSync(join(root, 'packages/story-engine/stories', lang, file), 'utf8')) as Story));

describe('prepared reading editions', () => {
  for (const edition of editions) it(`${edition.familyId}: all art references match the actual bundled images`, async () => {
    for (const scene of edition.scenes) {
      const image = await sharp(join(root, 'apps/reader/public', scene.illustration.src)).metadata();
      expect(image.width).toBe(scene.illustration.width);
      expect(image.height).toBe(scene.illustration.height);
    }
  });
  for (const edition of editions) for (const source of variants.filter(s => (s.familyId ?? s.id) === edition.familyId)) {
    it(`${source.id}: preserves every paragraph, vocabulary and story identity`, () => {
      expect(validateReadingEdition(source, edition)).toEqual([]);
      const prepared = prepareReading(source, edition);
      expect(prepared.story.id).toBe(source.id);
      expect(prepared.story.vocabulary).toBe(source.vocabulary);
      expect(prepared.story.pages.flatMap(p => p.blocks.flatMap(b => b.lines))).toEqual(source.pages.flatMap(p => p.blocks.flatMap(b => b.lines)));
      expect(new Set(prepared.story.pages.map(p => p.id)).size).toBe(prepared.story.pages.length);
      for (const [i, page] of prepared.story.pages.entries()) {
        const anchor = prepared.anchors[i];
        expect(page.blocks).toHaveLength(1);
        expect(page.blocks[0].layout).toBeUndefined();
        if (page.checkpoint) {
          expect(prepared.anchors[i + 1]?.pageIndex).not.toBe(anchor.pageIndex);
          expect(page.checkpoint).toBe(source.pages[anchor.pageIndex].checkpoint);
        }
        expect(readingIndexForResume(prepared, originalReadingResume(prepared, i, '2026-10-22T12:00:00Z'))).toBe(i);
      }
      for (let pageIndex = 0; pageIndex < source.pages.length; pageIndex++) {
        const index = readingIndexForResume(prepared, { storyId: source.id, pageIndex, updatedAt: '' });
        expect(prepared.anchors[index].pageIndex).toBe(pageIndex);
        expect(prepared.anchors[index].lineIndex).toBe(0);
      }
    });
  }

  it('rejects missing scenes and a crop outside the artwork', () => {
    const edition = editions[0];
    const source = variants.find(s => s.familyId === edition.familyId)!;
    expect(validateReadingEdition(source, { ...edition, scenes: edition.scenes.slice(1) })).not.toEqual([]);
    const scenes = edition.scenes.map((s, i) => i ? s : { ...s, crop: { x: 0, y: 0, width: 99999, height: 10 } });
    expect(validateReadingEdition(source, { ...edition, scenes })).not.toEqual([]);
    expect(() => prepareReading(source, { ...edition, scenes })).toThrow();
  });

  it('splits long passages only between paragraphs and restores the nearest stable line anchor', () => {
    const edition = editions[0];
    const source = variants.find(s => s.familyId === edition.familyId)!;
    const original = source.pages[0].blocks[0];
    const lines = Array.from({ length: 4 }, (_, i) => `${i} ${'lectura '.repeat(30)}`.trim());
    const book = { ...source, pages: [{ ...source.pages[0], blocks: [{ ...original, lines }] }] };
    const config = { ...edition, maxWordsPerUnit: 40, scenes: [edition.scenes[0]] };
    const prepared = prepareReading(book, config);
    expect(prepared.story.pages).toHaveLength(4);
    expect(readingIndexForResume(prepared, { storyId: book.id, pageIndex: 0, blockId: original.id, lineIndex: 2, updatedAt: '' })).toBe(2);
    expect(readingIndexForResume(prepared, { storyId: book.id, pageIndex: 0, blockId: 'old-block', updatedAt: '' })).toBe(0);
  });
});

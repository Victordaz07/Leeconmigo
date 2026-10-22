import type { IllustrationRef, PixelRect, ResumePoint, Story, StoryPage } from '@lee-conmigo/contracts';

/** An edition changes presentation, never the story's text, vocabulary or identity. */
export interface ReadingEdition {
  version: 1;
  familyId: string;
  maxWordsPerUnit: number;
  scenes: Array<{ pageId: string; blockId: string; illustration: IllustrationRef; crop?: PixelRect; alt?: Partial<Record<Story['language'], string>> }>;
}

export interface ReadingAnchor {
  pageIndex: number;
  blockId: string;
  lineIndex: number;
  crop?: PixelRect;
}

export interface PreparedReading {
  story: Story;
  anchors: ReadingAnchor[];
}

export function validateReadingEdition(story: Story, edition: ReadingEdition): string[] {
  if (!edition || edition.version !== 1 || edition.familyId !== (story.familyId ?? story.id) || !Array.isArray(edition.scenes)) return ['La edición no corresponde a la historia'];
  const errors: string[] = [];
  if (!Number.isInteger(edition.maxWordsPerUnit) || edition.maxWordsPerUnit < 40 || edition.maxWordsPerUnit > 300) errors.push('Límite de palabras inválido');
  const expected = story.pages.flatMap(p => p.blocks.map(b => `${p.id}/${b.id}`));
  const actual = edition.scenes.map(s => `${s.pageId}/${s.blockId}`);
  if (expected.length !== actual.length || expected.some((key, i) => key !== actual[i])) errors.push('Las escenas deben cubrir todos los bloques en el orden original');
  for (const scene of edition.scenes) {
    const a = scene.illustration;
    if (!a || !a.src || !Number.isFinite(a.width) || !Number.isFinite(a.height) || a.width <= 0 || a.height <= 0 || !a.alt?.trim()) {
      errors.push(`Ilustración inválida: ${scene.pageId}/${scene.blockId}`);
      continue;
    }
    const r = scene.crop;
    if (r && (![r.x, r.y, r.width, r.height].every(Number.isFinite) || r.x < 0 || r.y < 0 || r.width <= 0 || r.height <= 0 || r.x + r.width > a.width || r.y + r.height > a.height)) errors.push(`Encuadre fuera de la ilustración: ${scene.pageId}/${scene.blockId}`);
  }
  return errors;
}

/** Paragraph boundaries are stable across sizes, font settings and device orientation. */
export function prepareReading(story: Story, edition: ReadingEdition): PreparedReading {
  const problems = validateReadingEdition(story, edition);
  if (problems.length) throw new Error(problems.join('; '));
  const pages: StoryPage[] = [];
  const anchors: ReadingAnchor[] = [];
  let sceneIndex = 0;
  story.pages.forEach((page, pageIndex) => {
    page.blocks.forEach(block => {
      const scene = edition.scenes[sceneIndex++];
      let start = 0;
      while (start < block.lines.length) {
        let end = start;
        let count = 0;
        do {
          count += block.lines[end].split(/\s+/).filter(Boolean).length;
          end++;
        } while (end < block.lines.length && count + block.lines[end].split(/\s+/).filter(Boolean).length <= edition.maxWordsPerUnit);
        const lastInPage = block === page.blocks[page.blocks.length - 1] && end === block.lines.length;
        const { layout: _layout, ...text } = block;
        pages.push({
          id: `${page.id}-${block.id}-l${start}`,
          illustration: { ...scene.illustration, alt: scene.alt?.[story.language] ?? scene.illustration.alt },
          blocks: [{ ...text, lines: block.lines.slice(start, end) }],
          ...(lastInPage && page.checkpoint ? { checkpoint: page.checkpoint } : {}),
        });
        anchors.push({ pageIndex, blockId: block.id, lineIndex: start, ...(scene.crop ? { crop: scene.crop } : {}) });
        start = end;
      }
    });
  });
  return { story: { ...story, pages }, anchors };
}

/** Old page-only bookmarks open at that page's first scene; unknown block anchors degrade safely. */
export function readingIndexForResume(prepared: PreparedReading, resume: ResumePoint | null): number {
  if (!resume || resume.storyId !== prepared.story.id) return 0;
  const page = Number.isInteger(resume.pageIndex) ? Math.max(0, resume.pageIndex) : 0;
  const onPage = prepared.anchors.map((a, index) => ({ ...a, index })).filter(a => a.pageIndex === page);
  if (!onPage.length) return page > prepared.anchors.at(-1)!.pageIndex ? prepared.anchors.length - 1 : 0;
  const inBlock = onPage.filter(a => a.blockId === resume.blockId);
  if (!inBlock.length) return onPage[0].index;
  const line = Number.isInteger(resume.lineIndex) ? Math.max(0, resume.lineIndex!) : 0;
  return inBlock.filter(a => a.lineIndex <= line).at(-1)?.index ?? inBlock[0].index;
}

export function originalReadingResume(prepared: PreparedReading, index: number, updatedAt: string): ResumePoint {
  const anchor = prepared.anchors[Math.max(0, Math.min(prepared.anchors.length - 1, index))];
  return { storyId: prepared.story.id, pageIndex: anchor.pageIndex, blockId: anchor.blockId, lineIndex: anchor.lineIndex, updatedAt };
}

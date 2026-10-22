// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import type { Story } from '@lee-conmigo/contracts';
import { MemoryProgressStore, isWordComplete, tileOrder } from '@lee-conmigo/session-engine';
import { prepareReading, type ReadingEdition } from '@lee-conmigo/story-engine';
import sourceJson from '../../../packages/story-engine/stories/es/el-puente-de-las-luciernagas-es-n3.json';
import editionJson from '../../../packages/story-engine/reading-editions/el-puente-de-las-luciernagas.json';
import { editionProgressStore } from '../src/reading/progress';
import { useReadingSession } from '../src/session/use-reading-session';

vi.mock('react-native', () => ({ AppState: { currentState: 'active', addEventListener: () => ({ remove: () => {} }) } }));
vi.mock('../src/tts', () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }));
afterEach(() => { cleanup(); vi.useRealTimers(); });

const prepared = prepareReading(sourceJson as unknown as Story, editionJson as ReadingEdition);
function start() {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-22T12:00:00Z'));
  const store = new MemoryProgressStore();
  const wrapped = editionProgressStore(store, prepared);
  const hook = renderHook(() => useReadingSession(prepared.story, { store: wrapped, freeReading: true, enablePractice: true }));
  act(() => hook.result.current.actions.begin());
  const next = () => { act(() => hook.result.current.actions.freeAdvance()); act(() => vi.advanceTimersByTime(500)); };
  return { ...hook, store, next };
}

describe('prepared story reading practice', () => {
  it('keeps the original bookmark, avoids duplicate credit and opens a checkpoint at a page boundary', () => {
    const { result, store, next } = start();
    next();
    expect(result.current.pageIndex).toBe(1);
    expect(store.resumePoint(prepared.story.id)).toMatchObject({ pageIndex: 0, blockId: 'b02', lineIndex: 0 });
    act(() => result.current.actions.freeBack());
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.pageIndex).toBe(0);
    next();
    expect(result.current.flow.totals.pagesRead).toBe(1);
    next();
    expect(result.current.flow.screen).toBe('question');
    const correct = result.current.checkpoint!.correctIndex;
    act(() => result.current.actions.answerQuestion((correct + 1) % 3));
    act(() => result.current.actions.continueQuestion());
    expect(result.current.flow.screen).toBe('question');
    act(() => result.current.actions.answerQuestion(correct));
    act(() => result.current.actions.continueQuestion());
    expect(result.current.pageIndex).toBe(2);
    expect(result.current.flow.comprehension).toEqual({ total: 1, correct: 0 });
  });

  it('finishes with at most three questions, syllable review and one honest free-reading summary', () => {
    const { result, store, next } = start();
    act(() => result.current.actions.rememberWord('diminutas'));
    let guard = 0;
    while (result.current.flow.screen !== 'review' && guard++ < 30) {
      if (result.current.flow.screen === 'question') {
        act(() => result.current.actions.answerQuestion(result.current.checkpoint!.correctIndex));
        act(() => result.current.actions.continueQuestion());
      } else next();
    }
    expect(result.current.flow.screen).toBe('review');
    expect(result.current.flow.comprehension).toEqual({ correct: 3, total: 3 });
    expect(result.current.flow.review!.words[0].key).toBe('diminutas');
    guard = 0;
    while (result.current.flow.screen === 'review' && guard++ < 4) {
      const review = result.current.flow.review!;
      const order = tileOrder(review.words[review.index].syllables.length);
      for (let syllable = 0; syllable < order.length; syllable++) act(() => result.current.actions.reviewTap(order.indexOf(syllable)));
      expect(isWordComplete(result.current.flow.review!)).toBe(true);
      act(() => result.current.actions.reviewNext());
    }
    expect(result.current.flow.screen).toBe('end');
    // The bookmark survives until the summary is actually saved.
    expect(store.resumePoint(prepared.story.id)).not.toBeNull();
    act(() => result.current.actions.finish(3));
    act(() => result.current.actions.finish(3));
    expect(store.summaries()).toHaveLength(1);
    expect(store.summaries()[0]).toMatchObject({ storyId: prepared.story.id, readingMode: 'free', completion: 1, comprehensionTotal: 3, focusSelfReport: 3 });
    expect(store.summaries()[0].wordsHelped).toContain('diminutas');
    expect(store.resumePoint(prepared.story.id)).toBeNull();
  });
});

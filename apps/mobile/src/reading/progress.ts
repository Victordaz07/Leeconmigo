import { originalReadingResume, readingIndexForResume, type PreparedReading } from '@lee-conmigo/story-engine';
import type { ProgressStore } from '@lee-conmigo/session-engine';

/** The session works in fragments; persisted bookmarks remain anchored to the original book. */
export function editionProgressStore(store: ProgressStore, prepared: PreparedReading): ProgressStore {
  return {
    summaries: () => store.summaries(),
    saveSummary: summary => store.saveSummary(summary),
    clearResumePoint: id => store.clearResumePoint(id),
    latestResumePoint: () => store.latestResumePoint(),
    resumePoint: id => {
      const point = store.resumePoint(id);
      return point ? { ...point, pageIndex: readingIndexForResume(prepared, point) } : null;
    },
    setResumePoint: point => store.setResumePoint(originalReadingResume(prepared, point.pageIndex, point.updatedAt)),
  };
}

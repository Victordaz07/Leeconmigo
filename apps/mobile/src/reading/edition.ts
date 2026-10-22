import type { Story } from '@lee-conmigo/contracts';
import { prepareReading, validateReadingEdition, type PreparedReading, type ReadingEdition } from '@lee-conmigo/story-engine';

const files = require.context('../../../../packages/story-engine/reading-editions', false, /\.json$/);
const editions = new Map<string, ReadingEdition>(files.keys().map(key => {
  const edition = files(key) as ReadingEdition;
  return [edition.familyId, edition];
}));

export function preparedReadingFor(story: Story): PreparedReading | null {
  const edition = editions.get(story.familyId ?? story.id);
  if (!edition) return null;
  const errors = validateReadingEdition(story, edition);
  if (errors.length) {
    console.error('[reading-edition]', story.id, errors.join('; '));
    return null;
  }
  return prepareReading(story, edition);
}


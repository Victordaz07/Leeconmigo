/** Conservative, provider-independent alignment. Hypotheses are replaceable, evidence is not.
 * A partial never commits coverage. Gaps remain gaps; ASR uncertainty is never a child's error.
 * Indices refer to displayed words, including punctuation-only tokens.
 */
import { normalizeWord, normalizeText, wordSimilarity } from './normalize.ts';

export interface FollowSnapshot {
  cursor: number;
  confirmed: readonly number[];
  preview: readonly number[];
  newlyConfirmed: readonly number[];
  complete: boolean;
}

export class ReadingFollower {
  private readonly tokens: { value: string; index: number }[];
  private covered = new Set<number>();
  private position = 0;
  private preview: number[] = [];
  private lastFinal: { text: string; atMs: number } | null = null;

  constructor(words: readonly string[]) {
    this.tokens = words.map((text, index) => ({ value: normalizeWord(text), index })).filter(t => t.value);
  }

  accept(text: string, final: boolean, atMs: number): FollowSnapshot {
    const heard = normalizeText(text).slice(-96);
    const canonical = heard.join(' ');
    if (final && this.lastFinal?.text === canonical && this.lastFinal.atMs === atMs) return this.snapshot();
    // Search only the current phrase, with a small rereading window. No global best-match jumps.
    const low = Math.max(0, this.position - 8);
    const high = Math.min(this.tokens.length, this.position + 3);
    let best: number[] = [];
    let bestScore = -Infinity;
    for (let start = low; start < high; start++) {
      for (let h = 0; h < heard.length; h++) {
        let e = start;
        let j = h;
        const matched: number[] = [];
        let exact = 0;
        let gaps = 0;
        while (e < this.tokens.length && j < heard.length) {
          const expected = this.tokens[e].value;
          const actual = heard[j];
          const same = expected === actual;
          const fuzzy = expected.length >= 6 && actual.length >= 6 && wordSimilarity(expected, actual) >= .82;
          if (same || fuzzy) {
            matched.push(e);
            if (same) exact++;
            e++; j++;
          } else if (j > h && actual === heard[j - 1]) {
            // Spoken stutter, without collapsing intentional repetitions in the story.
            j++;
          } else if (gaps < 1 && e + 1 < this.tokens.length && this.tokens[e + 1].value === actual) {
            gaps++; e++;
          } else break;
        }
        if (!matched.length) continue;
        // A lone common/fuzzy word may not establish a new position beyond the cursor.
        if (matched.length === 1 && (start !== this.position || exact !== 1)) continue;
        if ((start > this.position || gaps || exact !== matched.length) && (matched.length < 2 || exact < 2)) continue;
        // Prevent a long unrelated introduction from contributing only an isolated anchor.
        if (matched.length / Math.max(1, heard.length) < .5) continue;
        const score = matched.length * 10 + exact - gaps * 2 - Math.abs(start - this.position) * .2;
        if (score > bestScore) { best = matched; bestScore = score; }
      }
    }
    this.preview = best.map(i => this.tokens[i].index);
    const newly: number[] = [];
    if (final) {
      this.lastFinal = { text: canonical, atMs };
      for (const i of this.preview) {
        if (!this.covered.has(i)) { newly.push(i); this.covered.add(i); }
      }
      if (best.length) this.position = Math.max(this.position, best[best.length - 1] + 1);
      this.preview = [];
    }
    return this.snapshot(newly);
  }

  /** Discard an interrupted utterance (help, pause, page change); retain confirmed reading. */
  discardHypothesis(): void { this.preview = []; }

  snapshot(newlyConfirmed: readonly number[] = []): FollowSnapshot {
    return {
      cursor: this.tokens[this.position]?.index ?? ((this.tokens.at(-1)?.index ?? -1) + 1),
      confirmed: [...this.covered].sort((a, b) => a - b),
      preview: [...this.preview], newlyConfirmed,
      complete: this.tokens.length > 0 && this.covered.size === this.tokens.length,
    };
  }
}

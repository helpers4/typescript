/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { levenshteinDistance } from './levenshteinDistance';

describe('levenshteinDistance — property-based', () => {
  it('is never negative', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        expect(levenshteinDistance(a, b)).toBeGreaterThanOrEqual(0);
      }),
    );
  });

  it('is 0 exactly when the (case-adjusted) strings are equal', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.boolean(), (a, b, caseSensitive) => {
        const s = caseSensitive ? a : a.toLowerCase();
        const t = caseSensitive ? b : b.toLowerCase();
        expect(levenshteinDistance(a, b, caseSensitive) === 0).toBe(s === t);
      }),
    );
  });

  it('is symmetric', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        expect(levenshteinDistance(a, b)).toBe(levenshteinDistance(b, a));
      }),
    );
  });

  it('never exceeds the longer of the two strings actually compared (post-case-folding)', () => {
    // Bound against the post-fold lengths, not a.length/b.length directly — case-folding a
    // Turkish dotted capital I ('İ', U+0130) expands it to two code units ('i' + combining dot
    // above) under the default (non-Turkish) locale mapping .toLowerCase() uses, so the string
    // levenshteinDistance actually measures can be longer than the raw input when
    // caseSensitive is false.
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), fc.string({ unit: 'binary' }), fc.boolean(), (a, b, caseSensitive) => {
        const s = caseSensitive ? a : a.toLowerCase();
        const t = caseSensitive ? b : b.toLowerCase();
        expect(levenshteinDistance(a, b, caseSensitive)).toBeLessThanOrEqual(Math.max(s.length, t.length));
      }),
    );
  });

  it('satisfies the triangle inequality', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        expect(levenshteinDistance(a, c)).toBeLessThanOrEqual(
          levenshteinDistance(a, b) + levenshteinDistance(b, c),
        );
      }),
    );
  });
});

describe('levenshteinDistance — contract', () => {
  it('handles unicode strings without throwing', () => {
    expect(() => levenshteinDistance('café', 'café')).not.toThrow();
  });

  it('case-folding a Turkish dotted capital I can make the distance exceed the raw input lengths', () => {
    // U+0130 lowercases to 'i' + U+0307 (combining dot above) -- two code units -- under the
    // default (non-Turkish) locale mapping .toLowerCase() uses. Expected behavior for this
    // function itself (it measures the post-fold strings); levenshteinSimilarity has to account
    // for this explicitly to keep its own [0, 1] contract.
    expect('\u0130'.toLowerCase().length).toBe(2);
    expect(levenshteinDistance('\u0130', 'x', false)).toBe(2);
  });
});

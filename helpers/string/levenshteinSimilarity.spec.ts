/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { levenshteinSimilarity } from './levenshteinSimilarity';

describe('levenshteinSimilarity — property-based', () => {
  it('is always between 0 and 1 (inclusive)', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        const score = levenshteinSimilarity(a, b);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      }),
    );
  });

  it('is always between 0 and 1 (inclusive), including case-insensitive comparisons of arbitrary unicode', () => {
    // Regression coverage: caseSensitive=false wasn't exercised by the property above (it never
    // varied caseSensitive, and fc.string() alone rarely generates the specific code points whose
    // case-folded length differs from their raw length).
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), fc.string({ unit: 'binary' }), fc.boolean(), (a, b, caseSensitive) => {
        const score = levenshteinSimilarity(a, b, caseSensitive);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      }),
    );
  });

  it('is 1 exactly when the (case-adjusted) strings are equal', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.boolean(), (a, b, caseSensitive) => {
        const s = caseSensitive ? a : a.toLowerCase();
        const t = caseSensitive ? b : b.toLowerCase();
        expect(levenshteinSimilarity(a, b, caseSensitive) === 1).toBe(s === t);
      }),
    );
  });

  it('is symmetric', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        expect(levenshteinSimilarity(a, b)).toBe(levenshteinSimilarity(b, a));
      }),
    );
  });
});

describe('levenshteinSimilarity — contract', () => {
  it('never throws for empty-vs-nonempty input', () => {
    expect(() => levenshteinSimilarity('', 'anything')).not.toThrow();
  });

  it('stays within [0, 1] for a case-fold that expands string length (Turkish dotted capital I)', () => {
    // U+0130 lowercases to 'i' + U+0307 (combining dot above) -- two code units -- under the
    // default (non-Turkish) locale mapping. Regression test for a bug where maxLength was
    // computed from the raw (pre-fold) inputs while the distance was computed from the folded
    // ones, letting the ratio exceed 1.
    const score = levenshteinSimilarity('\u0130', 'x', false);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});

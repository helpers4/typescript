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

  it('never exceeds the longer string\'s length', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        expect(levenshteinDistance(a, b)).toBeLessThanOrEqual(Math.max(a.length, b.length));
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
});

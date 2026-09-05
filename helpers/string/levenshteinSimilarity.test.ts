/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { levenshteinSimilarity } from './levenshteinSimilarity';

describe('levenshteinSimilarity', () => {
  it('returns 1 for identical strings', () => {
    expect(levenshteinSimilarity('same', 'same')).toBe(1);
  });

  it('returns 1 when both strings are empty', () => {
    expect(levenshteinSimilarity('', '')).toBe(1);
  });

  it('returns 0 for completely different strings of equal length', () => {
    expect(levenshteinSimilarity('abc', 'xyz')).toBe(0);
  });

  it('computes the classic kitten/sitting example', () => {
    expect(levenshteinSimilarity('kitten', 'sitting')).toBeCloseTo(1 - 3 / 7, 10);
  });

  it('is case-sensitive by default', () => {
    expect(levenshteinSimilarity('Same', 'same')).toBeLessThan(1);
  });

  it('ignores case when caseSensitive is false', () => {
    expect(levenshteinSimilarity('Same', 'same', false)).toBe(1);
  });

  it('is symmetric', () => {
    expect(levenshteinSimilarity('flaw', 'lawn')).toBe(levenshteinSimilarity('lawn', 'flaw'));
  });
});

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { levenshteinDistance } from './levenshteinDistance';

describe('levenshteinDistance', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshteinDistance('kitten', 'kitten')).toBe(0);
  });

  it('computes the classic kitten/sitting example', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
  });

  it('returns the length of b when a is empty', () => {
    expect(levenshteinDistance('', 'abc')).toBe(3);
  });

  it('returns the length of a when b is empty', () => {
    expect(levenshteinDistance('abc', '')).toBe(3);
  });

  it('returns 0 when both strings are empty', () => {
    expect(levenshteinDistance('', '')).toBe(0);
  });

  it('is case-sensitive by default', () => {
    expect(levenshteinDistance('Kitten', 'kitten')).toBe(1);
  });

  it('ignores case when caseSensitive is false', () => {
    expect(levenshteinDistance('Kitten', 'kitten', false)).toBe(0);
  });

  it('counts a single substitution', () => {
    expect(levenshteinDistance('cat', 'bat')).toBe(1);
  });

  it('counts a single insertion', () => {
    expect(levenshteinDistance('cat', 'cats')).toBe(1);
  });

  it('counts a single deletion', () => {
    expect(levenshteinDistance('cats', 'cat')).toBe(1);
  });

  it('is symmetric', () => {
    expect(levenshteinDistance('flaw', 'lawn')).toBe(levenshteinDistance('lawn', 'flaw'));
  });
});

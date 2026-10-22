/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { without } from './without';

describe('without', () => {
  it('removes a single value', () => {
    expect(without([1, 2, 3, 2, 4], 2)).toEqual([1, 3, 4]);
  });

  it('removes multiple values', () => {
    expect(without([1, 2, 3, 2, 4], 2, 3)).toEqual([1, 4]);
  });

  it('removes string values', () => {
    expect(without(['a', 'b', 'c', 'b'], 'b')).toEqual(['a', 'c']);
  });

  it('returns a new array (does not mutate)', () => {
    const input = [1, 2, 3];
    const result = without(input, 2);
    expect(result).toEqual([1, 3]);
    expect(input).toEqual([1, 2, 3]);
  });

  it('returns a copy when no values match', () => {
    expect(without([1, 2, 3], 5)).toEqual([1, 2, 3]);
  });

  it('returns empty array when all values are excluded', () => {
    expect(without([1, 2, 3], 1, 2, 3)).toEqual([]);
  });

  it('returns empty array when source is empty', () => {
    expect(without([], 1, 2)).toEqual([]);
  });

  it('works with no exclusion values', () => {
    expect(without([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('uses SameValueZero — removes NaN', () => {
    expect(without([1, NaN, 3, NaN], NaN)).toEqual([1, 3]);
  });

  it('does not remove -0 when excluding +0 (SameValueZero treats them as equal)', () => {
    expect(without([0, -0, 1], 0)).toEqual([1]);
  });

  it('preserves order of remaining elements', () => {
    expect(without([5, 1, 3, 2, 4], 3)).toEqual([5, 1, 2, 4]);
  });

  it('returns [] for null', () => {
    expect(without(null, 1, 2)).toEqual([]);
  });

  it('returns [] for undefined', () => {
    expect(without(undefined, 1, 2)).toEqual([]);
  });
});

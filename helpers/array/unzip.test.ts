/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { unzip } from './unzip';
import { zip } from './zip';

describe('unzip', () => {
  it('splits pairs into two arrays', () => {
    const [nums, strs] = unzip([[1, 'a'], [2, 'b'], [3, 'c']]);
    expect(nums).toEqual([1, 2, 3]);
    expect(strs).toEqual(['a', 'b', 'c']);
  });

  it('returns empty arrays for empty input', () => {
    expect(unzip([])).toEqual([]);
  });

  it('handles single-element input', () => {
    const [a, b] = unzip([[42, 'hello']]);
    expect(a).toEqual([42]);
    expect(b).toEqual(['hello']);
  });

  it('handles 3-tuples', () => {
    const [a, b, c] = unzip([[1, 'x', true], [2, 'y', false]]);
    expect(a).toEqual([1, 2]);
    expect(b).toEqual(['x', 'y']);
    expect(c).toEqual([true, false]);
  });

  it('is the inverse of zip', () => {
    const original: [number, string][] = [[1, 'a'], [2, 'b'], [3, 'c']];
    const [nums, strs] = unzip(original);
    expect(zip(nums, strs)).toEqual(original);
  });

  it('returns [] for null', () => {
    expect(unzip(null)).toEqual([]);
  });

  it('returns [] for undefined', () => {
    expect(unzip(undefined)).toEqual([]);
  });
});

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { percentile } from './percentile';

describe('percentile', () => {
  it('returns the median at the 50th percentile', () => {
    expect(percentile([1, 2, 3, 4], 50)).toBe(2.5);
  });

  it('returns the min at the 0th percentile', () => {
    expect(percentile([4, 1, 3, 2], 0)).toBe(1);
  });

  it('returns the max at the 100th percentile', () => {
    expect(percentile([4, 1, 3, 2], 100)).toBe(4);
  });

  it('interpolates between ranks', () => {
    expect(percentile([10, 20, 30, 40], 25)).toBe(17.5);
  });

  it('returns NaN for an empty array', () => {
    expect(percentile([], 50)).toBeNaN();
  });

  it('does not mutate the input array', () => {
    const input = [3, 1, 2];
    percentile(input, 50);
    expect(input).toEqual([3, 1, 2]);
  });

  it('returns the single value for a one-element array regardless of p', () => {
    expect(percentile([42], 10)).toBe(42);
    expect(percentile([42], 90)).toBe(42);
  });
});

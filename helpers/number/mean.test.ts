/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { mean } from './mean';

describe('mean', () => {
  it('returns the average of a standard array', () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
  });

  it('returns the value itself for a single-element array', () => {
    expect(mean([42])).toBe(42);
  });

  it('returns NaN for an empty array', () => {
    expect(mean([])).toBeNaN();
  });

  it('handles negative numbers', () => {
    expect(mean([-4, -2, 0, 2, 4])).toBe(0);
  });

  it('handles decimals', () => {
    expect(mean([1.5, 2.5])).toBe(2);
  });

  it('handles all-same values', () => {
    expect(mean([7, 7, 7])).toBe(7);
  });
});

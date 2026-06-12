/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { min } from './min';

describe('min', () => {
  it('returns undefined for empty array', () => {
    expect(min([])).toBeUndefined();
  });

  it('returns the only element in a single-element array', () => {
    expect(min([42])).toBe(42);
  });

  it('returns minimum value', () => {
    expect(min([3, 1, 4, 1, 5, 9, 2, 6])).toBe(1);
  });

  it('handles negative numbers', () => {
    expect(min([-5, -1, -10, 0])).toBe(-10);
  });

  it('handles duplicate minimums', () => {
    expect(min([1, 1, 2, 3])).toBe(1);
  });

  it('handles all identical values', () => {
    expect(min([7, 7, 7])).toBe(7);
  });

  it('handles large arrays without stack overflow', () => {
    const large = Array.from({ length: 1_000_000 }, (_, i) => i);
    expect(min(large)).toBe(0);
  });

  it('handles Infinity', () => {
    expect(min([Infinity, 1, 2])).toBe(1);
    expect(min([-Infinity, 1, 2])).toBe(-Infinity);
  });

  it('min([0, -0]) returns -0 (matches Math.min)', () => {
    expect(Object.is(min([0, -0]), -0)).toBe(true);
    expect(Object.is(min([-0, 0]), -0)).toBe(true);
    expect(Object.is(min([0]), 0)).toBe(true);
  });

  it('returns NaN for any NaN element regardless of position', () => {
    expect(min([NaN, 1, 3])).toBeNaN();
    expect(min([1, NaN, 3])).toBeNaN();
    expect(min([1, 3, NaN])).toBeNaN();
  });
});

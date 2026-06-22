/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { max } from './max';

describe('max', () => {
  it('returns undefined for empty array', () => {
    expect(max([])).toBeUndefined();
  });

  it('returns the only element in a single-element array', () => {
    expect(max([42])).toBe(42);
  });

  it('returns maximum value', () => {
    expect(max([3, 1, 4, 1, 5, 9, 2, 6])).toBe(9);
  });

  it('handles negative numbers', () => {
    expect(max([-5, -1, -10, 0])).toBe(0);
  });

  it('handles duplicate maximums', () => {
    expect(max([3, 3, 2, 1])).toBe(3);
  });

  it('handles all identical values', () => {
    expect(max([7, 7, 7])).toBe(7);
  });

  it('handles large arrays without stack overflow', () => {
    const large = Array.from({ length: 1_000_000 }, (_, i) => i);
    expect(max(large)).toBe(999_999);
  });

  it('handles Infinity', () => {
    expect(max([Infinity, 1, 2])).toBe(Infinity);
    expect(max([-Infinity, 1, 2])).toBe(2);
  });

  it('max([-0, 0]) returns +0 (matches Math.max)', () => {
    expect(Object.is(max([-0, 0]), 0)).toBe(true);
    expect(Object.is(max([0, -0]), 0)).toBe(true);
    expect(Object.is(max([-0]), -0)).toBe(true);
  });

  it('returns NaN for any NaN element regardless of position', () => {
    expect(max([NaN, 1, 3])).toBeNaN();
    expect(max([1, NaN, 3])).toBeNaN();
    expect(max([1, 3, NaN])).toBeNaN();
  });

  it('returns undefined for null', () => {
    expect(max(null)).toBeUndefined();
  });

  it('returns undefined for undefined', () => {
    expect(max(undefined)).toBeUndefined();
  });
});

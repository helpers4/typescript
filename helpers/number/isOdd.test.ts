/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isOdd } from './isOdd';

describe('isOdd', () => {
  it('should return true for odd integers', () => {
    expect(isOdd(1)).toBe(true);
    expect(isOdd(3)).toBe(true);
    expect(isOdd(-1)).toBe(true);
    expect(isOdd(-7)).toBe(true);
    expect(isOdd(99)).toBe(true);
  });

  it('should return false for even integers', () => {
    expect(isOdd(0)).toBe(false);
    expect(isOdd(2)).toBe(false);
    expect(isOdd(-2)).toBe(false);
    expect(isOdd(100)).toBe(false);
  });

  it('should return false for non-integer numbers', () => {
    expect(isOdd(1.5)).toBe(false);
    expect(isOdd(3.1)).toBe(false);
    expect(isOdd(-0.5)).toBe(false);
  });

  it('should return false for NaN and Infinity', () => {
    expect(isOdd(NaN)).toBe(false);
    expect(isOdd(Infinity)).toBe(false);
    expect(isOdd(-Infinity)).toBe(false);
  });

  it('should return false for non-number types', () => {
    expect(isOdd('3')).toBe(false);
    expect(isOdd(null)).toBe(false);
    expect(isOdd(undefined)).toBe(false);
    expect(isOdd(true)).toBe(false);
    expect(isOdd({})).toBe(false);
    expect(isOdd([])).toBe(false);
  });
});

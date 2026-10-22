/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isEven } from './isEven';

describe('isEven', () => {
  it('should return true for even integers', () => {
    expect(isEven(0)).toBe(true);
    expect(isEven(2)).toBe(true);
    expect(isEven(4)).toBe(true);
    expect(isEven(-2)).toBe(true);
    expect(isEven(-100)).toBe(true);
  });

  it('should return false for odd integers', () => {
    expect(isEven(1)).toBe(false);
    expect(isEven(3)).toBe(false);
    expect(isEven(-1)).toBe(false);
    expect(isEven(-7)).toBe(false);
  });

  it('should return false for non-integer numbers', () => {
    expect(isEven(1.5)).toBe(false);
    expect(isEven(2.4)).toBe(false);
    expect(isEven(-0.5)).toBe(false);
  });

  it('should return false for NaN and Infinity', () => {
    expect(isEven(NaN)).toBe(false);
    expect(isEven(Infinity)).toBe(false);
    expect(isEven(-Infinity)).toBe(false);
  });

  it('should return false for non-number types', () => {
    expect(isEven('2')).toBe(false);
    expect(isEven(null)).toBe(false);
    expect(isEven(undefined)).toBe(false);
    expect(isEven(true)).toBe(false);
    expect(isEven({})).toBe(false);
    expect(isEven([])).toBe(false);
  });
});

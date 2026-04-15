/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isPositiveNumber } from './isPositiveNumber';

describe('isPositiveNumber', () => {
  it('should return true for positive numbers', () => {
    expect(isPositiveNumber(1)).toBe(true);
    expect(isPositiveNumber(42)).toBe(true);
    expect(isPositiveNumber(0.1)).toBe(true);
    expect(isPositiveNumber(Infinity)).toBe(true);
  });

  it('should return false for zero', () => {
    expect(isPositiveNumber(0)).toBe(false);
  });

  it('should return false for negative numbers', () => {
    expect(isPositiveNumber(-1)).toBe(false);
    expect(isPositiveNumber(-0.1)).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(isPositiveNumber(NaN)).toBe(false);
  });

  it('should return false for non-numbers', () => {
    expect(isPositiveNumber('42')).toBe(false);
    expect(isPositiveNumber(true)).toBe(false);
    expect(isPositiveNumber(null)).toBe(false);
    expect(isPositiveNumber(undefined)).toBe(false);
  });
});

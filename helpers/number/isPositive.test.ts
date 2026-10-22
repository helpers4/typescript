/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isPositive } from './isPositive';

describe('isPositive', () => {
  it('should return true for positive numbers', () => {
    expect(isPositive(1)).toBe(true);
    expect(isPositive(42)).toBe(true);
    expect(isPositive(0.1)).toBe(true);
    expect(isPositive(Infinity)).toBe(true);
  });

  it('should return false for zero', () => {
    expect(isPositive(0)).toBe(false);
  });

  it('should return false for negative numbers', () => {
    expect(isPositive(-1)).toBe(false);
    expect(isPositive(-0.1)).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(isPositive(NaN)).toBe(false);
  });

  it('should return false for non-numbers', () => {
    expect(isPositive('42')).toBe(false);
    expect(isPositive(true)).toBe(false);
    expect(isPositive(null)).toBe(false);
    expect(isPositive(undefined)).toBe(false);
  });
});

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNegative } from './isNegative';

describe('isNegative', () => {
  it('should return true for negative numbers', () => {
    expect(isNegative(-1)).toBe(true);
    expect(isNegative(-0.5)).toBe(true);
    expect(isNegative(-Infinity)).toBe(true);
  });

  it('should return false for zero', () => {
    expect(isNegative(0)).toBe(false);
  });

  it('should return false for positive numbers', () => {
    expect(isNegative(1)).toBe(false);
    expect(isNegative(0.1)).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(isNegative(NaN)).toBe(false);
  });

  it('should return false for non-numbers', () => {
    expect(isNegative('-1')).toBe(false);
    expect(isNegative(false)).toBe(false);
    expect(isNegative(null)).toBe(false);
    expect(isNegative(undefined)).toBe(false);
  });
});

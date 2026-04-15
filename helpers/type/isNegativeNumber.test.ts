/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNegativeNumber } from './isNegativeNumber';

describe('isNegativeNumber', () => {
  it('should return true for negative numbers', () => {
    expect(isNegativeNumber(-1)).toBe(true);
    expect(isNegativeNumber(-0.5)).toBe(true);
    expect(isNegativeNumber(-Infinity)).toBe(true);
  });

  it('should return false for zero', () => {
    expect(isNegativeNumber(0)).toBe(false);
  });

  it('should return false for positive numbers', () => {
    expect(isNegativeNumber(1)).toBe(false);
    expect(isNegativeNumber(0.1)).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(isNegativeNumber(NaN)).toBe(false);
  });

  it('should return false for non-numbers', () => {
    expect(isNegativeNumber('-1')).toBe(false);
    expect(isNegativeNumber(false)).toBe(false);
    expect(isNegativeNumber(null)).toBe(false);
    expect(isNegativeNumber(undefined)).toBe(false);
  });
});

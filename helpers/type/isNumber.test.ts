/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNumber } from './isNumber';

describe('isNumber', () => {
  it('should return true for numbers', () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-1)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
    expect(isNumber(Infinity)).toBe(true);
    expect(isNumber(-Infinity)).toBe(true);
  });

  it('should return false for NaN', () => {
    expect(isNumber(NaN)).toBe(false);
  });

  it('should return false for non-numbers', () => {
    expect(isNumber('123')).toBe(false);
    expect(isNumber(true)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber(42n)).toBe(false);
  });
});

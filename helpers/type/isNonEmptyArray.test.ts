/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNonEmptyArray } from './isNonEmptyArray';

describe('isNonEmptyArray', () => {
  it('should return true for non-empty arrays', () => {
    expect(isNonEmptyArray([1])).toBe(true);
    expect(isNonEmptyArray([1, 2, 3])).toBe(true);
    expect(isNonEmptyArray([undefined])).toBe(true);
  });

  it('should return false for empty array', () => {
    expect(isNonEmptyArray([])).toBe(false);
  });

  it('should return false for non-arrays', () => {
    expect(isNonEmptyArray('abc')).toBe(false);
    expect(isNonEmptyArray(42)).toBe(false);
    expect(isNonEmptyArray(null)).toBe(false);
    expect(isNonEmptyArray(undefined)).toBe(false);
    expect(isNonEmptyArray({})).toBe(false);
    expect(isNonEmptyArray(new Set([1]))).toBe(false);
  });
});

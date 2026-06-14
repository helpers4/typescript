/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNonEmpty } from './isNonEmpty';

describe('isNonEmpty', () => {
  it('should return true for a non-empty array', () => {
    expect(isNonEmpty([1])).toBe(true);
  });

  it('should return true for an array with multiple elements', () => {
    expect(isNonEmpty([1, 2, 3])).toBe(true);
  });

  it('should return false for an empty array', () => {
    expect(isNonEmpty([])).toBe(false);
  });

  it('should return true for an array containing falsy values', () => {
    expect(isNonEmpty([null])).toBe(true);
    expect(isNonEmpty([undefined])).toBe(true);
    expect(isNonEmpty([0])).toBe(true);
    expect(isNonEmpty([''])).toBe(true);
    expect(isNonEmpty([false])).toBe(true);
  });

  it('should work with readonly arrays', () => {
    const arr: readonly number[] = [1, 2];
    expect(isNonEmpty(arr)).toBe(true);
  });

  it('should narrow type to non-empty tuple in true branch', () => {
    const arr: number[] = [1, 2, 3];
    if (isNonEmpty(arr)) {
      const first: number = arr[0];
      expect(first).toBe(1);
    }
  });
});

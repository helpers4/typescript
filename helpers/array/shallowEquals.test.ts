/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { shallowEquals } from './shallowEquals';

describe('shallowEquals', () => {
  it('should return true for identical arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(shallowEquals(arr1, arr2)).toBe(true);
  });

  it('should return false for different arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    expect(shallowEquals(arr1, arr2)).toBe(false);
  });

  it('should return true for same reference', () => {
    const arr = [1, 2, 3];
    expect(shallowEquals(arr, arr)).toBe(true);
  });

  it('should handle nested arrays', () => {
    const arr1 = [[1, 2], [3, 4]];
    const arr2 = [[1, 2], [3, 4]];
    const arr3 = [[1, 2], [3, 5]];

    expect(shallowEquals(arr1, arr2)).toBe(true);
    expect(shallowEquals(arr1, arr3)).toBe(false);
  });

  it('should handle arrays with objects', () => {
    const arr1 = [{ a: 1 }, { b: 2 }];
    const arr2 = [{ a: 1 }, { b: 2 }];
    const arr3 = [{ a: 1 }, { b: 3 }];

    expect(shallowEquals(arr1, arr2)).toBe(true);
    expect(shallowEquals(arr1, arr3)).toBe(false);
  });

  it('should handle empty arrays', () => {
    expect(shallowEquals([], [])).toBe(true);
    expect(shallowEquals([1], [])).toBe(false);
  });

  it('should handle arrays with different lengths', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2];
    expect(shallowEquals(arr1, arr2)).toBe(false);
  });

  it('should fall back to reference equality on JSON stringify errors', () => {
    const circular: any = {};
    circular.self = circular;
    const arr1 = [circular];
    const arr2 = arr1; // Exact same reference
    const arr3 = [{}];

    expect(shallowEquals(arr1, arr2)).toBe(true); // Same reference
    expect(shallowEquals(arr1, arr3)).toBe(false); // Different reference
  });

  it('should handle arrays with special values', () => {
    const arr1 = [null, undefined, NaN, Infinity];
    const arr2 = [null, undefined, NaN, Infinity];
    expect(shallowEquals(arr1, arr2)).toBe(true);
  });
});

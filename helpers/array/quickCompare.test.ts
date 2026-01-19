/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from 'vitest';
import { quickCompare } from './quickCompare';

describe('quickCompare', () => {
  it('should return true for identical arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(quickCompare(arr1, arr2)).toBe(true);
  });

  it('should return false for different arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    expect(quickCompare(arr1, arr2)).toBe(false);
  });

  it('should return true for same reference', () => {
    const arr = [1, 2, 3];
    expect(quickCompare(arr, arr)).toBe(true);
  });

  it('should handle nested arrays', () => {
    const arr1 = [[1, 2], [3, 4]];
    const arr2 = [[1, 2], [3, 4]];
    const arr3 = [[1, 2], [3, 5]];

    expect(quickCompare(arr1, arr2)).toBe(true);
    expect(quickCompare(arr1, arr3)).toBe(false);
  });

  it('should handle arrays with objects', () => {
    const arr1 = [{ a: 1 }, { b: 2 }];
    const arr2 = [{ a: 1 }, { b: 2 }];
    const arr3 = [{ a: 1 }, { b: 3 }];

    expect(quickCompare(arr1, arr2)).toBe(true);
    expect(quickCompare(arr1, arr3)).toBe(false);
  });

  it('should handle empty arrays', () => {
    expect(quickCompare([], [])).toBe(true);
    expect(quickCompare([1], [])).toBe(false);
  });

  it('should handle arrays with different lengths', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2];
    expect(quickCompare(arr1, arr2)).toBe(false);
  });

  it('should fall back to reference equality on JSON stringify errors', () => {
    const circular: any = {};
    circular.self = circular;
    const arr1 = [circular];
    const arr2 = arr1; // Exact same reference
    const arr3 = [{}];

    expect(quickCompare(arr1, arr2)).toBe(true); // Same reference
    expect(quickCompare(arr1, arr3)).toBe(false); // Different reference
  });

  it('should handle arrays with special values', () => {
    const arr1 = [null, undefined, NaN, Infinity];
    const arr2 = [null, undefined, NaN, Infinity];
    expect(quickCompare(arr1, arr2)).toBe(true);
  });
});

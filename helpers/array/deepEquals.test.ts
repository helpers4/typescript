/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { deepEquals } from './deepEquals';

describe('deepEquals', () => {
  it('should return true for identical arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(deepEquals(arr1, arr2)).toBe(true);
  });

  it('should return false for different arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    expect(deepEquals(arr1, arr2)).toBe(false);
  });

  it('should return true for same reference', () => {
    const arr = [1, 2, 3];
    expect(deepEquals(arr, arr)).toBe(true);
  });

  it('should handle nested arrays', () => {
    const arr1 = [[1, 2], [3, 4]];
    const arr2 = [[1, 2], [3, 4]];
    const arr3 = [[1, 2], [3, 5]];

    expect(deepEquals(arr1, arr2)).toBe(true);
    expect(deepEquals(arr1, arr3)).toBe(false);
  });

  it('should handle arrays with different lengths', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2];
    expect(deepEquals(arr1, arr2)).toBe(false);
  });

  it('should handle empty arrays', () => {
    expect(deepEquals([], [])).toBe(true);
    expect(deepEquals([1], [])).toBe(false);
  });

  it('should return false for non-array inputs', () => {
    expect(deepEquals([1, 2], 'not array' as any)).toBe(false);
    expect(deepEquals('not array' as any, [1, 2])).toBe(false);
  });

  it('should handle arrays with objects using strict equality', () => {
    const obj = { a: 1 };
    const arr1 = [obj];
    const arr2 = [obj]; // Same reference
    const arr3 = [{ a: 1 }]; // Different reference but same content

    expect(deepEquals(arr1, arr2)).toBe(true); // Same reference
    expect(deepEquals(arr1, arr3)).toBe(false); // Different reference (strict equality)
  });

  it('should handle arrays with primitive types', () => {
    expect(deepEquals([null], [null])).toBe(true);
    expect(deepEquals([undefined], [undefined])).toBe(true);
    expect(deepEquals([NaN], [NaN])).toBe(false); // NaN !== NaN
    expect(deepEquals([0], [-0])).toBe(true); // 0 === -0 in JavaScript
  });

  it('should handle complex nested arrays', () => {
    const arr1 = [[[1, 2]], [[3, 4]]];
    const arr2 = [[[1, 2]], [[3, 4]]];
    const arr3 = [[[1, 2]], [[3, 5]]];

    expect(deepEquals(arr1, arr2)).toBe(true);
    expect(deepEquals(arr1, arr3)).toBe(false);
  });

  describe('security edge cases', () => {
    it('should handle sparse arrays', () => {
      // eslint-disable-next-line no-sparse-arrays
      const sparse1 = [1, , 3];
      // eslint-disable-next-line no-sparse-arrays
      const sparse2 = [1, , 3];
      expect(deepEquals(sparse1, sparse2)).toBe(true);
    });

    it('should handle arrays with __proto__ string values', () => {
      const arr1 = ['__proto__', 'constructor', 'prototype'];
      const arr2 = ['__proto__', 'constructor', 'prototype'];
      expect(deepEquals(arr1, arr2)).toBe(true);
    });

    it('should handle NaN in nested arrays', () => {
      // NaN !== NaN in strict equality, so these should differ
      expect(deepEquals([NaN], [NaN])).toBe(false);
      expect(deepEquals([[NaN]], [[NaN]])).toBe(false);
    });

    it('should handle very deeply nested arrays without crash', () => {
      let deep1: unknown[] = [1];
      let deep2: unknown[] = [1];
      for (let i = 0; i < 100; i++) {
        deep1 = [deep1];
        deep2 = [deep2];
      }
      expect(deepEquals(deep1, deep2)).toBe(true);
    });

    it('should handle arrays with -0 and +0', () => {
      expect(deepEquals([0], [-0])).toBe(true); // 0 === -0
    });
  });
});

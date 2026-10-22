/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isArrayLike } from './isArrayLike';

describe('isArrayLike', () => {
  it('should return true for arrays', () => {
    expect(isArrayLike([])).toBe(true);
    expect(isArrayLike([1, 2, 3])).toBe(true);
  });

  it('should return true for strings', () => {
    expect(isArrayLike('')).toBe(true);
    expect(isArrayLike('hello')).toBe(true);
  });

  it('should return true for objects with valid length', () => {
    expect(isArrayLike({ length: 0 })).toBe(true);
    expect(isArrayLike({ length: 3 })).toBe(true);
  });

  it('should return true for typed arrays', () => {
    expect(isArrayLike(new Uint8Array(4))).toBe(true);
    expect(isArrayLike(new Int32Array(2))).toBe(true);
  });

  it('should return false for objects with invalid length', () => {
    expect(isArrayLike({ length: -1 })).toBe(false);
    expect(isArrayLike({ length: 1.5 })).toBe(false);
    expect(isArrayLike({ length: NaN })).toBe(false);
    expect(isArrayLike({ length: Infinity })).toBe(false);
  });

  it('should return false for objects without length', () => {
    expect(isArrayLike({})).toBe(false);
    expect(isArrayLike({ a: 1 })).toBe(false);
  });

  it('should return false for functions', () => {
    expect(isArrayLike(() => {})).toBe(false);
    expect(isArrayLike(function named() {})).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isArrayLike(null)).toBe(false);
    expect(isArrayLike(undefined)).toBe(false);
  });

  it('should return false for non-object primitives', () => {
    expect(isArrayLike(42)).toBe(false);
    expect(isArrayLike(true)).toBe(false);
    expect(isArrayLike(Symbol('x'))).toBe(false);
  });
});

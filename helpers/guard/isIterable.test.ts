/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isIterable } from './isIterable';

describe('isIterable', () => {
  it('should return true for arrays', () => {
    expect(isIterable([1, 2, 3])).toBe(true);
    expect(isIterable([])).toBe(true);
  });

  it('should return true for strings', () => {
    expect(isIterable('hello')).toBe(true);
    expect(isIterable('')).toBe(true);
  });

  it('should return true for Map and Set', () => {
    expect(isIterable(new Map())).toBe(true);
    expect(isIterable(new Set())).toBe(true);
  });

  it('should return true for generator results', () => {
    function* gen() { yield 1; }
    expect(isIterable(gen())).toBe(true);
  });

  it('should return false for plain objects', () => {
    expect(isIterable({})).toBe(false);
    expect(isIterable({ a: 1 })).toBe(false);
  });

  it('should return false for numbers and booleans', () => {
    expect(isIterable(42)).toBe(false);
    expect(isIterable(true)).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isIterable(null)).toBe(false);
    expect(isIterable(undefined)).toBe(false);
  });
});

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { equalsShallow } from './equalsShallow';

describe('array/equalsShallow', () => {
  it('returns true for identical arrays', () => {
    expect(equalsShallow([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('returns false for arrays differing at one index', () => {
    expect(equalsShallow([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('returns true for same reference', () => {
    const arr = [1, 2, 3];
    expect(equalsShallow(arr, arr)).toBe(true);
  });

  it('is order-sensitive', () => {
    expect(equalsShallow([1, 2], [2, 1])).toBe(false);
  });

  it('compares nested arrays by reference (no recursion)', () => {
    const inner = [1, 2];
    expect(equalsShallow([inner], [inner])).toBe(true);
    expect(equalsShallow([[1, 2]], [[1, 2]])).toBe(false);
  });

  it('compares nested objects by reference (no recursion)', () => {
    const obj = { a: 1 };
    expect(equalsShallow([obj], [obj])).toBe(true);
    expect(equalsShallow([{ a: 1 }], [{ a: 1 }])).toBe(false);
  });

  it('handles empty arrays', () => {
    expect(equalsShallow([], [])).toBe(true);
    expect(equalsShallow([1], [])).toBe(false);
  });

  it('returns false for different lengths', () => {
    expect(equalsShallow([1, 2, 3], [1, 2])).toBe(false);
  });

  it('handles primitive special values with === semantics', () => {
    expect(equalsShallow([null, undefined], [null, undefined])).toBe(true);
    expect(equalsShallow([NaN], [NaN])).toBe(false); // NaN !== NaN
    expect(equalsShallow([0], [-0])).toBe(true); // 0 === -0
  });

  it('handles circular references safely (no JSON.stringify)', () => {
    const a: unknown[] = [1];
    a.push(a);
    const b: unknown[] = [1];
    b.push(b);
    // each one references itself \u2192 [1] !== [1] (different refs at index 1)
    expect(equalsShallow(a, b)).toBe(false);
    expect(equalsShallow(a, a)).toBe(true);
  });
});

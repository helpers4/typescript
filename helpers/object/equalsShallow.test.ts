/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { equalsShallow } from './equalsShallow';

describe('object/equalsShallow', () => {
  it('returns true for objects with identical keys and primitive values', () => {
    expect(equalsShallow({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it('is insensitive to key declaration order', () => {
    expect(equalsShallow({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it('returns false for differing primitive values', () => {
    expect(equalsShallow({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('returns false when keys differ', () => {
    expect(equalsShallow({ a: 1 }, { b: 1 })).toBe(false);
    expect(equalsShallow({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    expect(equalsShallow({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('returns true for same reference', () => {
    const obj = { a: 1, b: { c: 2 } };
    expect(equalsShallow(obj, obj)).toBe(true);
  });

  it('compares nested objects by reference (no recursion)', () => {
    expect(equalsShallow({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false);
    const inner = { b: 1 };
    expect(equalsShallow({ a: inner }, { a: inner })).toBe(true);
  });

  it('falls back to === for primitives', () => {
    expect(equalsShallow(5, 5)).toBe(true);
    expect(equalsShallow('hello', 'hello')).toBe(true);
    expect(equalsShallow(true, true)).toBe(true);
    expect(equalsShallow(5, 6)).toBe(false);
    expect(equalsShallow(1, '1')).toBe(false);
  });

  it('handles null and undefined via ===', () => {
    expect(equalsShallow(null, null)).toBe(true);
    expect(equalsShallow(undefined, undefined)).toBe(true);
    expect(equalsShallow(null, undefined)).toBe(false);
    expect(equalsShallow(null, {})).toBe(false);
    expect(equalsShallow({}, null)).toBe(false);
  });

  it('compares functions by reference', () => {
    const fn = () => { /* noop */ };
    expect(equalsShallow(fn, fn)).toBe(true);
    expect(equalsShallow(() => { /* noop */ }, () => { /* noop */ })).toBe(false);
  });

  it('Date instances are treated as plain objects (no special-casing): two distinct Date refs match because both have zero own keys', () => {
    const d = new Date('2023-01-01');
    expect(equalsShallow(d, d)).toBe(true);
    // No special-casing for Date — both have no own enumerable keys.
    // Use object/equalsDeep if you need value-based Date comparison.
    expect(equalsShallow(new Date('2023-01-01'), new Date('2023-01-02'))).toBe(true);
  });

  it('handles undefined values in keys', () => {
    expect(equalsShallow({ a: 1, b: undefined }, { a: 1, b: undefined })).toBe(true);
    // key present vs absent are treated as different
    expect(equalsShallow({ a: 1, b: undefined }, { a: 1 })).toBe(false);
  });

  it('handles circular references safely (no JSON.stringify)', () => {
    const a: Record<string, unknown> = { x: 1 };
    a.self = a;
    const b: Record<string, unknown> = { x: 1 };
    b.self = b;
    // self refs are different references \u2192 false
    expect(equalsShallow(a, b)).toBe(false);
    expect(equalsShallow(a, a)).toBe(true);
  });

  it('arrays always return false (use array/equalsShallow for array comparison)', () => {
    expect(equalsShallow([], {})).toBe(false);
    expect(equalsShallow([1], { 0: 1 })).toBe(false);
    expect(equalsShallow([1, 2], { 0: 1 })).toBe(false);
  });
});

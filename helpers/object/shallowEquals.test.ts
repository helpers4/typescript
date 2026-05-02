/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { shallowEquals } from './shallowEquals';

describe('object/shallowEquals', () => {
  it('returns true for objects with identical keys and primitive values', () => {
    expect(shallowEquals({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it('is insensitive to key declaration order', () => {
    expect(shallowEquals({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it('returns false for differing primitive values', () => {
    expect(shallowEquals({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('returns false when keys differ', () => {
    expect(shallowEquals({ a: 1 }, { b: 1 })).toBe(false);
    expect(shallowEquals({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    expect(shallowEquals({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('returns true for same reference', () => {
    const obj = { a: 1, b: { c: 2 } };
    expect(shallowEquals(obj, obj)).toBe(true);
  });

  it('compares nested objects by reference (no recursion)', () => {
    expect(shallowEquals({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false);
    const inner = { b: 1 };
    expect(shallowEquals({ a: inner }, { a: inner })).toBe(true);
  });

  it('falls back to === for primitives', () => {
    expect(shallowEquals(5, 5)).toBe(true);
    expect(shallowEquals('hello', 'hello')).toBe(true);
    expect(shallowEquals(true, true)).toBe(true);
    expect(shallowEquals(5, 6)).toBe(false);
    expect(shallowEquals(1, '1')).toBe(false);
  });

  it('handles null and undefined via ===', () => {
    expect(shallowEquals(null, null)).toBe(true);
    expect(shallowEquals(undefined, undefined)).toBe(true);
    expect(shallowEquals(null, undefined)).toBe(false);
    expect(shallowEquals(null, {})).toBe(false);
    expect(shallowEquals({}, null)).toBe(false);
  });

  it('compares functions by reference', () => {
    const fn = () => { /* noop */ };
    expect(shallowEquals(fn, fn)).toBe(true);
    expect(shallowEquals(() => { /* noop */ }, () => { /* noop */ })).toBe(false);
  });

  it('Date instances are treated as plain objects (no special-casing): two distinct Date refs match because both have zero own keys', () => {
    const d = new Date('2023-01-01');
    expect(shallowEquals(d, d)).toBe(true);
    // No special-casing for Date — both have no own enumerable keys.
    // Use object/deepEquals if you need value-based Date comparison.
    expect(shallowEquals(new Date('2023-01-01'), new Date('2023-01-02'))).toBe(true);
  });

  it('handles undefined values in keys', () => {
    expect(shallowEquals({ a: 1, b: undefined }, { a: 1, b: undefined })).toBe(true);
    // key present vs absent are treated as different
    expect(shallowEquals({ a: 1, b: undefined }, { a: 1 })).toBe(false);
  });

  it('handles circular references safely (no JSON.stringify)', () => {
    const a: Record<string, unknown> = { x: 1 };
    a.self = a;
    const b: Record<string, unknown> = { x: 1 };
    b.self = b;
    // self refs are different references \u2192 false
    expect(shallowEquals(a, b)).toBe(false);
    expect(shallowEquals(a, a)).toBe(true);
  });

  it('arrays and objects share the keys-and-=== contract: empty array vs empty object both have zero keys', () => {
    expect(shallowEquals([], {})).toBe(true);
    // But mismatched contents do diverge
    expect(shallowEquals([1], { 0: 1 })).toBe(true); // both have key '0' with value 1
    expect(shallowEquals([1, 2], { 0: 1 })).toBe(false);
  });
});

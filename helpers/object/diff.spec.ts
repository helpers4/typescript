/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { diff } from './diff';

describe('diff — property-based', () => {
  it('is reflexive: diff(obj, obj) === true', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        (obj) => {
          expect(diff(obj, obj)).toBe(true);
        }
      )
    );
  });

  it('same-shape objects with same values → true', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        (obj) => {
          const copy = { ...obj };
          expect(diff(obj, copy)).toBe(true);
        }
      )
    );
  });
});

describe('diff — contract', () => {
  it('({a:1}, {a:1}) → true', () => {
    expect(diff({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('({a:1}, {a:2}) → {a: false}', () => {
    expect(diff({ a: 1 }, { a: 2 })).toEqual({ a: false });
  });

  it('({a:1}, {b:1}) → {a: "onlyA", b: "onlyB"}', () => {
    expect(diff({ a: 1 }, { b: 1 })).toEqual({ a: 'onlyA', b: 'onlyB' });
  });

  it('null vs null → false (null == null but null === null so returns true)', () => {
    // Both are null → objA === objB → true (quick reference equality check)
    expect(diff(null, null)).toBe(true);
  });

  it('undefined vs undefined → true (reference equality)', () => {
    expect(diff(undefined, undefined)).toBe(true);
  });

  it('null vs undefined → false', () => {
    expect(diff(null, undefined)).toBe(false);
  });

  it('null vs valid object → false', () => {
    expect(diff(null, { a: 1 })).toBe(false);
  });

  it('valid object vs null → false', () => {
    expect(diff({ a: 1 }, null)).toBe(false);
  });

  it('Date vs same Date value → true', () => {
    const d1 = new Date('2025-06-15T10:00:00.000Z');
    const d2 = new Date('2025-06-15T10:00:00.000Z');
    expect(diff(d1, d2)).toBe(true);
  });

  it('Date vs different Date → false', () => {
    const d1 = new Date('2025-06-15T10:00:00.000Z');
    const d2 = new Date('2025-06-16T10:00:00.000Z');
    expect(diff(d1, d2)).toBe(false);
  });

  it('Array vs same array (equalsShallow) → true', () => {
    expect(diff([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('Array vs different array → false', () => {
    expect(diff([1, 2], [1, 3])).toBe(false);
  });

  it('nested objects with same values → true', () => {
    expect(diff({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
  });

  it('nested objects with different values → reports difference', () => {
    const result = diff({ a: { b: 1 } }, { a: { b: 2 } });
    expect(result).not.toBe(true);
  });
});

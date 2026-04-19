/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { identity } from './identity';

describe('identity — property-based', () => {
  it('always returns the exact same number', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true }), (n) => {
        expect(identity(n)).toBe(n);
      })
    );
  });

  it('always returns the exact same string', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(identity(s)).toBe(s);
      })
    );
  });

  it('always returns the exact same boolean', () => {
    fc.assert(
      fc.property(fc.boolean(), (b) => {
        expect(identity(b)).toBe(b);
      })
    );
  });

  it('preserves referential equality for objects', () => {
    fc.assert(
      fc.property(fc.object(), (obj) => {
        expect(identity(obj)).toBe(obj);
      })
    );
  });

  it('preserves referential equality for arrays', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(identity(arr)).toBe(arr);
      })
    );
  });
});

describe('identity — contract', () => {
  it('acts as a transparent mapper in Array.map', () => {
    const input = [1, 'two', null, true, { a: 3 }];
    const output = input.map(identity);
    expect(output).toEqual(input);
  });

  it('acts as a transparent filter predicate for truthy values', () => {
    const input = [0, 1, '', 'a', null, undefined, false, true];
    const filtered = input.filter(identity);
    expect(filtered).toEqual([1, 'a', true]);
  });

  it('works with nested structures', () => {
    const nested = { a: { b: { c: [1, 2, 3] } } };
    expect(identity(nested)).toBe(nested);
  });
});

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { shallowEquals } from './shallowEquals';

describe('shallowEquals — property-based', () => {
  it('is reflexive: shallowEquals(x, x) === true', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer(),
          fc.string(),
          fc.boolean(),
          fc.record({ a: fc.integer() })
        ),
        (x) => {
          expect(shallowEquals(x, x)).toBe(true);
        }
      )
    );
  });

  it('is symmetric for JSON-serializable values', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer(),
          fc.string(),
          fc.record({ a: fc.integer() })
        ),
        fc.oneof(
          fc.integer(),
          fc.string(),
          fc.record({ a: fc.integer() })
        ),
        (a, b) => {
          expect(shallowEquals(a, b)).toBe(shallowEquals(b, a));
        }
      )
    );
  });

  it('shallowEquals({},{}) === true', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        expect(shallowEquals({}, {})).toBe(true);
      })
    );
  });
});

describe('shallowEquals — contract', () => {
  it('({a:1}, {a:1}) → true', () => {
    expect(shallowEquals({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('({a:1}, {a:2}) → false', () => {
    expect(shallowEquals({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('same primitive values → true', () => {
    expect(shallowEquals(42, 42)).toBe(true);
    expect(shallowEquals('hello', 'hello')).toBe(true);
    expect(shallowEquals(true, true)).toBe(true);
  });

  it('different primitive values → false', () => {
    expect(shallowEquals(1, 2)).toBe(false);
    expect(shallowEquals('a', 'b')).toBe(false);
  });

  it('functions: same reference → true', () => {
    const fn = () => 1;
    expect(shallowEquals(fn, fn)).toBe(true);
  });

  it('functions: different references → false (cannot JSON.stringify)', () => {
    const fn1 = () => 1;
    const fn2 = () => 1;
    expect(shallowEquals(fn1, fn2)).toBe(false);
  });

  it('circular reference: falls back to reference equality (try/catch)', () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj.self = obj;
    expect(shallowEquals(obj, obj)).toBe(true); // same reference
    const obj2: Record<string, unknown> = { a: 1 };
    obj2.self = obj2;
    expect(shallowEquals(obj, obj2)).toBe(false); // different references, JSON.stringify throws
  });

  it('null === null → true', () => {
    expect(shallowEquals(null, null)).toBe(true);
  });

  it('undefined === undefined → true', () => {
    expect(shallowEquals(undefined, undefined)).toBe(true);
  });

  it('null vs undefined → false', () => {
    expect(shallowEquals(null, undefined)).toBe(false);
  });

  it('arrays with same elements → true', () => {
    expect(shallowEquals([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('arrays with different elements → false', () => {
    expect(shallowEquals([1, 2], [1, 3])).toBe(false);
  });
});

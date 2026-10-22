/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { equalsShallow } from './equalsShallow';

describe('equalsShallow — property-based', () => {
  it('is reflexive: equalsShallow(x, x) === true', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer(),
          fc.string(),
          fc.boolean(),
          fc.record({ a: fc.integer() })
        ),
        (x) => {
          expect(equalsShallow(x, x)).toBe(true);
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
          expect(equalsShallow(a, b)).toBe(equalsShallow(b, a));
        }
      )
    );
  });

  it('equalsShallow({},{}) === true', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        expect(equalsShallow({}, {})).toBe(true);
      })
    );
  });
});

describe('equalsShallow — contract', () => {
  it('({a:1}, {a:1}) → true', () => {
    expect(equalsShallow({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('({a:1}, {a:2}) → false', () => {
    expect(equalsShallow({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('same primitive values → true', () => {
    expect(equalsShallow(42, 42)).toBe(true);
    expect(equalsShallow('hello', 'hello')).toBe(true);
    expect(equalsShallow(true, true)).toBe(true);
  });

  it('different primitive values → false', () => {
    expect(equalsShallow(1, 2)).toBe(false);
    expect(equalsShallow('a', 'b')).toBe(false);
  });

  it('functions: same reference → true', () => {
    const fn = () => 1;
    expect(equalsShallow(fn, fn)).toBe(true);
  });

  it('functions: different references → false (cannot JSON.stringify)', () => {
    const fn1 = () => 1;
    const fn2 = () => 1;
    expect(equalsShallow(fn1, fn2)).toBe(false);
  });

  it('circular reference: falls back to reference equality (try/catch)', () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj.self = obj;
    expect(equalsShallow(obj, obj)).toBe(true); // same reference
    const obj2: Record<string, unknown> = { a: 1 };
    obj2.self = obj2;
    expect(equalsShallow(obj, obj2)).toBe(false); // different references, JSON.stringify throws
  });

  it('null === null → true', () => {
    expect(equalsShallow(null, null)).toBe(true);
  });

  it('undefined === undefined → true', () => {
    expect(equalsShallow(undefined, undefined)).toBe(true);
  });

  it('null vs undefined → false', () => {
    expect(equalsShallow(null, undefined)).toBe(false);
  });

  it('arrays → false (unsupported; use array/equalsShallow)', () => {
    expect(equalsShallow([1, 2, 3], [1, 2, 3])).toBe(false);
  });

  it('arrays with different elements → false', () => {
    expect(equalsShallow([1, 2], [1, 3])).toBe(false);
  });
});

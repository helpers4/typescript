/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isFunction } from './isFunction';
import { isAsyncFunction } from './isAsyncFunction';

describe('isFunction — property-based', () => {
  it('isAsyncFunction(v) → isFunction(v)', () => {
    const asyncFn = async () => {};
    expect(isAsyncFunction(asyncFn)).toBe(true);
    expect(isFunction(asyncFn)).toBe(true);
  });

  it('primitives are never functions', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (v) => {
          expect(isFunction(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isFunction — contract', () => {
  it('arrow function → true', () => expect(isFunction(() => {})).toBe(true));
  it('async arrow function → true', () => expect(isFunction(async () => {})).toBe(true));
  it('class → true (classes are functions)', () => {
    class Foo {}
    expect(isFunction(Foo)).toBe(true);
  });
  it('function declaration → true', () => {
    function foo() {}
    expect(isFunction(foo)).toBe(true);
  });
  it('{} → false', () => expect(isFunction({})).toBe(false));
  it('null → false', () => expect(isFunction(null)).toBe(false));
  it('undefined → false', () => expect(isFunction(undefined)).toBe(false));
  it('42 → false', () => expect(isFunction(42)).toBe(false));
});

describe('isFunction — narrowing in if/else', () => {
  it('narrows the value to a callable type in the then-branch', () => {
    const v: unknown = () => 0;
    if (isFunction(v)) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      expectTypeOf(v).toEqualTypeOf<Function>();
      expect(typeof v).toBe('function');
    } else {
      throw new Error('expected then-branch');
    }
    expect(isFunction(0)).toBe(false);
  });
});

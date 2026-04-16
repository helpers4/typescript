/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isAsyncFunction } from './isAsyncFunction';
import { isFunction } from './isFunction';

describe('isAsyncFunction — property-based', () => {
  it('isAsyncFunction(v) → isFunction(v)', () => {
    const asyncFn = async () => {};
    expect(isAsyncFunction(asyncFn)).toBe(true);
    expect(isFunction(asyncFn)).toBe(true);
  });

  it('primitives are never async functions', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (v) => {
          expect(isAsyncFunction(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isAsyncFunction — contract', () => {
  it('async arrow function → true', () => expect(isAsyncFunction(async () => {})).toBe(true));
  it('async function declaration → true', () => {
    async function foo() {}
    expect(isAsyncFunction(foo)).toBe(true);
  });
  it('regular arrow function → false', () => expect(isAsyncFunction(() => {})).toBe(false));
  it('regular function → false', () => {
    function bar() {}
    expect(isAsyncFunction(bar)).toBe(false);
  });
  it('class → false', () => {
    class Foo {}
    expect(isAsyncFunction(Foo)).toBe(false);
  });
  it('null → false', () => expect(isAsyncFunction(null)).toBe(false));
  it('undefined → false', () => expect(isAsyncFunction(undefined)).toBe(false));
  it('{} → false', () => expect(isAsyncFunction({})).toBe(false));
});

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isAsyncIterable } from './isAsyncIterable';

describe('isAsyncIterable — property-based', () => {
  it('primitives are never async iterable', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (value) => {
        expect(isAsyncIterable(value)).toBe(false);
      }),
    );
  });
});

describe('isAsyncIterable — contract', () => {
  it('null → false', () => expect(isAsyncIterable(null)).toBe(false));
  it('undefined → false', () => expect(isAsyncIterable(undefined)).toBe(false));
  it('[] → false (Iterable, not AsyncIterable)', () => expect(isAsyncIterable([])).toBe(false));
  it('{} → false', () => expect(isAsyncIterable({})).toBe(false));
  it('async generator instance → true', () => {
    async function* gen() { yield 1; }
    expect(isAsyncIterable(gen())).toBe(true);
  });
  it('custom [Symbol.asyncIterator] object → true', () => {
    const obj = { [Symbol.asyncIterator]: () => ({ async next() { return { value: undefined, done: true }; } }) };
    expect(isAsyncIterable(obj)).toBe(true);
  });
  it('[Symbol.asyncIterator] must be a function, not a value', () => {
    const obj = { [Symbol.asyncIterator]: 'not-a-function' };
    expect(isAsyncIterable(obj)).toBe(false);
  });
});

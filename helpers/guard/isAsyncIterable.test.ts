/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isAsyncIterable } from './isAsyncIterable';

describe('isAsyncIterable', () => {
  it('should return true for async generators', () => {
    async function* gen() { yield 1; }
    expect(isAsyncIterable(gen())).toBe(true);
  });

  it('should return true for custom async iterable objects', () => {
    const obj = {
      [Symbol.asyncIterator]() {
        return { async next() { return { value: 1, done: true }; } };
      },
    };
    expect(isAsyncIterable(obj)).toBe(true);
  });

  it('should return false for regular iterables (arrays, strings, generators)', () => {
    expect(isAsyncIterable([1, 2, 3])).toBe(false);
    expect(isAsyncIterable('hello')).toBe(false);
    function* gen() { yield 1; }
    expect(isAsyncIterable(gen())).toBe(false);
    expect(isAsyncIterable(new Map())).toBe(false);
    expect(isAsyncIterable(new Set())).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isAsyncIterable(null)).toBe(false);
    expect(isAsyncIterable(undefined)).toBe(false);
  });

  it('should return false for plain objects and primitives', () => {
    expect(isAsyncIterable({})).toBe(false);
    expect(isAsyncIterable(42)).toBe(false);
    expect(isAsyncIterable(true)).toBe(false);
  });
});

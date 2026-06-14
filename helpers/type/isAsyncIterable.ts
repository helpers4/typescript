/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value implements the async iterable protocol.
 *
 * Returns `true` for any object that has a `[Symbol.asyncIterator]()` method,
 * including async generators. Note that regular iterables (arrays, strings, etc.)
 * are **not** async iterables.
 *
 * @param value - The value to check
 * @returns `true` if value is async iterable
 * @example
 * async function* gen() { yield 1; }
 * isAsyncIterable(gen())        // => true
 * isAsyncIterable([1, 2, 3])    // => false  (Iterable, not AsyncIterable)
 * isAsyncIterable('hello')      // => false
 * isAsyncIterable(null)         // => false
 * @since next
 */
export function isAsyncIterable(value: unknown): value is AsyncIterable<unknown> {
  if (value === null || value === undefined) return false;
  return typeof (value as AsyncIterable<unknown>)[Symbol.asyncIterator] === 'function';
}

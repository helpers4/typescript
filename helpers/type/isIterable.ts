/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is iterable (has a `Symbol.iterator` method).
 *
 * Returns `true` for strings, arrays, Maps, Sets, generators, and any object
 * implementing the iterable protocol.
 *
 * @param value - The value to check
 * @returns True if value is iterable
 * @example
 * isIterable([1, 2, 3])      // => true
 * isIterable('hello')        // => true
 * isIterable(new Map())      // => true
 * isIterable(new Set())      // => true
 * isIterable({})             // => false
 * isIterable(42)             // => false
 * @since 2.0.0
 */
export function isIterable(value: unknown): value is Iterable<unknown> {
  if (value === null || value === undefined) return false;
  return typeof (value as Iterable<unknown>)[Symbol.iterator] === 'function';
}

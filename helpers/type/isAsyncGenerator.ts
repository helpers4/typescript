/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is an async generator object (the result of calling an `async function*`).
 *
 * Distinct from {@link isAsyncGeneratorFunction}: this predicate targets the
 * *instance* produced by calling an async generator function, not the function itself.
 *
 * @param value - The value to check
 * @returns `true` if value is an AsyncGenerator instance
 * @example
 * async function* gen() { yield 1; }
 * isAsyncGenerator(gen())   // => true
 * isAsyncGenerator(gen)     // => false  (function, not instance)
 * isAsyncGenerator([])      // => false
 * @see {@link isAsyncGeneratorFunction}
 * @since 2.0.3
 */
export function isAsyncGenerator(value: unknown): value is AsyncGenerator<unknown, unknown, unknown> {
  return Object.prototype.toString.call(value) === '[object AsyncGenerator]';
}

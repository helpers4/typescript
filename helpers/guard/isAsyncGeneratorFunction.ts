/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is an async generator function (an `async function*` declaration or expression).
 *
 * Distinct from {@link isAsyncGenerator}: this predicate targets the *function* itself,
 * not the async iterator it produces when called.
 *
 * @param value - The value to check
 * @returns `true` if value is an AsyncGeneratorFunction
 * @example
 * async function* gen() { yield 1; }
 * isAsyncGeneratorFunction(gen)         // => true
 * isAsyncGeneratorFunction(gen())       // => false  (instance, not function)
 * isAsyncGeneratorFunction(async () => {}) // => false
 * @see {@link isAsyncGenerator}
 * @since 2.0.3
 */
export function isAsyncGeneratorFunction(value: unknown): value is AsyncGeneratorFunction {
  return Object.prototype.toString.call(value) === '[object AsyncGeneratorFunction]';
}

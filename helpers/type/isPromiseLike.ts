/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a thenable (has a `.then()` method).
 *
 * Looser than {@link isPromise}: accepts any object or function with a `then`
 * method, including non-standard Promise implementations without `.catch()`.
 * Follows the Promise/A+ specification for thenables.
 *
 * @param value - The value to check
 * @returns `true` if value is a PromiseLike (thenable)
 * @example
 * isPromiseLike(Promise.resolve(1))         // => true
 * isPromiseLike({ then: () => {} })         // => true   (thenable)
 * isPromiseLike({ then: 'not-a-function' }) // => false
 * isPromiseLike(42)                         // => false
 * isPromiseLike(null)                       // => false
 * @see {@link isPromise} for a stricter check that also requires `.catch()`
 * @since next
 */
export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    // Unlike isNodeStream/isObservable, also accepts `function`: a callable
    // exposing `.then()` (e.g. an async function with a `then` property attached)
    // is a realistic thenable shape per the Promise/A+ spec.
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as PromiseLike<unknown>).then === 'function'
  );
}

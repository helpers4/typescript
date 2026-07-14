/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a function that calls `fn` with only its first argument, discarding
 * any others.
 *
 * Prevents the classic footgun where a callback expecting extra positional
 * arguments is passed directly to `Array.prototype.map`:
 * `['1', '2', '3'].map(parseInt)` silently passes the array index as
 * `parseInt`'s radix argument, producing `[1, NaN, NaN]`.
 *
 * @param fn - The function to restrict to one argument
 * @returns A new function that calls `fn` with only its first argument
 * @example
 * ['1', '2', '3'].map(unary(parseInt))
 * // => [1, 2, 3]
 * @example
 * ['1', '2', '3'].map(parseInt)
 * // => [1, NaN, NaN]  (the bug unary() prevents — index is passed as radix)
 * @since next
 */
export function unary<F extends (...args: never[]) => unknown>(
  fn: F,
): (arg: Parameters<F>[0]) => ReturnType<F> {
  return (arg: Parameters<F>[0]): ReturnType<F> =>
    (fn as (arg: Parameters<F>[0]) => ReturnType<F>)(arg);
}

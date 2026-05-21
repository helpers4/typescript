/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Transforms a multi-argument function into a chain of single-argument functions
 * (Haskell-style currying). Supports up to 5 arguments.
 *
 * The inverse operation of applying all arguments at once:
 * `curry(fn)(a)(b)` is equivalent to `fn(a, b)`.
 *
 * @param fn - The function to curry
 * @returns A curried version of `fn`
 * @example
 * const add = curry((a: number, b: number) => a + b);
 * const add5 = add(5);
 * add5(3); // => 8
 * add5(10); // => 15
 * @since 2.0.0
 */
export function curry<A, R>(fn: (a: A) => R): (a: A) => R;
export function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R;
export function curry<A, B, C, R>(fn: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R;
export function curry<A, B, C, D, R>(fn: (a: A, b: B, c: C, d: D) => R): (a: A) => (b: B) => (c: C) => (d: D) => R;
export function curry<A, B, C, D, E, R>(fn: (a: A, b: B, c: C, d: D, e: E) => R): (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => R;
export function curry(fn: (...args: unknown[]) => unknown): unknown {
  function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) return fn(...args);
    return (...more: unknown[]) => curried(...args, ...more);
  }
  return curried;
}

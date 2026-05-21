/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Composes functions left-to-right: the output of each function is passed as
 * input to the next.
 *
 * The inverse of {@link compose}, which applies functions right-to-left.
 *
 * @param fns - Functions to compose (left-to-right)
 * @returns A function that applies `fns` in order
 * @see {@link compose} for right-to-left composition
 * @example
 * const process = pipe(
 *   (x: number) => x + 1,
 *   (x: number) => x * 2,
 *   String
 * );
 * process(3); // => "8"
 * @since 2.0.0
 */
export function pipe<A, B>(fn1: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D): (a: A) => D;
export function pipe<A, B, C, D, E>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D, fn4: (d: D) => E): (a: A) => E;
export function pipe<A, B, C, D, E, F>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D, fn4: (d: D) => E, fn5: (e: E) => F): (a: A) => F;
export function pipe<A, B, C, D, E, F, G>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D, fn4: (d: D) => E, fn5: (e: E) => F, fn6: (f: F) => G): (a: A) => G;
export function pipe<A, B, C, D, E, F, G, H>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D, fn4: (d: D) => E, fn5: (e: E) => F, fn6: (f: F) => G, fn7: (g: G) => H): (a: A) => H;
export function pipe<A, B, C, D, E, F, G, H, I>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D, fn4: (d: D) => E, fn5: (e: E) => F, fn6: (f: F) => G, fn7: (g: G) => H, fn8: (h: H) => I): (a: A) => I;
export function pipe(...fns: ((x: unknown) => unknown)[]): (x: unknown) => unknown {
  return (x: unknown) => fns.reduce((acc, fn) => fn(acc), x);
}

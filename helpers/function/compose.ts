/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Composes functions right-to-left: `compose(f, g)(x)` is equivalent to `f(g(x))`.
 *
 * The inverse of {@link pipe}, which applies functions left-to-right.
 *
 * @param fns - Functions to compose (right-to-left)
 * @returns A function that applies `fns` in reverse order
 * @see {@link pipe} for left-to-right composition
 * @example
 * const process = compose(
 *   String,
 *   (x: number) => x * 2,
 *   (x: number) => x + 1
 * );
 * process(3); // => "8"
 * @since 2.0.0
 */
export function compose<A, B>(fn1: (a: A) => B): (a: A) => B;
export function compose<A, B, C>(fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => C;
export function compose<A, B, C, D>(fn3: (c: C) => D, fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => D;
export function compose<A, B, C, D, E>(fn4: (d: D) => E, fn3: (c: C) => D, fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => E;
export function compose<A, B, C, D, E, F>(fn5: (e: E) => F, fn4: (d: D) => E, fn3: (c: C) => D, fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => F;
export function compose<A, B, C, D, E, F, G>(fn6: (f: F) => G, fn5: (e: E) => F, fn4: (d: D) => E, fn3: (c: C) => D, fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => G;
export function compose<A, B, C, D, E, F, G, H>(fn7: (g: G) => H, fn6: (f: F) => G, fn5: (e: E) => F, fn4: (d: D) => E, fn3: (c: C) => D, fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => H;
export function compose<A, B, C, D, E, F, G, H, I>(fn8: (h: H) => I, fn7: (g: G) => H, fn6: (f: F) => G, fn5: (e: E) => F, fn4: (d: D) => E, fn3: (c: C) => D, fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => I;
export function compose(...fns: ((x: unknown) => unknown)[]): (x: unknown) => unknown {
  return (x: unknown) => fns.reduceRight((acc, fn) => fn(acc), x);
}

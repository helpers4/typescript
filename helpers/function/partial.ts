/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Partially applies arguments to a function, returning a new function that
 * accepts the remaining arguments.
 *
 * @param fn - The function to partially apply
 * @param partialArgs - The arguments to pre-fill
 * @returns A function waiting for the remaining arguments
 * @see {@link curry} for one-argument-at-a-time currying
 * @example
 * const multiply = (a: number, b: number) => a * b;
 * const double = partial(multiply, 2);
 * double(5); // => 10
 * double(7); // => 14
 * @since next
 */
export function partial<A, R>(fn: (a: A) => R, a: A): () => R;
export function partial<A, B, R>(fn: (a: A, b: B) => R, a: A): (b: B) => R;
export function partial<A, B, C, R>(fn: (a: A, b: B, c: C) => R, a: A): (b: B, c: C) => R;
export function partial<A, B, C, R>(fn: (a: A, b: B, c: C) => R, a: A, b: B): (c: C) => R;
export function partial<A, B, C, D, R>(fn: (a: A, b: B, c: C, d: D) => R, a: A): (b: B, c: C, d: D) => R;
export function partial<A, B, C, D, R>(fn: (a: A, b: B, c: C, d: D) => R, a: A, b: B): (c: C, d: D) => R;
export function partial<A, B, C, D, R>(fn: (a: A, b: B, c: C, d: D) => R, a: A, b: B, c: C): (d: D) => R;
export function partial(fn: (...args: unknown[]) => unknown, ...partialArgs: unknown[]): (...rest: unknown[]) => unknown {
  return (...rest: unknown[]) => fn(...partialArgs, ...rest);
}

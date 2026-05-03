/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a function that invokes `fn` with the first two arguments swapped.
 *
 * Useful when adapting a function for use in higher-order pipelines where the
 * argument order is reversed (e.g. passing a binary callback to `reduce`).
 *
 * @param fn - The function to wrap.
 * @returns A new function with the first two parameters swapped.
 * @example
 * const sub = (a: number, b: number) => a - b;
 * const flippedSub = flip(sub);
 * flippedSub(3, 10); // 10 - 3 = 7
 * @example
 * const divide = (a: number, b: number) => a / b;
 * [2, 4, 8].map((n) => flip(divide)(n, 10)); // [5, 2.5, 1.25]
 * @since next
 */
export function flip<A, B, Rest extends unknown[], R>(
  fn: (a: A, b: B, ...rest: Rest) => R,
): (b: B, a: A, ...rest: Rest) => R {
  return (b: B, a: A, ...rest: Rest) => fn(a, b, ...rest);
}

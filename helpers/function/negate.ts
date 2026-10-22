/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a function that negates the result of `predicate`.
 *
 * @param predicate - A predicate function returning a boolean.
 * @returns A new function that returns the logical negation of `predicate`.
 * @example
 * const isEven = (n: number) => n % 2 === 0;
 * const isOdd = negate(isEven);
 * isOdd(3); // true
 * isOdd(4); // false
 * @example
 * const isEmpty = (arr: unknown[]) => arr.length === 0;
 * [[], [1], [], [2, 3]].filter(negate(isEmpty)); // [[1], [2, 3]]
 * @since 2.0.0
 */
export function negate<T extends unknown[]>(
  predicate: (...args: T) => boolean,
): (...args: T) => boolean {
  return (...args: T) => !predicate(...args);
}

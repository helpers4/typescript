/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Splits an array into two groups based on a predicate function.
 * The first group contains elements for which the predicate returns true,
 * the second group contains the rest.
 * @param array - The array to partition
 * @param predicate - Function that returns true for elements in the first group
 * @returns A tuple of two arrays: [matching, non-matching]
 * @example
 * partition([1, 2, 3, 4, 5], n => n % 2 === 0)
 * // => [[2, 4], [1, 3, 5]]
 * @since 2.0.0
 */
export function partition<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean,
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i)) {
      pass.push(array[i]);
    } else {
      fail.push(array[i]);
    }
  }
  return [pass, fail];
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Splits an array of tuples into separate arrays, one per position.
 *
 * The inverse of {@link zip}.
 *
 * @param pairs - Array of 2-tuples to unzip
 * @returns A tuple of two arrays: all first elements and all second elements
 * @see {@link zip} for the inverse operation
 * @example
 * unzip([[1, 'a'], [2, 'b'], [3, 'c']])
 * // => [[1, 2, 3], ['a', 'b', 'c']]
 * @since 2.0.0
 */
export function unzip<A, B>(pairs: readonly [A, B][]): [A[], B[]];
export function unzip<A, B, C>(pairs: readonly [A, B, C][]): [A[], B[], C[]];
export function unzip<A, B, C, D>(pairs: readonly [A, B, C, D][]): [A[], B[], C[], D[]];
export function unzip(pairs: readonly unknown[][]): unknown[][] {
  if (pairs.length === 0) return [];
  const width = pairs[0].length;
  const result = Array.from({ length: width }, (): unknown[] => []);
  for (const tuple of pairs) {
    for (let i = 0; i < width; i++) {
      result[i].push(tuple[i]);
    }
  }
  return result;
}

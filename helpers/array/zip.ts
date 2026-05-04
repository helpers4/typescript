/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Combines multiple arrays element-by-element into an array of tuples.
 * The result length equals the length of the shortest input array.
 *
 * The inverse of {@link unzip}.
 *
 * @param a - First array
 * @param b - Second array
 * @returns Array of `[a, b]` pairs
 * @see {@link unzip} for the inverse operation
 * @example
 * zip([1, 2, 3], ['a', 'b', 'c'])
 * // => [[1, 'a'], [2, 'b'], [3, 'c']]
 *
 * zip([1, 2], ['a', 'b', 'c']) // shorter array wins
 * // => [[1, 'a'], [2, 'b']]
 * @since next
 */
export function zip<A, B>(a: readonly A[], b: readonly B[]): [A, B][];
export function zip<A, B, C>(a: readonly A[], b: readonly B[], c: readonly C[]): [A, B, C][];
export function zip<A, B, C, D>(a: readonly A[], b: readonly B[], c: readonly C[], d: readonly D[]): [A, B, C, D][];
export function zip(...arrays: readonly (readonly unknown[])[]): unknown[][] {
  if (arrays.length === 0) return [];
  const length = Math.min(...arrays.map(a => a.length));
  return Array.from({ length }, (_, i) => arrays.map(a => a[i]));
}

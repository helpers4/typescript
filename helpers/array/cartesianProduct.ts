/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Computes the Cartesian product of the provided arrays.
 *
 * Returns all possible tuples formed by picking one element from each input array,
 * in lexicographic order relative to the input order.
 *
 * @param arrays - Two or more arrays to combine.
 * @returns An array of tuples, each containing one element from each input array.
 * @example
 * cartesianProduct([1, 2], ['a', 'b']);
 * // [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
 * @example
 * cartesianProduct([0, 1], [0, 1], [0, 1]);
 * // [[0,0,0],[0,0,1],[0,1,0],[0,1,1],[1,0,0],[1,0,1],[1,1,0],[1,1,1]]
 * @since next
 */
export function cartesianProduct<T extends readonly (readonly unknown[])[]>(
  ...arrays: T
): { [K in keyof T]: T[K][number] }[] {
  if (arrays.length === 0) return [];
  return arrays.reduce<unknown[][]>(
    (acc, arr) => acc.flatMap((combo) => arr.map((item) => [...combo, item])),
    [[]],
  ) as { [K in keyof T]: T[K][number] }[];
}

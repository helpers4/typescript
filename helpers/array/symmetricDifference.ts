/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns the symmetric difference between two arrays: items present in
 * exactly one of the two arrays (in either, but not both).
 * `null` and `undefined` are treated as empty arrays.
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Items unique to `array1` (in original order), followed by items unique to `array2`
 * @example
 * symmetricDifference([1, 2, 3], [2, 3, 4])
 * // => [1, 4]
 * @since 4.0.0
 */
export function symmetricDifference<T>(
  array1: readonly T[] | null | undefined,
  array2: readonly T[] | null | undefined,
): T[] {
  const a = array1 ?? [];
  const b = array2 ?? [];
  const setA = new Set(a);
  const setB = new Set(b);
  return [...a.filter((item) => !setB.has(item)), ...b.filter((item) => !setA.has(item))];
}

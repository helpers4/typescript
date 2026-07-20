/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Calculates the median (middle value) of an array of numbers. For an even-length array,
 * returns the average of the two middle values. Returns `NaN` for an empty array.
 * Does not mutate the input array.
 * @param array - The array of numbers
 * @returns The median value, or `NaN` if the array is empty
 * @example
 * median([1, 2, 3])     // => 2
 * median([1, 2, 3, 4])  // => 2.5
 * median([])            // => NaN
 * @since next
 */
export function median(array: readonly number[]): number {
  if (array.length === 0) return NaN;
  const sorted = array.toSorted((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

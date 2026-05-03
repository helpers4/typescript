/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Calculates the arithmetic mean (average) of an array of numbers.
 * Returns `NaN` for an empty array.
 *
 * Pairs with {@link sum} for aggregate operations.
 *
 * @param array - The array of numbers to average
 * @returns The arithmetic mean, or `NaN` if the array is empty
 * @example
 * mean([1, 2, 3, 4])  // => 2.5
 * mean([10])          // => 10
 * mean([])            // => NaN
 * @since next
 */
export function mean(array: readonly number[]): number {
  if (array.length === 0) return NaN;
  return array.reduce((acc, n) => acc + n, 0) / array.length;
}

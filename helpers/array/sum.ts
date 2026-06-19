/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Calculates the sum of an array of numbers.
 * @param array - The array of numbers to sum
 * @returns The sum of all values, or `0` for an empty array
 * @example
 * sum([1, 2, 3, 4])
 * // => 10
 * @since 2.0.0
 */
export function sum(array: readonly number[]): number {
  return array.reduce((acc, n) => acc + n, 0);
}

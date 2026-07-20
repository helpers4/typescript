/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Calculates the p-th percentile of an array of numbers using linear interpolation between
 * the closest ranks. Returns `NaN` for an empty array. Does not mutate the input array.
 * @param array - The array of numbers
 * @param p - The percentile to compute, from `0` to `100`
 * @returns The interpolated value at percentile `p`, or `NaN` if the array is empty
 * @example
 * percentile([1, 2, 3, 4], 50)  // => 2.5 (the median)
 * percentile([1, 2, 3, 4], 0)   // => 1 (the min)
 * percentile([1, 2, 3, 4], 100) // => 4 (the max)
 * @since 3.0.3
 */
export function percentile(array: readonly number[], p: number): number {
  if (array.length === 0) return NaN;
  const sorted = array.toSorted((a, b) => a - b);
  if (p <= 0) return sorted[0]!;
  if (p >= 100) return sorted[sorted.length - 1]!;

  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower]!;

  const fraction = index - lower;
  return sorted[lower]! + (sorted[upper]! - sorted[lower]!) * fraction;
}

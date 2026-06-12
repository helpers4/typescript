/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns the maximum value in an array using a loop instead of spread,
 * avoiding the call stack overflow that occurs with `Math.max(...array)`
 * for very large arrays (> ~65 000 elements).
 * @param array - Array of numbers
 * @returns Maximum value, `undefined` for empty arrays, or `NaN` if any element is `NaN`
 * @example
 * max([3, 1, 4, 1, 5, 9]) // => 9
 * max([]) // => undefined
 * @since next
 */
export function max(array: readonly number[]): number | undefined {
  if (array.length === 0) return undefined;
  let result = -Infinity;
  for (const val of array) {
    if (Number.isNaN(val)) return NaN;
    if (val > result || (Object.is(val, 0) && Object.is(result, -0))) result = val;
  }
  return result;
}

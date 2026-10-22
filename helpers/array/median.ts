/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { percentile } from './percentile.js';

/**
 * Calculates the median (middle value) of an array of numbers. For an even-length array,
 * returns the average of the two middle values. Returns `NaN` for an empty array.
 * Does not mutate the input array.
 *
 * The median is the 50th {@link percentile} — this delegates to it rather than duplicating
 * its sort/interpolation logic.
 * @param array - The array of numbers
 * @returns The median value, or `NaN` if the array is empty
 * @example
 * median([1, 2, 3])     // => 2
 * median([1, 2, 3, 4])  // => 2.5
 * median([])            // => NaN
 * @since 3.0.3
 */
export function median(array: readonly number[]): number {
  return percentile(array, 50);
}

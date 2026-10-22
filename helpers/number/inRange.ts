/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link inRange}.
 */
export interface InRangeOptions {
  /**
   * Which boundary (or boundaries) are included in the range.
   * - `'both'` (default): `min <= value <= max`
   * - `'min'`: `min <= value < max`
   * - `'max'`: `min < value <= max`
   * - `'none'`: `min < value < max`
   */
  inclusive?: 'both' | 'min' | 'max' | 'none';
}

/**
 * Checks whether a number falls within `[min, max]` (both inclusive by default).
 *
 * @param value - The number to test
 * @param min - Lower bound
 * @param max - Upper bound
 * @param options - Boundary inclusion mode (default: `'both'`)
 * @returns `true` if `value` is within the specified range
 * @example
 * inRange(5, 1, 10)          // => true
 * inRange(1, 1, 10)          // => true  (min inclusive)
 * inRange(1, 1, 10, { inclusive: 'none' })  // => false
 * inRange(10, 1, 10, { inclusive: 'max' })  // => true
 * @since 2.0.0
 */
export function inRange(value: number, min: number, max: number, options: InRangeOptions = {}): boolean {
  const { inclusive = 'both' } = options;
  const minOk = inclusive === 'both' || inclusive === 'min' ? value >= min : value > min;
  const maxOk = inclusive === 'both' || inclusive === 'max' ? value <= max : value < max;
  return minOk && maxOk;
}

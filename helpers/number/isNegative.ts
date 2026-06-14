/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a number less than 0.
 *
 * Returns `false` for `NaN`, `0`, positive numbers, and non-number types.
 *
 * @param value - The value to check
 * @returns True if value is a negative number
 * @example
 * isNegative(-1)   // => true
 * isNegative(-0.5) // => true
 * isNegative(0)    // => false
 * isNegative(1)    // => false
 * isNegative(NaN)  // => false
 * @since 2.0.0
 */
export function isNegative(value: unknown): value is number {
  return typeof value === 'number' && value < 0;
}

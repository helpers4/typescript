/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a number greater than 0.
 *
 * Returns `false` for `NaN`, `0`, negative numbers, and non-number types.
 *
 * @param value - The value to check
 * @returns True if value is a positive number
 * @example
 * isPositive(42)   // => true
 * isPositive(0.1)  // => true
 * isPositive(0)    // => false
 * isPositive(-1)   // => false
 * isPositive(NaN)  // => false
 * @since 2.0.0
 */
export function isPositive(value: unknown): value is number {
  return typeof value === 'number' && value > 0;
}

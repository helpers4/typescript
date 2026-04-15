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
 * isPositiveNumber(42)   // => true
 * isPositiveNumber(0.1)  // => true
 * isPositiveNumber(0)    // => false
 * isPositiveNumber(-1)   // => false
 * isPositiveNumber(NaN)  // => false
 * @since 2.0.0
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0;
}

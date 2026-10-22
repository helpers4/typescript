/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is an odd integer.
 *
 * Returns `false` for non-numbers, non-integers, `NaN`, `Infinity`, and even integers.
 *
 * @param value - The value to check
 * @returns `true` if value is an integer not divisible by 2
 * @example
 * isOdd(3)    // => true
 * isOdd(1)    // => true
 * isOdd(-7)   // => true
 * isOdd(2)    // => false
 * isOdd(1.5)  // => false  (not an integer)
 * isOdd('3')  // => false
 * @since 2.0.3
 */
export function isOdd(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value % 2 !== 0;
}

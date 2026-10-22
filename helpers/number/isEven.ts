/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is an even integer.
 *
 * Returns `false` for non-numbers, non-integers, `NaN`, `Infinity`, and odd integers.
 *
 * @param value - The value to check
 * @returns `true` if value is an integer divisible by 2
 * @example
 * isEven(2)    // => true
 * isEven(0)    // => true
 * isEven(-4)   // => true
 * isEven(3)    // => false
 * isEven(1.5)  // => false  (not an integer)
 * isEven('2')  // => false
 * @since 2.0.3
 */
export function isEven(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value % 2 === 0;
}

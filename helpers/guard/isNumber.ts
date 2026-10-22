/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a number.
 *
 * Returns `false` for `NaN`, which intentionally deviates from `typeof` behavior
 * to increase user-friendliness.
 *
 * @param value - The value to check
 * @returns True if value is a number (excludes NaN)
 * @example
 * isNumber(42)    // => true
 * isNumber(0)     // => true
 * isNumber(NaN)   // => false
 * isNumber('123') // => false
 * @since 1.9.0
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

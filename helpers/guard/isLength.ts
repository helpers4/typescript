/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks whether a value is a valid array-like `length`: a non-negative safe integer
 * (`0 <= value <= Number.MAX_SAFE_INTEGER`).
 * @param value - The value to check
 * @returns `true` if value is a valid length
 * @example
 * isLength(3)      // => true
 * isLength(0)      // => true
 * isLength(-1)     // => false
 * isLength(1.5)    // => false
 * isLength('3')    // => false
 * @since next
 */
export function isLength(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= Number.MAX_SAFE_INTEGER
  );
}

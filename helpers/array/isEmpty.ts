/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if an array is empty (has no elements).
 * `null` and `undefined` are treated as empty arrays and return `true`.
 * @param value - The array to check
 * @returns `true` if the array has no elements, or if `value` is `null`/`undefined`
 * @example
 * isEmpty([])          // => true
 * isEmpty(null)        // => true
 * isEmpty(undefined)   // => true
 * isEmpty([1, 2, 3])   // => false
 * @since 2.0.3
 */
export function isEmpty(value: readonly unknown[] | null | undefined): value is readonly never[] | null | undefined {
  return value == null || value.length === 0;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if an array is empty (has no elements).
 * @param value - The array to check
 * @returns `true` if the array has no elements
 * @example
 * isEmpty([])        // => true
 * isEmpty([1, 2, 3]) // => false
 * @since 2.0.3
 */
export function isEmpty(value: readonly unknown[]): value is readonly never[] {
  return value.length === 0;
}

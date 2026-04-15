/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is null or undefined (nullish).
 * @param value - The value to check
 * @returns True if value is null or undefined
 * @example
 * isNullish(null)      // => true
 * isNullish(undefined) // => true
 * isNullish(0)         // => false
 * isNullish('')        // => false
 *
 * @see {@link isDefined} for the inverse check (`!isNullish`)
 * @see {@link isFalsy} to also catch `0`, `""`, `false`, and `NaN`
 * @since 2.0.0
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is `undefined`.
 * @param value - The value to check
 * @returns True if value is undefined
 * @example
 * isUndefined(undefined) // => true
 * isUndefined(null)      // => false
 * isUndefined(0)         // => false
 *
 * @see {@link isNullish} to check for both `null` and `undefined`
 * @since 2.0.0
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

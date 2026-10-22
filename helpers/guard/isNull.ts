/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is `null`.
 * @param value - The value to check
 * @returns True if value is null
 * @example
 * isNull(null)      // => true
 * isNull(undefined) // => false
 * isNull(0)         // => false
 *
 * @see {@link isNullish} to check for both `null` and `undefined`
 * @since 2.0.0
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

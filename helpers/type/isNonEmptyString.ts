/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a non-empty string (length > 0).
 * @param value - The value to check
 * @returns True if value is a string with at least one character
 * @example
 * isNonEmptyString('hello') // => true
 * isNonEmptyString('')      // => false
 * isNonEmptyString(42)      // => false
 * isNonEmptyString(null)    // => false
 * @since 2.0.0
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a valid Date instance (not `Invalid Date`).
 *
 * Unlike {@link isDate}, this also verifies that the internal timestamp is not `NaN`.
 *
 * @param value - The value to check
 * @returns True if value is a Date instance with a valid time value
 * @example
 * isValidDate(new Date())          // => true
 * isValidDate(new Date('invalid')) // => false
 * isValidDate('2023-01-01')       // => false (not a Date instance)
 *
 * @see {@link isDate} for checking only if value is a Date instance
 * @see {@link isTimestamp} for checking if a number is a valid timestamp
 * @since 2.0.0
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

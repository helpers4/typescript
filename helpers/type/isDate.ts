/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a Date instance.
 *
 * Note: this only checks the type, not whether the Date is valid.
 * Use {@link isValidDate} to also validate that the Date is not `Invalid Date`.
 *
 * @param value - The value to check
 * @returns True if value is a Date instance
 * @example
 * isDate(new Date())          // => true
 * isDate(new Date('invalid')) // => true (still a Date instance)
 * isDate('2023-01-01')       // => false
 * isDate(1609459200000)      // => false
 *
 * @see {@link isValidDate} for validating the Date is not Invalid Date
 * @see {@link isTimestamp} for checking if a number is a valid timestamp
 * @since 2.0.0
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

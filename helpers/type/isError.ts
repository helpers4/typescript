/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is an Error instance.
 * @param value - The value to check
 * @returns True if value is an Error (or subclass like TypeError, RangeError, etc.)
 * @example
 * isError(new Error('oops'))     // => true
 * isError(new TypeError('bad'))  // => true
 * isError({ message: 'fake' })  // => false
 * @since 2.0.0
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a string.
 * @param value - The value to check
 * @returns True if value is a string
 * @example
 * isString('hello') // => true
 * isString(123)     // => false
 * @since 1.9.0
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

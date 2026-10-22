/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a boolean.
 * @param value - The value to check
 * @returns True if value is a boolean
 * @example
 * isBoolean(true)  // => true
 * isBoolean(false) // => true
 * isBoolean(1)     // => false
 * @since 1.9.0
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

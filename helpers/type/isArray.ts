/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is an array.
 * @param value - The value to check
 * @returns True if value is an array
 * @example
 * isArray([1, 2, 3]) // => true
 * isArray('hello')   // => false
 * isArray({})        // => false
 * @since 1.9.0
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

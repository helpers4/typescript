/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a bigint.
 * @param value - The value to check
 * @returns True if value is a bigint
 * @example
 * isBigInt(42n)  // => true
 * isBigInt(42)   // => false
 * isBigInt('42') // => false
 * @since 2.0.0
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

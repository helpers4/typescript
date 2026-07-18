/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a Set instance.
 * @param value - The value to check
 * @returns True if value is a Set
 * @example
 * isSet(new Set())        // => true
 * isSet(new Set([1, 2]))  // => true
 * isSet([])                // => false
 * @since 4.0.0
 */
export function isSet(value: unknown): value is Set<unknown> {
  return value instanceof Set;
}

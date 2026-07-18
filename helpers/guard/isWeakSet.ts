/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a WeakSet instance.
 * @param value - The value to check
 * @returns True if value is a WeakSet
 * @example
 * isWeakSet(new WeakSet())  // => true
 * isWeakSet(new Set())      // => false
 * @since 3.0.0
 */
export function isWeakSet(value: unknown): value is WeakSet<object> {
  return value instanceof WeakSet;
}

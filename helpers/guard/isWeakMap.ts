/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a WeakMap instance.
 * @param value - The value to check
 * @returns True if value is a WeakMap
 * @example
 * isWeakMap(new WeakMap())  // => true
 * isWeakMap(new Map())      // => false
 * @since next
 */
export function isWeakMap(value: unknown): value is WeakMap<object, unknown> {
  return value instanceof WeakMap;
}

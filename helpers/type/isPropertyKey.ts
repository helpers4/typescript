/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a valid property key: `string`, `number`, or `symbol`.
 *
 * @param value - The value to check
 * @returns `true` if value can be used as an object property key
 * @example
 * isPropertyKey('name')        // => true
 * isPropertyKey(42)            // => true
 * isPropertyKey(Symbol('id'))  // => true
 * isPropertyKey(null)          // => false
 * isPropertyKey({})            // => false
 * isPropertyKey(true)          // => false
 * @since 2.0.3
 */
export function isPropertyKey(value: unknown): value is PropertyKey {
  const t = typeof value;
  return t === 'string' || t === 'number' || t === 'symbol';
}

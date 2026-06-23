/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is array-like: has a non-negative integer `length` property.
 *
 * Returns `true` for arrays, strings, `arguments` objects, `NodeList`, typed
 * arrays, and any object with a valid `length`. Functions are excluded even though
 * they have a `length` (arity), as they are not considered array-like in practice.
 *
 * @param value - The value to check
 * @returns `true` if value is array-like
 * @example
 * isArrayLike([1, 2, 3])       // => true
 * isArrayLike('hello')         // => true
 * isArrayLike({ length: 2 })   // => true
 * isArrayLike({ length: -1 })  // => false  (negative length)
 * isArrayLike({ length: 1.5 }) // => false  (non-integer length)
 * isArrayLike(() => {})        // => false  (functions excluded)
 * isArrayLike(null)            // => false
 * @since 2.0.3
 */
export function isArrayLike(value: unknown): value is ArrayLike<unknown> {
  if (value == null) return false;
  const t = typeof value;
  if (t !== 'object' && t !== 'string') return false;
  const len = (value as ArrayLike<unknown>).length;
  return typeof len === 'number' && Number.isInteger(len) && len >= 0;
}

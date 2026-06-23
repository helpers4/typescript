/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a plain object.
 *
 * A plain object is created by `{}`, `new Object()`, or `Object.create(null)`.
 * Returns `false` for arrays, Date, Map, Set, RegExp, class instances, etc.
 *
 * @param value - The value to check
 * @returns True if value is a plain object
 * @example
 * isPlainObject({})           // => true
 * isPlainObject({ a: 1 })    // => true
 * isPlainObject(new Date())  // => false
 * isPlainObject([])          // => false
 * isPlainObject(null)        // => false
 * @since 2.0.0
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

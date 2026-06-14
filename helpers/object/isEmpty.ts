/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a plain object has no own enumerable string-keyed properties.
 *
 * Symbol-keyed properties are not counted. Use `Object.getOwnPropertySymbols`
 * separately if symbol keys matter for your use case.
 *
 * @param value - The object to check
 * @returns `true` if the object has no own enumerable string-keyed properties
 * @example
 * isEmpty({})          // => true
 * isEmpty({ a: 1 })    // => false
 * isEmpty({ a: undefined }) // => false  (key exists)
 * @since next
 */
export function isEmpty(value: Record<PropertyKey, unknown>): boolean {
  return Object.keys(value).length === 0;
}

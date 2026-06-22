/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a plain object has no own enumerable string-keyed properties.
 * `null` and `undefined` are treated as empty objects and return `true`.
 *
 * Symbol-keyed properties are not counted. Use `Object.getOwnPropertySymbols`
 * separately if symbol keys matter for your use case.
 *
 * @param value - The object to check
 * @returns `true` if the object has no own enumerable string-keyed properties, or if `value` is `null`/`undefined`
 * @example
 * isEmpty({})          // => true
 * isEmpty(null)        // => true
 * isEmpty(undefined)   // => true
 * isEmpty({ a: 1 })    // => false
 * isEmpty({ a: undefined }) // => false  (key exists)
 * @since 2.0.3
 */
export function isEmpty(value: Record<PropertyKey, unknown> | null | undefined): boolean {
  return value == null || Object.keys(value).length === 0;
}

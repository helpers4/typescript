/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a plain object has at least one own enumerable string-keyed property.
 *
 * Symbol-keyed properties are not counted. Use `Object.getOwnPropertySymbols`
 * separately if symbol keys matter for your use case.
 *
 * @param value - The object to check
 * @returns `true` if the object has at least one own enumerable string-keyed property
 * @example
 * isNonEmpty({ a: 1 })    // => true
 * isNonEmpty({})          // => false
 * @since 2.0.3
 */
export function isNonEmpty(value: Record<PropertyKey, unknown>): boolean {
  return Object.keys(value).length > 0;
}

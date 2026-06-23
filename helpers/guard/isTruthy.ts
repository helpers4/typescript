/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Falsy } from './isFalsy';

/**
 * Checks if a value is truthy (not `false`, `null`, `undefined`, `0`, `""`, or `NaN`).
 *
 * This is the type-safe alternative to `Boolean()` as a filter callback.
 * Unlike `filter(Boolean)`, using `filter(isTruthy)` correctly narrows the
 * resulting array type by excluding falsy values.
 *
 * @param value - The value to check
 * @returns True if the value is truthy
 * @example
 * isTruthy(1)         // => true
 * isTruthy('hello')   // => true
 * isTruthy(0)         // => false
 * isTruthy(null)      // => false
 *
 * @example
 * // Type-safe alternative to filter(Boolean)
 * const items = ['a', '', null, 'b', undefined];
 * const result = items.filter(isTruthy);
 * // => ['a', 'b'] with type string[]
 *
 * @see {@link isFalsy} for the inverse check
 * @since 2.0.0
 */
export function isTruthy<T>(value: T | Falsy): value is T {
  return !!value;
}

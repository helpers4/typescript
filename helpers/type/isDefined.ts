/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Maybe } from './Maybe';

/**
 * Checks if a value is defined (not undefined nor null).
 * This is the inverse of {@link isNullish}.
 *
 * Use as a type-safe filter callback to remove `null`/`undefined` from arrays.
 *
 * @param value - The value to check
 * @returns True if value is not undefined nor null
 * @example
 * isDefined(42)        // => true
 * isDefined('')        // => true (empty string is defined)
 * isDefined(null)      // => false
 * isDefined(undefined) // => false
 *
 * @example
 * // Type-safe alternative to filter out null/undefined
 * const items: (string | null | undefined)[] = ['a', null, 'b', undefined];
 * const result = items.filter(isDefined);
 * // => ['a', 'b'] with type string[]
 *
 * @see {@link isNullish} for the inverse check
 * @see {@link isTruthy} to also filter out `0`, `""`, `false`, and `NaN`
 * @since 2.0.0
 */
export function isDefined<T>(value: Maybe<T>): value is T {
  return value !== undefined && value !== null;
}

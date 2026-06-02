/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isSpecialObject } from './isSpecialObject';

/**
 * Checks if a value is empty.
 *
 * Supported types:
 * - `null` / `undefined` → empty
 * - `string` → length === 0
 * - `array` → length === 0
 * - `Map` / `Set` → size === 0
 * - plain object → no own enumerable properties
 *
 * @param value - The value to check
 * @returns `true` if the value is considered empty, `false` otherwise.
 * Acts as a type guard: the `else` branch narrows away `null`, `undefined`,
 * empty strings and empty arrays.
 *
 * @example
 * isEmpty('') // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty('foo') // false
 *
 * @example
 * // Type narrowing in else branch
 * declare const v: string | null | undefined;
 * if (isEmpty(v)) { ... } else { v.toUpperCase(); } // OK — null/undefined excluded
 * @since 2.0.0
 */
export function isEmpty(value: unknown): value is null | undefined | '' | never[] {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (typeof value === 'object') {
    if (isSpecialObject(value)) {
      return false;
    }

    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) {
      return false;
    }

    return Object.keys(value as Record<string, unknown>).length === 0;
  }

  return false;
}

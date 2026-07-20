/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isJSONValue } from './isJSONValue';

/**
 * Checks whether a value is an array whose every element is a valid JSON value
 * (see {@link isJSONValue}).
 * @param value - The value to check
 * @returns `true` if value is an array of JSON values
 * @example
 * isJSONArray([1, 'two', null])  // => true
 * isJSONArray([1, undefined])    // => false
 * isJSONArray({})                // => false
 * @since next
 */
export function isJSONArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.every(isJSONValue);
}

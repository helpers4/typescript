/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isJSONValue } from './isJSONValue';
import { isPlainObject } from './isPlainObject';

/**
 * Checks whether a value is a plain object whose every own value is a valid JSON value
 * (see {@link isJSONValue}).
 * @param value - The value to check
 * @returns `true` if value is a plain object of JSON values
 * @example
 * isJSONObject({ a: 1, b: 'two' })  // => true
 * isJSONObject({ a: undefined })    // => false
 * isJSONObject([])                  // => false
 * @since 3.0.3
 */
export function isJSONObject(value: unknown): value is Record<string, unknown> {
  return isPlainObject(value) && Object.values(value).every(isJSONValue);
}

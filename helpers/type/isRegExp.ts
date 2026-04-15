/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a RegExp instance.
 * @param value - The value to check
 * @returns True if value is a RegExp
 * @example
 * isRegExp(/abc/)          // => true
 * isRegExp(new RegExp('a')) // => true
 * isRegExp('abc')          // => false
 * @since 2.0.0
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a function.
 * @param value - The value to check
 * @returns True if value is a function
 * @example
 * isFunction(() => {})       // => true
 * isFunction(function() {})  // => true
 * isFunction('function')     // => false
 * @since 1.9.0
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Wraps a function so that if it throws, a default value is returned instead of propagating the error.
 * Works with both synchronous and asynchronous functions.
 * @param fn - The function to guard
 * @param defaultValue - The value to return if the function throws
 * @returns The result of the function, or the default value on error
 * @example
 * const result = guard(() => JSON.parse('invalid'), {})
 * // => {}
 * @example
 * const result = guard(() => JSON.parse('{"a":1}'), {})
 * // => { a: 1 }
 * @since 2.0.0
 */
export function guard<T>(fn: () => Promise<T>, defaultValue: T): Promise<T>;
export function guard<T>(fn: () => T, defaultValue: T): T;
export function guard<T>(fn: () => T | Promise<T>, defaultValue: T): T | Promise<T> {
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.catch(() => defaultValue);
    }
    return result;
  } catch {
    return defaultValue;
  }
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a Promise or a thenable.
 *
 * Returns `true` for any object that has `.then()` and `.catch()` methods,
 * including native Promises and userland implementations.
 *
 * @param value - The value to check
 * @returns True if value is a Promise-like object
 * @example
 * isPromise(Promise.resolve(42))     // => true
 * isPromise(new Promise(() => {}))   // => true
 * isPromise({ then: () => {} })      // => false (no .catch)
 * isPromise(42)                      // => false
 * @since 2.0.0
 */
export function isPromise(value: unknown): value is Promise<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Promise<unknown>).then === 'function' &&
    typeof (value as Promise<unknown>).catch === 'function'
  );
}

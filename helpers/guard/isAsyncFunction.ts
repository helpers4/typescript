/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is an async function.
 *
 * Returns `true` for any function declared with `async`.
 *
 * @param value - The value to check
 * @returns True if value is an async function
 * @example
 * isAsyncFunction(async () => {})      // => true
 * isAsyncFunction(async function() {}) // => true
 * isAsyncFunction(() => {})            // => false
 * isAsyncFunction(42)                  // => false
 * @since 2.0.0
 */
export function isAsyncFunction(value: unknown): value is (...args: unknown[]) => Promise<unknown> {
  return typeof value === 'function' && value.constructor.name === 'AsyncFunction';
}

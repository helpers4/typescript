/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is an ArrayBuffer instance.
 *
 * Useful for filtering or type-narrowing in a functional pipeline:
 * `values.filter(isArrayBuffer)`
 *
 * @param value - The value to check
 * @returns True if value is an ArrayBuffer
 * @example
 * isArrayBuffer(new ArrayBuffer(8)) // => true
 * isArrayBuffer(new Uint8Array(8))  // => false
 * isArrayBuffer('hello')            // => false
 * @since next
 */
export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer;
}

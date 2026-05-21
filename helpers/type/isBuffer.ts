/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a Node.js Buffer instance.
 *
 * `Buffer` extends `Uint8Array` and is specific to Node.js, Bun, and Deno.
 * In browser-only environments where `Buffer` is not defined, this function
 * always returns `false`.
 *
 * Useful for filtering or type-narrowing in a functional pipeline:
 * `values.filter(isBuffer)`
 *
 * @param value - The value to check
 * @returns True if value is a Buffer
 * @example
 * isBuffer(Buffer.from('hello')) // => true
 * isBuffer(new Uint8Array(8))    // => false
 * isBuffer('hello')              // => false
 * @since 2.0.0
 */
export function isBuffer(value: unknown): value is Buffer {
  return typeof Buffer !== 'undefined' && value instanceof Buffer;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a Blob instance.
 *
 * Useful for filtering or type-narrowing in a functional pipeline:
 * `values.filter(isBlob)`
 *
 * @param value - The value to check
 * @returns True if value is a Blob
 * @example
 * isBlob(new Blob(['hello']))        // => true
 * isBlob(new Blob([], { type: 'application/json' })) // => true
 * isBlob('hello')                    // => false
 * @since next
 */
export function isBlob(value: unknown): value is Blob {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

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
 * **Known limitation:** the declared type is the DOM `Blob`, so a project compiled without the DOM
 * lib (GJS, for example) gets `Cannot find name 'Blob'` from this package's `index.d.ts`. At
 * runtime it is safe everywhere: it returns `false` where `Blob` does not exist. The alternatives
 * are not clearly better, so it is left as is: a structural `BlobLike` type would narrow to that
 * type instead of `Blob` for callers that have the DOM, moving it to `browser` would break
 * existing imports (and `Blob` also exists in Node.js, Deno and Bun), and a polyfill would not fix
 * the compile error. To be reconsidered for v4.
 *
 * @param value - The value to check
 * @returns True if value is a Blob
 * @example
 * isBlob(new Blob(['hello']))        // => true
 * isBlob(new Blob([], { type: 'application/json' })) // => true
 * isBlob('hello')                    // => false
 * @since 2.0.0
 */
export function isBlob(value: unknown): value is Blob {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

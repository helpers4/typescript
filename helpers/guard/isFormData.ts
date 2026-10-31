/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a FormData instance.
 *
 * Useful for filtering or type-narrowing in a functional pipeline:
 * `values.filter(isFormData)`
 *
 * **Known limitation:** the declared type is the DOM `FormData`, so a project compiled without the DOM
 * lib (GJS, for example) gets `Cannot find name 'FormData'` from this package's `index.d.ts`. At
 * runtime it is safe everywhere: it returns `false` where `FormData` does not exist. The alternatives
 * are not clearly better, so it is left as is: a structural `FormDataLike` type would narrow to that
 * type instead of `FormData` for callers that have the DOM, moving it to `browser` would break
 * existing imports (and `FormData` also exists in Node.js, Deno and Bun), and a polyfill would not fix
 * the compile error. To be reconsidered for v4.
 *
 * @param value - The value to check
 * @returns True if value is a FormData
 * @example
 * isFormData(new FormData()) // => true
 * isFormData({})             // => false
 * isFormData(null)           // => false
 * @since 2.0.0
 */
export function isFormData(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}

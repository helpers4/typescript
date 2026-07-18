/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isPlainObject } from '../guard/isPlainObject.js';

function flattenInto(obj: Record<string, unknown>, prefix: string, result: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value) && Object.keys(value).length > 0) {
      flattenInto(value, path, result);
    } else {
      result[path] = value;
    }
  }
}

/**
 * Flattens a nested object into a single-level object whose keys are the
 * dot-notation path to each leaf value. The inverse of {@link unflatten}.
 *
 * Only **plain objects** are recursed into — arrays, `Date`, `Map`, `RegExp`,
 * class instances, and empty plain objects `{}` are kept as opaque leaf
 * values. This keeps `flatten`/`unflatten` a clean, invertible pair: arrays
 * can't be losslessly told apart from plain objects once reduced to dotted
 * keys, so this implementation doesn't attempt it.
 *
 * Caveat shared by every dotted-path flattening scheme: a key that itself
 * contains a literal `.` is indistinguishable from real nesting once
 * flattened (`{ 'a.b': 1 }` and `{ a: { b: 1 } }` both produce `{ 'a.b': 1 }`).
 *
 * @param obj - The object to flatten
 * @returns A single-level object with dot-notation keys
 * @example
 * flatten({ a: { b: { c: 1 }, d: 2 } })
 * // => { 'a.b.c': 1, 'a.d': 2 }
 * @example
 * flatten({ a: [1, 2], b: new Date(0) })
 * // => { a: [1, 2], b: Date }  (arrays and special objects stay as leaves)
 * @since 4.0.0
 */
export function flatten(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  flattenInto(obj, '', result);
  return result;
}

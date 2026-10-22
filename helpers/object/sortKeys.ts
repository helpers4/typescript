/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNSAFE_KEYS } from '../_shared/_unsafeKeys.js';

/**
 * Creates a new object with the same entries as the input, but with its own keys sorted.
 * Shallow only — nested objects are copied as-is, their keys are not re-sorted.
 * Key order matters for things like `JSON.stringify` diffs and snapshot stability; this does
 * not change equality (`{a:1,b:2}` and `{b:2,a:1}` are already equal), just iteration/serialization order.
 * Note: integer-index-like keys (`"0"`, `"1"`, `"42"`...) are always iterated first, in numeric
 * order, by the JS engine itself — no object key ordering can override that language behavior.
 * A prototype-polluting key (`__proto__`, `constructor`, `prototype`) is silently skipped,
 * same as the rest of `@helpers4/object`.
 * @param obj - The object whose keys to sort
 * @param compareFn - Optional custom comparator, passed directly to `Array.prototype.sort`
 * @returns A new object with the same entries, own keys in sorted order
 * @example
 * sortKeys({ b: 2, a: 1, c: 3 })
 * // => { a: 1, b: 2, c: 3 }
 * @since 3.0.3
 */
export function sortKeys<T extends Record<string, unknown>>(
  obj: T,
  compareFn?: (a: string, b: string) => number,
): T {
  const sortedKeys = Object.keys(obj).toSorted(compareFn);
  const result = {} as T;
  for (const key of sortedKeys) {
    if (UNSAFE_KEYS.has(key)) continue;
    result[key as keyof T] = obj[key as keyof T];
  }
  return result;
}

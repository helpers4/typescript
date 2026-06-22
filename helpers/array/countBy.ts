/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNSAFE_KEYS } from './_unsafeKeys.js';
import type { UnsafeKey } from './_unsafeKeys.js';

/**
 * Groups the elements of an array by the key returned by `keyFn` and returns a
 * record mapping each key to the number of matching elements.
 * `null` and `undefined` are treated as empty arrays and return `{}`.
 * Items whose computed key is a prototype-polluting string (`__proto__`,
 * `constructor`, `prototype`) are silently skipped.
 *
 * @param array - The array to count.
 * @param keyFn - A function that returns the grouping key for each element.
 * @returns A `Partial<Record<K, number>>` where each key maps to its element count.
 *   Prototype-polluting keys (`__proto__`, `constructor`, `prototype`) are never present.
 * @example
 * countBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? 'even' : 'odd');
 * // { odd: 3, even: 2 }
 * @example
 * countBy(['foo', 'bar', 'baz', 'qux'], s => s[0]);
 * // { f: 1, b: 2, q: 1 }
 * @since 2.0.0
 */
export function countBy<T, K extends PropertyKey>(
  array: readonly T[] | null | undefined,
  keyFn: (item: T) => K,
): Partial<Record<Exclude<K, UnsafeKey>, number>> {
  const result: Partial<Record<K, number>> = {};
  if (array == null) return result as Partial<Record<Exclude<K, UnsafeKey>, number>>;
  for (const item of array) {
    const key = keyFn(item);
    if (typeof key === 'string' && UNSAFE_KEYS.has(key)) continue;
    result[key] = (result[key] ?? 0) + 1;
  }
  return result as Partial<Record<Exclude<K, UnsafeKey>, number>>;
}

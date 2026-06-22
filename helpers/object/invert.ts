/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNSAFE_KEYS } from './_unsafeKeys.js';

/**
 * Returns a new object with keys and values swapped.
 * If multiple keys share the same value, the last one wins.
 * `null` and `undefined` are treated as empty objects and return `{}`.
 * Entries whose source key **or** value is a prototype-polluting string
 * (`__proto__`, `constructor`, `prototype`) are silently skipped.
 *
 * @param obj - The object whose keys and values are to be swapped
 * @returns A new object with values as keys and original keys as values
 * @example
 * invert({ a: 'x', b: 'y', c: 'z' })
 * // => { x: 'a', y: 'b', z: 'c' }
 *
 * invert({ one: 1, two: 2 })
 * // => { 1: 'one', 2: 'two' }
 *
 * invert(null)
 * // => {}
 * @since 2.0.0
 */
export function invert<K extends string, V extends PropertyKey>(obj: Record<K, V> | null | undefined): Record<V, K> {
  const result = {} as Record<V, K>;
  if (obj == null) return result;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !UNSAFE_KEYS.has(key)) {
      const val = obj[key as K];
      if (typeof val === 'string' && UNSAFE_KEYS.has(val)) continue;
      result[val] = key as unknown as K;
    }
  }
  return result;
}

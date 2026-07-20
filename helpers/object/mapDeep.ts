/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNSAFE_KEYS } from '../_shared/_unsafeKeys.js';
import { isPlainObject } from '../guard/isPlainObject.js';

function transform(
  value: unknown,
  mapValue?: (value: unknown, key: string) => unknown,
  mapKey?: (key: string, value: unknown) => PropertyKey,
): unknown {
  if (Array.isArray(value))
    return value.map((item, index) => {
      const recursed = transform(item, mapValue, mapKey);
      return mapValue ? mapValue(recursed, String(index)) : recursed;
    });
  if (isPlainObject(value)) {
    const result: Record<PropertyKey, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      const newKey = mapKey ? mapKey(key, val) : key;
      if (typeof newKey === 'string' && UNSAFE_KEYS.has(newKey)) continue;
      const recursed = transform(val, mapValue, mapKey);
      result[newKey] = mapValue ? mapValue(recursed, key) : recursed;
    }
    return result;
  }
  return value;
}

/**
 * Recursively transforms the keys and/or values of a plain object — the deep counterpart to
 * {@link map}, which only transforms the top level. Descends into nested plain objects and
 * arrays of them; `Date`, `Map`, `Set`, class instances, and primitives are left untouched
 * (only their position is walked into, matching {@link cloneDeep}'s notion of what counts
 * as a plain-data node worth recursing into).
 *
 * Both callbacks are optional and default to identity (no transformation). `mapKey` is called
 * with the *original* key and value (before any recursive value transform); `mapValue` receives
 * the already-recursed value. Entries whose mapped key is a prototype-polluting string
 * (`__proto__`, `constructor`, `prototype`) are silently skipped, same as {@link map}.
 *
 * Array elements also go through `mapValue` (with their stringified index as `key`, since
 * arrays have no property keys of their own) — so values inside a plain array, not just object
 * properties, get transformed too. `mapKey` is never called for array elements, since there is
 * no key to rename.
 *
 * @param obj - The value to transform (typically an object, or an array of objects)
 * @param mapValue - Callback called with `(value, key)` for each entry's (already-recursed) value.
 *   For array elements, `key` is the element's index as a string. Defaults to identity.
 * @param mapKey - Callback called with `(key, value)` for each object entry. Defaults to identity.
 * @returns A new value with every plain-object key/value transformed
 * @example
 * mapDeep({ a: { b: 1 } }, v => (typeof v === 'number' ? v * 10 : v))
 * // => { a: { b: 10 } }
 * @example
 * mapDeep({ user_name: 'Alice' }, undefined, key => key.toUpperCase())
 * // => { USER_NAME: 'Alice' }
 * @example
 * mapDeep({ tags: [1, 2, 3] }, v => (typeof v === 'number' ? v * 10 : v))
 * // => { tags: [10, 20, 30] }
 * @since next
 */
export function mapDeep<T>(
  obj: T,
  mapValue?: (value: unknown, key: string) => unknown,
  mapKey?: (key: string, value: unknown) => PropertyKey,
): T {
  return transform(obj, mapValue, mapKey) as T;
}

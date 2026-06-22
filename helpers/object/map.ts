/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNSAFE_KEYS } from './_unsafeKeys.js';

/**
 * Transforms the values and/or keys of a plain object in a single pass.
 *
 * Both callbacks are optional and default to identity (no transformation).
 * When `mapValue` is omitted the original values are preserved;
 * when `mapKey` is omitted the original keys are preserved.
 *
 * Note: if two different keys map to the same output key the last one wins
 * (insertion order). Entries whose mapped key is a prototype-polluting string
 * (`__proto__`, `constructor`, `prototype`) are silently skipped.
 *
 * @param obj - The source object
 * @param mapValue - Callback called with `(value, key)` for each entry.
 *   Defaults to identity.
 * @param mapKey - Callback called with `(key, value)` for each entry.
 *   Defaults to identity.
 * @returns A new object with transformed keys and/or values
 * @example
 * map({ a: 1, b: 2 }, v => v * 10)
 * // => { a: 10, b: 20 }
 *
 * map({ a: 1, b: 2 }, undefined, k => k.toUpperCase())
 * // => { A: 1, B: 2 }
 *
 * map({ a: 1, b: 2 }, v => v * 10, k => k.toUpperCase())
 * // => { A: 10, B: 20 }
 * @since 2.0.0
 */
export function map<
  TObj extends Record<string, unknown>,
  TVal = TObj[keyof TObj],
  TKey extends PropertyKey = keyof TObj,
>(
  obj: TObj | null | undefined,
  mapValue?: (value: TObj[keyof TObj], key: keyof TObj) => TVal,
  mapKey?: (key: keyof TObj, value: TObj[keyof TObj]) => TKey
): Record<TKey, TVal> {
  const result = {} as Record<TKey, TVal>;
  if (obj == null) return result;
  for (const key of Object.keys(obj) as (keyof TObj)[]) {
    const value = obj[key];
    const newKey = mapKey ? mapKey(key, value) : (key as unknown as TKey);
    if (typeof newKey === 'string' && UNSAFE_KEYS.has(newKey)) continue;
    const newVal = mapValue ? mapValue(value, key) : (value as unknown as TVal);
    result[newKey] = newVal;
  }
  return result;
}

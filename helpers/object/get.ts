/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parsePath } from './_parsePath.js';
import type { DeepGet } from './_types.js';

/**
 * Gets a value from an object using a dot/bracket-notated path or explicit key array.
 *
 * **Two path forms are supported:**
 *
 * 1. **String path** — dot notation (`'a.b.c'`) and bracket notation (`'layers[1].name'`)
 *    are both accepted and mixed freely. Segments are traversed as string keys; `[n]`
 *    indices become numeric keys.
 *
 * 2. **Key array** (`PropertyKey[]`) — explicit array of `string | number | symbol` keys,
 *    no parsing performed. Enables symbol-keyed traversal and compile-time type inference:
 *    `get(obj, ['a', 'b'] as const)` infers the return type from the path.
 *
 * @param obj - The object to read from
 * @param path - Dot/bracket-notation string or explicit `PropertyKey[]`
 * @param defaultValue - Returned when the path is absent or resolves to `undefined`
 * @returns The value at the path, or `defaultValue`
 * @example
 * get({ a: { b: { c: 42 } } }, 'a.b.c')       // => 42
 * get({ a: [1, 2, 3] }, 'a[1]')                 // => 2
 * get({ a: { b: 0 } }, 'a.b', 99)               // => 0  (falsy values are returned as-is)
 * get({ a: 1 }, 'b.c', 'default')               // => 'default'
 *
 * const id = Symbol('id')
 * get({ [id]: 'alice' }, [id])                  // => 'alice'  (symbol key)
 * @since 1.9.0
 */
export function get<T = unknown>(obj: unknown, path: string, defaultValue?: T): T | undefined;
export function get<T extends object, const Path extends readonly PropertyKey[]>(
  obj: T,
  path: Path,
  defaultValue?: DeepGet<T, Path>,
): DeepGet<T, Path> | undefined;
export function get(obj: unknown, path: string | PropertyKey[], defaultValue?: unknown): unknown {
  const keys: readonly PropertyKey[] = typeof path === 'string' ? parsePath(path) : path;
  let result: unknown = obj;

  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = (result as Record<PropertyKey, unknown>)[key];
  }

  return result !== undefined ? result : defaultValue;
}

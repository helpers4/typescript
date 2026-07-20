/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { walkPropertyPath } from '../_shared/_walkPropertyPath.js';
import { parsePropertyPath } from './parsePropertyPath.js';
import type { DeepGet, ParsePath } from './_types.js';

/**
 * Gets a value from an object using a dot/bracket-notated path or explicit key array.
 *
 * **Two path forms are supported:**
 *
 * 1. **String path** — dot notation (`'a.b.c'`) and bracket notation (`'layers[1].name'`)
 *    are both accepted and mixed freely.
 *    - Dot segments are always string keys: `'a.1'` → key `'1'` (string).
 *    - Bracket segments are always number keys: `'a[1]'` → key `1` (number).
 *    - String literal paths give **full compile-time type inference** on the return type.
 *    - Dynamic (non-literal) strings return `unknown`.
 *
 * 2. **Key array** (`PropertyKey[]`) — explicit array of `string | number | symbol` keys,
 *    no parsing performed. Enables symbol-keyed traversal and compile-time type inference:
 *    `get(obj, ['a', 'b'] as const)` infers the return type from the path.
 *
 * Both forms support **all objects** (plain objects, arrays, class instances).
 * Symbol keys are only reachable via the key-array form.
 *
 * @param obj - The object to read from
 * @param path - Dot/bracket-notation string literal or explicit `PropertyKey[]`
 * @param defaultValue - Returned when the path is absent or resolves to `undefined`
 * @returns The value at the path, or `defaultValue`
 * @example
 * get({ a: { b: { c: 42 } } }, 'a.b.c')       // => 42   (inferred: number | undefined)
 * get({ layers: [{ name: 'bg' }] }, 'layers[0].name')  // => 'bg'  (inferred: string | undefined)
 * get({ a: { b: 0 } }, 'a.b', 99)               // => 0  (falsy values returned as-is)
 * get({ a: 1 }, 'b.c', 'default')               // => 'default'
 *
 * const id = Symbol('id')
 * get({ [id]: 'alice' }, [id])                  // => 'alice'  (symbol key, inferred: string | undefined)
 * @since 1.9.0
 */
export function get<D>(obj: null | undefined, path: string | readonly PropertyKey[], defaultValue: D): D;
export function get(obj: null | undefined, path: string | readonly PropertyKey[]): undefined;
export function get<T extends object, const P extends string | readonly PropertyKey[]>(
  obj: T | null | undefined,
  path: P,
  defaultValue?: DeepGet<T, ParsePath<P>>,
): DeepGet<T, ParsePath<P>> | undefined;
export function get(obj: unknown, path: string | readonly PropertyKey[], defaultValue?: unknown): unknown {
  if (obj == null) return defaultValue;
  const keys: readonly PropertyKey[] = typeof path === 'string' ? parsePropertyPath(path) : path;
  const result = walkPropertyPath(obj, keys);
  return result !== undefined ? result : defaultValue;
}

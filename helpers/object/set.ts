/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parsePath } from './_parsePath.js';
import type { ContainsUnsafeStringKey, DeepGet, DeepSet, ParsePath } from './_types.js';
import { UNSAFE_KEYS } from '../_shared/_unsafeKeys.js';

/**
 * Sets a value in an object at the given path, creating intermediate objects as needed.
 *
 * **Two path forms are supported:**
 *
 * 1. **String path** — dot notation and bracket notation, mixed freely.
 *    - Dot segments are always string keys: `'layers.1.name'` → keys `['layers', '1', 'name']`.
 *    - Bracket segments are always number keys: `'layers[1].name'` → keys `['layers', 1, 'name']`.
 *    - String literal paths give **full compile-time type inference** on the return type.
 *    - Dynamic (non-literal) strings return `T` (same object type).
 *
 * 2. **Key array** (`PropertyKey[]`) — explicit array of `string | number | symbol` keys,
 *    no parsing performed. Enables symbol-keyed access and precise return-type inference.
 *
 * Both forms support **all objects** (plain objects, arrays, class instances).
 * Symbol keys are only reachable via the key-array form.
 *
 * Intermediate nodes that are absent, `null`, or not an object are replaced with `{}`.
 * Any path containing a string segment equal to `__proto__`, `constructor`, or `prototype`
 * is rejected and the original object is returned unchanged (prototype-pollution guard).
 *
 * @param obj - The object to mutate
 * @param path - Dot/bracket-notation string literal or explicit `PropertyKey[]`
 * @param value - Value to assign at the path
 * @returns The mutated object (same reference, narrowed type)
 * @example
 * // Dot notation — "1" stays a string key
 * set({}, 'a.b.c', 42)
 * // => { a: { b: { c: 42 } } }
 *
 * // Bracket notation — [1] becomes a number key
 * set({ layers: [{}, { name: 'old' }] }, 'layers[1].name', 'bg')
 * // => { layers: [{}, { name: 'bg' }] }
 *
 * // Key array — supports symbols
 * const id = Symbol('id')
 * set({}, ['user', id], 'alice')
 * // => { user: { [id]: 'alice' } }
 * @since 1.9.0
 */
export function set<
  T extends object,
  const P extends string | readonly PropertyKey[],
  V extends DeepGet<T, ParsePath<P>>,
>(
  obj: T,
  path: P,
  value: V,
): string extends P ? T : readonly PropertyKey[] extends P ? T : ContainsUnsafeStringKey<ParsePath<P>> extends true ? T : DeepSet<T, ParsePath<P>, V>;
export function set(obj: object, path: string | PropertyKey[], value: unknown): object {
  const keys: readonly PropertyKey[] = typeof path === 'string' ? parsePath(path) : path;

  if (keys.length === 0) return obj;
  if (keys.some((k) => typeof k === 'string' && UNSAFE_KEYS.has(k))) return obj;

  let current = obj as Record<PropertyKey, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Object.hasOwn (not `key in current`) is intentional: `in` checks the prototype chain,
    // which would silently traverse into — and potentially mutate — an inherited object.
    // Using hasOwn ensures we only follow own properties; inherited intermediate nodes are
    // shadowed with a fresh own `{}` instead of being followed into the prototype.
    if (!Object.hasOwn(current, key) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }

    current = current[key] as Record<PropertyKey, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return obj;
}

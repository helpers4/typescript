/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNSAFE_KEYS } from '../_shared/_unsafeKeys.js';

/**
 * Creates a shallow copy of a value — one level deep, unlike {@link cloneDeep}.
 *
 * Unlike a plain `{ ...value }` spread, this correctly reconstructs `Date`,
 * `Map`, `Set`, and arrays instead of producing an empty (or wrong-shaped)
 * plain object for them. Primitives are returned as-is. Any other object
 * (including class instances not listed above) has its own enumerable string
 * keys shallow-copied into a plain object — the same fallback `cloneDeep`
 * uses, so the two stay consistent for types neither one special-cases.
 *
 * @param value - The value to shallow-clone
 * @returns A shallow copy of `value`
 * @example
 * clone({ a: { b: 1 } })
 * // => { a: { b: 1 } } — new object, but `a` is the *same* nested reference
 * @example
 * clone(new Date('2024-01-01')) // => new Date with the same timestamp
 * clone(new Map([['a', 1]]))    // => new Map with the same entries
 * clone([1, 2, 3])              // => new array, same elements
 * @since 4.0.0
 */
export function clone<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value instanceof Map) return new Map(value) as T;
  if (value instanceof Set) return new Set(value) as T;
  if (Array.isArray(value)) return [...value] as T;

  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    if (!UNSAFE_KEYS.has(key)) {
      result[key] = (value as Record<string, unknown>)[key];
    }
  }
  return result as T;
}

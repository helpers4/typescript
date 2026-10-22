/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNSAFE_KEYS } from '../_shared/_unsafeKeys.js';

/**
 * Creates a deep copy of an object or array.
 *
 * Recursively clones own enumerable string keys. `Date` instances are
 * reconstructed with the same epoch value. Prototype-polluting keys
 * (`__proto__`, `constructor`, `prototype`) are silently skipped.
 * Does **not** handle circular references.
 *
 * **Limitation:** symbol-keyed own properties are **not** copied — only string
 * keys are processed. Use `structuredClone` if symbol propagation is required.
 *
 * @param obj - The value to clone
 * @returns A deep copy of `obj`
 * @example
 * cloneDeep({ a: { b: [1, 2] } })
 * // => { a: { b: [1, 2] } }  — fully independent copy
 *
 * cloneDeep(new Date('2024-01-01'))
 * // => Date with the same timestamp
 *
 * // Primitives pass through unchanged
 * cloneDeep(42)   // => 42
 * cloneDeep(null) // => null
 * @since 1.9.0
 */
export function cloneDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cloneDeep(item)) as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !UNSAFE_KEYS.has(key)) {
      cloned[key] = cloneDeep(obj[key]);
    }
  }

  return cloned;
}

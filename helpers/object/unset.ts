/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parsePropertyPath } from './parsePropertyPath.js';
import { UNSAFE_KEYS } from '../_shared/_unsafeKeys.js';

/**
 * Removes the value at a dot/bracket-notation path or explicit key array,
 * mutating the object in place. Uses the same path syntax as {@link get}/{@link set}.
 *
 * A missing intermediate segment is a no-op (nothing to remove), not an error.
 * As with `set`, any path containing a string segment equal to `__proto__`,
 * `constructor`, or `prototype` is rejected and the object is returned unchanged.
 *
 * The removed key stops appearing in `Object.keys`/`for...in` — unlike setting
 * it to `undefined`, which would keep the key present.
 *
 * @param obj - The object to mutate
 * @param path - Dot/bracket-notation string, or explicit `PropertyKey[]`
 * @returns The same object reference, with the key removed if it existed
 * @example
 * unset({ a: { b: 1, c: 2 } }, 'a.b')
 * // => { a: { c: 2 } }
 * @example
 * unset({ a: 1 }, 'x.y') // path doesn't exist — no-op
 * // => { a: 1 }
 * @since 3.0.0
 */
export function unset<T extends object>(obj: T, path: string | readonly PropertyKey[]): T {
  const keys: readonly PropertyKey[] = typeof path === 'string' ? parsePropertyPath(path) : path;

  if (keys.length === 0) return obj;
  if (keys.some((key) => typeof key === 'string' && UNSAFE_KEYS.has(key))) return obj;

  let current: unknown = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current == null || typeof current !== 'object') return obj;
    current = (current as Record<PropertyKey, unknown>)[keys[i]];
  }

  if (current != null && typeof current === 'object') {
    delete (current as Record<PropertyKey, unknown>)[keys[keys.length - 1]];
  }

  return obj;
}

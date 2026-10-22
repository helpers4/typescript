/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Walks a value through a sequence of keys, returning the resolved value or `undefined` if any
 * step along the way is missing or not an object. Pure traversal only — string-path parsing
 * (`'a.b.c'` → keys) and default-value substitution are the caller's job.
 *
 * Shared by `object/get.ts` and any `*By`-style accessor elsewhere that needs the same
 * "resolve a path against a value" runtime behavior — kept dependency-free (per the `_shared/`
 * convention) so it can be used from any category without adding a cross-category import for
 * this specific piece.
 * @ignore
 */
export function walkPropertyPath(value: unknown, keys: readonly PropertyKey[]): unknown {
  let result = value;
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return undefined;
    }
    result = (result as Record<PropertyKey, unknown>)[key];
  }
  return result;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { equalsShallow } from '../object/equalsShallow';
import { isArray } from '../type/isArray';
import { isPlainObject } from '../type/isPlainObject';

/**
 * Order-independent (set-style) array equality.
 *
 * Two arrays are considered equal when they have the same length and every
 * element of `arr1` has at least one structural match in `arr2` (and vice
 * versa via the length check). Nested arrays are compared recursively with
 * the same order-independent semantics. Nested plain objects are compared
 * with {@link equalsShallow} from `object/`. All other values use strict
 * equality (`===`).
 *
 * Use this when the inputs represent unordered collections (sets, tags…).
 * For positional equality use {@link equalsShallow} or {@link equalsDeep}
 * from this category.
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns `true` if both arrays contain the same items regardless of order, `false` otherwise.
 * @since 2.0.0
 */
export function equalsUnordered<T>(arr1: readonly T[], arr2: readonly T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const used: boolean[] = arr2.map(() => false);
  return arr1.every((v1) => {
    const idx = arr2.findIndex((v2, i) => {
      if (used[i]) return false;
      if (isArray(v1) && isArray(v2)) return equalsUnordered(v1 as unknown[], v2 as unknown[]);
      if (isPlainObject(v1) && isPlainObject(v2)) return equalsShallow(v1 as object, v2 as object);
      return v1 === v2;
    });
    if (idx === -1) return false;
    used[idx] = true;
    return true;
  });
}

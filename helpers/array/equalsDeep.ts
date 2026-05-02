/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isPlainObject } from '../type/isPlainObject';

/**
 * Recursive structural array equality.
 *
 * Two arrays are equal when they have the same length and each pair of
 * elements at the same index is structurally equal:
 * - Arrays recurse with `equalsDeep`.
 * - Plain objects recurse key-by-key with structural comparison.
 * - `Date` instances are compared by their epoch value.
 * - All other values use strict equality (`===`), which means `NaN !== NaN`
 *   and special objects (Map, Set, RegExp, Promise, class instances\u2026) are
 *   compared by reference.
 *
 * For positional one-level comparison use {@link equalsShallow}. For
 * order-independent comparison use {@link equalsUnordered}.
 *
 * @param arrA - First array to compare
 * @param arrB - Second array to compare
 * @returns `true` if arrays are deeply equal, `false` otherwise.
 * @since 2.0.0
 */
export function equalsDeep<T>(arrA: readonly T[], arrB: readonly T[]): boolean {
  if (arrA === arrB) {
    return true;
  }
  if (!Array.isArray(arrA) || !Array.isArray(arrB)) {
    return false;
  }
  if (arrA.length !== arrB.length) {
    return false;
  }
  for (let i = 0; i < arrA.length; i++) {
    if (!valuesEqual(arrA[i], arrB[i])) {
      return false;
    }
  }
  return true;
}

function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return equalsDeep(a, b);
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const ao = a as Record<string, unknown>;
    const bo = b as Record<string, unknown>;
    const keysA = Object.keys(ao);
    if (keysA.length !== Object.keys(bo).length) {
      return false;
    }
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(bo, key)) {
        return false;
      }
      if (!valuesEqual(ao[key], bo[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

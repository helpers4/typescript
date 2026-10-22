/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Positional, one-level (shallow) array equality.
 *
 * Two arrays are equal when they have the same length and each pair of
 * elements at the same index satisfies strict equality (`===`). No
 * recursion: nested arrays/objects are compared by reference.
 *
 * For recursive structural comparison use {@link equalsDeep}. For
 * order-independent comparison use {@link equalsUnordered}.
 *
 * @param arrA - First array to compare
 * @param arrB - Second array to compare
 * @returns `true` if every element matches by `===` at the same index, `false` otherwise.
 * @since 2.0.0
 */
export function equalsShallow<T>(arrA: readonly T[], arrB: readonly T[]): boolean {
  if (arrA === arrB) {
    return true;
  }
  if (arrA.length !== arrB.length) {
    return false;
  }
  for (let i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }
  return true;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns a new array with all occurrences of the given values removed.
 *
 * Unlike `difference`, which operates on two arrays as set operands, `without`
 * uses a variadic API suited for removing known sentinel values inline.
 * Uses `SameValueZero` equality (same as `Array.prototype.includes`).
 *
 * @param array - The source array.
 * @param values - One or more values to exclude from the result.
 * @returns A new array without the specified values.
 * @example
 * without([1, 2, 3, 2, 4], 2);       // [1, 3, 4]
 * without([1, 2, 3, 2, 4], 2, 3);    // [1, 4]
 * without(['a', 'b', 'c'], 'b');      // ['a', 'c']
 * @since 2.0.0
 */
export function without<T>(array: readonly T[], ...values: T[]): T[] {
  const excluded = new Set(values);
  return array.filter((item) => !excluded.has(item));
}

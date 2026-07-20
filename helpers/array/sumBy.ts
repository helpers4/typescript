/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { toByAccessorFn } from './_byAccessor.js';
import type { ByAccessor } from './_byAccessor.js';

/**
 * Calculates the sum of numbers derived from each item of an array via an iteratee.
 * `null` and `undefined` are treated as empty arrays and return `0`.
 * @param array - The array of items to sum
 * @param accessor - Function deriving a number from each item, or a property path
 * @returns The sum of all derived values, or `0` for an empty array, `null`, or `undefined`
 * @example
 * sumBy([{ price: 10 }, { price: 20 }], item => item.price)
 * // => 30
 * sumBy([{ price: 10 }, { price: 20 }], 'price')
 * // => 30
 * @since next
 */
export function sumBy<T>(array: readonly T[] | null | undefined, accessor: ByAccessor<T>): number {
  if (array == null) return 0;
  const fn = toByAccessorFn(accessor);
  return array.reduce((acc, item) => acc + fn(item), 0);
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { ByAccessor } from './_byAccessor.js';
import { sumBy } from './sumBy.js';

/**
 * Calculates the arithmetic mean of numbers derived from each item of an array via an iteratee.
 * Returns `NaN` for an empty array, `null`, or `undefined` — matching {@link sumBy}, which
 * treats `null`/`undefined` as empty rather than throwing.
 *
 * Pairs with {@link sumBy} for aggregate operations.
 *
 * @param array - The array of items to average
 * @param accessor - Function deriving a number from each item, or a property path
 * @returns The arithmetic mean of the derived values, or `NaN` if the array is empty, `null`, or `undefined`
 * @example
 * meanBy([{ price: 10 }, { price: 20 }], item => item.price)
 * // => 15
 * meanBy([{ price: 10 }, { price: 20 }], 'price')
 * // => 15
 * meanBy(null, item => item.price)
 * // => NaN
 * @since 3.0.3
 */
export function meanBy<T>(array: readonly T[] | null | undefined, accessor: ByAccessor<T>): number {
  const length = array?.length ?? 0;
  if (length === 0) return NaN;
  return sumBy(array, accessor) / length;
}

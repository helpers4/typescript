/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns the first non-`undefined` result of mapping `fn` over `array`, short-circuiting as
 * soon as one is found. Similar to `array.map(fn).find(v => v !== undefined)`, but doesn't map
 * (or call `fn` on) the remaining items once a match is found.
 *
 * `null` and `undefined` are treated as empty arrays and return `undefined`.
 * @param array - The array to search
 * @param fn - Maps each item (and its index) to a result, or `undefined` to keep looking
 * @returns The first non-`undefined` result of `fn`, or `undefined` if none was found
 * @example
 * findMap([1, 2, 3, 4], n => (n % 2 === 0 ? n * 10 : undefined))
 * // => 20
 * @example
 * findMap([], (n: number) => n)
 * // => undefined
 * @since 3.1.1
 */
export function findMap<T, R>(
  array: readonly T[] | null | undefined,
  fn: (item: T, index: number) => R | undefined,
): R | undefined {
  if (array == null) return undefined;
  for (let i = 0; i < array.length; i++) {
    const result = fn(array[i], i);
    if (result !== undefined) return result;
  }
  return undefined;
}

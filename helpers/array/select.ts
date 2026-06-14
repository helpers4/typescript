/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Filters and transforms an array in a single pass.
 *
 * Equivalent to `.filter(condition).map(mapper)` but only iterates the array once,
 * making it more efficient for large arrays or expensive conditions.
 *
 * @param array - The array to process
 * @param mapper - Transforms each item that passes the condition
 * @param condition - Determines which items to include; defaults to keeping all items
 * @returns Mapped values for items that pass the condition
 * @example
 * // Keep only even numbers and double them
 * select([1, 2, 3, 4, 5], x => x * 2, x => x % 2 === 0)
 * // => [4, 8]
 *
 * @example
 * // Extract active users' emails
 * select(users, u => u.email, u => u.isActive)
 * // => ['alice@example.com', 'bob@example.com']
 *
 * @example
 * // Without condition — equivalent to .map()
 * select([1, 2, 3], x => x * 10)
 * // => [10, 20, 30]
 * @since next
 */
export function select<T, U>(
  array: readonly T[],
  mapper: (item: T, index: number) => U,
  condition: (item: T, index: number) => boolean = () => true,
): U[] {
  const result: U[] = [];
  for (let i = 0; i < array.length; i++) {
    if (condition(array[i], i)) {
      result.push(mapper(array[i], i));
    }
  }
  return result;
}

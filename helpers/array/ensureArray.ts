/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Wraps a value in an array if it is not already one.
 * If the value is already an array, it is returned as-is.
 * If the value is null or undefined, returns an empty array.
 * When a depth is specified, the resulting array is flattened
 * to that depth (like `Array.prototype.flat(depth)`).
 * @param value - The value to ensure is an array
 * @param depth - Optional depth to flatten the resulting array (default: no flattening)
 * @returns The value wrapped in an array, or the value itself if already an array
 * @example
 * ensureArray('hello')
 * // => ['hello']
 * @example
 * ensureArray([1, 2, 3])
 * // => [1, 2, 3]
 * @example
 * ensureArray(null)
 * // => []
 * @example
 * ensureArray([[1, [2, 3]], [4]], 1)
 * // => [1, [2, 3], 4]
 * @since 2.0.0
 */
export function ensureArray<T>(value: T | readonly T[] | null | undefined, depth?: number): T[] {
  if (value === null || value === undefined) return [];
  const arr = Array.isArray(value) ? (value as T[]) : [value] as T[];
  return depth !== undefined ? (arr as unknown[]).flat(depth) as T[] : arr;
}

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
 * @since 2.0.0
 */
export function ensureArray<T>(value: T | readonly T[] | null | undefined): T[];
/**
 * Wraps a value in an array if it is not already one, then flattens to the given depth.
 * If the value is null or undefined, returns an empty array.
 * @param value - The value to ensure is an array
 * @param depth - Depth to flatten the resulting array
 * @returns The flattened array (element types may differ from `T` due to flattening)
 * @example
 * ensureArray([[1, [2, 3]], [4]], 1)
 * // => [1, [2, 3], 4]
 * @since 2.0.0
 */
export function ensureArray<T>(value: T | readonly T[] | null | undefined, depth: number): unknown[];
export function ensureArray<T>(value: T | readonly T[] | null | undefined, depth?: number): unknown[] {
  if (value === null || value === undefined) return [];
  const arr: unknown[] = Array.isArray(value) ? value : [value];
  return depth !== undefined ? arr.flat(depth) : arr;
}

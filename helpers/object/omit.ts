/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a new object without the specified keys.
 * @param obj - The source object
 * @param keys - The keys to omit
 * @returns A new object without the omitted keys
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b'])
 * // => { a: 1, c: 3 }
 * @since 2.0.0
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K>;
export function omit(obj: undefined, keys: readonly string[]): undefined;
export function omit(obj: null, keys: readonly string[]): null;
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T | undefined | null,
  keys: readonly K[]
): Omit<T, K> | undefined | null {
  if (obj === undefined || obj === null) return obj;
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

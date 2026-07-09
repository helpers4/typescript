/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNSAFE_KEYS } from '../_shared/_unsafeKeys.js';

/**
 * Creates a new object with only the specified keys.
 * Keys that are prototype-polluting strings (`__proto__`, `constructor`, `prototype`) are
 * silently skipped.
 * @param obj - The source object
 * @param keys - The keys to pick
 * @returns A new object with only the picked keys
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])
 * // => { a: 1, c: 3 }
 * @since 2.0.0
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>;
export function pick(obj: undefined, keys: readonly string[]): undefined;
export function pick(obj: null, keys: readonly string[]): null;
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T | undefined | null,
  keys: readonly K[]
): Pick<T, K> | undefined | null {
  if (obj === undefined || obj === null) return obj;
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (typeof key === 'string' && UNSAFE_KEYS.has(key)) continue;
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Removes all entries with falsy values (`false`, `null`, `undefined`, `0`, `""`, `NaN`) from an object.
 * @param obj - The source object
 * @returns A new object containing only entries with truthy values
 * @example
 * compact({ a: 1, b: null, c: '', d: 0, e: 'hello' })
 * // => { a: 1, e: 'hello' }
 * @since 2.0.0
 */
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T>;
export function compact(obj: undefined): undefined;
export function compact(obj: null): null;
export function compact<T extends Record<string, unknown>>(obj: T | undefined | null): Partial<T> | undefined | null {
  if (obj === undefined || obj === null) return obj;
  const result: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key]) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isNullish } from '../guard/isNullish';

/**
 * Remove null and undefined values from an object.
 *
 * @param obj an object
 * @returns A shallow copy of the object without null or undefined values
 * @since 1.0.0
 */
export function removeUndefinedNull<T extends Record<string, string | number | boolean | null | undefined>>(obj: T): Partial<T>;

/**
 * Remove null and undefined values from an object.
 *
 * @param obj a null object
 * @returns null
 * @since 1.0.0
 */
export function removeUndefinedNull(obj: null): null;

/**
 * Remove null and undefined values from an object.
 *
 * @param obj an undefined object
 * @returns undefined
 * @since 1.0.0
 */
export function removeUndefinedNull(obj: undefined): undefined;

/**
 * Remove null and undefined values from an object.
 *
 * @param obj an object
 * @returns A shallow copy of the object without null or undefined values
 * @since 1.0.0
 */
export function removeUndefinedNull<T extends Record<string, string | number | boolean | null | undefined>>(obj: T | null | undefined): Partial<T> | null | undefined {
  if (!obj) return obj;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (!isNullish(v)) { result[k] = v; }
  }
  return result as Partial<T>;
}


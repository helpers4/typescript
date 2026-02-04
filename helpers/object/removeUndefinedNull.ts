/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { isNullish } from "radashi";

/**
 * Remove null and undefined values from an object.
 *
 * @param obj an object
 * @returns A shallow copy of the object without null or undefined values
 */
export function removeUndefinedNull<T extends Record<string, string | number | boolean | null | undefined>>(obj: T): Partial<T>;

/**
 * Remove null and undefined values from an object.
 *
 * @param obj a null object
 * @returns null
 */
export function removeUndefinedNull(obj: null): null;

/**
 * Remove null and undefined values from an object.
 *
 * @param obj an undefined object
 * @returns undefined
 */
export function removeUndefinedNull(obj: undefined): undefined;

/**
 * Remove null and undefined values from an object.
 *
 * @param obj an object
 * @returns A shallow copy of the object without null or undefined values
 */
export function removeUndefinedNull<T extends Record<string, string | number | boolean | null | undefined>>(obj: T | null | undefined): Partial<T> | null | undefined {
  return obj ? Object.entries(obj)
    .filter(([_, v]) => !isNullish(v))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as Partial<T>) : obj;
}


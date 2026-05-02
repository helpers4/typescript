/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { equalsDeep as arrayDeepEquals } from '../array/equalsDeep';
import { compare as compareDate } from '../date/compare';
import { isSpecialObject } from '../type/isSpecialObject';

/**
 * Per-key diff result. Each entry tells what differs between the two
 * objects:
 * - `"onlyA"` \u2014 the key exists only on the first input.
 * - `"onlyB"` \u2014 the key exists only on the second input.
 * - `false`  \u2014 both inputs have the key but the values differ.
 * - nested `DiffResult` \u2014 plain-object values that differ deeper.
 *
 * @since 2.0.0
 */
export interface DiffResult {
  [key: string]: 'onlyA' | 'onlyB' | false | DiffResult;
}

/**
 * Options for {@link diff}.
 * @since 2.0.0
 */
export interface DiffOptions {
  /**
   * Maximum recursion depth for nested plain objects. Defaults to
   * `Infinity` (full structural diff).
   *
   * - `0` compares values at the top-level only with strict equality.
   * - `1` compares the first level of nested objects with strict equality.
   * - `Infinity` recurses through every plain-object level.
   *
   * Arrays, `Date` and special objects (Map, Set, RegExp\u2026) are always
   * leaf-compared (via {@link arrayDeepEquals}, epoch comparison, or
   * reference equality respectively) regardless of `depth`.
   */
  depth?: number;
}

/**
 * Structural object diff.
 *
 * Returns `true` when both inputs are deeply equal, otherwise a
 * {@link DiffResult} describing the differences key by key.
 *
 * Comparison rules:
 * - Same reference \u2192 `true`.
 * - Either side is `null`/`undefined` (and not both) \u2192 `false`.
 * - Both `Date` \u2192 epoch comparison.
 * - Both arrays \u2192 compared with `array/equalsDeep` (leaf, no diff drill-down).
 * - Special objects (Map, Set, RegExp, Promise, class instances\u2026) \u2192 reference equality.
 * - Plain objects \u2192 key-by-key, recursing up to `options.depth` levels.
 * - Mixed types (e.g. array vs object, Date vs object) \u2192 `false`.
 *
 * For a boolean wrapper see {@link equalsDeep} from this category.
 * For a one-level boolean check see {@link equalsShallow} from this category.
 *
 * @param objA - First value (object, `null`, or `undefined`).
 * @param objB - Second value (object, `null`, or `undefined`).
 * @param options - See {@link DiffOptions}.
 * @returns `true` when equal, otherwise a {@link DiffResult}, or `false` for incompatible types.
 * @since 2.0.0
 */
export function diff(
  objA: object | undefined | null,
  objB: object | undefined | null,
  options: DiffOptions = {},
): true | false | DiffResult {
  const depth = options.depth ?? Infinity;

  // Quick reference equality check
  if (objA === objB) {
    return true;
  }

  // Handle null/undefined cases
  if (objA == null || objB == null) {
    return false;
  }

  // Handle Date objects
  if (objA instanceof Date && objB instanceof Date) {
    return compareDate(objA, objB);
  }

  // Handle Arrays at root level
  if (Array.isArray(objA) && Array.isArray(objB)) {
    return arrayDeepEquals(objA, objB);
  }
  if (Array.isArray(objA) || Array.isArray(objB)) {
    return false;
  }

  // Handle special objects - compare by reference only
  if (isSpecialObject(objA) || isSpecialObject(objB)) {
    return objA === objB;
  }

  // Plain object detailed comparison
  return diffPlainObjects(objA, objB, depth);
}

function diffPlainObjects(
  objA: object,
  objB: object,
  depth: number,
): true | DiffResult {
  const keys = Array.from(new Set([...Object.keys(objA), ...Object.keys(objB)]));
  const differences: DiffResult = Object.create(null) as DiffResult;

  for (const key of keys) {
    const hasA = Object.prototype.hasOwnProperty.call(objA, key);
    const hasB = Object.prototype.hasOwnProperty.call(objB, key);

    if (!hasA && hasB) {
      differences[key] = 'onlyB';
      continue;
    }
    if (hasA && !hasB) {
      differences[key] = 'onlyA';
      continue;
    }

    const valueA = (objA as Record<string, unknown>)[key];
    const valueB = (objB as Record<string, unknown>)[key];

    if (valueA === valueB) {
      continue;
    }

    if (Array.isArray(valueA) && Array.isArray(valueB)) {
      if (!arrayDeepEquals(valueA, valueB)) {
        differences[key] = false;
      }
      continue;
    }
    if (Array.isArray(valueA) || Array.isArray(valueB)) {
      differences[key] = false;
      continue;
    }

    if (valueA instanceof Date && valueB instanceof Date) {
      if (!compareDate(valueA, valueB)) {
        differences[key] = false;
      }
      continue;
    }
    if (valueA instanceof Date || valueB instanceof Date) {
      differences[key] = false;
      continue;
    }

    if (isSpecialObject(valueA) || isSpecialObject(valueB)) {
      // valueA === valueB already handled above, so any special-object pair
      // that reaches here must differ.
      differences[key] = false;
      continue;
    }

    const bothPlainObjects =
      valueA !== null && valueB !== null &&
      typeof valueA === 'object' && typeof valueB === 'object';

    if (!bothPlainObjects) {
      differences[key] = false;
      continue;
    }

    if (depth <= 0) {
      // depth budget exhausted \u2192 strict-equal nested objects only match by reference
      differences[key] = false;
      continue;
    }

    const nested = diffPlainObjects(valueA as object, valueB as object, depth - 1);
    if (nested !== true) {
      differences[key] = nested;
    }
  }

  return Object.keys(differences).length > 0 ? differences : true;
}

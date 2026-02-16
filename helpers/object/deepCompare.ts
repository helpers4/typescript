/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { quickCompare as quickCompareArray } from '../array/quickCompare';
import { compare as compareDate } from '../date/compare';
import { isSpecialObject } from '../type/isSpecialObject';

/**
 * Result type for deep comparison when objects are not identical
 */
export interface DeepCompareResult {
  [key: string]: "onlyA" | "onlyB" | false | DeepCompareResult;
}

/**
 * Deep comparison of two objects that returns detailed information about differences.
 * 
 * @param objA - First object to compare (can be object, undefined, or null)
 * @param objB - Second object to compare (can be object, undefined, or null)
 * @returns `true` if objects are identical, `false` if incompatible types, or a `DeepCompareResult` object detailing differences
 */
export function deepCompare(objA: object | undefined | null, objB: object | undefined | null): true | false | DeepCompareResult {
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

  // Handle Arrays at root level - use quickCompare
  if (Array.isArray(objA) && Array.isArray(objB)) {
    return quickCompareArray(objA, objB);
  }

  // If one is array and other is not
  if (Array.isArray(objA) || Array.isArray(objB)) {
    return false;
  }

  // Handle special objects - compare by reference only
  if (isSpecialObject(objA) || isSpecialObject(objB)) {
    return objA === objB;
  }

  // Handle objects - detailed comparison
  const keys = Array.from(new Set([...Object.keys(objA), ...Object.keys(objB)]));

  const differences: DeepCompareResult = {};

  for (const key of keys) {
    const hasA = key in objA;
    const hasB = key in objB;

    if (!hasA && hasB) {
      differences[key] = "onlyB";
    } else if (hasA && !hasB) {
      differences[key] = "onlyA";
    } else {
      // Both objects have this key - compare values
      const valueA = (objA as any)[key];
      const valueB = (objB as any)[key];

      // For arrays, use quickCompare
      if (Array.isArray(valueA) && Array.isArray(valueB)) {
        if (!quickCompareArray(valueA, valueB)) {
          differences[key] = false;
        }
      }
      // For dates, use compareDate
      else if (valueA instanceof Date && valueB instanceof Date) {
        if (!compareDate(valueA, valueB)) {
          differences[key] = false;
        }
      }
      // For special objects, compare by reference only
      else if (isSpecialObject(valueA) || isSpecialObject(valueB)) {
        if (valueA !== valueB) {
          differences[key] = false;
        }
      }
      // For objects, recurse (only plain objects now)
      else if (
        valueA !== null && valueB !== null &&
        valueA !== undefined && valueB !== undefined &&
        typeof valueA === 'object' && typeof valueB === 'object' &&
        !isSpecialObject(valueA) && !isSpecialObject(valueB)
      ) {
        const nestedResult = deepCompare(valueA, valueB);
        if (nestedResult !== true) {
          differences[key] = nestedResult === false ? false : nestedResult;
        }
      }
      // For primitives and other types, check equality
      else if (valueA !== valueB) {
        differences[key] = false;
      }
    }
  }

  return Object.keys(differences).length > 0 ? differences : true;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Deep comparison of two arrays that only returns true or false.
 * Arrays are considered equal if they have the same length and all elements 
 * at corresponding positions are strictly equal. Only compares arrays,
 * does not go into deep object comparison.
 * 
 * @param arrA - First array to compare
 * @param arrB - Second array to compare
 * @returns `true` if arrays are deeply equal, `false` otherwise
 */
export function deepCompare<T>(arrA: T[], arrB: T[]): boolean {
  // Quick reference equality check
  if (arrA === arrB) {
    return true;
  }

  // Check if both are arrays
  if (!Array.isArray(arrA) || !Array.isArray(arrB)) {
    return false;
  }

  // Check length
  if (arrA.length !== arrB.length) {
    return false;
  }

  // Compare each element
  for (let i = 0; i < arrA.length; i++) {
    const elemA = arrA[i];
    const elemB = arrB[i];

    // For arrays, recurse
    if (Array.isArray(elemA) && Array.isArray(elemB)) {
      if (!deepCompare(elemA, elemB)) {
        return false;
      }
    }
    // For all other types (including objects), use strict equality
    else if (elemA !== elemB) {
      return false;
    }
  }

  return true;
}

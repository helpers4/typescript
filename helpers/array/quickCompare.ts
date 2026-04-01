/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Quick comparison of two arrays using JSON.stringify.
 * This is a fast but simple comparison that may not work for all edge cases.
 * 
 * @param arrA - First array to compare
 * @param arrB - Second array to compare
 * @returns `true` if arrays are identical according to JSON.stringify, `false` otherwise
 */
export function quickCompare<T>(arrA: T[], arrB: T[]): boolean {
  try {
    return JSON.stringify(arrA) === JSON.stringify(arrB);
  } catch {
    // If JSON.stringify fails (e.g., circular references), fall back to reference equality
    return arrA === arrB;
  }
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Quick comparison of two objects using JSON.stringify.
 * This is a fast but simple comparison that may not work for all edge cases.
 *
 * @param objA - First object to compare
 * @param objB - Second object to compare
 * @returns `true` if objects are identical according to JSON.stringify, `false` otherwise
 */
export function quickCompare(objA: unknown, objB: unknown): boolean {
  // Quick reference equality check
  if (objA === objB) {
    return true;
  }

  // Handle functions - they can't be JSON.stringified reliably
  if (typeof objA === 'function' || typeof objB === 'function') {
    return objA === objB;
  }

  try {
    return JSON.stringify(objA) === JSON.stringify(objB);
  } catch {
    // If JSON.stringify fails (e.g., circular references), fall back to basic comparison
    return objA === objB;
  }
}

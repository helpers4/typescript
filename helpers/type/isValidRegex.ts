/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a string is a valid regex pattern.
 * @param value - The string to check
 * @returns True if the string is a valid regex pattern
 * @example
 * isValidRegex('[a-z]+') // => true
 * isValidRegex('.*')     // => true
 * isValidRegex('[')      // => false
 * @since 1.9.0
 */
export function isValidRegex(value: string): boolean {
  try {
    RegExp(value);
    return true;
  } catch {
    return false;
  }
}

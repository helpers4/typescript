/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Union of all falsy types in JavaScript.
 * Note: `NaN` cannot be represented as a type in TypeScript.
 * @since 2.0.0
 */
export type Falsy = false | null | undefined | 0 | '';

/**
 * Checks if a value is falsy (`false`, `null`, `undefined`, `0`, `""`, `NaN`).
 * @param value - The value to check
 * @returns True if the value is falsy
 * @example
 * isFalsy(0)         // => true
 * isFalsy('')        // => true
 * isFalsy(null)      // => true
 * isFalsy('hello')   // => false
 * @since 2.0.0
 */
export function isFalsy(value: unknown): value is Falsy {
  return !value;
}

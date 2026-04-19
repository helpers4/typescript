/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns the given value unchanged
 *
 * Useful as a default transform, in function composition, or as a placeholder mapper.
 *
 * @param value - The value to return
 * @returns The same value
 * @example
 * ```ts
 * identity(42);       // 42
 * identity('hello');  // 'hello'
 * [1, 2, 3].map(identity); // [1, 2, 3]
 * ```
 * @since 2.0.0
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a Map instance.
 * @param value - The value to check
 * @returns True if value is a Map
 * @example
 * isMap(new Map())           // => true
 * isMap(new Map([['a', 1]])) // => true
 * isMap({})                  // => false
 * @since 2.0.0
 */
export function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map;
}

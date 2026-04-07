/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Gets a value from an object using a dot-notated path
 * @param obj - The object to get value from
 * @param path - The dot-notated path (e.g., 'a.b.c')
 * @param defaultValue - Default value if path doesn't exist
 * @returns The value at the path or default value
 * @since 1.9.0
 */
export function get<T = any>(obj: any, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

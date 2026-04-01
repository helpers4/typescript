/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Sets a value in an object using a dot-notated path
 * @param obj - The object to set value in
 * @param path - The dot-notated path (e.g., 'a.b.c')
 * @param value - The value to set
 * @returns The modified object
 */
export function set(obj: Record<string, any>, path: string, value: any): Record<string, any> {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }

    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return obj;
}

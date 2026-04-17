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
 * @since 1.9.0
 */
export function set(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') return obj;

    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }

    current = current[key] as Record<string, unknown>;
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey === '__proto__' || lastKey === 'constructor' || lastKey === 'prototype') return obj;

  current[lastKey] = value;
  return obj;
}

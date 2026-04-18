/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Creates a deep copy of an object or array
 * @param obj - The object to clone
 * @returns Deep cloned object
 * @since 1.9.0
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !UNSAFE_KEYS.has(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

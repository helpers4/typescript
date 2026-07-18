/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { set } from './set.js';

/**
 * Rebuilds a nested object from a single-level object whose keys are
 * dot-notation paths. The inverse of {@link flatten}.
 *
 * Uses {@link set} internally, so intermediate nodes are always created as
 * plain objects (never arrays — see {@link flatten}'s doc for why), and any
 * key segment equal to `__proto__`, `constructor`, or `prototype` is silently
 * rejected (same prototype-pollution guard as `set`).
 *
 * @param obj - A single-level object with dot-notation keys
 * @returns The rebuilt nested object
 * @example
 * unflatten({ 'a.b.c': 1, 'a.d': 2 })
 * // => { a: { b: { c: 1 }, d: 2 } }
 * @since 4.0.0
 */
export function unflatten(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    set(result, key, value);
  }
  return result;
}

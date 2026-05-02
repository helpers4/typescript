/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * One-level (shallow) object equality.
 *
 * Two objects are equal when they share the exact same set of own
 * enumerable string keys and each pair of values satisfies strict equality
 * (`===`). No recursion: nested objects/arrays are compared by reference.
 *
 * Falls back to strict equality when either input is `null`, `undefined`
 * or not an object \u2014 so primitives match if and only if they are `===`.
 * Arrays are not supported; they always return `false` (unless identical
 * references). Use `array/equalsShallow` instead.
 *
 * For recursive structural comparison use {@link equalsDeep}. For a diff
 * structure use {@link diff}.
 *
 * @param objA - First value to compare
 * @param objB - Second value to compare
 * @returns `true` if values are shallowly equal, `false` otherwise.
 * @since 2.0.0
 */
export function equalsShallow(objA: unknown, objB: unknown): boolean {
  if (objA === objB) {
    return true;
  }
  if (
    objA === null || objB === null ||
    typeof objA !== 'object' || typeof objB !== 'object'
  ) {
    return false;
  }
  const a = objA as Record<string, unknown>;
  const b = objB as Record<string, unknown>;
  if (Array.isArray(objA) || Array.isArray(objB)) {
    return false;
  }
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) {
    return false;
  }
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key) || a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

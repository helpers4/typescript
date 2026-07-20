/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isPlainObject } from './isPlainObject';

function transform(value: unknown, seen: Set<unknown>): boolean {
  if (value === null) return true;
  if (typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value) || isPlainObject(value)) {
    // A real JSON.stringify/parse round-trip never terminates on a cycle, so treat one as
    // invalid rather than recursing forever. Popped after this node's subtree is fully
    // checked, so a value referenced twice without a cycle (a shared, non-circular node) is
    // still valid.
    if (seen.has(value)) return false;
    seen.add(value);
    try {
      const items = Array.isArray(value) ? value : Object.values(value);
      return items.every((item) => transform(item, seen));
    } finally {
      seen.delete(value);
    }
  }
  return false;
}

/**
 * Checks whether a value is composed entirely of JSON-representable types: `string`, finite
 * `number`, `boolean`, `null`, arrays of JSON values, or plain objects of JSON values.
 * `undefined`, functions, symbols, `NaN`/`Infinity`, and non-plain objects (`Date`, `Map`,
 * `Set`, class instances...) all return `false`, since none survive a real `JSON.stringify` /
 * `JSON.parse` round-trip unchanged. Circular references also return `false` for the same
 * reason, instead of recursing forever.
 * @param value - The value to check
 * @returns `true` if the value is a valid JSON value
 * @example
 * isJSONValue({ a: [1, 'two', null, { b: true }] }) // => true
 * isJSONValue(new Date())                           // => false
 * isJSONValue(undefined)                             // => false
 * isJSONValue(Number.NaN)                             // => false
 * @since 3.0.3
 */
export function isJSONValue(value: unknown): boolean {
  return transform(value, new Set());
}

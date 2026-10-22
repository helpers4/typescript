/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

function transform(value: unknown, seen: Set<unknown>): boolean {
  if (value === null) return true;
  const type = typeof value;
  if (type === 'string' || type === 'boolean') return true;
  if (type === 'number') return Number.isFinite(value);
  if (type !== 'object') return false;
  if (Array.isArray(value)) {
    // A real JSON.stringify/parse round-trip never terminates on a cycle, so treat one as
    // invalid rather than recursing forever. Popped after this node's subtree is fully
    // checked, so a value referenced twice without a cycle (a shared, non-circular node) is
    // still valid.
    if (seen.has(value)) return false;
    seen.add(value);
    try {
      // Walked by index rather than via Object.values, which would allocate an intermediate
      // array of every item. A hole is skipped, matching what Object.values yields: it holds no
      // value to check, and JSON.stringify turns it into null rather than leaving it out.
      for (let i = 0; i < value.length; i++) {
        if (i in value && !transform(value[i], seen)) return false;
      }
      return true;
    } finally {
      seen.delete(value);
    }
  }
  // Same test as `isPlainObject` — `{}`, `new Object()` or `Object.create(null)` — inlined so a
  // non-plain object is rejected without a call, since this runs for every value in the tree.
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) return false;
  if (seen.has(value)) return false;
  seen.add(value);
  try {
    // Walked by key rather than via Object.values, which would allocate an intermediate array
    // of every member's value at every level of the structure.
    const object = value as Record<string, unknown>;
    for (const key of Object.keys(object)) {
      if (!transform(object[key], seen)) return false;
    }
    return true;
  } finally {
    seen.delete(value);
  }
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

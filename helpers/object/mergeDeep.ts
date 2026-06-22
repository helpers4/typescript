/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isPlainObject } from '../type/isPlainObject';
import { UNSAFE_KEYS } from './_unsafeKeys.js';

// Merges a single key from source into result.
// When both sides are plain objects the values are merged recursively into a new object.
function applyKey(
  result: Record<PropertyKey, unknown>,
  source: Record<PropertyKey, unknown>,
  key: PropertyKey,
): void {
  const resultValue = result[key];
  const sourceValue = source[key];
  if (isPlainObject(resultValue) && isPlainObject(sourceValue)) {
    result[key] = mergeDeep(
      resultValue as Record<PropertyKey, unknown>,
      sourceValue as Record<PropertyKey, unknown>,
    );
  } else if (sourceValue !== undefined) {
    result[key] = sourceValue;
  }
}

function applySource(
  result: Record<PropertyKey, unknown>,
  source: Record<PropertyKey, unknown>,
): void {
  for (const key in source) {
    if (!Object.hasOwn(source, key) || UNSAFE_KEYS.has(key)) continue;
    applyKey(result, source, key);
  }
  for (const sym of Object.getOwnPropertySymbols(source)) {
    if (!Object.prototype.propertyIsEnumerable.call(source, sym)) continue;
    applyKey(result, source, sym);
  }
}

/**
 * Merges two or more objects deeply, returning a **new** object without mutating any input.
 *
 * Recursively merges own enumerable properties — both string and symbol keys.
 * Plain objects are merged recursively into a new object; all other values
 * (arrays, class instances, primitives, etc.) are replaced by the source value.
 * `undefined` source values do not overwrite existing values.
 * `null` or non-object sources are silently skipped.
 *
 * @param base - The base object (not mutated)
 * @param sources - One or more source objects to merge on top of the base
 * @returns A new merged object
 * @since next
 */
export function mergeDeep<T extends Record<PropertyKey, unknown>>(base: T, ...sources: readonly Record<PropertyKey, unknown>[]): T {
  const result: Record<PropertyKey, unknown> = {};
  applySource(result, base as Record<PropertyKey, unknown>);
  for (const source of sources) {
    if (source !== null && source !== undefined && typeof source === 'object') {
      applySource(result, source);
    }
  }
  return result as T;
}

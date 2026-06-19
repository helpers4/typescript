/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isPlainObject } from '../type/isPlainObject';
import { UNSAFE_KEYS } from './_unsafeKeys.js';

// Shared merge logic for a single key (string or symbol).
// Extracted to avoid duplicating the plain-object / replace / skip logic between
// the string-key loop (for...in) and the symbol-key loop (getOwnPropertySymbols).
function mergeKey(
  target: Record<PropertyKey, unknown>,
  source: Record<PropertyKey, unknown>,
  key: PropertyKey,
): void {
  const targetValue = target[key];
  const sourceValue = source[key];
  if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
    target[key] = deepMerge(
      targetValue as Record<PropertyKey, unknown>,
      sourceValue as Record<PropertyKey, unknown>,
    );
  } else if (sourceValue !== undefined) {
    target[key] = sourceValue;
  }
}

/**
 * Merges two or more objects deeply.
 *
 * Recursively merges own enumerable properties — both string and symbol keys.
 * Plain objects are merged recursively; all other values (arrays, class instances,
 * primitives, etc.) are replaced by the source value.
 * `undefined` source values do not overwrite existing target values.
 *
 * @param target - The target object (mutated in place)
 * @param sources - One or more source objects to merge into the target
 * @returns The mutated target
 * @since 1.9.0
 */
export function deepMerge<T extends Record<PropertyKey, unknown>>(target: T, ...sources: Record<PropertyKey, unknown>[]): T;
export function deepMerge(target: undefined, ...sources: Record<PropertyKey, unknown>[]): undefined;
export function deepMerge(target: null, ...sources: Record<PropertyKey, unknown>[]): null;
export function deepMerge<T extends Record<PropertyKey, unknown>>(target: T | undefined | null, ...sources: Record<PropertyKey, unknown>[]): T | undefined | null {
  if (target === undefined || target === null) return target;
  if (!sources.length) return target;
  const source = sources.shift();

  if (!source) return deepMerge(target, ...sources);

  const t = target as Record<PropertyKey, unknown>;
  const s = source as Record<PropertyKey, unknown>;

  for (const key in source) {
    if (!Object.hasOwn(source, key) || UNSAFE_KEYS.has(key)) continue;
    mergeKey(t, s, key);
  }

  for (const sym of Object.getOwnPropertySymbols(source)) {
    if (!Object.prototype.propertyIsEnumerable.call(source, sym)) continue;
    mergeKey(t, s, sym);
  }

  return deepMerge(target, ...sources);
}

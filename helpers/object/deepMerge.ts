/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isPlainObject } from '../type/isPlainObject';

/**
 * Merges two or more objects deeply
 * @param target - The target object
 * @param sources - The source objects to merge
 * @returns The merged object
 * @since 1.9.0
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Record<string, unknown>[]): T;
export function deepMerge(target: undefined, ...sources: Record<string, unknown>[]): undefined;
export function deepMerge(target: null, ...sources: Record<string, unknown>[]): null;
export function deepMerge<T extends Record<string, unknown>>(target: T | undefined | null, ...sources: Record<string, unknown>[]): T | undefined | null {
  if (target === undefined || target === null) return target;
  if (!sources.length) return target;
  const source = sources.shift();

  if (!source) return deepMerge(target, ...sources);

  for (const key in source) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      (target as Record<string, unknown>)[key] = deepMerge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>);
    } else if (sourceValue !== undefined) {
      (target as Record<string, unknown>)[key] = sourceValue;
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Merges two or more objects deeply
 * @param target - The target object
 * @param sources - The source objects to merge
 * @returns The merged object
 * @since 1.9.0
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Record<string, any>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (!source) return deepMerge(target, ...sources);

  for (const key in source) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isObject(targetValue) && isObject(sourceValue)) {
      (target as any)[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      (target as any)[key] = sourceValue;
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link memoize}.
 * @since 2.0.4
 */
export interface MemoizeOptions {
  /**
   * Maximum number of entries kept in the cache.
   * When the limit is reached the oldest entry is evicted before inserting the new one.
   * Defaults to unlimited.
   */
  maxSize?: number;
}

/**
 * Returns a memoized version of the function that caches results.
 *
 * Cache keys are derived via `JSON.stringify`; `undefined` arguments are
 * correctly distinguished from `null`. Arguments that are not JSON-serializable
 * (functions, symbols, class instances, circular references) produce a
 * `null`-equivalent key and are not supported.
 *
 * @param func - The function to memoize
 * @param options - Optional settings (e.g. `maxSize` to cap memory usage)
 * @returns The memoized function
 * @since 1.9.0
 */
export function memoize<A extends unknown[], R>(func: (...args: A) => R, options?: MemoizeOptions): (...args: A) => R {
  const maxSize = options?.maxSize;
  const cache = new Map<string, R>();

  return (...args: A): R => {
    // Wrap each argument as [value] so undefined (→ []) and null (→ [null]) produce
    // distinct JSON keys. A string sentinel would collide if that string were passed as arg.
    const key = JSON.stringify(args.map(a => (a === undefined ? [] : [a])));

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);

    if (maxSize !== undefined && cache.size >= maxSize) {
      const first = cache.keys().next();
      // first.done only when the cache is empty, which happens iff maxSize === 0.
      // Nothing was evicted, so skip the insert too — otherwise we'd hold 1 entry
      // despite a stated limit of 0.
      if (!first.done) cache.delete(first.value);
      else return result;
    }

    cache.set(key, result);
    return result;
  };
}

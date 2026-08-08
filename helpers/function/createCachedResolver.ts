/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/** A cached resolver created by {@link createCachedResolver}. */
export interface CachedResolver<K, V> {
  /**
   * Returns the cached value for `key`, computing it (via the `compute`
   * function given to {@link createCachedResolver}) and caching it first if
   * this is the first time `key` is seen since creation or the last {@link clear}.
   */
  resolve(key: K): V;
  /**
   * Discards every cached entry. The next {@link resolve} call for any key
   * recomputes it from scratch, as if the resolver had just been created.
   */
  clear(): void;
}

/**
 * Creates a lazy, cached resolver: `resolve(key)` computes and caches
 * `compute(key)` the first time a given key is seen, and returns the cached
 * value on every later call for that same key — until `clear()` wipes the
 * whole cache.
 *
 * Backed by a `Map` by default (works with any key type). Pass a factory
 * that returns a `WeakMap` instead when keys are objects that should be
 * allowed to be garbage-collected once nothing else references them anymore
 * — the whole point of `WeakMap` over `Map`.
 *
 * A *factory function* is accepted (not a cache instance) so `clear()` can
 * reliably produce a fresh, empty cache regardless of its kind: `WeakMap`
 * deliberately has no `.clear()` method (no way to enumerate its entries, by
 * design), so the only way to empty one is to replace it outright — the same
 * factory used to create the initial cache is called again to do that.
 *
 * @param compute - Computes the value for a key not yet in the cache.
 * @param createCache - Produces a fresh, empty cache. Defaults to `() => new Map()`.
 * @returns A {@link CachedResolver}.
 * @example
 * const { resolve, clear } = createCachedResolver((id: number) => expensiveLookup(id));
 * resolve(1); // cache miss: computes and caches
 * resolve(1); // cache hit: returns the cached value, compute() not called again
 * clear();    // next resolve(1) recomputes from scratch
 * @example
 * // WeakMap-backed: entries can be garbage-collected once `config` is no
 * // longer referenced elsewhere.
 * const configResolver = createCachedResolver(
 *   (config: object) => expensiveDerive(config),
 *   () => new WeakMap(),
 * );
 * @since next
 */
export function createCachedResolver<K extends object, V>(
  compute: (key: K) => V,
  createCache: () => Map<K, V> | WeakMap<K, V>,
): CachedResolver<K, V>;
export function createCachedResolver<K, V>(
  compute: (key: K) => V,
  createCache?: () => Map<K, V>,
): CachedResolver<K, V>;
export function createCachedResolver<K, V>(
  compute: (key: K) => V,
  createCache: () => Map<K, V> | WeakMap<K & object, V> = () => new Map<K, V>(),
): CachedResolver<K, V> {
  let cache = createCache();

  return {
    resolve(key: K): V {
      const cacheKey = key as K & object;
      if (cache.has(cacheKey)) return cache.get(cacheKey) as V;
      const value = compute(key);
      cache.set(cacheKey, value);
      return value;
    },
    clear(): void {
      // Map exposes clear(); WeakMap deliberately doesn't (no way to enumerate
      // its entries). Call it when available to free memory proactively
      // instead of only dropping the reference and waiting for the next GC —
      // matters most when cached values themselves are large.
      if ('clear' in cache) cache.clear();
      cache = createCache();
    },
  };
}

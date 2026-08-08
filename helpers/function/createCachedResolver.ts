/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isWeakMap } from '../guard/isWeakMap';

/** A cached resolver created by {@link createCachedResolver}. */
export interface CachedResolver<K, V> {
  /**
   * Returns the cached value for `key`, computing it (via the `compute`
   * function given to {@link createCachedResolver}) and caching it first if
   * this is the first time `key` is seen since creation or the last {@link clear}.
   * @throws {TypeError} If the resolver is WeakMap-backed and `key` isn't an object.
   * @throws {Error} If `compute` for this key transitively calls `resolve()` for
   * the same key again (a circular dependency) before returning.
   */
  resolve(key: K): V;
  /**
   * Discards every cached entry. The next {@link resolve} call for any key
   * recomputes it from scratch, as if the resolver had just been created.
   */
  clear(): void;
}

/**
 * The minimal cache shape `resolve`/`clear` actually need. Both `Map` and
 * `WeakMap` satisfy this structurally, with no cast required to call `has`/
 * `get`/`set` with a plain `K` — unlike the `Map<K, V> | WeakMap<K, V>`
 * union, which forces every key through a `K & object` cast to satisfy
 * `WeakMap`'s signatures even when the actual cache is a `Map`.
 * @ignore
 */
interface KeyedCache<K, V> {
  has(key: K): boolean;
  get(key: K): V | undefined;
  set(key: K, value: V): unknown;
  clear?(): void;
}

// Tracks every cache instance a createCachedResolver() call has claimed, so a
// createCache factory that (accidentally) returns the same instance for two
// different resolvers is caught immediately instead of silently making the
// two "independent" resolvers share cache state — see the createCache param
// doc below: each call must produce an independent, fresh cache.
const claimedCaches = new WeakSet<object>();

/** @ignore */
function claimCache<C extends object>(cache: C): C {
  if (claimedCaches.has(cache)) {
    throw new Error(
      'createCachedResolver: createCache() returned a cache instance already used by another createCachedResolver() call — each call must return an independent cache.',
    );
  }
  claimedCaches.add(cache);
  return cache;
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
 * Its *initial* call must return an instance not already claimed by another
 * `createCachedResolver()` call sharing the same factory — otherwise the two
 * would silently share cache state, so this throws instead.
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
 * @since 3.0.7
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
  createCache: () => KeyedCache<K, V> = () => new Map<K, V>(),
): CachedResolver<K, V> {
  let cache = claimCache(createCache());
  // Keys currently being computed, so a resolve() reentrantly triggered by
  // compute() itself — directly, or via a cycle through other resolvers —
  // fails fast with a clear error instead of recursing until the call stack
  // overflows.
  const inProgress = new Set<K>();

  return {
    resolve(key: K): V {
      // WeakMap.has()/.get() silently treat a non-object key as "absent" (per
      // spec), so without this check a bad key would run compute() only to
      // lose the result when .set() throws below. Checked eagerly instead.
      if (isWeakMap(cache) && (typeof key !== 'object' || key === null)) {
        throw new TypeError(
          `createCachedResolver: this resolver's cache is a WeakMap, which requires object keys — got ${key === null ? 'null' : typeof key}`,
        );
      }
      if (cache.has(key)) return cache.get(key) as V;
      if (inProgress.has(key)) {
        throw new Error('createCachedResolver: resolve() was called again for a key that is still being computed (circular dependency)');
      }

      // Snapshot the cache in use for this call: if compute() reentrantly
      // calls clear(), `cache` gets reassigned to a fresh instance before
      // this call returns, and writing the result into that fresh instance
      // would silently undo the clear() the caller just asked for.
      const activeCache = cache;
      inProgress.add(key);
      try {
        const value = compute(key);
        if (cache === activeCache) activeCache.set(key, value);
        return value;
      } finally {
        inProgress.delete(key);
      }
    },
    clear(): void {
      // Map exposes clear(); WeakMap deliberately doesn't (no way to enumerate
      // its entries). Call it when available to free memory proactively
      // instead of only dropping the reference and waiting for the next GC —
      // matters most when cached values themselves are large.
      cache.clear?.();
      cache = createCache();
    },
  };
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Resolves an array of keys into a record by calling an async mapper for each key.
 * All mapper calls run concurrently via `Promise.all`.
 *
 * Unlike {@link parallel}, which returns an array, `resolveRecord` preserves the
 * key-to-value relationship in the result.
 *
 * @param keys - The keys to resolve
 * @param mapper - Async function called for each key, returning the associated value
 * @returns A record mapping each key to its resolved value
 * @example
 * const stars = await resolveRecord(
 *   ['helpers4/typescript', 'helpers4/devcontainer'],
 *   async repo => fetchRepoStars(repo)
 * );
 * // => { 'helpers4/typescript': 42, 'helpers4/devcontainer': 17 }
 * @since 2.0.0
 */
export async function resolveRecord<K extends PropertyKey, V>(
  keys: readonly K[],
  mapper: (key: K) => Promise<V>,
): Promise<Record<K, V>> {
  const entries = await Promise.all(keys.map(async (key) => [key, await mapper(key)] as const));
  return Object.fromEntries(entries) as Record<K, V>;
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { runConcurrentMap } from './_concurrentMap.js';

/**
 * The async counterpart to `Array.prototype.filter`: runs `predicate` for every item and
 * resolves to the items whose predicate was truthy, in their original relative order.
 *
 * `predicate` runs for every item up front (respecting `concurrency`) before any filtering
 * happens — unlike the sync `.filter()`, there's no short-circuiting, since every predicate
 * call may already be in flight by the time an earlier one resolves.
 * @param array - The array to filter
 * @param predicate - Async (or sync) predicate called with `(item, index)`
 * @param concurrency - Maximum number of concurrent predicate calls. Defaults to unlimited.
 * @returns The items whose predicate resolved truthy, in original order
 * @see {@link mapAsync} for the async counterpart to `Array.prototype.map`
 * @example
 * await filterAsync(files, (file) => fileExists(file))
 * // => only the files that actually exist, checked concurrently
 * @since 3.0.4
 */
export async function filterAsync<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean | Promise<boolean>,
  concurrency?: number,
): Promise<T[]> {
  const keep = await runConcurrentMap(array, predicate, concurrency);
  return array.filter((_, index) => keep[index]);
}

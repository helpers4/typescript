/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { runConcurrentMap } from './_concurrentMap.js';

/**
 * The async counterpart to `Array.prototype.map`: applies `fn` to every item and resolves to
 * an array of the results, in input order — regardless of which call finishes first.
 *
 * `Array.prototype.map(asyncFn)` alone doesn't do this: it returns an array of *unresolved*
 * promises (`Promise<R>[]`), not `Promise<R[]>` — you'd still need to wrap it in
 * `Promise.all(...)` yourself, and there'd be no way to cap concurrency. This does both.
 *
 * With no `concurrency` given, every call starts immediately (like
 * `Promise.all(array.map(fn))`). Pass `concurrency` to cap how many run at once — e.g. to
 * avoid overwhelming an API. Rejects with the first error thrown by `fn`, same as
 * `Promise.all`; other already-started calls keep running in the background but their
 * outcome is ignored.
 * @param array - The array to map over
 * @param fn - Async (or sync) function called with `(item, index)`
 * @param concurrency - Maximum number of concurrent calls. Defaults to unlimited.
 * @returns The mapped results, in input order
 * @see {@link filterAsync} for the async counterpart to `Array.prototype.filter`
 * @see {@link forEachAsync} for the async counterpart to `Array.prototype.forEach`
 * @example
 * await mapAsync(userIds, (id) => fetchUser(id))
 * // => [user1, user2, user3], all fetched concurrently
 * @example
 * await mapAsync(urls, (url) => fetch(url), 2)
 * // at most 2 concurrent fetch() calls
 * @since 3.0.4
 */
export async function mapAsync<T, R>(
  array: readonly T[],
  fn: (item: T, index: number) => R | Promise<R>,
  concurrency?: number,
): Promise<R[]> {
  return runConcurrentMap(array, fn, concurrency);
}

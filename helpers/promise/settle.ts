/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Runs an array of promises concurrently and partitions the outcomes instead of
 * rejecting on the first failure, unlike `Promise.all`.
 * Built on top of `Promise.allSettled`, but returns fulfilled values and rejection
 * reasons already split apart so callers don't need to inspect `status` themselves.
 *
 * No concurrency limit, and none is possible here: `promises` are already-constructed
 * `Promise` objects, and a promise starts running the moment it's created — by the time
 * `settle` receives the array, every promise in it is already in flight. There is
 * nothing left to throttle. If you need to cap how many run at once (e.g. many file
 * reads or requests), use {@link parallelSettle} instead, which takes functions
 * (`() => Promise<T>`) so it controls *when* each one starts.
 *
 * @param promises - Promises to run concurrently
 * @returns An object with `fulfilled` values and `rejected` reasons, each in input order
 * @see {@link parallelSettle} for the same partitioning with a concurrency limit
 * @example
 * const { fulfilled, rejected } = await settle([
 *   Promise.resolve(1),
 *   Promise.reject(new Error('boom')),
 *   Promise.resolve(3),
 * ])
 * // => { fulfilled: [1, 3], rejected: [Error('boom')] }
 * @since 3.0.0
 */
export async function settle<T>(
  promises: readonly Promise<T>[],
): Promise<{ fulfilled: T[]; rejected: unknown[] }> {
  const results = await Promise.allSettled(promises);
  const fulfilled: T[] = [];
  const rejected: unknown[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      fulfilled.push(result.value);
    } else {
      rejected.push(result.reason);
    }
  }

  return { fulfilled, rejected };
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { abortable } from '../_shared/_abortable.js';
import type { AbortSignalLike } from '../type/AbortSignalLike';

/**
 * Options for {@link parallel} and {@link parallelSettle}.
 * @since 3.1.6
 */
export interface ParallelOptions {
  /**
   * Starts no new function when aborted, and rejects with the signal's reason at once, without
   * waiting for the running ones: pass the same signal to their work to cancel it too.
   */
  signal?: AbortSignalLike;
}

/**
 * Runs an array of async functions with a concurrency limit.
 * At most `limit` functions will be running at any time. `Infinity` means no cap (every
 * function starts immediately); any other non-finite or non-positive value (`NaN`, `0`,
 * negative) is clamped to `1` (fully sequential) rather than rejected.
 * @param functions - Array of functions that return promises
 * @param limit - Maximum number of concurrent executions
 * @param options - Cancellation — see {@link ParallelOptions}
 * @returns Promise that resolves with an array of results in the same order as the input, or
 *   rejects with the signal's reason if aborted first
 * @see {@link parallelSettle} for the same concurrency limit, but partitioning outcomes
 *   instead of rejecting on the first failure
 * @example
 * const results = await parallel(
 *   [() => fetchUser(1), () => fetchUser(2), () => fetchUser(3)],
 *   2
 * )
 * @since 2.0.0
 */
export async function parallel<T>(
  functions: readonly (() => Promise<T>)[],
  limit: number,
  options: ParallelOptions = {},
): Promise<T[]> {
  const { signal } = options;
  const results: T[] = [];
  const clampedLimit =
    limit === Number.POSITIVE_INFINITY
      ? functions.length
      : Number.isFinite(limit)
        ? Math.max(1, Math.floor(limit))
        : 1;
  let nextIndex = 0;

  async function runNext(): Promise<void> {
    if (nextIndex >= functions.length || signal?.aborted) return;
    const currentIndex = nextIndex++;
    results[currentIndex] = await functions[currentIndex]();
    return runNext();
  }

  const workers = Array.from(
    { length: Math.min(clampedLimit, functions.length) },
    () => runNext(),
  );

  await abortable(Promise.all(workers), signal);
  return results;
}

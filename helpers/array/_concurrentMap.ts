/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal helper shared by mapAsync.ts, filterAsync.ts, and forEachAsync.ts.
 * Not exported from the package barrel — tests live in _concurrentMap.test.ts.
 */

import { validatePositiveCount } from '../_shared/_validatePositiveCount.js';
import { parallel } from '../promise/parallel.js';

/**
 * Resolves an optional `concurrency` argument into a worker count, clamped to `itemCount`.
 * `undefined` means "no cap" (one worker per item). Validated even when `itemCount` is `0`, so
 * an invalid `concurrency` is always rejected regardless of the input array's length.
 * @ignore
 */
export function resolveConcurrency(concurrency: number | undefined, itemCount: number): number {
  if (concurrency === undefined) return itemCount;
  return Math.min(validatePositiveCount(concurrency, 'concurrency'), itemCount);
}

/**
 * Runs `fn` over every item, with at most `concurrency` calls in flight at once (`undefined`/
 * `Infinity` = no cap). Results are returned in input order regardless of completion order.
 * Rejects with the first error thrown by `fn`, same as `Promise.all`/{@link parallel} — other
 * already-started calls keep running in the background but their outcome is ignored.
 *
 * A hole in a sparse `items` array is skipped (`fn` is not called for it), matching
 * `Array.prototype.map`; the corresponding result slot is `undefined`.
 *
 * Delegates the actual scheduling to {@link parallel} instead of a second, independent
 * worker-pool implementation — `concurrency` is already validated and clamped by the time
 * `parallel` sees it, so its own (more permissive) clamping never comes into play here and
 * its behavior for direct callers is unaffected.
 * @ignore
 */
export async function runConcurrentMap<T, R>(
  items: readonly T[],
  fn: (item: T, index: number) => R | Promise<R>,
  concurrency: number | undefined,
): Promise<R[]> {
  const workerCount = resolveConcurrency(concurrency, items.length);
  if (items.length === 0) return [];
  const thunks = Array.from(
    { length: items.length },
    (_, index) =>
      async () =>
        index in items ? fn(items[index]!, index) : (undefined as R),
  );
  return parallel(thunks, workerCount);
}

/**
 * Runs `fn` over every item for its side effects, with at most `concurrency` calls in flight
 * at once (`undefined`/`Infinity` = no cap), discarding return values without allocating a
 * results array — unlike {@link runConcurrentMap}, used by forEachAsync which has no need for
 * the results.
 *
 * A hole in a sparse `items` array is skipped (`fn` is not called for it), matching
 * `Array.prototype.forEach`.
 * @ignore
 */
export async function runConcurrentEach<T>(
  items: readonly T[],
  fn: (item: T, index: number) => unknown,
  concurrency: number | undefined,
): Promise<void> {
  const workerCount = resolveConcurrency(concurrency, items.length);
  if (items.length === 0) return;
  let nextIndex = 0;

  async function worker(): Promise<void> {
    if (nextIndex >= items.length) return;
    const currentIndex = nextIndex++;
    if (currentIndex in items) {
      await fn(items[currentIndex]!, currentIndex);
    }
    return worker();
  }

  await Promise.all(Array.from({ length: workerCount }, worker));
}

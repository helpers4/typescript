/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { runConcurrentMap } from './_concurrentMap.js';

/**
 * Like {@link mapAsync}, but never rejects: each item gets its own result, in the shape of
 * `Promise.allSettled`, so one failure does not stop or hide the others.
 *
 * `Promise.allSettled(array.map(fn))` does the same without a concurrency cap; `parallelSettle`
 * caps it but splits the results into two lists and loses which item failed. This keeps both:
 * the cap, and one result per item in input order.
 *
 * @param array - The array to map over
 * @param fn - Async (or sync) function called with `(item, index)`; a throw counts as a rejection
 * @param concurrency - Maximum number of concurrent calls. Defaults to unlimited.
 * @returns One `PromiseSettledResult` per item, in input order
 * @example
 * const results = await mapSettled(urls, (url) => fetch(url), 4);
 * const failed = urls.filter((_, i) => results[i]!.status === 'rejected');
 * @since next
 */
export async function mapSettled<T, R>(
  array: readonly T[],
  fn: (item: T, index: number) => R | Promise<R>,
  concurrency?: number,
): Promise<PromiseSettledResult<Awaited<R>>[]> {
  return runConcurrentMap(
    array,
    async (item, index): Promise<PromiseSettledResult<Awaited<R>>> => {
      try {
        return { status: 'fulfilled', value: await fn(item, index) };
      } catch (reason) {
        return { status: 'rejected', reason };
      }
    },
    concurrency,
  );
}

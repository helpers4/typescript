/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Runs an array of async functions with a concurrency limit, partitioning the outcomes
 * instead of rejecting on the first failure — {@link parallel} with {@link settle}'s
 * fulfilled/rejected split.
 *
 * Takes functions (not already-created promises, unlike {@link settle}) so it controls
 * *when* each one starts: that's what makes the concurrency limit meaningful. At most
 * `concurrency` functions run at any time; as soon as one settles, the next queued
 * function starts.
 *
 * @param functions - Array of functions that return promises
 * @param concurrency - Maximum number of concurrent executions
 * @returns An object with `fulfilled` values and `rejected` reasons, each in input order
 * @see {@link parallel} for concurrency-limited execution that rejects on the first failure
 * @see {@link settle} for unlimited-concurrency partitioning (input is already-running promises)
 * @example
 * const { fulfilled, rejected } = await parallelSettle(
 *   [() => fetch('/a'), () => fetch('/b'), () => fetch('/c')],
 *   2
 * )
 * // At most 2 requests run at a time; failures don't stop the others
 * @example
 * await parallelSettle([() => Promise.resolve(1), () => Promise.reject('boom')], 2)
 * // => { fulfilled: [1], rejected: ['boom'] }
 * @since next
 */
export async function parallelSettle<T>(
  functions: readonly (() => Promise<T>)[],
  concurrency: number,
): Promise<{ fulfilled: T[]; rejected: unknown[] }> {
  const clampedConcurrency = Number.isFinite(concurrency) ? Math.max(1, Math.floor(concurrency)) : 1;
  const results: ({ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown })[] = Array.from({
    length: functions.length,
  });
  let nextIndex = 0;

  async function runNext(): Promise<void> {
    if (nextIndex >= functions.length) return;
    const currentIndex = nextIndex++;
    try {
      const value = await functions[currentIndex]!();
      results[currentIndex] = { status: 'fulfilled', value };
    } catch (reason) {
      results[currentIndex] = { status: 'rejected', reason };
    }
    return runNext();
  }

  const workers = Array.from({ length: Math.min(clampedConcurrency, functions.length) }, () => runNext());
  await Promise.all(workers);

  const fulfilled: T[] = [];
  const rejected: unknown[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') fulfilled.push(result.value);
    else rejected.push(result.reason);
  }

  return { fulfilled, rejected };
}

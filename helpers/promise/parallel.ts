/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Runs an array of async functions with a concurrency limit.
 * At most `limit` functions will be running at any time. `Infinity` means no cap (every
 * function starts immediately); any other non-finite or non-positive value (`NaN`, `0`,
 * negative) is clamped to `1` (fully sequential) rather than rejected.
 * @param functions - Array of functions that return promises
 * @param limit - Maximum number of concurrent executions
 * @returns Promise that resolves with an array of results in the same order as the input
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
): Promise<T[]> {
  const results: T[] = [];
  const clampedLimit =
    limit === Number.POSITIVE_INFINITY
      ? functions.length
      : Number.isFinite(limit)
        ? Math.max(1, Math.floor(limit))
        : 1;
  let nextIndex = 0;

  async function runNext(): Promise<void> {
    if (nextIndex >= functions.length) return;
    const currentIndex = nextIndex++;
    results[currentIndex] = await functions[currentIndex]();
    return runNext();
  }

  const workers = Array.from(
    { length: Math.min(clampedLimit, functions.length) },
    () => runNext(),
  );

  await Promise.all(workers);
  return results;
}

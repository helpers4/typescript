/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Runs an array of async functions with a concurrency limit.
 * At most `limit` functions will be running at any time.
 * @param functions - Array of functions that return promises
 * @param limit - Maximum number of concurrent executions
 * @returns Promise that resolves with an array of results in the same order as the input
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
  const clampedLimit = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 1;
  let nextIndex = 0;

  async function runNext(): Promise<void> {
    while (nextIndex < functions.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await functions[currentIndex]();
    }
  }

  const workers = Array.from(
    { length: Math.min(clampedLimit, functions.length) },
    () => runNext(),
  );

  await Promise.all(workers);
  return results;
}

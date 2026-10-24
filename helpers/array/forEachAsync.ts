/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { resolveAsyncArrayOptions, runConcurrentEach } from './_concurrentMap.js';
import type { AsyncArrayOptions } from './mapAsync.js';

/**
 * The async counterpart to `Array.prototype.forEach`: runs `fn` for every item for its
 * side effects, discarding any return value. Prefer {@link mapAsync} when you need the
 * results — this only exists to signal that intent clearly, same as the sync
 * `forEach`/`map` pair.
 * @param array - The array to iterate
 * @param fn - Async (or sync) function called with `(item, index)`
 * @param options - Maximum number of concurrent calls (defaults to unlimited), or the options
 *   with a `signal` to stop — see {@link AsyncArrayOptions}
 * @returns A promise that resolves once every call has settled
 * @see {@link mapAsync} for the same iteration when you need the results
 * @example
 * await forEachAsync(files, (file) => uploadFile(file), 3)
 * // uploads at most 3 files at once
 * @since 3.0.4
 */
export async function forEachAsync<T>(
  array: readonly T[],
  fn: (item: T, index: number) => unknown,
  options?: number | AsyncArrayOptions,
): Promise<void> {
  const { concurrency, signal } = resolveAsyncArrayOptions(options);
  await runConcurrentEach(array, fn, concurrency, signal);
}

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { delay as wait } from './delay';
import type { AbortSignalLike } from '../type/AbortSignalLike';

/**
 * Options for {@link retry}.
 * @since 3.1.3
 */
export interface RetryOptions {
  /**
   * Maximum number of attempts, the first one included. Defaults to `3`. Any value below `1`
   * still runs `fn` once.
   */
  attempts?: number;
  /**
   * Delay before the next attempt, in milliseconds. Defaults to `1000`.
   * - a number — the same delay between every attempt
   * - a function — called with the 1-based number of the attempt that just failed and its
   *   error, so the delay can grow (linear, exponential) or follow the error (a `Retry-After`)
   */
  delayMs?: number | ((attempt: number, error: unknown) => number);
  /**
   * Decides whether a failed attempt is worth retrying, from its error and its 1-based number.
   * Returning `false` rethrows that error at once. Defaults to retrying every error.
   */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /**
   * Stops retrying when aborted: the wait between attempts is cleared, no new attempt starts,
   * and the returned promise rejects with the signal's reason. Pass the same signal to the
   * work inside `fn` (a `fetch`) to cancel the running attempt too.
   * @since 3.1.6
   */
  signal?: AbortSignalLike;
}

/**
 * Retries a promise-returning function until it succeeds or runs out of attempts, then rejects
 * with the last error, waiting a fixed delay between attempts.
 *
 * For a delay that grows or for retrying only some errors, pass a {@link RetryOptions} object instead.
 *
 * @param fn - The function to retry, called with the 1-based number of the attempt
 * @param maxAttempts - Maximum number of attempts, the first one included (default `3`)
 * @param delayMs - Delay between attempts in milliseconds (default `1000`)
 * @returns Promise that resolves with the result or rejects with the last error
 * @example
 * await retry(() => fetchData(), 3, 500)
 * @example
 * // Rotate through a pool of mirrors: the attempt number picks the next one
 * await retry((attempt) => fetch(mirrors[(attempt - 1) % mirrors.length]), 3, 500)
 * @since 1.9.0
 */
export async function retry<T>(fn: (attempt: number) => Promise<T>, maxAttempts?: number, delayMs?: number): Promise<T>;
/**
 * Retries a promise-returning function until it succeeds or runs out of attempts, then rejects
 * with the last error. The options make it possible to only retry some errors or to make the
 * delay grow between attempts — see {@link RetryOptions}.
 *
 * @param fn - The function to retry, called with the 1-based number of the attempt
 * @param options - Attempts, delay and retry predicate
 * @returns Promise that resolves with the result or rejects with the last error
 * @example
 * // Exponential backoff: 500 ms, 1 s, 2 s
 * await retry(() => fetchData(), { attempts: 4, delayMs: (attempt) => 500 * 2 ** (attempt - 1) })
 * @example
 * // Only retry transient errors, rethrow anything else at once
 * await retry(() => createIndex(), { shouldRetry: (error) => /already exists/i.test(String(error)) })
 * @since 1.9.0
 */
export async function retry<T>(fn: (attempt: number) => Promise<T>, options: RetryOptions): Promise<T>;
export async function retry<T>(
  fn: (attempt: number) => Promise<T>,
  maxAttemptsOrOptions: number | RetryOptions = 3,
  delayMs: number = 1000
): Promise<T> {
  const {
    attempts = 3,
    delayMs: delay = 1000,
    shouldRetry = () => true,
    signal,
  }: RetryOptions = typeof maxAttemptsOrOptions === 'number'
    ? { attempts: maxAttemptsOrOptions, delayMs }
    : maxAttemptsOrOptions;

  for (let attempt = 1; ; attempt++) {
    if (signal?.aborted) throw signal.reason;
    try {
      // Sequential on purpose: each attempt only runs once the previous one has failed.
      // eslint-disable-next-line no-await-in-loop
      return await fn(attempt);
    } catch (error) {
      // An attempt cut short by the abort: report the abort, not its side effect.
      if (signal?.aborted) throw signal.reason;
      if (attempt >= attempts || !shouldRetry(error, attempt)) {
        throw error;
      }
      const waitMs = typeof delay === 'function' ? delay(attempt, error) : delay;
      // eslint-disable-next-line no-await-in-loop
      await wait(waitMs, undefined, { signal });
    }
  }
}

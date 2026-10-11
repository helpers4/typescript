/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

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
}

/**
 * Retries a promise-returning function until it succeeds or runs out of attempts, then rejects
 * with the last error.
 *
 * Takes either `(fn, maxAttempts, delayMs)` for a fixed delay between attempts, or
 * `(fn, options)` to only retry some errors or to make the delay grow between attempts — see
 * {@link RetryOptions}.
 *
 * @param fn - The function to retry
 * @param maxAttemptsOrOptions - Maximum number of attempts (default `3`), or a {@link RetryOptions} object
 * @param delayMs - Delay between attempts in milliseconds (default `1000`), when `maxAttemptsOrOptions` is a number
 * @returns Promise that resolves with the result or rejects with the last error
 * @example
 * await retry(() => fetchData(), 3, 500)
 * @example
 * // Exponential backoff: 500 ms, 1 s, 2 s
 * await retry(() => fetchData(), { attempts: 4, delayMs: (attempt) => 500 * 2 ** (attempt - 1) })
 * @example
 * // Only retry transient errors, rethrow anything else at once
 * await retry(() => createIndex(), { shouldRetry: (error) => /already exists/i.test(String(error)) })
 * @since 1.9.0
 */
export async function retry<T>(fn: () => Promise<T>, maxAttempts?: number, delayMs?: number): Promise<T>;
export async function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T>;
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttemptsOrOptions: number | RetryOptions = 3,
  delayMs: number = 1000
): Promise<T> {
  const {
    attempts = 3,
    delayMs: delay = 1000,
    shouldRetry = () => true,
  }: RetryOptions = typeof maxAttemptsOrOptions === 'number'
    ? { attempts: maxAttemptsOrOptions, delayMs }
    : maxAttemptsOrOptions;

  for (let attempt = 1; ; attempt++) {
    try {
      // Sequential on purpose: each attempt only runs once the previous one has failed.
      // eslint-disable-next-line no-await-in-loop
      return await fn();
    } catch (error) {
      if (attempt >= attempts || !shouldRetry(error, attempt)) {
        throw error;
      }
      const waitMs = typeof delay === 'function' ? delay(attempt, error) : delay;
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, waitMs));
    }
  }
}
